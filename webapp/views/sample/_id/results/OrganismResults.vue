<script setup lang="ts">
import {  computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import type { PropType } from 'vue'
import {
  IAnalysisResult,
  ISample,
} from "@/models/analysis";
import * as shield from "@/guards";
import useApiUtil from '@/composables/api_util';
import useAnalysisComposable from "@/composables/analysis";
import { GetAbxOrganismAllDocument, GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables, GetAbxOrganismResultAllDocument, GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { IAbxOrganism, IAbxOrganismResult } from "@/models/microbiology";
import { AbxOrganismCursorPage } from "@/graphql/schema";
import { AddAbxOrganismResultMutation, AddAbxOrganismResultMutationVariables, AddAbxOrganismResultDocument, DeleteAbxOrganismResultMutation, DeleteAbxOrganismResultMutationVariables, DeleteAbxOrganismResultDocument, SaveAbxOrganismResultMutation, SaveAbxOrganismResultMutationVariables, SaveAbxOrganismResultDocument } from "@/graphql/operations/microbiology.mutations";

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)
const FelButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)

const { withClientMutation, withClientQuery } = useApiUtil()
const organismResults = ref<IAbxOrganismResult[]>([]);

const showModal = ref<boolean>(false);
const searchOrgText = ref<string>('');
const organisms = ref<IAbxOrganism[]>([]);
const pickIndex = ref<number | undefined>(undefined);
const addingOrganism = ref<boolean>(false);

const {
  sample,
  analysisResults
} = defineProps({
  sample: {
    type: Object as PropType<ISample>,
    required: true,
  },
  analysisResults: {
    type: Object as PropType<IAnalysisResult[]>,
    required: true,
  }
});

const analysisResult = computed(() => analysisResults[0]);

onMounted(() => {
  withClientQuery<GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables>(
    GetAbxOrganismResultAllDocument, { analysisResultUid: analysisResult.value.uid! }, "abxOrganismResultAll"
  ).then((result) => {
    if (result) {
      organismResults.value = (result as unknown || []) as IAbxOrganismResult[];
    }
  }).finally(() => resetAnalysesPermissions());
});

function addOrganism(){
  addingOrganism.value = true;
  withClientMutation<AddAbxOrganismResultMutation, AddAbxOrganismResultMutationVariables>(
      AddAbxOrganismResultDocument, { analysisResultUid: analysisResult.value.uid! }, "createAbxOrganismResult"
    ).then((result) => {
      if (result) {
        organismResults.value.unshift(result as unknown as IAbxOrganismResult);
      }
    }).finally(() => (addingOrganism.value = false));
}

function saveOrgResult(orgResult: IAbxOrganismResult) { 
  addingOrganism.value = true;
  withClientMutation<SaveAbxOrganismResultMutation, SaveAbxOrganismResultMutationVariables>(
      SaveAbxOrganismResultDocument, 
      { uid: orgResult.uid!, organismUid: orgResult.organism.uid }, 
      "saveAbxOrganismResult"
    ).then((result) => {
      if (result) {
        const idx = organismResults.value.findIndex(or => or.uid === orgResult.uid);
        if (idx > -1) {
          const organism = (result as unknown as IAbxOrganismResult).organism;
          organismResults.value[idx].organismUid = organism?.uid;
          organismResults.value[idx].organism = organism;
        }
      }
      
    }).finally(() => {
      addingOrganism.value = false
      resetAnalysesPermissions()
    });
}

function removeOrgResult(orgResult: IAbxOrganismResult) {
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

function selectOrganism(org: IAbxOrganism) {  
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
    organisms.value = (result as AbxOrganismCursorPage)?.items as IAbxOrganism[];
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
  <h3 class="flex justify-between items-center">
    <span class="font-bold">Organisms</span>
    <button @click="addOrganism()" v-if="analysisResult.status == 'pending'"
    class="ml-2 px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
    :disabled="addingOrganism">
      add organism
    </button>
  </h3>

  <hr class="mt-1" />

  <div class="overflow-x-auto mt-2">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Isolate Number</th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Organism Name</th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
        </thead>
        <tbody class="bg-background">
          <tr v-for="(orgResult, idx) in organismResults" :key="orgResult?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-foreground">#{{ orgResult?.isolateNumber }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div v-if="orgResult?.organism"
              class="text-sm leading-5 text-primary">{{ orgResult?.organism?.name }}</div>
              <button v-else
                class="px-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                @click="pickOrganism(idx)">
                pick organism
              </button>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <span v-if="orgResult?.organism && !orgResult?.organismUid">
                <button 
                class="px-2 py-1 border-destructive border text-destructive rounded-sm transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none"
                @click="pickOrganism(idx)">
                  change
                </button>
                <button
                class="ml-2 px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                @click="saveOrgResult(orgResult)">
                  save
                </button>
              </span>
              <span v-if="analysisResult.status == 'pending' && organismResults.length > 1">
                <button 
                class="px-2 py-1 border-destructive border text-destructive rounded-sm transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none"
                @click="removeOrgResult(orgResult)">
                  delete
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="mt-4">
    <div class="flex justify-start items-center">
      <h4 class="font-semibold text-l flex-1 mb-2">Culture</h4>
      <button type="button" class="bg-primary text-primary-foreground ml-4 px-2 py-1 rounded-sm leading-none">
        {{ analysisResult.status }}
      </button>
    </div>
    <hr>
    <textarea 
    v-if="analysisResult.status == 'pending'"
    name="culture" 
    id="culture" 
    class="mt-2 p-2 w-full" 
    rows="2"
    v-model="analysisResult.result"></textarea>
    <p v-else class="py-2 w-full leading italic bg-background p-2">{{ analysisResult.result }}</p>
  </div>

  <div class="mt-2">
    <!-- Submit and Verify Section -->
    <FelButton 
    v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_submit && sample.status != 'submitting'" 
    key="submit" 
    @click.prevent="submitResults" :color="'orange-600'">Submit culture</FelButton>

    <FelButton 
    v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_approve && sample.status != 'approving'" 
    key="approve" 
    @click.prevent="approveResults" :color="'orange-600'">Approve culture</FelButton>
  </div>

  <!-- Panel Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3>Search Organism</h3>
    </template>

    <template v-slot:body>
      <form class="">
        <div class="w-full">
          <label class="block mb-4">
            <input
                v-model="searchOrgText"
                @input="searchOrganisms"
                class="form-input mt-1 block w-full"
                placeholder="Search organisms..."
            />
          </label>
          <div class="border p-2 h-64 overflow-y-auto">
              <table class="w-full">
                <tr v-for="org in organisms" :key="org.uid">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                    <div class="text-sm leading-5 text-foreground">{{ org.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                    <button 
                    @click="selectOrganism(org)"
                    class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
                      pick
                    </button>
                  </td>
                </tr>
              </table>
          </div>
        </div>
      </form>
    </template>
  </modal>
</template>
