<script setup lang="ts">
import { useSampleStore } from "@/stores/sample";
import { computed, defineAsyncComponent, ref, onMounted, watch } from "vue";
import type { PropType } from 'vue'
import Swal from 'sweetalert2';

import {AnalysisResultType,SampleType} from "@/types/gql";
import useApiUtil from '@/composables/api_util';
import useAnalysisComposable from "@/composables/analysis";

import * as shield from "@/guards";
import { GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables, GetAbxOrganismResultAllDocument, GetAbxAstPanelFilterDocument, GetAbxAstPanelFilterQuery, GetAbxAstPanelFilterQueryVariables, GetAbxAstResultAllDocument, GetAbxAstResultAllQuery, GetAbxAstResultAllQueryVariables, GetAbxGuidelineYearAllDocument, GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables, GetAbxTestMethodAllDocument, GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AbxASTPanelType, AbxASTResultType, AbxGuidelineYearType, AbxOrganismResultType, AbxTestMethodType } from "@/types/gql";
import { ApplyAbxAstPanelDocument, ApplyAbxAstPanelMutation, ApplyAbxAstPanelMutationVariables, UpdateAbxAstResultsDocument, UpdateAbxAstResultsMutation, UpdateAbxAstResultsMutationVariables } from "@/graphql/operations/microbiology.mutations";

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)
const fel-button = defineAsyncComponent(
  () => import("@/components/ui/buttons/fel-button.vue")
)

const {
  sample,
  organismAnalysisResults,
} = defineProps({
  sample: {
    type: Object as PropType<SampleType>,
    required: true,
  },
  organismAnalysisResults: { // OrganismResults
    type: Object as PropType<AnalysisResultType[]>,
    required: true,
  },
});

const sampleStore = useSampleStore();

const { withClientMutation, withClientQuery } = useApiUtil()
const organismResult = computed(() => organismAnalysisResults[0]);
const astResults = ref<AbxASTResultType[]>([]);
const pickedOrganisms = ref<AbxOrganismResultType[]>([]);
const guidelines = ref<AbxGuidelineYearType[]>([]);
const testMethods = ref<AbxTestMethodType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrganismResultAllQuery, GetAbxOrganismResultAllQueryVariables>(
    GetAbxOrganismResultAllDocument, { analysisResultUid: organismResult.value.uid! }, "abxOrganismResultAll"
  ).then((result) => {
    if (result) {
      pickedOrganisms.value = (result as unknown || []) as AbxOrganismResultType[];
    }
  }).finally(() => processASTResults())

  fetchAstResultAll()

  withClientQuery<GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables>(
    GetAbxGuidelineYearAllDocument, {}, "abxGuidelineYearAll"
  ).then((result) => {
    if (result) {
      guidelines.value = (result as unknown || []) as AbxGuidelineYearType[];
    }
  })

  withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
    GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
  ).then((result) => {
    if (result) {
      testMethods.value = (result as unknown || []) as AbxTestMethodType[];
    }
  })
});

const showModal = ref<boolean>(false);
const loadingPanels = ref(false);
const searchPanelText = ref<string>('');
const panels = ref<AbxASTPanelType[]>([]);
const choiceOrganism = ref<AbxOrganismResultType>();

function fetchAstResultAll() {
  withClientQuery<GetAbxAstResultAllQuery, GetAbxAstResultAllQueryVariables>(
    GetAbxAstResultAllDocument, { sampleUid: sample.uid! }, "abxAstResultAll"
  ).then((result) => {
    if (result) {
      astResults.value = (result as unknown || []) as AbxASTResultType[];
    }
  }).finally(() => processASTResults())
}

function choosePanel(pickedOrg: AbxOrganismResultType) {
  choiceOrganism.value = pickedOrg;
  showModal.value = true;
}

function canAddPanel(pickedOrg: AbxOrganismResultType) {
  const orgResults = organismResults.value[pickedOrg.uid];
  if(!orgResults) return false;
  return Object.values(orgResults)?.every(ast => ast.status == "pending");
}

