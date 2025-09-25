<script setup lang="ts">
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import {
  ReflexActionType,
  ReflexBrainType,
  ReflexBrainFinalType,
  ReflexBrainAdditionType,
  ReflexBrainConditionType,
  ReflexBrainConditionCriteriaType,
  AnalysisType, ResultOptionType
} from "@/types/gql";
import useApiUtil  from "@/composables/api_util";
import { useReflexStore } from "@/stores/reflex";
import { useAnalysisStore } from "@/stores/analysis";
import {
  AddReflexActionDocument, AddReflexActionMutation, AddReflexActionMutationVariables,
  EditReflexActionDocument, EditReflexActionMutation, EditReflexActionMutationVariables,
  AddReflexBrainDocument, AddReflexBrainMutation, AddReflexBrainMutationVariables,
  EditReflexBrainDocument, EditReflexBrainMutation, EditReflexBrainMutationVariables,
  DeleteReflexBrainDocument, DeleteReflexBrainMutation, DeleteReflexBrainMutationVariables
} from "@/graphql/operations/reflex.mutations";
import { stringifyNumber } from "@/utils";
import Swal from "sweetalert2";
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const Accordion = defineAsyncComponent(
  () => import("@/components/ui/FelAccordion.vue")
)

const reflexStore = useReflexStore();
const analysisStore = useAnalysisStore();

const { withClientMutation } = useApiUtil();

const route = useRoute();

let showActionModal = ref<boolean>(false);
let formTitle = ref<string>("");
let actionForm = reactive({}) as ReflexActionType;
const formAction = ref<boolean>(true);

let showBrainModal = ref<boolean>(false);
let brainForm = reactive<ReflexBrainType>({
  description: "",
  priority: 0,
  conditions: [],
  actions: [],
});

onMounted(async () => {
  reflexStore.fetchReflexRuleByUid(route.params?.uid as string);
});

const stringToNum = (num: number) => {
  const asString = stringifyNumber(num);
  return asString.charAt(0).toUpperCase() + asString.slice(1);
};

const analysesServices = analysisStore.getAnalysesServicesSimple;

function addReflexAction(): void {
  const payload = {
    reflexRuleUid: reflexStore.reflexRule?.uid,
    level: actionForm.level,
    description: actionForm.description,
    analyses: actionForm.analyses,
  };
  withClientMutation<AddReflexActionMutation, AddReflexActionMutationVariables>(AddReflexActionDocument, { payload }, "createReflexAction").then((payload) => reflexStore.addReflexAction(payload));
}

function editReflexAction(): void {
  const payload = {
    reflexRuleUid: reflexStore.reflexRule?.uid,
    level: actionForm.level,
    description: actionForm.description,
    analyses: actionForm.analyses,
  };
  withClientMutation<EditReflexActionMutation, EditReflexActionMutationVariables>(EditReflexActionDocument, { uid: actionForm.uid, payload }, "updateReflexAction").then((payload) => reflexStore.updateReflexAction(payload));
}

function reflexActionFormManager(create: boolean, obj: ReflexActionType = {}): void {
  formAction.value = create;
  showActionModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX ACTION";
  if (create) {
    Object.assign(actionForm, {} as ReflexActionType);
  } else {
    let analyses: string[] = [];
    obj.analyses?.forEach((analysis) => analyses.push(analysis?.uid!));
    Object.assign(actionForm, { ...obj, analyses });
  }
}

function saveActionForm(): void {
  if (formAction.value === true) addReflexAction();
  if (formAction.value === false) editReflexAction();
  showActionModal.value = false;
}

// Reflex Brain
const forAction = ref<string>();

function addReflexBrain(): void {
  const payload = {
    ...brainForm,
    reflexActionUid: forAction.value,
  };
  withClientMutation<AddReflexBrainMutation, AddReflexBrainMutationVariables>(AddReflexBrainDocument, { payload }, "createReflexBrain").then((payload) =>
    reflexStore.updateReflexBrain(payload)
  );
}

