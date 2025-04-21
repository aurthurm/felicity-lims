import useNotifyToast from './alert_toast';
import type { WorkSheetType } from '@/types/gql';
import { UpdateWorkSheetDocument, ActionAssignWorsheetDocument } from '@/graphql/operations/worksheet.mutations';
import useApiUtil from './api_util';

interface WorksheetActions {
  unAssignSamples: (worksheet: WorkSheetType) => Promise<boolean>;
  submitWorksheets: (worksheets: WorkSheetType[]) => Promise<boolean>;
}

export function useWorksheet(): WorksheetActions {
  const { swalConfirm, toastSuccess, toastError } = useNotifyToast();
  const { withClientMutation } = useApiUtil();

  const unAssignSamples = async (worksheet: WorkSheetType): Promise<boolean> => {
    if (!worksheet?.uid) {
      toastError('Invalid worksheet provided');
      return false;
    }

    try {
      const confirmed = await swalConfirm('Are you sure you want to unassign all samples from this worksheet?');
      if (!confirmed.isConfirmed) return false;

      const result = await withClientMutation(
        UpdateWorkSheetDocument,
        {
          worksheetUid: worksheet.uid,
          action: 'unassign',
          samples: []
        },
        'updateWorksheet'
      );

      if (!result) {
        toastError('Failed to unassign samples: No response from server');
        return false;
      }

      toastSuccess('Successfully unassigned samples from worksheet');
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unassign samples';
      toastError(errorMessage);
      return false;
    }
  };

  const submitWorksheets = async (worksheets: WorkSheetType[]): Promise<boolean> => {
    if (!worksheets?.length) {
      toastError('No worksheets provided for submission');
      return false;
    }

    try {
      const confirmed = await swalConfirm('Are you sure you want to submit these worksheets?');
      if (!confirmed.isConfirmed) return false;

      const worksheetUids = worksheets
        .filter(ws => ws?.uid)
        .map(ws => ws.uid);

      if (!worksheetUids.length) {
        toastError('No valid worksheet IDs found');
        return false;
      }

      const result = await withClientMutation(
        ActionAssignWorsheetDocument,
        {
          uids: worksheetUids,
          action: 'submit'
        },
        'actionWorksheets'
      );

      if (!result) {
        toastError('Failed to submit worksheets: No response from server');
        return false;
      }

      toastSuccess('Successfully submitted worksheets');
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit worksheets';
      toastError(errorMessage);
      return false;
    }
  };

  return {
    unAssignSamples,
    submitWorksheets,
  };
}
