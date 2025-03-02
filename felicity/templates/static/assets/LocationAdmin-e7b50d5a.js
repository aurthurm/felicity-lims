import{H as f,d as X,I as Y,r as w,n as k,p as P,m as Z,o as a,c,b as t,F as x,C as E,G as A,f as s,w as D,t as $,g as T,y as j,z as ee,A as I,e as S,v as L,i as te,j as oe,D as ne,E as ie,_ as se,k as re}from"./index-68ba4247.js";import{u as ae}from"./location-3dd13ff1.js";const ce=f`
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
    `,de=f`
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
    `,le=f`
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
    `,ue=f`
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
    `,pe=f`
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
    `,me=f`
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
    `,_=h=>(ne("data-v-cf24237d"),h=h(),ie(),h),ye={class:"mt-4"},ve={class:"grid grid-cols-12 gap-4 mt-2"},fe={class:"col-span-3"},_e={class:"w-full flex justify-between items-center pr-4"},be=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Countries",-1)),ge={class:"overflow-y-scroll overscroll-contain scroll-section"},he=["onClick"],Ce=["onClick"],we={key:0,class:"col-span-4"},ke={class:"w-full flex justify-between items-center pr-4"},xe=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Provinces",-1)),De={class:"overflow-y-scroll overscroll-contain scroll-section"},$e=["onClick"],je=["onClick"],Oe={key:1,class:"col-span-5"},Pe={class:"w-full flex justify-between items-center pr-4"},Ee=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Districts",-1)),Ae={class:"overflow-y-scroll overscroll-contain scroll-section"},Te=["onClick"],Ue=["onClick"],Ie={action:"post",class:"p-1"},Se={class:"grid grid-cols-2 gap-x-4 mb-4"},Le={class:"block col-span-1 mb-2"},Be=_(()=>t("span",{class:"text-gray-700"},"Name",-1)),Fe={class:"block col-span-1 mb-2"},Me=_(()=>t("span",{class:"text-gray-700"},"Code",-1)),Ve=_(()=>t("hr",null,null,-1)),Ne=X({__name:"LocationAdmin",setup(h){const B=oe(()=>se(()=>import("./index-68ba4247.js").then(o=>o.bs),["assets/index-68ba4247.js","assets/index-d6482eee.css"])),r=ae(),{withClientMutation:m}=Y();let l=w(!0),y=w(!1),C=w(""),u=k({}),d=k({}),p=k({}),i=k({}),U=w("");r.fetchCountries();const F=P(()=>r.getCountries);function M(){const o={name:i.name,code:i.code};m(ce,{payload:o},"createCountry").then(e=>{r.addCountry(e),Object.assign(u,e)})}function V(){const o={name:i.name,code:i.code,active:!0};m(de,{uid:i.uid,payload:o},"updateCountry").then(e=>{r.updateCountry(e),Object.assign(u,e)})}function N(){const o={name:i.name,code:i.code,countryUid:u.uid};m(le,{payload:o},"createProvince").then(e=>{r.addProvince(e),Object.assign(d,e)})}function R(){const o={name:i.name,code:i.code,active:!0,countryUid:+i.countryUid};m(ue,{uid:i.uid,payload:o},"updateProvince").then(e=>{r.updateProvince(e),Object.assign(d,e)})}function z(){const o={name:i.name,code:i.code,provinceUid:d.uid};m(pe,{payload:o},"createDistrict").then(e=>{r.addDistrict(e),Object.assign(p,e)})}function q(){const o={name:i.name,code:i.code,active:!0,provinceUid:+i.provinceUid};m(me,{uid:i.uid,payload:o},"updateDistrict").then(e=>{r.updateDistrict(e),Object.assign(p,e)})}function G(){return u.uid!==void 0}function H(){return d.uid!==void 0}const J=P(()=>r.getProvinces),K=P(()=>r.getDistricts);let O=(o,e)=>{o==="country"&&(Object.assign(u,{...e}),r.filterProvincesByCountry(e.uid)),o==="province"&&(Object.assign(d,{...e}),r.filterDistrictsByProvince(e.uid)),o==="district"&&Object.assign(p,{...e})},Q=o=>{o==="country"&&(Object.assign(u,{}),Object.assign(d,{}),Object.assign(p,{})),o==="province"&&(Object.assign(d,{}),Object.assign(p,{})),o==="district"&&Object.assign(p,{})};function v(o,e,b={}){l.value=o,C.value=e,y.value=!0,U.value=(o?"CREATE":"EDIT")+" "+e.toUpperCase(),o?(Q(e),Object.assign(i,{})):Object.assign(i,{...b})}function W(){C.value==="country"&&(l.value===!0&&M(),l.value===!1&&V()),C.value==="province"&&(l.value===!0&&N(),l.value===!1&&R()),C.value==="district"&&(l.value===!0&&z(),l.value===!1&&q()),y.value=!1}return(o,e)=>{const b=Z("font-awesome-icon");return a(),c(x,null,[t("div",ye,[t("div",ve,[t("section",fe,[t("div",_e,[be,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[0]||(e[0]=n=>v(!0,"country"))}," Add Country ")]),t("div",ge,[(a(!0),c(x,null,E(F.value,n=>(a(),c("div",{key:n.uid,class:A(s(u)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:D(g=>s(O)("country",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(n.name),1)],8,he),t("a",{onClick:g=>v(!1,"country",n),class:"px-2 cursor"},[T(b,{icon:"pen"})],8,Ce)],2))),128))])]),G()?(a(),c("section",we,[t("div",ke,[xe,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[1]||(e[1]=n=>v(!0,"province"))}," Add Province ")]),t("div",De,[(a(!0),c(x,null,E(J.value,n=>(a(),c("div",{key:n.uid,class:A(s(d)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:D(g=>s(O)("province",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(n.name),1)],8,$e),t("a",{onClick:g=>v(!1,"province",n),class:"px-2 cursor"},[T(b,{icon:"pen"})],8,je)],2))),128))])])):j("v-if",!0),H()?(a(),c("section",Oe,[t("div",Pe,[Ee,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[2]||(e[2]=n=>v(!0,"district"))}," Add District ")]),t("div",Ae,[(a(!0),c(x,null,E(K.value,n=>(a(),c("div",{key:n.uid,class:A(s(p)?.uid===n.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{onClick:D(g=>s(O)("district",n),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(n.name),1)],8,Te),t("a",{onClick:g=>v(!1,"district",n),class:"px-2 cursor"},[T(b,{icon:"pen"})],8,Ue)],2))),128))])])):j("v-if",!0)])]),j(" Location Edit Form Modal "),s(y)?(a(),ee(s(B),{key:0,onClose:e[6]||(e[6]=n=>te(y)?y.value=!1:y=!1)},{header:I(()=>[t("h3",null,$(s(U)),1)]),body:I(()=>[t("form",Ie,[t("div",Se,[t("label",Le,[Be,S(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[3]||(e[3]=n=>s(i).name=n),placeholder:"Name ..."},null,512),[[L,s(i).name]])]),t("label",Fe,[Me,S(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[4]||(e[4]=n=>s(i).code=n),placeholder:"Code ..."},null,512),[[L,s(i).code]])])]),Ve,t("button",{type:"button",onClick:e[5]||(e[5]=D(n=>W(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):j("v-if",!0)],64)}}});const qe=re(Ne,[["__scopeId","data-v-cf24237d"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{qe as default};
