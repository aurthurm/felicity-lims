<script setup lang="ts">
import {  computed, onMounted, reactive, ref } from "vue";
import type { PropType } from 'vue'
import {
  AnalysisResultType,
  SampleType,
} from "@/types/gql";
import useApiUtil from '@/composables/api_util';
import useAnalysisComposable from "@/composables/analysis";
import { GetAbxOrganismAllDocument, GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables, GetAbxOrganismResultAllDocument, GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AbxOrganismType, AbxOrganismResultType } from "@/types/gql";
import { AbxOrganismCursorPage } from "@/graphql/schema";
import { AddAbxOrganismResultMutation, AddAbxOrganismResultMutationVariables, AddAbxOrganismResultDocument, DeleteAbxOrganismResultMutation, DeleteAbxOrganismResultMutationVariables, DeleteAbxOrganismResultDocument, SaveAbxOrganismResultMutation, SaveAbxOrganismResultMutationVariables, SaveAbxOrganismResultDocument } from "@/graphql/operations/microbiology.mutations";

const { withClientMutation, withClientQuery } = useApiUtil()
const organismResults = ref<AbxOrganismResultType[]>([]);

const showModal = ref<boolean>(false);
const searchOrgText = ref<string>('');
const organisms = ref<AbxOrganismType[]>([]);
const pickIndex = ref<number | undefined>(undefined);
const addingOrganism = ref<boolean>(false);

const {
  sample,
  analysisResults
} = defineProps({
  sample: {
    type: Object as PropType<SampleType>,
    required: true,
  },
  analysisResults: {
    type: Object as PropType<AnalysisResultType[]>,
    required: true,
  }
});

const analysisResult = computed(() => analysisResults[0]);

onMounted(() => {
  withClientQuery<GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables>(
    GetAbxOrganismResultAllDocument, { analysisResultUid: analysisResult.value.uid! }, "abxOrganismResultAll"
  ).then((result) => {
    if (result) {
      organismResults.value = (result as unknown || []) as AbxOrganismResultType[];
    }
  }).finally(() => resetAnalysesPermissions());
});

function addOrganism(){
  addingOrganism.value = true;
  withClientMutation<AddAbxOrganismResultMutation, AddAbxOrganismResultMutationVariables>(
      AddAbxOrganismResultDocument, { analysisResultUid: analysisResult.value.uid! }, "createAbxOrganismResult"
    ).then((result) => {
      if (result) {
        organismResults.value.unshift(result as unknown as AbxOrganismResultType);
      }
    }).finally(() => (addingOrganism.value = false));
}

function saveOrgResult(orgResult: AbxOrganismResultType) { 
  addingOrganism.value = true;
  withClientMutation<SaveAbxOrganismResultMutation, SaveAbxOrganismResultMutationVariables>(
      SaveAbxOrganismResultDocument, 
      { uid: orgResult.uid!, organismUid: orgResult.organism.uid }, 
      "saveAbxOrganismResult"
    ).then((result) => {
      if (result) {
        const idx = organismResults.value.findIndex(or => or.uid === orgResult.uid);
        if (idx > -1) {
          const organism = (result as unknown as AbxOrganismResultType).organism;
          organismResults.value[idx].organismUid = organism?.uid;
          organismResults.value[idx].organism = organism;
        }
      }
      
    }).finally(() => {
      addingOrganism.value = false
      resetAnalysesPermissions()
    });
}

function removeOrgResult(orgResult: AbxOrganismResultType) {
  addingOrganism.value = true;
  withClientMutation<DeleteAbxOrganismResultMutation, DeleteAbxOrganismResultMutationVariables>(
      DeleteAbxOrganismResultDocument, { uid: orgResult.uid! }, "removeAbxOrganismResult"
    ).then((result) => {
      if (result) {
        const idx = organismResults.value.findIndex((r) => r.uid === result?.uid);
        if (idx > -1) {
          organismResults.value.splice(idx, 1);
        }
      }
    }).finally(() => {
      addingOrganism.value = false
      resetAnalysesPermissions()
    });
}

function pickOrganism(index: number) {  
  pickIndex.value = index;
  showModal.value = true;
}

function selectOrganism(org: AbxOrganismType) {  
  showModal.value = false;
  organismResults.value[pickIndex.value!].organism = org;
  pickIndex.value = undefined;
  //
  analysisResults[0].result = organismResults.value?.map(r => r.organism?.name).join(', ');
}

