import { defineStore } from 'pinia'
import useApiUtil from '../modules/api_util'

const { withUseQuery } = useApiUtil()

import {
  GET_AUDIT_LOG_FOR_TARGET
} from '../graphql/_queries';


export const useAuditLogStore = defineStore('auditlogs', {
  state: () => {
      return {
          auditLogs: []
      }
  },
  getters: {
      getAuditLogs: (state) => state.auditLogs,
  },
  actions: {
    async fetchAuditLogs(params){
      await withUseQuery(GET_AUDIT_LOG_FOR_TARGET, params, "auditLogsFilter")
      .then(logs => {
          this.auditLogs = logs
        })
    },
  
  }
})
