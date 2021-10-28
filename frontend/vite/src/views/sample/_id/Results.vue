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
                      <input type="checkbox" class="" @change="toggleCheckAll" v-model="allChecked" >
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
  <FButton 
  v-show="can_submit" 
  @click.prevent="cancelResults" 
  :color="'blue-500'">Cancel</FButton>
  <FButton 
  v-show="can_reinstate" 
  @click.prevent="reInstateResults" 
  :color="'red-500'">Re-Instate</FButton>
  <FButton 
  v-show="can_submit" 
  @click.prevent="submitResults" 
  :color="'red-500'">Submit</FButton>
  <FButton 
  v-show="can_retract" 
  @click.prevent="retractResults" 
  :color="'red-500'">Retract</FButton>
  <FButton 
  v-show="can_verify" 
  @click.prevent="verifyResults" 
  :color="'red-500'">Verify</FButton>
  <FButton 
  v-show="can_retest" 
  @click.prevent="retestResults" 
  :color="'red-500'">Retest</FButton>
</section>

</template>

<script lang="ts">
import tabSamples from '../comps/SampleTable.vue';
import tabCases from '../comps/CaseTable.vue';
import tabLogs from '../../../components/timeline/AuditLog.vue';
import FButton from '../../../components/Buttons/Button.vue'
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { ActionTypes } from '../../../store/modules/samples';

import useAnalysisResults from '../../../modules/analysis'

export default defineComponent({
  name: 'analyses-results',
  components: {
    FButton,
  },
  setup(props) {
    const route = useRoute();
    const store = useStore();
    
    let {
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
    } = useAnalysisResults()

    onMounted(() => store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid))

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
    }
  },
});
</script>
