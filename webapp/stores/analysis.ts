import { defineStore } from 'pinia';

import {
    GetAllAnalysesServicesDocument, GetAllAnalysesServicesQuery, GetAllAnalysesServicesQueryVariables,
    GetAllAnalysesProfilesDocument, GetAllAnalysesProfilesQuery, GetAllAnalysesProfilesQueryVariables,
    GetAllAnalysesTemplatesDocument, GetAllAnalysesTemplatesQuery, GetAllAnalysesTemplatesQueryVariables,
    GetAllAnalysesCategoriesDocument, GetAllAnalysesCategoriesQuery, GetAllAnalysesCategoriesQueryVariables,
    GetAllProfilesAndServicesDocument, GetAllProfilesAndServicesQuery, GetAllProfilesAndServicesQueryVariables,
    GetAllQcTemplatesDocument, GetAllQcTemplatesQuery, GetAllQcTemplatesQueryVariables,
    GetAllQcLevelsDocument, GetAllQcLevelsQuery, GetAllQcLevelsQueryVariables,
    GetAllRejectionReasonsDocument, GetAllRejectionReasonsQuery, GetAllRejectionReasonsQueryVariables,
    GetAllCodingStandardsDocument, GetAllCodingStandardsQuery, GetAllCodingStandardsQueryVariables,
    GetProfileMappingsByProfileUidDocument, GetProfileMappingsByProfileUidQuery, GetProfileMappingsByProfileUidQueryVariables,
    GetAnalysisMappingsByAnalysisUidDocument, GetAnalysisMappingsByAnalysisUidQuery, GetAnalysisMappingsByAnalysisUidQueryVariables,
} from '@/graphql/operations/analyses.queries';

import useApiUtil from '@/composables/api_util';
import { 
    CodingStandardType, 
    AnalysisCategoryType, 
    AnalysisType, 
    ProfileType, 
    AnalysisTemplateType, 
    QcLevelType, 
    QcTemplateType, 
    RejectionReasonType,
    AnalysisMappingType,
    ProfileMappingType,
    AnalysisCursorPage
} from '@/types/gql';

const { withClientQuery } = useApiUtil();

// Helper function to update an item in an array
function updateItem<T extends { uid: string }>(arr: T[], payload: T): void {
    const index = arr.findIndex(x => x.uid === payload.uid);
    if (index !== -1) {
        arr[index] = payload;
    }
}

// Define the state type
type AnalysisStateType = {
    codingStandards: CodingStandardType[];
    fetchingCodingStandards: boolean;
    analysesCategories: AnalysisCategoryType[];
    analysesServices: AnalysisType[];
    analysesMappings: AnalysisMappingType[];
    analysesProfiles: ProfileType[];
    analysesTemplates: AnalysisTemplateType[];
    profileMappings: ProfileMappingType[];
    qcLevels: QcLevelType[];
    qcTemplates: QcTemplateType[];
    rejectionReasons: RejectionReasonType[];
};

