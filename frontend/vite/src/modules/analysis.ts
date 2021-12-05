import Swal from 'sweetalert2';
import { toRefs, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { isNullOrWs } from '../utils';
import { ActionTypes } from '../store/modules/sample';
import { ISample, IAnalysisResult } from '../models/analysis'
import { 
  CANCEL_ANALYSIS_RESULTS,
  REINSTATE_ANALYSIS_RESULTS,
  SUBMIT_ANALYSIS_RESULTS, 
  VERIFY_ANALYSIS_RESULTS, 
  RETEST_ANALYSIS_RESULTS, 
  RETRACT_ANALYSIS_RESULTS } from '../graphql/analyses.mutations';
import { IAnalysisProfile, IAnalysisService } from '../models/analysis';
import useNotifyToast from './alert_toast';

export default function useAnalysisComposable(){
    const route = useRoute();
    const store = useStore();
    const { toastWarning, gqlResponseHandler } = useNotifyToast();

    const state = reactive({
        can_submit: false,
        can_retract: false,
        can_verify: false,
        can_retest: false,
        can_reinstate: false,
        allChecked: false,
        analysisResults: computed<IAnalysisResult[]>(() => store.getters.getAnalysisResults),
        sample: computed<ISample>(() => store.getters.getSample)
    });

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

      // can verify/retract/retest
      if(checked.every((result: IAnalysisResult) => result.status === 'resulted')){
        state.can_retract = true;
        state.can_verify = true;
        state.can_retest = true;
      }

    }

    // _updateSample is state has changed
    const _updateSample = async () => {
      const sample = computed<ISample>(() => store.getters.getSample);
      if(sample.value) {
        store.dispatch(ActionTypes.FETCH_SAMPLE_STATUS, sample?.value?.uid);
      }
    }

    // Cancell Analyses
    const { executeMutation: _canceller } = useMutation(CANCEL_ANALYSIS_RESULTS);
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

            _canceller({ analyses: getResultsUids() }).then(resp => {
              if(resp.error){
                console.error(resp)
                return
              }
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS_STATUS, resp.data.cancelAnalysisResults);
            });

            Swal.fire(
              'Its Happening!',
              'Your results have been cancelled.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Reinstate Analyses
    const { executeMutation: _reinstater } = useMutation(REINSTATE_ANALYSIS_RESULTS);
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

            _reinstater({ analyses: getResultsUids() }).then(resp => {
              const data = gqlResponseHandler(resp)
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS_STATUS, data?.reInstateAnalysisResults);
            });

            // Swal.fire(
            //   'Its Happening!',
            //   'Your analystes have been reinstated.',
            //   'success'
            // ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Submit Analyses
    const { executeMutation: _submitter } = useMutation(SUBMIT_ANALYSIS_RESULTS);

    function submitResult(result: IAnalysisResult): void {
      if(result.status !== "pending") return;
      result.result = result.editResult;
      _submitter([{ uid: result.uid , result: result.result }])
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

            _submitter({ analysisResults: prepareResults() }).then(resp => {
              if(resp.error){
                console.error(resp)
                return
              }
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, resp.data.submitAnalysisResults);
             });

            Swal.fire(
              'Its Happening!',
              'Your results have been submitted.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Verify Analyses
    const { executeMutation: _verifier } = useMutation(VERIFY_ANALYSIS_RESULTS);
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

            _verifier({ analyses: getResultsUids() }).then(resp => {
              if(resp.error){
                console.error(resp)
                return
              }
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, resp.data.verifyAnalysisResults);
            });

            Swal.fire(
              'Its Happening!',
              'Your results have been verified.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  
    // Retract Analyses
    const { executeMutation: _retracter } = useMutation(RETRACT_ANALYSIS_RESULTS); 
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

            _retracter({ analyses: getResultsUids() }).then(resp => {
              if(resp.error){
                console.error(resp)
                return
              }
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, resp.data.retractAnalysisResults);
            });

            Swal.fire(
              'Its Happening!',
              'Your results have been retracted.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Retest Analyses
    const { executeMutation: _retester } = useMutation(RETEST_ANALYSIS_RESULTS); 
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

            _retester({ analyses: getResultsUids() }).then(resp => {
              if(resp.error){
                console.error(resp)
                return
              }
              _updateSample()
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, resp.data.retestAnalysisResults);
            });

            Swal.fire(
              'Its Happening!',
              'Your results have been retested.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      ...toRefs(state),
      profileAnalysesText: computed<string>((profiles: IAnalysisProfile[], analyses: IAnalysisService[]) => {
        let names: string[] = [];
        profiles?.forEach(p => names.push(p.name!));
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
      }),
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
