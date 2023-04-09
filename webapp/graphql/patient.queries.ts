import gql from 'graphql-tag';


export const GET_ALL_PATIENTS = gql`
  query getAllPatients($first: Int!, $after: String, $before: String, $text: String!, $sortBy: [String!] = ["uid"]) {
    patientAll(pageSize:$first, afterCursor:$after, beforeCursor:$before, text:$text, sortBy:$sortBy) {
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
  }`;



export const SEARCH_PATIENTS = gql`
  query searchPatients($queryString: String!) {
    patientSearch(queryString: $queryString){
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
  }`;


export const GET_PATIENT_BY_UID = gql`
  query getPatientByUid($uid: FelicityID!) {
    patientByUid(uid: $uid){
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
  }`;

export const IDENTIFICATION_TYPES = gql`
  query identificationTypes {
    identificationAll {
        uid
        name
    }
}`;

