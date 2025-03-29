import{g as f,P as Z,e as G,Z as C,f as w,h as $,r as H,o as a,c,b as t,F as h,D as j,a1 as P,a2 as s,z as k,E as x,a as O,J as E,x as Q,K as T,A as U,V as L,a7 as W,X as ee,Y as te,_ as oe}from"./index-66877f9a.js";import{u as ne}from"./location-2a6916e7.js";const ie=f`
    mutation AddCountry($payload: CountryInputType!) {
  createCountry(payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,se=f`
    mutation EditCountry($uid: String!, $payload: CountryInputType!) {
  updateCountry(uid: $uid, payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,re=f`
    mutation AddProvince($payload: ProvinceInputType!) {
  createProvince(payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,ae=f`
    mutation EditProvince($uid: String!, $payload: ProvinceInputType!) {
  updateProvince(uid: $uid, payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,ce=f`
    mutation AddDistrict($payload: DistrictInputType!) {
  createDistrict(payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,de=f`
    mutation EditDistrict($uid: String!, $payload: DistrictInputType!) {
  updateDistrict(uid: $uid, payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,le={class:"mt-4"},ue={class:"grid grid-cols-12 gap-4 mt-2"},pe={class:"col-span-3"},me={class:"w-full flex justify-between items-center pr-4"},ye={class:"overflow-y-scroll overscroll-contain scroll-section"},ve=["onClick"],fe=["onClick"],be={key:0,class:"col-span-4"},_e={class:"w-full flex justify-between items-center pr-4"},ge={class:"overflow-y-scroll overscroll-contain scroll-section"},Ce=["onClick"],we=["onClick"],he={key:1,class:"col-span-5"},ke={class:"w-full flex justify-between items-center pr-4"},xe={class:"overflow-y-scroll overscroll-contain scroll-section"},De=["onClick"],$e=["onClick"],je={action:"post",class:"p-1"},Pe={class:"grid grid-cols-2 gap-x-4 mb-4"},Oe={class:"block col-span-1 mb-2"},Ee={class:"block col-span-1 mb-2"},Ae=Z({__name:"LocationAdmin",setup(Te){const S=ee(()=>te(()=>import("./index-66877f9a.js").then(o=>o.cN),["assets/index-66877f9a.js","assets/index-78b87750.css"])),r=ne(),{withClientMutation:m}=G();let l=C(!0),y=C(!1),g=C(""),u=w({}),d=w({}),p=w({}),i=w({}),A=C("");r.fetchCountries();const I=$(()=>r.getCountries);function V(){const o={name:i.name,code:i.code};m(ie,{payload:o},"createCountry").then(e=>{r.addCountry(e),Object.assign(u,e)})}function B(){const o={name:i.name,code:i.code,active:!0};m(se,{uid:i.uid,payload:o},"updateCountry").then(e=>{r.updateCountry(e),Object.assign(u,e)})}function N(){const o={name:i.name,code:i.code,countryUid:u.uid};m(re,{payload:o},"createProvince").then(e=>{r.addProvince(e),Object.assign(d,e)})}function F(){const o={name:i.name,code:i.code,active:!0,countryUid:+i.countryUid};m(ae,{uid:i.uid,payload:o},"updateProvince").then(e=>{r.updateProvince(e),Object.assign(d,e)})}function M(){const o={name:i.name,code:i.code,provinceUid:d.uid};m(ce,{payload:o},"createDistrict").then(e=>{r.addDistrict(e),Object.assign(p,e)})}function R(){const o={name:i.name,code:i.code,active:!0,provinceUid:+i.provinceUid};m(de,{uid:i.uid,payload:o},"updateDistrict").then(e=>{r.updateDistrict(e),Object.assign(p,e)})}function z(){return u.uid!==void 0}function q(){return d.uid!==void 0}const J=$(()=>r.getProvinces),K=$(()=>r.getDistricts);let D=(o,e)=>{o==="country"&&(Object.assign(u,{...e}),r.filterProvincesByCountry(e.uid)),o==="province"&&(Object.assign(d,{...e}),r.filterDistrictsByProvince(e.uid)),o==="district"&&Object.assign(p,{...e})},X=o=>{o==="country"&&(Object.assign(u,{}),Object.assign(d,{}),Object.assign(p,{})),o==="province"&&(Object.assign(d,{}),Object.assign(p,{})),o==="district"&&Object.assign(p,{})};function v(o,e,b={}){l.value=o,g.value=e,y.value=!0,A.value=(o?"CREATE":"EDIT")+" "+e.toUpperCase(),o?(X(e),Object.assign(i,{})):Object.assign(i,{...b})}function Y(){g.value==="country"&&(l.value===!0&&V(),l.value===!1&&B()),g.value==="province"&&(l.value===!0&&N(),l.value===!1&&F()),g.value==="district"&&(l.value===!0&&M(),l.value===!1&&R()),y.value=!1}return(o,e)=>{const b=H("font-awesome-icon");return a(),c(h,null,[t("div",le,[t("div",ue,[t("section",pe,[t("div",me,[e[7]||(e[7]=t("h2",{class:"text-l font-semibold inline uppercase"},"Countries",-1)),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[0]||(e[0]=n=>v(!0,"country"))}," Add Country ")]),t("div",ye,[(a(!0),c(h,null,j(I.value,n=>(a(),c("div",{key:n.uid,class:P(s(u)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:k(_=>s(D)("country",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,x(n.name),1)],8,ve),t("a",{onClick:_=>v(!1,"country",n),class:"px-2 cursor"},[O(b,{icon:"pen"})],8,fe)],2))),128))])]),z()?(a(),c("section",be,[t("div",_e,[e[8]||(e[8]=t("h2",{class:"text-l font-semibold inline uppercase"},"Provinces",-1)),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[1]||(e[1]=n=>v(!0,"province"))}," Add Province ")]),t("div",ge,[(a(!0),c(h,null,j(J.value,n=>(a(),c("div",{key:n.uid,class:P(s(d)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:k(_=>s(D)("province",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,x(n.name),1)],8,Ce),t("a",{onClick:_=>v(!1,"province",n),class:"px-2 cursor"},[O(b,{icon:"pen"})],8,we)],2))),128))])])):E("",!0),q()?(a(),c("section",he,[t("div",ke,[e[9]||(e[9]=t("h2",{class:"text-l font-semibold inline uppercase"},"Districts",-1)),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[2]||(e[2]=n=>v(!0,"district"))}," Add District ")]),t("div",xe,[(a(!0),c(h,null,j(K.value,n=>(a(),c("div",{key:n.uid,class:P(s(p)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:k(_=>s(D)("district",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,x(n.name),1)],8,De),t("a",{onClick:_=>v(!1,"district",n),class:"px-2 cursor"},[O(b,{icon:"pen"})],8,$e)],2))),128))])])):E("",!0)])]),s(y)?(a(),Q(s(S),{key:0,onClose:e[6]||(e[6]=n=>W(y)?y.value=!1:y=!1)},{header:T(()=>[t("h3",null,x(s(A)),1)]),body:T(()=>[t("form",je,[t("div",Pe,[t("label",Oe,[e[10]||(e[10]=t("span",{class:"text-gray-700"},"Name",-1)),U(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[3]||(e[3]=n=>s(i).name=n),placeholder:"Name ..."},null,512),[[L,s(i).name]])]),t("label",Ee,[e[11]||(e[11]=t("span",{class:"text-gray-700"},"Code",-1)),U(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[4]||(e[4]=n=>s(i).code=n),placeholder:"Code ..."},null,512),[[L,s(i).code]])])]),e[12]||(e[12]=t("hr",null,null,-1)),t("button",{type:"button",onClick:e[5]||(e[5]=k(n=>Y(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):E("",!0)],64)}}});const Se=oe(Ae,[["__scopeId","data-v-cf24237d"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Se as default};
