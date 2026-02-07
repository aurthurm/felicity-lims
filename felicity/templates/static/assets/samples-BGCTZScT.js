import{g as i,P as k,u as L,av as D,a7 as F,aw as Y,e as O,ax as j,ay as P,az as x}from"./index-OdhKCqIc.js";import{c as W,d as q,e as z,f as B,P as M,g as N,h as Q,i as V,I as G}from"./analyses.mutations-DUxQZn1r.js";i`
    mutation AddStoreRoom($payload: StoreRoomInputType!) {
  createStoreRoom(payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation EditStoreRoom($uid: String!, $payload: StoreRoomInputType!) {
  updateStoreRoom(uid: $uid, payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation AddStorageLocation($payload: StorageLocationInputType!) {
  createStorageLocation(payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation EditStorageLocation($uid: String!, $payload: StorageLocationInputType!) {
  updateStorageLocation(uid: $uid, payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation AddStorageSection($payload: StorageSectionInputType!) {
  createStorageSection(payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation EditStorageSection($uid: String!, $payload: StorageSectionInputType!) {
  updateStorageSection(uid: $uid, payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation AddStorageContainer($payload: StorageContainerInputType!) {
  createStorageContainer(payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;i`
    mutation EditStorageContainer($uid: String!, $payload: StorageContainerInputType!) {
  updateStorageContainer(uid: $uid, payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const H=i`
    mutation StoreSamples($payload: [StoreSamplesInputType!]!) {
  storeSamples(payload: $payload) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        sampleId
        priority
        status
        storageSlot
        storageContainerUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,J=i`
    mutation RecoverSamples($sampleUids: [String!]!) {
  recoverSamples(sampleUids: $sampleUids) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        status
        storageSlot
        storageContainerUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;function Z(){const p=k(),{withClientMutation:n,withClientQuery:d}=L(),{toastSuccess:t,toastError:o,swalConfirm:r}=O(),S=D({samples:F(()=>p.getSamples)}),c=async a=>p.updateSamplesStatus(a),u=async a=>p.updateSampleStatus(a),y=async a=>p.updateSamples(a),g=async a=>p.addSampleClones(a),m=async a=>{a&&p.fetchAnalysisResultsForSample(a)},f=async a=>{try{if((await r("You want to cancel these samples","Are you sure?")).isConfirmed){const e=await n(W,{samples:a},"cancelSamples");e?.samples?.length>0&&(c(e.samples),u(e.samples[0]),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been cancelled successfully"))}}catch(s){o(`Failed to cancel samples: ${s instanceof Error?s.message:"Unknown error"}`)}},w=async a=>{try{if((await r("You want to clone these samples","Are you sure?")).isConfirmed){const e=await n(q,{samples:a},"cloneSamples");e?.samples?.length>0&&(g(e.samples),t("Samples have been cloned successfully"))}}catch(s){o(`Failed to clone samples: ${s instanceof Error?s.message:"Unknown error"}`)}},h=async a=>{try{if((await r("You want to reinstate samples","Are you sure?")).isConfirmed){const e=await n(z,{samples:a},"reInstateSamples");e?.samples?.length>0&&(c(e.samples),u(e.samples[0]),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been reinstated successfully"))}}catch(s){o(`Failed to reinstate samples: ${s instanceof Error?s.message:"Unknown error"}`)}},_=async a=>{try{if((await r("You want to receive samples","Are you sure?")).isConfirmed){const e=await n(B,{samples:a},"receiveSamples");e?.samples?.length>0&&(c(e.samples),u(e.samples[0]),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been received successfully"))}}catch(s){o(`Failed to receive samples: ${s instanceof Error?s.message:"Unknown error"}`)}},$=async a=>{try{if((await r("You want to recover these samples from storage","Are you sure?")).isConfirmed){const e=await n(J,{sampleUids:a},"recoverSamples");e?.samples?.length>0&&(y(e.samples),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been recovered successfully"))}}catch(s){o(`Failed to recover samples: ${s instanceof Error?s.message:"Unknown error"}`)}},v=async a=>{try{if((await r("You want to publish samples","Are you sure?")).isConfirmed){const e=await n(M,{samples:a},"publishSamples");e?.samples?.length>0&&p.updateSamples(e.samples??[]),e?.message&&t(e.message)}}catch(s){o(`Failed to publish samples: ${s instanceof Error?s.message:"Unknown error"}`)}},U=async a=>{try{if((await r("You want to download PDFs","Are you sure?")).isConfirmed){const e=await d(j,{sampleIds:a},"impressReportsDownload");if(e){const l=document.createElement("a");l.href=`data:application/pdf;base64,${e}`,l.setAttribute("download","impress-report.pdf"),l.click(),t("Reports downloaded successfully")}}}catch(s){o(`Failed to download reports: ${s instanceof Error?s.message:"Unknown error"}`)}},C=async a=>{try{if((await r("You want to download this report","Are you sure?")).isConfirmed){const e=await d(P,{impressUid:a},"impressReportDownload");if(e){const l=document.createElement("a");l.href=`data:application/pdf;base64,${e}`,l.setAttribute("download","impress-report.pdf"),l.click(),t("Report downloaded successfully")}}}catch(s){o(`Failed to download report: ${s instanceof Error?s.message:"Unknown error"}`)}},E=async a=>{try{return await d(x,{sampleUids:a},"barcodeSamples")||[]}catch(s){return o(`Failed to generate barcodes: ${s instanceof Error?s.message:"Unknown error"}`),[]}},R=async a=>{try{if((await r("You want to print these samples","Are you sure?")).isConfirmed){const e=await n(N,{samples:a},"printSamples");e?.message&&t(e.message)}}catch(s){o(`Failed to print samples: ${s instanceof Error?s.message:"Unknown error"}`)}},A=async a=>{try{if((await r("You want to verify these samples","Are you sure?")).isConfirmed){const e=await n(Q,{samples:a},"verifySamples");e?.samples?.length>0&&(c(e.samples),u(e.samples[0]),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been verified successfully"))}}catch(s){o(`Failed to verify samples: ${s instanceof Error?s.message:"Unknown error"}`)}},b=async a=>{try{if((await r("You want to reject these samples","Are you sure?")).isConfirmed){const e=await n(V,{samples:a},"rejectSamples");e?.message&&t(e.message)}}catch(s){o(`Failed to reject samples: ${s instanceof Error?s.message:"Unknown error"}`)}},T=async a=>{try{if((await r("You want to invalidate these samples","Are you sure?")).isConfirmed){const e=await n(G,{samples:a},"invalidateSamples");if(e?.samples?.length>0)return c(e.samples),u(e.samples[0]),e.samples.length===1&&m(e.samples[0].uid),t("Samples have been invalidated successfully"),e.samples}return[]}catch(s){return o(`Failed to invalidate samples: ${s instanceof Error?s.message:"Unknown error"}`),[]}},I=async a=>{try{if((await r("You want to store these samples","Are you sure?")).isConfirmed){const e=await n(H,{payload:a},"storeSamples");if(e?.samples?.length>0)return y(e.samples),t("Samples have been stored successfully"),e.samples}return[]}catch(s){return o(`Failed to store samples: ${s instanceof Error?s.message:"Unknown error"}`),[]}};return{...Y(S),cancelSamples:f,cloneSamples:w,reInstateSamples:h,receiveSamples:_,recoverSamples:$,publishSamples:v,downloadSamplesImpress:U,downloadImpress:C,barcodeSamples:E,printSamples:R,verifySamples:A,rejectSamples:b,invalidateSamples:T,storeSamples:I}}export{Z as u};
