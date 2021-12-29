import gql from 'graphql-tag';


export const ADD_PATIENT = gql`
  mutation AddPatient(
    $clientPatientId: String!,
    $firstName: String!,
    $middleName: String,
    $lastName: String!,
    $age: Int!,
    $gender: Int!,
    $dateOfBirth: DateTime,
    $ageDobEstimated: Boolean,
    $clientUid: Int!,
    $phoneMobile: String!,
    $consentSms: Boolean,       
  ){
  createPatient(
      clientPatientId: $clientPatientId,
      firstName: $firstName,
      middleName: $middleName,
      lastName: $lastName,
      age: $age,
      gender: $gender,
      dateOfBirth: $dateOfBirth,
      ageDobEstimated: $ageDobEstimated,
      clientUid: $clientUid,
      phoneMobile: $phoneMobile,
      consentSms: $consentSms   
  ) {
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
  mutation EditPatient(
    $uid: Int!,
    $clientPatientId: String!,
    $firstName: String!,
    $middleName: String,
    $lastName: String!,
    $age: Int!,
    $gender: Int!,
    $dateOfBirth: DateTime,
    $ageDobEstimated: Boolean,
    $clientUid: Int!,
    $phoneMobile: String!,
    $consentSms: Boolean,       
  ){
  updatePatient(
      uid: $uid,
      clientPatientId: $clientPatientId,
      firstName: $firstName,
      middleName: $middleName,
      lastName: $lastName,
      age: $age,
      gender: $gender,
      dateOfBirth: $dateOfBirth,
      ageDobEstimated: $ageDobEstimated,
      clientUid: $clientUid,
      phoneMobile: $phoneMobile,
      consentSms: $consentSms   
  ) {
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