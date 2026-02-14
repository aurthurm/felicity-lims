import{k as a,d as u,f as h,b0 as d,ak as p}from"./index-DApeomWQ.js";const l=a`
    query getAllReferralLaboratories {
  referralLaboratoryAll {
    uid
    name
    code
    url
    password
    username
    isReferral
    isReference
  }
}
    `,f=a`
    query getAllShipments($first: Int!, $after: String, $before: String, $incoming: Boolean!, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
  shipmentAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    incoming: $incoming
    status: $status
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      shipmentId
      assignedCount
      incoming
      state
      laboratoryUid
      courier
      laboratory {
        name
      }
      createdAt
    }
  }
}
    `,c=a`
    query getShipmentByUid($shipmentUid: String!) {
  shipmentByUid(shipmentUid: $shipmentUid) {
    uid
    shipmentId
    assignedCount
    state
    incoming
    comment
    createdAt
    courier
    jsonContent
    laboratory {
      name
    }
    shippedSamples {
      resultNotified
      extSampleId
      sample {
        uid
        sampleId
        status
        analysisRequest {
          clientRequestId
          patient {
            uid
          }
        }
        analyses {
          uid
          name
          keyword
        }
      }
    }
  }
}
    `,b=a`
    query manifestReport($uid: String!) {
  manifestReportDownload(uid: $uid)
}
    `,$=a`
    mutation AddReferralLaboratory($payload: ReferralLaboratoryInputType!) {
  createReferralLaboratory(payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,A=a`
    mutation EditReferralLaboratory($uid: String!, $payload: ReferralLaboratoryInputType!) {
  updateReferralLaboratory(uid: $uid, payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,R=a`
    mutation AddShipment($payload: ShipmentInputType!) {
  createShipment(payload: $payload) {
    ... on ShipmentListingType {
      __typename
      shipments {
        uid
        shipmentId
        assignedCount
        state
        laboratoryUid
        laboratory {
          name
        }
        createdAt
        laboratoryUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,y=a`
    mutation UpdateShipment($uid: String!, $payload: ShipmentUpdateInputType!) {
  updateShipment(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,I=a`
    mutation shipmentManageSamples($uid: String!, $payload: ShipmentManageSamplesInput!) {
  shipmentManageSamples(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
        uid
        name
      }
      samples {
        uid
        sampleId
        status
        analysisRequest {
          patient {
            uid
          }
        }
        analyses {
          uid
          name
          keyword
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,_=a`
    mutation actionShipment($uid: String!, $action: String!) {
  actionShipment(uid: $uid, action: $action) {
    ... on ShipmentType {
      __typename
      uid
      state
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,{withClientQuery:n,withClientMutation:g}=h(),C=u("shipment",{state:()=>({laboratories:[],fetchingLaboratories:!1,shipments:[],fetchingShipments:!1,shipment:void 0,shipmentCount:0,shipmentPageInfo:void 0,fetchingSamples:!1,samples:[],sampleCount:0,samplePageInfo:void 0}),getters:{getReferalLaboratories:e=>e.laboratories,getShipments:e=>e.shipments,getShipment:e=>e.shipment,getShipmentByUid:e=>t=>e.shipments.find(i=>i.uid===t),getShipmentCount:e=>e.shipmentCount,getShipmentPageInfo:e=>e.shipmentPageInfo,getSamples:e=>e.samples,getSampleCount:e=>e.sampleCount,getSamplePageInfo:e=>e.samplePageInfo},actions:{async fetchReferralLaboratories(){try{this.fetchingLaboratories=!0;const e=await n(l,{},"referralLaboratoryAll");e&&Array.isArray(e)&&(this.laboratories=e)}catch{}finally{this.fetchingLaboratories=!1}},updateReferralLaboratory(e){if(!e?.uid)return;const t=this.laboratories.findIndex(i=>i.uid===e.uid);t>-1&&(this.laboratories[t]=e)},addReferralLaboratory(e){e?.uid&&this.laboratories.unshift(e)},async fetchShipments(e){try{this.fetchingShipments=!0;const t=await n(f,e,void 0);if(t&&typeof t=="object"&&"shipmentAll"in t){const i=t.shipmentAll,s=i.items||[];e.filterAction?this.shipments=s:this.shipments=p(this.shipments,s,"uid"),this.shipmentCount=i.totalCount,this.shipmentPageInfo=i.pageInfo}}catch{}finally{this.fetchingShipments=!1}},async fetchShipmentByUid(e){if(e)try{const t=await n(c,{shipmentUid:e},"shipmentByUid");t&&typeof t=="object"&&(this.shipment=t)}catch{}},addShipment(e){!e?.shipments||!Array.isArray(e.shipments)||e.shipments.forEach(t=>{t?.uid&&this.shipments.unshift(t)})},clearShipment(){this.shipments=[]},removeShipment(){this.shipment=void 0},async updateShipment(e){try{const t=await g(y,e,"updateShipment");t&&typeof t=="object"&&this.updateShipmentMetadata(t)}catch{}},updateShipmentMetadata(e){this.shipment&&(this.shipment={...this.shipment,...e})},updateShipmentStatus(e){if(!e?.uid)return;const t=this.shipments.findIndex(i=>i.uid===e.uid);t>-1&&(this.shipments[t].state=e.state),this.shipment?.uid===e.uid&&(this.shipment.state=e.state)},async fetchForShipmentAssign(e){try{this.fetchingSamples=!0;const t=await n(d,e,void 0);if(t&&typeof t=="object"&&"samplesForShipmentAssign"in t){const i=t.samplesForShipmentAssign,o=(i.items||[]).map(r=>(r.analysisResults=r.analysisResults?.filter(m=>m.status==="pending"),r));e.filterAction?this.samples=o:this.samples=p(this.samples,o,"extSampleUid"),this.sampleCount=i.totalCount,this.samplePageInfo=i.pageInfo}}catch{}finally{this.fetchingSamples=!1}},updateShipmentSamplesStatus(e){!e||!Array.isArray(e)||e.forEach(t=>{t?.uid&&(this.shipment?.samples?.forEach(i=>{i?.uid===t.uid&&(i.status=t.status)}),this.shipment?.shippedSamples?.forEach(i=>{i?.sampleUid===t.uid&&i.sample&&(i.sample.status=t.status)}))})},updateSamples(e){!e||!Array.isArray(e)||e.forEach(t=>{if(!t?.uid)return;const i=this.samples.findIndex(s=>s.sampleUid===t.uid);i>-1&&this.samples[i].sample&&(this.samples[i].sample={...this.samples[i].sample,...t})})}}});export{_ as A,A as E,b as M,I as S,R as a,$ as b,C as u};
