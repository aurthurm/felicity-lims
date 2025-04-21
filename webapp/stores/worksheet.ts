import { defineStore } from 'pinia';
import { parseData, keysToCamel, addListsUnique } from '@/utils';
import type { AnalysisResultType, WorkSheetTemplateType, WorkSheetType, PageInfo } from '@/types/gql';

import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';
import { GetAllWorksheetsDocument, GetAllWorksheetsQuery, GetAllWorksheetsQueryVariables, GetAllWorksheetTemplatesDocument, GetAllWorksheetTemplatesQuery, GetAllWorksheetTemplatesQueryVariables, GetWorkSheetByUidDocument, GetWorkSheetByUidQuery, GetWorkSheetByUidQueryVariables } from '@/graphql/operations/worksheet.queries';
import { UpdateWorkSheetDocument, UpdateWorkSheetMutation, UpdateWorkSheetMutationVariables } from '@/graphql/operations/worksheet.mutations';
import { GetAnalysesResultsForWsAssignDocument, GetAnalysesResultsForWsAssignQuery, GetAnalysesResultsForWsAssignQueryVariables } from '@/graphql/operations/analyses.queries';
import { ReservedType } from '@/types/worksheet';

const { withClientQuery, withClientMutation } = useApiUtil();
const { toastError } = useNotifyToast();