function searchPanels() {
  loadingPanels.value = true;
  withClientQuery<GetAbxAstPanelFilterQuery, GetAbxAstPanelFilterQueryVariables>(
    GetAbxAstPanelFilterDocument, 
    { organismUid: choiceOrganism.value?.uid!, text: searchPanelText.value }, 
    "abxAstPanelFilter"
  ).then((result) => {
    if (result) {
      panels.value = (result as unknown || []) as AbxASTPanelType[];
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
          ).then((res: any) => {
            res?.astResults?.forEach(ast => (astResults.value.push(ast)));
            processASTResults();
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
  status: string;
  reportable?: boolean;
  dirty: boolean;
}

type OrganismASTResults = Record<string, Record<string, ASTData>>;

const organismResults = ref<OrganismASTResults>({});

// Process initial data
function processASTResults() {
  const results: OrganismASTResults = {};
  
  pickedOrganisms.value?.forEach(organism => {
    // Initialize object for this organism
    results[organism.uid] = {};
    
    // Get all AST results for this organism
    const orgASTResults = astResults.value?.filter(ast => 
      ast.organismResultUid === organism.uid
    );
    
    // Organize by antibiotic name
    orgASTResults.forEach(ast => {
      if (ast.antibiotic?.name) {
        results[organism.uid][ast.antibiotic.name + " " + ast.antibiotic.potency] = {
          uid: ast.uid,
          analResultUid: ast.analysisResultUid,
          status: ast.analysisResult?.status!,
          astMethodUid: ast.astMethodUid,
          guidelineYearUid: ast.guidelineYearUid,
          breakpointUid: ast.breakpointUid,
          astValue: ast.astValue,
          result: ast.analysisResult?.result,
          reportable: ast.analysisResult?.reportable,
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
  if(!orgResults) return false;
  const is_any_dirty = Object.values(orgResults)?.some(ast => ast.dirty && ast.status == "pending");
    const has_all_fields_filled = Object.values(orgResults)?.some(
      ast => ast.guidelineYearUid && ast.astMethodUid && ast.astValue
    );
    return is_any_dirty && has_all_fields_filled;
}

function getSavable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const dirty = Object.values(orgResults)?.filter(ast => ast.dirty && ast.status == "pending");
  const complete = dirty
    .filter(ast => ast.guidelineYearUid && ast.astMethodUid && ast.astValue)
    .map(({ dirty, breakpointUid, analResultUid, status, ...rest }) => rest);
  return complete;
}

const savingAntibiotics = ref(false);
function saveAntibiotics(organismUid: string) {
  savingAntibiotics.value = true;
  const results = getSavable(organismUid) as any;
  withClientMutation<UpdateAbxAstResultsMutation, UpdateAbxAstResultsMutationVariables>(
    UpdateAbxAstResultsDocument, { payload: { results } }, 'updateAbxAstResults'
  ).then(() => {
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
      fetchAstResultAll()
  }).finally(() => (savingAntibiotics.value = false));
}

// submit
function canSubmit(organismUid: string) {
  const orgResults = organismResults.value[organismUid]
  if(!orgResults) return false;
  const is_any_dirty = Object.values(orgResults)?.some(ast => ast.dirty);
    const has_all_fields_filled = Object.values(orgResults)?.some(
      ast => ast.guidelineYearUid && 
      ast.astMethodUid && 
      ast.astValue && 
      ast.result && 
      ast.status == "pending"
    );
    return !is_any_dirty && has_all_fields_filled && sample.status != 'submitting';
}

function getSubmittable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const not_dirty = Object.values(orgResults)?.filter(ast => !ast.dirty);
  const complete = not_dirty
    .filter(ast => ast.guidelineYearUid && 
    ast.astMethodUid && 
    ast.astValue && 
    ast.result && 
    ast.status == "pending")
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
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
      fetchAstResultAll()
  });
}

// approve
function canApprove(organismUid: string) {
  const orgResults = organismResults.value[organismUid]
  if(!orgResults) return false;
  const is_any_dirty = Object.values(orgResults)?.some(ast => ast.dirty);
    const some_resulted = Object.values(orgResults)?.some(
      ast => ast.status == "resulted"
    );
    return !is_any_dirty && some_resulted && sample.status != 'approving';
}

function getApprovable(organismUid: string) {
  const orgResults = organismResults.value[organismUid];
  const not_dirty = Object.values(orgResults)?.filter(ast => !ast.dirty);
  return not_dirty.filter(ast => ast.status == "resulted")
}

function approveAntibiotics(organismUid: string) {
  const results = getApprovable(organismUid) as ASTData[];
  const _prepared = results.map(r => r.analResultUid)
  approver_(_prepared, "sample", sample?.uid!).then(() => {
      sampleStore.fetchAnalysisResultsForSample(sample.uid)
      fetchAstResultAll()
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
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-border pb-4">
      <h3 class="text-lg font-semibold text-foreground">AST Panel</h3>
    </div>

    <div class="space-y-8">
      <div v-for="pickedOrg in pickedOrganisms" :key="pickedOrg.uid" class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="space-x-2">
            <span class="font-semibold text-foreground">Organism #{{ pickedOrg?.isolateNumber }}</span>
            <span class="text-muted-foreground">{{ pickedOrg?.organism?.name }}</span>
          </div>
          <button 
            v-show="canAddPanel(pickedOrg)"
            @click="choosePanel(pickedOrg)" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Choose Panel
          </button>
        </div>

        <div class="rounded-lg border border-border bg-background">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-muted/50">
                  <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Parameter</th>
                  <th 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {{ antibiotic }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Guideline year -->
                <tr class="border-b border-border">
                  <td class="px-4 py-3 text-sm font-medium text-foreground">Guideline</td>
                  <td 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3"
                  >
                    <select 
                      v-model="organismResults[pickedOrg.uid][antibiotic].guidelineYearUid"
                      @change="handleCellEdit(pickedOrg.uid, antibiotic, 'guidelineYearUid', $event.target.value)"
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="organismResults[pickedOrg.uid][antibiotic].status !== 'pending'"
                    >
                      <option v-for="gly in guidelines" :key="gly.uid" :value="gly.uid">{{ gly.code }}</option>
                    </select>
                  </td>
                </tr>
                <!-- AST Method -->
                <tr class="border-b border-border">
                  <td class="px-4 py-3 text-sm font-medium text-foreground">AST Method</td>
                  <td 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3"
                  >
                    <select 
                      v-model="organismResults[pickedOrg.uid][antibiotic].astMethodUid"
                      @change="handleCellEdit(pickedOrg.uid, antibiotic, 'astMethodUid', $event.target.value)"
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="organismResults[pickedOrg.uid][antibiotic].status !== 'pending'"
                    >
                      <option v-for="tm in testMethods" :key="tm.uid" :value="tm.uid">{{ tm.name }}</option>
                    </select>
                  </td>
                </tr>
                <!-- AST Value -->
                <tr class="border-b border-border">
                  <td class="px-4 py-3 text-sm font-medium text-foreground">AST Value</td>
                  <td 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3"
                  >
                    <input 
                      type="number"
                      v-model="organismResults[pickedOrg.uid][antibiotic].astValue"
                      @change="handleCellEdit(pickedOrg.uid, antibiotic, 'astValue', $event.target.value)"
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      step="0.1"
                      :disabled="organismResults[pickedOrg.uid][antibiotic].status !== 'pending'"
                    />
                  </td>
                </tr>
                <!-- Result -->
                <tr class="border-b border-border">
                  <td class="px-4 py-3 text-sm font-medium text-foreground">Result</td>
                  <td 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3"
                  >
                    <div class="flex items-center space-x-2">
                      <select 
                        v-model="organismResults[pickedOrg.uid][antibiotic].result"
                        @change="handleCellEdit(pickedOrg.uid, antibiotic, 'result', $event.target.value)"
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        :class="{
                          'text-success': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'S',
                          'text-warning': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'I',
                          'text-destructive': organismResults[pickedOrg.uid][antibiotic].result?.toUpperCase() === 'R'
                        }"
                        :disabled="organismResults[pickedOrg.uid][antibiotic].status !== 'pending'"
                      >
                        <option value="S">S</option>
                        <option value="I">I</option>
                        <option value="R">R</option>
                      </select>
                      <span v-show="organismResults[pickedOrg.uid][antibiotic].breakpointUid">
                        <font-awesome-icon 
                          icon="robot" 
                          class="text-muted-foreground"
                          aria-label="Auto-calculated"
                        />
                      </span>
                    </div>
                  </td>
                </tr>
                <!-- Reportable -->
                <tr>
                  <td class="px-4 py-3 text-sm font-medium text-foreground">Reportable</td>
                  <td 
                    v-for="antibiotic in getAntibiotics(pickedOrg.uid)" 
                    :key="antibiotic"
                    class="px-4 py-3"
                  >
                    <div class="flex items-center space-x-4">
                      <input 
                        type="checkbox"
                        v-model="organismResults[pickedOrg.uid][antibiotic].reportable"
                        @change="handleCellEdit(pickedOrg.uid, antibiotic, 'reportable', $event.target.checked)"
                        class="rounded border-input text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="organismResults[pickedOrg.uid][antibiotic].status !== 'pending'"
                      />
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-primary/10 text-primary': organismResults[pickedOrg.uid][antibiotic].status === 'pending',
                          'bg-warning/10 text-warning': organismResults[pickedOrg.uid][antibiotic].status === 'resulted',
                          'bg-success/10 text-success': organismResults[pickedOrg.uid][antibiotic].status === 'approved',
                          'bg-destructive/10 text-destructive': organismResults[pickedOrg.uid][antibiotic].status === 'cancelled'
                        }"
                      >
                        {{ organismResults[pickedOrg.uid][antibiotic].status }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <fel-button 
            v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canSave(pickedOrg.uid)" 
            key="save" 
            @click.prevent="saveAntibiotics(pickedOrg.uid)" 
            :color="'primary'"
            :disabled="savingAntibiotics"
          >
            Save Antibiotics
          </fel-button>

          <fel-button 
            v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canSubmit(pickedOrg.uid)" 
            key="submit" 
            @click.prevent="submitAntibiotics(pickedOrg.uid)" 
            :color="'warning'"
          >
            Submit Antibiotics
          </fel-button>

          <fel-button 
            v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && canApprove(pickedOrg.uid)" 
            key="approve" 
            @click.prevent="approveAntibiotics(pickedOrg.uid)" 
            :color="'success'"
          >
            Approve Antibiotics
          </fel-button>
        </div>
      </div>
    </div>
  </div>

  <!-- Panel Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">
        Search Panel for <span class="italic">{{ choiceOrganism?.organism?.name }}</span>
      </h3>
    </template>

    <template v-slot:body>
      <div class="space-y-6">
        <div class="space-y-4">
          <input
            v-model="searchPanelText"
            @input="searchPanels"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Begin typing..."
          />

          <div class="rounded-lg border border-border">
            <div class="overflow-y-auto max-h-64">
              <table class="w-full">
                <tbody>
                  <tr 
                    v-for="panel in panels" 
                    :key="panel.uid"
                    class="border-b border-border hover:bg-muted/50 transition-colors duration-200"
                  >
                    <td class="px-4 py-3">
                      <div class="font-medium text-foreground">{{ panel.name }}</div>
                      <div class="text-sm text-muted-foreground">
                        {{ panel.antibiotics?.map(a => a.name)?.join(", ") }}
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button
                        @click="applyPanel(panel)"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </fel-modal>
</template>
