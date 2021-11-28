import Swal from 'sweetalert2';
import { toRefs, computed, reactive } from 'vue';
import { useMutation } from '@urql/vue';
import { 
  REINSTATE_SAMPLES,
  RECEIVE_SAMPLES,
  CANCEL_SAMPLES,
  PUBLISH_SAMPLES,
  INVALIDATE_SAMPLES,
  VERIFY_SAMPLES,
  REJECT_SAMPLES,
} from '../graphql/analyses.mutations';
import { ActionTypes } from '../store/modules/sample';
import store from '../store';
import { ISample } from '../models/analysis';

export default function useSampleComposable(){

    const state = reactive({
      samples: computed(() => store.getters.getSamples ),
    })

    const _updateSamplesStatus = async (samples: ISample[]) => store.dispatch(ActionTypes.UPDATE_SAMPLES_STATUS, samples);
    const _updateSampleStatus = async (sample: ISample) => store.dispatch(ActionTypes.UPDATE_SAMPLE_STATUS, sample);

    const  _fetchAnalysesResultsFor = async (uid: number) => {
      if(!uid) return; 
      store.dispatch(ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE, uid);
    }

    // CANCEL_SAMPLES
    const { executeMutation: _canceller } = useMutation(CANCEL_SAMPLES); 
    const cancelSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to cancel these samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel now!',
          cancelButtonText: 'No, do not cancel!',
        }).then((result) => {
          if (result.isConfirmed) {

            _canceller({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const cancelled = resp.data.cancelSamples;
              if(cancelled.length <= 0) return;
              _updateSamplesStatus(cancelled)
              _updateSampleStatus(cancelled[0])
              if(cancelled.length !== 1) return;
              _fetchAnalysesResultsFor(cancelled[0].uid)
            });

            Swal.fire(
              'Its Happening!',
              'Your samples have been cancelled.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // REINSTATE_SAMPLES
    const { executeMutation: _reinstater } = useMutation(REINSTATE_SAMPLES); 
    const reInstateSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to reinstate samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, reinstate now!',
          cancelButtonText: 'No, do not reinstate!',
        }).then((result) => {
          if (result.isConfirmed) {

            _reinstater({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const reInstated = resp.data.reInstateSamples;
              console.log(reInstated)
              if(reInstated.length <= 0) return;
              _updateSamplesStatus(reInstated)
              _updateSampleStatus(reInstated[0])
              if(reInstated.length !== 1) return;
              _fetchAnalysesResultsFor(reInstated[0].uid)
            });

            Swal.fire(
              'Its Happening!',
              'Your samples have been reinstated.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // RECEIVE_SAMPLES
    const { executeMutation: _receiver } = useMutation(RECEIVE_SAMPLES); 
    const receiveSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to receive samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, receice now!',
          cancelButtonText: 'No, do not receive!',
        }).then((result) => {
          if (result.isConfirmed) {

            _receiver({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const received = resp.data.receiveSamples;
              if(received.length <= 0) return;
              _updateSamplesStatus(received)
              _updateSampleStatus(received[0])
              if(received.length !== 1) return;
              _fetchAnalysesResultsFor(received[0].uid)
            });

            Swal.fire(
              'Its Happening!',
              'Your samples have been received.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // PUBLISH_SAMPLES
    const { executeMutation: publisher_ } = useMutation(PUBLISH_SAMPLES); 
    const publishSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to flag as printed",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, flag now!',
          cancelButtonText: 'No, do not flag!',
        }).then((result) => {
          if (result.isConfirmed) {

            publisher_({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const published = resp.data.publishSamples;
              if(published.length <= 0) return;
              _updateSamplesStatus(published)
              _updateSampleStatus(published[0])
              if(published.length !== 1) return;
              _fetchAnalysesResultsFor(published[0].uid)
            });

            Swal.fire(
              'Its Happening!',
              'Your sample have been published.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // verify sample(s) incase it did not auto transition
    const { executeMutation: verifier_ } = useMutation(VERIFY_SAMPLES); 
    const verifySamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to verify sample",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, verify now!',
          cancelButtonText: 'No, do not verify!',
        }).then((result) => {
          if (result.isConfirmed) {

            verifier_({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const verified = resp.data.verifySamples;
              if(verified.length <= 0) return;
              _updateSamplesStatus(verified)
              _updateSampleStatus(verified[0])
            });

            Swal.fire(
              'Its Happening!',
              'Your sample have been verified.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // reject sample(s)
    const { executeMutation: rejecter_ } = useMutation(REJECT_SAMPLES); 
    const rejectSamples = async (samples: any[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to invalidate sample",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Reject  now!',
          cancelButtonText: 'No, do not reject!',
        }).then((result) => {
          if (result.isConfirmed) {

            rejecter_({ samples }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const samples = resp.data.rejectSamples;
              if(samples.length <= 0) return;
              _updateSamplesStatus(samples)
            });

            Swal.fire(
              'Its Happening!',
              'Your sample(s) have been rejected.',
              'success'
            ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // invalidate sample
    const { executeMutation: invaidater_ } = useMutation(INVALIDATE_SAMPLES); 
    const invalidateSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to invalidate sample",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, invalidate now!',
          cancelButtonText: 'No, do not invalidate!',
        }).then((result) => {
          if (result.isConfirmed) {

            invaidater_({ samples: uids }).then(resp => {
              if(resp.error){
                console.error(resp.error)
                return
              }
              const samples = resp.data.invalidateSamples;
              if(samples.length <= 0) return;
              _updateSamplesStatus(samples)
              _updateSampleStatus(samples[0])
            });

            Swal.fire(
              'Its Happening!',
              'Your sample(s) have been invalidated.',
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
      cancelSamples,
      reInstateSamples,
      receiveSamples,
      verifySamples,
      publishSamples,
      invalidateSamples,
      rejectSamples,
    }
  }
