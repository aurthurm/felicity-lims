import { defineStore } from 'pinia'
import { ref, watch } from "vue"
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import {
    GET_SAMPLE_GROUP_BY_STATUS,
    GET_ANALYSIS_GROUP_BY_STATUS,
    GET_WORKSHEET_GROUP_BY_STATUS,
    GET_ANALYSIS_GROUP_BY_INSTRUMENT,
    GET_SAMPLE_PROCESS_PEFORMANCE,
    GET_ANALYSIS_PROCESS_PEFORMANCE,
    GET_SAMPLE_GROUPS_BY_ACTION,
    GET_SAMPLE_LAGGARDS,
} from '../graphql/dashboard.queries'

import { useApiUtil } from "../composables";
const { withClientQuery } = useApiUtil();

interface GroupCount {
    group: string, 
    count: number,
}
interface ISampleCounts {
    totalSamples: number;
    totalLate: number;
    totalNotLate: number;
    processAverage: number;
    avgExtraDays: number;
}

interface IAnalysisGroup extends ISampleCounts {
    service: string
}
export interface IProcess {
  process: string;
  counts: ISampleCounts,
  groups: IAnalysisGroup[],
}

dayjs.extend(quarterOfYear)

export const useDashBoardStore = defineStore('dashboard', () => {

    const dashboard = ref({
        currentTab: 'overview',
        tabs: ['overview', 'resource', 'laggard', 'peformance', 'tat', 'notices', 'line-listing'],
        showFilters: false,
        currentFilter: "Today",
        filterRange: { from: "", to: "" },
        filters: ['Today', 'Yesterday', 'Week', 'Last Week', 'Month', 'Last Month', 'Quarter', 'Last Quarter', 'Year', 'All', 'custom-range'],
        overViewStats: { analyses: [] as GroupCount[], samples: [] as GroupCount[], worksheets: [] as GroupCount[] },
        fetchingOverViewStats: false,
        resourceStats: { instruments: [] as GroupCount[], samples: [] as any[] },
        fetchingResourceStats: false,
        peformanceStats: { sample: [] as IProcess[], analysis: [] as IProcess[] },
        fetchingSampePeformanceStats: false,
        fetchingAnalysisPeformanceStats: false,
        currentPeformance: "received_to_published",
        performances: ["received_to_published", "received_to_submitted","submitted_to_verified", "verified_to_published"],
        laggards: {} as any,
        fetchingLaggards: false
    })

    // get_OverViewStats
    const getOverViewStats = async () => {
        dashboard.value.fetchingOverViewStats = true;
        try {
            await countSamplesGroupsByStatus();
            await countAnalysisGroupsByStatus();
            await countWrksheetGroupsByStatus();
        } catch (error) {
            dashboard.value.fetchingOverViewStats = false;
        }
        dashboard.value.fetchingOverViewStats = false;
    }

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
    }

    // GET_SAMPLE_GROUP_BY_STATUS
    const countSamplesGroupsByStatus = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
       await  withClientQuery(GET_SAMPLE_GROUP_BY_STATUS, filters , 'countSampleGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.samples = payload.data)
    }

    // GET_ANALYSIS_GROUP_BY_STATUS
    const countAnalysisGroupsByStatus = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        await withClientQuery(GET_ANALYSIS_GROUP_BY_STATUS, filters , 'countAnalyteGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.analyses = payload.data)
    }

    // GET_WORKSHEET_GROUP_BY_STATUS
    const countWrksheetGroupsByStatus = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        await withClientQuery(GET_WORKSHEET_GROUP_BY_STATUS,filters, 'countWorksheetGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.worksheets = payload.data)
    }

    // GET_ANALYSIS_GROUP_BY_INSTRUMENT
    const countAnalysisGroupsByInstrument = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        await withClientQuery(GET_ANALYSIS_GROUP_BY_INSTRUMENT,filters, 'countAnalyteGroupByInstrument', 'network-only')
        .then(payload => dashboard.value.resourceStats.instruments = payload.data)
    }

    // GET_SAMPLE_GROUPS_BY_ACTION
    const getSampleGroupByAction = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        await withClientQuery(GET_SAMPLE_GROUPS_BY_ACTION,filters, 'countSampleGroupByAction', 'network-only')
        .then(payload => dashboard.value.resourceStats.samples = payload.data)
    }

    // GET_SAMPLE_PROCESS_PEFORMANCE
    const getSampleProcessPeformance = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        dashboard.value.fetchingAnalysisPeformanceStats = true
        await withClientQuery(GET_SAMPLE_PROCESS_PEFORMANCE,filters, 'sampleProcessPerformance', 'network-only')
        .then(payload =>  {
            dashboard.value.fetchingAnalysisPeformanceStats = false
            dashboard.value.peformanceStats.sample = payload.data
        }).catch(err => dashboard.value.fetchingAnalysisPeformanceStats = false)
    }

    // GET_ANALYSIS_PROCESS_PEFORMANCE
    const getAnalysisProcessPeformance = async () => {
        const filters = { 
            process: dashboard.value.currentPeformance,
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        dashboard.value.fetchingSampePeformanceStats = true
        await withClientQuery(GET_ANALYSIS_PROCESS_PEFORMANCE,filters, 'analysisProcessPerformance', 'network-only')
        .then(payload => {
            dashboard.value.fetchingSampePeformanceStats = false
            dashboard.value.peformanceStats.analysis = payload.data
        }).catch(err => dashboard.value.fetchingSampePeformanceStats = false)
    }

    // GET_SAMPLE_LAGGARDS
    const getSampleLaggards = async () => {
        const filters = { 
            startDate: dashboard.value.filterRange.from,
            endDate: dashboard.value.filterRange.to
        }
        dashboard.value.fetchingLaggards = true;
        await withClientQuery(GET_SAMPLE_LAGGARDS,filters, 'sampleLaggards', 'network-only')
        .then(payload => {
            dashboard.value.laggards = payload.data
            dashboard.value.fetchingLaggards = false;
        }).catch(err => dashboard.value.fetchingLaggards = false)
    }

    const setCurrentTab = (tab: string) => dashboard.value.currentTab = tab;
    const setCurrentFilter = (filter: string) => dashboard.value.currentFilter = filter;
    const setFilterRange = (from: string, to: string) => {dashboard.value.filterRange.from = from;  dashboard.value.filterRange.to = to}
    const setCurrentPeformance = (event: any) => {
        dashboard.value.currentPeformance = event.target.value
    };

    const calculateFilterRange = (filter: string): void => {
        if(filter === dashboard.value.filters[dashboard.value.filters.length -1]) return;

        switch (filter) {

            case 'Today':
                setFilterRange(dayjs().startOf('day').toISOString(), dayjs().endOf('day').toISOString())
                break;

            case 'Yesterday':
                setFilterRange(dayjs().startOf('day').subtract(1, 'day').toISOString(), dayjs().endOf('day').subtract(1, 'day').toISOString())
                break;

            case 'Week':
                setFilterRange(dayjs().startOf('week').toISOString(), dayjs().endOf('week').toISOString())
                break;

            case 'Last Week':
                setFilterRange(dayjs().startOf('week').subtract(1, 'week').toISOString(), dayjs().endOf('week').subtract(1, 'week').toISOString())
                break;

            case 'Month':
                setFilterRange(dayjs().startOf('month').toISOString(), dayjs().endOf('month').toISOString())
                break;

            case 'Last Month':
                setFilterRange(dayjs().startOf('month').subtract(1, 'month').toISOString(), dayjs().endOf('month').subtract(1, 'month').toISOString())
                break;

            case 'Quarter':
                setFilterRange(dayjs().startOf('quarter').toISOString(), dayjs().endOf('quarter').toISOString())
                break;

            case 'Last Quarter':
                setFilterRange(dayjs().startOf('quarter').subtract(1, 'quarter').toISOString(), dayjs().endOf('quarter').subtract(1, 'quarter').toISOString())
                break;
 
            case 'Year':
                setFilterRange(dayjs().startOf('year').toISOString(), dayjs().endOf('year').toISOString())
                break;

            default:
                setFilterRange('', '')
                break;
        }
    }
    calculateFilterRange(dashboard.value.currentFilter);

    watch(() => dashboard.value.currentFilter, (filter, prev) => {
        calculateFilterRange(filter);
    })
    
    return { 
        dashboard,
        setCurrentTab, setCurrentFilter, setFilterRange,
        getOverViewStats, getResourceStats, getSampleLaggards,
        getSampleProcessPeformance, getAnalysisProcessPeformance,
        setCurrentPeformance
    }
})
