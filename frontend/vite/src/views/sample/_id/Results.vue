<template>

  <hr class="mt-4 mb-2">
  <h3 class="font-bold">Analyses/Results</h3>
  <hr class="mb-4 mt-2">

  <div class="overflow-x-auto">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
                <tr>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">
                      <input type="checkbox" class="" @change="toggleCheckAll" v-model="state.allChecked" >
                  </th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Analysis</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Methods</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Instrument</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Analyst</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Interim</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Retest</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Submitted</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Due Date</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Reportable</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
            </thead>
            <tbody class="bg-white">
                    <tr v-for="result in state.analysisResults"  :key="result.uid" 
                    :class="[getResultRowColor(result)]"
                    >
                      <td>
                          <input type="checkbox" class="" v-model="result.checked" @change="checkCheck(result)" :disabled="isDisabledRowCheckBox(result)">
                      </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900 font-semibold">{{ result.analysis?.name }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">{{ result.method?.name || "None" }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">{{ result.instrument?.name || "None"  }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">{{ result.analyst?.name || "moyoza"}}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div  v-if="!isEditable(result) || result?.analysis?.interims?.length === 0" class="text-sm leading-5 text-blue-900"> --- </div>
                          <label v-else class="block col-span-2 mb-2" >
                              <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                                <option value=""></option>
                                <option  
                                v-for="(interim, index) in result?.analysis?.interims"
                                :key="interim.key"
                                :value="interim.value" >{{ interim.value }}</option>
                            </select>
                          </label>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div  v-if="!isEditable(result)" class="text-sm leading-5 text-blue-900">{{ result?.result  }}</div>
                          <label v-else-if="result?.analysis?.resultOptions?.length === 0" class="block" >
                            <input class="form-input mt-1 block w-full" v-model="result.result" @keyup="check(result)"/>
                          </label>
                          <label v-else class="block col-span-2 mb-2" >
                              <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                                <option value=""></option>
                                <option  
                                v-for="(option, index) in result?.analysis?.resultOptions"
                                :key="option.optionKey"
                                :value="option.value" >{{ option.value }}</option>
                            </select>
                          </label>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">
                            <span v-if="result?.retest" class="text-green-500">
                              <i class="fa fa-check-circle" aria-hidden="true"></i>
                            </span>
                            <span v-else class="text-red-500">
                              <i class="fa fa-times-circle" aria-hidden="true"></i>
                            </span>
                          </div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">2020-10-10</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">2020-10-10</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ result.status }}</button>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">
                            <span v-if="result?.reportable" class="text-green-500">
                              <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                            </span>
                            <span v-else class="text-red-500">
                              <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                            </span>
                          </div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                          <!-- <button @click.prevent="submitResult(result)" 
                            class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">
                            submit
                          </button> -->
                        </td>
                    </tr>
            </tbody>
        </table>
    </div>
</div>

<section class="my-4">
  <FButton 
  v-show="state.can_cancel" 
  @click.prevent="cancelResults" 
  :color="'blue-500'">Cancel</FButton>
  <FButton 
  v-show="state.can_reinstate" 
  @click.prevent="reInstateResults" 
  :color="'red-500'">Re-Instate</FButton>
  <FButton 
  v-show="state.can_submit" 
  @click.prevent="submitResults" 
  :color="'red-500'">Submit</FButton>
  <FButton 
  v-show="state.can_retract" 
  @click.prevent="retractResults" 
  :color="'red-500'">Retract</FButton>
  <FButton 
  v-show="state.can_verify" 
  @click.prevent="verifyResults" 
  :color="'red-500'">Verify</FButton>
  <FButton 
  v-show="state.can_retest" 
  @click.prevent="retestResults" 
  :color="'red-500'">Retest</FButton>
</section>

</template>

