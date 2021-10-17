<template>

  <hr class="mt-4 mb-2">
  <h3 class="">Analyses/Results</h3>
  <hr class="mb-4 mt-2">

  <div class="overflow-x-auto">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
                <tr>
                  <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">
                      <input type="checkbox" class="" @change="toggleCheckAll()" v-model="allChecked" >
                  </th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Analysis</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Methods</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Instrument</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Analyst</th>
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
                    <tr v-for="result in analysisResults"  :key="result.uid" 
                    :class="[getResultRowColor(result)]"
                    >
                      <td>
                          <input type="checkbox" class="" v-model="result.checked" @change="checkCheck(result)" :disabled="isDisabledRowCheckBox(result)">
                      </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-blue-900">{{ result.analysis?.name }}</div>
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
                          <div  v-if="!isEditable(result)" class="text-sm leading-5 text-blue-900">{{ result?.result  }}</div>
                          <label v-else-if="result?.analysis?.resultoptions?.length === 0" class="block" >
                            <input class="form-input mt-1 block w-full" v-model="result.result" @keyup="check(result)"/>
                          </label>
                          <label v-else class="block col-span-2 mb-2" >
                              <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                                <option value=""></option>
                                <option  
                                v-for="(option, index) in result?.analysis?.resultoptions"
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
      <button 
      v-if="can_submit"
      @click.prevent="submitResults()" 
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Submit</button>
      <button 
      v-if="can_retract"
      @click.prevent="retractResults()" 
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retract</button>
      <button 
      v-if="can_verify"
      @click.prevent="verifyResults()" 
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Verify</button>
      <button 
      v-if="can_retest"
      @click.prevent="retestResults()" 
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retest</button>
    </section>

</template>

<script lang="ts">
import tabSamples from '../comps/SampleTable.vue';
import tabCases from '../comps/CaseTable.vue';
import tabLogs from '../../_components/timeline/AuditLog.vue';

import Swal from 'sweetalert2';
import { defineComponent, ref, toRefs, computed, PropType, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { isNullOrWs } from '../../../utils';
import { ActionTypes, ISampleRequest, IAnalysisResult } from '../../../store/modules/samples';
import { GET_ANALYSIS_RESULTS_BY_SAMPLE_UID } from '../../../graphql/analyses.queries';
import { SUBMIT_ANALYSIS_RESULTS, VERIFY_ANALYSIS_RESULTS, RETEST_ANALYSIS_RESULTS, RETRACT_ANALYSIS_RESULTS } from '../../../graphql/analyses.mutations';
export default defineComponent({
  name: 'analyses-results',
  setup(props) {
    const route = useRoute();
    const store = useStore();

    let can_submit = ref(false);
    let can_retract = ref(false);
    let can_verify = ref(false);
    let can_retest = ref(false);

    let allChecked = ref(false);

    store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid)
    const analysisResults: IAnalysisResult = computed(() => store.getters.getAnalysisResults)
    const sample:ISampleRequest = computed(() => store.getters.getSample)

    const { executeMutation: submitAnalysisResults } = useMutation(SUBMIT_ANALYSIS_RESULTS);
    const { executeMutation: verifyAnalysisResults } = useMutation(VERIFY_ANALYSIS_RESULTS);  
    const { executeMutation: retestAnalysisResults } = useMutation(RETEST_ANALYSIS_RESULTS); 
    const { executeMutation: retractAnalysisResults } = useMutation(RETRACT_ANALYSIS_RESULTS); 
    
    function submitAnalysesResults(results): void {
      submitAnalysisResults({ analysisResults: results, }).then((result) => {
       store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }    

    function submitResult(result: ISampleResult): void {
      if(result.status !== "pending") return;
      result.result = result.editResult;
      submitAnalysesResults([{ uid: result.uid , result: result.result }])
    }    
    
    function verifyAnalysesResults(analyses): void {
      verifyAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function retractAnalysesResults(analyses): void {
      retractAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function retestAnalysesResults(analyses): void {
      retestAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }

    function areAllChecked(): Boolean {
      return analysisResults?.value?.every(item => item.checked === true);
    }
    
    function getResultsChecked(): any {
      let results = [];
      analysisResults?.value?.forEach(result => {
        if (result.checked) results.push(result);
      });
      return results;
    }

    function checkCheck(result): void {
     if(areAllChecked()) {
        allChecked.value = true;
     } else {
        allChecked.value = false;
     }
      checkUserActionPermissios()
    }

    function check(result): void {
      result.checked = true;
      checkUserActionPermissios()
    }

    function unCheck(result): void {
      result.checked = false;
      checkUserActionPermissios()
    }

    async function toggleCheckAll(): void {
      await analysisResults?.value?.forEach(result => allChecked.value ? check(result) : unCheck(result));
      checkUserActionPermissios()
    }

    async function unCheckAll(): void {
      await analysisResults?.value?.forEach(result => unCheck(result))
      checkUserActionPermissios()
    }

    function profileAnalysesText(profiles: IProfile[], analyses: IAnalysis[]): string {
        let names = [];
        profiles?.forEach(p => names.push(p.name));
        analyses?.forEach(a => names.push(a.name));
        return names.join(', ');
    }

    function editResult(result: any): void {
      result.editable = true;
    }

    function isEditable(result): Boolean {
      if(result?.editable || isNullOrWs(result?.result)) {
        editResult(result)
        return true
      };
      return false;
    }

    function prepareResults(): any[] {
      const results = getResultsChecked();
      let ready = [];
      results?.forEach(result => ready.push({ uid: result.uid , result: result.result }))
      return ready;
    } 

    function getResultsUids(): string[] {
      const results = getResultsChecked();
      let ready = [];
      results?.forEach(result => ready.push(result.uid))
      return ready;
    }

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

    function checkUserActionPermissios(): void {
      // reset
      can_submit.value = false;
      can_retract.value = false;
      can_verify.value = false;
      can_retest.value = false;

      const checked = getResultsChecked();
      if(checked.length === 0) return;

      // can submit
      if(checked.every(result => result.status === 'pending')){
        can_submit.value = true;
      }

      // can verify/ retract/retest
      if(checked.every(result => result.status === 'resulted')){
        can_retract.value = true;
        can_verify.value = true;
        can_retest.value = true;
      }

    }

    const submitResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to submit these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit now!',
          cancelButtonText: 'No, cancel submission!',
        }).then((result) => {
          if (result.isConfirmed) {
            submitAnalysesResults(prepareResults());

            Swal.fire(
              'Its Happening!',
              'Your results have been submitted.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    const verifyResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to verify these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, verify now!',
          cancelButtonText: 'No, cancel verification!',
        }).then((result) => {
          if (result.isConfirmed) {
            verifyAnalysesResults(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Your results have been verified.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    const retractResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to retract these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, retract now!',
          cancelButtonText: 'No, cancel retraction!',
        }).then((result) => {
          if (result.isConfirmed) {
            retractAnalysesResults(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Your results have been retracted.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    const retestResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to retest these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, retest now!',
          cancelButtonText: 'No, cancel retesting!',
        }).then((result) => {
          if (result.isConfirmed) {
            retestAnalysesResults(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Your results have been retested.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }


    return {
      sample,
      profileAnalysesText,
      analysisResults,
      isDisabledRowCheckBox,
      getResultRowColor,
      submitResult,
      isEditable,
      toggleCheckAll,
      allChecked,
      checkCheck,
      check,
      submitResults,
      verifyResults,
      retractResults,
      retestResults,
      can_submit,
      can_retract,
      can_verify,
      can_retest,
    }
  },
});
</script>