function editReflexBrain(): void {
  const payload = {
    reflexActionUid: forAction.value,
    priority: brainForm.priority,
    description: brainForm.description,
    conditions: brainForm.conditions?.map((cond) => ({
      description: cond.description,
      priority: cond.priority,
      criteria: cond.criteria?.map((crit) => ({
        analysisUid: crit.analysisUid,
        operator: crit.operator,
        value: crit.value,
      })),
    })),
    actions: brainForm.actions?.map((act) => ({
      addNew: act.addNew?.map((add) => ({
        analysisUid: add.analysisUid,
        count: add.count,
      })),
      finalise: act.finalise?.map((fin) => ({
        analysisUid: fin.analysisUid,
        value: fin.value,
      })),
    })),
  };
  withClientMutation<EditReflexBrainMutation, EditReflexBrainMutationVariables>(EditReflexBrainDocument, { uid: brainForm.uid, payload }, "updateReflexBrain").then((payload) => reflexStore.updateReflexBrain(payload));
}

function addCondition(): void {
  brainForm.conditions?.push({ description: "", priority: 0, criteria: [] });
}

function removeCondition(index: number): void {
  brainForm.conditions?.splice(index, 1);
}

function addAction(): void {
  brainForm.actions?.push({ addNew: [], finalise: [] });
}

function addCriteria(condIndex: number): void {
  brainForm.conditions![condIndex].criteria?.push({ operator: "eq" })
}

function removeCriteria(condIndex: number, index: number): void {
  brainForm.conditions![condIndex].criteria?.splice(index, 1)
}

let criteriaResultOptions = ref<ResultOptionType[]>([]);
function setCriteriaResultOptions(event: any, anal: ReflexBrainConditionCriteriaType) {
  const analysis = analysesServices?.find(
    (s: AnalysisType) => s.uid === anal.analysisUid
  );
  anal.value = undefined;
  criteriaResultOptions.value = analysis?.resultOptions || [];
}

function addNew(index: number): void {
  brainForm.actions![index]?.addNew?.push({} as ReflexBrainAdditionType);
}

function removeNew(index: number): void {
  brainForm.actions![0]?.addNew?.splice(index, 1);
}

function addFinal(index: number): void {
  brainForm.actions![0]?.finalise?.push({} as ReflexBrainFinalType);
}

function removeFinal(index: number): void {
  brainForm.actions![index]?.finalise?.splice(index, 1);
}

let finalResultOptions = ref<ResultOptionType[]>([]);
function setFinalResultOptions(event: any, anal: ReflexBrainFinalType) {
  const analysis = analysesServices?.find(
    (s: AnalysisType) => s.uid === anal.analysisUid
  );
  anal.value = undefined;
  finalResultOptions.value = analysis?.resultOptions || [];
}

function reflexBrainFormManager(create: boolean, actionUid?: string, obj: ReflexBrainType = {}): void {
  formAction.value = create;
  showBrainModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX BRAIN";
  forAction.value = actionUid;
  if (create) {
    Object.assign(brainForm, {
      priority: 0,
      description: "",
      conditions: [],
      actions: [],
    });
    addCondition();
    addCriteria(0);
    addAction();
    addNew(0);
    addFinal(0);
  } else {
    Object.assign(brainForm, { ...obj });
  }
}

function saveBrainForm(): void {
  if (formAction.value === true) addReflexBrain();
  if (formAction.value === false) editReflexBrain();
  showBrainModal.value = false;
}