function searchOrganisms() {
  if(searchOrgText.value.length < 3) return;
  withClientQuery<GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables>(
      GetAbxOrganismAllDocument, {
        text: searchOrgText.value,
        pageSize: 25,
        sortBy: ["name"],
      }, "abxOrganismAll"
  ).then((result) => {
    organisms.value = (result as AbxOrganismCursorPage)?.items as AbxOrganismType[];
  })
}

// submit and verify
const state = reactive({
  can_submit: false,
  can_approve: false,
}); 

function resetAnalysesPermissions(): void {
  // reset
  state.can_submit = false;
  state.can_approve = false;

  // can submit
  const allOrgsFinalized = organismResults.value?.every(or => or.organismUid != undefined);
  if (analysisResult.value.status == 'pending' && allOrgsFinalized) {
    state.can_submit = true;
  }

  // can approve
  if (analysisResult.value.status == 'resulted') {
    state.can_approve = true;
  }
}

let {
  submitResults: submitter_,
  approveResults: approver_,
} = useAnalysisComposable();

const submitResults = () =>
  submitter_([
  { 
    uid: analysisResult.value.uid, 
    result: analysisResult.value.result,
    methodUid: "felicity_ast", 
    laboratoryInstrumentUid: "felicity_ast" 
  }
  ], "sample", sample?.uid!)
    .then(() => {});

const approveResults = () =>
  approver_([analysisResult.value.uid!], "sample", sample?.uid!)
    .then(() => {});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-background rounded-lg shadow-sm">
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-foreground">Organisms</h3>
          <fel-button 
            v-if="analysisResult.status == 'pending'"
            @click="addOrganism()"
            :disabled="addingOrganism"
            :color="'primary'"
          >
            Add Organism
          </fel-button>
        </div>

        <div class="border-t border-border" />

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-2 text-left text-sm font-medium text-foreground">Isolate Number</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-foreground">Organism Name</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(orgResult, idx) in organismResults" 
                :key="orgResult?.uid"
                class="border-b border-border hover:bg-muted/50 transition-colors duration-200"
              >
                <td class="px-4 py-2">
                  <span class="text-sm text-foreground">#{{ orgResult?.isolateNumber }}</span>
                </td>
                <td class="px-4 py-2">
                  <span 
                    v-if="orgResult?.organism"
                    class="text-sm text-primary"
                  >
                    {{ orgResult?.organism?.name }}
                  </span>
                  <fel-button 
                    v-else
                    @click="pickOrganism(idx)"
                    :color="'outline'"
                  >
                    Pick Organism
                  </fel-button>
                </td>
                <td class="px-4 py-2 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <template v-if="orgResult?.organism && !orgResult?.organismUid">
                      <fel-button 
                        @click="pickOrganism(idx)"
                        :color="'destructive'"
                      >
                        Change
                      </fel-button>
                      <fel-button 
                        @click="saveOrgResult(orgResult)"
                        :color="'primary'"
                      >
                        Save
                      </fel-button>
                    </template>
                    <fel-button 
                      v-if="analysisResult.status == 'pending' && organismResults.length > 1"
                      @click="removeOrgResult(orgResult)"
                      :color="'destructive'"
                    >
                      Delete
                    </fel-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-background rounded-lg shadow-sm p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-foreground">Culture</h4>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground"
        >
          {{ analysisResult.status }}
        </span>
      </div>

      <div class="border-t border-border" />

      <div class="space-y-4">
        <textarea 
          v-if="analysisResult.status == 'pending'"
          v-model="analysisResult.result"
          rows="4"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter culture results..."
        ></textarea>
        <p v-else class="text-sm text-muted-foreground">{{ analysisResult.result }}</p>

        <div class="flex justify-end space-x-4">
          <fel-button 
            v-if="state.can_submit"
            @click="submitResults"
            :color="'primary'"
          >
            Submit Results
          </fel-button>
          <fel-button 
            v-if="state.can_approve"
            @click="approveResults"
            :color="'primary'"
          >
            Approve Results
          </fel-button>
        </div>
      </div>
    </div>

    <fel-modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
        <h3 class="text-xl font-semibold text-foreground">Select Organism</h3>
      </template>
      
      <template v-slot:body>
        <div class="p-6 space-y-6">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              v-model="searchOrgText"
              @input="searchOrganisms"
              placeholder="Search organisms..."
              class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <button
              v-for="org in organisms"
              :key="org.uid"
              @click="selectOrganism(org)"
              class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
            >
              {{ org.name }}
            </button>
          </div>
        </div>
      </template>
    </fel-modal>
  </div>
</template>
