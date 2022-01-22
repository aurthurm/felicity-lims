import { reactive, readonly, toRefs, watch } from "vue"
import { useQuery } from '@urql/vue';
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

import useNotifyToast from "./alert_toast";

const { gqlResponseHandler } = useNotifyToast();

interface GroupCount {
    group: string, 
    count: number,
}


const _state = reactive({
    currentTab: 'overview',
    tabs: ['overview', 'resource', 'laggard', 'peformance', 'tat', 'notices', 'line-listing'],
    currentFilter: "Today",
    filterRange: { from: "", to: "" },
    filters: ['Today', 'Yetserday', 'Week', 'Last Week', 'Month', 'Last Month', 'Quarter', 'Last Quarter', 'Year', 'All', 'custom-range'],
    overViewStats: { analyses: [] as GroupCount[], samples: [] as GroupCount[], worksheets: [] as GroupCount[] },
    resourceStats: { instruments: [] as GroupCount[], samples: [] as any[] },
})

watch(() => _state.currentFilter, (filter, prev) => {
    calculateFilterRange(filter);
})

const useDashBoardComposable = () => {

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
    const _ssg =  useQuery({
        query: GET_SAMPLE_GROUP_BY_STATUS,
        variables: {},
        requestPolicy: 'network-only',
    })
    const countSamplesGroupsByStatus = async () => {
        _ssg.executeQuery({requestPolicy: 'network-only'}).then(resp => {
            const data = gqlResponseHandler(resp)
            _state.overViewStats.samples = data?.value?.countSampleGroupByStatus?.data
        })
    }

    // GET_ANALYSIS_GROUP_BY_STATUS
    const  _asg = useQuery({
        query: GET_ANALYSIS_GROUP_BY_STATUS,
        variables: {},
        requestPolicy: 'network-only',
    })
    const countAnalysisGroupsByStatus = async () => {
        _asg.executeQuery({requestPolicy: 'network-only'}).then(resp => {
            const data = gqlResponseHandler(resp)
            _state.overViewStats.analyses = data?.value?.countAnalyteGroupByStatus?.data
        })
    }

    // GET_WORKSHEET_GROUP_BY_STATUS
    const  _wsg = useQuery({
        query: GET_WORKSHEET_GROUP_BY_STATUS,
        variables: {},
        requestPolicy: 'network-only',
    })
    const countWrksheetGroupsByStatus = async () => {
        _wsg.executeQuery({requestPolicy: 'network-only'}).then(resp => {
            const data = gqlResponseHandler(resp)
            _state.overViewStats.worksheets = data?.value?.countWorksheetGroupByStatus?.data
        })
    }

    // GET_ANALYSIS_GROUP_BY_INSTRUMENT
    const  _aig = useQuery({
        query: GET_ANALYSIS_GROUP_BY_INSTRUMENT,
        variables: {},
        requestPolicy: 'network-only',
    })
    const countAnalysisGroupsByInstrument = async () => {
        _aig.executeQuery({requestPolicy: 'network-only'}).then(resp => {
            const data = gqlResponseHandler(resp)
            _state.resourceStats.instruments = data?.value?.countAnalyteGroupByInstrument?.data
        })
    }

    // GET_SAMPLE_GROUPS_BY_ACTION
    const  _sgba = useQuery({
        query: GET_SAMPLE_GROUPS_BY_ACTION,
        variables: {},
        requestPolicy: 'network-only',
    })
    const getSampleGroupByAction = async () => {
        _sgba.executeQuery({requestPolicy: 'network-only'}).then(resp => {
            const data = gqlResponseHandler(resp)
            _state.resourceStats.samples = data?.value?.countSampleGroupByAction?.data
        })
    }
    // GET_SAMPLE_PROCESS_PEFORMANCE
    // const  _spp = useQuery({
    //     query: GET_SAMPLE_PROCESS_PEFORMANCE,
    //     variables: {},
    //     requestPolicy: 'network-only',
    // })
    // const getSampleprocessPeformance = async () => {
    //     _spp.executeQuery({requestPolicy: 'network-only'}).then(resp => {
    //         const data = gqlResponseHandler(resp)
    //         _state.peformanceStats.samples = data?.value?.sampleProcessPerformance?.data
    //         console.log(_state.peformanceStats)
    //     })
    // }
    //

    return {
        state: toRefs(readonly(_state)),
        setCurrentTab, setCurrentFilter, setFilterRange,
        getOverViewStats, getResourceStats
    }
}
export default useDashBoardComposable


// mutations
const setCurrentTab = (tab: string) => _state.currentTab = tab;
const setCurrentFilter = (filter: string) => _state.currentFilter = filter;
const setFilterRange = (from: string, to: string) => {_state.filterRange.from = from;  _state.filterRange.to = to}

const calculateFilterRange = (filter: string): void => {
    if(filter === _state.filters[_state.filters.length -1]) return;

    switch (filter) {
        case 'Today':
            setFilterRange(new Date().toLocaleDateString(), new Date().toLocaleDateString())
            break;
    
        default:
            break;
    }
}
