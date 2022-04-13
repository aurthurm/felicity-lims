import Swal from 'sweetalert2';
import { IAnalysisResult } from '../models/analysis'
import { 
  CANCEL_ANALYSIS_RESULTS,
  REINSTATE_ANALYSIS_RESULTS,
  SUBMIT_ANALYSIS_RESULTS, 
  VERIFY_ANALYSIS_RESULTS, 
  RETEST_ANALYSIS_RESULTS, 
  RETRACT_ANALYSIS_RESULTS } from '../graphql/analyses.mutations';

import { useSampleStore, useWorksheetStore } from '../stores';

import useApiUtil from "./api_util";
import useNotifyToast from "./alert_toast";

export default function useAnalysisComposable(){

    const sampleStore = useSampleStore();
    const worksheetStore = useWorksheetStore();
    const { withClientMutation } = useApiUtil();
    const { toastInfo } = useNotifyToast()

    // Cancell Analyses
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

            withClientMutation(CANCEL_ANALYSIS_RESULTS, { analyses: uids }, "cancelAnalysisResults")
            .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
             });

            await Swal.fire(
              'Its Happening!',
              'Your results have been cancelled.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        
      }
    }

    // Reinstate Analyses
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

            withClientMutation(REINSTATE_ANALYSIS_RESULTS, { analyses: uids }, "reInstateAnalysisResults")
            .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
             });

            await Swal.fire(
              'Its Happening!',
              'Your analystes have been reinstated.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        
      }
    }

    // Submit Analyses
    function submitResult(result: IAnalysisResult): void {
      if(result.status !== "pending") return;
      result.result = result.editResult;
       withClientMutation(SUBMIT_ANALYSIS_RESULTS, [{ uid: result.uid , result: result.result }], "submitAnalysisResults")
      .then(resp => {
        toastInfo(resp.message)
        sampleStore.backgroundProcessing([{ uid: result.uid , result: result.result }], undefined)
        worksheetStore.backgroundProcessing([{ uid: result.uid , result: result.result }], undefined)
     });
    }     

    const submitResults = async (results: any[], sourceObject: string, sourceObjectUid: number) => {

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

             withClientMutation(SUBMIT_ANALYSIS_RESULTS, { analysisResults: results, sourceObject, sourceObjectUid }, "submitAnalysisResults")
             .then(resp => {
                toastInfo(resp.message)
                sampleStore.backgroundProcessing(results, sourceObject === "sample" ? sourceObjectUid : undefined)
                worksheetStore.backgroundProcessing(results, sourceObject === "worksheet" ? sourceObjectUid : undefined)
             });

            await Swal.fire(
              'Its Happening!',
              'Your results have been submitted.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        
      }
    }

    // Verify Analyses
    const verifyResults = async (uids: number[], sourceObject: string, sourceObjectUid: number) => {
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

            withClientMutation(VERIFY_ANALYSIS_RESULTS, { analyses: uids, sourceObject, sourceObjectUid }, "verifyAnalysisResults")
            .then(resp => {
              toastInfo(resp.message)
              const data = uids.map(item => ({ uid: item }))
              sampleStore.backgroundProcessing(data, sourceObject === "sample" ? sourceObjectUid : undefined)
              worksheetStore.backgroundProcessing(data, sourceObject === "worksheet" ? sourceObjectUid : undefined)
             });

            await Swal.fire(
              'Its Happening!',
              'Your results have been verified.',
              'success'
            ).then(_ =>  {})

          }
        })
      } catch (error) {
        
      }
    }
  
    // Retract Analyses 
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

            withClientMutation(RETRACT_ANALYSIS_RESULTS, { analyses: uids }, "retractAnalysisResults")
            .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
             });

            await Swal.fire(
              'Its Happening!',
              'Your results have been retracted.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        
      }
    }

    // Retest Analyses
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

            withClientMutation(RETEST_ANALYSIS_RESULTS, { analyses: uids }, "retestAnalysisResults")
            .then(resp => sampleStore.updateAnalysesResults(resp.results));

            await Swal.fire(
              'Its Happening!',
              'Your results have been retested.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        
      }
    }

    return {
      submitResult,
      submitResults,
      cancelResults,
      reInstateResults,
      verifyResults,
      retractResults,
      retestResults,
    }
  }
