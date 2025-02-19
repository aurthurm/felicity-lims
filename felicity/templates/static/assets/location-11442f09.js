import{H as s,I as r,Q as c}from"./index-06e172a4.js";const o=s`
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
    `;const u=s`
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
    `;const d=s`
    query filterDistrictsByProvince($uid: String!) {
  districtsByProvinceUid(uid: $uid) {
    name
    uid
    code
    provinceUid
  }
}
    `,{withClientQuery:n}=r(),a=c("location",{state:()=>({countries:[],fetchingCountries:!1,provinces:[],fetchingProvinces:!1,districts:[],fetchingDstricts:!1,confRoute:""}),getters:{getConfRoute:i=>i.confRoute,getCountries:i=>i.countries,getProvinces:i=>i.provinces,getDistricts:i=>i.districts},actions:{updateConfRoute(i){this.confRoute=i},async fetchCountries(){this.fetchingCountries=!0,await n(o,{},"countryAll").then(i=>{this.fetchingCountries=!1,this.countries=i,this.provinces=[]}).catch(i=>this.fetchingCountries=!1)},async addCountry(i){this.countries.unshift(i)},updateCountry(i){const t=this.countries?.findIndex(e=>e.uid===i.uid);t>-1&&(this.countries[t]=i)},async filterProvincesByCountry(i){i&&(this.fetchingProvinces=!0,await n(u,{uid:i},"provincesByCountryUid","network-only").then(t=>{this.fetchingProvinces=!1,this.provinces=t,this.districts=[]}).catch(t=>this.fetchingProvinces=!1))},addProvince(i){this.provinces.unshift(i)},updateProvince(i){const t=this.provinces?.findIndex(e=>e.uid===i.uid);t>-1&&(this.provinces[t]=i)},async filterDistrictsByProvince(i){i&&(this.fetchingDstricts=!0,await n(d,{uid:i},"districtsByProvinceUid","network-only").then(t=>{this.fetchingDstricts=!1,this.districts=t}).catch(t=>this.fetchingDstricts=!1))},addDistrict(i){this.districts.unshift(i),i?.province&&this.provinces.push(i?.province)},updateDistrict(i){const t=this.districts?.findIndex(e=>e.uid===i.uid);t>-1&&(this.districts[t]=i)}}});export{a as u};
