import{k as t}from"./index-Cdc6vSVw.js";const e=t`
    mutation AddSupplier($payload: SupplierInputType!) {
  createSupplier(payload: $payload) {
    ... on SupplierType {
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
    `,r=t`
    mutation EditSupplier($uid: String!, $payload: SupplierInputType!) {
  updateSupplier(uid: $uid, payload: $payload) {
    ... on SupplierType {
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
    `,a=t`
    mutation AddManufacturer($payload: ManufacturerInputType!) {
  createManufacturer(payload: $payload) {
    ... on ManufacturerType {
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
    `,o=t`
    mutation EditManufacturer($uid: String!, $payload: ManufacturerInputType!) {
  updateManufacturer(uid: $uid, payload: $payload) {
    ... on ManufacturerType {
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
    `,u=t`
    mutation AddInstrumentType($payload: InstrumentTypeInputType!) {
  createInstrumentType(payload: $payload) {
    ... on InstrumentTypeType {
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
    `,i=t`
    mutation EditInstrumentType($uid: String!, $payload: InstrumentTypeInputType!) {
  updateInstrumentType(uid: $uid, payload: $payload) {
    ... on InstrumentTypeType {
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
    `,d=t`
    mutation AddInstrument($payload: InstrumentInputType!) {
  createInstrument(payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
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
    `,p=t`
    mutation EditInstrument($uid: String!, $payload: InstrumentInputType!) {
  updateInstrument(uid: $uid, payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
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
    `,s=t`
    mutation AddLaboratoryInstrument($payload: LaboratoryInstrumentInputType!) {
  createLaboratoryInstrument(payload: $payload) {
    ... on LaboratoryInstrumentType {
      uid
      labName
      serialNumber
      instrumentUid
      instrument {
        uid
        name
      }
      dateCommissioned
      dateDecommissioned
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,m=t`
    mutation EditLaboratoryInstrument($uid: String!, $payload: LaboratoryInstrumentInputType!) {
  updateLaboratoryInstrument(uid: $uid, payload: $payload) {
    ... on LaboratoryInstrumentType {
      uid
      labName
      serialNumber
      instrumentUid
      instrument {
        uid
        name
      }
      dateCommissioned
      dateDecommissioned
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,y=t`
    mutation AddInstrumentInterface($payload: InstrumentInterfaceInput!) {
  createInstrumentInterface(payload: $payload) {
    ... on InstrumentInterfaceType {
      uid
      laboratoryInstrumentUid
      laboratoryInstrument {
        uid
        labName
        instrument {
          uid
          name
        }
      }
      isActive
      host
      port
      autoReconnect
      protocolType
      socketType
      connection
      transmission
      syncUnits
      driverMapping
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,c=t`
    mutation EditInstrumentInterface($uid: String!, $payload: InstrumentInterfaceInput!) {
  updateInstrumentInterface(uid: $uid, payload: $payload) {
    ... on InstrumentInterfaceType {
      uid
      laboratoryInstrumentUid
      laboratoryInstrument {
        uid
        labName
        instrument {
          uid
          name
        }
      }
      isActive
      host
      port
      autoReconnect
      protocolType
      socketType
      connection
      transmission
      syncUnits
      driverMapping
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,l=t`
    mutation AddMethod($payload: MethodInputType!) {
  createMethod(payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,I=t`
    mutation EditMethod($uid: String!, $payload: MethodInputType!) {
  updateMethod(uid: $uid, payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,$=t`
    mutation AddUnit($payload: UnitInputType!) {
  createUnit(payload: $payload) {
    ... on UnitType {
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
    `,T=t`
    mutation EditUnit($uid: String!, $payload: UnitInputType!) {
  updateUnit(uid: $uid, payload: $payload) {
    ... on UnitType {
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
    `;export{u as A,i as E,s as a,m as b,d as c,p as d,$ as e,T as f,y as g,c as h,a as i,o as j,l as k,I as l,e as m,r as n};
