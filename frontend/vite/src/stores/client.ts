import { defineStore } from 'pinia'
import { GET_ALL_CLIENTS, 
  SEARCH_CLIENTS, 
  GET_CLIENT_CONTACTS_BY_CLIENT_UID, 
  GET_CLIENT_BY_UID } from '../graphql/clients.queries';
import { addListsUnique } from '../utils';
import { IClient, IClientContact } from '../models/client'

import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()

export const useClientStore = defineStore('client', { 
  state: () => { 
    return {
      clients: [],
      client: undefined,
      clientContacts: [],
      clientCount: 0,
      clientPageInfo: undefined,
    } as {
      clients: IClient[];
      client?: IClient;
      clientContacts: IClientContact[];
      clientCount?: number;
      clientPageInfo?: any;
    }
  },
  getters: {
    getClientContacts: (state) => state.clientContacts,
    getClients: (state) => state.clients,
    getClient: (state) => state.client,
    getClientByName: (state) => (name: string) => state.clients?.find(cl => cl.name === name),
    getClientCount: (state) => state.clientCount,
    getClientPageInfo: (state) => state.clientPageInfo,
  },
  actions: {
    async fetchClients(params){
      await withClientQuery(GET_ALL_CLIENTS, params, undefined)
      .then(payload => {
        const page = payload.clientAll
        const clients = page.items
        if(params.filterAction){
          this.clients = [];
          this.clients = clients;
        } else {
          this.clients =  addListsUnique(this.clients!, clients, "uid");
        }
    
        this.clientCount = page?.totalCount;
        this.clientPageInfo = page?.pageInfo;
      })
    },
    async searchClients(queryString: string){
      await withClientQuery(SEARCH_CLIENTS, { queryString }, "clientSearch")
        .then(payload => this.clients = payload)
    },
    async fetchClientByUid(uid){
      await withClientQuery(GET_CLIENT_BY_UID, { uid },"clientByUid")
      .then(payload => this.client = payload)
    },
    addClient(payload: IClient) {
      this.clients?.unshift(payload);
    },
    updateClient(payload: IClient) {
      this.clients = this.clients?.map(item => item.uid === payload.uid ? payload: item);
    },
  
    async fetchClientContacts(clientUid){
      await withClientQuery(GET_CLIENT_CONTACTS_BY_CLIENT_UID, { clientUid }, "clientContactByClientUid")
      .then(payload =>  this.clientContacts = payload)
    },
    addClientContact(payload: IClientContact) {
      this.clientContacts?.unshift(payload);
    },
    updateClientContact(payload: IClientContact) {
      this.clientContacts = this.clientContacts?.map(item => item.uid === payload.uid ? payload: item);
    },
  }
}) 
