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
import { IAnalysisCategory, IAnalysisService, IAnalysisProfile, IQCLevel, IQCTemplate, IRejectionReason, ICodingStandard, IAnalysisTemplate } from '@/models/analysis';

import  useApiUtil  from '@/composables/api_util';
const { withClientQuery } = useApiUtil();

function updateItem(arr, payload) {
    const index = arr.findIndex(x => x.uid === payload.uid);
    if (index !== -1) {
        arr[index] = payload;
    }
}
// Usage:
// updateItem(this.analysesCategories, payload);

export const useAnalysisStore = defineStore('analysis', {
    state: () => {
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
        } as {
            codingStandards: ICodingStandard[];
            fetchingCodingStandards: boolean;
            analysesCategories: IAnalysisCategory[];
            analysesServices: IAnalysisService[];
            analysesMappings: any[],
            analysesProfiles: IAnalysisProfile[];
            analysesTemplates: IAnalysisTemplate[];
            profileMappings: any[],
            qcLevels: IQCLevel[];
            qcTemplates: IQCTemplate[];
            rejectionReasons: IRejectionReason[];
        };
    },
    getters: {
        getCodingStandards: state => state.codingStandards,
        getAnalysesCategories: state => state.analysesCategories,
        getAnalysesServices: state => {
            const analyses = state.analysesServices;
            if (analyses?.length > 0) {
                const profiled = analyses?.reduce((r, obj) => {
                    const key = obj?.category?.name || 'No Category';
                    r[key] = r[key] || [];
                    r[key].push(obj);
                    return r;
                }, {});
                return Object.entries(profiled || {}).sort() as unknown as { [key: string]: IAnalysisService[] }[]
            } else {
                return [];
            }
        },
        getAnalysesServicesSimple: state => state.analysesServices,
        analysesMapings: state => state.analysesMappings,
        getAnalysesProfiles: state => state.analysesProfiles,
        getAnalysesTemplates: state => state.analysesTemplates,
        profileMapings: state => state.profileMappings,
        getQCLevels: state => state.qcLevels,
        getQCTemplates: state => state.qcTemplates,
        getRejectionReasons: state => state.rejectionReasons,
    },
    actions: {     
        async fetchCodingStandards() {
            this.fetchingCodingStandards = true;
            await withClientQuery<GetAllCodingStandardsQuery, GetAllCodingStandardsQueryVariables>(GetAllCodingStandardsDocument, {}, 'codingStandardAll')
                .then(payload => {
                    this.fetchingCodingStandards = false;
                    this.codingStandards = payload;
                })
                .catch(err => (this.fetchingCodingStandards = false));
        },
        updateCodingStandard(payload) {
            const index = this.codingStandards.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.codingStandards[index] = payload;
        },
        addCodingStandard(payload) {
            this.codingStandards?.unshift(payload);
        },
        // analysis categories
        async fetchAnalysesCategories() {
            await withClientQuery<GetAllAnalysesCategoriesQuery, GetAllAnalysesCategoriesQueryVariables>(GetAllAnalysesCategoriesDocument, {}, 'analysisCategoryAll')
                .then(payload => (this.analysesCategories = payload)
            );
        },
        updateAnalysisCategory(payload) {
            const index = this.analysesCategories.findIndex(x => x.uid === payload.uid);
            this.analysesCategories[index] = payload;
        },
        addAnalysisCategory(payload) {
            this.analysesCategories?.unshift(payload);
        },

        // analysis services
        async fetchAnalysesServices(params) {
            await withClientQuery<GetAllAnalysesServicesQuery, GetAllAnalysesServicesQueryVariables>(GetAllAnalysesServicesDocument, params, 'analysisAll')
                .then(payload => (this.analysesServices = payload.items)
            );
        },
        updateAnalysisService(payload) {
            const index = this.analysesServices.findIndex(x => x.uid === payload.uid);
            this.analysesServices[index] = payload;
        },
        addAnalysesService(payload) {
            this.analysesServices?.unshift(payload);
        },

        async fetchAnalysesProfilesAndServices() {
            await withClientQuery<GetAllProfilesAndServicesQuery, GetAllProfilesAndServicesQueryVariables>(GetAllProfilesAndServicesDocument, {}, undefined).then(payload => {
                this.analysesProfiles = payload.profileAll;
                this.analysesServices = payload.analysisAll?.items;
            });
        },

        async fetchAnalysesMappings(profileUid) {
            await withClientQuery<GetAnalysisMappingsByAnalysisUidQuery, GetAnalysisMappingsByAnalysisUidQueryVariables>(GetAnalysisMappingsByAnalysisUidDocument, { uid: profileUid }, 'analysisMappingsByAnalysis').then(payload => (this.analysesMappings = payload));
        },
        addAnalysesMapping(payload) {
            this.analysesMappings?.unshift(payload);
        },
        updateAnalysesMapping(payload) {
            const index = this.analysesMappings.findIndex(x => x.uid === payload.uid);
            this.analysesMappings[index] = payload;
        },

        // analysis profiles
        async fetchAnalysesProfiles() {
            await withClientQuery<GetAllAnalysesProfilesQuery, GetAllAnalysesProfilesQueryVariables>(GetAllAnalysesProfilesDocument, {}, 'profileAll').then(payload => (this.analysesProfiles = payload));
        },
        updateAnalysesProfile(payload) {
            const index = this.analysesProfiles.findIndex(x => x.uid === payload.uid);
            this.analysesProfiles[index] = payload;
        },
        addAnalysisProfile(payload) {
            this.analysesProfiles.unshift(payload);
        },
        async fetchProfileMappings(profileUid) {
            await withClientQuery<GetProfileMappingsByProfileUidQuery, GetProfileMappingsByProfileUidQueryVariables>(GetProfileMappingsByProfileUidDocument, { uid: profileUid }, 'profileMappingsByProfile').then(payload => (this.profileMappings = payload));
        },
        addProfileMapping(payload) {
            this.profileMapings?.unshift(payload);
        },
        updateProfileMapping(payload) {
            const index = this.profileMapings.findIndex(x => x.uid === payload.uid);
            this.profileMapings[index] = payload;
        },

        // analysis profiles
        async fetchAnalysesTemplates() {
            await withClientQuery<GetAllAnalysesTemplatesQuery, GetAllAnalysesTemplatesQueryVariables>(GetAllAnalysesTemplatesDocument, {}, 'analysisTemplateAll').then(payload => (this.analysesTemplates = payload));
        },
        updateAnalysesTemplate(payload) {
            const index = this.analysesTemplates.findIndex(x => x.uid === payload.uid);
            this.analysesTemplates[index] = payload;
        },
        addAnalysisTemplate(payload) {
            this.analysesTemplates.unshift(payload);
        },

        // QC LEVELS
        async fetchQCLevels() {
            await withClientQuery<GetAllQcLevelsQuery, GetAllQcLevelsQueryVariables>(GetAllQcLevelsDocument, {}, 'qcLevelAll').then(payload => (this.qcLevels = payload));
        },
        updateQcLevel(payload) {
            const index = this.qcLevels.findIndex(x => x.uid === payload.uid);
            this.qcLevels[index] = payload;
        },
        addQcLevel(payload) {
            this.qcLevels.unshift(payload);
        },

        // analysis QC TEMPLATES
        async fetchQCTemplates() {
            await withClientQuery<GetAllQcTemplatesQuery, GetAllQcTemplatesQueryVariables>(GetAllQcTemplatesDocument, {}, 'qcTemplateAll').then(payload => {
                this.qcTemplates = payload.map((qcTemplate: IQCTemplate) => {
                    qcTemplate.qcLevels = qcTemplate?.qcLevels || [];
                    qcTemplate.departments = qcTemplate?.departments || [];
                    return qcTemplate;
                });
            });
        },
        updateQcTemplate(payload) {
            const index = this.qcTemplates.findIndex(x => x.uid === payload.uid);
            payload.qcLevels = payload?.qcLevels || [];
            payload.departments = payload?.departments || [];
            this.qcTemplates[index] = payload;
        },
        addQcTemplate(payload) {
            payload.qcLevels = payload?.qcLevels || [];
            payload.departments = payload?.departments || [];
            this.qcTemplates.unshift(payload);
        },

        // Result Options
        addResultOption(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.resultOptions) {
                        service?.resultOptions?.push(payload);
                    } else {
                        service!.resultOptions = [payload];
                    }
                }
            });
        },
        updateResultOption(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.resultOptions!.findIndex(ro => ro.uid === payload.uid);
                    service!.resultOptions![index] = payload;
                }
            });
        },

        // Interim Fields
        addAnalysisInterim(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.interims) {
                        service?.interims?.push(payload);
                    } else {
                        service!.interims = [payload];
                    }
                }
            });
        },
        updateAnalysisInterim(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.interims!.findIndex(ro => ro.uid === payload.uid);
                    service!.interims![index] = payload;
                }
            });
        },

        // Correction Factors
        AddAnalysisCorrectionFactor(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.correctionFactors) {
                        service?.correctionFactors?.push(payload);
                    } else {
                        service!.correctionFactors = [payload];
                    }
                }
            });
        },
        updateAnalysisCorrectionFactor(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.correctionFactors!.findIndex(ro => ro.uid === payload.uid);
                    service!.correctionFactors![index] = payload;
                }
            });
        },

        // Detection Limits
        addAnalysisDetectionLimit(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.detectionLimits) {
                        service?.detectionLimits?.push(payload);
                    } else {
                        service!.detectionLimits = [payload];
                    }
                }
            });
        },
        updateAnalysisDetectionLimit(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.detectionLimits!.findIndex(ro => ro.uid === payload.uid);
                    service!.detectionLimits![index] = payload;
                }
            });
        },

        // Uncertainties
        addAnalysisUncertainty(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.uncertainties) {
                        service?.uncertainties?.push(payload);
                    } else {
                        service!.uncertainties = [payload];
                    }
                }
            });
        },
        updateAnalysisUncertainty(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.uncertainties!.findIndex(ro => ro.uid === payload.uid);
                    service!.uncertainties![index] = payload;
                }
            });
        },

        // Specifications
        addAnalysisSpecification(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    if (service?.specifications) {
                        service?.specifications?.push(payload);
                    } else {
                        service!.specifications = [payload];
                    }
                }
            });
        },
        updateAnalysisSpecification(payload) {
            this.analysesServices?.forEach(service => {
                if (service?.uid == payload?.analysisUid) {
                    const index = service.specifications!.findIndex(ro => ro.uid === payload.uid);
                    service!.specifications![index] = payload;
                }
            });
        },

        // ReJECTION REASONS
        async fetchRejectionReasons() {
            await withClientQuery<GetAllRejectionReasonsQuery, GetAllRejectionReasonsQueryVariables>(GetAllRejectionReasonsDocument, {}, 'rejectionReasonsAll').then(payload => (this.rejectionReasons = payload));
        },
        updateRejectionReason(payload) {
            const index = this.rejectionReasons.findIndex(x => x.uid === payload.uid);
            this.rejectionReasons[index] = payload;
        },
        addRejectionReason(payload) {
            this.rejectionReasons.unshift(payload);
        },
    },
});
