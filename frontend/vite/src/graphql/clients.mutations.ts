import gql from 'graphql-tag';

export const ADD_CLIENT = gql`
  mutation AddClient($name: String!, $code: String!, $districtUid: Int!) {
    createClient(name: $name, code: $code, districtUid: $districtUid) {
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
  mutation editClient($uid: Int!, $name: String!, $code: String!, $districtUid: Int!){
    updateClient(uid: $uid, name: $name, code: $code, districtUid: $districtUid){
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
  mutation AddClientContact($clientUid: Int!, $firstName: String!, $email: String, $mobilePhone: String) {
    createClientContact(clientUid: $clientUid, firstName:$firstName, email: $email, mobilePhone: $mobilePhone, isActive:true){
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
  mutation editClientContact($uid: Int!, $firstName: String!, $email: String, $mobilePhone: String){
    updateClientContact(uid: $uid, firstName: $firstName, email: $email, mobilePhone: $mobilePhone){
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