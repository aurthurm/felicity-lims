import gql from 'graphql-tag';


export const ADD_PATIENT = gql`
  mutation AddPatient($payload: PatientInputType!){
  createPatient(payload: $payload) {
    ... on PatientType {
      __typename
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
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`;

export const UPDATE_PATIENT = gql`
  mutation EditPatient($uid: Int!,$payload: PatientInputType!){
  updatePatient(uid: $uid, payload: $payload) {
    ... on PatientType {
      __typename
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
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`;