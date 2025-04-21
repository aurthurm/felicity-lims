import { defineStore } from 'pinia';
import { 
    GetAllClientsDocument, GetAllClientsQuery, GetAllClientsQueryVariables,
    SearchClientsDocument, SearchClientsQuery, SearchClientsQueryVariables,
    GetClientContactsByClientUidDocument, GetClientContactsByClientUidQuery, GetClientContactsByClientUidQueryVariables,
    GetClientByUidDocument, GetClientByUidQuery, GetClientByUidQueryVariables
} from '@/graphql/operations/clients.queries';
import { addListsUnique } from '@/utils';
import { ClientType, ClientContactType, PageInfo } from '@/types/gql';

import useApiUtil from '@/composables/api_util';
import { useLocationStore } from './location';

const { withClientQuery } = useApiUtil();

// Define the state type
type ClientStateType = {
    clients: ClientType[];
    fetchingClients: boolean;
    client?: ClientType;
    fetchingClient: boolean;
    clientContacts: ClientContactType[];
    fetchingClientContacts: boolean;
    clientCount?: number;
    clientPageInfo?: PageInfo;
};

// Default empty page info
const defaultPageInfo: PageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null
};

export const useClientStore = defineStore('client', {
    state: (): ClientStateType => {
        return {
            clients: [],
            fetchingClients: false,
            client: undefined,
            fetchingClient: false,
            clientContacts: [],
            fetchingClientContacts: false,
            clientCount: 0,
            clientPageInfo: defaultPageInfo,
        };
    },
    getters: {
        getClientContacts: (state): ClientContactType[] => state.clientContacts,
        getClients: (state): ClientType[] => state.clients,
        getClient: (state): ClientType | undefined => state.client,
        getClientByName: (state) => (name: string): ClientType | undefined => 
            state.clients?.find(cl => cl.name === name),
        getClientCount: (state): number | undefined => state.clientCount,
        getClientPageInfo: (state): PageInfo | undefined => state.clientPageInfo,
    },
    actions: {
        async fetchClients(params: any): Promise<void> {
            try {
                this.fetchingClients = true;
                const result = await withClientQuery<GetAllClientsQuery, GetAllClientsQueryVariables>(
                    GetAllClientsDocument, 
                    params, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'clientAll' in result) {
                    const page = result.clientAll as any;
                    const clients = page.items || [];
                    
                    if (params.filterAction) {
                        this.clients = [];
                        this.clients = clients as ClientType[];
                    } else {
                        this.clients = addListsUnique(this.clients, clients as ClientType[], 'uid');
                    }

                    this.clientCount = page?.totalCount;
                    this.clientPageInfo = page?.pageInfo || defaultPageInfo;
                } else {
                    console.error('Invalid clients data received:', result);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                this.fetchingClients = false;
            }
        },
        
        async searchClients(queryString: string): Promise<void> {
            try {
                this.fetchingClients = true;
                const result = await withClientQuery<SearchClientsQuery, SearchClientsQueryVariables>(
                    SearchClientsDocument, 
                    { queryString }, 
                    'clientSearch'
                );
                
                if (result && Array.isArray(result)) {
                    // Use type assertion for the search results
                    this.clients = result as unknown as ClientType[];
                } else {
                    console.error('Invalid search results received:', result);
                }
            } catch (error) {
                console.error('Error searching clients:', error);
            } finally {
                this.fetchingClients = false;
            }
        },
        
        async fetchClientByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid client UID provided to fetchClientByUid');
                return;
            }
            
            try {
                this.fetchingClient = true;
                const result = await withClientQuery<GetClientByUidQuery, GetClientByUidQueryVariables>(
                    GetClientByUidDocument, 
                    { uid }, 
                    'clientByUid'
                );
                
                if (result && typeof result === 'object') {
                    // Use type assertion for the client result
                    this.client = result as unknown as ClientType;
                    
                    // Add district to location store if available
                    if (result.district) {
                        useLocationStore().addDistrict(result.district);
                    }
                } else {
                    console.error('Invalid client data received:', result);
                }
            } catch (error) {
                console.error('Error fetching client by UID:', error);
            } finally {
                this.fetchingClient = false;
            }
        },
        
        addClient(payload: ClientType): void {
            if (!payload?.uid) {
                console.error('Invalid client payload:', payload);
                return;
            }
            
            this.clients?.unshift(payload);
        },
        
        updateClient(payload: ClientType): void {
            if (!payload?.uid) {
                console.error('Invalid client payload:', payload);
                return;
            }
            
            this.clients = this.clients?.map(item => (item.uid === payload.uid ? payload : item));
            this.client = { ...this.client, ...payload };
        },

        async fetchClientContacts(clientUid: string): Promise<void> {
            if (!clientUid) {
                console.error('Invalid client UID provided to fetchClientContacts');
                return;
            }
            
            try {
                this.fetchingClientContacts = true;
                const result = await withClientQuery<GetClientContactsByClientUidQuery, GetClientContactsByClientUidQueryVariables>(
                    GetClientContactsByClientUidDocument, 
                    { clientUid }, 
                    'clientContactByClientUid'
                );
                
                if (result && Array.isArray(result)) {
                    // Use type assertion for the client contacts
                    this.clientContacts = result as unknown as ClientContactType[];
                } else {
                    console.error('Invalid client contacts data received:', result);
                }
            } catch (error) {
                console.error('Error fetching client contacts:', error);
            } finally {
                this.fetchingClientContacts = false;
            }
        },
        
        addClientContact(payload: ClientContactType): void {
            if (!payload?.uid) {
                console.error('Invalid client contact payload:', payload);
                return;
            }
            
            this.clientContacts?.unshift(payload);
        },
        
        updateClientContact(payload: ClientContactType): void {
            if (!payload?.uid) {
                console.error('Invalid client contact payload:', payload);
                return;
            }
            
            this.clientContacts = this.clientContacts?.map(item => (item.uid === payload.uid ? payload : item));
        },
        
        deleteClientContact(uid: string): void {
            if (!uid) {
                console.error('Invalid client contact UID provided to deleteClientContact');
                return;
            }
            
            this.clientContacts = this.clientContacts?.filter(item => (item.uid !== uid));
        }
    },
});
