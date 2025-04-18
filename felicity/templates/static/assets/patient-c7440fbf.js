import{g as a,e as d,d as c,af as r}from"./index-d30fd8e2.js";const o=a`
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
    `,{withClientQuery:n}=d(),m=c("patient",{state:()=>({identifications:[],patients:[],searchQuery:"",fetchingPatients:!1,patient:void 0,fetchingPatient:!1,patientCount:0,patientPageInfo:void 0}),getters:{getPatients:t=>t.patients,getIdentifications:t=>t.identifications,getSearchQuery:t=>t.searchQuery,getPatientByUid:t=>i=>t.patients?.find(e=>e.uid===i),getPatient:t=>t.patient,getPatientCount:t=>t.patientCount,getPatientPageInfo:t=>t.patientPageInfo},actions:{async fetchIdentifications(){await n(h,{},"identificationAll").then(t=>{this.identifications=t})},addIdentification(t){this.identifications?.unshift(t)},updateIdentification(t){const i=this.identifications.findIndex(e=>e.uid===t.uid);this.identifications[i]={...this.identifications[i],...t}},async fetchPatients(t){this.fetchingPatients=!0,await n(o,{...t,sortBy:["-uid"]},void 0).then(i=>{this.fetchingPatients=!1;const e=i.patientAll,s=e.items;t.filterAction?(this.patients=[],this.patients=s):this.patients=r(this.patients,s,"uid"),this.patientCount=e?.totalCount,this.patientPageInfo=e?.pageInfo}).catch(i=>this.fetchingPatients=!1)},addPatient(t){this.patients?.unshift(t)},updatePatient(t){const i=this.patients.findIndex(e=>e.uid===t.uid);this.patients[i]={...this.patients[i],...t},this.patient={...this.patient,...t}},async fetchPtientByUid(t){t&&(this.fetchingPatient=!0,await n(f,{uid:t},"patientByUid").then(i=>{this.fetchingPatient=!1,this.patient=i}).catch(i=>this.fetchingPatient=!1))},async setPatient(t){t&&(this.fetchingPatient=!0,this.patient=t,this.fetchingPatient=!1)},async resetPatient(){this.patient=void 0},async searchPatients(t){this.searchQuery=t,await n(u,{queryString:t},"patientSearch").then(i=>this.patients=i)},clearSearchQuery(){this.searchQuery=""}}});export{m as u};
