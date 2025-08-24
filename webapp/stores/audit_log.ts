import { defineStore } from 'pinia';
import useApiUtil from '@/composables/api_util';
import { GetAuditLogsDocument, GetAuditLogsQuery, GetAuditLogsQueryVariables } from '@/graphql/operations/_queries';
import type { AuditLogType } from '@/types/gql';

const { withClientQuery } = useApiUtil();

export const useAuditLogStore = defineStore('auditlog', {
    state: () => {
        return {
            auditLogs: [] as AuditLogType[],
            fetchingAudits: false,
            error: null as string | null,
        };
    },
    getters: {
        getAuditLogs: state => state.auditLogs,
        isLoading: state => state.fetchingAudits,
        hasError: state => state.error !== null,
    },
    actions: {
        async fetchAuditLogs(params: GetAuditLogsQueryVariables) {
            this.fetchingAudits = true;
            this.error = null;
            
            try {
                const result = await withClientQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(
                    GetAuditLogsDocument, 
                    params, 
                    'auditLogsFilter'
                );
                
                if (result && Array.isArray(result)) {
                    this.auditLogs = result.map(log => {
                        const processedLog = { ...log };
                        
                        // Parse JSON strings if needed
                        if (typeof processedLog.stateAfter === 'string') {
                            try {
                                processedLog.stateAfter = JSON.parse(processedLog.stateAfter);
                            } catch (e) {
                                console.error('Failed to parse stateAfter JSON:', e);
                            }
                        }
                        
                        if (typeof processedLog.stateBefore === 'string') {
                            try {
                                processedLog.stateBefore = JSON.parse(processedLog.stateBefore);
                            } catch (e) {
                                console.error('Failed to parse stateBefore JSON:', e);
                            }
                        }
                        
                        if (typeof processedLog.extras === 'string') {
                            try {
                                processedLog.extras = JSON.parse(processedLog.extras);
                            } catch (e) {
                                console.error('Failed to parse extras JSON:', e);
                            }
                        }
                        
                        return processedLog;
                    });
                } else {
                    this.auditLogs = [];
                }
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Unknown error occurred';
                console.error('Error fetching audit logs:', err);
            } finally {
                this.fetchingAudits = false;
            }
        },
        
        resetLogs() {
            this.auditLogs = [];
            this.error = null;
        },
    },
});
