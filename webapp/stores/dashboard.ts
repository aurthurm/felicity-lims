import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {
    GetSampleGroupByStatusDocument, GetSampleGroupByStatusQuery, GetSampleGroupByStatusQueryVariables,
    GetAnalysisGroupByStatusDocument, GetAnalysisGroupByStatusQuery, GetAnalysisGroupByStatusQueryVariables,
    GetWorksheetGroupByStatusDocument, GetWorksheetGroupByStatusQuery, GetWorksheetGroupByStatusQueryVariables,
    GetExtrasGroupByStatusDocument, GetExtrasGroupByStatusQuery, GetExtrasGroupByStatusQueryVariables,
    GetAnalysisGroupByInstrumentDocument, GetAnalysisGroupByInstrumentQuery, GetAnalysisGroupByInstrumentQueryVariables,
    GetAnalysisProcessPeformanceQuery, GetAnalysisProcessPeformanceQueryVariables, GetAnalysisProcessPeformanceDocument,
    GetSampleLaggardsDocument, GetSampleLaggardsQuery, GetSampleLaggardsQueryVariables,
    SampleGroupByActionQuery,
    SampleGroupByActionQueryVariables,
    SampleGroupByActionDocument,
    SampleProcessPeformanceQuery,
    SampleProcessPeformanceQueryVariables,
    SampleProcessPeformanceDocument,
} from '@/graphql/operations/dashboard.queries';
import { mapOrder } from '@/utils';

import useApiUtil from '@/composables/api_util';
import { 
    GroupCount, 
    GroupData, 
    LaggardData, 
} from '@/types/gql';

const { withClientQuery } = useApiUtil();

interface SampleCounts {
    totalSamples: number;
    totalLate: number;
    totalNotLate: number;
    processAverage: number;
    avgExtraDays: number;
}

interface AnalysisGroup extends SampleCounts {
    service: string;
}

interface Process {
    process: string;
    counts: SampleCounts;
    groups: AnalysisGroup[];
}

dayjs.extend(quarterOfYear);

