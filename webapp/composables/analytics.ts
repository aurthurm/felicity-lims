import { toRefs, reactive } from 'vue';
import axios from "@/composables/axios";

import useNotifyToast from './alert_toast';
import { IReportListing } from '@/models/reports';

interface ReportPayload {
    name: string;
    type: string;
    parameters: Record<string, unknown>;
}

const { toastSuccess, toastError, toastWarning, swalConfirm } = useNotifyToast();

const state = reactive({
    reports: [] as IReportListing[],
});

export default function useAnalyticsComposable() {
    const fetchReports = async (): Promise<void> => {
        try {
            const response = await axios.get('reports');
            state.reports = response.data;
        } catch (error) {
            toastError(`Failed to fetch reports: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const generateReport = async (payload: ReportPayload): Promise<void> => {
        try {
            const response = await axios.post('reports', payload);
            state.reports.push(response.data);
            toastSuccess('Report generated successfully');
        } catch (error) {
            toastError(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const deleteReport = async (report: IReportListing): Promise<void> => {
        try {
            const result = await swalConfirm(
                'Are you sure you want to delete this report?',
                'Delete Report'
            );

            if (result.isConfirmed) {
                const response = await axios.delete(`reports/${report.uid}`);
                const data = response.data;
                const index = state.reports.findIndex(x => x.uid === data.uid);
                
                if (index > -1) {
                    state.reports.splice(index, 1);
                    toastSuccess(data.message || 'Report deleted successfully');
                } else {
                    toastWarning('Failed to remove report: Please refresh your page');
                }
            }
        } catch (error) {
            toastError(`Failed to delete report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const updateReport = (report: IReportListing): void => {
        try {
            const index = state.reports.findIndex(x => x.uid === report.uid);
            if (index > -1) {
                state.reports[index] = { ...state.reports[index], ...report };
                toastSuccess('Report updated successfully');
            } else {
                toastWarning('Failed to update report: Report not found');
            }
        } catch (error) {
            toastError(`Failed to update report: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
