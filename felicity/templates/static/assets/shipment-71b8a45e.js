import{H as i,I as p,Q as m,a6 as h,aJ as d}from"./index-d5ae4e74.js";const u=i`
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
    `,l=i`
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
    `,c=i`
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
    `,S=i`
    query manifestReport($uid: String!) {
  manifestReportDownload(uid: $uid)
}
    `,b=i`
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
    `,$=i`
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
    `,I=i`
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
    `,f=i`
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
    `,R=i`
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
    `,A=i`
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
    `,{withClientQuery:n,withClientMutation:g}=p(),L=m("shipment",{state:()=>({laboratories:[],fetchingLaboratories:!1,shipments:[],fetchingShipments:!1,shipment:void 0,shipmentCount:0,shipmentPageInfo:void 0,fetchingSamples:!1,samples:[],sampleCount:0,samplePageInfo:void 0}),getters:{getReferalLaboratories:e=>e.laboratories,getShipments:e=>e.shipments,getShipment:e=>e.shipment,getShipmentByUid:e=>t=>e.shipments?.find(a=>a.uid===t),getShipmentCount:e=>e.shipmentCount,getShipmentPageInfo:e=>e.shipmentPageInfo,getSamples:e=>e.samples,getSampleCount:e=>e.sampleCount,getSamplePageInfo:e=>e.samplePageInfo},actions:{async fetchReferralLaboratories(){this.fetchingLaboratories=!0,await n(u,{},"referralLaboratoryAll").then(e=>{this.fetchingLaboratories=!1,this.laboratories=e}).catch(e=>this.fetchingLaboratories=!1)},updateReferralLaboratory(e){const t=this.laboratories.findIndex(a=>a.uid===e?.uid);t>-1&&(this.laboratories[t]=e)},addReferralLaboratory(e){this.laboratories?.unshift(e)},async fetcShipments(e){this.fetchingShipments=!0,await n(l,e,void 0).then(t=>{this.fetchingShipments=!1;const a=t.shipmentAll,s=a.items;e.filterAction?(this.shipments=[],this.shipments=s):this.shipments=h(this.shipments,s,"uid"),this.shipmentCount=a?.totalCount,this.shipmentPageInfo=a?.pageInfo}).catch(t=>this.fetchingShipments=!1)},async fetchShipmentByUid(e){await n(c,{shipmentUid:e},"shipmentByUid").then(t=>this.shipment=t)},addShipment(e){e.shipments?.forEach(t=>this.shipments?.unshift(t))},clearShipment(){this.shipments=[]},removeShipment(){this.shipment=void 0},async updateShipment(e){await g(f,e,"updateShipment").then(t=>{this.updateShipmentMetadata(t)})},async updateShipmentMetadata(e){this.shipment={...this.shipment,...e}},updateShipmentStatus(e){const t=this.shipments.findIndex(a=>a.uid===e.uid);t>-1&&(this.shipments[t].state=e.state),this.shipment?.uid===e.uid&&(this.shipment.state=e.state)},async fetchFoShipmentAssign(e){this.fetchingSamples=!0,await n(d,e,void 0).then(t=>{this.fetchingSamples=!1;const a=t.samplesForShipmentAssign,s=a.items.map(o=>(o.analysisResults=o.analysisResults?.filter(r=>r.status==="pending"),o));e.filterAction?(this.samples=[],this.samples=s):this.samples=s,this.sampleCount=a?.totalCount,this.samplePageInfo=a?.pageInfo}).catch(t=>this.fetchingSamples=!1)},updateShipmentSamplesStatus(e){e?.forEach(t=>{this.shipment?.samples?.forEach((a,s)=>{a?.uid==t.uid&&(a.status=t.status)}),this.shipment?.shippedSamples?.forEach((a,s)=>{a?.sampleUid==t.uid&&(a.sample.status=t.status)})})},updateSamples(e){e?.forEach(t=>{const a=this.samples.findIndex(s=>s.sampleUid===t.uid);a>-1&&(this.samples[a].sample={...this.samples[a].sample,...t})})}}});export{I as A,$ as E,S as M,R as S,A as a,b,L as u};
