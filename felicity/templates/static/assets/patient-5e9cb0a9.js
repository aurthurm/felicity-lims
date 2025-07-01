import{g as a,f as s,d as o,af as d}from"./index-0a787601.js";const c=a`
    query getAllPatients($first: Int!, $after: String, $before: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  patientAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      clientUid
      client {
        uid
        name
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
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
        uid
        name
      }
    }
  }
}
    `,u=a`
    query searchPatients($queryString: String!) {
  patientSearch(queryString: $queryString) {
    uid
    clientPatientId
    patientId
    firstName
    middleName
    lastName
    age
    gender
    dateOfBirth
    ageDobEstimated
    client {
      uid
      name
      district {
        name
        province {
          name
        }
      }
    }
    phoneHome
    phoneMobile
    consentSms
    identifications {
      uid
      value
      identificationUid
      identification {
        uid
        name
      }
    }
    countryUid
    country {
      uid
      name
    }
    provinceUid
    province {
      uid
      name
    }
    districtUid
    district {
      uid
      name
    }
  }
}
    `,f=a`
    query getPatientByUid($uid: String!) {
  patientByUid(uid: $uid) {
    uid
    clientPatientId
    patientId
    firstName
    middleName
    lastName
    age
    gender
    dateOfBirth
    ageDobEstimated
    client {
      uid
      name
      district {
        name
        province {
          name
        }
      }
    }
    phoneHome
    phoneMobile
    consentSms
    identifications {
      uid
      value
      identificationUid
      identification {
        uid
        name
      }
    }
    countryUid
    country {
      uid
      name
    }
    provinceUid
    province {
      uid
      name
    }
    districtUid
    district {
      uid
      name
    }
  }
}
    `,l=a`
    query identificationTypes {
  identificationAll {
    uid
    name
  }
}
    `,{withClientQuery:n}=s(),p=o("patient",{state:()=>({identifications:[],patients:[],searchQuery:"",fetchingPatients:!1,patient:void 0,fetchingPatient:!1,patientCount:0,patientPageInfo:void 0}),getters:{getPatients:t=>t.patients,getIdentifications:t=>t.identifications,getSearchQuery:t=>t.searchQuery,getPatientByUid:t=>i=>t.patients?.find(e=>e.uid===i),getPatient:t=>t.patient,getPatientCount:t=>t.patientCount,getPatientPageInfo:t=>t.patientPageInfo},actions:{async fetchIdentifications(){try{const t=await n(l,{},"identificationAll");t&&Array.isArray(t)?this.identifications=t:console.error("Invalid identifications data received:",t)}catch(t){console.error("Error fetching identifications:",t)}},addIdentification(t){if(!t?.uid){console.error("Invalid identification payload:",t);return}this.identifications.unshift(t)},updateIdentification(t){if(!t?.uid){console.error("Invalid identification payload:",t);return}const i=this.identifications.findIndex(e=>e.uid===t.uid);i>-1&&(this.identifications[i]={...this.identifications[i],...t})},async fetchPatients(t){try{this.fetchingPatients=!0;const i=await n(c,{...t,sortBy:["-uid"]},void 0);if(i&&typeof i=="object"&&"patientAll"in i){const e=i.patientAll,r=e.items||[];t.filterAction?(this.patients=[],this.patients=r):this.patients=d(this.patients,r,"uid"),this.patientCount=e?.totalCount||0,this.patientPageInfo=e?.pageInfo}else console.error("Invalid patients data received:",i)}catch(i){console.error("Error fetching patients:",i)}finally{this.fetchingPatients=!1}},addPatient(t){if(!t?.uid){console.error("Invalid patient payload:",t);return}this.patients.unshift(t)},updatePatient(t){if(!t?.uid){console.error("Invalid patient payload:",t);return}const i=this.patients.findIndex(e=>e.uid===t.uid);i>-1&&(this.patients[i]={...this.patients[i],...t}),this.patient?.uid===t.uid&&(this.patient={...this.patient,...t})},async fetchPatientByUid(t){if(!t){console.error("Invalid UID provided to fetchPatientByUid");return}try{this.fetchingPatient=!0;const i=await n(f,{uid:t},"patientByUid");i&&typeof i=="object"?this.patient=i:console.error("Invalid patient data received:",i)}catch(i){console.error("Error fetching patient:",i)}finally{this.fetchingPatient=!1}},async setPatient(t){if(!t?.uid){console.error("Invalid patient payload:",t);return}this.patient=t},async resetPatient(){this.patient=void 0},async searchPatients(t){if(!t){console.error("Invalid query string provided to searchPatients");return}try{this.searchQuery=t;const i=await n(u,{queryString:t},"patientSearch");i&&Array.isArray(i)?this.patients=i:console.error("Invalid search results received:",i)}catch(i){console.error("Error searching patients:",i)}},clearSearchQuery(){this.searchQuery=""}}});export{p as u};
