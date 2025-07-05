import {ExtAnalysisResultType} from '@/types/result';
import {useSampleStore} from '@/stores/sample';
import {useWorksheetStore} from '@/stores/worksheet';

import useApiUtil from './api_util';
import useNotifyToast from './alert_toast';
import {
    CancelAnalysisResultsDocument,
    CancelAnalysisResultsMutation,
    CancelAnalysisResultsMutationVariables,
    ReInstateAnalysisResultsDocument,
    ReInstateAnalysisResultsMutation,
    ReInstateAnalysisResultsMutationVariables,
    RetestAnalysisResultsDocument,
    RetestAnalysisResultsMutation,
    RetestAnalysisResultsMutationVariables,
    RetractAnalysisResultsDocument,
    RetractAnalysisResultsMutation,
    RetractAnalysisResultsMutationVariables,
    SubmitAnalysisResultsDocument,
    SubmitAnalysisResultsMutation,
    SubmitAnalysisResultsMutationVariables,
    VerifyAnalysisResultsDocument,
    VerifyAnalysisResultsMutation,
    VerifyAnalysisResultsMutationVariables
} from '@/graphql/operations/analyses.mutations';
import {ArResultInputType, ResultOperationType} from '@/types/gql';
import { NotificationObjectType } from '@/graphql/schema';

