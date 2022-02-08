<template>
  <h3 class="mt-4 mb-2 text-xl text-gray-600 font-semibold  tracking-wide">{{state.reflexRule?.name}}</h3>
  <p class="leading-2 text-md italic tracking-wide">{{ state.reflexRule?.description }}</p>
  <hr>

  <button @click="reflexActionFormManager(true)"
    class="my-4 px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Reflex Action</button>
  <hr>

  <section class="col-span-1" v-for="action in state.reflexRule?.reflexActions" :key="action?.uid">
    <Accordion>
      <template v-slot:title>
        <span class="p-2" @click="reflexActionFormManager(false, action)"><font-awesome-icon icon="edit" class="text-md text-gray-400 mr-1" /></span>
        Reflex Action Level {{action?.level}} targeting <span v-for="anal in action?.analyses" class="ml-1">{{anal?.name }},</span>
      </template>
      <template v-slot:body>
        <div class="flex justify-start items-center mb-2">
          <h4 class="text-l leading-4 italic">Reflex Action Brains</h4>
          <button 
            @click="reflexBrainFormManager(true, action)"
            class="ml-4 px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
            Add Brain
          </button>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div 
          v-for="(brain, index) in action?.brains" :key="brain?.uid"
          class="block col-span-1 bg-white py-2 px-4 m">
            <div class="flex justify-between items-center">
              <h2 class="my-2 text-l text-gray-600 font-bold">{{ stringToNum(index + 1) }} Brain</h2>
              <span class="p-2" @click="reflexBrainFormManager(false, brain)"><font-awesome-icon icon="edit" class="text-md text-gray-400 mr-1" /></span>
            </div>
            <h3>{{brain?.description}}</h3>
            <hr class="my-2">
            <div>
              <h4 class="my-2 text-md text-gray-500 font-semibold">Analyses Criteria</h4>
              <div v-for="(criteria, index) in brain?.analysesValues" :key="index">
                <div class="flex justify-start items-baseline flex-wrap">  
                  <div class="flex">
                    <button class="px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none">
                      {{criteria?.analysis?.name}}
                    </button>
                    <button class="px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                      {{criteria?.value}}
                    </button>
                  </div>
                </div>
              </div>

              <h4 class="my-2 text-md text-gray-500 font-semibold">Add New Analyses</h4>
              <div v-for="(addition, index) in brain?.addNew" :key="index">
                <div class="flex justify-start items-baseline flex-wrap">  
                  <div class="flex">
                    <button class="px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 focus:outline-none">
                      {{addition?.count}} 
                      <font-awesome-icon icon="asterisk" class="text-l text-gray-600 mx-1" /> 
                    </button>
                    <button class="px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none">
                      {{addition?.analysis?.name}}
                    </button>
                  </div>
                </div>
              </div>

              <h4 class="my-2 text-md text-gray-500 font-semibold">Finalise</h4>
              <div v-for="(final, index) in brain?.finalise" :key="index">
                <div class="flex justify-start items-baseline flex-wrap">  
                  <div class="flex">
                    <button class="px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none">
                      {{final?.analysis?.name}}
                    </button>
                    <button class="px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                      {{final?.value}}
                    </button>
                  </div>
                </div>
              </div>

            </div>
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
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
              <span class="text-gray-700">Target Analyses</span>
              <select 
              name="analyses" 
              id="analyses" 
              v-model="actionForm.analyses"
              class="form-input mt-1 block w-full" multiple>
                <option value=""></option>
                <option  
                v-for="analysis in analysesServices"
                :key="analysis.uid"
                :value="analysis.uid" >{{ analysis.name }}</option>
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
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

  <!-- Reflex Brain Edit Form Modal -->
  <modal v-if="showBrainModal" @close="showBrainModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-3 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="brainForm.description"
              placeholder="Description ..."
            />
          </label>

          <section id="criteria">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Criteria</h5>
                <span class="text-red-700"></span>
                <button
                @click.prevent="addCriteria()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Criteria</button>
            </div>
            <hr class="mb-4">

            <div v-for="(anVal, index) in brainForm.analysesValues" :key="index">
                <div class="flex items-center justify-between">
                    <div class="flex items-top gap-x-2">
                        <label class="flex flex-col whitespace-nowrap mb-2">
                          <span class="text-gray-700">Analysis</span>
                            <select 
                            name="analysisService" 
                            id="analysisService" 
                            v-model="anVal.analysisUid"
                            class="form-input mt-1" @change="setCriteriaResultOptions($event, anVal)">
                              <option value=""></option>
                              <option  
                              v-for="service in analysesServices"
                              :key="service.uid"
                              :value="service.uid" >{{ service.name }}</option>
                          </select>
                        </label>
                        <label class="flex flex-col whitespace-nowrap mb-2">
                          <span class="text-white" >.</span>
                            <select 
                            name="operator" 
                            id="operator" 
                            v-model="anVal.operator"
                            class="form-input mt-1" >
                              <option value="eq">&equals;</option>
                              <option value="gt">&gt;</option>
                              <option value="lt">&lt;</option>
                              <option value="neq">&ne;</option>
                          </select>
                        </label>
                        <label class="block col-span-1 mb-2">
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
                            class="form-input mt-1" >
                              <option value=""></option>
                              <option  
                              v-for="result in criteriaResultOptions"
                              :key="result.uid"
                              :value="result.uid" >{{ result.value }}</option>
                          </select>
                        </label>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeCriteria(index)"
                        class="px-2 py-1 mr-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>
          </section>

          <section id="add-new">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Add New</h5>
                <span class="text-red-700"></span>
                <button
                @click.prevent="addNew()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add New</button>
            </div>
            <hr class="mb-4">

            <div v-for="(addNu, index) in brainForm.addNew" :key="index">
                <div class="flex items-center justify-between">
                    <div class="flex items-top gap-x-4">
                        <label class="flex flex-col whitespace-nowrap mb-2">
                          <span class="text-gray-700">Analysis</span>
                            <select 
                            name="analysisService" 
                            id="analysisService" 
                            v-model="addNu.analysisUid"
                            class="form-input mt-1">
                              <option value=""></option>
                              <option  
                              v-for="service in analysesServices"
                              :key="service.uid"
                              :value="service.uid" >{{ service.name }}</option>
                          </select>
                        </label>
                        <label class="block col-span-1 mb-2">
                          <span class="text-gray-700">Count</span>
                          <input
                            class="form-input mt-1 block w-full"
                            v-model="addNu.count"
                            type="number"
                            placeholder="How Many ..."
                            default=1
                          />
                        </label>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeNew(index)"
                        class="px-2 py-1 mr-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>
          </section>

          <section id="criteria">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Finalize</h5>
                <span class="text-red-700"></span>
                <button
                @click.prevent="addFinal()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Final</button>
            </div>
            <hr class="mb-4">

            <div v-for="(final, index) in brainForm.finalise" :key="index">
                <div class="flex items-center justify-between">
                    <div class="flex items-top gap-x-4">
                        <label class="flex flex-col whitespace-nowrap mb-2">
                          <span class="text-gray-700">Analysis</span>
                            <select 
                            name="analysisService" 
                            id="analysisService" 
                            v-model="final.analysisUid"
                            class="form-input mt-1"  @change="setFinalResultOptions($event, final)">
                              <option value=""></option>
                              <option  
                              v-for="service in analysesServices"
                              :key="service.uid"
                              :value="service.uid" >{{ service.name }}</option>
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
                            class="form-input mt-1" >
                              <option value=""></option>
                              <option  
                              v-for="result in finalResultOptions"
                              :key="result.uid"
                              :value="result.uid" >{{ result.value }}</option>
                          </select>
                        </label>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeFinal(index)"
                        class="px-2 py-1 mr-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>
          </section>

        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveBrainForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>

