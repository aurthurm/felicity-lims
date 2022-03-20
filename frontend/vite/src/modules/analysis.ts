import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { ActionTypes } from '../store/modules/sample';
import { IAnalysisResult } from '../models/analysis'
import { 
  CANCEL_ANALYSIS_RESULTS,
  REINSTATE_ANALYSIS_RESULTS,
  SUBMIT_ANALYSIS_RESULTS, 
  VERIFY_ANALYSIS_RESULTS, 
  RETEST_ANALYSIS_RESULTS, 
  RETRACT_ANALYSIS_RESULTS } from '../graphql/analyses.mutations';
import useNotifyToast from './alert_toast';

export default function useAnalysisComposable(){
    const route = useRoute();
    const store = useStore();
    const { gqlResponseHandler } = useNotifyToast();

    // Cancell Analyses
    const { executeMutation: _canceller } = useMutation(CANCEL_ANALYSIS_RESULTS);
    const cancelResults = async (uids: number[]) => {
      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to cancel these analytes",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel now!',
          cancelButtonText: 'No, do not cancel!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _canceller({ analyses: uids }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS_STATUS, data.cancelAnalysisResults.results);
            });

            await Swal.fire(
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
    const reInstateResults = async (uids: number[]) => {
      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to reinstate analystes",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, reinstate now!',
          cancelButtonText: 'No, do not reinstate!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _reinstater({ analyses: uids }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS_STATUS, data?.reInstateAnalysisResults.results);
            });

            await Swal.fire(
              'Its Happening!',
              'Your analystes have been reinstated.',
              'success'
            ).then(_ => {})

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

    const submitResults = async (results: any[]) => {

      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to submit these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit now!',
          cancelButtonText: 'No, cancel submission!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _submitter({ analysisResults: results }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, data.submitAnalysisResults.results);
             })

            await Swal.fire(
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
    const verifyResults = async (uids: number[]) => {
      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to verify these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, verify now!',
          cancelButtonText: 'No, cancel verification!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _verifier({ analyses: uids }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, data.verifyAnalysisResults.results);
            });

            await Swal.fire(
              'Its Happening!',
              'Your results have been verified.',
              'success'
            ).then(_ =>  {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  
    // Retract Analyses
    const { executeMutation: _retracter } = useMutation(RETRACT_ANALYSIS_RESULTS); 
    const retractResults = async (uids: number[]) => {
      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to retract these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, retract now!',
          cancelButtonText: 'No, cancel retraction!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _retracter({ analyses: uids }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, data.retractAnalysisResults.results);
            });

            await Swal.fire(
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
    const retestResults = async (uids: number[]) => {
      try {
        await Swal.fire({
          title: 'Are you sure?',
          text: "You want to retest these results",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, retest now!',
          cancelButtonText: 'No, cancel retesting!',
        }).then(async (result) => {
          if (result.isConfirmed) {

            _retester({ analyses: uids }).then(resp => {
              const data = gqlResponseHandler(resp)
              store.dispatch(ActionTypes.UPDATE_ANALYSIS_RESULTS, data.retestAnalysisResults.results);
            });

            await Swal.fire(
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
      submitResult,
      cancelResults,
      reInstateResults,
      submitResults,
      verifyResults,
      retractResults,
      retestResults,
    }
  }
