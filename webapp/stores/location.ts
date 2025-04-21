import { defineStore } from 'pinia';
import { DistrictType, ProvinceType, CountryType } from '@/types/gql';

import {
    GetAllCountriesQuery, GetAllCountriesQueryVariables, GetAllCountriesDocument, 
    FilterProvincesByCountryQuery, FilterProvincesByCountryQueryVariables, FilterProvincesByCountryDocument, 
    FilterDistrictsByProvinceQuery,
    FilterDistrictsByProvinceQueryVariables,
    FilterDistrictsByProvinceDocument
} from '@/graphql/operations/admin.queries';

import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';

const { withClientQuery } = useApiUtil();
const { toastError } = useNotifyToast();

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
            countries: CountryType[];
            fetchingCountries: boolean;
            provinces: ProvinceType[];
            fetchingProvinces: boolean;
            districts: DistrictType[];
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
            try {
                this.fetchingCountries = true;
                const payload = await withClientQuery<GetAllCountriesQuery, GetAllCountriesQueryVariables>(
                    GetAllCountriesDocument, 
                    {}, 
                    'countryAll'
                );
                this.countries = payload as CountryType[];
                this.provinces = [];
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
            } finally {
                this.fetchingCountries = false;
            }
        },

        async addCountry(country: CountryType) {
            this.countries.unshift(country);
        },

        updateCountry(payload: CountryType) {
            const index = this.countries?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.countries[index] = payload;
            }
        },

        // PROVINCES
        async filterProvincesByCountry(countryUid: string) {
            if (!countryUid) return;
            
            try {
                this.fetchingProvinces = true;
                const payload = await withClientQuery<FilterProvincesByCountryQuery, FilterProvincesByCountryQueryVariables>(
                    FilterProvincesByCountryDocument, 
                    { uid: countryUid }, 
                    'provincesByCountryUid', 
                    'network-only'
                );
                this.provinces = payload as ProvinceType[];
                this.districts = [];
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
            } finally {
                this.fetchingProvinces = false;
            }
        },

        addProvince(payload: ProvinceType) {
            this.provinces.unshift(payload);
        },

        updateProvince(payload: ProvinceType) {
            const index = this.provinces?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.provinces[index] = payload;
            }
        },

        // DISTRICT
        async filterDistrictsByProvince(provinceUid: string) {
            if (!provinceUid) return;
            
            try {
                this.fetchingDstricts = true;
                const payload = await withClientQuery<FilterDistrictsByProvinceQuery, FilterDistrictsByProvinceQueryVariables>(
                    FilterDistrictsByProvinceDocument, 
                    { uid: provinceUid }, 
                    'districtsByProvinceUid', 
                    'network-only'
                );
                this.districts = payload as DistrictType[];
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
            } finally {
                this.fetchingDstricts = false;
            }
        },

        addDistrict(payload: DistrictType) {
            this.districts.unshift(payload);
            if (payload?.province) {
                this.provinces.push(payload.province);
            }
        },

        updateDistrict(payload: DistrictType) {
            const index = this.districts?.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.districts[index] = payload;
            }
        },
    },
});
