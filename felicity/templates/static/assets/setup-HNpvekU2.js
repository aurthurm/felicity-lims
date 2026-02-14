import{k as i,d as u,f as a,al as o,am as c,an as f,ao as l}from"./index-DApeomWQ.js";const m=i`
    query getAllSuppliers {
  supplierAll {
    uid
    name
    description
  }
}
    `,h=i`
    query getAllManufacturers {
  manufacturerAll {
    uid
    name
    description
  }
}
    `,d=i`
    query getAllInstrumentTypes {
  instrumentTypeAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
    }
  }
}
    `,g=i`
    query getAllInstruments {
  instrumentAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      keyword
      supplierUid
      supplier {
        uid
        name
      }
      manufacturerUid
      manufacturer {
        uid
        name
      }
      instrumentTypeUid
      instrumentType {
        uid
        name
      }
    }
  }
}
    `,p=i`
    query getAllLaboratoryInstruments {
  laboratoryInstrumentAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
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
  }
}
    `,A=i`
    query getInstrumentInterfaces {
  instrumentInterfaces {
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
}
    `,y=i`
    query getAllMethods {
  methodAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      keyword
      instruments {
        uid
        name
        description
      }
    }
  }
}
    `,I=i`
    query getAllUnits {
  unitAll {
    uid
    name
  }
}
    `;i`
    query parseMessage($rawMessage: String!) {
  parseMessage(rawMessage: $rawMessage) {
    success
    parsedMessage
    error
  }
}
    `;const{withClientQuery:n}=a(),M=u("setup",{state:()=>({organization:void 0,laboratories:[],laboratory:void 0,laboratorySetting:void 0,departments:[],fetchingDepartments:!1,suppliers:[],fetchingSuppliers:!1,manufacturers:[],fetchingManufacturers:!1,instrumentTypes:[],fetchingInstrumentTypes:!1,instruments:[],laboratoryInstruments:[],fetchingInstruments:!1,methods:[],fetchingMethods:!1,units:[],fetchingUnits:!1}),getters:{getOrganization:t=>t.organization,getLaboratories:t=>t.laboratories,getLaboratory:t=>t.laboratory,getLaboratorySetting:t=>t.laboratorySetting,getDepartments:t=>t.departments,getSuppliers:t=>t.suppliers,getManufacturers:t=>t.manufacturers,getInstrumentTypes:t=>t.instrumentTypes,getInstruments:t=>t.instruments,getLaboratoryInstruments:t=>t.laboratoryInstruments,getMethods:t=>t.methods,getUnits:t=>t.units},actions:{async fetchDepartments(t){try{this.fetchingDepartments=!0;const e=await n(l,t,"departmentAll");e&&Array.isArray(e)&&(this.departments=e)}catch{}finally{this.fetchingDepartments=!1}},addDepartment(t){t?.uid&&this.departments.unshift(t)},updateDepartment(t){if(!t?.uid)return;const e=this.departments.findIndex(s=>s.uid===t.uid);e>-1&&(this.departments[e]=t)},async fetchOrganization(){try{const t=await n(f,{},"organization");t&&typeof t=="object"&&(this.organization=t)}catch{}},updateOrganization(t){t?.uid&&(this.organization=t)},async fetchLaboratories(){try{const t=await n(c,{},"laboratoryAll");t?.items&&t&&Array.isArray(t?.items)&&(this.laboratories=t?.items)}catch{}},async fetchLaboratory(){try{const t=await n(o,{},"laboratory");t&&typeof t=="object"&&(this.laboratory=t)}catch{}},addLaboratory(t){t?.uid&&this.laboratories.unshift(t)},updateLaboratory(t,e=!1){if(t?.uid)if(e){const s=this.laboratories.findIndex(r=>r.uid===t.uid);s>-1&&(this.laboratories[s]={...this.laboratories[s],...t})}else this.laboratory=t},updateOrganizationSetting(t){t?.uid&&(this.organization={...this.organization,settings:t})},updateLaboratorySetting(t){t?.uid&&(this.laboratory={...this.laboratory,settings:t})},async fetchSuppliers(){try{this.fetchingSuppliers=!0;const t=await n(m,{},"supplierAll");t&&Array.isArray(t)&&(this.suppliers=t)}catch{}finally{this.fetchingSuppliers=!1}},addSupplier(t){t?.uid&&this.suppliers.unshift(t)},updateSupplier(t){if(!t?.uid)return;const e=this.suppliers.findIndex(s=>s.uid===t.uid);e>-1&&(this.suppliers[e]=t)},async fetchManufacturers(){try{this.fetchingManufacturers=!0;const t=await n(h,{},"manufacturerAll");t&&Array.isArray(t)&&(this.manufacturers=t)}catch{}finally{this.fetchingManufacturers=!1}},addManufacturer(t){t?.uid&&this.manufacturers.unshift(t)},updateManufacturer(t){if(!t?.uid)return;const e=this.manufacturers.findIndex(s=>s.uid===t.uid);e>-1&&(this.manufacturers[e]=t)},async fetchInstrumentTypes(){try{this.fetchingInstrumentTypes=!0;const t=await n(d,{},"instrumentTypeAll");t&&typeof t=="object"&&"items"in t&&(this.instrumentTypes=t.items||[])}catch{}finally{this.fetchingInstrumentTypes=!1}},addInstrumentType(t){t?.uid&&this.instrumentTypes.unshift(t)},updateInstrumentType(t){if(!t?.uid)return;const e=this.instrumentTypes.findIndex(s=>s.uid===t.uid);e>-1&&(this.instrumentTypes[e]=t)},async fetchInstruments(){try{this.fetchingInstruments=!0;const t=await n(g,{},"instrumentAll");t&&typeof t=="object"&&"items"in t&&(this.instruments=t.items||[])}catch{}finally{this.fetchingInstruments=!1}},addInstrument(t){t?.uid&&this.instruments.unshift(t)},updateInstrument(t){if(!t?.uid)return;const e=this.instruments.findIndex(s=>s.uid===t.uid);e>-1&&(this.instruments[e]=t)},async fetchLaboratoryInstruments(){try{this.fetchingInstruments=!0;const t=await n(p,{},"laboratoryInstrumentAll");t&&typeof t=="object"&&"items"in t&&(this.laboratoryInstruments=t.items||[])}catch{}finally{this.fetchingInstruments=!1}},addLaboratoryInstrument(t){t?.uid&&this.laboratoryInstruments.unshift(t)},updateLaboratoryInstrument(t){if(!t?.uid)return;const e=this.laboratoryInstruments.findIndex(s=>s.uid===t.uid);e>-1&&(this.laboratoryInstruments[e]=t)},async fetchMethods(){try{this.fetchingMethods=!0;const t=await n(y,{},"methodAll");t&&typeof t=="object"&&"items"in t&&(this.methods=t.items||[])}catch{}finally{this.fetchingMethods=!1}},addMethod(t){t?.uid&&this.methods.unshift(t)},updateMethod(t){if(!t?.uid)return;const e=this.methods.findIndex(s=>s.uid===t.uid);e>-1&&(this.methods[e]=t)},async fetchUnits(){try{this.fetchingUnits=!0;const t=await n(I,{},"unitAll");t&&Array.isArray(t)&&(this.units=t)}catch{}finally{this.fetchingUnits=!1}},addUnit(t){t?.uid&&this.units.unshift(t)},updateUnit(t){if(!t?.uid)return;const e=this.units.findIndex(s=>s.uid===t.uid);e>-1&&(this.units[e]=t)}}});export{A as G,M as u};
