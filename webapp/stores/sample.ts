import { defineStore } from 'pinia';
import { parseEdgeNodeToList, addListsUnique } from '@/utils';

import useApiUtil from '@/composables/api_util';
import { GeSampleTypeMappingsBySampleTypeUidDocument, GeSampleTypeMappingsBySampleTypeUidQuery, GeSampleTypeMappingsBySampleTypeUidQueryVariables, GetAllSamplesDocument, GetAllSamplesQuery, GetAllSamplesQueryVariables, GetAllSampleTypesDocument, GetAllSampleTypesQuery, GetAllSampleTypesQueryVariables, GetAnalysesRequestsByClientUidDocument, GetAnalysesRequestsByClientUidQuery, GetAnalysesRequestsByClientUidQueryVariables, GetAnalysesRequestsByPatientUidDocument, GetAnalysesRequestsByPatientUidQuery, GetAnalysesRequestsByPatientUidQueryVariables, GetAnalysesResultsBySampleUidDocument, GetAnalysesResultsBySampleUidQuery, GetAnalysesResultsBySampleUidQueryVariables, GetQcSetByUidDocument, GetQcSetByUidQuery, GetQcSetByUidQueryVariables, GetQcSeTsDocument, GetQcSeTsQuery, GetQcSeTsQueryVariables, GetSampleByUidDocument, GetSampleByUidQuery, GetSampleByUidQueryVariables, GetSampleParentIdDocument, GetSampleParentIdQuery, GetSampleParentIdQueryVariables } from '@/graphql/operations/analyses.queries';
import { AnalysisRequestType, AnalysisResultType, PageInfo, QcSetCursorPage, QcSetType, SampleCursorPage, SampleType, SampleTypeTyp } from '@/types/gql';

const { withClientQuery } = useApiUtil();

type SampleStateType = {
    sampleTypes: SampleTypeTyp[];
    sampleTypesMappings: any[];
    fetchingSampleTypes: boolean;
    samples: SampleType[];
    fetchingSamples: boolean;
    fetchingSamplesStatuses: boolean;
    sampleCount: number;
    samplePageInfo?: PageInfo;
    sample?: SampleType;
    fetchingSample: boolean;
    repeatSample?: SampleType;
    fetchingRepeatSample: boolean;
    analysisRequests: AnalysisRequestType[];
    fetchingAnalysisRequests: boolean;
    analysisResults: AnalysisResultType[];
    fetchingResults: boolean;
    qcSets: QcSetType[];
    fetchingQCSets: boolean;
    qcSet?: QcSetType | null;
    fetchingQCSet: boolean;
    qcSetCount: number;
    qcSetPageInfo?: PageInfo;
};

