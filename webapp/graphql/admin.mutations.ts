import gql from 'graphql-tag';

export const ADD_COUNTRY = gql`
    mutation AddCountry($payload: CountryInputType!) {
        createCountry(payload: $payload) {
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
    mutation editCountry($uid: String!, $payload: CountryInputType!) {
        updateCountry(uid: $uid, payload: $payload) {
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
    mutation AddProvince($payload: ProvinceInputType!) {
        createProvince(payload: $payload) {
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
    mutation editProvince($uid: String!, $payload: ProvinceInputType!) {
        updateProvince(uid: $uid, payload: $payload) {
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
    mutation AddDistrict($payload: DistrictInputType!) {
        createDistrict(payload: $payload) {
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
    mutation editDistrict($uid: String!, $payload: DistrictInputType!) {
        updateDistrict(uid: $uid, payload: $payload) {
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
