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
  <section>
    <hr />
    <form action="post" class="mt-4" v-motion-slide-right>
      <div class="flex justify-start items-center mr-4">
        <span class="text-gray-700">Analyses Template (Auto)</span>
        <label class="block mx-4">
          <select class="form-select block w-full py-1" v-model="templateUid">
            <option></option>
            <option
              v-for="template in analysisStore.analysesTemplates"
              :key="template.uid"
              :value="template.uid"
            >
              {{ template.name }}
            </option>
          </select>
        </label>
        <button
          type="button"
          @click.prevent="applyTemplate()"
          class="border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Apply Template
        </button>
      </div>
    </form>
  </section>

  <hr class="mt-4 mb-2" />
  <h3 class="font-bold">Manually Modify Analyses: ({{ selectedAnalyses?.length }})</h3>
  <hr class="mb-4 mt-2" />

  <section class="col-span-2 overflow-y-scroll overscroll-contain max-h-[540px] bg-white">
    <div class="w-full">
        <accordion v-for="(category, idx) in analysesServices" :key="idx">
          <template v-slot:title>{{ category[0] }}</template>
          <template v-slot:body>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                    <input type="checkbox" class="" :checked="isSelectedCategory(category[1])" @change="selectCategory(category[1])"/>
                  </th>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">Analysis</th>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">Keyword</th>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="service in category[1]" :key="service?.uid" v-motion-slide-right>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-200">
                    <input type="checkbox" class="border-red-500" :checked="isSelectedAnalysis(service?.uid)" @change="selectAnalysis(service?.uid)" />
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-200">{{ service?.name }}</td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-200">{{ service?.keyword }}</td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-200">{{ service?.description }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </accordion>
        <hr>
        <button
          type="button"
          @click.prevent="applyChanges()"
          class="border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Apply Changes
        </button>
    </div>
  </section>
</template>
