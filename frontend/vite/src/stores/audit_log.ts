import { defineStore } from 'pinia'
import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()

import {
  GET_AUDIT_LOG_FOR_TARGET
} from '../graphql/_queries';


export const useAuditLogStore = defineStore('auditlog', {
  state: () => {
      return {
          auditLogs: [] as any as any[]
      }
  },
  getters: {
      getAuditLogs: (state) => state.auditLogs,
  },
  actions: {
    async fetchAuditLogs(params){
      await withClientQuery(GET_AUDIT_LOG_FOR_TARGET, params, "auditLogsFilter")
      .then(logs => {
          this.auditLogs = logs
        })
    },
  
  }
})
