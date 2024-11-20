import { defineStore } from 'pinia';
import { addListsUnique } from '@/utils/helpers';
import { IIdentification, IPatient } from '@/models/patient';
import { IPageInfo } from '@/models/pagination';

import  useApiUtil  from '@/composables/api_util';
import { GetAllPatientsDocument, GetAllPatientsQuery, GetAllPatientsQueryVariables, GetPatientByUidDocument, GetPatientByUidQuery, GetPatientByUidQueryVariables, IdentificationTypesDocument, IdentificationTypesQuery, IdentificationTypesQueryVariables, SearchPatientsDocument, SearchPatientsQuery, SearchPatientsQueryVariables, useIdentificationTypesQuery } from '@/graphql/operations/patient.queries';

const { withClientQuery } = useApiUtil();

export const usePatientStore = defineStore('patient', {
    state: () => {
        return {
            identifications: [],
            patients: [],
            searchQuery: '',
            fetchingPatients: false,
            patient: undefined,
            fetchingPatient: false,
            patientCount: 0,
            patientPageInfo: undefined,
        } as {
            identifications: IIdentification[];
            patients: IPatient[];
            searchQuery: string;
            fetchingPatients: boolean;
            patient?: IPatient;
            fetchingPatient: boolean;
            patientCount?: number;
            patientPageInfo?: IPageInfo;
        };
    },
    getters: {
        getPatients: state => state.patients,
        getIdentifications: state => state.identifications,
        getSearchQuery: state => state.searchQuery,
        getPatientByUid: state => (uid: string) => state.patients?.find(p => p.uid === uid),
        getPatient: state => state.patient,
        getPatientCount: state => state.patientCount,
        getPatientPageInfo: state => state.patientPageInfo,
    },
    actions: {
        // identifications
        async fetchIdentifications() {
            await withClientQuery<IdentificationTypesQuery, IdentificationTypesQueryVariables>(IdentificationTypesDocument, {}, 'identificationAll').then(payload => {
                this.identifications = payload;
            });
        },
        addIdentification(payload) {
            this.identifications?.unshift(payload);
        },
        updateIdentification(payload) {
            const index = this.identifications!.findIndex(pt => pt.uid === payload.uid);
            this.identifications[index] = {
                ...this.identifications![index],
                ...payload,
            };
        },

        // patiets
        async fetchPatients(params) {
            this.fetchingPatients = true;
            await withClientQuery<GetAllPatientsQuery, GetAllPatientsQueryVariables>(GetAllPatientsDocument, { ...params, sortBy: ['-uid'] }, undefined)
                .then(payload => {
                    this.fetchingPatients = false;
                    const page = payload.patientAll;
                    const patients = page.items;
                    if (params.filterAction) {
                        this.patients = [];
                        this.patients = patients;
                    } else {
                        this.patients = addListsUnique(this.patients, patients, 'uid');
                    }

                    this.patientCount = page?.totalCount;
                    this.patientPageInfo = page?.pageInfo;
                })
                .catch(err => (this.fetchingPatients = false));
        },
        addPatient(payload) {
            this.patients?.unshift(payload);
        },
        updatePatient(payload) {
            const index = this.patients!.findIndex(pt => pt.uid === payload.uid);
            this.patients[index] = { ...this.patients![index], ...payload };
            this.patient = { ...this.patient, ...payload };
        },
        async fetchPtientByUid(uid) {
            if (!uid) {
                return;
            }
            this.fetchingPatient = true;
            await withClientQuery<GetPatientByUidQuery, GetPatientByUidQueryVariables>(GetPatientByUidDocument, { uid }, 'patientByUid')
                .then(payload => {
                    this.fetchingPatient = false;
                    this.patient = payload;
                })
                .catch(err => (this.fetchingPatient = false));
        },
        async setPatient(payload: IPatient) {
            if (!payload) {
                return;
            }
            this.fetchingPatient = true;
            this.patient = payload;
            this.fetchingPatient = false;
        },

        async resetPatient() {
            this.patient = undefined;
        },

        async searchPatients(queryString: string) {
            this.searchQuery = queryString;
            await withClientQuery<SearchPatientsQuery, SearchPatientsQueryVariables>(SearchPatientsDocument, { queryString }, 'patientSearch').then(payload => (this.patients = payload));
        },

        clearSearchQuery() {
            this.searchQuery = '';
        },
    },
});
