import { toRefs, computed, reactive } from 'vue';
import { useSampleStore } from '@/stores/sample';
import useApiUtil  from './api_util';
import useNotifyToast from './alert_toast';
import { CancelSamplesDocument, CancelSamplesMutation, CancelSamplesMutationVariables, CloneSamplesDocument, CloneSamplesMutation, CloneSamplesMutationVariables, InvalidateSamplesDocument, InvalidateSamplesMutation, InvalidateSamplesMutationVariables, PrintSamplesDocument, PrintSamplesMutation, PrintSamplesMutationVariables, PublishSamplesDocument, PublishSamplesMutation, PublishSamplesMutationVariables, ReceiveSamplesDocument, ReceiveSamplesMutation, ReceiveSamplesMutationVariables, ReInstateSamplesDocument, ReInstateSamplesMutation, ReInstateSamplesMutationVariables, RejectSamplesDocument, RejectSamplesMutation, RejectSamplesMutationVariables, VerifySamplesDocument, VerifySamplesMutation, VerifySamplesMutationVariables } from '@/graphql/operations/analyses.mutations';
import { RecoverSamplesDocument, RecoverSamplesMutation, RecoverSamplesMutationVariables, StoreSamplesDocument, StoreSamplesMutation, StoreSamplesMutationVariables } from '@/graphql/operations/storage.mutations';
import { BarcodeSamplesDocument, BarcodeSamplesQuery, BarcodeSamplesQueryVariables, ImpressSampleReportDocument, ImpressSampleReportQuery, ImpressSampleReportQueryVariables, ImpressSampleReportsDocument, ImpressSampleReportsQuery, ImpressSampleReportsQueryVariables } from '@/graphql/operations/analyses.queries';
import { Maybe, SamplePublishInputType, SampleRejectInputType, SampleType, StoreSamplesInputType } from '@/types/gql';


