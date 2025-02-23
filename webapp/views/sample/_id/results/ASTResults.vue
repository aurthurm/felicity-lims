<script setup lang="ts">
import { useSampleStore } from "@/stores/sample";
import { computed, defineAsyncComponent, ref, onMounted, watch } from "vue";
import type { PropType } from 'vue'
import Swal from 'sweetalert2';

import {IAnalysisResult,ISample} from "@/models/analysis";
import useApiUtil from '@/composables/api_util';
import useAnalysisComposable from "@/composables/analysis";

import * as shield from "@/guards";
import { GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables, GetAbxOrganismResultAllDocument, GetAbxAstPanelFilterDocument, GetAbxAstPanelFilterQuery, GetAbxAstPanelFilterQueryVariables, GetAbxAstResultAllDocument, GetAbxAstResultAllQuery, GetAbxAstResultAllQueryVariables, GetAbxGuidelineYearAllDocument, GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables, GetAbxTestMethodAllDocument, GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { IAbxASTPanel, IAbxASTResult, IAbxGuidelineYear, IAbxOrganismResult, IAbxTestMethod } from "@/models/microbiology";
import { ApplyAbxAstPanelDocument, ApplyAbxAstPanelMutation, ApplyAbxAstPanelMutationVariables, UpdateAbxAstResultsDocument, UpdateAbxAstResultsMutation, UpdateAbxAstResultsMutationVariables } from "@/graphql/operations/microbiology.mutations";

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)
const FelButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)

const {
  sample,
  astAnalysisResults,
  organismAnalysisResults,
} = defineProps({
  sample: {
    type: Object as PropType<ISample>,
    required: true,
  },
  astAnalysisResults: { // ASTResults
    type: Object as PropType<IAnalysisResult[]>,
    required: true,
  },
  organismAnalysisResults: { // OrganismResults
    type: Object as PropType<IAnalysisResult[]>,
    required: true,
  },
});

const sampleStore = useSampleStore();

const { withClientMutation, withClientQuery } = useApiUtil()
const organismResult = computed(() => organismAnalysisResults[0]);
const astResults = ref<IAbxASTResult[]>([]);
const pickedOrganisms = ref<IAbxOrganismResult[]>([]);
const guidelines = ref<IAbxGuidelineYear[]>([]);
const testMethods = ref<IAbxTestMethod[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables>(
    GetAbxOrganismResultAllDocument, { analysisResultUid: organismResult.value.uid! }, "abxOrganismResultAll"
  ).then((result) => {
    if (result) {
      pickedOrganisms.value = (result as unknown || []) as IAbxOrganismResult[];
    }
  }).finally(() => processASTResults())

  withClientQuery<GetAbxAstResultAllQuery, GetAbxAstResultAllQueryVariables>(
    GetAbxAstResultAllDocument, { sampleUid: sample.uid! }, "abxAstResultAll"
  ).then((result) => {
    if (result) {
      astResults.value = (result as unknown || []) as IAbxASTResult[];
    }
  }).finally(() => processASTResults())

  withClientQuery<GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables>(
    GetAbxGuidelineYearAllDocument, {}, "abxGuidelineYearAll"
  ).then((result) => {
    if (result) {
      guidelines.value = (result as unknown || []) as IAbxGuidelineYear[];
    }
  })

  withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
    GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
  ).then((result) => {
    if (result) {
      testMethods.value = (result as unknown || []) as IAbxTestMethod[];
    }
  })
});

const showModal = ref<boolean>(false);
const loadingPanels = ref(false);
const searchPanelText = ref<string>('');
const panels = ref<IAbxASTPanel[]>([]);
const choiceOrganism = ref<IAbxOrganismResult>();

function choosePanel(pickedOrg: IAbxOrganismResult) {
  choiceOrganism.value = pickedOrg;
  showModal.value = true;
}

function canAddPanel(pickedOrg: IAbxOrganismResult) {
  const orgResults = organismResults.value[pickedOrg.uid];
  return Object.values(orgResults).every(ast => ast.analResulState == "pending");
}

function searchPanels() {
  loadingPanels.value = true;
  withClientQuery<GetAbxAstPanelFilterQuery, GetAbxAstPanelFilterQueryVariables>(
    GetAbxAstPanelFilterDocument, 
    { organismUid: choiceOrganism.value?.uid!, text: searchPanelText.value }, 
    "abxAstPanelFilter"
  ).then((result) => {
    if (result) {
      panels.value = (result as unknown || []) as IAbxASTPanel[];
    }
  }).finally(() => {
    loadingPanels.value = false;
  });
}