<script setup lang="ts">
  import modal from '../../../../components/SimpleModal.vue';
  import Accordion from '../../../../components/Accordion.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { useStore } from 'vuex'
  import { useMutation } from "@urql/vue"
  import { useRoute } from 'vue-router';
  import { IReflexAction, IReflexBrain, 
  IReflexBrainFinal, IReflexBrainCriteria, IReflexBrainAddition } from '../../../../models/reflex';
  import useNotifyToast from '../../../../modules/alert_toast'
  import useReflexComposable from '../../../../modules/reflex'
  import { 
    ADD_REFLEX_ACTION,
    EDIT_REFLEX_ACTION,
    ADD_REFLEX_BRAIN,
    EDIT_REFLEX_BRAIN
  } from '../../../../graphql/reflex.mutations';
  import { stringifyNumber } from '../../../../utils';
import { IAnalysisService, IResultOption } from '../../../../models/analysis';

  const { gqlAllErrorHandler } = useNotifyToast()
  const { 
    state, fetchReflexRuleByUid, _addReflexAction, _updateReflexAction, _addReflexBrain, _updateReflexBrain 
  } = useReflexComposable();
  const route = useRoute();
  const  store = useStore();
  
  let showActionModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let actionForm = reactive({}) as IReflexAction;
  const formAction = ref<boolean>(true);
  
  let showBrainModal = ref<boolean>(false);
  let brainForm = reactive({
    addNew: [],
    analysesValues: [],
    finalise: [],
  }) as IReflexBrain;


  onMounted(async () => {
    fetchReflexRuleByUid(+route.params.uid);
  })

  const stringToNum = (num: number) => {
    const asString = stringifyNumber(num);
    return asString.charAt(0).toUpperCase() + asString.slice(1)
  }

  const analysesServices = store.getters.getAnalysesServicesSimple;

  const { executeMutation: createReflexAction } = useMutation(ADD_REFLEX_ACTION);
  const { executeMutation: updateReflexAction } = useMutation(EDIT_REFLEX_ACTION);

  function addReflexAction(): void {
    const payload = {
      reflexRuleUid: state.reflexRule?.uid,
      level: actionForm.level, 
      description: actionForm.description, 
      analyses: actionForm.analyses
    }
    createReflexAction({ payload }).then((result) => {
      let data = gqlAllErrorHandler(result)
      _addReflexAction(data.createReflexAction)
    });
  }

  function editReflexAction(): void {
    const payload = {
      reflexRuleUid: state.reflexRule?.uid,
      level: actionForm.level, 
      description: actionForm.description, 
      analyses: actionForm.analyses
    }
    updateReflexAction({ uid: actionForm.uid, payload }).then((result) => {
      let data = gqlAllErrorHandler(result)
      _updateReflexAction(data.updateReflexAction)
    });
  }

  function reflexActionFormManager(create: boolean, obj: IReflexAction = {}):void {
    formAction.value = create;
    showActionModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "REFLEX ACTION";
    if (create) {
      Object.assign(actionForm, {} as IReflexAction);
    } else {
      let analyses: number[] = [];
      obj.analyses?.forEach(analysis => analyses.push(analysis?.uid!))
      Object.assign(actionForm, { ...obj, analyses });
    }
  }

  function saveActionForm():void {
    if (formAction.value === true) addReflexAction();
    if (formAction.value === false) editReflexAction();
    showActionModal.value = false;
  }

  // Reflex Brain
  const forAction = ref<number>();
  const { executeMutation: createReflexBrain } = useMutation(ADD_REFLEX_BRAIN);
  const { executeMutation: updateReflexBrain } = useMutation(EDIT_REFLEX_BRAIN);

  function addReflexBrain(): void {
    const payload = {
      ...brainForm,
      reflexActionUid: forAction.value,
    }
    createReflexBrain({ payload }).then((result) => {
      let data = gqlAllErrorHandler(result)
      _addReflexBrain(data.createReflexBrain)
    });
  }

  function editReflexBrain(): void {
    const payload = {
      ...brainForm,
      reflexActionUid: forAction.value,
    }
    updateReflexBrain({ uid: brainForm.uid, payload }).then((result) => {
      let data = gqlAllErrorHandler(result)
      _updateReflexBrain(data.updateReflexBrain)
    });
  }

  function addCriteria(): void {
    brainForm.analysesValues?.push({ operator: "eq"} as IReflexBrainCriteria)
  }

  function removeCriteria(index: number): void {
    brainForm.analysesValues?.splice(index, 1);
  }

  let criteriaResultOptions = ref<IResultOption[]>([]);
  function setCriteriaResultOptions(event: any, anal: IReflexBrainCriteria){
    const analysis: IAnalysisService = analysesServices?.find((s: IAnalysisService) => s.uid === anal.analysisUid)
    anal.value = undefined;
    criteriaResultOptions.value = analysis.resultOptions || [];
  }
  
  function addNew(): void {
    brainForm.addNew?.push({} as IReflexBrainAddition)
  }

  function removeNew(index: number): void {
    brainForm.addNew?.splice(index, 1);
  }

  function addFinal(): void {
    brainForm.finalise?.push({} as IReflexBrainFinal)
  }

  function removeFinal(index: number): void {
    brainForm.finalise?.splice(index, 1);
  }

  let finalResultOptions = ref<IResultOption[]>([]);
  function setFinalResultOptions(event: any, anal: IReflexBrainFinal){
    const analysis: IAnalysisService = analysesServices?.find((s: IAnalysisService) => s.uid === anal.analysisUid)
    anal.value = undefined;
    finalResultOptions.value = analysis.resultOptions || [];
  }

  function reflexBrainFormManager(create: boolean, obj: IReflexBrain = {}):void {
    formAction.value = create;
    showBrainModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "REFLEX BRAIN";
    forAction.value = obj.uid;
    if (create) {
      Object.assign(brainForm, {} as IReflexBrain);
    } else {
      let crit: IReflexBrainCriteria[] = [];
      let addN: IReflexBrainAddition[] = [];
      let finl: IReflexBrainFinal[] = [];
      console.log(obj)
      Object.assign(brainForm, { ...obj });
    }
  }

  function saveBrainForm():void {
    if (formAction.value === true) addReflexBrain();
    if (formAction.value === false) editReflexBrain();
    showBrainModal.value = false;
  }

</script>