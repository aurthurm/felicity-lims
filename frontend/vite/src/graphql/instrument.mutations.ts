import gql from 'graphql-tag';

// SUPPLIERS
export const ADD_SUPPLIER= gql`
  mutation AddSupplier ($payload: SupplierInputType!) {
    createSupplier(payload: $payload)  {
      ... on SupplierType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_SUPPLIER= gql`
  mutation EditSupplier ($uid: Int!, $payload: SupplierInputType!) {
    updateSupplier(uid: $uid, payload: $payload){
      ... on SupplierType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


// MANUFACTURERS
export const ADD_MANUFACTURER = gql`
  mutation AddManufacturer ($payload: ManufacturerInputType!) {
    createManufacturer(payload: $payload)  {
      ... on ManufacturerType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_MANUFACTURER = gql`
  mutation EditManufacturer ($uid: Int!, $payload: ManufacturerInputType!) {
    updateManufacturer(uid: $uid, payload: $payload){
      ... on ManufacturerType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


// INSTRUMENT TYPES
export const ADD_INSTRUMENT_TYPE = gql`
  mutation AddInstrumentType ($payload: InstrumentTypeInputType!) {
    createInstrumentType(payload: $payload)  {
      ... on InstrumentTypeType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_INSTRUMENT_TYPE = gql`
  mutation EditInstrumentType ($uid: Int!, $payload: InstrumentTypeInputType!) {
    updateInstrumentType(uid: $uid, payload: $payload){
      ... on InstrumentTypeType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


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