function deleteReflexBrain(actionUid: string, uid: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(result => {
    if (result.isConfirmed) {
      withClientMutation<DeleteReflexBrainMutation, DeleteReflexBrainMutationVariables>(DeleteReflexBrainDocument, { uid }, "deleteReflexBrain").then(_ =>
        reflexStore.deleteReflexBrain(actionUid, uid)
      );
    }
  })
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">{{ reflexStore.reflexRule?.name }}</h2>
        <p class="mt-2 text-muted-foreground">{{ reflexStore.reflexRule?.description }}</p>
      </div>
      <button
        @click="reflexActionFormManager(true)"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Add Reflex Action
      </button>
    </div>

    <div class="space-y-4">
      <section
        v-for="action in reflexStore.reflexRule?.reflexActions"
        :key="action?.uid"
        class="rounded-md border border-border"
      >
        <Accordion>
          <template v-slot:title>
            <div class="flex items-center space-x-2 p-4">
              <button
                @click="reflexActionFormManager(false, action)"
                class="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <font-awesome-icon icon="edit" class="text-md" />
              </button>
              <span class="text-foreground">
                Reflex Action Level {{ action?.level }} targeting
                <span v-for="anal in action?.analyses" :key="anal.uid" class="text-primary">
                  {{ anal?.name }}{{ action?.analyses?.indexOf(anal) !== action?.analyses?.length - 1 ? ', ' : '' }}
                </span>
              </span>
            </div>
          </template>
          <template v-slot:body>
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-foreground">Reflex Action Brains</h3>
                <button
                  @click="reflexBrainFormManager(true, action?.uid!, {})"
                  class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add Brain
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(brain, index) in action?.brains"
                  :key="brain?.uid"
                  class="rounded-md border border-border p-4 space-y-2"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="text-lg font-medium text-foreground">
                      {{ stringToNum(index + 1) }} Brain
                    </h4>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="reflexBrainFormManager(false, action.uid!, brain)"
                        class="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <font-awesome-icon icon="edit" class="text-md" />
                      </button>
                      <button
                        @click="deleteReflexBrain(action.uid!, brain.uid!)"
                        class="text-destructive hover:text-destructive/80 transition-colors duration-200"
                      >
                        <font-awesome-icon icon="trash" class="text-md" />
                      </button>
                    </div>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ brain?.description }}</p>
                </div>
              </div>
            </div>
          </template>
        </Accordion>
      </section>
    </div>

    <!-- Reflex Action Edit Form Modal -->
    <fel-modal v-if="showActionModal" @close="showActionModal = false">
      <template v-slot:header>
        <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
        <form @submit.prevent="saveActionForm" class="space-y-6 p-4">
          <div class="grid grid-cols-1 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Level</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="actionForm.level"
                type="number"
                min="1"
                placeholder="Level ..."
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Target Analyses</span>
              <select
                v-model="actionForm.analyses"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                multiple
              >
                <option
                  v-for="analysis in analysesServices"
                  :key="analysis.uid"
                  :value="analysis.uid"
                >
                  {{ analysis.name }}
                </option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Description</span>
              <textarea
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="actionForm.description"
                placeholder="Description ..."
                rows="3"
              />
            </label>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Save Reflex Action
            </button>
          </div>
        </form>
      </template>
    </fel-modal>

    <!-- Reflex Brain Edit Form Modal -->
    <fel-modal v-if="showBrainModal" @close="showBrainModal = false" :content-width="'w-4/5'">
      <template v-slot:header>
        <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
        <form @submit.prevent="saveBrainForm" class="space-y-6 p-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Description</span>
            <textarea
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="brainForm.description"
              placeholder="Description ..."
              rows="3"
            />
          </label>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-foreground">Conditions (OR)</h3>
              <button
                @click.prevent="addCondition()"
                class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Add Condition
              </button>
            </div>
            <p class="text-sm text-muted-foreground">Criteria under a condition are evaluated as AND whilst conditions are evaluated as OR</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section
                v-for="(condition, conIdx) in brainForm.conditions"
                :key="conIdx"
                class="rounded-md border border-border p-4 space-y-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-md font-medium text-foreground">Criteria (AND)</h4>
                    <button
                      @click.prevent="addCriteria(conIdx)"
                      class="bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Add Criteria
                    </button>
                  </div>
                  <button
                    @click.prevent="removeCondition(conIdx)"
                    class="bg-destructive text-destructive-foreground px-3 py-1 rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                  >
                    Remove Condition
                  </button>
                </div>

                <div v-for="(anVal, index) in condition.criteria" :key="index" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Analysis</span>
                      <select
                        v-model="anVal.analysisUid"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        @change="setCriteriaResultOptions($event, anVal)"
                      >
                        <option value=""></option>
                        <option
                          v-for="service in analysesServices"
                          :key="service.uid"
                          :value="service.uid"
                        >
                          {{ service.name }}
                        </option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Operator</span>
                      <select
                        v-model="anVal.operator"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="eq">&equals;</option>
                        <option value="gt">&gt;</option>
                        <option value="lt">&lt;</option>
                        <option value="neq">&ne;</option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Result</span>
                      <input
                        v-if="criteriaResultOptions.length == 0"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        v-model="anVal.value"
                        type="text"
                        placeholder="Result ..."
                      />
                      <select
                        v-else
                        v-model="anVal.value"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value=""></option>
                        <option
                          v-for="result in criteriaResultOptions"
                          :key="result.uid"
                          :value="result.value"
                        >
                          {{ result.value }}
                        </option>
                      </select>
                    </label>
                  </div>
                  <div class="flex justify-end">
                    <button
                      @click.prevent="removeCriteria(conIdx, index)"
                      class="bg-destructive text-destructive-foreground px-3 py-1 rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                    >
                      Remove Criteria
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-foreground">Actions</h3>
            <p class="text-sm text-muted-foreground">If conditions are met, auto create new analyses and or set final results</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Add New -->
              <div
                v-for="(action, actIdx) in brainForm.actions"
                :key="actIdx"
                class="rounded-md border border-border p-4 space-y-4"
              >
                <div v-for="(addNu, adIn) in action.addNew" :key="adIn">
                  <div class="flex items-center justify-between">
                    <h4 class="text-md font-medium text-foreground">Create Analyses</h4>
                    <button
                      @click.prevent="addNew(adIn)"
                      class="bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Add Analysis
                    </button>
                  </div>
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Analysis</span>
                      <select
                        v-model="addNu.analysisUid"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value=""></option>
                        <option
                          v-for="service in analysesServices"
                          :key="service.uid"
                          :value="service.uid"
                        >
                          {{ service.name }}
                        </option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Count</span>
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        v-model="addNu.count"
                        type="number"
                        placeholder="How Many ..."
                        default="1"
                      />
                    </label>
                  </div>
                  <div class="flex justify-end mt-2">
                    <button
                      @click.prevent="removeNew(adIn)"
                      class="bg-destructive text-destructive-foreground px-3 py-1 rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <!-- Finalise -->
              <div
                v-for="(action, actIdx) in brainForm.actions"
                :key="actIdx"
                class="rounded-md border border-border p-4 space-y-4"
              >
                <div v-for="(final, fiIn) in action.finalise" :key="fiIn">
                  <div class="flex items-center justify-between">
                    <h4 class="text-md font-medium text-foreground">Set Final Analyses</h4>
                    <button
                      @click.prevent="addFinal(fiIn)"
                      class="bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Add Analysis
                    </button>
                  </div>
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Analysis</span>
                      <select
                        v-model="final.analysisUid"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        @change="setFinalResultOptions($event, final)"
                      >
                        <option value=""></option>
                        <option
                          v-for="service in analysesServices"
                          :key="service.uid"
                          :value="service.uid"
                        >
                          {{ service.name }}
                        </option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="text-sm font-medium text-foreground">Result</span>
                      <input
                        v-if="finalResultOptions.length == 0"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        v-model="final.value"
                        type="text"
                        placeholder="Result ..."
                      />
                      <select
                        v-else
                        v-model="final.value"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value=""></option>
                        <option
                          v-for="result in finalResultOptions"
                          :key="result.uid"
                          :value="result.value"
                        >
                          {{ result.value }}
                        </option>
                      </select>
                    </label>
                  </div>
                  <div class="flex justify-end mt-2">
                    <button
                      @click.prevent="removeFinal(fiIn)"
                      class="bg-destructive text-destructive-foreground px-3 py-1 rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Save Reflex Brain
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>
