<script setup lang="ts">
import Swal from "sweetalert2";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import useApiUtil  from "@/composables/api_util";
import { useAnalysisStore} from "@/stores/analysis";
import { useSampleStore } from "@/stores/sample";
import {
  EditSampleApplyTemplateDocument, EditSampleApplyTemplateMutation, EditSampleApplyTemplateMutationVariables, SampleManageAnalysisDocument, SampleManageAnalysisMutation, SampleManageAnalysisMutationVariables
} from "@/graphql/operations/analyses.mutations";
const accordion = defineAsyncComponent(
    () => import('@/components/ui/FelAccordion.vue')
  )
const { withClientMutation } = useApiUtil();
const route = useRoute();
const analysisStore = useAnalysisStore()
const sampleStore = useSampleStore();
const analysesServices = computed(() => analysisStore.getAnalysesServices)

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
    Swal.fire({
      title: "Are you sure?",
      text: "You want to apply this template to add analyses?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, apply now!",
      cancelButtonText: "No, cancel apply!",
    }).then((result) => {
      if (result.isConfirmed) {
        withClientMutation<EditSampleApplyTemplateMutation, EditSampleApplyTemplateMutationVariables>(EditSampleApplyTemplateDocument,
          { uid: route.params.sampleUid, analysisTemplateUid: templateUid.value },
          "samplesApplyTemplate"
        ).then((result) => changeTab("analysis-results"));
      }
    });
  } catch (error) {}
};

// Manually Modify Analyses
const selectedAnalyses = ref<string[]>([]);
onMounted(() => {
  selectedAnalyses.value = [...sampleStore.analysisResults?.map((result) => result.analysisUid!)];
});

const selectAnalysis = (uid: string) => {
  if (selectedAnalyses.value.includes(uid)) {
    selectedAnalyses.value = selectedAnalyses.value.filter((id) => id !== uid);
  } else {
    selectedAnalyses.value = [...selectedAnalyses.value, uid];
  }
};

const isSelectedAnalysis = (uid: string) => selectedAnalyses.value.includes(uid);
const isSelectedCategory = (analyses) => analyses.every((analysis) => isSelectedAnalysis(analysis.uid));

const selectCategory = (analyses) => {
  if(analyses.every((analysis) => isSelectedAnalysis(analysis.uid))) {
    analyses.forEach((analysis) => selectAnalysis(analysis.uid))
  } else {
    analyses.forEach((analysis) => {
      if(!isSelectedAnalysis(analysis.uid)) {
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
    Swal.fire({
      title: "Are you sure?",
      text: "You want to apply these changes to the analyses?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, apply now!",
      cancelButtonText: "No, cancel apply!",
    }).then((result) => {
      if (result.isConfirmed) {
        withClientMutation<SampleManageAnalysisMutation, SampleManageAnalysisMutationVariables>(SampleManageAnalysisDocument,
          { sampleUid: route.params.sampleUid, payload: { cancel, add} },
          "manageAnalyses"
        ).then((result) => changeTab("analysis-results"));
      }
    });
  } catch (error) {}
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
            @click.prevent="applyTemplate()"
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

        <div class="max-h-[540px] overflow-y-auto rounded-md border border-border">
          <div class="w-full">
            <accordion v-for="(category, idx) in analysesServices" :key="idx">
              <template v-slot:title>{{ category[0] }}</template>
              <template v-slot:body>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-border bg-muted/50">
                        <th class="px-4 py-2 text-left">
                          <input 
                            type="checkbox" 
                            :checked="isSelectedCategory(category[1])" 
                            @change="selectCategory(category[1])"
                            class="rounded border-input"
                          />
                        </th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-foreground">Analysis</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-foreground">Keyword</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="service in category[1]" 
                        :key="service?.uid" 
                        v-motion-slide-right
                        class="border-b border-border hover:bg-muted/50 transition-colors duration-200"
                      >
                        <td class="px-4 py-2">
                          <input 
                            type="checkbox" 
                            :checked="isSelectedAnalysis(service?.uid)" 
                            @change="selectAnalysis(service?.uid)"
                            class="rounded border-input"
                          />
                        </td>
                        <td class="px-4 py-2 text-sm text-foreground">{{ service?.name }}</td>
                        <td class="px-4 py-2 text-sm text-muted-foreground">{{ service?.keyword }}</td>
                        <td class="px-4 py-2 text-sm text-muted-foreground">{{ service?.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </accordion>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            type="button"
            @click.prevent="applyChanges()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
