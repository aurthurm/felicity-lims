import useNotifyToast from './alert_toast';
import type { WorkSheetType } from '@/types/gql';
import { UpdateWorkSheetDocument, ActionAssignWorsheetDocument } from '@/graphql/operations/worksheet.mutations';
import useApiUtil from './api_util';

export function useWorksheet() {
  const { swalConfirm, toastSuccess, toastError } = useNotifyToast();
  const { withClientMutation } = useApiUtil();

  const unAssignSamples = async (worksheet: WorkSheetType) => {
    try {
      const confirmed = await swalConfirm('Are you sure you want to unassign all samples from this worksheet?');
      if (!confirmed.isConfirmed) return;

      await withClientMutation(
        UpdateWorkSheetDocument,
        {
          worksheetUid: worksheet.uid,
          action: 'unassign',
          samples: []
        },
        'updateWorksheet'
      );

      toastSuccess('Successfully unassigned samples from worksheet');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unassign samples';
      toastError(errorMessage);
    }
  };

  const submitWorksheets = async (worksheets: WorkSheetType[]) => {
    try {
      const confirmed = await swalConfirm('Are you sure you want to submit these worksheets?');
      if (!confirmed.isConfirmed) return;

      await withClientMutation(
        ActionAssignWorsheetDocument,
        {
          uids: worksheets.map(ws => ws.uid),
          action: 'submit'
        },
        'actionWorksheets'
      );

      toastSuccess('Successfully submitted worksheets');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit worksheets';
      toastError(errorMessage);
    }
  };

  return {
    unAssignSamples,
    submitWorksheets,
  };
}