<script setup lang="ts">
  import FButton from '../../../components/Buttons/Button.vue'
  import { onMounted, watch, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import { ActionTypes } from '../../../store/modules/sample';

  import useAnalysisResults from '../../../modules/analysis'
  import { IAnalysisInterim, IAnalysisProfile, IAnalysisResult, IAnalysisService, ISample } from '../../../models/analysis';
import { isNullOrWs } from '../../../utils';

  const route = useRoute();
  const store = useStore();

  const state = reactive({
    can_submit: false,
    can_cancel: false,
    can_retract: false,
    can_verify: false,
    can_retest: false,
    can_reinstate: false,
    allChecked: false,
    analysisResults: computed<IAnalysisResult[]>(() => store.getters.getAnalysisResults),
    sample: computed<ISample>(() => store.getters.getSample)
  })

  onMounted(() => store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid))

  watch(() => route.params.sampleUid, (sampleUid, prev) => {
    store.dispatch(ActionTypes.RESET_SAMPLE)
    store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid)
  })

  // store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid)  
  
  function getResultsChecked(): any {
    let results: IAnalysisResult[] = [];
    state.analysisResults?.forEach(result => {
      if (result.checked) results.push(result);
    });
    return results;
  }

  function prepareResults(): IAnalysisResult[] {
    const results = getResultsChecked();
    let ready: any[] = [];
    results?.forEach((result: IAnalysisResult) => ready.push({ uid: result.uid , result: result.result }))
    return ready;
  } 

  function getResultsUids(): number[] {
    const results = getResultsChecked();
    let ready: number[] = [];
    results?.forEach((result: IAnalysisResult) => ready.push(result.uid!))
    return ready;
  }

  // Analysis CheckMark Management
  function checkCheck(result: IAnalysisResult): void {
    if(areAllChecked()) {
      state.allChecked = true;
    } else {
      state.allChecked = false;
    }
    resetAnalysesPermissions()
  }

  function check(result: IAnalysisResult): void {
    result.checked = true;
    resetAnalysesPermissions()
  }

  function unCheck(result: IAnalysisResult): void {
    result.checked = false;
    resetAnalysesPermissions()
  }

  async function toggleCheckAll() {
    await state.analysisResults?.forEach(result => state.allChecked ? check(result) : unCheck(result));
    resetAnalysesPermissions()
  }

  async function unCheckAll() {
    await state.analysisResults?.forEach(result => unCheck(result))
    resetAnalysesPermissions()
  }

  function areAllChecked(): Boolean {
    return state.analysisResults?.every((item: IAnalysisResult) => item.checked === true);
  }

  function isDisabledRowCheckBox(result: any): boolean {
    switch (result?.status){
      case "retracted":
        return true;
      case "verified":
        if(result?.reportable === false){
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  // Analysis Edit Management
  function editResult(result: any): void {
    result.editable = true;
  }

  function isEditable(result: IAnalysisResult): Boolean {
    if(state.sample?.status === 'due') return false;
    if(result?.editable || isNullOrWs(result?.result)) {
      if(['cancelled',"verified","retracted","to_be_verified"].includes(result.status!)){
        result.editable = false
        return false
      }else{
        editResult(result)
        return true
      }
    };
    return false;
  }

  //
  function getResultRowColor(result: any): string {
    switch (result?.status){
      case "retracted":
        return 'bg-gray-300'
      case "verified":
        if(result?.reportable === false){
          return 'bg-red-100';
        } else {
          return '';
        }
      default:
        return ''
    }
  }

  //
  function resetAnalysesPermissions(): void {
    // reset
    state.can_cancel = false;
    state.can_submit = false;
    state.can_retract = false;
    state.can_verify = false;
    state.can_retest = false;
    state.can_reinstate = false;

    const checked = getResultsChecked();
    if(checked.length === 0) return;

    // can reinstate
    if(checked.every((result: IAnalysisResult) => result.status === 'cancelled')){
      state.can_reinstate = true;
    }

    // can cancel
    if(checked.every((result: IAnalysisResult) => result.status === 'pending')){
      state.can_cancel = true;
    }

    // can submit
    if(checked.every((result: IAnalysisResult) => result.status === 'pending' && !isNullOrWs(result.result))){
      state.can_submit = true;
    }

    // can verify/retract/retest
    if(checked.every((result: IAnalysisResult) => result.status === 'resulted')){
      state.can_retract = true;
      state.can_verify = true;
      state.can_retest = true;
    }

  }

  // _updateSample if state has changed
  const _updateSample = async () => {
    const sample = computed<ISample>(() => store.getters.getSample);
    if(sample.value) {
      store.dispatch(ActionTypes.FETCH_SAMPLE_STATUS, sample?.value?.uid);
    }
  }

  const profileAnalysesText =((profiles: IAnalysisProfile[], analyses: IAnalysisService[]) => {
    let names: string[] = [];
    profiles?.forEach(p => names.push(p.name!));
    analyses?.forEach(a => names.push(a.name!));
    return names.join(', ');
  })
  
  // Sample Actions
  let {
    submitResults: submitter_,
    cancelResults: canceller_,
    reInstateResults: reInstater_,
    verifyResults: verifier_,
    retractResults: retracter_,
    retestResults: retester_,
  } = useAnalysisResults()

  const submitResults = () => submitter_(prepareResults()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  const cancelResults = () => canceller_(getResultsUids()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  const reInstateResults = () => reInstater_(getResultsUids()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  const verifyResults = () => verifier_(getResultsUids()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  const retractResults = () => retracter_(getResultsUids()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  const retestResults = () => retester_(getResultsUids()).then(_ => (_updateSample(), resetAnalysesPermissions()))
  
</script>
