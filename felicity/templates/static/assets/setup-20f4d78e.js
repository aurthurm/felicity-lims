import{g as s,f as i,d as o}from"./index-54016222.js";import{a,b as u,c as l}from"./_queries-7a4a5593.js";const c=s`
    query getAllSuppliers {
  supplierAll {
    uid
    name
    description
  }
}
    `,d=s`
    query getAllManufacturers {
  manufacturerAll {
    uid
    name
    description
  }
}
    `,f=s`
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
    `,m=s`
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
    `,h=s`
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
    `,p=s`
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
    `,y=s`
    query getAllUnits {
  unitAll {
    uid
    name
  }
}
    `,{withClientQuery:n}=i(),b=o("setup",{state:()=>({laboratory:void 0,laboratorySetting:void 0,departments:[],fetchingDepartments:!1,suppliers:[],fetchingSuppliers:!1,manufacturers:[],fetchingManufacturers:!1,instrumentTypes:[],fetchingInstrumentTypes:!1,instruments:[],laboratoryInstruments:[],fetchingInstruments:!1,methods:[],fetchingMethods:!1,units:[],fetchingUnits:!1}),getters:{getLaboratory:t=>t.laboratory,getLaboratorySetting:t=>t.laboratorySetting,getDepartments:t=>t.departments,getSuppliers:t=>t.suppliers,getManufacturers:t=>t.manufacturers,getInstrumentTypes:t=>t.instrumentTypes,getInstruments:t=>t.instruments,getLaboratoryInstruments:t=>t.laboratoryInstruments,getMethods:t=>t.methods,getUnits:t=>t.units},actions:{async fetchDepartments(t){try{this.fetchingDepartments=!0;const e=await n(a,t,"departmentAll");e&&Array.isArray(e)?this.departments=e:console.error("Invalid departments data received:",e)}catch(e){console.error("Error fetching departments:",e)}finally{this.fetchingDepartments=!1}},addDepartment(t){if(!t?.uid){console.error("Invalid department payload:",t);return}this.departments.unshift(t)},updateDepartment(t){if(!t?.uid){console.error("Invalid department payload:",t);return}const e=this.departments.findIndex(r=>r.uid===t.uid);e>-1&&(this.departments[e]=t)},async fetchLaboratory(){try{const t=await n(u,{},"laboratory");t&&typeof t=="object"?this.laboratory=t:console.error("Invalid laboratory data received:",t)}catch(t){console.error("Error fetching laboratory:",t)}},updateLaboratory(t){if(!t?.uid){console.error("Invalid laboratory payload:",t);return}this.laboratory=t},async fetchLaboratorySetting(){try{const t=await n(l,{},"laboratorySetting");t&&typeof t=="object"?this.laboratorySetting=t:console.error("Invalid laboratory setting data received:",t)}catch(t){console.error("Error fetching laboratory setting:",t)}},updateLaboratorySetting(t){if(!t?.uid){console.error("Invalid laboratory setting payload:",t);return}this.laboratorySetting=t},async fetchSuppliers(){try{this.fetchingSuppliers=!0;const t=await n(c,{},"supplierAll");t&&Array.isArray(t)?this.suppliers=t:console.error("Invalid suppliers data received:",t)}catch(t){console.error("Error fetching suppliers:",t)}finally{this.fetchingSuppliers=!1}},addSupplier(t){if(!t?.uid){console.error("Invalid supplier payload:",t);return}this.suppliers.unshift(t)},updateSupplier(t){if(!t?.uid){console.error("Invalid supplier payload:",t);return}const e=this.suppliers.findIndex(r=>r.uid===t.uid);e>-1&&(this.suppliers[e]=t)},async fetchManufacturers(){try{this.fetchingManufacturers=!0;const t=await n(d,{},"manufacturerAll");t&&Array.isArray(t)?this.manufacturers=t:console.error("Invalid manufacturers data received:",t)}catch(t){console.error("Error fetching manufacturers:",t)}finally{this.fetchingManufacturers=!1}},addManufacturer(t){if(!t?.uid){console.error("Invalid manufacturer payload:",t);return}this.manufacturers.unshift(t)},updateManufacturer(t){if(!t?.uid){console.error("Invalid manufacturer payload:",t);return}const e=this.manufacturers.findIndex(r=>r.uid===t.uid);e>-1&&(this.manufacturers[e]=t)},async fetchInstrumentTypes(){try{this.fetchingInstrumentTypes=!0;const t=await n(f,{},"instrumentTypeAll");t&&typeof t=="object"&&"items"in t?this.instrumentTypes=t.items||[]:console.error("Invalid instrument types data received:",t)}catch(t){console.error("Error fetching instrument types:",t)}finally{this.fetchingInstrumentTypes=!1}},addInstrumentType(t){if(!t?.uid){console.error("Invalid instrument type payload:",t);return}this.instrumentTypes.unshift(t)},updateInstrumentType(t){if(!t?.uid){console.error("Invalid instrument type payload:",t);return}const e=this.instrumentTypes.findIndex(r=>r.uid===t.uid);e>-1&&(this.instrumentTypes[e]=t)},async fetchInstruments(){try{this.fetchingInstruments=!0;const t=await n(m,{},"instrumentAll");t&&typeof t=="object"&&"items"in t?this.instruments=t.items||[]:console.error("Invalid instruments data received:",t)}catch(t){console.error("Error fetching instruments:",t)}finally{this.fetchingInstruments=!1}},addInstrument(t){if(!t?.uid){console.error("Invalid instrument payload:",t);return}this.instruments.unshift(t)},updateInstrument(t){if(!t?.uid){console.error("Invalid instrument payload:",t);return}const e=this.instruments.findIndex(r=>r.uid===t.uid);e>-1&&(this.instruments[e]=t)},async fetchLaboratoryInstruments(){try{this.fetchingInstruments=!0;const t=await n(h,{},"laboratoryInstrumentAll");t&&typeof t=="object"&&"items"in t?this.laboratoryInstruments=t.items||[]:console.error("Invalid laboratory instruments data received:",t)}catch(t){console.error("Error fetching laboratory instruments:",t)}finally{this.fetchingInstruments=!1}},addLaboratoryInstrument(t){if(!t?.uid){console.error("Invalid laboratory instrument payload:",t);return}this.laboratoryInstruments.unshift(t)},updateLaboratoryInstrument(t){if(!t?.uid){console.error("Invalid laboratory instrument payload:",t);return}const e=this.laboratoryInstruments.findIndex(r=>r.uid===t.uid);e>-1&&(this.laboratoryInstruments[e]=t)},async fetchMethods(){try{this.fetchingMethods=!0;const t=await n(p,{},"methodAll");t&&typeof t=="object"&&"items"in t?this.methods=t.items||[]:console.error("Invalid methods data received:",t)}catch(t){console.error("Error fetching methods:",t)}finally{this.fetchingMethods=!1}},addMethod(t){if(!t?.uid){console.error("Invalid method payload:",t);return}this.methods.unshift(t)},updateMethod(t){if(!t?.uid){console.error("Invalid method payload:",t);return}const e=this.methods.findIndex(r=>r.uid===t.uid);e>-1&&(this.methods[e]=t)},async fetchUnits(){try{this.fetchingUnits=!0;const t=await n(y,{},"unitAll");t&&Array.isArray(t)?this.units=t:console.error("Invalid units data received:",t)}catch(t){console.error("Error fetching units:",t)}finally{this.fetchingUnits=!1}},addUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}this.units.unshift(t)},updateUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}const e=this.units.findIndex(r=>r.uid===t.uid);e>-1&&(this.units[e]=t)}}});export{b as u};
