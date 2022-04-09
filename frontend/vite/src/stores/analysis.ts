import { defineStore } from 'pinia'

import {
  GET_ALL_ANALYSES_SERVICES, GET_ALL_ANALYSES_PROFILES, GET_ALL_ANALYSES_CATEGORIES,
  GET_ALL_ANALYSES_PROFILES_AND_SERVICES, GET_ALL_QC_TEMPLATES, GET_ALL_QC_LEVELS,
  GET_ALL_REJECTION_REASONS
} from '../graphql/analyses.queries';
import { IAnalysisCategory,  IAnalysisService, IAnalysisProfile, IQCLevel, IQCTemplate, IRejectionReason} from '../models/analysis'

import { useApiUtil} from '../composables'
const { withClientQuery } = useApiUtil()

export const useAnalysisStore = defineStore('analysis', { 
  state: () => {
    return {
      analysesCategories: [],
      analysesServices: [],
      analysesProfiles: [],
      qcLevels: [],
      qcTemplates: [],
      rejectionReasons: [],
    } as {
      analysesCategories: IAnalysisCategory[];
      analysesServices: IAnalysisService[];
      analysesProfiles: IAnalysisProfile[];
      qcLevels: IQCLevel[];
      qcTemplates: IQCTemplate[];
      rejectionReasons: IRejectionReason[];
    }
  },
  getters: {
    getAnalysesCategories: (state) => state.analysesCategories,
    getAnalysesServices: (state) => groupByCategory(state.analysesServices),
    getAnalysesServicesSimple: (state) => state.analysesServices,
    getAnalysesProfiles: (state) => state.analysesProfiles,
    getQCLevels: (state) => state.qcLevels,
    getQCTemplates: (state) => state.qcTemplates,
    getRejectionReasons: (state) => state.rejectionReasons,
  },
  actions: {
    // analysis categories
    async fetchAnalysesCategories(){
      await withClientQuery(GET_ALL_ANALYSES_CATEGORIES, {}, "analysisCategoryAll")
            .then(payload => this.analysesCategories = payload);
    },
    updateAnalysisCategory(payload){
      const index = this.analysesCategories.findIndex(x => x.uid === payload.uid);
      this.analysesCategories[index] = payload;    
    },
    addAnalysisCategory(payload){
      this.analysesCategories?.unshift(payload)
    },

    // analysis services
    async fetchAnalysesServices(params){
      await withClientQuery(GET_ALL_ANALYSES_SERVICES, params, "analysisAll")
            .then(payload => this.analysesServices = payload.items);
    },
    updateAnalysisService(payload){
      const index = this.analysesServices.findIndex(x => x.uid === payload.uid);
      this.analysesServices[index] = payload;
    },
    addAnalysesService(payload){
      this.analysesServices?.unshift(payload)    
    },
    
    async fetchAnalysesProfilesAndServices(){
      await withClientQuery(GET_ALL_ANALYSES_PROFILES_AND_SERVICES, {}, undefined)
            .then(payload => {
              this.analysesProfiles = payload.profileAll;
              this.analysesServices = payload.analysisAll;
            });
    },

    // analysis profiles
    async fetchAnalysesProfiles(){
      await withClientQuery(GET_ALL_ANALYSES_PROFILES, {}, "profileAll")
            .then(payload => this.analysesProfiles = payload);
    },
    updateAnalysesProfile(payload){
      const index = this.analysesProfiles.findIndex(x => x.uid === payload.uid);
      this.analysesProfiles[index] = payload;
    },
    addAnalysisProfile(payload){
      this.analysesProfiles?.unshift(payload)
    },

    // QC LEVELS
    async fetchQCLevels(){
      await withClientQuery(GET_ALL_QC_LEVELS, {}, "qcLevelAll")
            .then(payload => this.qcLevels = payload);
    },
    updateQcLevel(payload){
      const index = this.qcLevels.findIndex(x => x.uid === payload.uid);
      this.qcLevels[index] = payload;
    },
    addQcLevel(payload){
      this.qcLevels?.unshift(payload)
    },

    // analysis QC TEMPLATES
    async fetchQCTemplates(){
      await withClientQuery(GET_ALL_QC_TEMPLATES, {}, "qcTemplateAll")
            .then(payload => {
              this.qcTemplates = payload.map((qcTemplate: IQCTemplate) => {
                qcTemplate.qcLevels = qcTemplate?.qcLevels || [];
                qcTemplate.departments = qcTemplate?.departments || [];
                return qcTemplate
              })
            });
    },
    updateQcTemplate(payload){
      const index = this.qcTemplates.findIndex(x => x.uid === payload.uid);
      payload.qcLevels = payload?.qcLevels || [];
      payload.departments = payload?.departments || [];
      this.qcTemplates[index] = payload;    
    },
    addQcTemplate(payload){
      payload.qcLevels = payload?.qcLevels || [];
      payload.departments = payload?.departments || [];
      this.qcTemplates?.unshift(payload);    
    },

    // Result Options
    addResultOption(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.resultOptions){
            service?.resultOptions?.push(payload);
          } else {
            service!.resultOptions = [payload];
          }
        }
      });    
    },
    updateResultOption(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.resultOptions!.findIndex(ro => ro.uid === payload.uid);
          service!.resultOptions![index] = payload;
        }
      });    
    },

    // Interim Fields
    addAnalysisInterim(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.interims){
            service?.interims?.push(payload);
          } else {
            service!.interims = [payload];
          }
        }
      });    
    },
    updateAnalysisInterim(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.interims!.findIndex(ro => ro.uid === payload.uid);
          service!.interims![index] = payload;
        }
      });    },

    // Correction Factors
    AddAnalysisCorrectionFactor(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.correctionFactors){
            service?.correctionFactors?.push(payload);
          } else {
            service!.correctionFactors = [payload];
          }
        }
      });    
    },
    updateAnalysisCorrectionFactor(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.correctionFactors!.findIndex(ro => ro.uid === payload.uid);
          service!.correctionFactors![index] = payload;
        }
      });    },

    // Detection Limits
    addAnalysisDetectionLimit(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.detectionLimits){
            service?.detectionLimits?.push(payload);
          } else {
            service!.detectionLimits = [payload];
          }
        }
      });    
    },
    updateAnalysisDetectionLimit(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.detectionLimits!.findIndex(ro => ro.uid === payload.uid);
          service!.detectionLimits![index] = payload;
        }
      });    },

    // Uncertainties
    addAnalysisUncertainty(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.uncertainties){
            service?.uncertainties?.push(payload);
          } else {
            service!.uncertainties = [payload];
          }
        }
      });    
    },
    updateAnalysisUncertainty(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.uncertainties!.findIndex(ro => ro.uid === payload.uid);
          service!.uncertainties![index] = payload;
        }
      });    },

    // Specifications
    addAnalysisSpecification(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          if(service?.specifications){
            service?.specifications?.push(payload);
          } else {
            service!.specifications = [payload];
          }
        }
      });    
    },
    updateAnalysisSpecification(payload){
      this.analysesServices?.forEach(service => {
        if (service?.uid == payload?.analysisUid){
          const index = service.specifications!.findIndex(ro => ro.uid === payload.uid);
          service!.specifications![index] = payload;
        }
      });    },

    // ReJECTION REASONS
    async fetchRejectionReasons(){
      await withClientQuery(GET_ALL_REJECTION_REASONS, {}, "rejectionReasonsAll")
            .then(payload => this.rejectionReasons = payload);
    },
    updateRejectionReason(payload){
      const index = this.rejectionReasons.findIndex(x => x.uid === payload.uid);
      this.rejectionReasons[index] = payload;    
    },
    addRejectionReason(payload){
      this.rejectionReasons?.unshift(payload);    
    },
  }
})

function groupByCategory(analyses: IAnalysisService[]): any {
  if(analyses?.length > 0){
    const profiled = analyses?.reduce((r: any, obj) => {
    const key = obj?.category?.name || 'No Category';
    r[key] = r[key] || [];
    r[key].push(obj);
    return r;
  }, {});
  return Object.entries(profiled || {}).sort();
  } else {
    return []
  }
}