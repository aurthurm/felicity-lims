import { defineStore } from 'pinia';
import { addListsUnique } from '@/utils';

import useApiUtil from '@/composables/api_util';
import { GetAllPatientsDocument, GetAllPatientsQuery, GetAllPatientsQueryVariables, GetPatientByUidDocument, GetPatientByUidQuery, GetPatientByUidQueryVariables, IdentificationTypesDocument, IdentificationTypesQuery, IdentificationTypesQueryVariables, SearchPatientsDocument, SearchPatientsQuery, SearchPatientsQueryVariables } from '@/graphql/operations/patient.queries';
import { IdentificationType, PatientType, PageInfo } from '@/types/gql';

const { withClientQuery } = useApiUtil();

type PatientStateType = {
    identifications: IdentificationType[];
    patients: PatientType[];
    searchQuery: string;
    fetchingPatients: boolean;
    patient?: PatientType;
    fetchingPatient: boolean;
    patientCount?: number;
    patientPageInfo?: PageInfo;
};

export const usePatientStore = defineStore('patient', {
    state: (): PatientStateType => ({
        identifications: [],
        patients: [],
        searchQuery: '',
        fetchingPatients: false,
        patient: undefined,
        fetchingPatient: false,
        patientCount: 0,
        patientPageInfo: undefined,
    }),
    getters: {
        getPatients: (state): PatientType[] => state.patients,
        getIdentifications: (state): IdentificationType[] => state.identifications,
        getSearchQuery: (state): string => state.searchQuery,
        getPatientByUid: (state) => (uid: string): PatientType | undefined => state.patients?.find(p => p.uid === uid),
        getPatient: (state): PatientType | undefined => state.patient,
        getPatientCount: (state): number | undefined => state.patientCount,
        getPatientPageInfo: (state): PageInfo | undefined => state.patientPageInfo,
    },
    actions: {
        // IDENTIFICATIONS
        async fetchIdentifications(): Promise<void> {
            try {
                const result = await withClientQuery<IdentificationTypesQuery, IdentificationTypesQueryVariables>(
                    IdentificationTypesDocument, 
                    {}, 
                    'identificationAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.identifications = result as IdentificationType[];
                } else {
                    console.error('Invalid identifications data received:', result);
                }
            } catch (error) {
                console.error('Error fetching identifications:', error);
            }
        },
        
        addIdentification(payload: IdentificationType): void {
            if (!payload?.uid) {
                console.error('Invalid identification payload:', payload);
                return;
            }
            
            this.identifications.unshift(payload);
        },
        
        updateIdentification(payload: IdentificationType): void {
            if (!payload?.uid) {
                console.error('Invalid identification payload:', payload);
                return;
            }
            
            const index = this.identifications.findIndex(pt => pt.uid === payload.uid);
            if (index > -1) {
                this.identifications[index] = {
                    ...this.identifications[index],
                    ...payload,
                };
            }
        },

        // PATIENTS
        async fetchPatients(params: any): Promise<void> {
            try {
                this.fetchingPatients = true;
                const result = await withClientQuery<GetAllPatientsQuery, GetAllPatientsQueryVariables>(
                    GetAllPatientsDocument, 
                    { ...params, sortBy: ['-uid'] }, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'patientAll' in result) {
                    const page = result.patientAll as { 
                        items?: PatientType[]; 
                        totalCount?: number; 
                        pageInfo?: PageInfo 
                    };
                    const patients = page.items || [];

                    if (params.filterAction) {
                        this.patients = [];
                        this.patients = patients;
                    } else {
                        this.patients = addListsUnique(this.patients, patients, 'uid');
                    }

                    this.patientCount = page?.totalCount || 0;
                    this.patientPageInfo = page?.pageInfo;
                } else {
                    console.error('Invalid patients data received:', result);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                this.fetchingPatients = false;
            }
        },
        
        addPatient(payload: PatientType): void {
            if (!payload?.uid) {
                console.error('Invalid patient payload:', payload);
                return;
            }
            
            this.patients.unshift(payload);
        },
        
        updatePatient(payload: PatientType): void {
            if (!payload?.uid) {
                console.error('Invalid patient payload:', payload);
                return;
            }
            
            const index = this.patients.findIndex(pt => pt.uid === payload.uid);
            if (index > -1) {
                this.patients[index] = { ...this.patients[index], ...payload };
            }
            
            if (this.patient?.uid === payload.uid) {
                this.patient = { ...this.patient, ...payload };
            }
        },
        
        async fetchPatientByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid UID provided to fetchPatientByUid');
                return;
            }
            
            try {
                this.fetchingPatient = true;
                const result = await withClientQuery<GetPatientByUidQuery, GetPatientByUidQueryVariables>(
                    GetPatientByUidDocument, 
                    { uid }, 
                    'patientByUid'
                );
                
                if (result && typeof result === 'object') {
                    this.patient = result as PatientType;
                } else {
                    console.error('Invalid patient data received:', result);
                }
            } catch (error) {
                console.error('Error fetching patient:', error);
            } finally {
                this.fetchingPatient = false;
            }
        },
        
        async setPatient(payload: PatientType): Promise<void> {
            if (!payload?.uid) {
                console.error('Invalid patient payload:', payload);
                return;
            }
            
            this.patient = payload;
        },
        
        async resetPatient(): Promise<void> {
            this.patient = undefined;
        },
        
        async searchPatients(queryString: string): Promise<void> {
            if (!queryString) {
                console.error('Invalid query string provided to searchPatients');
                return;
            }
            
            try {
                this.searchQuery = queryString;
                const result = await withClientQuery<SearchPatientsQuery, SearchPatientsQueryVariables>(
                    SearchPatientsDocument, 
                    { queryString }, 
                    'patientSearch'
                );
                
                if (result && Array.isArray(result)) {
                    this.patients = result as PatientType[];
                } else {
                    console.error('Invalid search results received:', result);
                }
            } catch (error) {
                console.error('Error searching patients:', error);
            }
        },
        
        clearSearchQuery(): void {
            this.searchQuery = '';
        },
    },
});
