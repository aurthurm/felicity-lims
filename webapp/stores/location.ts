import { defineStore } from 'pinia';
import { IDistrict, IProvince, ICountry } from '@/models/location';

import {
    GetAllCountriesQuery, GetAllCountriesQueryVariables, GetAllCountriesDocument, 
    FilterProvincesByCountryQuery, FilterProvincesByCountryQueryVariables, FilterProvincesByCountryDocument, 
    FilterDistrictsByProvinceQuery,
    FilterDistrictsByProvinceQueryVariables,
    FilterDistrictsByProvinceDocument
} from '@/graphql/operations/admin.queries';

import  useApiUtil  from '@/composables/api_util';

const { withClientQuery } = useApiUtil();

export const useLocationStore = defineStore('location', {
    state: () => {
        return {
            countries: [],
            fetchingCountries: false,
            provinces: [],
            fetchingProvinces: false,
            districts: [],
            fetchingDstricts: false,
            confRoute: '',
        } as {
            confRoute: string;
            countries: ICountry[];
            fetchingCountries: boolean;
            provinces: IProvince[];
            fetchingProvinces: boolean;
            districts: IDistrict[];
            fetchingDstricts: boolean;
        };
    },
    getters: {
        getConfRoute: state => state.confRoute,
        getCountries: state => state.countries,
        getProvinces: state => state.provinces,
        getDistricts: state => state.districts,
    },
    actions: {
        updateConfRoute(val: string) {
            this.confRoute = val;
        },

        // COUNTRIES
        async fetchCountries() {
            this.fetchingCountries = true;
            await withClientQuery<GetAllCountriesQuery, GetAllCountriesQueryVariables>(GetAllCountriesDocument, {}, 'countryAll')
                .then(payload => {
                    this.fetchingCountries = false;
                    this.countries = payload;
                    this.provinces = [];
                })
                .catch(err => (this.fetchingCountries = false));
        },
        async addCountry(country: ICountry) {
            this.countries.unshift(country);
        },
        updateCountry(payload: ICountry) {
            const index = this.countries?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.countries[index] = payload;
            }
        },

        // PROVINCES
        async filterProvincesByCountry(countryUid: string) {
            if (!countryUid) {
                return;
            }
            this.fetchingProvinces = true;
            await withClientQuery<FilterProvincesByCountryQuery, FilterProvincesByCountryQueryVariables>(FilterProvincesByCountryDocument, { uid: countryUid }, 'provincesByCountryUid', 'network-only')
                .then(payload => {
                    this.fetchingProvinces = false;
                    this.provinces = payload;
                    this.districts = [];
                })
                .catch(err => (this.fetchingProvinces = false));
        },
        addProvince(payload: IProvince) {
            this.provinces.unshift(payload);
        },
        updateProvince(payload: IProvince) {
            const index = this.provinces?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.provinces[index] = payload;
            }
        },

        // DISTRICT
        async filterDistrictsByProvince(provinceUid: string) {
            if (!provinceUid) {
                return;
            }
            this.fetchingDstricts = true;
            await withClientQuery<FilterDistrictsByProvinceQuery, FilterDistrictsByProvinceQueryVariables>(FilterDistrictsByProvinceDocument, { uid: provinceUid }, 'districtsByProvinceUid', 'network-only')
                .then(payload => {
                    this.fetchingDstricts = false;
                    this.districts = payload;
                })
                .catch(err => (this.fetchingDstricts = false));
        },
        addDistrict(payload: IDistrict) {
            this.districts.unshift(payload);
            if(payload?.province){
                this.provinces.push(payload?.province)
            }
        },
        updateDistrict(payload: IDistrict) {
            const index = this.districts?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.districts[index] = payload;
            }
        },
    },
});
