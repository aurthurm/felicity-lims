import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import { WORKSHEET_UPDATE } from '../graphql/worksheet.mutations';
import useNotifyToast from './alert_toast';

export default function useWorkSheetComposable(){
    const route = useRoute();
    const store = useStore();
    const { gqlResponseHandler } = useNotifyToast();

    const { executeMutation: workSheetUpdate } = useMutation(WORKSHEET_UPDATE);  

    // unAssign Analyses
    const unAssignSamples = async (uids: number[]) => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to Un-Assign these analyses",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Un-Assign now!',
          cancelButtonText: 'No, cancel UnAssign!',
        }).then((result) => {
          if (result.isConfirmed) {

            workSheetUpdate(uids).then(resp => {
              const data = gqlResponseHandler(resp)
              console.log(data);
            });

            Swal.fire(
              'Its Happening!',
              'Selected analyses have been UnAssigned.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        console.log(error)
      }      
    }

    return {
      unAssignSamples,
    }
  }
