import { defineStore } from 'pinia';
import { parseEdgeNodeToList, addListsUnique } from '@/utils/helpers';

import { IAnalysisRequest, ISampleType, ISample, IAnalysisResult, IQCSet } from '@/models/analysis';
import { IPageInfo, IPaginationMeta } from '@/models/pagination';

import useApiUtil from '@/composables/api_util';
import { GeSampleTypeMappingsBySampleTypeUidDocument, GeSampleTypeMappingsBySampleTypeUidQuery, GeSampleTypeMappingsBySampleTypeUidQueryVariables, GetAllSamplesDocument, GetAllSamplesQuery, GetAllSamplesQueryVariables, GetAllSampleTypesDocument, GetAllSampleTypesQuery, GetAllSampleTypesQueryVariables, GetAnalysesRequestsByClientUidDocument, GetAnalysesRequestsByClientUidQuery, GetAnalysesRequestsByClientUidQueryVariables, GetAnalysesRequestsByPatientUidDocument, GetAnalysesRequestsByPatientUidQueryVariables, GetAnalysesResultsBySampleUidDocument, GetAnalysesResultsBySampleUidQueryVariables, GetQcSetByUidDocument, GetQcSetByUidQuery, GetQcSetByUidQueryVariables, GetQcSeTsDocument, GetQcSeTsQuery, GetQcSeTsQueryVariables, GetSampleByUidDocument, GetSampleByUidQuery, GetSampleByUidQueryVariables, GetSampleParentIdDocument, GetSampleParentIdQuery, GetSampleParentIdQueryVariables } from '@/graphql/operations/analyses.queries';

const { withClientQuery } = useApiUtil();

