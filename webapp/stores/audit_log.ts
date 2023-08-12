import { defineStore } from 'pinia';
import { useApiUtil } from '../composables';

const { withClientQuery } = useApiUtil();

import { GET_AUDIT_LOG_FOR_TARGET } from '../graphql/operations/_queries';

export const useAuditLogStore = defineStore('auditlog', {
    state: () => {
        return {
            auditLogs: [] as any as any[],
            fetchingAudits: false,
        };
    },
    getters: {
        getAuditLogs: state => state.auditLogs,
    },
    actions: {
        async fetchAuditLogs(params) {
            this.fetchingAudits = true;
            await withClientQuery(GET_AUDIT_LOG_FOR_TARGET, params, 'auditLogsFilter')
                .then(payload => {
                    this.fetchingAudits = false;
                    this.auditLogs = payload?.map(logs => {
                        logs.stateAfter = typeof logs?.stateAfter === 'string' ? JSON.parse(logs?.stateAfter) : logs?.stateAfter;
                        logs.stateBefore = typeof logs?.stateBefore === 'string' ? JSON.parse(logs?.stateBefore) : logs?.stateBefore;
                        return logs;
                    });
                })
                .catch(err => (this.fetchingAudits = false));
        },
        async restLogs() {
            this.auditLogs = [];
        },
    },
});
