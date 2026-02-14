import{k as s,d as a,f as r,ak as o}from"./index-DApeomWQ.js";import{u}from"./location-CzglHsxT.js";const C=s`
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
    `,f=s`
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
    `,d=s`
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
    `,h=s`
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
    `,{withClientQuery:n}=r(),l={hasNextPage:!1,hasPreviousPage:!1,startCursor:null,endCursor:null},m=a("client",{state:()=>({clients:[],fetchingClients:!1,client:void 0,fetchingClient:!1,clientContacts:[],fetchingClientContacts:!1,clientCount:0,clientPageInfo:l}),getters:{getClientContacts:t=>t.clientContacts,getClients:t=>t.clients,getClient:t=>t.client,getClientByName:t=>e=>t.clients?.find(i=>i.name===e),getClientCount:t=>t.clientCount,getClientPageInfo:t=>t.clientPageInfo},actions:{async fetchClients(t){try{this.fetchingClients=!0;const e=await n(C,t,void 0);if(e&&typeof e=="object"&&"clientAll"in e){const i=e.clientAll,c=i.items||[];t.filterAction?(this.clients=[],this.clients=c):this.clients=o(this.clients,c,"uid"),this.clientCount=i?.totalCount,this.clientPageInfo=i?.pageInfo||l}}catch{}finally{this.fetchingClients=!1}},async searchClients(t){try{this.fetchingClients=!0;const e=await n(f,{queryString:t},"clientSearch");e&&Array.isArray(e)&&(this.clients=e)}catch{}finally{this.fetchingClients=!1}},async fetchClientByUid(t){if(t)try{this.fetchingClient=!0;const e=await n(h,{uid:t},"clientByUid");e&&typeof e=="object"&&(this.client=e,e.district&&u().addDistrict(e.district))}catch{}finally{this.fetchingClient=!1}},addClient(t){t?.uid&&this.clients?.unshift(t)},updateClient(t){t?.uid&&(this.clients=this.clients?.map(e=>e.uid===t.uid?t:e),this.client={...this.client,...t})},async fetchClientContacts(t){if(t)try{this.fetchingClientContacts=!0;const e=await n(d,{clientUid:t},"clientContactByClientUid");e&&Array.isArray(e)&&(this.clientContacts=e)}catch{}finally{this.fetchingClientContacts=!1}},addClientContact(t){t?.uid&&this.clientContacts?.unshift(t)},updateClientContact(t){t?.uid&&(this.clientContacts=this.clientContacts?.map(e=>e.uid===t.uid?t:e))},deleteClientContact(t){t&&(this.clientContacts=this.clientContacts?.filter(e=>e.uid!==t))}}});export{m as u};
