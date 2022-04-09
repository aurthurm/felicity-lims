import { defineStore } from 'pinia'
import {
  GET_ALL_SUPPLIERS,
  GET_ALL_MANUFACTURERS,
  GET_ALL_METHODS,
  GET_ALL_INSTRUMENT_TYPES,
  GET_ALL_INSTRUMENTS,
  GET_ALL_UNITS,
} from '../graphql/instrument.queries';
import { GET_DEPARTMENTS } from '../graphql/_queries';
import {
  GET_LABORATORY,
  GET_LABORATORY_SETTING
} from '../graphql/_queries';
import {
  IInstrument, IInstrumentType, 
  ILaboratory, ILaboratorySetting, 
  IManufacturer, IMethod, ISupplier, IUnit
} from '../models/setup'
import { IDepartment } from '../models/setup'

import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()


export const useSetupStore = defineStore('setup', {
  state: () => {
      return {
        laboratory: undefined,
        laboratorySetting: undefined,
        departments: [], 
        suppliers: [],
        manufacturers: [],
        instrumentTypes: [],
        instruments: [],
        methods: [],
        units: [],
      } as {
        laboratory?: ILaboratory;
        laboratorySetting?: ILaboratorySetting;
        departments: IDepartment[], 
        suppliers: ISupplier[];
        manufacturers: IManufacturer[];
        instrumentTypes: IInstrumentType[];
        instruments: IInstrument[];
        methods: IMethod[];
        units: IUnit[];
      }
  },
  getters: {  
    getLaboratory: (state) => state.laboratory,
    getLaboratorySetting: (state) => state.laboratorySetting,
    getDepartments: (state) => state.departments,
    getSuppliers: (state) => state.suppliers,
    getManufacturers: (state) => state.manufacturers,
    getInstrumentTypes: (state) => state.instrumentTypes,
    getInstruments: (state) => state.instruments,
    getMethods: (state) => state.methods,
    getUnits: (state) => state.units,
  },
  actions: {
    // DEPARMENT
    async fetchDepartments(params){
      await withClientQuery(GET_DEPARTMENTS, params, "departmentAll")
            .then((depts: IDepartment[]) => this.departments = depts)
    },
    addDepartment(payload): void {
      this.departments?.unshift(payload);
    },
    updateDepartment(payload: IDepartment): void {
      const index = this.departments?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.departments[index] = payload;
    },

    // LABORATORY
    async fetchLaboratory(){
      await withClientQuery(GET_LABORATORY, {}, "laboratory")
            .then(payload => this.laboratory = payload);
    },
    updateLaboratory(payload: ILaboratory): void {
      this.laboratory = payload
    },

    // LABORATORY SETTING
    async fetchLaboratorySetting() {
      await withClientQuery(GET_LABORATORY_SETTING, {}, "laboratorySetting")
            .then(payload => this.laboratorySetting = payload);
    },
    updateLaboratorySetting(payload: ILaboratorySetting){
      this.laboratorySetting = payload;
    },

    // SUPPLIERS
    async fetchSuppliers(){
      await withClientQuery(GET_ALL_SUPPLIERS, {}, "supplierAll")
            .then(payload => this.suppliers = payload);
    },
    addSupplier(payload): void {
      this.suppliers?.unshift(payload)
    },
    updateSupplier(payload: ISupplier): void {
      const index = this.suppliers?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.suppliers[index] = payload;
    },

    // MAUFACTURERS
    async fetchManufacturers(){
      await withClientQuery(GET_ALL_MANUFACTURERS, {}, "manufacturerAll")
            .then(payload => this.manufacturers = payload);
    },
    addManufacturer(payload){
      this.manufacturers?.unshift(payload);
    },
    updateManufacturer(payload: IManufacturer){
      const index = this.manufacturers?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.manufacturers[index] = payload;
    },

    // INSTRUMENT TYOES
    async fetchInstrumentTypes(){
      await withClientQuery(GET_ALL_INSTRUMENT_TYPES, {}, "instrumentTypeAll")
            .then(payload => this.instrumentTypes = payload?.items);
    },
    addInstrumentType(payload){
      this.instrumentTypes?.unshift(payload);
    },
    updateInstrumentType(payload: IInstrumentType){
      const index = this.instrumentTypes?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.instrumentTypes[index] = payload;
    },

    // INSTRUMENTS
    async fetchInstruments(){
      await withClientQuery(GET_ALL_INSTRUMENTS, {}, "instrumentAll")
            .then(payload => {
              this.instruments = payload?.items
            });
    },
    addInstrument(payload){
      this.instruments?.unshift(payload);
    },
    updateInstrument(payload: IInstrument){
      const index = this.instruments?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.instruments[index] = payload;
    },

    // METHODS
    async fetchMethods(){
      await withClientQuery(GET_ALL_METHODS, {}, "methodAll")
            .then(payload => this.methods = payload?.items);
    },
    addMethod(payload){
      this.methods?.unshift(payload);
    },
    updateMethod(payload){
      const index = this.methods?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.methods[index] = payload;
    },

    // UNITS
    async fetchUnits(){
      await withClientQuery(GET_ALL_UNITS, {}, "unitAll")
            .then(payload => this.units = payload);
    },
    addUnit(payload){
      this.units?.unshift(payload);
    },
    updateUnit(payload){
      const index = this.units?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.units[index] = payload;
    },

  }
})


