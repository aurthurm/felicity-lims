import gql from 'graphql-tag';

export const ADD_CLIENT = gql`
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
            country{
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
`;

export const EDIT_CLIENT = gql`
  mutation editClient($uid: FelicityID!, $payload: ClientInputType!){
    updateClient(uid: $uid, payload: $payload){
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
            country{
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
`;

export const ADD_CLIENT_CONTACT = gql`
  mutation AddClientContact($payload: ClientContactInputType!) {
    createClientContact(payload: $payload){
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
`;

export const EDIT_CLIENT_CONTACT = gql`
  mutation editClientContact($uid: FelicityID!, $payload: ClientContactInputType!){
    updateClientContact(uid: $uid, payload: $payload){
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
`;