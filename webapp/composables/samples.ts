import Swal from 'sweetalert2';
import { toRefs, computed, reactive } from 'vue';
import {
    REINSTATE_SAMPLES,
    RECEIVE_SAMPLES,
    CANCEL_SAMPLES,
    CLONE_SAMPLES,
    PRINT_SAMPLES,
    PUBLISH_SAMPLES,
    INVALIDATE_SAMPLES,
    VERIFY_SAMPLES,
    REJECT_SAMPLES,
} from '../graphql/operations/analyses.mutations';
import { BARCODE_SAMPLES, DOWNLOAD_IMPRESS, DOWNLOAD_IMPRESS_SAMPLES } from '../graphql/operations/analyses.queries';
import { RECOVER_SAMPLES, STORE_SAMPLES } from '../graphql/operations/storage.mutations';
import { useSampleStore } from '../stores';
import { ISample } from '../models/analysis';
import useApiUtil from './api_util';
import useNotifyToast from './alert_toast';

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
                    withClientMutation(CANCEL_SAMPLES, { samples: uids }, 'cancelSamples').then(resp => {
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
                    withClientMutation(CLONE_SAMPLES, { samples: uids }, 'cloneSamples').then(resp => {
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
                    withClientMutation(REINSTATE_SAMPLES, { samples: uids }, 'reInstateSamples').then(resp => {
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
                    withClientMutation(RECEIVE_SAMPLES, { samples: uids }, 'receiveSamples').then(resp => {
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
                    withClientMutation(RECOVER_SAMPLES, { sampleUids }, 'recoverSamples').then(resp => {
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
                    withClientMutation(PUBLISH_SAMPLES, { samples }, 'publishSamples').then(resp => {
                        toastInfo(resp.message);
                    });

                    await Swal.fire('Its Happening!', 'Your sample were submitted for impress', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    // DOWNLOAD_IMPRESS by SAMPLES
    const downloadSamplesImpress = async (uids: string[]) => {
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
                    withClientQuery(DOWNLOAD_IMPRESS_SAMPLES, { uids }, 'impressReportsDownload').then(resp => {
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
    const downloadImpress = async uid => {
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
                    withClientQuery(DOWNLOAD_IMPRESS, { uid }, 'impressReportDownload').then(resp => {
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
        try {
            withClientQuery(BARCODE_SAMPLES, { sampleUids }, 'barcodeSamples').then(resp => {
                const tempLink = document.createElement('a');
                tempLink.href = `data:application/pdf;base64,${resp}`;
                tempLink.setAttribute('download', 'barcodes.pdf');
                // tempLink.setAttribute('target', tempLink.href);
                tempLink.click();
            });
        } catch (error) {}
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
                    withClientMutation(PRINT_SAMPLES, { samples: uids }, 'printSamples').then(resp => {
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
                    withClientMutation(VERIFY_SAMPLES, { samples: uids }, 'verifySamples').then(resp => {
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
                    withClientMutation(REJECT_SAMPLES, { samples }, 'rejectSamples').then(resp => {
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
                    withClientMutation(INVALIDATE_SAMPLES, { samples: uids }, 'invalidateSamples').then(resp => {
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
                    withClientMutation(STORE_SAMPLES, { payload: storageParams }, 'storeSamples').then(resp => {
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
