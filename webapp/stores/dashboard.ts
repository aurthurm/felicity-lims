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

import  useApiUtil  from '@/composables/api_util';
const { withClientQuery } = useApiUtil();

interface GroupCount {
    group: string;
    count: number;
}
interface ISampleCounts {
    totalSamples: number;
    totalLate: number;
    totalNotLate: number;
    processAverage: number;
    avgExtraDays: number;
}

interface IAnalysisGroup extends ISampleCounts {
    service: string;
}
export interface IProcess {
    process: string;
    counts: ISampleCounts;
    groups: IAnalysisGroup[];
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
            samples: [] as any[],
        },
        fetchingResourceStats: false,
        peformancePeriods: [30, 60, 90, 180, 365],
        currentPeformancePeriod: 30,
        peformanceStats: {
            sample: [] as IProcess[],
            analysis: [] as IProcess[],
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
        laggards: {} as any,
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
    const getOverViewStats = async () => {
        dashboard.value.fetchingOverViewStats = true;
        try {
            await countSamplesGroupsByStatus();
            await countAnalysisGroupsByStatus();
            await countWrksheetGroupsByStatus();
            await countExtrasGroupsByStatus();
        } catch (error) {
            dashboard.value.fetchingOverViewStats = false;
        }
        dashboard.value.fetchingOverViewStats = false;
    };

    // get_PeformanceStats
    const getResourceStats = async () => {
        dashboard.value.fetchingResourceStats = true;
        try {
            await countAnalysisGroupsByInstrument();
            await getSampleGroupByAction();
        } catch (error) {
            dashboard.value.fetchingResourceStats = false;
        }
        dashboard.value.fetchingResourceStats = false;
    };

    // GET_SAMPLE_GROUP_BY_STATUS
    const countSamplesGroupsByStatus = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<GetSampleGroupByStatusQuery, GetSampleGroupByStatusQueryVariables>(GetSampleGroupByStatusDocument, filters, 'countSampleGroupByStatus', 'network-only').then(
            payload =>
                (dashboard.value.overViewStats.samples = mapOrder(
                    payload.data,
                    ['scheduled', 'expected', 'received', 'awaiting', 'approved'],
                    'group'
                ))
        );
    };

    // GET_ANALYSIS_GROUP_BY_STATUS
    const countAnalysisGroupsByStatus = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<GetAnalysisGroupByStatusQuery, GetAnalysisGroupByStatusQueryVariables>(GetAnalysisGroupByStatusDocument, filters, 'countAnalyteGroupByStatus', 'network-only').then(
            payload => (dashboard.value.overViewStats.analyses = mapOrder(payload.data, ['pending', 'resulted'], 'group'))
        );
    };

    // GET_WORKSHEET_GROUP_BY_STATUS
    const countWrksheetGroupsByStatus = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<GetWorksheetGroupByStatusQuery, GetWorksheetGroupByStatusQueryVariables>(GetWorksheetGroupByStatusDocument, filters, 'countWorksheetGroupByStatus', 'network-only').then(
            payload => (dashboard.value.overViewStats.worksheets = mapOrder(payload.data, ['empty', 'awaiting', 'pending'], 'group'))
        );
    };

    // GET_extras_GROUP_BY_STATUS
    const countExtrasGroupsByStatus = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<GetExtrasGroupByStatusQuery, GetExtrasGroupByStatusQueryVariables>(GetExtrasGroupByStatusDocument, filters, 'countExtrasGroupByStatus', 'network-only').then(
            payload =>
                (dashboard.value.overViewStats.extras = mapOrder(
                    payload.data,
                    ['sample cancelled', 'sample rejected', 'sample invalidated', 'analysis retracted', 'analysis retested'],
                    'group'
                ))
        );
    };

    // GET_ANALYSIS_GROUP_BY_INSTRUMENT
    const countAnalysisGroupsByInstrument = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<GetAnalysisGroupByInstrumentQuery, GetAnalysisGroupByInstrumentQueryVariables>(GetAnalysisGroupByInstrumentDocument, filters, 'countAnalyteGroupByInstrument', 'network-only').then(
            payload => (dashboard.value.resourceStats.instruments = payload.data)
        );
    };

    // GET_SAMPLE_GROUPS_BY_ACTION
    const getSampleGroupByAction = async () => {
        const filters = {
            startDate: dashboard.value.filterRange.fromIso,
            endDate: dashboard.value.filterRange.toIso,
        };
        await withClientQuery<SampleGroupByActionQuery, SampleGroupByActionQueryVariables>(SampleGroupByActionDocument, filters, 'countSampleGroupByAction', 'network-only').then(
            payload => (dashboard.value.resourceStats.samples = payload.data)
        );
    };

    // GET_SAMPLE_PROCESS_PEFORMANCE
    const getSampleProcessPeformance = async () => {
        const filters = {
            startDate: dayjs().startOf('day').subtract(dashboard.value.currentPeformancePeriod, 'day').toISOString(),
            endDate: dayjs().endOf('day').toISOString(),
        };
        dashboard.value.fetchingSampePeformanceStats = true;
        await withClientQuery<SampleProcessPeformanceQuery, SampleProcessPeformanceQueryVariables>(SampleProcessPeformanceDocument, filters, 'sampleProcessPerformance', 'network-only')
            .then(payload => {
                dashboard.value.fetchingSampePeformanceStats = false;
                dashboard.value.peformanceStats.sample = payload.data;
            })
            .catch(err => (dashboard.value.fetchingSampePeformanceStats = false));
    };

    // GET_ANALYSIS_PROCESS_PEFORMANCE
    const getAnalysisProcessPeformance = async () => {
        const filters = {
            process: dashboard.value.currentPeformance,
            startDate: dayjs().startOf('day').subtract(dashboard.value.currentPeformancePeriod, 'day').toISOString(),
            endDate: dayjs().endOf('day').toISOString(),
        };
        dashboard.value.fetchingAnalysisPeformanceStats = true;
        await withClientQuery<GetAnalysisProcessPeformanceQuery, GetAnalysisProcessPeformanceQueryVariables>(GetAnalysisProcessPeformanceDocument, filters, 'analysisProcessPerformance', 'network-only')
            .then(payload => {
                dashboard.value.fetchingAnalysisPeformanceStats = false;
                dashboard.value.peformanceStats.analysis = payload.data;
            })
            .catch(err => (dashboard.value.fetchingAnalysisPeformanceStats = false));
    };

    // GET_SAMPLE_LAGGARDS
    const getSampleLaggards = async () => {
        dashboard.value.fetchingLaggards = true;
        await withClientQuery<GetSampleLaggardsQuery, GetSampleLaggardsQueryVariables>(GetSampleLaggardsDocument, {}, 'sampleLaggards', 'network-only')
            .then(payload => {
                dashboard.value.laggards = payload.data;
                dashboard.value.fetchingLaggards = false;
            })
            .catch(err => (dashboard.value.fetchingLaggards = false));
    };

    const setCurrentTab = (tab: string) => (dashboard.value.currentTab = tab);
    const setCurrentFilter = (filter: string) => (dashboard.value.currentFilter = filter);
    const setFilterRange = (from, to) => {
        dashboard.value.filterRange.from = from.toDate().toLocaleDateString();
        dashboard.value.filterRange.fromIso = from.toISOString();
        dashboard.value.filterRange.to = to.toDate().toLocaleDateString();
        dashboard.value.filterRange.toIso = to.toISOString();
    };
    const setCurrentPeformance = (event: any) => {
        dashboard.value.currentPeformance = event.target.value;
    };
    const setCurrentPeformancePeriod = (event: any) => {
        const period: number = +event.target.value;
        dashboard.value.currentPeformancePeriod = period;
    };
    const setShowFilters = (show: boolean) => (dashboard.value.showFilters = show);

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
                alert('Unknown Range Selected');
                break;
        }
    };
    calculateFilterRange(dashboard.value.currentFilter);

    watch(
        () => dashboard.value.currentFilter,
        (filter, prev) => {
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