export const useDashBoardStore = defineStore('dashboard', () => {
    const dashboard = ref({
        currentTab: 'overview',
        tabs: ['overview', 'resource', 'laggard', 'peformance', 'notices', 'line-listing'], // 'tat'
        showFilters: false,
        filterRange: { from: '', fromIso: '', to: '', toIso: '' },
        currentFilter: 'TW',
        filters: ['T', 'Y', 'TW', 'LW', 'TM', 'LM', 'TQ', 'LQ', 'TY'],
        overViewStats: {
            analyses: [] as GroupCount[],
            samples: [] as GroupCount[],
            extras: [] as GroupCount[],
            worksheets: [] as GroupCount[],
        },
        fetchingOverViewStats: false,
        resourceStats: {
            instruments: [] as GroupCount[],
            samples: [] as GroupData[],
        },
        fetchingResourceStats: false,
        peformancePeriods: [30, 60, 90, 180, 365],
        currentPeformancePeriod: 30,
        peformanceStats: {
            sample: [] as Process[],
            analysis: [] as Process[],
        },
        fetchingSampePeformanceStats: false,
        fetchingAnalysisPeformanceStats: false,
        currentPeformance: 'received_to_published',
        performances: ['received_to_published', 'received_to_submitted', 'submitted_to_verified', 'verified_to_published'],
        perfs: {
            received_to_published: 'Received to Published',
            received_to_submitted: 'Received to Submitted',
            submitted_to_verified: 'Submitted to Verified',
            verified_to_published: 'Verified to Published',
        },
        laggards: {} as Record<string, LaggardData[]>,
        fetchingLaggards: false,
    });

    const filterToolTip = (filter: string): string => {
        if (filter === 'T') return 'Today';
        if (filter === 'Y') return 'Yesterday';
        if (filter === 'TW') return 'This Week';
        if (filter === 'LW') return 'Last Week';
        if (filter === 'TM') return 'This Month';
        if (filter === 'LM') return 'Last Month';
        if (filter === 'TQ') return 'This Quarter';
        if (filter === 'LQ') return 'Last Quarter';
        if (filter === 'TY') return 'This Year';
        return 'Unknown Filter';
    };

    // get_OverViewStats
    const getOverViewStats = async (): Promise<void> => {
        dashboard.value.fetchingOverViewStats = true;
        try {
            await countSamplesGroupsByStatus();
            await countAnalysisGroupsByStatus();
            await countWrksheetGroupsByStatus();
            await countExtrasGroupsByStatus();
        } catch (error) {
            console.error('Error fetching overview stats:', error);
        } finally {
            dashboard.value.fetchingOverViewStats = false;
        }
    };

    // get_PeformanceStats
    const getResourceStats = async (): Promise<void> => {
        dashboard.value.fetchingResourceStats = true;
        try {
            await countAnalysisGroupsByInstrument();
            await getSampleGroupByAction();
        } catch (error) {
            console.error('Error fetching resource stats:', error);
        } finally {
            dashboard.value.fetchingResourceStats = false;
        }
    };

    // GET_SAMPLE_GROUP_BY_STATUS
    const countSamplesGroupsByStatus = async (): Promise<void> => {
        try {
            const filters: { [key: string]: never } = {};
            
            const result = await withClientQuery<GetSampleGroupByStatusQuery, GetSampleGroupByStatusQueryVariables>(
                GetSampleGroupByStatusDocument, 
                filters, 
                'countSampleGroupByStatus', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.overViewStats.samples = mapOrder(
                    result.data,
                    ['scheduled', 'expected', 'received', 'awaiting', 'approved'],
                    'group'
                );
            } else {
                console.error('Invalid sample group by status data received:', result);
            }
        } catch (error) {
            console.error('Error counting samples groups by status:', error);
        }
    };

    // GET_ANALYSIS_GROUP_BY_STATUS
    const countAnalysisGroupsByStatus = async (): Promise<void> => {
        try {
            const filters: { [key: string]: never } = {};
            
            const result = await withClientQuery<GetAnalysisGroupByStatusQuery, GetAnalysisGroupByStatusQueryVariables>(
                GetAnalysisGroupByStatusDocument, 
                {}, 
                'countAnalyteGroupByStatus', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.overViewStats.analyses = mapOrder(
                    result.data, 
                    ['pending', 'resulted'], 
                    'group'
                );
            } else {
                console.error('Invalid analysis group by status data received:', result);
            }
        } catch (error) {
            console.error('Error counting analysis groups by status:', error);
        }
    };

    // GET_WORKSHEET_GROUP_BY_STATUS
    const countWrksheetGroupsByStatus = async (): Promise<void> => {
        try {
            const filters: { [key: string]: never } = {};
            
            const result = await withClientQuery<GetWorksheetGroupByStatusQuery, GetWorksheetGroupByStatusQueryVariables>(
                GetWorksheetGroupByStatusDocument, 
                filters, 
                'countWorksheetGroupByStatus', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.overViewStats.worksheets = mapOrder(
                    result.data, 
                    ['empty', 'awaiting', 'pending'], 
                    'group'
                );
            } else {
                console.error('Invalid worksheet group by status data received:', result);
            }
        } catch (error) {
            console.error('Error counting worksheet groups by status:', error);
        }
    };

    // GET_extras_GROUP_BY_STATUS
    const countExtrasGroupsByStatus = async (): Promise<void> => {
        try {
            const filters: { [key: string]: never } = {};
            
            const result = await withClientQuery<GetExtrasGroupByStatusQuery, GetExtrasGroupByStatusQueryVariables>(
                GetExtrasGroupByStatusDocument, 
                filters, 
                'countExtrasGroupByStatus', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.overViewStats.extras = mapOrder(
                    result.data,
                    ['sample cancelled', 'sample rejected', 'sample invalidated', 'analysis retracted', 'analysis retested'],
                    'group'
                );
            } else {
                console.error('Invalid extras group by status data received:', result);
            }
        } catch (error) {
            console.error('Error counting extras groups by status:', error);
        }
    };

    // GET_ANALYSIS_GROUP_BY_INSTRUMENT
    const countAnalysisGroupsByInstrument = async (): Promise<void> => {
        try {
            const filters = {
                startDate: dashboard.value.filterRange.fromIso,
                endDate: dashboard.value.filterRange.toIso,
            };
            
            const result = await withClientQuery<GetAnalysisGroupByInstrumentQuery, GetAnalysisGroupByInstrumentQueryVariables>(
                GetAnalysisGroupByInstrumentDocument, 
                filters, 
                'countAnalyteGroupByInstrument', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.resourceStats.instruments = result.data;
            } else {
                console.error('Invalid analysis group by instrument data received:', result);
            }
        } catch (error) {
            console.error('Error counting analysis groups by instrument:', error);
        }
    };

    // GET_SAMPLE_GROUPS_BY_ACTION
    const getSampleGroupByAction = async (): Promise<void> => {
        try {
            const filters = {
                startDate: dashboard.value.filterRange.fromIso,
                endDate: dashboard.value.filterRange.toIso,
            };
            
            const result = await withClientQuery<SampleGroupByActionQuery, SampleGroupByActionQueryVariables>(
                SampleGroupByActionDocument, 
                filters, 
                'countSampleGroupByAction', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.resourceStats.samples = result.data;
            } else {
                console.error('Invalid sample group by action data received:', result);
            }
        } catch (error) {
            console.error('Error getting sample groups by action:', error);
        }
    };

    // GET_SAMPLE_PROCESS_PEFORMANCE
    const getSampleProcessPeformance = async (): Promise<void> => {
        try {
            dashboard.value.fetchingSampePeformanceStats = true;
            
            const filters = {
                startDate: dayjs().startOf('day').subtract(dashboard.value.currentPeformancePeriod, 'day').toISOString(),
                endDate: dayjs().endOf('day').toISOString(),
            };
            
            const result = await withClientQuery<SampleProcessPeformanceQuery, SampleProcessPeformanceQueryVariables>(
                SampleProcessPeformanceDocument, 
                filters, 
                'sampleProcessPerformance', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.peformanceStats.sample = result.data as unknown as Process[];
            } else {
                console.error('Invalid sample process performance data received:', result);
            }
        } catch (error) {
            console.error('Error getting sample process performance:', error);
        } finally {
            dashboard.value.fetchingSampePeformanceStats = false;
        }
    };

    // GET_ANALYSIS_PROCESS_PEFORMANCE
    const getAnalysisProcessPeformance = async (): Promise<void> => {
        try {
            dashboard.value.fetchingAnalysisPeformanceStats = true;
            
            const filters = {
                process: dashboard.value.currentPeformance,
                startDate: dayjs().startOf('day').subtract(dashboard.value.currentPeformancePeriod, 'day').toISOString(),
                endDate: dayjs().endOf('day').toISOString(),
            };
            
            const result = await withClientQuery<GetAnalysisProcessPeformanceQuery, GetAnalysisProcessPeformanceQueryVariables>(
                GetAnalysisProcessPeformanceDocument, 
                filters, 
                'analysisProcessPerformance', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.peformanceStats.analysis = result.data as unknown as Process[];
            } else {
                console.error('Invalid analysis process performance data received:', result);
            }
        } catch (error) {
            console.error('Error getting analysis process performance:', error);
        } finally {
            dashboard.value.fetchingAnalysisPeformanceStats = false;
        }
    };

    // GET_SAMPLE_LAGGARDS
    const getSampleLaggards = async (): Promise<void> => {
        try {
            dashboard.value.fetchingLaggards = true;
            
            const result = await withClientQuery<GetSampleLaggardsQuery, GetSampleLaggardsQueryVariables>(
                GetSampleLaggardsDocument, 
                {}, 
                'sampleLaggards', 
                'network-only'
            );
            
            if (result && typeof result === 'object' && 'data' in result) {
                dashboard.value.laggards = result.data as unknown as Record<string, LaggardData[]>;
            } else {
                console.error('Invalid sample laggards data received:', result);
            }
        } catch (error) {
            console.error('Error getting sample laggards:', error);
        } finally {
            dashboard.value.fetchingLaggards = false;
        }
    };

    const setCurrentTab = (tab: string): void => {
        dashboard.value.currentTab = tab;
    };
    
    const setCurrentFilter = (filter: string): void => {
        dashboard.value.currentFilter = filter;
    };
    
    const setFilterRange = (from: dayjs.Dayjs, to: dayjs.Dayjs): void => {
        dashboard.value.filterRange.from = from.toDate().toLocaleDateString();
        dashboard.value.filterRange.fromIso = from.toISOString();
        dashboard.value.filterRange.to = to.toDate().toLocaleDateString();
        dashboard.value.filterRange.toIso = to.toISOString();
    };
    
    const setCurrentPeformance = (event: Event): void => {
        const target = event.target as HTMLSelectElement;
        dashboard.value.currentPeformance = target.value;
    };
    
    const setCurrentPeformancePeriod = (event: Event): void => {
        const target = event.target as HTMLSelectElement;
        const period: number = +target.value;
        dashboard.value.currentPeformancePeriod = period;
    };
    
    const setShowFilters = (show: boolean): void => {
        dashboard.value.showFilters = show;
    };

    const calculateFilterRange = (filter: string): void => {
        switch (filter) {
            case 'T':
                setFilterRange(dayjs().startOf('day'), dayjs().endOf('day'));
                break;

            case 'Y':
                setFilterRange(dayjs().startOf('day').subtract(1, 'day'), dayjs().endOf('day').subtract(1, 'day'));
                break;

            case 'TW':
                setFilterRange(dayjs().startOf('week'), dayjs().endOf('week'));
                break;

            case 'LW':
                setFilterRange(dayjs().startOf('week').subtract(1, 'week'), dayjs().endOf('week').subtract(1, 'week'));
                break;

            case 'TM':
                setFilterRange(dayjs().startOf('month'), dayjs().endOf('month'));
                break;

            case 'LM':
                setFilterRange(dayjs().startOf('month').subtract(1, 'month'), dayjs().endOf('month').subtract(1, 'month'));
                break;

            case 'TQ':
                setFilterRange(dayjs().startOf('quarter'), dayjs().endOf('quarter'));
                break;

            case 'LQ':
                setFilterRange(dayjs().startOf('quarter').subtract(1, 'quarter'), dayjs().endOf('quarter').subtract(1, 'quarter'));
                break;

            case 'TY':
                setFilterRange(dayjs().startOf('year'), dayjs().endOf('year'));
                break;

            default:
                console.error('Unknown Range Selected');
                break;
        }
    };
    
    calculateFilterRange(dashboard.value.currentFilter);

    watch(
        () => dashboard.value.currentFilter,
        (filter) => {
            calculateFilterRange(filter);
        }
    );

    return {
        dashboard,
        setShowFilters,
        filterToolTip,
        setCurrentTab,
        setCurrentFilter,
        setFilterRange,
        getOverViewStats,
        getResourceStats,
        getSampleLaggards,
        getSampleProcessPeformance,
        getAnalysisProcessPeformance,
        setCurrentPeformance,
        setCurrentPeformancePeriod,
    };
});
