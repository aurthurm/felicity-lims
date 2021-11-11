<template>
  <hr>
  <div class="flex justify-end">
    <button
    :class="[
        'focus:outline-none',
        { 'fill-current text-gray-900': gridView === true },
        { 'fill-current text-gray-200': gridView === false },
    ]"
    @click.prevent="toggleView('grid')"
    ><font-awesome-icon icon="th" /></button>
    <button
    :class="[
        'focus:outline-none ml-2',
        { 'fill-current text-gray-900': gridView === false },
        { 'fill-current text-gray-200': gridView === true },
    ]"
    @click.prevent="toggleView('list')"
    ><font-awesome-icon icon="th-list"/></button>
  </div>
  <section 
  v-if="gridView"
  class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Analysis</th>
              <th v-for="level in qcSet?.levels" :key="level.uid"
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"
              >{{ level?.level }}</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr
              v-for="analyte in qcSet?.analytes" :key="analyte.uid"
          >
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">
                       {{analyte?.name}} 
                  </div>
              </td>
              <td 
              v-for="result in analyte?.items" :key="result.uid"
              class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                  <input type="checkbox" class="mr-2" v-model="result.checked" @change="checkCheck(result)" :disabled="isDisabledRowCheckBox(result)">
                  <div>
                    <div  v-if="!isEditable(result)" class="text-sm leading-5 text-blue-900" >{{ result?.result  }}</div>
                    <label v-else-if="result?.analysis?.resultoptions?.length < 1" class="block" >
                      <input class="form-input mt-1 block w-full" v-model="result.result" @keyup="check(result)"/>
                    </label>
                    <label v-else class="block col-span-2" >
                        <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                          <option value=""></option>
                          <option  
                          v-for="(option, index) in result?.analysis?.resultoptions"
                          :key="option.optionKey"
                          :value="option.value" >{{ option.value }}</option>
                      </select>
                    </label>
                    <!-- <div class="text-sm italics text-blue-300"> {{ result?.sample?.qcLevel?.level }}</div> -->
                    <div class="text-sm italics text-blue-600"> {{ result?.status }}</div>
                  </div>
                </div>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </section>

  <section v-else
  class="overflow-x-auto">
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
                    <tr v-for="result in getResults()"  :key="result.uid">
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
  </section>

  <section class="my-4">
    <button 
    v-if="can_submit"
    @click.prevent="cancelResults()" 
    class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Cancel</button>
    <button 
    v-if="can_reinstate"
    @click.prevent="reInstateResults()" 
    class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Re-Instate</button>
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
import { defineComponent, ref, toRefs, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useMutation } from '@urql/vue';
import { ActionTypes } from '../../../store/modules/sample';
import { isNullOrWs } from '../../../utils';
import Swal from 'sweetalert2';
import { 
  CANCEL_ANALYSIS_RESULTS,
  REINSTATE_ANALYSIS_RESULTS,
  SUBMIT_ANALYSIS_RESULTS, 
  VERIFY_ANALYSIS_RESULTS, 
  RETEST_ANALYSIS_RESULTS, 
  RETRACT_ANALYSIS_RESULTS } from '../../../graphql/analyses.mutations';

