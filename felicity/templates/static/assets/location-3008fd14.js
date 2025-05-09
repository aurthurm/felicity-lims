import{g as s,f as o,d as c,j as u}from"./index-6c3e61f6.js";const a=s`
    query getAllCountries {
  countryAll {
    uid
    name
    code
  }
}
    `;s`
    query getAllProvinces {
  provinceAll {
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
      code
      email
      emailCc
      businessPhone
      mobilePhone
      countryUid
    }
  }
}
    `;const d=s`
    query filterProvincesByCountry($uid: String!) {
  provincesByCountryUid(uid: $uid) {
    name
    uid
    code
    countryUid
  }
}
    `;s`
    query getAllDistricts {
  districtAll {
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
      code
      email
      emailCc
      businessPhone
      mobilePhone
      provinceUid
    }
  }
}
    `;const f=s`
    query filterDistrictsByProvince($uid: String!) {
  districtsByProvinceUid(uid: $uid) {
    name
    uid
    code
    provinceUid
  }
}
    `,{withClientQuery:r}=o(),{toastError:n}=u(),l=c("location",{state:()=>({countries:[],fetchingCountries:!1,provinces:[],fetchingProvinces:!1,districts:[],fetchingDstricts:!1,confRoute:""}),getters:{getConfRoute:i=>i.confRoute,getCountries:i=>i.countries,getProvinces:i=>i.provinces,getDistricts:i=>i.districts},actions:{updateConfRoute(i){this.confRoute=i},async fetchCountries(){try{this.fetchingCountries=!0;const i=await r(a,{},"countryAll");this.countries=i,this.provinces=[]}catch(i){i instanceof Error&&n(i.message)}finally{this.fetchingCountries=!1}},async addCountry(i){this.countries.unshift(i)},updateCountry(i){const t=this.countries?.findIndex(e=>e.uid===i.uid);t>-1&&(this.countries[t]=i)},async filterProvincesByCountry(i){if(i)try{this.fetchingProvinces=!0;const t=await r(d,{uid:i},"provincesByCountryUid","network-only");this.provinces=t,this.districts=[]}catch(t){t instanceof Error&&n(t.message)}finally{this.fetchingProvinces=!1}},addProvince(i){this.provinces.unshift(i)},updateProvince(i){const t=this.provinces?.findIndex(e=>e.uid===i.uid);t>-1&&(this.provinces[t]=i)},async filterDistrictsByProvince(i){if(i)try{this.fetchingDstricts=!0;const t=await r(f,{uid:i},"districtsByProvinceUid","network-only");this.districts=t}catch(t){t instanceof Error&&n(t.message)}finally{this.fetchingDstricts=!1}},addDistrict(i){this.districts.unshift(i),i?.province&&this.provinces.push(i.province)},updateDistrict(i){const t=this.districts?.findIndex(e=>e.uid===i.uid);t>-1&&(this.districts[t]=i)}}});export{l as u};
