import Swal from 'sweetalert2';
import { toRefs, computed, reactive } from 'vue';
import { useSampleStore } from '@/stores/sample';
import { ISample } from '@/models/analysis';
import useApiUtil  from './api_util';
import useNotifyToast from './alert_toast';
import { CancelSamplesDocument, CancelSamplesMutation, CancelSamplesMutationVariables, CloneSamplesDocument, CloneSamplesMutation, CloneSamplesMutationVariables, InvalidateSamplesDocument, InvalidateSamplesMutation, InvalidateSamplesMutationVariables, PrintSamplesDocument, PrintSamplesMutation, PrintSamplesMutationVariables, PublishSamplesDocument, PublishSamplesMutation, PublishSamplesMutationVariables, ReceiveSamplesDocument, ReceiveSamplesMutation, ReceiveSamplesMutationVariables, ReInstateSamplesDocument, ReInstateSamplesMutation, ReInstateSamplesMutationVariables, RejectSamplesDocument, RejectSamplesMutation, RejectSamplesMutationVariables, VerifySamplesDocument, VerifySamplesMutation, VerifySamplesMutationVariables } from '@/graphql/operations/analyses.mutations';
import { RecoverSamplesDocument, RecoverSamplesMutation, RecoverSamplesMutationVariables, StoreSamplesDocument, StoreSamplesMutation, StoreSamplesMutationVariables } from '@/graphql/operations/storage.mutations';
import { BarcodeSamplesDocument, BarcodeSamplesQuery, BarcodeSamplesQueryVariables, ImpressSampleReportDocument, ImpressSampleReportQuery, ImpressSampleReportQueryVariables, ImpressSampleReportsQuery, ImpressSampleReportsQueryVariables } from '@/graphql/operations/analyses.queries';

