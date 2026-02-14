import{k as a,d,f as r,ak as c}from"./index-DCVfsbos.js";const o=a`
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
    `,h=a`
    query identificationTypes {
  identificationAll {
    uid
    name
  }
}
    `,{withClientQuery:n}=r(),m=d("patient",{state:()=>({identifications:[],patients:[],searchQuery:"",fetchingPatients:!1,patient:void 0,fetchingPatient:!1,patientCount:0,patientPageInfo:void 0}),getters:{getPatients:t=>t.patients,getIdentifications:t=>t.identifications,getSearchQuery:t=>t.searchQuery,getPatientByUid:t=>i=>t.patients?.find(e=>e.uid===i),getPatient:t=>t.patient,getPatientCount:t=>t.patientCount,getPatientPageInfo:t=>t.patientPageInfo},actions:{async fetchIdentifications(){try{const t=await n(h,{},"identificationAll");t&&Array.isArray(t)&&(this.identifications=t)}catch{}},addIdentification(t){t?.uid&&this.identifications.unshift(t)},updateIdentification(t){if(!t?.uid)return;const i=this.identifications.findIndex(e=>e.uid===t.uid);i>-1&&(this.identifications[i]={...this.identifications[i],...t})},async fetchPatients(t){try{this.fetchingPatients=!0;const i=await n(o,{...t,sortBy:["-uid"]},void 0);if(i&&typeof i=="object"&&"patientAll"in i){const e=i.patientAll,s=e.items||[];t.filterAction?(this.patients=[],this.patients=s):this.patients=c(this.patients,s,"uid"),this.patientCount=e?.totalCount||0,this.patientPageInfo=e?.pageInfo}}catch{}finally{this.fetchingPatients=!1}},addPatient(t){t?.uid&&this.patients.unshift(t)},updatePatient(t){if(!t?.uid)return;const i=this.patients.findIndex(e=>e.uid===t.uid);i>-1&&(this.patients[i]={...this.patients[i],...t}),this.patient?.uid===t.uid&&(this.patient={...this.patient,...t})},async fetchPatientByUid(t){if(t)try{this.fetchingPatient=!0;const i=await n(f,{uid:t},"patientByUid");i&&typeof i=="object"&&(this.patient=i)}catch{}finally{this.fetchingPatient=!1}},async setPatient(t){t?.uid&&(this.patient=t)},async resetPatient(){this.patient=void 0},async searchPatients(t){if(t)try{this.searchQuery=t;const i=await n(u,{queryString:t},"patientSearch");i&&Array.isArray(i)&&(this.patients=i)}catch{}},clearSearchQuery(){this.searchQuery=""}}});export{m as u};
