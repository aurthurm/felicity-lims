import { defineStore } from 'pinia';

import  useApiUtil  from '@/composables/api_util';
import { GetAllDepartmentsDocument, GetAllDepartmentsQuery, GetAllDepartmentsQueryVariables, GetAllLaboratoriesDocument, GetAllLaboratoriesQuery, GetAllLaboratoriesQueryVariables, GetLaboratoryDocument, GetLaboratoryQuery, GetLaboratoryQueryVariables, GetOrganizationQueryVariables, GetOrganizationQuery, GetOrganizationDocument } from '@/graphql/operations/_queries';
import { GetAllInstrumentsDocument, GetAllInstrumentsQuery, GetAllInstrumentTypesDocument, GetAllInstrumentTypesQuery, GetAllInstrumentTypesQueryVariables, GetAllLaboratoryInstrumentsDocument, GetAllLaboratoryInstrumentsQuery, GetAllLaboratoryInstrumentsQueryVariables, GetAllManufacturersDocument, GetAllManufacturersQuery, GetAllManufacturersQueryVariables, GetAllMethodsDocument, GetAllMethodsQuery, GetAllMethodsQueryVariables, GetAllSuppliersDocument, GetAllSuppliersQuery, GetAllUnitsDocument, GetAllUnitsQuery, GetAllUnitsQueryVariables } from '@/graphql/operations/instrument.queries';
import { GetAllSampleTypesQueryVariables } from '@/graphql/operations/analyses.queries';
import { DepartmentType, InstrumentType, LaboratoryInstrumentType, LaboratorySettingType, ManufacturerType, MethodType, SupplierType, UnitType, LaboratoryType, InstrumentTypeType, LaboratoryCursorPage, OrganizationType, OrganizationSettingType } from '@/types/gql';

const { withClientQuery } = useApiUtil();

type SetupStateType = {
    organization?: OrganizationType;
    laboratory?: LaboratoryType;
    laboratories: LaboratoryType[];
    laboratorySetting?: LaboratorySettingType;
    departments: DepartmentType[];
    fetchingDepartments: boolean;
    suppliers: SupplierType[];
    fetchingSuppliers: boolean;
    manufacturers: ManufacturerType[];
    fetchingManufacturers: boolean;
    instrumentTypes: InstrumentTypeType[];
    fetchingInstrumentTypes: boolean;
    instruments: InstrumentType[];
    laboratoryInstruments: LaboratoryInstrumentType[];
    fetchingInstruments: boolean;
    methods: MethodType[];
    fetchingMethods: boolean;
    units: UnitType[];
    fetchingUnits: boolean;
};

