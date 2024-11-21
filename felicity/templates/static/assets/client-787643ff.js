import{H as s,I as l,Q as a,a6 as r}from"./index-48799f0c.js";import{u as o}from"./location-5cf35114.js";const C=s`
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
    `,h=s`
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
    `,u=s`
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
    `,d=s`
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
    `,{withClientQuery:n}=l(),m=a("client",{state:()=>({clients:[],fetchingClients:!1,client:void 0,fetchingClient:!1,clientContacts:[],fetchingClientContacts:!1,clientCount:0,clientPageInfo:{}}),getters:{getClientContacts:t=>t.clientContacts,getClients:t=>t.clients,getClient:t=>t.client,getClientByName:t=>e=>t.clients?.find(i=>i.name===e),getClientCount:t=>t.clientCount,getClientPageInfo:t=>t.clientPageInfo},actions:{async fetchClients(t){this.fetchingClients=!0,await n(C,t,void 0).then(e=>{this.fetchingClients=!1;const i=e.clientAll,c=i.items;t.filterAction?(this.clients=[],this.clients=c):this.clients=r(this.clients,c,"uid"),this.clientCount=i?.totalCount,this.clientPageInfo=i?.pageInfo}).catch(e=>this.fetchingClients=!1)},async searchClients(t){this.fetchingClients=!0,await n(h,{queryString:t},"clientSearch").then(e=>{this.fetchingClients=!1,this.clients=e}).catch(e=>this.fetchingClients=!1)},async fetchClientByUid(t){t&&(this.fetchingClient=!0,await n(d,{uid:t},"clientByUid").then(e=>{this.fetchingClient=!1,this.client=e,e?.district&&o().addDistrict(e?.district)}).catch(e=>this.fetchingClient=!1))},addClient(t){this.clients?.unshift(t)},updateClient(t){this.clients=this.clients?.map(e=>e.uid===t.uid?t:e),this.client={...this.client,...t}},async fetchClientContacts(t){t&&(this.fetchingClientContacts=!0,await n(u,{clientUid:t},"clientContactByClientUid").then(e=>{this.fetchingClientContacts=!1,this.clientContacts=e}).catch(e=>this.fetchingClientContacts=!1))},addClientContact(t){this.clientContacts?.unshift(t)},updateClientContact(t){this.clientContacts=this.clientContacts?.map(e=>e.uid===t.uid?t:e)},deleteClientContact(t){this.clientContacts=this.clientContacts?.filter(e=>e.uid!==t)}}});export{m as u};