function applyPanel(panel){
  showModal.value = false;
  Swal.fire({
      title: 'Are you sure?',
      text: 'You want to apply panel: ' + panel.name + ' to organism: ' + choiceOrganism.value?.organism?.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, apply now!',
      cancelButtonText: 'No, do not apply!',
  }).then(async result => {
      if (result.isConfirmed) {
          withClientMutation<ApplyAbxAstPanelMutation, ApplyAbxAstPanelMutationVariables>(
            ApplyAbxAstPanelDocument, { payload: {
              organismResultUid: choiceOrganism.value?.uid!, 
              panelUid: panel.uid, 
              sampleUid: sample.uid!,
            } }, 'applyAbxAstPanel'
          ).then(resp => {
            if (resp) {
              // location.reload();
              sampleStore.fetchAnalysisResultsForSample(sample.uid)
            }
          });
      }
  });
}

// Antibiotic table cells data management
interface ASTData {
  uid: string;
  analResultUid: string;
  guidelineYearUid?: string;
  astMethodUid?: string;
  breakpointUid?: string;
  astValue?: string;
  result?: string;
  analResulState: string;
  reportable?: boolean;
  dirty: boolean;
}

type OrganismASTResults = Record<string, Record<string, ASTData>>;

const organismResults = ref<OrganismASTResults>({});

// Process initial data
function processASTResults() {
  const results: OrganismASTResults = {};
  
  pickedOrganisms.value.forEach(organism => {
    // Initialize object for this organism
    results[organism.uid] = {};
    
    // Get all AST results for this organism
    const orgASTResults = astResults.value.filter(ast => 
      ast.organismResultUid === organism.uid
    );
    
    // Organize by antibiotic name
    orgASTResults.forEach(ast => {
      const analResult = astAnalysisResults.find(a => a.uid === ast.analysisResultUid);
      if (ast.antibiotic?.name && analResult?.uid) {
        results[organism.uid][ast.antibiotic.name + " " + ast.antibiotic.potency] = {
          uid: ast.uid,
          analResultUid: analResult.uid,
          analResulState: analResult.status!,
          astMethodUid: ast.astMethodUid,
          guidelineYearUid: ast.guidelineYearUid,
          breakpointUid: ast.breakpointUid,
          astValue: ast.astValue,
          result: analResult.result,
          reportable: analResult.reportable,
          dirty: false // mark as clean initially
        };
      }
    });
  });
  organismResults.value = results;
}

// Call processASTResults whenever initial data changes
watch([pickedOrganisms, astResults], () => {
  processASTResults();
});

// Get antibiotics list for an organism
const getAntibiotics = (organismUid: string) => {
  return Object.keys(organismResults.value[organismUid] || {});
};

let {
  submitResults: submitter_,
  approveResults: approver_,
} = useAnalysisComposable();

// save 
function canSave(organismUid: string) {
  const orgResults = organismResults.value[organismUid]
  const is_any_dirty = Object.values(orgResults).some(ast => ast.dirty && ast.analResulState == "pending");
    const has_all_fields_filled = Object.values(orgResults).some(
      ast => ast.guidelineYearUid && ast.astMethodUid && ast.astValue
    );
    return is_any_dirty && has_all_fields_filled;
}

function getSavable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const dirty = Object.values(orgResults).filter(ast => ast.dirty && ast.analResulState == "pending");
  const complete = dirty
    .filter(ast => ast.guidelineYearUid && ast.astMethodUid && ast.astValue)
    .map(({ dirty, breakpointUid, analResultUid, analResulState, ...rest }) => rest);
  return complete;
}

function saveAntibiotics(organismUid: string) {
  const results = getSavable(organismUid) as any;
  withClientMutation<UpdateAbxAstResultsMutation, UpdateAbxAstResultsMutationVariables>(
    UpdateAbxAstResultsDocument, { payload: { results } }, 'updateAbxAstResults'
  ).then(resp => {
    if (resp) {
      // location.reload();
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
    }
  });
}