export default function useSampleComposable() {
    const sampleStore = useSampleStore();
    const { withClientMutation, withClientQuery } = useApiUtil();
    const { toastSuccess, toastError, toastInfo, swalConfirm } = useNotifyToast();

    const state = reactive({
        samples: computed(() => sampleStore.getSamples),
    });

    const _updateSamplesStatus = async (samples: SampleType[]) => sampleStore.updateSamplesStatus(samples);
    const _updateSampleStatus = async (sample: SampleType) => sampleStore.updateSampleStatus(sample);
    const _updateSamples = async (samples: Array<SampleType>) => sampleStore.updateSamples(samples);
    const _addSampleClones = async (samples: Array<SampleType>) => sampleStore.addSampleClones(samples);

    const _fetchAnalysesResultsFor = async (uid: string) => {
        if (!uid) return;
        sampleStore.fetchAnalysisResultsForSample(uid);
    };

    // CANCEL_SAMPLES
    const cancelSamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to cancel these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<CancelSamplesMutation, CancelSamplesMutationVariables>(
                    CancelSamplesDocument, 
                    { samples: uids }, 
                    'cancelSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamplesStatus(response.samples);
                    _updateSampleStatus(response.samples[0]);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been cancelled successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to cancel samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // CLONE_SAMPLES
    const cloneSamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to clone these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<CloneSamplesMutation, CloneSamplesMutationVariables>(
                    CloneSamplesDocument, 
                    { samples: uids }, 
                    'cloneSamples'
                );

                if (response?.samples?.length > 0) {
                    _addSampleClones(response.samples);
                    toastSuccess('Samples have been cloned successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to clone samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // REINSTATE_SAMPLES
    const reInstateSamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to reinstate samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<ReInstateSamplesMutation, ReInstateSamplesMutationVariables>(
                    ReInstateSamplesDocument, 
                    { samples: uids }, 
                    'reInstateSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamplesStatus(response.samples);
                    _updateSampleStatus(response.samples[0]);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been reinstated successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to reinstate samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // RECEIVE_SAMPLES
    const receiveSamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to receive samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<ReceiveSamplesMutation, ReceiveSamplesMutationVariables>(
                    ReceiveSamplesDocument, 
                    { samples: uids }, 
                    'receiveSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamplesStatus(response.samples);
                    _updateSampleStatus(response.samples[0]);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been received successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to receive samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // RECOVER_SAMPLES
    const recoverSamples = async (sampleUids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to recover these samples from storage',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<RecoverSamplesMutation, RecoverSamplesMutationVariables>(
                    RecoverSamplesDocument, 
                    { sampleUids }, 
                    'recoverSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamples(response.samples);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been recovered successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to recover samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // PUBLISH_SAMPLES
    const publishSamples = async (samples: Array<SamplePublishInputType>): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to publish samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<PublishSamplesMutation, PublishSamplesMutationVariables>(
                    PublishSamplesDocument, 
                    { samples }, 
                    'publishSamples'
                );

                if (response?.message) {
                    toastSuccess(response.message);
                }
            }
        } catch (error) {
            toastError(`Failed to publish samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // DOWNLOAD_IMPRESS by SAMPLES
    const downloadSamplesImpress = async (sampleIds: string[]): Promise<void> => {
        console.log('Downloading Impress reports for samples:', sampleIds);
        try {
            const result = await swalConfirm(
                'You want to download PDFs',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                console.log('impressReportsDownload:', sampleIds);
                const response = await withClientQuery<ImpressSampleReportsQuery, ImpressSampleReportsQueryVariables>(
                    ImpressSampleReportsDocument, 
                    { sampleIds }, 
                    'impressReportsDownload'
                );

                if (response) {
                    const tempLink = document.createElement('a');
                    tempLink.href = `data:application/pdf;base64,${response}`;
                    tempLink.setAttribute('download', 'impress-report.pdf');
                    tempLink.click();
                    toastSuccess('Reports downloaded successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to download reports: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // DOWNLOAD_IMPRESS
    const downloadImpress = async (impressUid: string): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to download this report',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientQuery<ImpressSampleReportQuery, ImpressSampleReportQueryVariables>(
                    ImpressSampleReportDocument, 
                    { impressUid }, 
                    'impressReportDownload'
                );

                if (response) {
                    const tempLink = document.createElement('a');
                    tempLink.href = `data:application/pdf;base64,${response}`;
                    tempLink.setAttribute('download', 'impress-report.pdf');
                    tempLink.click();
                    toastSuccess('Report downloaded successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const barcodeSamples = async (sampleUids: string[]): Promise<"Query" | Maybe<never[]> | undefined> => {
        try {
            const response = await withClientQuery<BarcodeSamplesQuery, BarcodeSamplesQueryVariables>(
                BarcodeSamplesDocument, 
                { sampleUids }, 
                'barcodeSamples'
            );
            return response || [];
        } catch (error) {
            toastError(`Failed to generate barcodes: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return [];
        }
    };

    // PRINT_SAMPLES
    const printSamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to print these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<PrintSamplesMutation, PrintSamplesMutationVariables>(
                    PrintSamplesDocument, 
                    { samples: uids }, 
                    'printSamples'
                );

                if (response?.message) {
                    toastSuccess(response.message);
                }
            }
        } catch (error) {
            toastError(`Failed to print samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // VERIFY_SAMPLES
    const verifySamples = async (uids: string[]): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to verify these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<VerifySamplesMutation, VerifySamplesMutationVariables>(
                    VerifySamplesDocument, 
                    { samples: uids }, 
                    'verifySamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamplesStatus(response.samples);
                    _updateSampleStatus(response.samples[0]);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been verified successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to verify samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // REJECT_SAMPLES
    const rejectSamples = async (samples: Array<SampleRejectInputType>): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to reject these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<RejectSamplesMutation, RejectSamplesMutationVariables>(
                    RejectSamplesDocument, 
                    { samples }, 
                    'rejectSamples'
                );

                if (response?.message) {
                    toastSuccess(response.message);
                }
            }
        } catch (error) {
            toastError(`Failed to reject samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // INVALIDATE_SAMPLES
    const invalidateSamples = async (uids: string[]): Promise<Array<SampleType>> => {
        try {
            const result = await swalConfirm(
                'You want to invalidate these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<InvalidateSamplesMutation, InvalidateSamplesMutationVariables>(
                    InvalidateSamplesDocument, 
                    { samples: uids }, 
                    'invalidateSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamplesStatus(response.samples);
                    _updateSampleStatus(response.samples[0]);
                    if (response.samples.length === 1) {
                        _fetchAnalysesResultsFor(response.samples[0].uid);
                    }
                    toastSuccess('Samples have been invalidated successfully');
                    return response.samples;
                }
            }
            return [];
        } catch (error) {
            toastError(`Failed to invalidate samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return [];
        }
    };

    // STORE_SAMPLES
    const storeSamples = async (params: Array<StoreSamplesInputType>): Promise<Array<SampleType>> => {
        try {
            const result = await swalConfirm(
                'You want to store these samples',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientMutation<StoreSamplesMutation, StoreSamplesMutationVariables>(
                    StoreSamplesDocument, 
                    { payload: params }, 
                    'storeSamples'
                );

                if (response?.samples?.length > 0) {
                    _updateSamples(response.samples);
                    toastSuccess('Samples have been stored successfully');
                    return response.samples;
                }
            }
            return [];
        } catch (error) {
            toastError(`Failed to store samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return [];
        }
    };

    return {
        ...toRefs(state),
        cancelSamples,
        cloneSamples,
        reInstateSamples,
        receiveSamples,
        recoverSamples,
        publishSamples,
        downloadSamplesImpress,
        downloadImpress,
        barcodeSamples,
        printSamples,
        verifySamples,
        rejectSamples,
        invalidateSamples,
        storeSamples
    };
}   
