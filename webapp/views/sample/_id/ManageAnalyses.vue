<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import useApiUtil  from "@/composables/api_util";
import { useAnalysisStore} from "@/stores/analysis";
import { useSampleStore } from "@/stores/sample";
import { useConfirmDialog } from "@/composables/confirm_dialog";
import {
  EditSampleApplyTemplateDocument, EditSampleApplyTemplateMutation, EditSampleApplyTemplateMutationVariables, SampleManageAnalysisDocument, SampleManageAnalysisMutation, SampleManageAnalysisMutationVariables
} from "@/graphql/operations/analyses.mutations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const { withClientMutation } = useApiUtil();
const route = useRoute();
const analysisStore = useAnalysisStore()
const sampleStore = useSampleStore();
const analysesServices = computed(() => analysisStore.getAnalysesServices)
const { confirm } = useConfirmDialog();

onMounted(() => {
  analysisStore.fetchAnalysesTemplates()
  analysisStore.fetchAnalysesServices({})
})

const emit = defineEmits(["changeTab"]);
const changeTab = (tab) => {
  emit('changeTab', tab)
}

const templateUid = ref<string>();

const applyTemplate = async () => {
  try {
    const confirmed = await confirm({
      title: "Are you sure?",
      description: "You want to apply this template to add analyses?",
      confirmText: "Yes, apply now!",
      cancelText: "No, cancel apply!",
      variant: "destructive",
    });
    if (!confirmed) return;
    await withClientMutation<EditSampleApplyTemplateMutation, EditSampleApplyTemplateMutationVariables>(
      EditSampleApplyTemplateDocument,
      { uid: route.params.sampleUid as string, analysisTemplateUid: templateUid.value as string },
      "samplesApplyTemplate"
    );
    changeTab("analysis-results");
  } catch {}
};

// Manually Modify Analyses
const selectedAnalyses = ref<string[]>([]);
onMounted(() => {
  selectedAnalyses.value = [...sampleStore.analysisResults?.map((result) => result.analysisUid!)];
});

const selectAnalysis = (uid: string, checked?: boolean) => {
  const hasUid = selectedAnalyses.value.includes(uid)
  if (checked === true && !hasUid) {
    selectedAnalyses.value = [...selectedAnalyses.value, uid]
    return
  }
  if (checked === false && hasUid) {
    selectedAnalyses.value = selectedAnalyses.value.filter((id) => id !== uid)
    return
  }
  if (checked === undefined) {
    selectedAnalyses.value = hasUid
      ? selectedAnalyses.value.filter((id) => id !== uid)
      : [...selectedAnalyses.value, uid]
  }
};

const isSelectedAnalysis = (uid: string) => selectedAnalyses.value.includes(uid);
const isSelectedCategory = (analyses) => analyses.every((analysis) => isSelectedAnalysis(analysis.uid));

const selectCategory = (analyses, checked?: boolean) => {
  if (checked === true) {
    analyses.forEach((analysis) => selectAnalysis(analysis.uid, true))
    return
  }
  if (checked === false) {
    analyses.forEach((analysis) => selectAnalysis(analysis.uid, false))
    return
  }
  if (analyses.every((analysis) => isSelectedAnalysis(analysis.uid))) {
    analyses.forEach((analysis) => selectAnalysis(analysis.uid))
  } else {
    analyses.forEach((analysis) => {
      if (!isSelectedAnalysis(analysis.uid)) {
        selectAnalysis(analysis.uid)
      }
    })
  }
};

const applyChanges = async () => {
  // cancel: results.analysisUid not in selectedAnalyses : must be uid of analysis
  const cancel = sampleStore.analysisResults?.filter((result) => !selectedAnalyses.value.includes(result.analysisUid!)).map((result) => result.uid!);
  // add: selectedAnalyses not in analysisResults
  const add = selectedAnalyses.value.filter((uid) => !sampleStore.analysisResults?.map((result) => result.analysisUid!).includes(uid));

  try {
    const confirmed = await confirm({
      title: "Are you sure?",
      description: "You want to apply these changes to the analyses?",
      confirmText: "Yes, apply now!",
      cancelText: "No, cancel apply!",
      variant: "destructive",
    });
    if (!confirmed) return;
    await withClientMutation<SampleManageAnalysisMutation, SampleManageAnalysisMutationVariables>(
      SampleManageAnalysisDocument,
      { sampleUid: route.params.sampleUid as string, payload: { cancel, add } },
      "manageAnalyses"
    );
    changeTab("analysis-results");
  } catch {}
};

</script>

<template>
  <div class="space-y-6">
    <section class="bg-background rounded-lg shadow-sm p-6 space-y-6">
      <form @submit.prevent class="space-y-4" v-motion-slide-right>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-foreground">Analyses Template (Auto)</span>
          <select 
            v-model="templateUid"
            class="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option></option>
            <option
              v-for="template in analysisStore.analysesTemplates"
              :key="template.uid"
              :value="template.uid"
            >
              {{ template.name }}
            </option>
          </select>
          <button
            type="button"
            @click="applyTemplate()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Apply Template
          </button>
        </div>
      </form>

      <div class="border-t border-border" />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-foreground">
            Manually Modify Analyses: ({{ selectedAnalyses?.length }})
          </h3>
        </div>

        <div class="border-t border-border" />

        <div class="max-h-[540px] overflow-y-auto border border-border bg-card rounded-lg shadow-md">
          <div class="w-full">
            <Accordion v-for="(category, idx) in analysesServices" :key="idx" type="single" collapsible>
              <AccordionItem :value="String(category[0])">
                <AccordionTrigger>{{ category[0] }}</AccordionTrigger>
                <AccordionContent>
                <div class="relative w-full overflow-auto">
                  <Table class="w-full caption-bottom text-sm">
                    <TableHeader class="[&_tr]:border-b">
                      <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <TableHead class="px-4 py-2 text-left">
                          <Checkbox 
                            :checked="isSelectedCategory(category[1])"
                            @update:checked="(value) => selectCategory(category[1], value)"
                          />
                        </TableHead>
                        <TableHead class="px-4 py-2 text-left text-sm font-medium text-foreground">Analysis</TableHead>
                        <TableHead class="px-4 py-2 text-left text-sm font-medium text-foreground">Keyword</TableHead>
                        <TableHead class="px-4 py-2 text-left text-sm font-medium text-foreground">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody class="[&_tr:last-child]:border-0">
                      <TableRow 
                        v-for="service in category[1]" 
                        :key="service?.uid" 
                        v-motion-slide-right
                        class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <TableCell class="px-4 py-2">
                          <Checkbox 
                            :checked="isSelectedAnalysis(service?.uid)"
                            @update:checked="(value) => selectAnalysis(service?.uid, value)"
                          />
                        </TableCell>
                        <TableCell class="px-4 py-2 text-sm text-foreground">{{ service?.name }}</TableCell>
                        <TableCell class="px-4 py-2 text-sm text-muted-foreground">{{ service?.keyword }}</TableCell>
                        <TableCell class="px-4 py-2 text-sm text-muted-foreground">{{ service?.description }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            type="button"
            @click="applyChanges()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
