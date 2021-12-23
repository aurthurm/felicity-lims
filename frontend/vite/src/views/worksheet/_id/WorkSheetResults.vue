<template>
 <div class="">

   <hr class="mt-4">
    <label for="toggle" class="text-medium text-gray-700 my-4">More Sample Detail
      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input 
          type="checkbox" 
          name="toggle" id="toggle" 
          v-model="viewDetail"
          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
          <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
      </div>
    </label>
    <hr class="mb-4">

      <!-- Sampe Table View -->
    <div class="overflow-x-auto">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">
                    <input type="checkbox" class="" @change="toggleCheckAll()" v-model="allChecked" >
                </th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Sample ID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Analysis/Test</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Instrument</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Method</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Unit</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="result in worksheet?.analysisResults" :key="result.uid" :class="[getResultRowColor(result)]">
                <td>
                    <input type="checkbox" class="" v-model="result.checked" @change="checkCheck()" :disabled="checkDisabled(result)">
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <span v-if="result?.sample?.priority! > 0"
                    :class="[
                        'font-small',
                        { 'text-red-700': worksheet?.priority! > 1 },
                    ]">
                        <i class="fa fa-star"></i>
                    </span>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-gray-800 font-semibold">
                    <router-link
                     v-if="result?.sample?.analysisRequest?.patient?.uid" 
                     :to="{ name: 'sample-detail', params: { patientUid: result?.sample?.analysisRequest?.patient?.uid, sampleUid: result?.sample?.uid  }}">{{ result?.sample?.sampleId }} </router-link>
                     <div v-else>{{ result?.sample?.sampleId }}</div>
                  </div>
                  <span v-if="viewDetail">
                    <div >
                          {{ result?.sample?.analysisRequest?.patient?.firstName }}
                          {{ result?.sample?.analysisRequest?.patient?.lastName }}
                    </div>
                    <div >
                          {{ result?.sample?.analysisRequest?.client?.name }}
                    </div>
                  </span>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div >{{ result?.analysis?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div >{{ result?.instrument?.name  || "None"  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div >{{ result?.method?.name || "None"  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div  v-if="!isEditable(result)" >{{ result?.result  }}</div>
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
                <div >{{ result?.analysis?.unit || "---"  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ result?.status || "unknown" }}</button>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <!-- <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button> -->
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retract</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

    <section class="my-4">
      <button  
      v-if="can_unassign"
      @click.prevent="unAssignSamples()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Un Assign</button>
      <button  
      v-if="can_submit"
      @click.prevent="submitResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Submit</button>
      <button  
      v-if="can_retract"
      @click.prevent="retractResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retract</button>
      <button  
      v-if="can_verify"
      @click.prevent="verifyResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Verify</button>
      <button  
      v-if="can_retest"
      @click.prevent="retestResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retest</button>
    </section>

  </div>

</template>
    

<script lang="ts">
import Swal from 'sweetalert2';

import { defineComponent, ref, computed } from 'vue';
import { useMutation } from '@urql/vue';

import { useStore } from 'vuex';
import { isNullOrWs } from '../../../utils';
import { 
SUBMIT_ANALYSIS_RESULTS, 
VERIFY_ANALYSIS_RESULTS, 
RETEST_ANALYSIS_RESULTS, 
RETRACT_ANALYSIS_RESULTS } from '../../../graphql/analyses.mutations';
import { WORKSHEET_UPDATE } from '../../../graphql/worksheet.mutations';
import { IWorkSheet } from '../../../models/worksheet';
import { IAnalysisResult, IAnalysisService } from '../../../models/analysis';

export default defineComponent({
  name: 'worksheet-results',
  setup() {
    const store = useStore();

    let can_submit = ref<boolean>(false);
    let can_retract = ref<boolean>(false);
    let can_verify = ref<boolean>(false);
    let can_retest = ref<boolean>(false);
    let can_unassign = ref<boolean>(false);

    let allChecked = ref<boolean>(false);
    let viewDetail = ref<boolean>(false);
    let worksheet = computed<IWorkSheet>(()=> store.getters.getWorkSheet); 

    const { executeMutation: submitAnalysisResults } = useMutation(SUBMIT_ANALYSIS_RESULTS);  
    const { executeMutation: workSheetUpdate } = useMutation(WORKSHEET_UPDATE);  
    const { executeMutation: verifyAnalysisResults } = useMutation(VERIFY_ANALYSIS_RESULTS);  
    const { executeMutation: retestAnalysisResults } = useMutation(RETEST_ANALYSIS_RESULTS); 
    const { executeMutation: retractAnalysisResults } = useMutation(RETRACT_ANALYSIS_RESULTS); 

    function submitAnalysesResults(results: IAnalysisResult[]): void {
      submitAnalysisResults({ analysisResults: results, }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);

      });
    }

    function unAssignAnalyses(analyses: number[]): void {
      workSheetUpdate({ worksheetUid: worksheet.value.uid, samples: analyses, action: "worksheet_un_assign" }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }

    function verifyAnalysesResults(analyses: number[]): void {
      verifyAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);

      });
    }
    
    function retractAnalysesResults(analyses: number[]): void {
      retractAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function retestAnalysesResults(analyses: number[]): void {
      retestAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }

    function areAllChecked(): boolean {
      return worksheet.value?.analysisResults?.every(item => item.checked === true)!;
    }
    
    function getResultsChecked(): any {
      let results: IAnalysisResult[]= [];
      worksheet.value?.analysisResults?.forEach(result => {
        if (result.checked) results.push(result);
      });
      return results;
    }

    function checkCheck(): void {
     if(areAllChecked()) {
        allChecked.value = true;
     } else {
        allChecked.value = false;
     }
     checkUserActionPermissios()
    }

    function check(result: IAnalysisResult): void {
      if(checkDisabled(result)) {
        unCheck(result);
        return;
      };
      result.checked = true;
      checkUserActionPermissios()
    }

    function checkDisabled(result: IAnalysisResult): boolean {
      return ["retracted", 'verified'].includes(result.status!);
    }

    function unCheck(result: IAnalysisResult): void {
      result.checked = false;
      checkUserActionPermissios()
    }

    function toggleCheckAll(): void {
      worksheet?.value?.analysisResults?.forEach(result => allChecked.value ? check(result) : unCheck(result));
      checkUserActionPermissios()
    }

    function unCheckAll(): void {
      worksheet?.value?.analysisResults?.forEach(result => unCheck(result))
      checkUserActionPermissios()
    }

    function analysesText(analyses: IAnalysisService[]): string {
        let names: string[]= [];
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
    }

    function editResult(result: any): void {
      result.editable = true;
    }

    function isEditable(result: IAnalysisResult): Boolean {
      if(result?.editable || isNullOrWs(result?.result)) {
        editResult(result)
        return true
      };
      return false;
    }

    function prepareResults(): any[] {
      const results = getResultsChecked();
      let ready: IAnalysisResult[] = [];
      results?.forEach((result: IAnalysisResult) => ready.push({ uid: result.uid , result: result.result }))
      return ready;
    } 

    function getResultsUids(): number[] {
      const results = getResultsChecked();
      let ready: number[] = [];
      results?.forEach((result: IAnalysisResult) => ready.push(result.uid!))
      return ready;
    }

    function getResultRowColor(result: any): string {
      switch (result?.status){
        case "retracted":
          return 'bg-gray-300 text-sm italic text-gray-500'
        case "pending":
          if(result?.retest === true){
            return 'bg-blue-100 text-sm leading-5 text-blue-900';
          } else {
            return '';
          }
        case "resulted":
          if(result?.retest === true){
            return 'bg-blue-100 text-sm leading-5 text-blue-900';
          } else {
            return '';
          }
        case "verified":
          if(result?.retest === true){
            return 'bg-blue-100 text-sm leading-5 text-blue-900';
          } else {
            return '';
          }
        default:
          return 'text-sm leading-5 text-blue-900'
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
      can_unassign.value = false;
      can_retract.value = false;
      can_verify.value = false;
      can_retest.value = false;

      const checked = getResultsChecked();
      if(checked.length === 0) return;

      // can submit
      if(checked.every((result: IAnalysisResult) => result.status === 'pending')){
        can_submit.value = true;
        can_unassign.value = true;
      }

      // can verify/ retract/ retest
      if(checked.every((result: IAnalysisResult) => result.status === 'resulted')){
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
        console.log(error)
      }
    }

    const unAssignSamples = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to Un-Assign these samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Un-Assign now!',
          cancelButtonText: 'No, cancel UnAssign!',
        }).then((result) => {
          if (result.isConfirmed) {
            unAssignAnalyses(getResultsUids());

            Swal.fire(
              'Its Happening!',
              'Selected samples have been UnAssignes.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
      }
    }

    return {
      worksheet,
      getResultRowColor,
      checkDisabled,
      viewDetail,
      isEditable,
      toggleCheckAll,
      allChecked,
      checkCheck,
      check,
      unAssignSamples,
      submitResults,
      verifyResults,
      retractResults,
      retestResults,
      can_submit,
      can_retract,
      can_verify,
      can_retest,
      can_unassign,
    };
  },
});
</script>