export default function useSampleComposable() {
    const sampleStore = useSampleStore();
    const { withClientMutation, withClientQuery } = useApiUtil();
    const { toastInfo } = useNotifyToast();

    const state = reactive({
        samples: computed(() => sampleStore.getSamples),
    });

    const _updateSamplesStatus = async (samples: ISample[]) => sampleStore.updateSamplesStatus(samples);
    const _updateSampleStatus = async (sample: ISample) => sampleStore.updateSampleStatus(sample);
    const _updateSamples = async (samples: ISample[]) => sampleStore.updateSamples(samples);
    const _addSampleClones = async (samples: ISample[]) => sampleStore.addSampleClones(samples);

    const _fetchAnalysesResultsFor = async (uid: number) => {
        if (!uid) return;
        sampleStore.fetchAnalysisResultsForSample(uid);
    };

    // CANCEL_SAMPLES
    const cancelSamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to cancel these samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel now!',
                cancelButtonText: 'No, do not cancel!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<CancelSamplesMutation, CancelSamplesMutationVariables>(CancelSamplesDocument, { samples: uids }, 'cancelSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                        if (resp.samples.length !== 1) return;
                        _fetchAnalysesResultsFor(resp.samples[0].uid);
                    });

                    await Swal.fire('Its Happening!', 'Your samples have been cancelled.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // CLONE_SAMPLES
    const cloneSamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to clone these samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, clone now!',
                cancelButtonText: 'No, do not clone!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<CloneSamplesMutation, CloneSamplesMutationVariables>(CloneSamplesDocument, { samples: uids }, 'cloneSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _addSampleClones(resp.samples);
                    });

                    await Swal.fire('Its Happening!', 'Processing in the background...', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // REINSTATE_SAMPLES
    const reInstateSamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to reinstate samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, reinstate now!',
                cancelButtonText: 'No, do not reinstate!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<ReInstateSamplesMutation, ReInstateSamplesMutationVariables>(ReInstateSamplesDocument, { samples: uids }, 'reInstateSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                        if (resp.samples.length !== 1) return;
                        _fetchAnalysesResultsFor(resp.samples[0].uid);
                    });

                    await Swal.fire('Its Happening!', 'Your samples have been reinstated.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // RECEIVE_SAMPLES
    const receiveSamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to receive samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, receice now!',
                cancelButtonText: 'No, do not receive!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<ReceiveSamplesMutation, ReceiveSamplesMutationVariables>(ReceiveSamplesDocument, { samples: uids }, 'receiveSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                        if (resp.samples.length !== 1) return;
                        _fetchAnalysesResultsFor(resp.samples[0].uid);
                    });

                    await Swal.fire('Its Happening!', 'Your samples have been received.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // RECOVER
    const recoverSamples = async (sampleUids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to recover these samples from storage',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, recover now!',
                cancelButtonText: 'No, do not recover!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<RecoverSamplesMutation, RecoverSamplesMutationVariables>(RecoverSamplesDocument, { sampleUids }, 'recoverSamples').then(resp => {
                        if (resp.length <= 0) return;
                        _updateSamples(resp.samples);
                        if (resp.samples.length !== 1) return;
                        _fetchAnalysesResultsFor(resp.samples[0].uid);
                    });

                    await Swal.fire('Its Happening!', 'Your samples have been recovered.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // PUBLISH_SAMPLES
    const publishSamples = async (samples: any[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to publish samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, publish now!',
                cancelButtonText: 'No, do not publish!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<PublishSamplesMutation, PublishSamplesMutationVariables>(PublishSamplesDocument, { samples }, 'publishSamples').then(resp => {
                        toastInfo(resp.message);
                    });

                    await Swal.fire('Its Happening!', 'Your sample were submitted for impress', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // DOWNLOAD_IMPRESS by SAMPLES
    const downloadSamplesImpress = async (sampleIds: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to download pdfs',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, download now!',
                cancelButtonText: 'No, do not download!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientQuery<ImpressSampleReportsQuery, ImpressSampleReportsQueryVariables>(ImpressSampleReportDocument, { sampleIds }, 'impressReportsDownload').then(resp => {
                        const tempLink = document.createElement('a');
                        tempLink.href = `data:application/pdf;base64,${resp}`;
                        tempLink.setAttribute('download', 'impress-report.pdf');
                        tempLink.click();
                    });

                    await Swal.fire('Its Happening!', 'Downloading .....', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // DOWNLOAD_IMPRESS
    const downloadImpress = async impressUid => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to download this report',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, download now!',
                cancelButtonText: 'No, do not download!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientQuery<ImpressSampleReportQuery, ImpressSampleReportQueryVariables>(ImpressSampleReportDocument, { impressUid }, 'impressReportDownload').then(resp => {
                        const tempLink = document.createElement('a');
                        tempLink.href = `data:application/pdf;base64,${resp}`;
                        tempLink.setAttribute('download', 'impress-report.pdf');
                        tempLink.click();
                    });

                    await Swal.fire('Its Happening!', 'Downloading .....', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };    

    const barcodeSamples = async (sampleUids: string[]) => {
        let data = [];
        try {
            await withClientQuery<BarcodeSamplesQuery, BarcodeSamplesQueryVariables>(BarcodeSamplesDocument, { sampleUids }, 'barcodeSamples')
            .then(resp => (data = resp));
        } catch (error) {}
        return data
    };

    // PRINT_SAMPLES
    const printSamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to flag as printed',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, flag now!',
                cancelButtonText: 'No, do not flag!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<PrintSamplesMutation, PrintSamplesMutationVariables>(PrintSamplesDocument, { samples: uids }, 'printSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                        if (resp.samples.length !== 1) return;
                        _fetchAnalysesResultsFor(resp.samples[0].uid);
                    });

                    await Swal.fire('Its Happening!', 'Your sample have been marked as printed.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // verify sample(s) incase it did not auto transition
    const verifySamples = async (uids: string[]) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to verify sample',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, verify now!',
                cancelButtonText: 'No, do not verify!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<VerifySamplesMutation, VerifySamplesMutationVariables>(VerifySamplesDocument, { samples: uids }, 'verifySamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                    });

                    await Swal.fire('Its Happening!', 'Your sample have been verified.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // reject sample(s)
    const rejectSamples = async (samples: any[]) => {
        let rejected = false;
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to invalidate sample',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Reject  now!',
                cancelButtonText: 'No, do not reject!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<RejectSamplesMutation, RejectSamplesMutationVariables>(RejectSamplesDocument, { samples }, 'rejectSamples').then(resp => {
                        rejected = true;
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                    });

                    await Swal.fire('Its Happening!', 'Your sample(s) have been rejected.', 'success').then(_ => {}); // router.push({ name: "samples-listing" })
                }
            });
        } catch (error) {}
        return rejected;
    };

    // invalidate sample
    const invalidateSamples = async (uids: string[]): Promise<ISample[]> => {
        let invalidated: ISample[] = [];
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to invalidate sample',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, invalidate now!',
                cancelButtonText: 'No, do not invalidate!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<InvalidateSamplesMutation, InvalidateSamplesMutationVariables>(InvalidateSamplesDocument, { samples: uids }, 'invalidateSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                        _updateSampleStatus(resp.samples[0]);
                    });

                    await Swal.fire('Its Happening!', 'Your sample(s) have been invalidated.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
        return invalidated;
    };

    // store samples
    const storeSamples = async (storageParams): Promise<ISample[]> => {
        let stored: ISample[] = [];
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to store these samples',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, store now!',
                cancelButtonText: 'No, do not store!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientMutation<StoreSamplesMutation, StoreSamplesMutationVariables>(StoreSamplesDocument, { payload: storageParams }, 'storeSamples').then(resp => {
                        if (resp.samples.length <= 0) return;
                        _updateSamplesStatus(resp.samples);
                    });

                    await Swal.fire('Its Happening!', 'Your sample(s) have been added to storage.', 'success').then(_ => {});
                }
            });
        } catch (error) {}
        return stored;
    };

    return {
        ...toRefs(state),
        cancelSamples,
        reInstateSamples,
        receiveSamples,
        recoverSamples,
        verifySamples,
        printSamples,
        publishSamples,
        downloadSamplesImpress,
        downloadImpress,
        barcodeSamples,
        invalidateSamples,
        rejectSamples,
        storeSamples,
        cloneSamples,
    };
}
