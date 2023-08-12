import { defineStore } from 'pinia';
import {
    GET_ALL_SUPPLIERS,
    GET_ALL_MANUFACTURERS,
    GET_ALL_METHODS,
    GET_ALL_INSTRUMENT_TYPES,
    GET_ALL_INSTRUMENTS,
    GET_ALL_UNITS,
} from '../graphql/operations/instrument.queries';
import { GET_DEPARTMENTS } from '../graphql/operations/_queries';
import { GET_LABORATORY, GET_LABORATORY_SETTING } from '../graphql/operations/_queries';
import { IInstrument, IInstrumentType, ILaboratory, ILaboratorySetting, IManufacturer, IMethod, ISupplier, IUnit } from '../models/setup';
import { IDepartment } from '../models/setup';

import { useApiUtil } from '../composables';

const { withClientQuery } = useApiUtil();

export const useSetupStore = defineStore('setup', {
    state: () => {
        return {
            laboratory: undefined,
            laboratorySetting: undefined,
            departments: [],
            fetchingDepartments: false,
            suppliers: [],
            fetchingSuppliers: false,
            manufacturers: [],
            fetchingManufacturers: false,
            instrumentTypes: [],
            fetchingInstrumentTypes: false,
            instruments: [],
            fetchingInstruments: false,
            methods: [],
            fetchingMethods: false,
            units: [],
            fetchingUnits: false,
        } as {
            laboratory?: ILaboratory;
            laboratorySetting?: ILaboratorySetting;
            departments: IDepartment[];
            fetchingDepartments: boolean;
            suppliers: ISupplier[];
            fetchingSuppliers: boolean;
            manufacturers: IManufacturer[];
            fetchingManufacturers: boolean;
            instrumentTypes: IInstrumentType[];
            fetchingInstrumentTypes: boolean;
            instruments: IInstrument[];
            fetchingInstruments: boolean;
            methods: IMethod[];
            fetchingMethods: boolean;
            units: IUnit[];
            fetchingUnits: boolean;
        };
    },
    getters: {
        getLaboratory: state => state.laboratory,
        getLaboratorySetting: state => state.laboratorySetting,
        getDepartments: state => state.departments,
        getSuppliers: state => state.suppliers,
        getManufacturers: state => state.manufacturers,
        getInstrumentTypes: state => state.instrumentTypes,
        getInstruments: state => state.instruments,
        getMethods: state => state.methods,
        getUnits: state => state.units,
    },
    actions: {
        // DEPARMENT
        async fetchDepartments(params) {
            this.fetchingDepartments = true;
            await withClientQuery(GET_DEPARTMENTS, params, 'departmentAll')
                .then((depts: IDepartment[]) => {
                    this.fetchingDepartments = false;
                    this.departments = depts;
                })
                .catch(err => (this.fetchingDepartments = false));
        },
        addDepartment(payload): void {
            this.departments?.unshift(payload);
        },
        updateDepartment(payload: IDepartment): void {
            const index = this.departments?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.departments[index] = payload;
        },

        // LABORATORY
        async fetchLaboratory() {
            await withClientQuery(GET_LABORATORY, {}, 'laboratory').then(payload => (this.laboratory = payload));
        },
        updateLaboratory(payload: ILaboratory): void {
            this.laboratory = payload;
        },

        // LABORATORY SETTING
        async fetchLaboratorySetting() {
            await withClientQuery(GET_LABORATORY_SETTING, {}, 'laboratorySetting').then(payload => (this.laboratorySetting = payload));
        },
        updateLaboratorySetting(payload: ILaboratorySetting) {
            this.laboratorySetting = payload;
        },

        // SUPPLIERS
        async fetchSuppliers() {
            this.fetchingSuppliers = true;
            await withClientQuery(GET_ALL_SUPPLIERS, {}, 'supplierAll')
                .then(payload => {
                    this.fetchingSuppliers = false;
                    this.suppliers = payload;
                })
                .catch(err => (this.fetchingSuppliers = false));
        },
        addSupplier(payload): void {
            this.suppliers?.unshift(payload);
        },
        updateSupplier(payload: ISupplier): void {
            const index = this.suppliers?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.suppliers[index] = payload;
        },

        // MAUFACTURERS
        async fetchManufacturers() {
            this.fetchingManufacturers = true;
            await withClientQuery(GET_ALL_MANUFACTURERS, {}, 'manufacturerAll')
                .then(payload => {
                    this.fetchingManufacturers = false;
                    this.manufacturers = payload;
                })
                .catch(err => (this.fetchingManufacturers = false));
        },
        addManufacturer(payload) {
            this.manufacturers?.unshift(payload);
        },
        updateManufacturer(payload: IManufacturer) {
            const index = this.manufacturers?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.manufacturers[index] = payload;
        },

        // INSTRUMENT TYOES
        async fetchInstrumentTypes() {
            this.fetchingInstrumentTypes = true;
            await withClientQuery(GET_ALL_INSTRUMENT_TYPES, {}, 'instrumentTypeAll')
                .then(payload => {
                    this.fetchingInstrumentTypes = false;
                    this.instrumentTypes = payload?.items;
                })
                .catch(err => (this.fetchingInstrumentTypes = false));
        },
        addInstrumentType(payload) {
            this.instrumentTypes?.unshift(payload);
        },
        updateInstrumentType(payload: IInstrumentType) {
            const index = this.instrumentTypes?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.instrumentTypes[index] = payload;
        },

        // INSTRUMENTS
        async fetchInstruments() {
            this.fetchingInstruments = false;
            await withClientQuery(GET_ALL_INSTRUMENTS, {}, 'instrumentAll')
                .then(payload => {
                    this.fetchingInstruments = false;
                    this.instruments = payload?.items;
                })
                .catch(err => (this.fetchingInstruments = false));
        },
        addInstrument(payload) {
            this.instruments?.unshift(payload);
        },
        updateInstrument(payload: IInstrument) {
            const index = this.instruments?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.instruments[index] = payload;
        },

        // METHODS
        async fetchMethods() {
            this.fetchingMethods = true;
            await withClientQuery(GET_ALL_METHODS, {}, 'methodAll')
                .then(payload => {
                    this.fetchingMethods = false;
                    this.methods = payload?.items;
                })
                .catch(err => (this.fetchingMethods = false));
        },
        addMethod(payload) {
            this.methods?.unshift(payload);
        },
        updateMethod(payload) {
            const index = this.methods?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.methods[index] = payload;
        },

        // UNITS
        async fetchUnits() {
            this.fetchingUnits = true;
            await withClientQuery(GET_ALL_UNITS, {}, 'unitAll')
                .then(payload => {
                    this.fetchingUnits = false;
                    this.units = payload;
                })
                .catch(err => (this.fetchingUnits = false));
        },
        addUnit(payload) {
            this.units?.unshift(payload);
        },
        updateUnit(payload) {
            const index = this.units?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.units[index] = payload;
        },
    },
});
