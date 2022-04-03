import { defineStore } from 'pinia'
import { ref, watch } from "vue"
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

export const useDashBoardStore = defineStore('dashboard', () => {

    const dashboard = ref({
        currentTab: 'overview',
        tabs: ['overview', 'resource', 'laggard', 'peformance', 'tat', 'notices', 'line-listing'],
        currentFilter: "Today",
        filterRange: { from: "", to: "" },
        filters: ['Today', 'Yetserday', 'Week', 'Last Week', 'Month', 'Last Month', 'Quarter', 'Last Quarter', 'Year', 'All', 'custom-range'],
        overViewStats: { analyses: [] as GroupCount[], samples: [] as GroupCount[], worksheets: [] as GroupCount[] },
        resourceStats: { instruments: [] as GroupCount[], samples: [] as any[] },
        peformanceStats: {} as any
    })

  
    // get_OverViewStats
    const getOverViewStats = async () => {
        await countSamplesGroupsByStatus();
        await countAnalysisGroupsByStatus();
        await countWrksheetGroupsByStatus();
    }

    // get_PeformanceStats
    const getResourceStats = async () => {
        await countAnalysisGroupsByInstrument();
        await getSampleGroupByAction();
    }

    // GET_SAMPLE_GROUP_BY_STATUS
    const countSamplesGroupsByStatus = async () => {
        withClientQuery(GET_SAMPLE_GROUP_BY_STATUS,{}, 'countSampleGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.samples = payload.data)
    }

    // GET_ANALYSIS_GROUP_BY_STATUS
    const countAnalysisGroupsByStatus = async () => {
        withClientQuery(GET_ANALYSIS_GROUP_BY_STATUS,{}, 'countAnalyteGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.analyses = payload.data)
    }

    // GET_WORKSHEET_GROUP_BY_STATUS
    const countWrksheetGroupsByStatus = async () => {
        withClientQuery(GET_WORKSHEET_GROUP_BY_STATUS,{}, 'countWorksheetGroupByStatus', 'network-only')
        .then(payload => dashboard.value.overViewStats.worksheets = payload.data)
    }

    // GET_ANALYSIS_GROUP_BY_INSTRUMENT
    const countAnalysisGroupsByInstrument = async () => {
        withClientQuery(GET_ANALYSIS_GROUP_BY_INSTRUMENT,{}, 'countAnalyteGroupByInstrument', 'network-only')
        .then(payload => dashboard.value.resourceStats.instruments = payload.data)
    }

    // GET_SAMPLE_GROUPS_BY_ACTION
    const getSampleGroupByAction = async () => {
        withClientQuery(GET_SAMPLE_GROUPS_BY_ACTION,{}, 'countSampleGroupByAction', 'network-only')
        .then(payload => dashboard.value.resourceStats.samples = payload.data)
    }

    // GET_SAMPLE_PROCESS_PEFORMANCE
    const getSampleProcessPeformance = async () => {
        withClientQuery(GET_SAMPLE_PROCESS_PEFORMANCE,{}, 'sampleProcessPerformance', 'network-only')
        .then(payload =>  dashboard.value.peformanceStats.samples = payload.data)
    }

    // GET_ANALYSIS_PROCESS_PEFORMANCE
    const getAnalysisProcessPeformance = async () => {
        withClientQuery(GET_ANALYSIS_PROCESS_PEFORMANCE,{}, 'analysisProcessPerformance', 'network-only')
        .then(payload =>  dashboard.value.peformanceStats.samples = payload.data)
    }

    // GET_SAMPLE_LAGGARDS
    const getSampleLagsards = async () => {
        withClientQuery(GET_SAMPLE_LAGGARDS,{}, 'sampleLaggards', 'network-only')
        .then(payload =>  dashboard.value.peformanceStats.samples = payload.data)
    }

    const setCurrentTab = (tab: string) => dashboard.value.currentTab = tab;
    const setCurrentFilter = (filter: string) => dashboard.value.currentFilter = filter;
    const setFilterRange = (from: string, to: string) => {dashboard.value.filterRange.from = from;  dashboard.value.filterRange.to = to}

    const calculateFilterRange = (filter: string): void => {
        if(filter === dashboard.value.filters[dashboard.value.filters.length -1]) return;

        switch (filter) {
            case 'Today':
                setFilterRange(new Date().toLocaleDateString(), new Date().toLocaleDateString())
                break;
        
            default:
                break;
        }
    }

    watch(() => dashboard.value.currentFilter, (filter, prev) => {
        calculateFilterRange(filter);
    })
    
    return { 
        dashboard,
        setCurrentTab, setCurrentFilter, setFilterRange,
        getOverViewStats, getResourceStats
    }
})