export const useAnalysisStore = defineStore('analysis', {
    state: (): AnalysisStateType => {
        return {
            codingStandards: [],
            fetchingCodingStandards: false,
            analysesCategories: [],
            analysesServices: [],
            analysesMappings: [],
            analysesProfiles: [],
            analysesTemplates: [],
            profileMappings: [],
            qcLevels: [],
            qcTemplates: [],
            rejectionReasons: [],
        };
    },
    getters: {
        getCodingStandards: (state): CodingStandardType[] => state.codingStandards,
        getAnalysesCategories: (state): AnalysisCategoryType[] => state.analysesCategories,
        getAnalysesServices: (state): { [key: string]: AnalysisType[] }[] => {
            const analyses = state.analysesServices;
            if (analyses?.length > 0) {
                const profiled = analyses?.reduce((r, obj) => {
                    const key = obj?.category?.name || 'No Category';
                    r[key] = r[key] || [];
                    r[key].push(obj);
                    return r;
                }, {} as Record<string, AnalysisType[]>);
                return Object.entries(profiled || {}).sort() as unknown as { [key: string]: AnalysisType[] }[];
            } else {
                return [];
            }
        },
        getAnalysesServicesSimple: (state): AnalysisType[] => state.analysesServices,
        analysesMapings: (state): AnalysisMappingType[] => state.analysesMappings,
        getAnalysesProfiles: (state): ProfileType[] => state.analysesProfiles,
        getAnalysesTemplates: (state): AnalysisTemplateType[] => state.analysesTemplates,
        profileMapings: (state): ProfileMappingType[] => state.profileMappings,
        getQCLevels: (state): QcLevelType[] => state.qcLevels,
        getQCTemplates: (state): QcTemplateType[] => state.qcTemplates,
        getRejectionReasons: (state): RejectionReasonType[] => state.rejectionReasons,
    },
    actions: {     
        async fetchCodingStandards(): Promise<void> {
            try {
                this.fetchingCodingStandards = true;
                const result = await withClientQuery<GetAllCodingStandardsQuery, GetAllCodingStandardsQueryVariables>(
                    GetAllCodingStandardsDocument, 
                    {}, 
                    'codingStandardAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.codingStandards = result as unknown as CodingStandardType[];
                } else {
                    console.error('Invalid coding standards data received:', result);
                }
            } catch (error) {
                console.error('Error fetching coding standards:', error);
            } finally {
                this.fetchingCodingStandards = false;
            }
        },
        
        updateCodingStandard(payload: CodingStandardType): void {
            if (!payload?.uid) {
                console.error('Invalid coding standard payload:', payload);
                return;
            }
            
            updateItem(this.codingStandards, payload);
        },
        
        addCodingStandard(payload: CodingStandardType): void {
            if (!payload?.uid) {
                console.error('Invalid coding standard payload:', payload);
                return;
            }
            
            this.codingStandards?.unshift(payload);
        },
        
        // Analysis categories
        async fetchAnalysesCategories(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllAnalysesCategoriesQuery, GetAllAnalysesCategoriesQueryVariables>(
                    GetAllAnalysesCategoriesDocument, 
                    {}, 
                    'analysisCategoryAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysesCategories = result as unknown as AnalysisCategoryType[];
                } else {
                    console.error('Invalid analysis categories data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis categories:', error);
            }
        },
        
        updateAnalysisCategory(payload: AnalysisCategoryType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis category payload:', payload);
                return;
            }
            
            updateItem(this.analysesCategories, payload);
        },
        
        addAnalysisCategory(payload: AnalysisCategoryType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis category payload:', payload);
                return;
            }
            
            this.analysesCategories?.unshift(payload);
        },

        // Analysis services
        async fetchAnalysesServices(params: any): Promise<void> {
            try {
                const result = await withClientQuery<GetAllAnalysesServicesQuery, GetAllAnalysesServicesQueryVariables>(
                    GetAllAnalysesServicesDocument, 
                    params, 
                    'analysisAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.analysesServices = result.items as unknown as AnalysisType[] || [];
                } else {
                    console.error('Invalid analysis services data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis services:', error);
            }
        },
        
        updateAnalysisService(payload: AnalysisType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis service payload:', payload);
                return;
            }
            
            updateItem(this.analysesServices, payload);
        },
        
        addAnalysesService(payload: AnalysisType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis service payload:', payload);
                return;
            }
            
            this.analysesServices?.unshift(payload);
        },

        async fetchAnalysesProfilesAndServices(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllProfilesAndServicesQuery, GetAllProfilesAndServicesQueryVariables>(
                    GetAllProfilesAndServicesDocument, 
                    {}, 
                    undefined
                );
                
                if (result && typeof result === 'object') {
                    if ('profileAll' in result) {
                        this.analysesProfiles = result.profileAll as ProfileType[];
                    }
                    
                    if ('analysisAll' in result) {
                        const analysisAll = result.analysisAll as AnalysisCursorPage;
                        this.analysesServices = analysisAll?.items as Array<AnalysisType>;
                    }
                } else {
                    console.error('Invalid profiles and services data received:', result);
                }
            } catch (error) {
                console.error('Error fetching profiles and services:', error);
            }
        },

        async fetchAnalysesMappings(profileUid: string): Promise<void> {
            if (!profileUid) {
                console.error('Invalid profile UID provided to fetchAnalysesMappings');
                return;
            }
            
            try {
                const result = await withClientQuery<GetAnalysisMappingsByAnalysisUidQuery, GetAnalysisMappingsByAnalysisUidQueryVariables>(
                    GetAnalysisMappingsByAnalysisUidDocument, 
                    { uid: profileUid }, 
                    'analysisMappingsByAnalysis'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysesMappings = result as unknown as AnalysisMappingType[];
                } else {
                    console.error('Invalid analysis mappings data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis mappings:', error);
            }
        },
        
        addAnalysesMapping(payload: AnalysisMappingType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis mapping payload:', payload);
                return;
            }
            
            this.analysesMappings?.unshift(payload);
        },
        
        updateAnalysesMapping(payload: AnalysisMappingType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis mapping payload:', payload);
                return;
            }
            
            updateItem(this.analysesMappings, payload);
        },

        // Analysis profiles
        async fetchAnalysesProfiles(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllAnalysesProfilesQuery, GetAllAnalysesProfilesQueryVariables>(
                    GetAllAnalysesProfilesDocument, 
                    {}, 
                    'profileAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysesProfiles = result as unknown as ProfileType[];
                } else {
                    console.error('Invalid analysis profiles data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis profiles:', error);
            }
        },
        
        updateAnalysesProfile(payload: ProfileType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis profile payload:', payload);
                return;
            }
            
            updateItem(this.analysesProfiles, payload);
        },
        
        addAnalysisProfile(payload: ProfileType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis profile payload:', payload);
                return;
            }
            
            this.analysesProfiles.unshift(payload);
        },
        
        async fetchProfileMappings(profileUid: string): Promise<void> {
            if (!profileUid) {
                console.error('Invalid profile UID provided to fetchProfileMappings');
                return;
            }
            
            try {
                const result = await withClientQuery<GetProfileMappingsByProfileUidQuery, GetProfileMappingsByProfileUidQueryVariables>(
                    GetProfileMappingsByProfileUidDocument, 
                    { uid: profileUid }, 
                    'profileMappingsByProfile'
                );
                
                if (result && Array.isArray(result)) {
                    this.profileMappings = result as unknown as ProfileMappingType[];
                } else {
                    console.error('Invalid profile mappings data received:', result);
                }
            } catch (error) {
                console.error('Error fetching profile mappings:', error);
            }
        },
        
        addProfileMapping(payload: ProfileMappingType): void {
            if (!payload?.uid) {
                console.error('Invalid profile mapping payload:', payload);
                return;
            }
            
            this.profileMappings?.unshift(payload);
        },
        
        updateProfileMapping(payload: ProfileMappingType): void {
            if (!payload?.uid) {
                console.error('Invalid profile mapping payload:', payload);
                return;
            }
            
            updateItem(this.profileMappings, payload);
        },

        // Analysis templates
        async fetchAnalysesTemplates(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllAnalysesTemplatesQuery, GetAllAnalysesTemplatesQueryVariables>(
                    GetAllAnalysesTemplatesDocument, 
                    {}, 
                    'analysisTemplateAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.analysesTemplates = result as unknown as AnalysisTemplateType[];
                } else {
                    console.error('Invalid analysis templates data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis templates:', error);
            }
        },
        
        updateAnalysesTemplate(payload: AnalysisTemplateType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis template payload:', payload);
                return;
            }
            
            updateItem(this.analysesTemplates, payload);
        },
        
        addAnalysisTemplate(payload: AnalysisTemplateType): void {
            if (!payload?.uid) {
                console.error('Invalid analysis template payload:', payload);
                return;
            }
            
            this.analysesTemplates.unshift(payload);
        },

        // QC Levels
        async fetchQCLevels(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllQcLevelsQuery, GetAllQcLevelsQueryVariables>(
                    GetAllQcLevelsDocument, 
                    {}, 
                    'qcLevelAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.qcLevels = result as unknown as QcLevelType[];
                } else {
                    console.error('Invalid QC levels data received:', result);
                }
            } catch (error) {
                console.error('Error fetching QC levels:', error);
            }
        },
        
        updateQcLevel(payload: QcLevelType): void {
            if (!payload?.uid) {
                console.error('Invalid QC level payload:', payload);
                return;
            }
            
            updateItem(this.qcLevels, payload);
        },
        
        addQcLevel(payload: QcLevelType): void {
            if (!payload?.uid) {
                console.error('Invalid QC level payload:', payload);
                return;
            }
            
            this.qcLevels.unshift(payload);
        },

        // QC Templates
        async fetchQCTemplates(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllQcTemplatesQuery, GetAllQcTemplatesQueryVariables>(
                    GetAllQcTemplatesDocument, 
                    {}, 
                    'qcTemplateAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.qcTemplates = (result as unknown as QcTemplateType[]).map(qcTemplate => {
                        qcTemplate.qcLevels = qcTemplate?.qcLevels || [];
                        qcTemplate.departments = qcTemplate?.departments || [];
                        return qcTemplate;
                    });
                } else {
                    console.error('Invalid QC templates data received:', result);
                }
            } catch (error) {
                console.error('Error fetching QC templates:', error);
            }
        },
        
        updateQcTemplate(payload: QcTemplateType): void {
            if (!payload?.uid) {
                console.error('Invalid QC template payload:', payload);
                return;
            }
            
            const index = this.qcTemplates.findIndex(x => x.uid === payload.uid);
            if (index > -1) {
                payload.qcLevels = payload?.qcLevels || [];
                payload.departments = payload?.departments || [];
                this.qcTemplates[index] = payload;
            }
        },
        
        addQcTemplate(payload: QcTemplateType): void {
            if (!payload?.uid) {
                console.error('Invalid QC template payload:', payload);
                return;
            }
            
            payload.qcLevels = payload?.qcLevels || [];
            payload.departments = payload?.departments || [];
            this.qcTemplates.unshift(payload);
        },

        // Result Options
        addResultOption(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid result option payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.resultOptions) {
                        service.resultOptions.push(payload);
                    } else {
                        service.resultOptions = [payload];
                    }
                }
            });
        },
        
        updateResultOption(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid result option payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.resultOptions?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.resultOptions) {
                        service.resultOptions[index] = payload;
                    }
                }
            });
        },

        // Interim Fields
        addAnalysisInterim(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis interim payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.interims) {
                        service.interims.push(payload);
                    } else {
                        service.interims = [payload];
                    }
                }
            });
        },
        
        updateAnalysisInterim(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis interim payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.interims?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.interims) {
                        service.interims[index] = payload;
                    }
                }
            });
        },

        // Correction Factors
        addAnalysisCorrectionFactor(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis correction factor payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.correctionFactors) {
                        service.correctionFactors.push(payload);
                    } else {
                        service.correctionFactors = [payload];
                    }
                }
            });
        },
        
        updateAnalysisCorrectionFactor(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis correction factor payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.correctionFactors?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.correctionFactors) {
                        service.correctionFactors[index] = payload;
                    }
                }
            });
        },

        // Detection Limits
        addAnalysisDetectionLimit(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis detection limit payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.detectionLimits) {
                        service.detectionLimits.push(payload);
                    } else {
                        service.detectionLimits = [payload];
                    }
                }
            });
        },
        
        updateAnalysisDetectionLimit(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis detection limit payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.detectionLimits?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.detectionLimits) {
                        service.detectionLimits[index] = payload;
                    }
                }
            });
        },

        // Uncertainties
        addAnalysisUncertainty(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis uncertainty payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.uncertainties) {
                        service.uncertainties.push(payload);
                    } else {
                        service.uncertainties = [payload];
                    }
                }
            });
        },
        
        updateAnalysisUncertainty(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis uncertainty payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.uncertainties?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.uncertainties) {
                        service.uncertainties[index] = payload;
                    }
                }
            });
        },

        // Specifications
        addAnalysisSpecification(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis specification payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    if (service?.specifications) {
                        service.specifications.push(payload);
                    } else {
                        service.specifications = [payload];
                    }
                }
            });
        },
        
        updateAnalysisSpecification(payload: any): void {
            if (!payload?.uid || !payload?.analysisUid) {
                console.error('Invalid analysis specification payload:', payload);
                return;
            }
            
            this.analysesServices?.forEach(service => {
                if (service?.uid === payload?.analysisUid) {
                    const index = service.specifications?.findIndex(ro => ro.uid === payload.uid);
                    if (index !== undefined && index > -1 && service.specifications) {
                        service.specifications[index] = payload;
                    }
                }
            });
        },

        // Rejection Reasons
        async fetchRejectionReasons(): Promise<void> {
            try {
                const result = await withClientQuery<GetAllRejectionReasonsQuery, GetAllRejectionReasonsQueryVariables>(
                    GetAllRejectionReasonsDocument, 
                    {}, 
                    'rejectionReasonsAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.rejectionReasons = result as unknown as RejectionReasonType[];
                } else {
                    console.error('Invalid rejection reasons data received:', result);
                }
            } catch (error) {
                console.error('Error fetching rejection reasons:', error);
            }
        },
        
        updateRejectionReason(payload: RejectionReasonType): void {
            if (!payload?.uid) {
                console.error('Invalid rejection reason payload:', payload);
                return;
            }
            
            updateItem(this.rejectionReasons, payload);
        },
        
        addRejectionReason(payload: RejectionReasonType): void {
            if (!payload?.uid) {
                console.error('Invalid rejection reason payload:', payload);
                return;
            }
            
            this.rejectionReasons.unshift(payload);
        },
    },
});
