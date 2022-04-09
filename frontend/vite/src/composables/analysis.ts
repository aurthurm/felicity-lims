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

export default function useAnalysisComposable(){

    const sampleStore = useSampleStore();
    const worksheetStore = useWorksheetStore();
    const { withClientMutation } = useApiUtil();

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
        console.log(error)
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
        console.log(error)
      }
    }

    // Submit Analyses
    function submitResult(result: IAnalysisResult): void {
      if(result.status !== "pending") return;
      result.result = result.editResult;
       withClientMutation(SUBMIT_ANALYSIS_RESULTS, [{ uid: result.uid , result: result.result }], "submitAnalysisResults")
      .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
             });
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

             withClientMutation(SUBMIT_ANALYSIS_RESULTS, { analysisResults: results }, "submitAnalysisResults")
             .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
             });

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

            withClientMutation(VERIFY_ANALYSIS_RESULTS, { analyses: uids }, "verifyAnalysisResults")
            .then(resp => {
                sampleStore.updateAnalysesResultsStatus(resp.results)
                worksheetStore.updateWorksheetResultsStatus(resp.results)
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
        console.log(error)
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
        console.log(error)
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
