import{ab as f,d as W,a2 as X,r as C,A as k,aa as P,B as Z,o as r,g as c,h as t,G as T,F as w,z as j,H as I,j as s,w as x,t as D,l as U,y as $,D as ee,E as S,i as N,v as F,k as te,I as oe,a3 as ne,a4 as ie,ak as se,_ as ae}from"./index-00041ead.js";const re=f`
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
`,ce=f`
  mutation editCountry($uid: FelicityID!, $payload: CountryInputType!) {
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
`,de=f`
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
`,le=f`
  mutation editProvince($uid: FelicityID!, $payload: ProvinceInputType!) {
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
`,ue=f`
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
`,pe=f`
  mutation editDistrict($uid: FelicityID!, $payload: DistrictInputType!) {
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
`,E=g=>(ne("data-v-54de798d"),g=g(),ie(),g),ye={class:"mt-4"},me={class:"grid grid-cols-12 gap-4 mt-2"},ve={class:"col-span-3"},fe={class:"overflow-y-scroll overscroll-contain scroll-section pr-8"},_e=["onClick"],be=["onClick"],ge={key:0,class:"col-span-4"},he={class:"overflow-y-scroll overscroll-contain scroll-section pr-8"},Ce=["onClick"],ke=["onClick"],we={key:1,class:"col-span-5"},xe={class:"overflow-y-scroll overscroll-contain scroll-section pr-8"},De=["onClick"],$e=["onClick"],Oe={action:"post",class:"p-1"},Pe={class:"grid grid-cols-2 gap-x-4 mb-4"},Te={class:"block col-span-1 mb-2"},je=E(()=>t("span",{class:"text-gray-700"},"Name",-1)),Ie={class:"block col-span-1 mb-2"},Ue=E(()=>t("span",{class:"text-gray-700"},"Code",-1)),Ee=E(()=>t("hr",null,null,-1)),Ae=W({__name:"index",setup(g){const a=X(),{withClientMutation:y}=se();let l=C(!0),m=C(!1),h=C(""),u=k({}),d=k({}),p=k({}),i=k({}),A=C("");a.fetchCountries();const R=P(()=>a.getCountries);function V(){const n={name:i.name,code:i.code};y(re,{payload:n},"createCountry").then(e=>{a.addCountry(e),Object.assign(u,e)})}function B(){const n={name:i.name,code:i.code,active:!0};y(ce,{uid:i.uid,payload:n},"updateCountry").then(e=>{a.updateCountry(e),Object.assign(u,e)})}function L(){const n={name:i.name,code:i.code,countryUid:u.uid};y(de,{payload:n},"createProvince").then(e=>{a.addProvince(e),Object.assign(d,e)})}function M(){const n={name:i.name,code:i.code,active:!0,countryUid:+i.countryUid};y(le,{uid:i.uid,payload:n},"updateProvince").then(e=>{a.updateProvince(e),Object.assign(d,e)})}function z(){const n={name:i.name,code:i.code,provinceUid:d.uid};y(ue,{payload:n},"createDistrict").then(e=>{a.addDistrict(e),Object.assign(p,e)})}function Y(){const n={name:i.name,code:i.code,active:!0,provinceUid:+i.provinceUid};y(pe,{uid:i.uid,payload:n},"updateDistrict").then(e=>{a.updateDistrict(e),Object.assign(p,e)})}function q(){return u.uid!==void 0}function G(){return d.uid!==void 0}const H=P(()=>a.getProvinces),J=P(()=>a.getDistricts);let O=(n,e)=>{n==="country"&&(Object.assign(u,{...e}),a.filterProvincesByCountry(e.uid)),n==="province"&&(Object.assign(d,{...e}),a.filterDistrictsByProvince(e.uid)),n==="district"&&Object.assign(p,{...e})},K=n=>{n==="country"&&(Object.assign(u,{}),Object.assign(d,{}),Object.assign(p,{})),n==="province"&&(Object.assign(d,{}),Object.assign(p,{})),n==="district"&&Object.assign(p,{})};function v(n,e,_={}){l.value=n,h.value=e,m.value=!0,A.value=(n?"CREATE":"EDIT")+" "+e.toUpperCase(),n?(K(e),Object.assign(i,{})):Object.assign(i,{..._})}function Q(){h.value==="country"&&(l.value===!0&&V(),l.value===!1&&B()),h.value==="province"&&(l.value===!0&&L(),l.value===!1&&M()),h.value==="district"&&(l.value===!0&&z(),l.value===!1&&Y()),m.value=!1}return(n,e)=>{const _=Z("font-awesome-icon");return r(),c(w,null,[t("div",ye,[t("div",me,[t("section",ve,[T(" Countries "),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[0]||(e[0]=o=>v(!0,"country"))}," Add Country "),t("div",fe,[(r(!0),c(w,null,j(s(R),o=>(r(),c("div",{key:o.uid,class:I(s(u)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:x(b=>s(O)("country",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,D(o.name),1)],8,_e),t("a",{href:"#",onClick:b=>v(!1,"country",o),class:"px-2 cursor"},[U(_,{icon:"pen"})],8,be)],2))),128))])]),q()?(r(),c("section",ge,[T(" Provinces "),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[1]||(e[1]=o=>v(!0,"province"))}," Add Province "),t("div",he,[(r(!0),c(w,null,j(s(H),o=>(r(),c("div",{key:o.uid,class:I(s(d)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:x(b=>s(O)("province",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,D(o.name),1)],8,Ce),t("a",{href:"#",onClick:b=>v(!1,"province",o),class:"px-2 cursor"},[U(_,{icon:"pen"})],8,ke)],2))),128))])])):$("v-if",!0),G()?(r(),c("section",we,[T(" Districts "),t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[2]||(e[2]=o=>v(!0,"district"))}," Add District "),t("div",xe,[(r(!0),c(w,null,j(s(J),o=>(r(),c("div",{key:o.uid,class:I(s(p)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:x(b=>s(O)("district",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,D(o.name),1)],8,De),t("a",{href:"#",onClick:b=>v(!1,"district",o),class:"px-2 cursor"},[U(_,{icon:"pen"})],8,$e)],2))),128))])])):$("v-if",!0)])]),$(" Location Edit Form Modal "),s(m)?(r(),ee(oe,{key:0,onClose:e[6]||(e[6]=o=>te(m)?m.value=!1:m=!1)},{header:S(()=>[t("h3",null,D(s(A)),1)]),body:S(()=>[t("form",Oe,[t("div",Pe,[t("label",Te,[je,N(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[3]||(e[3]=o=>s(i).name=o),placeholder:"Name ..."},null,512),[[F,s(i).name]])]),t("label",Ie,[Ue,N(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[4]||(e[4]=o=>s(i).code=o),placeholder:"Code ..."},null,512),[[F,s(i).code]])])]),Ee,t("button",{type:"button",onClick:e[5]||(e[5]=x(o=>Q(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):$("v-if",!0)],64)}}});const Ne=ae(Ae,[["__scopeId","data-v-54de798d"],["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/admin/location/index.vue"]]);export{Ne as default};