// submit
function canSubmit(organismUid: string) {
  const orgResults = organismResults.value[organismUid]
  const is_any_dirty = Object.values(orgResults).some(ast => ast.dirty);
    const has_all_fields_filled = Object.values(orgResults).some(
      ast => ast.guidelineYearUid && 
      ast.astMethodUid && 
      ast.astValue && 
      ast.result && 
      ast.analResulState == "pending"
    );
    return !is_any_dirty && has_all_fields_filled;
}

function getSubmittable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const not_dirty = Object.values(orgResults).filter(ast => !ast.dirty);
  const complete = not_dirty
    .filter(ast => ast.guidelineYearUid && 
    ast.astMethodUid && 
    ast.astValue && 
    ast.result && 
    ast.analResulState == "pending")
    .map(({ dirty, breakpointUid, ...rest }) => rest);
  return complete;
}

function submitAntibiotics(organismUid: string) {
  const results = getSubmittable(organismUid) as ASTData[];
  const _prepared = results.map(r => ({
    uid: r.analResultUid,
    result: r.result,
    reportable: r.reportable,
    methodUid: "felicity_ast", 
    laboratoryInstrumentUid: "felicity_ast" 
  }))
  submitter_(_prepared, "sample", sample?.uid!).then(() => {
      // location.reload();
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
  });
}

// approve
function canApprove(organismUid: string) {
  const orgResults = organismResults.value[organismUid]
  const is_any_dirty = Object.values(orgResults).some(ast => ast.dirty);
    const some_resulted = Object.values(orgResults).some(
      ast => ast.analResulState == "resulted"
    );
    return !is_any_dirty && some_resulted;
}

function getApprovable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const not_dirty = Object.values(orgResults).filter(ast => !ast.dirty);
  return not_dirty.filter(ast => ast.analResulState == "resulted")
}

function approveAntibiotics(organismUid: string) {
  const results = getApprovable(organismUid) as ASTData[];
  const _prepared = results.map(r => r.analResultUid)
  approver_(_prepared, "sample", sample?.uid!).then(() => {
      // location.reload();
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
  });
}

// Handle cell edit
async function handleCellEdit(organismUid: string, antibiotic: string, field: string, value: any) {
  const astData = organismResults.value[organismUid][antibiotic];
  // mark dirty
  organismResults.value[organismUid][antibiotic].dirty = true;
  organismResults.value[organismUid][antibiotic] = {
      ...(organismResults.value[organismUid][antibiotic]) as ASTData,
      [field]: value
  };
}
</script>

