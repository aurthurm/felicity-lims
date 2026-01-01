const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CNAOKjig.js","assets/index-vawJu9QC.css"])))=>i.map(i=>d[i]);
import{k as g,a0 as W,f as X,a7 as p,g as v,h as k,a1 as Y,a6 as Z,_ as ee,r as I,c as u,o as a,A as n,C as te,E as j,J as y,K as w,Q as D,D as _,L as x,a as P,N as $,F as B,a2 as N}from"./index-CNAOKjig.js";import{u as oe}from"./location-Cp7ZTBxF.js";const ne=g`
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
    `,ie=g`
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
    `,re=g`
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
    `,se=g`
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
    `,de=g`
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
    `,ce=g`
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
    `,ae=W({__name:"LocationAdmin",setup(V,{expose:i}){i();const O=Y(()=>Z(()=>import("./index-CNAOKjig.js").then(e=>e.de),__vite__mapDeps([0,1]))),t=oe(),{withClientMutation:l}=X();let c=p(!0),f=p(!1),m=p(""),o=v({}),d=v({}),b=v({}),s=v({}),h=p("");t.fetchCountries();const R=k(()=>t.getCountries);function T(){const e={name:s.name,code:s.code};l(ne,{payload:e},"createCountry").then(r=>{t.addCountry(r),Object.assign(o,r)})}function E(){const e={name:s.name,code:s.code,active:!0};l(ie,{uid:s.uid,payload:e},"updateCountry").then(r=>{t.updateCountry(r),Object.assign(o,r)})}function L(){const e={name:s.name,code:s.code,countryUid:o.uid};l(re,{payload:e},"createProvince").then(r=>{t.addProvince(r),Object.assign(d,r)})}function A(){const e={name:s.name,code:s.code,active:!0,countryUid:+s.countryUid};l(se,{uid:s.uid,payload:e},"updateProvince").then(r=>{t.updateProvince(r),Object.assign(d,r)})}function S(){const e={name:s.name,code:s.code,provinceUid:d.uid};l(de,{payload:e},"createDistrict").then(r=>{t.addDistrict(r),Object.assign(b,r)})}function M(){const e={name:s.name,code:s.code,active:!0,provinceUid:+s.provinceUid};l(ce,{uid:s.uid,payload:e},"updateDistrict").then(r=>{t.updateDistrict(r),Object.assign(b,r)})}function q(){return o.uid!==void 0}function z(){return d.uid!==void 0}const J=k(()=>t.getProvinces),K=k(()=>t.getDistricts);let U=(e,r)=>{e==="country"&&(Object.assign(o,{...r}),t.filterProvincesByCountry(r.uid)),e==="province"&&(Object.assign(d,{...r}),t.filterDistrictsByProvince(r.uid)),e==="district"&&Object.assign(b,{...r})},C=e=>{e==="country"&&(Object.assign(o,{}),Object.assign(d,{}),Object.assign(b,{})),e==="province"&&(Object.assign(d,{}),Object.assign(b,{})),e==="district"&&Object.assign(b,{})};function Q(e,r,H={}){c.value=e,m.value=r,f.value=!0,h.value=(e?"CREATE":"EDIT")+" "+r.toUpperCase(),e?(C(r),Object.assign(s,{})):Object.assign(s,{...H})}function G(){m.value==="country"&&(c.value===!0&&T(),c.value===!1&&E()),m.value==="province"&&(c.value===!0&&L(),c.value===!1&&A()),m.value==="district"&&(c.value===!0&&S(),c.value===!1&&M()),f.value=!1}const F={modal:O,locationStore:t,withClientMutation:l,get createLocation(){return c},set createLocation(e){c=e},get showModal(){return f},set showModal(e){f=e},get targetLocation(){return m},set targetLocation(e){m=e},get country(){return o},set country(e){o=e},get province(){return d},set province(e){d=e},get district(){return b},set district(e){b=e},get form(){return s},set form(e){s=e},get formTitle(){return h},set formTitle(e){h=e},countries:R,addCountry:T,editCountry:E,addProvince:L,editProvince:A,addDistrict:S,editDistrict:M,isCountrySelected:q,isProvinceSelected:z,provinces:J,districts:K,get selectLocation(){return U},set selectLocation(e){U=e},get resetSelected(){return C},set resetSelected(e){C=e},FormManager:Q,saveForm:G};return Object.defineProperty(F,"__isScriptSetup",{enumerable:!1,value:!0}),F}}),ue={class:"space-y-6"},le={class:"grid grid-cols-12 gap-6"},fe={class:"col-span-3"},me={class:"flex items-center justify-between mb-4"},be={class:"rounded-md border h-[70vh] overflow-y-auto"},ge=["onClick"],pe=["onClick"],ve={key:0,class:"col-span-4"},ye={class:"flex items-center justify-between mb-4"},_e={class:"rounded-md border h-[70vh] overflow-y-auto"},xe=["onClick"],he=["onClick"],Ce={key:1,class:"col-span-5"},ke={class:"flex items-center justify-between mb-4"},je={class:"rounded-md border h-[70vh] overflow-y-auto"},we=["onClick"],De=["onClick"],Pe={class:"text-lg font-semibold text-foreground"},Oe={class:"space-y-6"},Te={class:"grid grid-cols-2 gap-6"},Ee={class:"block col-span-1 space-y-2"},Le={class:"block col-span-1 space-y-2"};function Ae(V,i,O,t,l,c){const f=I("font-awesome-icon"),m=I("fel-modal");return a(),u(y,null,[n("div",ue,[n("div",le,[n("section",fe,[n("div",me,[i[7]||(i[7]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Countries",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[0]||(i[0]=o=>t.FormManager(!0,"country"))}," Add Country ")]),n("div",be,[(a(!0),u(y,null,w(t.countries,o=>(a(),u("div",{key:o.uid,class:D(t.country?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:_(d=>t.selectLocation("country",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,ge),n("button",{onClick:d=>t.FormManager(!1,"country",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[P(f,{icon:"pen"})],8,pe)],2))),128))])]),t.isCountrySelected()?(a(),u("section",ve,[n("div",ye,[i[8]||(i[8]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Provinces",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[1]||(i[1]=o=>t.FormManager(!0,"province"))}," Add Province ")]),n("div",_e,[(a(!0),u(y,null,w(t.provinces,o=>(a(),u("div",{key:o.uid,class:D(t.province?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:_(d=>t.selectLocation("province",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,xe),n("button",{onClick:d=>t.FormManager(!1,"province",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[P(f,{icon:"pen"})],8,he)],2))),128))])])):j("",!0),t.isProvinceSelected()?(a(),u("section",Ce,[n("div",ke,[i[9]||(i[9]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Districts",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[2]||(i[2]=o=>t.FormManager(!0,"district"))}," Add District ")]),n("div",je,[(a(!0),u(y,null,w(t.districts,o=>(a(),u("div",{key:o.uid,class:D(t.district?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:_(d=>t.selectLocation("district",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,we),n("button",{onClick:d=>t.FormManager(!1,"district",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[P(f,{icon:"pen"})],8,De)],2))),128))])])):j("",!0)])]),t.showModal?(a(),te(m,{key:0,onClose:i[6]||(i[6]=o=>t.showModal=!1)},{header:$(()=>[n("h3",Pe,x(t.formTitle),1)]),body:$(()=>[n("form",Oe,[n("div",Te,[n("label",Ee,[i[10]||(i[10]=n("span",{class:"text-sm font-medium text-foreground"},"Name",-1)),B(n("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":i[3]||(i[3]=o=>t.form.name=o),placeholder:"Name ..."},null,512),[[N,t.form.name]])]),n("label",Le,[i[11]||(i[11]=n("span",{class:"text-sm font-medium text-foreground"},"Code",-1)),B(n("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":i[4]||(i[4]=o=>t.form.code=o),placeholder:"Code ..."},null,512),[[N,t.form.code]])])]),i[12]||(i[12]=n("hr",{class:"border-border"},null,-1)),n("button",{type:"button",onClick:i[5]||(i[5]=_(o=>t.saveForm(),["prevent"])),class:"inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"}," Save Form ")])]),_:1})):j("",!0)],64)}const Ue=ee(ae,[["render",Ae],["__scopeId","data-v-cf24237d"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Ue as default};