export const useSampleStore = defineStore('sample', {
    state: () => {
        return {
            sampleTypes: [],
            sampleTypesMappings: [],
            fetchingSampleTypes: false,
            samples: [],
            fetchingSamples: false,
            sampleCount: 0,
            samplePageInfo: undefined,
            sample: undefined,
            fetchingSample: false,
            repeatSample: undefined,
            fetchingRepeatSample: false,
            fetchingSamplesStatuses: false,
            analysisRequests: [], // for patient detail
            fetchingAnalysisRequests: false,
            analysisResults: [],
            fetchingResults: false,
            qcSets: [],
            fetchingQCSets: false,
            qcSet: undefined,
            fetchingQCSet: false,
            qcSetCount: 0,
            qcSetPageInfo: undefined,
        } as {
            sampleTypes: ISampleType[];
            sampleTypesMappings: any[],
            fetchingSampleTypes: boolean;
            samples: ISample[];
            fetchingSamples: boolean;
            fetchingSamplesStatuses: boolean;
            sampleCount: number;
            samplePageInfo?: IPageInfo;
            sample?: ISample;
            fetchingSample: boolean;
            repeatSample?: ISample;
            fetchingRepeatSample: boolean;
            analysisRequests: IAnalysisRequest[];
            fetchingAnalysisRequests: boolean;
            analysisResults: IAnalysisResult[];
            fetchingResults: boolean;
            qcSets: IQCSet[];
            fetchingQCSets: boolean;
            qcSet?: IQCSet | null;
            fetchingQCSet: boolean;
            qcSetCount: number;
            qcSetPageInfo?: IPaginationMeta;
        };
    },
    getters: {
        getSampleTypes: state => state.sampleTypes,
        getSampleTypesMappings: state => state.sampleTypesMappings,
        getSampleTypeByName: state => (name: string) =>
            state.sampleTypes?.find(st => st.name?.toString().toLowerCase().trim() === name.toString().toLowerCase().trim()),
        getSamples: state => state.samples,
        getSampleCount: state => state.sampleCount,
        getSamplePageInfo: state => state.samplePageInfo,
        getSample: state => state.sample,
        getRepeatSample: state => state.repeatSample,
        getAnalysisRequests: state => state.analysisRequests,
        getAnalysisResults: state => state.analysisResults,
        getQCSets: state => state.qcSets,
        getQCSet: state => state.qcSet,
        getQCSetCount: state => state.qcSetCount,
        getQCSetPageInfo: state => state.qcSetPageInfo,
    },
    actions: {
        // SAMPLE TYPES
        async fetchSampleTypes() {
            this.fetchingSampleTypes = true;
            await withClientQuery<GetAllSampleTypesQuery, GetAllSampleTypesQueryVariables>(GetAllSampleTypesDocument, {}, 'sampleTypeAll')
                .then(payload => {
                    this.fetchingSampleTypes = false;
                    this.sampleTypes = payload;
                })
                .catch(err => (this.fetchingSampleTypes = false));
        },
        updateSampleType(payload) {
            const index = this.sampleTypes.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.sampleTypes[index] = payload;
        },
        addSampleType(payload) {
            this.sampleTypes?.unshift(payload);
        },       
        
        async fetchSampleTypesMappings(profileUid) {
            await withClientQuery<GeSampleTypeMappingsBySampleTypeUidQuery, GeSampleTypeMappingsBySampleTypeUidQueryVariables>(GeSampleTypeMappingsBySampleTypeUidDocument, { uid: profileUid }, 'sampleTypeMappingsBySampleType').then(payload => (this.sampleTypesMappings = payload));
        },
        addSampleTypesMapping(payload) {
            this.sampleTypesMappings?.unshift(payload);
        },
        updateSampleTypesMapping(payload) {
            const index = this.sampleTypesMappings.findIndex(x => x.uid === payload.uid);
            this.sampleTypesMappings[index] = payload;
        },

        // SAMPLES
        resetSamples() {
            this.samples = [];
        },
        resetSample() {
            this.sample = undefined;
        },
        resetRepeatSample() {
            this.repeatSample = undefined;
        },
        setRepeatSample(sample) {
            this.repeatSample = sample;
        },
        async fetchSamples(params) {
            this.fetchingSamples = true;
            await withClientQuery<GetAllSamplesQuery, GetAllSamplesQueryVariables>(GetAllSamplesDocument, params, undefined)
                .then(payload => {
                    this.fetchingSamples = false;
                    const page = payload.sampleAll;
                    const samples = page.items;

                    if (params.filterAction) {
                        this.samples = samples;
                    } else {
                        this.samples = addListsUnique(this.samples, samples, 'uid');
                    }

                    this.sampleCount = page?.totalCount;
                    this.samplePageInfo = page?.pageInfo;
                })
                .catch(err => (this.fetchingSamples = false));
        },
        async fetchSampleByUid(uid) {
            if (!uid) return;
            this.fetchingSample = true;
            await withClientQuery<GetSampleByUidQuery, GetSampleByUidQueryVariables>(GetSampleByUidDocument, { uid }, 'sampleByUid', 'network-only')
                .then(payload => {
                    this.fetchingSample = false;
                    payload.analyses = parseEdgeNodeToList(payload?.analyses) || [];
                    payload.profiles = parseEdgeNodeToList(payload?.profiles) || [];
                    this.sample = payload;
                })
                .catch(err => (this.fetchingSample = false));
        },
        addSamples(samples) {
            this.samples = addListsUnique(this.samples, samples, 'uid');
        },
        addSampleClones(clones) {
            clones = clones.map(cl => {
                let cloned = cl;
                const idx = this.samples.findIndex(s => s.uid === cl.parentId);
                if (idx > -1) {
                    cloned = { ...this.samples[idx], ...cl };
                }
                return cloned;
            });
            this.samples = [...clones, ...this.samples];
        },
        updateSamplesStatus(samples) {
            samples?.forEach(sample => this.updateSampleStatus(sample));
        },
        updateSampleStatus(sample) {
            const index = this.samples.findIndex(x => x.uid === sample.uid);
            if (index > -1) {
                this.samples[index].status = sample.status;
            }
            if (this.sample?.uid === sample.uid) {
                this.sample!.status = sample.status;
            }
        },
        updateSamples(samples) {
            samples?.forEach(sample => this.updateSample(sample));
        },
        updateSample(sample) {
            const index = this.samples.findIndex(x => x.uid === sample.uid);
            if (index > -1) {
                this.samples[index] = { ...this.samples[index], ...sample };
            }
            if (this.sample?.uid === sample.uid) {
                this.sample = { ...this.sample, ...sample };
            }
        },
        async fetchSampleStatus(uid) {
            if (!uid) {
                return;
            }
            this.fetchingSamplesStatuses = true;
            await withClientQuery<GetSampleByUidQuery, GetSampleByUidQueryVariables>(GetSampleByUidDocument, { uid }, 'sampleByUid', 'network-only')
                .then(payload => {
                    this.fetchingSamplesStatuses = false;
                    if (this.sample && payload.status) {
                        this.sample.status = payload.status;
                    }
                    // also update sample listing
                    this.updateSampleStatus(payload);
                })
                .catch(err => (this.fetchingSamplesStatuses = false));
        },
        async fetchRepeatSampleByParentId(parentId) {
            if (!parentId) {
                return;
            }
            this.fetchingRepeatSample = true;
            await withClientQuery<GetSampleParentIdQuery, GetSampleParentIdQueryVariables>(GetSampleParentIdDocument, { parentId, text: 'repeat' }, 'sampleByParentId')
                .then(payload => {
                    this.fetchingRepeatSample = false;
                    if (payload?.length > 0) {
                        this.repeatSample = payload[0];
                    }
                })
                .catch(err => (this.fetchingRepeatSample = false));
        },

        // analysis request
        resetAnalysisRequests() {
            this.analysisRequests = [];
        },
        async fetchAnalysisRequestsForPatient(uid) {
            if (!uid) {
                return;
            }
            this.fetchingAnalysisRequests = true;
            await withClientQuery<GetAnalysesRequestsByPatientUidQuery, GetAnalysesRequestsByPatientUidQueryVariables>(GetAnalysesRequestsByPatientUidDocument, { uid }, 'analysisRequestsByPatientUid')
                .then(payload => {
                    this.fetchingAnalysisRequests = false;
                    this.analysisRequests = sortAnalysisRequests(payload);
                })
                .catch(err => (this.fetchingAnalysisRequests = false));
        },
        async fetchAnalysisRequestsForClient(uid) {
            if (!uid) {
                return;
            }
            this.fetchingAnalysisRequests = true;
            await withClientQuery<GetAnalysesRequestsByClientUidQuery, GetAnalysesRequestsByClientUidQueryVariables>(GetAnalysesRequestsByClientUidDocument, { uid }, 'analysisRequestsByClientUid')
                .then(payload => {
                    this.fetchingAnalysisRequests = false;
                    this.analysisRequests = sortAnalysisRequests(payload);
                })
                .catch(err => (this.fetchingAnalysisRequests = false));
        },
        addAnalysisRequest(payload) {
            this.analysisRequests?.unshift(payload);
        },

        // analysis results
        async fetchAnalysisResultsForSample(uid) {
            if (!uid) return;
            this.fetchingResults = true;
            await withClientQuery<GetAnalysesResultsBySampleUidQueryVariables, GetAnalysesResultsBySampleUidQueryVariables>(GetAnalysesResultsBySampleUidDocument, { uid }, 'analysisResultBySampleUid', 'network-only')
                .then(payload => {
                    this.fetchingResults = false;
                    this.analysisResults = sortResults(payload);
                })
                .catch(err => (this.fetchingResults = false));
        },
        updateAnalysesResults(payload: IAnalysisResult[]) {
            payload?.forEach(result => {
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index] = {
                        ...this.analysisResults[index],
                        ...result,
                    };
                } else {
                    this.analysisResults?.push(result);
                }
            });
        },
        updateAnalysesResultsStatus(payload: any[]) {
            payload?.forEach(result => {
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index].status = result.status;
                }
            });
        },
        backgroundProcessing(payload: any[], sampleUid: any, process) {
            payload?.forEach(result => {
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index].status = process;
                }
            });
            if (sampleUid) {
                if (this.sample?.uid === sampleUid) {
                    this.sample!.status = process;
                }
                const index = this.samples.findIndex(x => x.uid === sampleUid);
                if (index > -1) {
                    this.samples[index].status = process;
                }
            }
        },

        // QC SETS
        resetQCSets() {
            this.qcSet = undefined;
        },
        async fetchQCSets(params) {
            this.fetchingQCSets = true;
            await withClientQuery<GetQcSeTsQuery, GetQcSeTsQueryVariables>(GetQcSeTsDocument, params, undefined)
                .then(payload => {
                    this.fetchingQCSets = false;
                    const page = payload.qcSetAll;
                    const qcSets = page.items;

                    if (params.filterAction) {
                        this.qcSets = [];
                        this.qcSets = qcSets;
                    } else {
                        this.qcSets = addListsUnique(this.qcSets, qcSets, 'uid');
                    }

                    this.qcSetCount = page?.totalCount;
                    this.qcSetPageInfo = page?.pageInfo;
                })
                .catch(err => (this.fetchingQCSets = false));
        },
        async fetchQCSetByUid(uid) {
            if (!uid) {
                return;
            }
            this.fetchingQCSet = true;
            await withClientQuery<GetQcSetByUidQuery, GetQcSetByUidQueryVariables>(GetQcSetByUidDocument, { uid }, 'qcSetByUid')
                .then(payload => {
                    this.fetchingQCSet = false;
                    this.qcSet = payload;
                })
                .catch(err => (this.fetchingQCSet = false));
        },
        addQCSets(payload) {
            this.qcSets = addListsUnique(payload, this.qcSets, 'uid');
        },
    },
});

function sortAnalysisRequests(ars: IAnalysisRequest[]): IAnalysisRequest[] {
    return ars?.sort((a: IAnalysisRequest, b: IAnalysisRequest) => ((a?.createdAt || 0) < (b?.createdAt || 1) ? 1 : -1));
}

function sortResults(results: IAnalysisResult[]): IAnalysisResult[] {
    return results?.sort((a: IAnalysisResult, b: IAnalysisResult) => {
        if (a?.analysisUid === b?.analysisUid) {
            return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
        }
        return (a?.analysis?.sortKey || 0) > (b?.analysis?.sortKey || 1) ? 1 : -1;
    });
}
