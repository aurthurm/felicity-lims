<script setup lang="ts">
import Swal from "sweetalert2";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useApiUtil, useSampleComposable } from "../../../composables";
import { useAnalysisStore } from "../../../stores";
import {
  EDIT_SAMPLE_APPLY_TEMPLATE,
  SAMPLE_MANAGE_ANALYSIS,
} from "../../../graphql/operations/analyses.mutations";

const LoadingMessage = defineAsyncComponent(
  () => import("../../../components/Spinners/LoadingMessage.vue")
)
const { withClientMutation } = useApiUtil();
const route = useRoute();
const analysisStore = useAnalysisStore()

onMounted(() => analysisStore.fetchAnalysesTemplates())

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
        withClientMutation(
          EDIT_SAMPLE_APPLY_TEMPLATE,
          { uid: route.params.sampleUid, analysisTemplateUid: templateUid.value },
          "samplesApplyTemplate"
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
        <span class="text-gray-700">Analyses Template</span>
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
  <h3 class="font-bold">Modify Analyses</h3>
  <hr class="mb-4 mt-2" />

</template>
