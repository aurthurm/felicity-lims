import gql from 'graphql-tag';

export const ADD_COUNTRY = gql`
  mutation AddCountry($name: String!, $code: String!) {
    createCountry(name: $name, code: $code) {
        uid
        name
        code
    }
  }
`;

export const UPDATE_COUNTRY = gql`
  mutation editCountry($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateCountry(uid: $uid, name: $name, code: $code, active: $active) {
        uid
        name
        code
    }
  }
`;

export const ADD_PROVINCE = gql`
  mutation AddProvince($name: String!, $code: String!, $countryUid: Int!) {
    createProvince(name: $name, code: $code, countryUid: $countryUid) {
        uid
        name
        code
        countryUid
    }
  }
`;

export const UPDATE_PROVINCE = gql`
  mutation editProvince($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateProvince(uid: $uid, name: $name, code: $code, active: $active) {
      uid
      name
      code
      countryUid
    }
  }
`;

export const ADD_DISTRICT = gql`
  mutation AddDistrict($name: String!, $code: String, $provinceUid: Int!) {
    createDistrict(name: $name, code: $code, provinceUid: $provinceUid) {
        uid
        name
        code
        provinceUid
    }
  }
`;


export const UPDATE_DISTRICT = gql`
  mutation editDistrict($uid: Int!, $name: String!, $code: String, $active: Boolean) {
    updateDistrict(uid: $uid, name: $name, code: $code, active: $active) {
      uid
      name
      code
      provinceUid
    }
  }
`;