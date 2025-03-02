import{H as i,I as a,Q as u}from"./index-68ba4247.js";import{G as h,a as o,b as m}from"./_queries-6796a35a.js";const l=i`
    query getAllSuppliers {
  supplierAll {
    uid
    name
    description
  }
}
    `,c=i`
    query getAllManufacturers {
  manufacturerAll {
    uid
    name
    description
  }
}
    `;i`
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
    `;const r=i`
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
    `,d=i`
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
    `,f=i`
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
    `,p=i`
    query getAllUnits {
  unitAll {
    uid
    name
  }
}
    `,{withClientQuery:n}=a(),I=u("setup",{state:()=>({laboratory:void 0,laboratorySetting:void 0,departments:[],fetchingDepartments:!1,suppliers:[],fetchingSuppliers:!1,manufacturers:[],fetchingManufacturers:!1,instrumentTypes:[],fetchingInstrumentTypes:!1,instruments:[],laboratoryInstruments:[],fetchingInstruments:!1,methods:[],fetchingMethods:!1,units:[],fetchingUnits:!1}),getters:{getLaboratory:t=>t.laboratory,getLaboratorySetting:t=>t.laboratorySetting,getDepartments:t=>t.departments,getSuppliers:t=>t.suppliers,getManufacturers:t=>t.manufacturers,getInstrumentTypes:t=>t.instrumentTypes,getInstruments:t=>t.instruments,getLaboratoryInstruments:t=>t.laboratoryInstruments,getMethods:t=>t.methods,getUnits:t=>t.units},actions:{async fetchDepartments(t){this.fetchingDepartments=!0,await n(h,t,"departmentAll").then(e=>{this.fetchingDepartments=!1,this.departments=e}).catch(e=>this.fetchingDepartments=!1)},addDepartment(t){this.departments?.unshift(t)},updateDepartment(t){const e=this.departments?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.departments[e]=t)},async fetchLaboratory(){await n(o,{},"laboratory").then(t=>this.laboratory=t)},updateLaboratory(t){this.laboratory=t},async fetchLaboratorySetting(){await n(m,{},"laboratorySetting").then(t=>this.laboratorySetting=t)},updateLaboratorySetting(t){this.laboratorySetting=t},async fetchSuppliers(){this.fetchingSuppliers=!0,await n(l,{},"supplierAll").then(t=>{this.fetchingSuppliers=!1,this.suppliers=t}).catch(t=>this.fetchingSuppliers=!1)},addSupplier(t){this.suppliers?.unshift(t)},updateSupplier(t){const e=this.suppliers?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.suppliers[e]=t)},async fetchManufacturers(){this.fetchingManufacturers=!0,await n(c,{},"manufacturerAll").then(t=>{this.fetchingManufacturers=!1,this.manufacturers=t}).catch(t=>this.fetchingManufacturers=!1)},addManufacturer(t){this.manufacturers?.unshift(t)},updateManufacturer(t){const e=this.manufacturers?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.manufacturers[e]=t)},async fetchInstrumentTypes(){this.fetchingInstrumentTypes=!0,await n(r,{},"instrumentTypeAll").then(t=>{this.fetchingInstrumentTypes=!1,this.instrumentTypes=t?.items}).catch(t=>this.fetchingInstrumentTypes=!1)},addInstrumentType(t){this.instrumentTypes?.unshift(t)},updateInstrumentType(t){const e=this.instrumentTypes?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.instrumentTypes[e]=t)},async fetchInstruments(){this.fetchingInstruments=!1,await n(r,{},"instrumentAll").then(t=>{this.fetchingInstruments=!1,this.instruments=t?.items}).catch(t=>this.fetchingInstruments=!1)},addInstrument(t){this.instruments?.unshift(t)},updateInstrument(t){const e=this.instruments?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.instruments[e]=t)},async fetchLaboratoryInstruments(){this.fetchingInstruments=!1,await n(d,{},"laboratoryInstrumentAll").then(t=>{this.fetchingInstruments=!1,this.laboratoryInstruments=t?.items}).catch(t=>this.fetchingInstruments=!1)},addLaboratoryInstrument(t){this.laboratoryInstruments?.unshift(t)},updateLaboratoryInstrument(t){const e=this.laboratoryInstruments?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.laboratoryInstruments[e]=t)},async fetchMethods(){this.fetchingMethods=!0,await n(f,{},"methodAll").then(t=>{this.fetchingMethods=!1,this.methods=t?.items}).catch(t=>this.fetchingMethods=!1)},addMethod(t){this.methods?.unshift(t)},updateMethod(t){const e=this.methods?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.methods[e]=t)},async fetchUnits(){this.fetchingUnits=!0,await n(p,{},"unitAll").then(t=>{this.fetchingUnits=!1,this.units=t}).catch(t=>this.fetchingUnits=!1)},addUnit(t){this.units?.unshift(t)},updateUnit(t){const e=this.units?.findIndex(s=>s.uid===t?.uid);e>-1&&(this.units[e]=t)}}});export{I as u};
