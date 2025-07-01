import{g as t}from"./index-0a787601.js";const n=t`
    mutation AddClient($payload: ClientInputType!) {
  createClient(payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,o=t`
    mutation editClient($uid: String!, $payload: ClientInputType!) {
  updateClient(uid: $uid, payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,i=t`
    mutation AddClientContact($payload: ClientContactInputType!) {
  createClientContact(payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,a=t`
    mutation editClientContact($uid: String!, $payload: ClientContactInputType!) {
  updateClientContact(uid: $uid, payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,d=t`
    mutation deleteClientContact($uid: String!) {
  deleteClientContact(uid: $uid) {
    ... on DeletedItem {
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;export{n as A,d as D,o as E,i as a,a as b};