export const useSampleStore = defineStore('sample', {
    state: (): SampleStateType => ({
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
    }),
    getters: {
        getSampleTypes: (state): SampleTypeTyp[] => state.sampleTypes,
        getSampleTypesMappings: (state): any[] => state.sampleTypesMappings,
        getSampleTypeByName: (state) => (name: string): SampleTypeTyp | undefined =>
            state.sampleTypes?.find(st => st.name?.toString().toLowerCase().trim() === name.toString().toLowerCase().trim()),
        getSamples: (state): SampleType[] => state.samples,
        getSampleCount: (state): number => state.sampleCount,
        getSamplePageInfo: (state): PageInfo | undefined => state.samplePageInfo,
        getSample: (state): SampleType | undefined => state.sample,
        getRepeatSample: (state): SampleType | undefined => state.repeatSample,
        getAnalysisRequests: (state): AnalysisRequestType[] => state.analysisRequests,
        getAnalysisResults: (state): AnalysisResultType[] => state.analysisResults,
        getQCSets: (state): QcSetType[] => state.qcSets,
        getQCSet: (state): QcSetType | null | undefined => state.qcSet,
        getQCSetCount: (state): number => state.qcSetCount,
        getQCSetPageInfo: (state): PageInfo | undefined => state.qcSetPageInfo,
    },
    actions: {
        // SAMPLE TYPES
        async fetchSampleTypes(): Promise<void> {
            try {
                this.fetchingSampleTypes = true;
                const result = await withClientQuery<GetAllSampleTypesQuery, GetAllSampleTypesQueryVariables>(
                    GetAllSampleTypesDocument, 
                    {}, 
                    'sampleTypeAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.sampleTypes = result as SampleTypeTyp[];
                } else {
                    console.error('Invalid sample types data received:', result);
                }
            } catch (error) {
                console.error('Error fetching sample types:', error);
            } finally {
                this.fetchingSampleTypes = false;
            }
        },
        
        updateSampleType(payload: SampleTypeTyp): void {
            if (!payload?.uid) {
                console.error('Invalid sample type payload:', payload);
                return;
            }
            
            const index = this.sampleTypes.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.sampleTypes[index] = payload;
            }
        },
        
        addSampleType(payload: SampleTypeTyp): void {
            if (!payload?.uid) {
                console.error('Invalid sample type payload:', payload);
                return;
            }
            
            this.sampleTypes.unshift(payload);
        },
        
        async fetchSampleTypesMappings(profileUid: string): Promise<void> {
            if (!profileUid) {
                console.error('Invalid profile UID provided to fetchSampleTypesMappings');
                return;
            }
            
            try {
                const result = await withClientQuery<GeSampleTypeMappingsBySampleTypeUidQuery, GeSampleTypeMappingsBySampleTypeUidQueryVariables>(
                    GeSampleTypeMappingsBySampleTypeUidDocument, 
                    { uid: profileUid }, 
                    'sampleTypeMappingsBySampleType'
                );
                
                if (result && Array.isArray(result)) {
                    this.sampleTypesMappings = result;
                } else {
                    console.error('Invalid sample type mappings data received:', result);
                }
            } catch (error) {
                console.error('Error fetching sample type mappings:', error);
            }
        },
        
        addSampleTypesMapping(payload: any): void {
            if (!payload?.uid) {
                console.error('Invalid sample type mapping payload:', payload);
                return;
            }
            
            this.sampleTypesMappings.unshift(payload);
        },
        
        updateSampleTypesMapping(payload: any): void {
            if (!payload?.uid) {
                console.error('Invalid sample type mapping payload:', payload);
                return;
            }
            
            const index = this.sampleTypesMappings.findIndex(x => x.uid === payload.uid);
            if (index > -1) {
                this.sampleTypesMappings[index] = payload;
            }
        },

        // SAMPLES
        resetSamples(): void {
            this.samples = [];
        },
        
        resetSample(): void {
            this.sample = undefined;
        },
        
        resetRepeatSample(): void {
            this.repeatSample = undefined;
        },
        
        setRepeatSample(sample: SampleType): void {
            this.repeatSample = sample;
        },
        
        async fetchSamples(params: any): Promise<void> {
            try {
                this.fetchingSamples = true;
                const result = await withClientQuery<GetAllSamplesQuery, GetAllSamplesQueryVariables>(
                    GetAllSamplesDocument, 
                    params, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'sampleAll' in result) {
                    const page = result.sampleAll as SampleCursorPage;
                    const samples = page.items || [];

                    if (params.filterAction) {
                        this.samples = samples as SampleType[];
                    } else {
                        this.samples = addListsUnique(this.samples, samples as SampleType[], 'uid');
                    }

                    this.sampleCount = page?.totalCount || 0;
                    this.samplePageInfo = page?.pageInfo;
                } else {
                    console.error('Invalid samples data received:', result);
                }
            } catch (error) {
                console.error('Error fetching samples:', error);
            } finally {
                this.fetchingSamples = false;
            }
        },
        
        async fetchSampleByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchSampleByUid');
                return;
            }
            
            try {
                this.fetchingSample = true;
                const result = await withClientQuery<GetSampleByUidQuery, GetSampleByUidQueryVariables>(
                    GetSampleByUidDocument, 
                    { uid }, 
                    'sampleByUid', 
                    'network-only'
                );
                
                if (result && typeof result === 'object') {
                    const sample = result as SampleType;
                    sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
                    sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
                    this.sample = sample;
                } else {
                    console.error('Invalid sample data received:', result);
                }
            } catch (error) {
                console.error('Error fetching sample:', error);
            } finally {
                this.fetchingSample = false;
            }
        },
        
        addSamples(samples: SampleType[]): void {
            if (!samples || !Array.isArray(samples)) {
                console.error('Invalid samples payload:', samples);
                return;
            }
            
            this.samples = addListsUnique(this.samples, samples, 'uid');
        },
        
        addSampleClones(clones: SampleType[]): void {
            if (!clones || !Array.isArray(clones)) {
                console.error('Invalid clones payload:', clones);
                return;
            }
            
            const processedClones = clones.map(cl => {
                let cloned = cl;
                const idx = this.samples.findIndex(s => s.uid === cl.parentId);
                if (idx > -1) {
                    cloned = { ...this.samples[idx], ...cl };
                }
                return cloned;
            });
            
            this.samples = [...processedClones, ...this.samples];
        },
        
        updateSamplesStatus(samples: SampleType[]): void {
            if (!samples || !Array.isArray(samples)) {
                console.error('Invalid samples payload for status update:', samples);
                return;
            }
            
            samples.forEach(sample => this.updateSampleStatus(sample));
        },
        
        updateSampleStatus(sample: SampleType): void {
            if (!sample?.uid) {
                console.error('Invalid sample payload for status update:', sample);
                return;
            }
            
            const index = this.samples.findIndex(x => x.uid === sample.uid);
            if (index > -1) {
                this.samples[index].status = sample.status;
            }
            
            if (this.sample?.uid === sample.uid) {
                this.sample.status = sample.status;
            }
        },
        
        updateSamples(samples: SampleType[]): void {
            if (!samples || !Array.isArray(samples)) {
                console.error('Invalid samples payload for update:', samples);
                return;
            }
            
            samples.forEach(sample => this.updateSample(sample));
        },
        
        updateSample(sample: SampleType): void {
            if (!sample?.uid) {
                console.error('Invalid sample payload for update:', sample);
                return;
            }
            
            const index = this.samples.findIndex(x => x.uid === sample.uid);
            if (index > -1) {
                this.samples[index] = { ...this.samples[index], ...sample };
            }
            
            if (this.sample?.uid === sample.uid) {
                this.sample = { ...this.sample, ...sample };
            }
        },
        
        async fetchSampleStatus(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchSampleStatus');
                return;
            }
            
            try {
                this.fetchingSamplesStatuses = true;
                const result = await withClientQuery<GetSampleByUidQuery, GetSampleByUidQueryVariables>(
                    GetSampleByUidDocument, 
                    { uid }, 
                    'sampleByUid', 
                    'network-only'
                );
                
                if (result && typeof result === 'object' && 'status' in result) {
                    if (this.sample && result.status) {
                        this.sample.status = result.status;
                    }
                    
                    // also update sample listing
                    this.updateSampleStatus(result as SampleType);
                } else {
                    console.error('Invalid sample status data received:', result);
                }
            } catch (error) {
                console.error('Error fetching sample status:', error);
            } finally {
                this.fetchingSamplesStatuses = false;
            }
        },
        
        async fetchRepeatSampleByParentId(parentId: string): Promise<void> {
            if (!parentId) {
                console.error('Invalid parent ID provided to fetchRepeatSampleByParentId');
                return;
            }
            
            try {
                this.fetchingRepeatSample = true;
                const result = await withClientQuery<GetSampleParentIdQuery, GetSampleParentIdQueryVariables>(
                    GetSampleParentIdDocument, 
                    { parentId, text: 'repeat' }, 
                    'sampleByParentId'
                );
                
                if (result && Array.isArray(result) && result.length > 0) {
                    this.repeatSample = result[0] as SampleType;
                } else {
                    console.error('No repeat sample found for parent ID:', parentId);
                }
            } catch (error) {
                console.error('Error fetching repeat sample:', error);
            } finally {
                this.fetchingRepeatSample = false;
            }
        },

        // ANALYSIS REQUESTS
        resetAnalysisRequests(): void {
            this.analysisRequests = [];
        },
        
        async fetchAnalysisRequestsForPatient(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchAnalysisRequestsForPatient');
                return;
            }
            
            try {
                this.fetchingAnalysisRequests = true;
                const result = await withClientQuery<GetAnalysesRequestsByPatientUidQuery, GetAnalysesRequestsByPatientUidQueryVariables>(
                    GetAnalysesRequestsByPatientUidDocument, 
                    { uid }, 
                    'analysisRequestsByPatientUid'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysisRequests = sortAnalysisRequests(result as AnalysisRequestType[]);
                } else {
                    console.error('Invalid analysis requests data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis requests for patient:', error);
            } finally {
                this.fetchingAnalysisRequests = false;
            }
        },
        
        async fetchAnalysisRequestsForClient(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchAnalysisRequestsForClient');
                return;
            }
            
            try {
                this.fetchingAnalysisRequests = true;
                const result = await withClientQuery<GetAnalysesRequestsByClientUidQuery, GetAnalysesRequestsByClientUidQueryVariables>(
                    GetAnalysesRequestsByClientUidDocument, 
                    { uid }, 
                    'analysisRequestsByClientUid'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysisRequests = sortAnalysisRequests(result as AnalysisRequestType[]);
                } else {
                    console.error('Invalid analysis requests data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis requests for client:', error);
            } finally {
                this.fetchingAnalysisRequests = false;
            }
        },
        
        addAnalysisRequest(payload: AnalysisRequestType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis request payload:', payload);
                return;
            }
            
            this.analysisRequests.unshift(payload);
        },

        // ANALYSIS RESULTS
        async fetchAnalysisResultsForSample(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchAnalysisResultsForSample');
                return;
            }
            
            try {
                this.fetchingResults = true;
                const result = await withClientQuery<GetAnalysesResultsBySampleUidQuery, GetAnalysesResultsBySampleUidQueryVariables>(
                    GetAnalysesResultsBySampleUidDocument, 
                    { uid }, 
                    'analysisResultBySampleUid',
                    'network-only'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysisResults = sortResults(result as AnalysisResultType[]);
                } else {
                    console.error('Invalid analysis results data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis results for sample:', error);
            } finally {
                this.fetchingResults = false;
            }
        },
        
        updateAnalysesResults(payload: AnalysisResultType[]): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid analysis results payload:', payload);
                return;
            }
            
            payload.forEach(result => {
                if (!result?.uid) {
                    console.error('Invalid analysis result item:', result);
                    return;
                }
                
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index] = {
                        ...this.analysisResults[index],
                        ...result,
                    };
                } else {
                    this.analysisResults.push(result);
                }
            });
        },
        
        updateAnalysesResultsStatus(payload: any[]): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid analysis results status payload:', payload);
                return;
            }
            
            payload.forEach(result => {
                if (!result?.uid) {
                    console.error('Invalid analysis result status item:', result);
                    return;
                }
                
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index].status = result.status;
                }
            });
        },
        
        backgroundProcessing(payload: any[], sampleUid: string, process: string): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid background processing payload:', payload);
                return;
            }
            
            payload.forEach(result => {
                if (!result?.uid) {
                    console.error('Invalid background processing item:', result);
                    return;
                }
                
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index].status = process;
                }
            });
            
            if (sampleUid) {
                if (this.sample?.uid === sampleUid) {
                    this.sample.status = process;
                }
                
                const index = this.samples.findIndex(x => x.uid === sampleUid);
                if (index > -1) {
                    this.samples[index].status = process;
                }
            }
        },

        // QC SETS
        resetQCSets(): void {
            this.qcSet = undefined;
        },
        
        async fetchQCSets(params: any): Promise<void> {
            try {
                this.fetchingQCSets = true;
                const result = await withClientQuery<GetQcSeTsQuery, GetQcSeTsQueryVariables>(
                    GetQcSeTsDocument, 
                    params, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'qcSetAll' in result) {
                    const page = result.qcSetAll as QcSetCursorPage;
                    const qcSets = page.items || [];

                    if (params.filterAction) {
                        this.qcSets = [];
                        this.qcSets = qcSets as QcSetType[];
                    } else {
                        this.qcSets = addListsUnique(this.qcSets, qcSets as QcSetType[], 'uid');
                    }

                    this.qcSetCount = page?.totalCount || 0;
                    this.qcSetPageInfo = page?.pageInfo;
                } else {
                    console.error('Invalid QC sets data received:', result);
                }
            } catch (error) {
                console.error('Error fetching QC sets:', error);
            } finally {
                this.fetchingQCSets = false;
            }
        },
        
        async fetchQCSetByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchQCSetByUid');
                return;
            }
            
            try {
                this.fetchingQCSet = true;
                const result = await withClientQuery<GetQcSetByUidQuery, GetQcSetByUidQueryVariables>(
                    GetQcSetByUidDocument, 
                    { uid }, 
                    'qcSetByUid'
                );
                
                if (result && typeof result === 'object') {
                    this.qcSet = result as QcSetType;
                } else {
                    console.error('Invalid QC set data received:', result);
                }
            } catch (error) {
                console.error('Error fetching QC set:', error);
            } finally {
                this.fetchingQCSet = false;
            }
        },
        
        addQCSets(payload: QcSetType[]): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid QC sets payload:', payload);
                return;
            }
            
            this.qcSets = addListsUnique(payload, this.qcSets, 'uid');
        },
    },
});

function sortAnalysisRequests(ars: AnalysisRequestType[]): AnalysisRequestType[] {
    return ars?.sort((a: AnalysisRequestType, b: AnalysisRequestType) => ((a?.createdAt || 0) < (b?.createdAt || 1) ? 1 : -1));
}

function sortResults(results: AnalysisResultType[]): AnalysisResultType[] {
    return results?.sort((a: AnalysisResultType, b: AnalysisResultType) => {
        if (a?.analysisUid === b?.analysisUid) {
            return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
        }
        return (a?.analysis?.sortKey || 0) > (b?.analysis?.sortKey || 1) ? 1 : -1;
    });
}
