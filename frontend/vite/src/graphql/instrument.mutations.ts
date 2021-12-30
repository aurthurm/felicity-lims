import gql from 'graphql-tag';

// INSTRUMENT
export const ADD_INSTRUMENT= gql`
  mutation AddInstrument ($payload: InstrumentInputType!) {
    createInstrument(payload: $payload)  {
      ... on InstrumentType {
        __typename
        uid
        name
        description
        keyword
        supplier {
          uid
          name
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

export const EDIT_INSTRUMENT= gql`
  mutation EditInstrument ($uid: Int!, $payload: InstrumentInputType!) {
    updateInstrument(uid: $uid, payload: $payload){
      ... on InstrumentType {
        __typename
        uid
        name
        description
        keyword
        supplier {
          uid
          name
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


// METHOD
export const ADD_METHOD= gql`
  mutation AddMethod ($payload: MethodInputType!) {
    createMethod(payload: $payload) {
      ... on MethodType {
        __typename
        uid
        name
        description
        keyword
  
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_METHOD= gql`
  mutation EditMethod ($uid: Int!, $payload: MethodInputType!) {
    updateMethod(uid: $uid, payload: $payload){
      ... on MethodType {
        __typename
        uid
        name
        description
        keyword
  
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

