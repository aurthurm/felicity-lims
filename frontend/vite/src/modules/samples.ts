import Swal from 'sweetalert2';
import { toRefs, computed, reactive } from 'vue';
import { useMutation } from '@urql/vue';
import { 
  REINSTATE_SAMPLES,
  RECEIVE_SAMPLES,
  CANCEL_SAMPLES,
} from '../graphql/analyses.mutations';
import store from '../store';

export default function useSampleComposable(){

    const state = reactive({
      samples: computed(() => store.getters.getSamples ),
    })

    // CANCEL_SAMPLES
    const { executeMutation: _canceller } = useMutation(CANCEL_SAMPLES); 
    const cancelSamples = async (samples: string[]) => {
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

            _canceller({ samples }).then(_ => {});

            Swal.fire(
              'Its Happening!',
              'Your samples have been cancelled.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // REINSTATE_SAMPLES
    const { executeMutation: _reinstater } = useMutation(REINSTATE_SAMPLES); 
    const reInstateSamples = async (samples: string[]) => {
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

            _reinstater({ samples }).then(_ => {});

            Swal.fire(
              'Its Happening!',
              'Your samples have been reinstated.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // RECEIVE_SAMPLES
    const { executeMutation: _receiver } = useMutation(RECEIVE_SAMPLES); 
    const receiveSamples = async (samples: string[]) => {
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

            _receiver({ samples }).then(_ => {});

            Swal.fire(
              'Its Happening!',
              'Your samples have been received.',
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
      cancelSamples,
      reInstateSamples,
      receiveSamples,
    }
  }
