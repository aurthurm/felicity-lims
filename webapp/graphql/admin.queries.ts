import gql from 'graphql-tag';

export const GET_ALL_COUNTRIES = gql`
    query getAllCountries {
        countryAll {
            uid
            name
            code
        }
    }
`;

export const GET_ALL_PROVINCES = gql`
    query getAllProvinces {
        provinceAll {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
                code
                email
                emailCc
                businessPhone
                mobilePhone
                countryUid
            }
        }
    }
`;

export const FILTER_PROVINCES_BY_COUNTRY = gql`
    query filterProvincesByCountry($uid: FelicityID!) {
        provincesByCountryUid(uid: $uid) {
            name
            uid
            code
            countryUid
        }
    }
`;

export const GET_ALL_DISTRICTS = gql`
    query getAllDistricts {
        districtAll {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
                code
                email
                emailCc
                businessPhone
                mobilePhone
                provinceUid
            }
        }
    }
`;

export const FILTER_DISTRICTS_BY_PROVINCE = gql`
    query filterDistrictsByProvince($uid: FelicityID!) {
        districtsByProvinceUid(uid: $uid) {
            name
            uid
            code
            provinceUid
        }
    }
`;
