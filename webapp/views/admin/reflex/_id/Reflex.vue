<script setup lang="ts">
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import {
  IReflexAction,
  IReflexBrain,
  IReflexBrainFinal,
  IReflexBrainAddition,
  IReflexBrainCondition,
  IReflexBrainConditionCriteria,
} from "@/models/reflex";
import { useApiUtil } from "@/composables";
import { useReflexStore, useAnalysisStore } from "@/stores";
import {
  ADD_REFLEX_ACTION,
  EDIT_REFLEX_ACTION,
  ADD_REFLEX_BRAIN,
  EDIT_REFLEX_BRAIN,
  DELETE_REFLEX_BRAIN,
} from "@/graphql/operations/reflex.mutations";
import { stringifyNumber } from "@/utils/helpers";
import { IAnalysisService, IResultOption } from "@/models/analysis";
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
let actionForm = reactive({}) as IReflexAction;
const formAction = ref<boolean>(true);

let showBrainModal = ref<boolean>(false);
let brainForm = reactive<IReflexBrain>({
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
  withClientMutation(
    ADD_REFLEX_ACTION,
    { payload },
    "createReflexAction"
  ).then((payload) => reflexStore.addReflexAction(payload));
}

function editReflexAction(): void {
  const payload = {
    reflexRuleUid: reflexStore.reflexRule?.uid,
    level: actionForm.level,
    description: actionForm.description,
    analyses: actionForm.analyses,
  };
  withClientMutation(
    EDIT_REFLEX_ACTION,
    { uid: actionForm.uid, payload },
    "updateReflexAction"
  ).then((payload) => reflexStore.updateReflexAction(payload));
}

function reflexActionFormManager(create: boolean, obj: IReflexAction = {}): void {
  formAction.value = create;
  showActionModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX ACTION";
  if (create) {
    Object.assign(actionForm, {} as IReflexAction);
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
  withClientMutation(ADD_REFLEX_BRAIN, { payload }, "createReflexBrain").then((payload) =>
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
  withClientMutation(
    EDIT_REFLEX_BRAIN,
    { uid: brainForm.uid, payload },
    "updateReflexBrain"
  ).then((payload) => reflexStore.updateReflexBrain(payload));
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

let criteriaResultOptions = ref<IResultOption[]>([]);
function setCriteriaResultOptions(event: any, anal: IReflexBrainConditionCriteria) {
  const analysis = analysesServices?.find(
    (s: IAnalysisService) => s.uid === anal.analysisUid
  );
  anal.value = undefined;
  criteriaResultOptions.value = analysis?.resultOptions || [];
}

function addNew(index: number): void {
  brainForm.actions![index]?.addNew?.push({} as IReflexBrainAddition);
}

function removeNew(index: number): void {
  brainForm.actions![0]?.addNew?.splice(index, 1);
}

function addFinal(index: number): void {
  brainForm.actions![0]?.finalise?.push({} as IReflexBrainFinal);
}

function removeFinal(index: number): void {
  brainForm.actions![index]?.finalise?.splice(index, 1);
}

let finalResultOptions = ref<IResultOption[]>([]);
function setFinalResultOptions(event: any, anal: IReflexBrainFinal) {
  const analysis = analysesServices?.find(
    (s: IAnalysisService) => s.uid === anal.analysisUid
  );
  anal.value = undefined;
  finalResultOptions.value = analysis?.resultOptions || [];
}

function reflexBrainFormManager(create: boolean, actionUid?: string, obj: IReflexBrain = {}): void {
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
      withClientMutation(DELETE_REFLEX_BRAIN, { uid }, "deleteReflexBrain").then(_ =>
        reflexStore.deleteReflexBrain(actionUid, uid)
      );
    }
  })
}

</script>

<template>
  <h3 class="mt-4 mb-2 text-xl text-gray-600 font-semibold tracking-wide">
    {{ reflexStore.reflexRule?.name }}
  </h3>
  <p class="leading-2 text-md italic tracking-wide">
    {{ reflexStore.reflexRule?.description }}
  </p>
  <hr />

  <button
    @click="reflexActionFormManager(true)"
    class="my-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
  >
    Add Reflex Action
  </button>
  <hr />

  <section
    class="col-span-1"
    v-for="action in reflexStore.reflexRule?.reflexActions"
    :key="action?.uid"
  >
    <Accordion>
      <template v-slot:title>
        <span class="p-2" @click="reflexActionFormManager(false, action)"
          ><font-awesome-icon icon="edit" class="text-md text-gray-400 mr-1"
        /></span>
        Reflex Action Level {{ action?.level }} targeting
        <span v-for="anal in action?.analyses" :key="anal.uid" class="ml-1">{{ anal?.name }},</span>
      </template>
      <template v-slot:body>
        <div class="flex justify-start items-center mb-2">
          <h4 class="text-l leading-4 italic">Reflex Action Brains</h4>
          <button
            @click="reflexBrainFormManager(true, action?.uid!, {})"
            class="ml-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
          >
            Add Brain
          </button>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="(brain, index) in action?.brains"
            :key="brain?.uid"
            class="block col-span-1 bg-white py-2 px-4 m"
          >
            <div class="flex justify-between items-center">
              <h2 class="my-2 text-l text-gray-600 font-bold">
                {{ stringToNum(index + 1) }} Brain
              </h2>
              <div>
                <span class="p-2" @click="reflexBrainFormManager(false, action.uid!, brain)"
                ><font-awesome-icon icon="edit" class="text-md text-gray-400 mr-1"
              /></span>
              <span class="p-2" @click="deleteReflexBrain(action.uid!, brain.uid!)"
                ><font-awesome-icon icon="trash" class="text-md text-red-400 mr-1"
              /></span>
              </div>
            </div>
            <p class="text-gray-500 text-sm">{{ brain?.description }}</p>
          </div>
        </div>
      </template>
    </Accordion>
  </section>

  <!-- Reflex Action Edit Form Modal -->
  <modal v-if="showActionModal" @close="showActionModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Level</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="actionForm.level"
              type="number"
              min=1
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Target Analyses</span>
            <select
              name="analyses"
              id="analyses"
              v-model="actionForm.analyses"
              class="form-input mt-1 block w-full"
              multiple
            >
              <option value=""></option>
              <option
                v-for="analysis in analysesServices"
                :key="analysis.uid"
                :value="analysis.uid"
              >
                {{ analysis.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
              cols="2"
              class="form-input mt-1 block w-full"
              v-model="actionForm.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveActionForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

  <!-- Reflex Brain Edit Form Modal -->
  <modal v-if="showBrainModal" @close="showBrainModal = false" contentWidth="w-4/5">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <label class="mb-2">
          <span class="text-gray-700">Description</span>
          <textarea
            cols="2"
            class="form-input mt-1 block w-full"
            v-model="brainForm.description"
            placeholder="Description ..."
          />
        </label>

        <h3 class="flex items-center justify-start my-4 font-bold text-l text-gray-600">
          <span>Conditions (OR)</span>
          <button
            @click.prevent="addCondition()"
            class="px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
          >
            Add
          </button>
        </h3>
        <p class="italic text-sm text-gray-400">Criteria under a condition are evaluated as AND whilst conditions are evaluated as OR</p>
        <div class="grid grid-cols-2 gap-4 my-4">
          <section class="bg-slate-100 px-1" id="criteria" v-for="(condition, conIdx) in brainForm.conditions" :key="conIdx">
            <hr />
            <div class="flex justify-between items-center">
              <div class="flex justify-start items-center py-2">
                <h5>Criteria (AND)</h5>
                <button
                  @click.prevent="addCriteria(conIdx)"
                  class="px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >
                  + criteria
                </button>
              </div>
              
              <button
                @click.prevent="removeCondition(conIdx)"
                class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
              >
                - condition
              </button>
            </div>
            <hr class="mb-4" />

            <div v-for="(anVal, index) in condition.criteria" :key="index">
              <div class="flex items-center justify-between">
                <div class="flex items-bottom gap-x-2">
                  <label class="flex flex-col whitespace-nowrap mb-2">
                    <span class="text-gray-700">Analysis</span>
                    <select
                      name="analysisService"
                      id="analysisService"
                      v-model="anVal.analysisUid"
                      class="form-input mt-1"
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
                  <label class="flex flex-col whitespace-nowrap mb-2">
                    <span class="text-white">.</span>
                    <select
                      name="operator"
                      id="operator"
                      v-model="anVal.operator"
                      class="form-input mt-1"
                    >
                      <option value="eq">&equals;</option>
                      <option value="gt">&gt;</option>
                      <option value="lt">&lt;</option>
                      <option value="neq">&ne;</option>
                    </select>
                  </label>
                  <label class="block col-span-1 mt-1">
                    <span class="text-gray-700">Result</span>
                    <input
                      v-if="criteriaResultOptions.length == 0"
                      class="form-input mt-1 block w-full"
                      v-model="anVal.value"
                      type="text"
                      placeholder="Result ..."
                    />
                    <select
                      v-else
                      name="criteriaValue"
                      id="criteriaValue"
                      v-model="anVal.value"
                      class="form-input"
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
                <div class="">
                  <button
                    @click.prevent="removeCriteria(conIdx, index)"
                    class="px-2 py-1 mt-5 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
                  >
                    - criteria
                  </button>
                </div>
              </div>
              <hr />
            </div>
          </section>
        </div>

        <h3 class="mt-4 font-bold text-l text-gray-600">Actions</h3>

        <p class="italic text-sm text-gray-400">If conditions are met, auto create new analyses  and or set final results</p>
        <section class="grid grid-cols-2 gap-x-4 my-4" v-for="(action, actIdx) in brainForm.actions" :key="actIdx">
          <!-- Add New -->
          <div class=" bg-green-50 px-1" v-for="(addNu, adIn) in action.addNew" :key="adIn">
            <div class="flex justify-start items-center py-2">
              <h5>Create Analyses</h5>
              <span class="text-orange-600"></span>
              <button
                @click.prevent="addNew(adIn)"
                class="px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
              >
                Add
              </button>
            </div>
            <hr>
            <div class="flex items-center justify-between">
              <div class="flex items-top gap-x-4">
                <label class="flex flex-col whitespace-nowrap mb-2">
                  <span class="text-gray-700">Analysis</span>
                  <select
                    name="analysisService"
                    id="analysisService"
                    v-model="addNu.analysisUid"
                    class="form-input mt-1"
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
                <label class="block col-span-1 mb-2">
                  <span class="text-gray-700">Count</span>
                  <input
                    class="form-input mt-1 block w-full"
                    v-model="addNu.count"
                    type="number"
                    placeholder="How Many ..."
                    default="1"
                  />
                </label>
              </div>
              <div class="">
                <button
                  @click.prevent="removeNew(adIn)"
                  class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Finalise -->
          <div v-for="(action, actIdx) in brainForm.actions" :key="actIdx">
            <div class=" bg-orange-50 px-1" v-for="(final, fiIn) in action.finalise" :key="fiIn">
              <div class="flex justify-start items-center py-2">
                <h5>Set Final Analyses</h5>
                <span class="text-orange-600"></span>
                <button
                  @click.prevent="addFinal(fiIn)"
                  class="px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >
                  Add
                </button>
              </div>
              <hr>
              <div class="flex items-center justify-between">
                <div class="flex items-top gap-x-4">
                  <label class="flex flex-col whitespace-nowrap mb-2">
                    <span class="text-gray-700">Analysis</span>
                    <select
                      name="analysisService"
                      id="analysisService"
                      v-model="final.analysisUid"
                      class="form-input mt-1"
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
                  <label class="block col-span-1 mb-2">
                    <span class="text-gray-700">Result</span>
                    <input
                      v-if="finalResultOptions.length == 0"
                      class="form-input mt-1 block w-full"
                      v-model="final.value"
                      type="text"
                      placeholder="Result ..."
                    />
                    <select
                      v-else
                      name="finalValue"
                      id="finalValue"
                      v-model="final.value"
                      class="form-input mt-1"
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
                <div class="">
                  <button
                    @click.prevent="removeFinal(fiIn)"
                    class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
                  >
                    Remove
                  </button>
              </div>
              </div>
            </div>
          </div>
        </section>


        <hr />
        <button
          type="button"
          @click.prevent="saveBrainForm()"
          class="-mb-4 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
      </form>
    </template>
  </modal>
</template>
