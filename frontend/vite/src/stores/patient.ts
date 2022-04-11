import { defineStore } from 'pinia'
import { GET_ALL_PATIENTS, SEARCH_PATIENTS, GET_PATIENT_BY_UID } from '../graphql/patient.queries';
import { addListsUnique } from '../utils';
import { IPatient } from '../models/patient'

import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()


export const usePatientStore = defineStore('patient', {
  state: () => {
      return {
        patients: [],
        patient: undefined,
        patientCount: 0,
        patientPageInfo: undefined,
      } as {
        patients: IPatient[];
        patient?: IPatient;
        patientCount?: number;
        patientPageInfo?: any
      }
  },
  getters: {
    getPatients: (state) => state.patients,
    getPatientByUid: (state) => (uid: number) => state.patients?.find(p => p.uid === uid),
    getPatient: (state) => state.patient,
    getPatientCount: (state) => state.patientCount,
    getPatientPageInfo: (state) => state.patientPageInfo,
  },
  actions: {

    async fetchPatients(params){
      await withClientQuery(GET_ALL_PATIENTS, { ...params, sortBy: ["-uid"] }, undefined)
      .then(payload => {
        const page = payload.patientAll
        const patients = page.items;
        if(params.filterAction){
          this.patients = [];
          this.patients = patients;
        } else {
          this.patients = addListsUnique(this.patients, patients, "uid");
        }
    
        this.patientCount = page?.totalCount;
        this.patientPageInfo = page?.pageInfo;
      });
    },
    addPatient(payload){
      this.patients?.unshift(payload);
    },
    updatePatient(payload) {
      const index = this.patients!.findIndex(pt => pt.uid === payload.uid)
      this.patients[index] = { ...this.patients![index], ...payload }
      this.patient = payload;
    },
    async fetchPtientByUid(uid){
      await withClientQuery(GET_PATIENT_BY_UID, { uid }, "patientByUid")
      .then(payload => this.patient = payload)
    },
    async searchPatients(queryString: string){
      await withClientQuery(SEARCH_PATIENTS, { queryString }, "patientSearch")
        .then(payload => this.patients = payload)
    }
  
  }
})