export default defineComponent({
  name: 'qcset-detail',
  setup() {
    let store = useStore();
    let route = useRoute();

    let can_submit = ref(false);
    let can_retract = ref(false);
    let can_verify = ref(false);
    let can_retest = ref(false);
    let can_reinstate = ref(false);

    let allChecked = ref(false);

    store.dispatch(ActionTypes.FETCH_QC_SET_BY_UID, +route.params.qcSetUid)

    let qcSet = computed(() => {
      let set = store.getters.getQCSet;
      if(!set) return;
      let final = new Object();
      final.levels = []; // table headers
      final.analytes = []; // table rows
      set?.samples?.forEach(sample => {
        if(!sample.assigned) {
          if(!final.levels.some(l => l.uid == sample?.qcLevel?.uid)){
            final.levels.push(sample?.qcLevel);
          }
          sample?.analysisResults?.forEach(result => {
            if(!final.analytes.some(a => a.uid == result?.analysis?.uid)){
              final.analytes.push(result?.analysis)
            }
            const index = final.analytes.findIndex(a => a.uid == result?.analysis?.uid);
            if(final.analytes[index]["items"]){
              if(!final.analytes[index]["items"]?.some(a => a.sampleUid === result.sampleUid)){
                final.analytes[index]["items"].push({ ...result, sample }) 
              }
            } else {
              final.analytes[index]["items"] = [{ ...result, sample }]
            }
          })
        }
      });

      toggleView("grid");

      return { 
        levels: final.levels, 
        analytes: final.analytes,
      };
    });

    function getResults(): any[] {
      let results = [];
      qcSet?.value['analytes']?.forEach(analyte => analyte["items"].forEach(result => results.push(result)))
      return results;
    }

    function getAllAnalysisResults(): any {
      let results = [];
      if(!qcSet?.value['analytes']) return [];
      qcSet?.value['analytes']?.forEach(analyte => {
        analyte?.items?.forEach(result => results.push(result))
      })
      return results;
    }

    function getResultsChecked(): any {
      let results = [];
      if(!qcSet?.value['analytes']) return [];
      qcSet?.value['analytes']?.forEach(analyte => {
        analyte?.items?.forEach(result => {
          if (result.checked) results.push(result);
        })
      })
      return results;
    }

    function getResultsUids(): string[] {
      const results = getResultsChecked();
      let ready = [];
      results?.forEach(result => ready.push(result.uid))
      return ready;
    }

    function checkUserActionPermissios(): void {
      // reset
      can_submit.value = false;
      can_retract.value = false;
      can_verify.value = false;
      can_retest.value = false;
      can_reinstate.value = false;


      const checked = getResultsChecked();
      if(checked.length === 0) return;

      // can reinstate
      if(checked.every(result => result.status === 'cancelled')){
        can_reinstate.value = true;
      }


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

    function areAllChecked(): Boolean {
      const results = getAllAnalysisResults()
      return results?.every(item => item.checked === true);
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
      const analysisResults = getResults();
      await analysisResults?.value?.forEach(result => allChecked.value ? check(result) : unCheck(result));
      checkUserActionPermissios()
    }

    function checkCheck(result): void {
     if(areAllChecked()) {
        allChecked.value = true;
     } else {
        allChecked.value = false;
     }
      checkUserActionPermissios()
    }

    function editResult(result: any): void {
      result.editable = true;
    }

    function isEditable(result): Boolean {
      if(result?.editable || isNullOrWs(result?.result)) {
        if(['cancelled',"verified","retracted","to_be_verified"].includes(result.status)){
          result.editable = false
          return false
        }else{
          editResult(result)
          return true
        }
        return true
      };
      return false;
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

    const { executeMutation: cancelAnalysisResults } = useMutation(CANCEL_ANALYSIS_RESULTS);
    const { executeMutation: reInstateAnalysisResults } = useMutation(REINSTATE_ANALYSIS_RESULTS);
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
    
    function cancelAnalysesResults(analyses): void {
      cancelAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }     
    
    function reInstateAnalysesResults(analyses): void {
      reInstateAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
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

    function prepareResults(): any[] {
      const results = getResultsChecked();
      let ready = [];
      results?.forEach(result => ready.push({ uid: result.uid , result: result.result }))
      return ready;
    }

    const cancelResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to cancel these analytes",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel now!',
          cancelButtonText: 'No, do not cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            cancelAnalysesResults(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Your results have been cancelled.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    const reInstateResults = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to reinstate analystes",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, reinstate now!',
          cancelButtonText: 'No, do not reinstate!',
        }).then((result) => {
          if (result.isConfirmed) {
            reInstateAnalysesResults(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Your analystes have been reinstated.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
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


    // View selection
    let gridView = ref(true);
    let view = ref('grid');
    let hasDuplicates = ref(false);

    function toggleView(choice: string): void {
      let results = []
      let samples = []

      let set = store.getters.getQCSet;

      // for all results in a sample
      // if analyses is dublicated then a retract/retest has hapenned
      set?.samples?.forEach(sample => {
        samples.push(sample)
        if(!sample.assigned) {
          sample?.analysisResults?.forEach(result => results.push(result))
        }
      });

      for(let sample of samples){
          const filtered = results.filter(r => r.sampleUid === sample.uid);
          let analysisUids = [];
          filtered?.forEach(result => analysisUids.push(result.analysisUid));
          hasDuplicates.value = (new Set(analysisUids)).size !== analysisUids.length;
          if(hasDuplicates.value === true) break;
      }

      if(hasDuplicates.value){
        gridView.value = false;
        view.value = 'list';
      }else{
        if(choice === 'grid') {
          gridView.value = true;
          view.value = 'grid';
        } else {
          gridView.value = false;
          view.value = 'list';
        }
      }
    }

    return {
      qcSet,
      getResults,
      check,
      checkCheck,
      toggleCheckAll,
      allChecked,
      isDisabledRowCheckBox,
      isEditable,
      cancelResults,
      reInstateResults,
      submitResults,
      verifyResults,
      retractResults,
      retestResults,
      can_submit,
      can_retract,
      can_verify,
      can_retest,
      can_reinstate,
      gridView,
      toggleView,
    };
  },
});



</script>
