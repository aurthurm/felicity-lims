import Swal from 'sweetalert2';
import { ref, toRefs, computed, PropType, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { isNullOrWs } from '../utils';
import { ActionTypes, ISampleRequest, IAnalysisResult } from '../store/modules/samples';
import { GET_ANALYSIS_RESULTS_BY_SAMPLE_UID } from '../graphql/analyses.queries';
import { 
  REINSTATE_SAMPLES,
  RECEIVE_SAMPLES,
  CANCEL_SAMPLES,
  } from '../graphql/analyses.mutations';
import { IAnalysisProfile, IAnalysisService } from '../store/modules/analyses';
import store from '../store';

export default function useSampleModules(){

    const state = reactive({
      samples: computed(() => store.getters.getSamples )
    })

    // CANCEL_SAMPLES
    const { executeMutation: cancelSamples } = useMutation(CANCEL_SAMPLES); 

    // function cancelSelectedSamples(analyses): void {
    //   cancelSamples({ analyses }).then(_ => {});
    // } 

    const cancelSamples_ = async () => {
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
            // cancelSelectedSamples(getSampleUids())
            let samples = getSampleUids()
            cancelSamples({ samples }).then(_ => {});

            Swal.fire(
              'Its Happening!',
              'Your samples have been cancelled.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    // REINSTATE_SAMPLES
    const { executeMutation: reinstateSamples } = useMutation(REINSTATE_SAMPLES); 

    function reInstateSelectedSamples(samples): void {
      reinstateSamples({ samples }).then(_ => {});
    }

    const reInstateSamples_ = async () => {
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
            reInstateSelectedSamples(getSampleUids());

            Swal.fire(
              'Its Happening!',
              'Your samples have been reinstated.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    // RECEIVE_SAMPLES
    const { executeMutation: receiveSamples } = useMutation(RECEIVE_SAMPLES); 

    function receiveSelectedSamples(samples): void {
      receiveSamples({ samples }).then(_ => {});
    }  

    const receiveSamples_ = async () => {
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
            receiveSelectedSamples(getSampleUids());

            Swal.fire(
              'Its Happening!',
              'Your analystes have been received.',
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
    }
  }