export const useSetupStore = defineStore('setup', {
    state: (): SetupStateType => ({
        organization: undefined,
        // Initialize state with empty arrays and undefined values
        laboratories: [],
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
        laboratoryInstruments: [],
        fetchingInstruments: false,
        methods: [],
        fetchingMethods: false,
        units: [],
        fetchingUnits: false,
    }),
    getters: {
        getOrganization: (state): OrganizationType | undefined => state.organization,
        getLaboratories: (state): LaboratoryType[] => state.laboratories,
        getLaboratory: (state): LaboratoryType | undefined => state.laboratory,
        getLaboratorySetting: (state): LaboratorySettingType | undefined => state.laboratorySetting,
        getDepartments: (state): DepartmentType[] => state.departments,
        getSuppliers: (state): SupplierType[] => state.suppliers,
        getManufacturers: (state): ManufacturerType[] => state.manufacturers,
        getInstrumentTypes: (state): InstrumentTypeType[] => state.instrumentTypes,
        getInstruments: (state): InstrumentType[] => state.instruments,
        getLaboratoryInstruments: (state): LaboratoryInstrumentType[] => state.laboratoryInstruments,
        getMethods: (state): MethodType[] => state.methods,
        getUnits: (state): UnitType[] => state.units,
    },
    actions: {
        // DEPARMENT
        async fetchDepartments(params: GetAllDepartmentsQueryVariables): Promise<void> {
            try {
                this.fetchingDepartments = true;
                const result = await withClientQuery<GetAllDepartmentsQuery, GetAllDepartmentsQueryVariables>(
                    GetAllDepartmentsDocument, 
                    params, 
                    'departmentAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.departments = result;
                } else {
                    console.error('Invalid departments data received:', result);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                this.fetchingDepartments = false;
            }
        },
        addDepartment(payload: DepartmentType): void {
            if (!payload?.uid) {
                console.error('Invalid department payload:', payload);
                return;
            }
            this.departments.unshift(payload);
        },
        updateDepartment(payload: DepartmentType): void {
            if (!payload?.uid) {
                console.error('Invalid department payload:', payload);
                return;
            }
            const index = this.departments.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.departments[index] = payload;
            }
        },

        // ORGANISATION && LABORATORY
        async fetchOrganization(): Promise<void> {
            try {
                const result = await withClientQuery<GetOrganizationQuery, GetOrganizationQueryVariables>(
                    GetOrganizationDocument, 
                    {}, 
                    'organization'
                );
                
                if (result && typeof result === 'object') {
                    this.organization = result as OrganizationType;
                } else {
                    console.error('Invalid laboratory data received:', result);
                }
            } catch (error) {
                console.error('Error fetching laboratory:', error);
            }
        },
        updateOrganization(payload: OrganizationType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory payload:', payload);
                return;
            }
            this.organization = payload;
        },
        async fetchLaboratories(): Promise<void> {
            try {
                const result: LaboratoryCursorPage = await withClientQuery<GetAllLaboratoriesQuery, GetAllLaboratoriesQueryVariables>(
                    GetAllLaboratoriesDocument, 
                    {}, 
                    'laboratoryAll'
                ) as LaboratoryCursorPage;
                
                if (result?.items && result && Array.isArray(result?.items)) {
                    this.laboratories = result?.items as LaboratoryType[];
                } else {
                    console.error('Invalid laboratories data received:', result);
                }
            } catch (error) {
                console.error('Error fetching laboratories:', error);
            }
        },
        async fetchLaboratory(): Promise<void> {
            try {
                const result = await withClientQuery<GetLaboratoryQuery, GetLaboratoryQueryVariables>(
                    GetLaboratoryDocument, 
                    {}, 
                    'laboratory'
                );
                
                if (result && typeof result === 'object') {
                    this.laboratory = result as LaboratoryType;
                } else {
                    console.error('Invalid laboratory data received:', result);
                }
            } catch (error) {
                console.error('Error fetching laboratory:', error);
            }
        },
        addLaboratory(payload: LaboratoryType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory payload:', payload);
                return;
            }
            this.laboratories.unshift(payload);
        },
        updateLaboratory(payload: LaboratoryType, listing=false): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory payload:', payload);
                return;
            }
            if(listing) {
                const index = this.laboratories.findIndex(item => item.uid === payload.uid);
                if (index > -1) {
                    this.laboratories[index] = {...this.laboratories[index], ...payload} as LaboratoryType;
                }
            } else {
                this.laboratory = payload;

            }
        },

        // ORGANIZATION SETTING
        updateOrganizationSetting(payload: OrganizationSettingType): void {
            if (!payload?.uid) {
                console.error('Invalid organization setting payload:', payload);
                return;
            }
            this.organization = { ...this.organization, settings: payload } as OrganizationType;
        },

        // LABORATORY SETTING
        updateLaboratorySetting(payload: LaboratorySettingType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory setting payload:', payload);
                return;
            }
            this.laboratory = { ...this.laboratory, settings: payload } as LaboratoryType;
        },

        // SUPPLIERS
        async fetchSuppliers(): Promise<void> {
            try {
                this.fetchingSuppliers = true;
                const result = await withClientQuery<GetAllSuppliersQuery, GetAllSampleTypesQueryVariables>(
                    GetAllSuppliersDocument, 
                    {}, 
                    'supplierAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.suppliers = result;
                } else {
                    console.error('Invalid suppliers data received:', result);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                this.fetchingSuppliers = false;
            }
        },
        addSupplier(payload: SupplierType): void {
            if (!payload?.uid) {
                console.error('Invalid supplier payload:', payload);
                return;
            }
            this.suppliers.unshift(payload);
        },
        updateSupplier(payload: SupplierType): void {
            if (!payload?.uid) {
                console.error('Invalid supplier payload:', payload);
                return;
            }
            const index = this.suppliers.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.suppliers[index] = payload;
            }
        },

        // MAUFACTURERS
        async fetchManufacturers(): Promise<void> {
            try {
                this.fetchingManufacturers = true;
                const result = await withClientQuery<GetAllManufacturersQuery, GetAllManufacturersQueryVariables>(
                    GetAllManufacturersDocument, 
                    {}, 
                    'manufacturerAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.manufacturers = result;
                } else {
                    console.error('Invalid manufacturers data received:', result);
                }
            } catch (error) {
                console.error('Error fetching manufacturers:', error);
            } finally {
                this.fetchingManufacturers = false;
            }
        },
        addManufacturer(payload: ManufacturerType): void {
            if (!payload?.uid) {
                console.error('Invalid manufacturer payload:', payload);
                return;
            }
            this.manufacturers.unshift(payload);
        },
        updateManufacturer(payload: ManufacturerType): void {
            if (!payload?.uid) {
                console.error('Invalid manufacturer payload:', payload);
                return;
            }
            const index = this.manufacturers.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.manufacturers[index] = payload;
            }
        },

        // INSTRUMENT TYOES
        async fetchInstrumentTypes(): Promise<void> {
            try {
                this.fetchingInstrumentTypes = true;
                const result = await withClientQuery<GetAllInstrumentTypesQuery, GetAllInstrumentTypesQueryVariables>(
                    GetAllInstrumentTypesDocument, 
                    {}, 
                    'instrumentTypeAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.instrumentTypes = result.items || [];
                } else {
                    console.error('Invalid instrument types data received:', result);
                }
            } catch (error) {
                console.error('Error fetching instrument types:', error);
            } finally {
                this.fetchingInstrumentTypes = false;
            }
        },
        addInstrumentType(payload: InstrumentTypeType): void {
            if (!payload?.uid) {
                console.error('Invalid instrument type payload:', payload);
                return;
            }
            this.instrumentTypes.unshift(payload);
        },
        updateInstrumentType(payload: InstrumentTypeType): void {
            if (!payload?.uid) {
                console.error('Invalid instrument type payload:', payload);
                return;
            }
            const index = this.instrumentTypes.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.instrumentTypes[index] = payload;
            }
        },

        // INSTRUMENTS
        async fetchInstruments(): Promise<void> {
            try {
                this.fetchingInstruments = true;
                const result = await withClientQuery<GetAllInstrumentsQuery, GetAllDepartmentsQueryVariables>(
                    GetAllInstrumentsDocument, 
                    {}, 
                    'instrumentAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.instruments = result.items || [];
                } else {
                    console.error('Invalid instruments data received:', result);
                }
            } catch (error) {
                console.error('Error fetching instruments:', error);
            } finally {
                this.fetchingInstruments = false;
            }
        },
        addInstrument(payload: InstrumentType): void {
            if (!payload?.uid) {
                console.error('Invalid instrument payload:', payload);
                return;
            }
            this.instruments.unshift(payload);
        },
        updateInstrument(payload: InstrumentType): void {
            if (!payload?.uid) {
                console.error('Invalid instrument payload:', payload);
                return;
            }
            const index = this.instruments.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.instruments[index] = payload;
            }
        },

        // laboratory INSTRUMENTS
        async fetchLaboratoryInstruments(): Promise<void> {
            try {
                this.fetchingInstruments = true;
                const result = await withClientQuery<GetAllLaboratoryInstrumentsQuery, GetAllLaboratoryInstrumentsQueryVariables>(
                    GetAllLaboratoryInstrumentsDocument, 
                    {}, 
                    'laboratoryInstrumentAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.laboratoryInstruments = result.items || [];
                } else {
                    console.error('Invalid laboratory instruments data received:', result);
                }
            } catch (error) {
                console.error('Error fetching laboratory instruments:', error);
            } finally {
                this.fetchingInstruments = false;
            }
        },
        addLaboratoryInstrument(payload: LaboratoryInstrumentType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory instrument payload:', payload);
                return;
            }
            this.laboratoryInstruments.unshift(payload);
        },
        updateLaboratoryInstrument(payload: LaboratoryInstrumentType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory instrument payload:', payload);
                return;
            }
            const index = this.laboratoryInstruments.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.laboratoryInstruments[index] = payload;
            }
        },

        // METHODS
        async fetchMethods(): Promise<void> {
            try {
                this.fetchingMethods = true;
                const result = await withClientQuery<GetAllMethodsQuery, GetAllMethodsQueryVariables>(
                    GetAllMethodsDocument, 
                    {}, 
                    'methodAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.methods = result.items || [];
                } else {
                    console.error('Invalid methods data received:', result);
                }
            } catch (error) {
                console.error('Error fetching methods:', error);
            } finally {
                this.fetchingMethods = false;
            }
        },
        addMethod(payload: MethodType): void {
            if (!payload?.uid) {
                console.error('Invalid method payload:', payload);
                return;
            }
            this.methods.unshift(payload);
        },
        updateMethod(payload: MethodType): void {
            if (!payload?.uid) {
                console.error('Invalid method payload:', payload);
                return;
            }
            const index = this.methods.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.methods[index] = payload;
            }
        },

        // UNITS
        async fetchUnits(): Promise<void> {
            try {
                this.fetchingUnits = true;
                const result = await withClientQuery<GetAllUnitsQuery, GetAllUnitsQueryVariables>(
                    GetAllUnitsDocument, 
                    {}, 
                    'unitAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.units = result;
                } else {
                    console.error('Invalid units data received:', result);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            } finally {
                this.fetchingUnits = false;
            }
        },
        addUnit(payload: UnitType): void {
            if (!payload?.uid) {
                console.error('Invalid unit payload:', payload);
                return;
            }
            this.units.unshift(payload);
        },
        updateUnit(payload: UnitType): void {
            if (!payload?.uid) {
                console.error('Invalid unit payload:', payload);
                return;
            }
            const index = this.units.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.units[index] = payload;
            }
        },
    },
});