export const useWorksheetStore = defineStore('worksheet', {
    state: () => {
        return {
            workSheetTemplates: [],
            fetchingWorkSheetTemplates: false,
            workSheets: [],
            fetchingWorkSheets: false,
            workSheet: undefined,
            workSheetCount: 0,
            workSheetPageInfo: undefined,
            fetchingAnalysisResults: false,
            analysisResults: [], // for WS Assign
            analysisResultCount: 0,
            analysisResultPageInfo: undefined,
        } as {
            workSheetTemplates: WorkSheetTemplateType[];
            fetchingWorkSheetTemplates: boolean;
            workSheets: WorkSheetType[];
            fetchingWorkSheets: boolean;
            workSheet?: WorkSheetType;
            workSheetCount: number;
            workSheetPageInfo?: PageInfo;
            fetchingAnalysisResults?: boolean;
            analysisResults: AnalysisResultType[];
            analysisResultCount: number;
            analysisResultPageInfo?: PageInfo;
        };
    },
    getters: {
        getWorkSheetTemplates: state => state.workSheetTemplates,
        getWorkSheets: state => sortWorksheets(state.workSheets),
        getWorkSheet: state => state.workSheet,
        getWorkSheetByUid: state => (uid: string) => state.workSheets?.find(ws => ws.uid === uid),
        getWorkSheetCount: state => state.workSheetCount,
        getWorkSheetPageInfo: state => state.workSheetPageInfo,
        getAnalysisResults: state => state.analysisResults,
        getAnalysisResultCount: state => state.analysisResultCount,
        getAnalysisResultPageInfo: state => state.analysisResultPageInfo,
    },
    actions: {
        // WorkSheet Templates
        async fetchWorkSheetTemplates() {
            try {
                this.fetchingWorkSheetTemplates = true;
                const payload = await withClientQuery<GetAllWorksheetTemplatesQuery, GetAllWorksheetTemplatesQueryVariables>(
                    GetAllWorksheetTemplatesDocument, 
                    {}, 
                    'worksheetTemplateAll'
                );

                if (Array.isArray(payload)) {
                    payload.forEach(template => {
                        const data: any = template.reserved;
                        const reserved = Object.entries(parseData(data)) as any[];
                        let new_res: ReservedType[] = [];
                        reserved?.forEach(item => new_res.push((keysToCamel(item[1]) as ReservedType) || {}));
                        template.reserved = new_res as any;
                    });
                    this.workSheetTemplates = payload as WorkSheetTemplateType[];
                } else {
                    console.error('Expected array of templates but got:', payload);
                    this.workSheetTemplates = [];
                }
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.workSheetTemplates = [];
            } finally {
                this.fetchingWorkSheetTemplates = false;
            }
        },

        updateWorksheetTemplate(payload) {
            const index = this.workSheetTemplates.findIndex(x => x.uid === payload.uid);
            const data: any = payload.reserved;
            const reserved = Object.entries(parseData(data)) as any[];
            let new_res: ReservedType[] = [];
            reserved?.forEach(item => new_res.push((item[1] as ReservedType) || {}));
            payload.reserved = new_res;
            this.workSheetTemplates[index] = payload;
        },

        addWorksheetTemplate(payload) {
            const data: any = payload.reserved;
            const reserved = Object.entries(parseData(data)) as any[];
            let new_res: ReservedType[] = [];
            reserved?.forEach(item => new_res.push((item[1] as ReservedType) || {}));
            payload.reserved = new_res;
            this.workSheetTemplates?.push(payload);
        },

        // WorkSheets
        async fetchWorkSheets(params) {
            try {
                this.fetchingWorkSheets = true;
                const payload = await withClientQuery<GetAllWorksheetsQuery, GetAllWorksheetsQueryVariables>(
                    GetAllWorksheetsDocument, 
                    params, 
                    undefined
                );

                const page = (payload as any).worksheetAll;
                if (!page) {
                    console.error('Invalid response format:', payload);
                    return;
                }

                const worksheets = page.items;
                if (params.filterAction) {
                    this.workSheets = worksheets;
                } else {
                    this.workSheets = addListsUnique(this.workSheets, worksheets, 'uid');
                }
                this.workSheetCount = page?.totalCount;
                this.workSheetPageInfo = page?.pageInfo;
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.workSheets = [];
            } finally {
                this.fetchingWorkSheets = false;
            }
        },

        async fetchWorksheetByUid(worksheetUid: string) {
            try {
                const payload = await withClientQuery<GetWorkSheetByUidQuery, GetWorkSheetByUidQueryVariables>(
                    GetWorkSheetByUidDocument, 
                    { worksheetUid }, 
                    'worksheetByUid'
                );
                this.workSheet = sortAnalysisResults(payload);
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.workSheet = undefined;
            }
        },

        addWorksheet(payload) {
            payload.worksheets?.forEach(worksheet => this.workSheets?.unshift(worksheet));
        },

        removeWorksheet() {
            this.workSheet = undefined;
        },

        async updateWorksheet(payload) {
            try {
                await withClientMutation<UpdateWorkSheetMutation, UpdateWorkSheetMutationVariables>(
                    UpdateWorkSheetDocument, 
                    payload, 
                    'updateWorksheet'
                );
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
            }
        },

        updateWorksheetStatus(worksheet: any) {
            const index = this.workSheets.findIndex(x => x.uid === worksheet.uid);
            if (index > -1) {
                this.workSheets[index].state = worksheet.state;
            }
            if (this.workSheet?.uid === worksheet.uid) {
                this.workSheet!.state = worksheet.state;
            }
        },

        backgroundProcessing(payload, worksheetUid: any, process) {
            payload?.forEach(result => {
                this.workSheet?.analysisResults?.forEach((wsResult, index) => {
                    if (wsResult?.uid == result.uid) {
                        wsResult.status = process;
                    }
                });
            });
            if (worksheetUid) {
                if (this.workSheet?.uid === worksheetUid) {
                    this.workSheet!.state = process;
                }
                const index = this.workSheets.findIndex(x => x.uid === worksheetUid);
                if (index > -1) {
                    this.workSheets[index].state = process;
                }
            }
        },

        // Analyses for WS Assign
        async fetchForWorkSheetsAssign(params) {
            try {
                this.fetchingAnalysisResults = true;
                const payload = await withClientQuery<GetAnalysesResultsForWsAssignQuery, GetAnalysesResultsForWsAssignQueryVariables>(
                    GetAnalysesResultsForWsAssignDocument, 
                    params, 
                    undefined
                );

                const page = (payload as any).analysisResultsForWsAssign;
                if (!page) {
                    console.error('Invalid response format:', payload);
                    return;
                }

                const results = page.items;
                if (params.filterAction) {
                    this.analysisResults = results;
                } else {
                    this.analysisResults = results; // addListsUnique(this.analysisResults, results, "uid");
                }
                this.analysisResultCount = page?.totalCount;
                this.analysisResultPageInfo = page?.pageInfo;
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.analysisResults = [];
            } finally {
                this.fetchingAnalysisResults = false;
            }
        },

        // analysis results
        updateWorksheetResultsStatus(payload) {
            payload?.forEach(result => {
                this.workSheet?.analysisResults?.forEach((wsResult, index) => {
                    if (wsResult?.uid == result.uid) {
                        wsResult.status = result.status;
                    }
                });
            });
        },

        updateAnalysesResults(payload: AnalysisResultType[]) {
            payload?.forEach(result => {
                const index = this.analysisResults.findIndex(x => x.uid === result.uid);
                if (index > -1) {
                    this.analysisResults[index] = {
                        ...this.analysisResults[index],
                        ...result,
                    };
                }
            });
        },
    },
});

function sortAnalysisResults(ws: any): WorkSheetType {
    ws.analysisResults = ws?.analysisResults?.sort((a: AnalysisResultType, b: AnalysisResultType) => {
        if (a.worksheetPosition === b.worksheetPosition) {
            return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
        }
        return (a?.worksheetPosition || 0) > (b?.worksheetPosition || 1) ? 1 : -1;
    });
    return ws;
}

function sortWorksheets(ws: WorkSheetType[]): WorkSheetType[] {
    return ws?.sort((a: WorkSheetType, b: WorkSheetType) => ((a?.uid || 0) < (b?.uid || 0) ? 1 : -1));
}
