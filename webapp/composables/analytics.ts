import { toRefs, reactive } from 'vue';
import axios from '../api';

import useNotifyToast from './alert_toast';
import { IReportListing } from '../models/reports';

const { toastSuccess, toastWarning } = useNotifyToast();

const state = reactive({
    reports: [],
} as {
    reports: IReportListing[];
});

export default function useAnalyticsComposable() {
    const fetchReports = async () => {
        await axios.get('reports').then(resp => {
            state.reports = resp.data;
        });
    };

    const generateReport = async payload => {
        await axios.post('reports', payload).then(resp => {
            state.reports.push(resp.data);
        });
    };

    const deleteReport = async (report: IReportListing) => {
        await axios.delete('reports/' + report.uid).then(resp => {
            const data = resp.data;
            const index = state.reports.findIndex(x => x.uid === data.uid);
            if (index > -1) {
                state.reports.splice(index, 1);
                toastSuccess(data.message);
            } else {
                toastWarning('Failed to remove report: Please refresh your page');
            }
        });
    };

    const updateReport = (report: IReportListing) => {
        const index = state.reports.findIndex(x => x.uid === report.uid);
        if (index > -1) {
            state.reports[index] = { ...state.reports[index], ...report };
        }
    };

    return {
        ...toRefs(state),
        fetchReports,
        generateReport,
        deleteReport,
        updateReport,
    };
}