export default function useAnalysisComposable() {
    const sampleStore = useSampleStore();
    const worksheetStore = useWorksheetStore();
    const {withClientMutation} = useApiUtil();
    const {toastSuccess, toastError, swalConfirm} = useNotifyToast();

    // Cancel Analyses
    const cancelResults = async (uids: string[]) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to cancel ${uids.length} analyte${uids.length > 1 ? 's' : ''}?`,
                'Cancel Analysis'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<CancelAnalysisResultsMutation, CancelAnalysisResultsMutationVariables>(
                    CancelAnalysisResultsDocument,
                    {analyses: uids},
                    'cancelAnalysisResults'
                );

                if (response?.results) {
                    sampleStore.updateAnalysesResultsStatus(response.results);
                    worksheetStore.updateWorksheetResultsStatus(response.results);
                    toastSuccess(`Successfully cancelled ${uids.length} analyte${uids.length > 1 ? 's' : ''}`);
                }
            }
        } catch (error) {
            toastError(`Failed to cancel analyses: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Reinstate Analyses
    const reInstateResults = async (uids: string[]) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to reinstate ${uids.length} analyte${uids.length > 1 ? 's' : ''}?`,
                'Reinstate Analysis'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<ReInstateAnalysisResultsMutation, ReInstateAnalysisResultsMutationVariables>(
                    ReInstateAnalysisResultsDocument,
                    {analyses: uids},
                    'reInstateAnalysisResults'
                );

                if (response?.results) {
                    sampleStore.updateAnalysesResultsStatus(response.results);
                    worksheetStore.updateWorksheetResultsStatus(response.results);
                    toastSuccess(`Successfully reinstated ${uids.length} analyte${uids.length > 1 ? 's' : ''}`);
                }
            }
        } catch (error) {
            toastError(`Failed to reinstate analyses: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Submit Single Analysis
    const submitResult = async (result: ExtAnalysisResultType): Promise<void> => {
        if (result.status !== 'pending') {
            toastError('Cannot submit non-pending analysis');
            return;
        }

        try {
            const confirmResult = await swalConfirm(
                'Are you sure you want to submit this result?',
                'Submit Result'
            );

            if (!confirmResult.isConfirmed) return;

            result.result = result.editResult;

            const analysisResult: ArResultInputType = {
                uid: result.uid || '',
                result: result.result || '',
                laboratoryInstrumentUid: result.laboratoryInstrumentUid || '',
                methodUid: result.methodUid || ''
            };

            const response: ResultOperationType = await withClientMutation<SubmitAnalysisResultsMutation, SubmitAnalysisResultsMutationVariables>(
                SubmitAnalysisResultsDocument,
                {
                    analysisResults: [analysisResult],
                    sourceObject: 'sample',
                    sourceObjectUid: result.sampleUid || ''
                },
                'submitAnalysisResults'
            );

            // results submitting is in the background
            if (response?.isBackground) {
                sampleStore.backgroundProcessing([{uid: result.uid, result: result.result}], "", 'submitting');
                worksheetStore.backgroundProcessing([{
                    uid: result.uid,
                    result: result.result
                }], undefined, 'submitting');
            } else {
                // results submission was instant and has finished
                sampleStore.updateAnalysesResults(response.results ?? []);
                worksheetStore.updateAnalysesResults(response.results ?? []);
            }
            
            if (response?.message) {
                toastSuccess(response.message);
            }

        } catch (error) {
            toastError(`Failed to submit result: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Submit Multiple Analyses
    const submitResults = async (results: Array<ArResultInputType>, sourceObject: NotificationObjectType, sourceObjectUid: string) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to submit ${results.length} result${results.length > 1 ? 's' : ''}?`,
                'Submit Results'
            );

            if (result.isConfirmed) {
                const response: ResultOperationType = await withClientMutation<SubmitAnalysisResultsMutation, SubmitAnalysisResultsMutationVariables>(
                    SubmitAnalysisResultsDocument,
                    {analysisResults: results, sourceObject, sourceObjectUid},
                    'submitAnalysisResults'
                );

                // results submitting is in the background
                if (response?.isBackground) {
                    sampleStore.backgroundProcessing(results, sourceObject === NotificationObjectType.Sample ? sourceObjectUid : "", 'submitting');
                    worksheetStore.backgroundProcessing(
                        results,
                        sourceObject === NotificationObjectType.Worksheet ? sourceObjectUid : undefined,
                        'submitting'
                    );
                } else {
                    // results submission was instant and has finished
                    if (sourceObject == NotificationObjectType.Sample) {
                        sampleStore.updateAnalysesResults(response.results ?? []);
                    }
                    if (sourceObject == NotificationObjectType.Worksheet) {
                        worksheetStore.updateAnalysesResults(response.results ?? []);
                    }
                }
                if (response?.message) {
                    toastSuccess(response.message);
                }
            }
        } catch (error) {
            toastError(`Failed to submit results: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Approve Analyses
    const approveResults = async (uids: string[], sourceObject: string, sourceObjectUid: string) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to approve ${uids.length} result${uids.length > 1 ? 's' : ''}?`,
                'Approve Results'
            );

            if (result.isConfirmed) {
                const response: ResultOperationType = await withClientMutation<VerifyAnalysisResultsMutation, VerifyAnalysisResultsMutationVariables>(
                    VerifyAnalysisResultsDocument,
                    {analyses: uids, sourceObject, sourceObjectUid},
                    'verifyAnalysisResults'
                );

                if (response?.isBackground) {
                    const data = uids.map(item => ({uid: item}));
                    sampleStore.backgroundProcessing(data, sourceObject === 'sample' ? sourceObjectUid : "", 'approving');
                    worksheetStore.backgroundProcessing(data, sourceObject === 'worksheet' ? sourceObjectUid : undefined, 'approving');
                } else {
                    if (sourceObject == 'sample') {
                        sampleStore.updateAnalysesResults(response.results ?? []);
                    }
                    if (sourceObject == 'worksheet') {
                        worksheetStore.updateAnalysesResults(response.results ?? []);
                    }
                }

                if (response?.message) {
                    toastSuccess(response.message);
                }
            }
        } catch (error) {
            toastError(`Failed to approve results: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Retract Analyses
    const retractResults = async (uids: string[]) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to retract ${uids.length} result${uids.length > 1 ? 's' : ''}?`,
                'Retract Results'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<RetractAnalysisResultsMutation, RetractAnalysisResultsMutationVariables>(
                    RetractAnalysisResultsDocument,
                    {analyses: uids},
                    'retractAnalysisResults'
                );

                if (response?.results) {
                    sampleStore.updateAnalysesResults(response.results);
                    worksheetStore.updateWorksheetResultsStatus(response.results);
                    toastSuccess(`Successfully retracted ${uids.length} result${uids.length > 1 ? 's' : ''}`);
                }
            }
        } catch (error) {
            toastError(`Failed to retract results: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Retest Analyses
    const retestResults = async (uids: string[]) => {
        try {
            const result = await swalConfirm(
                `Are you sure you want to retest ${uids.length} analyte${uids.length > 1 ? 's' : ''}?`,
                'Retest Analysis'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<RetestAnalysisResultsMutation, RetestAnalysisResultsMutationVariables>(
                    RetestAnalysisResultsDocument,
                    {analyses: uids},
                    'retestAnalysisResults'
                );

                if (response?.results) {
                    sampleStore.updateAnalysesResults(response.results);
                    toastSuccess(`Successfully initiated retest for ${uids.length} analyte${uids.length > 1 ? 's' : ''}`);
                }
            }
        } catch (error) {
            toastError(`Failed to retest analyses: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return {
        submitResult,
        submitResults,
        cancelResults,
        reInstateResults,
        approveResults,
        retractResults,
        retestResults,
    };
}
