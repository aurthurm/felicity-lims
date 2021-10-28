import Swal from 'sweetalert2';
import { ref, toRefs, computed, PropType, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { isNullOrWs } from '../utils';
import { ActionTypes, ISampleRequest, IAnalysisResult } from '../store/modules/samples';
import { GET_ANALYSIS_RESULTS_BY_SAMPLE_UID } from '../graphql/analyses.queries';
import { 
  CANCEL_ANALYSIS_RESULTS,
  REINSTATE_ANALYSIS_RESULTS,
  SUBMIT_ANALYSIS_RESULTS, 
  VERIFY_ANALYSIS_RESULTS, 
  RETEST_ANALYSIS_RESULTS, 
  RETRACT_ANALYSIS_RESULTS } from '../graphql/analyses.mutations';
import { IAnalysisProfile, IAnalysisService } from '../store/modules/analyses';

export default function useAnalysisResults(){
    const route = useRoute();
    const store = useStore();

    const state = reactive({
        can_submit: false,
        can_retract: false,
        can_verify: false,
        can_retest: false,
        can_reinstate: false,
        allChecked: false,
        analysisResults: computed<IAnalysisResult[]>(() => store.getters.getAnalysisResults),
        sample: computed<ISampleRequest>(() => store.getters.getSample)
    });

    // store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, +route.params.sampleUid)

    const { executeMutation: cancelAnalysisResults } = useMutation(CANCEL_ANALYSIS_RESULTS);
    const { executeMutation: reInstateAnalysisResults } = useMutation(REINSTATE_ANALYSIS_RESULTS);
    const { executeMutation: submitAnalysisResults } = useMutation(SUBMIT_ANALYSIS_RESULTS);
    const { executeMutation: verifyAnalysisResults } = useMutation(VERIFY_ANALYSIS_RESULTS);  
    const { executeMutation: retestAnalysisResults } = useMutation(RETEST_ANALYSIS_RESULTS); 
    const { executeMutation: retractAnalysisResults } = useMutation(RETRACT_ANALYSIS_RESULTS); 
    
    function submitAnalysesResults(results: IAnalysisResult[]): void {
      submitAnalysisResults({ analysisResults: results, }).then((result) => {
       store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }    

    function submitResult(result: IAnalysisResult): void {
      if(result.status !== "pending") return;
      result.result = result.editResult;
      submitAnalysesResults([{ uid: result.uid , result: result.result }])
    }       
    
    function cancelAnalysesResults(analyses: any[]): void {
      cancelAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }     
    
    function reInstateAnalysesResults(analyses: any[]): void {
      reInstateAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function verifyAnalysesResults(analyses: any[]): void {
      verifyAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function retractAnalysesResults(analyses: any[]): void {
      retractAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }  
    
    function retestAnalysesResults(analyses: any[]): void {
      retestAnalysisResults({ analyses }).then((result) => {
      //  store.dispatch(ResultActionTypes.UPDATE_ANALYSIS_RESULTS, result);
      });
    }

    function areAllChecked(): Boolean {
      return state.analysisResults?.every((item: IAnalysisResult) => item.checked === true);
    }
    
    function getResultsChecked(): any {
      let results: IAnalysisResult[] = [];
      state.analysisResults?.forEach(result => {
        if (result.checked) results.push(result);
      });
      return results;
    }

    function checkCheck(result: IAnalysisResult): void {
     if(areAllChecked()) {
        state.allChecked = true;
     } else {
        state.allChecked = false;
     }
      checkUserActionPermissios()
    }

    function check(result: IAnalysisResult): void {
      result.checked = true;
      checkUserActionPermissios()
    }

    function unCheck(result: IAnalysisResult): void {
      result.checked = false;
      checkUserActionPermissios()
    }

    async function toggleCheckAll() {
      await state.analysisResults?.forEach(result => state.allChecked ? check(result) : unCheck(result));
      checkUserActionPermissios()
    }

    async function unCheckAll() {
      await state.analysisResults?.forEach(result => unCheck(result))
      checkUserActionPermissios()
    }

    function profileAnalysesText(profiles: IAnalysisProfile[], analyses: IAnalysisService[]): string {
        let names: string[] = [];
        profiles?.forEach(p => names.push(p.name!));
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
    }

    function editResult(result: any): void {
      result.editable = true;
    }

    function isEditable(result: IAnalysisResult): Boolean {
      if(result?.editable || isNullOrWs(result?.result)) {
        if(['cancelled',"verified","retracted","to_be_verified"].includes(result.status!)){
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

      // can submit
      if(checked.every((result: IAnalysisResult) => result.status === 'pending')){
        state.can_submit = true;
      }

      // can verify/ retract/retest
      if(checked.every((result: IAnalysisResult) => result.status === 'resulted')){
        state.can_retract = true;
        state.can_verify = true;
        state.can_retest = true;
      }

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
        console.log(error)
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
        console.log(error)
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
      ...toRefs(state),
      profileAnalysesText,
      isDisabledRowCheckBox,
      getResultRowColor,
      submitResult,
      isEditable,
      toggleCheckAll,
      checkCheck,
      check,
      cancelResults,
      reInstateResults,
      submitResults,
      verifyResults,
      retractResults,
      retestResults,
    }
  }
