import{g as s,f as l,d,ad as p,aO as u}from"./index-6c3e61f6.js";const h=s`
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
    `,c=s`
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
    `,f=s`
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
      url
      username
      password
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
    `,b=s`
    query manifestReport($uid: String!) {
  manifestReportDownload(uid: $uid)
}
    `,I=s`
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
    `,$=s`
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
    `,A=s`
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
    `,y=s`
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
    `,R=s`
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
    `,v=s`
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
    `,{withClientQuery:r,withClientMutation:g}=l(),_=d("shipment",{state:()=>({laboratories:[],fetchingLaboratories:!1,shipments:[],fetchingShipments:!1,shipment:void 0,shipmentCount:0,shipmentPageInfo:void 0,fetchingSamples:!1,samples:[],sampleCount:0,samplePageInfo:void 0}),getters:{getReferalLaboratories:e=>e.laboratories,getShipments:e=>e.shipments,getShipment:e=>e.shipment,getShipmentByUid:e=>t=>e.shipments.find(i=>i.uid===t),getShipmentCount:e=>e.shipmentCount,getShipmentPageInfo:e=>e.shipmentPageInfo,getSamples:e=>e.samples,getSampleCount:e=>e.sampleCount,getSamplePageInfo:e=>e.samplePageInfo},actions:{async fetchReferralLaboratories(){try{this.fetchingLaboratories=!0;const e=await r(h,{},"referralLaboratoryAll");e&&Array.isArray(e)?this.laboratories=e:console.error("Invalid laboratories data received:",e)}catch(e){console.error("Error fetching referral laboratories:",e)}finally{this.fetchingLaboratories=!1}},updateReferralLaboratory(e){if(!e?.uid){console.error("Invalid laboratory payload:",e);return}const t=this.laboratories.findIndex(i=>i.uid===e.uid);t>-1&&(this.laboratories[t]=e)},addReferralLaboratory(e){if(!e?.uid){console.error("Invalid laboratory payload:",e);return}this.laboratories.unshift(e)},async fetchShipments(e){try{this.fetchingShipments=!0;const t=await r(c,e,void 0);if(t&&typeof t=="object"&&"shipmentAll"in t){const i=t.shipmentAll,a=i.items||[];e.filterAction?this.shipments=a:this.shipments=p(this.shipments,a,"uid"),this.shipmentCount=i.totalCount,this.shipmentPageInfo=i.pageInfo}else console.error("Invalid shipments data received:",t)}catch(t){console.error("Error fetching shipments:",t)}finally{this.fetchingShipments=!1}},async fetchShipmentByUid(e){if(!e){console.error("Shipment UID is required");return}try{const t=await r(f,{shipmentUid:e},"shipmentByUid");t&&typeof t=="object"?this.shipment=t:console.error("Invalid shipment data received:",t)}catch(t){console.error("Error fetching shipment by UID:",t)}},addShipment(e){if(!e?.shipments||!Array.isArray(e.shipments)){console.error("Invalid shipment payload:",e);return}e.shipments.forEach(t=>{t?.uid&&this.shipments.unshift(t)})},clearShipment(){this.shipments=[]},removeShipment(){this.shipment=void 0},async updateShipment(e){try{const t=await g(y,e,"updateShipment");t&&typeof t=="object"?this.updateShipmentMetadata(t):console.error("Invalid update shipment result:",t)}catch(t){console.error("Error updating shipment:",t)}},updateShipmentMetadata(e){if(!this.shipment){console.error("No shipment to update");return}this.shipment={...this.shipment,...e}},updateShipmentStatus(e){if(!e?.uid){console.error("Invalid shipment status update:",e);return}const t=this.shipments.findIndex(i=>i.uid===e.uid);t>-1&&(this.shipments[t].state=e.state),this.shipment?.uid===e.uid&&(this.shipment.state=e.state)},async fetchForShipmentAssign(e){try{this.fetchingSamples=!0;const t=await r(u,e,void 0);if(t&&typeof t=="object"&&"samplesForShipmentAssign"in t){const i=t.samplesForShipmentAssign,o=(i.items||[]).map(n=>(n.analysisResults=n.analysisResults?.filter(m=>m.status==="pending"),n));e.filterAction?this.samples=o:this.samples=p(this.samples,o,"extSampleUid"),this.sampleCount=i.totalCount,this.samplePageInfo=i.pageInfo}else console.error("Invalid samples data received:",t)}catch(t){console.error("Error fetching samples for shipment assign:",t)}finally{this.fetchingSamples=!1}},updateShipmentSamplesStatus(e){if(!e||!Array.isArray(e)){console.error("Invalid samples status update payload:",e);return}e.forEach(t=>{if(!t?.uid){console.error("Invalid sample result:",t);return}this.shipment?.samples?.forEach(i=>{i?.uid===t.uid&&(i.status=t.status)}),this.shipment?.shippedSamples?.forEach(i=>{i?.sampleUid===t.uid&&i.sample&&(i.sample.status=t.status)})})},updateSamples(e){if(!e||!Array.isArray(e)){console.error("Invalid samples update payload:",e);return}e.forEach(t=>{if(!t?.uid){console.error("Invalid sample result:",t);return}const i=this.samples.findIndex(a=>a.sampleUid===t.uid);i>-1&&this.samples[i].sample&&(this.samples[i].sample={...this.samples[i].sample,...t})})}}});export{v as A,$ as E,b as M,R as S,A as a,I as b,_ as u};
