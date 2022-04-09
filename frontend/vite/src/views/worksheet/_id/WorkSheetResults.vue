<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { isNullOrWs } from '../../../utils';
  import { IAnalysisResult, IAnalysisService } from '../../../models/analysis';
  import { useAnalysisComposable, useWorkSheetComposable } from '../../../composables';
  import { useWorksheetStore } from '../../../stores';

  import * as shield from '../../../guards'

  const worksheetStore = useWorksheetStore();

  let can_submit = ref<boolean>(false);
  let can_retract = ref<boolean>(false);
  let can_verify = ref<boolean>(false);
  let can_retest = ref<boolean>(false);
  let can_unassign = ref<boolean>(false);

  let allChecked = ref<boolean>(false);
  let viewDetail = ref<boolean>(false);
  let worksheet = computed(()=> worksheetStore.getWorkSheet); 

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
    if(result.status !== "pending") {
      return false
    }
    if(result?.editable || isNullOrWs(result?.result)) {
      editResult(result)
      return true
    };
    return false;
  }

  function prepareResults(): any[] {
    let results = getResultsChecked();
    let ready: IAnalysisResult[] = [];
    results?.forEach((result: IAnalysisResult) => ready.push({ uid: result.uid , result: result.result } as IAnalysisResult))
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

  const { 
      submitResults: submitter_,
      verifyResults: verifier_,
      retractResults: retracter_,
      retestResults: retester_,
  } = useAnalysisComposable()
  const { unAssignSamples: unassinger_ } = useWorkSheetComposable();

  const unAssignSamples = () => unassinger_(getResultsUids());
  const submitResults = () => submitter_(prepareResults());
  const verifyResults = () => verifier_(getResultsUids());
  const retractResults = () => retracter_(getResultsUids());
  const retestResults = () => retester_(getResultsUids());

</script>


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
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Interim</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Unit</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                <!-- <th class="px-1 py-1 border-b-2 border-gray-300"></th> -->
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
                    <span >
                          {{ result?.sample?.qcLevel?.level }}
                    </span>
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
                <div >{{ result?.analysis?.unit?.name || "---"  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ result?.status || "unknown" }}</button>
                </td>
              </tr>
            </tbody>
        </table>
        </div>
    </div>

    <section class="my-4">
      <button  
      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET) && can_unassign"
      @click.prevent="unAssignSamples()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Un Assign</button>
      <button  
      v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_submit"
      @click.prevent="submitResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Submit</button>
      <button  
      v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retract"
      @click.prevent="retractResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retract</button>
      <button  
      v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_verify"
      @click.prevent="verifyResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Verify</button>
      <button  
      v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retest"
      @click.prevent="retestResults()" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Retest</button>
    </section>

  </div>

</template>

