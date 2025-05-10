import{g as c,f as l,d as o,ae as a}from"./index-9a11e11f.js";import{u as d}from"./location-6243959b.js";const u=c`
    query getAllClients($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  clientAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      code
      contacts {
        uid
        firstName
        lastName
        email
        mobilePhone
        consentSms
      }
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
      }
    }
  }
}
    `,C=c`
    query searchClients($queryString: String!) {
  clientSearch(queryString: $queryString) {
    uid
    name
    code
    district {
      uid
      name
      province {
        uid
        name
        country {
          uid
          name
        }
      }
    }
  }
}
    `,f=c`
    query getClientContactsByClientUid($clientUid: String!) {
  clientContactByClientUid(clientUid: $clientUid) {
    uid
    firstName
    lastName
    email
    mobilePhone
    consentSms
  }
}
    `,h=c`
    query getClientByUid($uid: String!) {
  clientByUid(uid: $uid) {
    uid
    name
    code
    districtUid
    district {
      uid
      name
      provinceUid
      province {
        uid
        name
        countryUid
        country {
          uid
          name
        }
      }
    }
  }
}
    `,{withClientQuery:n}=l(),s={hasNextPage:!1,hasPreviousPage:!1,startCursor:null,endCursor:null},m=o("client",{state:()=>({clients:[],fetchingClients:!1,client:void 0,fetchingClient:!1,clientContacts:[],fetchingClientContacts:!1,clientCount:0,clientPageInfo:s}),getters:{getClientContacts:t=>t.clientContacts,getClients:t=>t.clients,getClient:t=>t.client,getClientByName:t=>e=>t.clients?.find(i=>i.name===e),getClientCount:t=>t.clientCount,getClientPageInfo:t=>t.clientPageInfo},actions:{async fetchClients(t){try{this.fetchingClients=!0;const e=await n(u,t,void 0);if(e&&typeof e=="object"&&"clientAll"in e){const i=e.clientAll,r=i.items||[];t.filterAction?(this.clients=[],this.clients=r):this.clients=a(this.clients,r,"uid"),this.clientCount=i?.totalCount,this.clientPageInfo=i?.pageInfo||s}else console.error("Invalid clients data received:",e)}catch(e){console.error("Error fetching clients:",e)}finally{this.fetchingClients=!1}},async searchClients(t){try{this.fetchingClients=!0;const e=await n(C,{queryString:t},"clientSearch");e&&Array.isArray(e)?this.clients=e:console.error("Invalid search results received:",e)}catch(e){console.error("Error searching clients:",e)}finally{this.fetchingClients=!1}},async fetchClientByUid(t){if(!t){console.error("Invalid client UID provided to fetchClientByUid");return}try{this.fetchingClient=!0;const e=await n(h,{uid:t},"clientByUid");e&&typeof e=="object"?(this.client=e,e.district&&d().addDistrict(e.district)):console.error("Invalid client data received:",e)}catch(e){console.error("Error fetching client by UID:",e)}finally{this.fetchingClient=!1}},addClient(t){if(!t?.uid){console.error("Invalid client payload:",t);return}this.clients?.unshift(t)},updateClient(t){if(!t?.uid){console.error("Invalid client payload:",t);return}this.clients=this.clients?.map(e=>e.uid===t.uid?t:e),this.client={...this.client,...t}},async fetchClientContacts(t){if(!t){console.error("Invalid client UID provided to fetchClientContacts");return}try{this.fetchingClientContacts=!0;const e=await n(f,{clientUid:t},"clientContactByClientUid");e&&Array.isArray(e)?this.clientContacts=e:console.error("Invalid client contacts data received:",e)}catch(e){console.error("Error fetching client contacts:",e)}finally{this.fetchingClientContacts=!1}},addClientContact(t){if(!t?.uid){console.error("Invalid client contact payload:",t);return}this.clientContacts?.unshift(t)},updateClientContact(t){if(!t?.uid){console.error("Invalid client contact payload:",t);return}this.clientContacts=this.clientContacts?.map(e=>e.uid===t.uid?t:e)},deleteClientContact(t){if(!t){console.error("Invalid client contact UID provided to deleteClientContact");return}this.clientContacts=this.clientContacts?.filter(e=>e.uid!==t)}}});export{m as u};
