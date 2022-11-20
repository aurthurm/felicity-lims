add_patient_query = """
  mutation AddPatient($payload: PatientInputType!){
  createPatient(payload: $payload) {
    ... on PatientType {
        uid
        clientPatientId
        firstName
        lastName
        age
        gender
        dateOfBirth
        clientUid
        phoneMobile
        consentSms   
    }
    ... on OperationError {
        error
    }
  }
}
"""
