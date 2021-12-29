import gql from 'graphql-tag';

export const ADD_COUNTRY = gql`
  mutation AddCountry($name: String!, $code: String!) {
    createCountry(name: $name, code: $code) {
        ... on CountryType {
          __typename
          uid
          name
          code
        }
        ... on OperationError {
          __typename
          error
          suggestion
        }
    }
  }
`;

export const UPDATE_COUNTRY = gql`
  mutation editCountry($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateCountry(uid: $uid, name: $name, code: $code, active: $active) {
      ... on CountryType {
        __typename
        uid
        name
        code
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const ADD_PROVINCE = gql`
  mutation AddProvince($name: String!, $code: String!, $countryUid: Int!) {
    createProvince(name: $name, code: $code, countryUid: $countryUid) {
      ... on ProvinceType {
        __typename
        uid
        name
        code
        countryUid
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const UPDATE_PROVINCE = gql`
  mutation editProvince($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateProvince(uid: $uid, name: $name, code: $code, active: $active) {
      ... on ProvinceType {
        __typename
        uid
        name
        code
        countryUid
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const ADD_DISTRICT = gql`
  mutation AddDistrict($name: String!, $code: String, $provinceUid: Int!) {
    createDistrict(name: $name, code: $code, provinceUid: $provinceUid) {
      ... on DistrictType {
        __typename
        uid
        name
        code
        provinceUid
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


export const UPDATE_DISTRICT = gql`
  mutation editDistrict($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateDistrict(uid: $uid, name: $name, code: $code, active: $active) {
      ... on DistrictType {
        __typename
        uid
        name
        code
        provinceUid
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;