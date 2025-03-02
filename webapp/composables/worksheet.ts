import Swal from 'sweetalert2';

import useApiUtil  from './api_util';
import { ActionAssignWorsheetDocument, ActionAssignWorsheetMutation, ActionAssignWorsheetMutationVariables, UpdateWorkSheetDocument, UpdateWorkSheetMutation, UpdateWorkSheetMutationVariables } from '@/graphql/operations/worksheet.mutations';

export default function useWorkSheetComposable() {
    const { withClientMutation } = useApiUtil();

    // unAssign Analyses
    const unAssignSamples = async (uids: string[]) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You want to Un-Assign these analyses',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Un-Assign now!',
                cancelButtonText: 'No, cancel UnAssign!',
            }).then(async result => {
                if (result.isConfirmed) {
                    await withClientMutation<UpdateWorkSheetMutation, UpdateWorkSheetMutationVariables>(UpdateWorkSheetDocument, uids, 'updateWorksheet').then(payload => {});
                    Swal.fire('Its Happening!', 'Selected analyses have been UnAssigned.', 'success').then(_ => location.reload());
                }
            });
        } catch (error) {}
    };   
    
    // unAssign Analyses
    const actionWorksheets = async (uids: string[], action: "approve" | "submit") => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: `You want to ${action} the worksheet${uids.length > 1 ? 's' : ''}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes, ${action} now!`,
                cancelButtonText: `No, cancel ${action}!`,
            }).then(async result => {
                if (result.isConfirmed) {
                    await withClientMutation<ActionAssignWorsheetMutation, ActionAssignWorsheetMutationVariables>(ActionAssignWorsheetDocument, {uids, action}, 'actionWorksheets')
                    .then(payload => {
                        // location.reload();
                    });
                }
            });
        } catch (error) {}
    };

    return {
        unAssignSamples,
        actionWorksheets
    };
}
