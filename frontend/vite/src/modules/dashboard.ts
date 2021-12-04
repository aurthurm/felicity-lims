import { reactive, readonly, toRefs, watch } from "vue"

const _state = reactive({
    currentTab: 'overview',
    tabs: ['overview', 'resource', 'laggard', 'peformance', 'tat', 'notices', 'line-listing'],
    currentFilter: "Today",
    filterRange: { from: "", to: "" },
    filters: ['Today', 'Yetserday', 'Week', 'Last Week', 'Month', 'Last Month', 'Quarter', 'Last Quarter', 'Year', 'All', 'custom-range']
})

const useDashBoardComposable = () => {

    return {
        state: toRefs(readonly(_state)),
        setCurrentTab, setCurrentFilter, setFilterRange,
    }
}
export default useDashBoardComposable

watch(() => _state.currentFilter, (filter, prev) => {
    calculateFilterRange(filter);
})

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