<template>
  <h3 class="flex justify-between items-center">
    <span class="font-bold">AST Panel</span>
  </h3>

  <hr class="mt-1" />
  <div v-for="pickedOrg in pickedOrganisms" :key="pickedOrg.uid" class="mb-4">
    <h3 class="flex justify-between items-center">
      <span>
        <span class="font-bold">Organism #{{ pickedOrg?.isolateNumber }}</span>: 
        <span class="italic">{{ pickedOrg?.organism?.name }}</span>
      </span>
      <button @click="choosePanel(pickedOrg)" v-show="canAddPanel(pickedOrg)"
        class="ml-2 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
        choose panel
      </button>
    </h3>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
            <th v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
              {{ antibiotic }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Guideline year -->
          <tr>
            <td class="px-4 py-2 text-sm font-medium text-gray-900">Guideline</td>
            <td v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-sm text-gray-500">
              <select 
                v-model="organismResults[pickedOrg.uid][antibiotic].guidelineYearUid"
                @change="handleCellEdit(pickedOrg.uid, antibiotic, 'guidelineYearUid', $event.target.value)"
                class="w-32 px-2 py-1 border rounded"
                :disabled="organismResults[pickedOrg.uid][antibiotic].analResulState !== 'pending'"
              >
                <option v-for="gly in guidelines" :key="gly.uid" :value="gly.uid">{{ gly.code }}</option>
              </select>
            </td>
          </tr>
          <!-- AST Method -->
          <tr>
            <td class="px-4 py-2 text-sm font-medium text-gray-900">AST Method</td>
            <td v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-sm text-gray-500">
              <select 
                v-model="organismResults[pickedOrg.uid][antibiotic].astMethodUid"
                @change="handleCellEdit(pickedOrg.uid, antibiotic, 'astMethodUid', $event.target.value)"
                class="w-32 px-2 py-1 border rounded"
                :disabled="organismResults[pickedOrg.uid][antibiotic].analResulState !== 'pending'"
              >
                <option v-for="tm in testMethods" :key="tm.uid" :value="tm.uid">{{ tm.name }}</option>
              </select>
            </td>
          </tr>
          
          <!-- AST Value -->
          <tr>
            <td class="px-4 py-2 text-sm font-medium text-gray-900">AST Value</td>
            <td v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-sm text-gray-500">
              <input 
                type="number"
                v-model="organismResults[pickedOrg.uid][antibiotic].astValue"
                @change="handleCellEdit(pickedOrg.uid, antibiotic, 'astValue', $event.target.value)"
                class="w-32 px-2 py-1 border rounded"
                step="0.1"
                :disabled="organismResults[pickedOrg.uid][antibiotic].analResulState !== 'pending'"
              />
              <span class="ml-2 text-xs text-gray-400">
                {{ organismResults[pickedOrg.uid][antibiotic].astValue === 'mic' ? 'mg/L' : 'mm' }}
              </span>
            </td>
          </tr>

          <!-- Result -->
          <tr>
            <td class="px-4 py-2 text-sm font-medium text-gray-900">Result</td>
            <td v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-sm">
              <select 
                v-model="organismResults[pickedOrg.uid][antibiotic].result"
                @change="handleCellEdit(pickedOrg.uid, antibiotic, 'result', $event.target.value)"
                class="w-32 px-2 py-1 border rounded"
                :class="{
                  'text-green-600': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'S',
                  'text-yellow-600': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'I',
                  'text-red-600': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'R'
                }"
                :disabled="organismResults[pickedOrg.uid][antibiotic].analResulState !== 'pending'">
                <option value="S">S</option>
                <option value="I">I</option>
                <option value="R">R</option>
              </select>
            </td>
          </tr>

          <!-- Reportable -->
          <tr>
            <td class="px-4 py-2 text-sm font-medium text-gray-900">Reportable</td>
            <td v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                :key="antibiotic"
                class="px-4 py-2 text-sm">
              <input 
                type="checkbox"
                v-model="organismResults[pickedOrg.uid][antibiotic].reportable"
                @change="handleCellEdit(pickedOrg.uid, antibiotic, 'reportable', $event.target.checked)"
                class="form-checkbox h-4 w-4 text-sky-600"
                :disabled="organismResults[pickedOrg.uid][antibiotic].analResulState !== 'pending'"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-2">
        <FelButton 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canSave(pickedOrg.uid)" 
        key="button" 
        @click.prevent="saveAntibiotics(pickedOrg.uid)" 
        :color="'orange-600'">Save Antibiotics</FelButton>

        <FelButton 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canSubmit(pickedOrg.uid)" 
        key="button" 
        @click.prevent="submitAntibiotics(pickedOrg.uid)" 
        :color="'orange-600'">Submit Antibiotics</FelButton>

        <FelButton 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canApprove(pickedOrg.uid)" 
        key="button" 
        @click.prevent="approveAntibiotics(pickedOrg.uid)" 
        :color="'orange-600'">Approve Antibiotics</FelButton>
      </div>

    </div>
  </div>

  <!-- Panel Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3>Search Panel for <span class="italic font-semibold">{{ choiceOrganism?.organism?.name }}</span></h3>
    </template>

    <template v-slot:body>
      <form class="" @submit.prevent="{}">
        <div class="w-full">
          <label class="block mb-4">
            <input
                v-model="searchPanelText"
                @input="searchPanels"
                class="form-input mt-1 block w-full"
                placeholder="Begin typing..."
            />
          </label>
          <div class="border p-2 h-64 overflow-y-auto">
              <table class="w-full">
                <tr v-for="panel in panels" :key="panel.uid">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-gray-800 font-bold">{{ panel.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-gray-800">{{ panel.antibiotics?.map(a => a.name)?.join(", ") }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button type="button"
                    @click="applyPanel(panel)"
                    class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
                      Appy Panel
                    </button>
                  </td>
                </tr>
                <tr v-if="loadingPanels">
                  <td colspan="3" class="px-4 py-3 text-center text-sm text-gray-500">
                    Loading panels...
                  </td>
                </tr>
                <tr v-if="!loadingPanels && panels.length === 0">
                  <td colspan="3" class="px-4 py-3 text-center text-sm text-gray-500">
                    No panels found
                  </td>
                </tr>
              </table>
          </div>
        </div>
      </form>
    </template>
  </modal>
</template>
