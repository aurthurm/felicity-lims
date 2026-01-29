const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-v7Q387fb.js","assets/index-c4lX_LAY.css"])))=>i.map(i=>d[i]);
import{k as g,a0 as de,f as ce,a7 as y,g as D,h as U,a1 as ae,a6 as ue,_ as le,r as z,c as l,o as a,A as n,C as fe,E as j,J as _,K as P,Q as S,D as x,L as p,a as T,N as J,F as K,a2 as Q}from"./index-v7Q387fb.js";import{c as me,a as h,u as be,b as C}from"./index.esm-D-THTBXR.js";import{u as ve}from"./location-DpzuhiAg.js";const pe=g`
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
    `,ge=g`
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
    `,ye=g`
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
    `,_e=g`
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
    `,xe=g`
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
    `,he=g`
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
    `,Ce=de({__name:"LocationAdmin",setup(G,{expose:i}){i();const E=ae(()=>ue(()=>import("./index-v7Q387fb.js").then(e=>e.cl),__vite__mapDeps([0,1]))),t=ve(),{withClientMutation:f}=ce();let c=y(!0),m=y(!1),b=y(""),o=D({}),d=D({}),v=D({}),k=y("");const u=y(null),L=me({name:h().required("Name is required"),code:h().required("Code is required"),countryUid:h().nullable(),provinceUid:h().nullable()}),{handleSubmit:O,errors:H,resetForm:A,setValues:F}=be({validationSchema:L,initialValues:{name:"",code:"",countryUid:null,provinceUid:null}}),{value:W}=C("name"),{value:X}=C("code"),{value:Y}=C("countryUid"),{value:Z}=C("provinceUid");t.fetchCountries();const ee=U(()=>t.getCountries);function M(e){f(pe,{payload:e},"createCountry").then(r=>{t.addCountry(r),Object.assign(o,r)})}function I(e){if(!u.value)return;const r={...e,active:!0};f(ge,{uid:u.value,payload:r},"updateCountry").then(s=>{t.updateCountry(s),Object.assign(o,s)})}function V(e){const r={...e,countryUid:o.uid};f(ye,{payload:r},"createProvince").then(s=>{t.addProvince(s),Object.assign(d,s)})}function N(e){if(!u.value)return;const r={...e,active:!0};f(_e,{uid:u.value,payload:r},"updateProvince").then(s=>{t.updateProvince(s),Object.assign(d,s)})}function B(e){const r={...e,provinceUid:d.uid};f(xe,{payload:r},"createDistrict").then(s=>{t.addDistrict(s),Object.assign(v,s)})}function $(e){if(!u.value)return;const r={...e,active:!0};f(he,{uid:u.value,payload:r},"updateDistrict").then(s=>{t.updateDistrict(s),Object.assign(v,s)})}function te(){return o.uid!==void 0}function oe(){return d.uid!==void 0}const ne=U(()=>t.getProvinces),ie=U(()=>t.getDistricts);let q=(e,r)=>{e==="country"&&(Object.assign(o,{...r}),t.filterProvincesByCountry(r.uid)),e==="province"&&(Object.assign(d,{...r}),t.filterDistrictsByProvince(r.uid)),e==="district"&&Object.assign(v,{...r})},w=e=>{e==="country"&&(Object.assign(o,{}),Object.assign(d,{}),Object.assign(v,{})),e==="province"&&(Object.assign(d,{}),Object.assign(v,{})),e==="district"&&Object.assign(v,{})};function re(e,r,s={}){c.value=e,b.value=r,m.value=!0,k.value=(e?"CREATE":"EDIT")+" "+r.toUpperCase(),e?(w(r),u.value=null,A({values:{name:"",code:"",countryUid:o.uid??null,provinceUid:d.uid??null}})):(u.value=s?.uid??null,F({name:s?.name??"",code:s?.code??"",countryUid:s?.countryUid??o.uid??null,provinceUid:s?.provinceUid??d.uid??null}))}const se=O(e=>{b.value==="country"&&(c.value===!0&&M({name:e.name,code:e.code}),c.value===!1&&I({name:e.name,code:e.code})),b.value==="province"&&(c.value===!0&&V({name:e.name,code:e.code}),c.value===!1&&N({name:e.name,code:e.code,countryUid:e.countryUid})),b.value==="district"&&(c.value===!0&&B({name:e.name,code:e.code}),c.value===!1&&$({name:e.name,code:e.code,provinceUid:e.provinceUid})),m.value=!1}),R={modal:E,locationStore:t,withClientMutation:f,get createLocation(){return c},set createLocation(e){c=e},get showModal(){return m},set showModal(e){m=e},get targetLocation(){return b},set targetLocation(e){b=e},get country(){return o},set country(e){o=e},get province(){return d},set province(e){d=e},get district(){return v},set district(e){v=e},get formTitle(){return k},set formTitle(e){k=e},currentUid:u,formSchema:L,handleSubmit:O,errors:H,resetForm:A,setValues:F,name:W,code:X,countryUid:Y,provinceUid:Z,countries:ee,addCountry:M,editCountry:I,addProvince:V,editProvince:N,addDistrict:B,editDistrict:$,isCountrySelected:te,isProvinceSelected:oe,provinces:ne,districts:ie,get selectLocation(){return q},set selectLocation(e){q=e},get resetSelected(){return w},set resetSelected(e){w=e},FormManager:re,saveForm:se};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}}),ke={class:"space-y-6"},we={class:"grid grid-cols-12 gap-6"},De={class:"col-span-3"},Ue={class:"flex items-center justify-between mb-4"},je={class:"rounded-md border h-[70vh] overflow-y-auto"},Pe=["onClick"],Se=["onClick"],Te={key:0,class:"col-span-4"},Ee={class:"flex items-center justify-between mb-4"},Le={class:"rounded-md border h-[70vh] overflow-y-auto"},Oe=["onClick"],Ae=["onClick"],Fe={key:1,class:"col-span-5"},Me={class:"flex items-center justify-between mb-4"},Ie={class:"rounded-md border h-[70vh] overflow-y-auto"},Ve=["onClick"],Ne=["onClick"],Be={class:"text-lg font-semibold text-foreground"},$e={class:"grid grid-cols-2 gap-6"},qe={class:"block col-span-1 space-y-2"},Re={class:"text-sm text-destructive"},ze={class:"block col-span-1 space-y-2"},Je={class:"text-sm text-destructive"};function Ke(G,i,E,t,f,c){const m=z("font-awesome-icon"),b=z("fel-modal");return a(),l(_,null,[n("div",ke,[n("div",we,[n("section",De,[n("div",Ue,[i[7]||(i[7]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Countries",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[0]||(i[0]=o=>t.FormManager(!0,"country"))}," Add Country ")]),n("div",je,[(a(!0),l(_,null,P(t.countries,o=>(a(),l("div",{key:o.uid,class:S(t.country?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:x(d=>t.selectLocation("country",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,p(o.name),1)],8,Pe),n("button",{onClick:d=>t.FormManager(!1,"country",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[T(m,{icon:"pen"})],8,Se)],2))),128))])]),t.isCountrySelected()?(a(),l("section",Te,[n("div",Ee,[i[8]||(i[8]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Provinces",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[1]||(i[1]=o=>t.FormManager(!0,"province"))}," Add Province ")]),n("div",Le,[(a(!0),l(_,null,P(t.provinces,o=>(a(),l("div",{key:o.uid,class:S(t.province?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:x(d=>t.selectLocation("province",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,p(o.name),1)],8,Oe),n("button",{onClick:d=>t.FormManager(!1,"province",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[T(m,{icon:"pen"})],8,Ae)],2))),128))])])):j("",!0),t.isProvinceSelected()?(a(),l("section",Fe,[n("div",Me,[i[9]||(i[9]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Districts",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[2]||(i[2]=o=>t.FormManager(!0,"district"))}," Add District ")]),n("div",Ie,[(a(!0),l(_,null,P(t.districts,o=>(a(),l("div",{key:o.uid,class:S(t.district?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:x(d=>t.selectLocation("district",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,p(o.name),1)],8,Ve),n("button",{onClick:d=>t.FormManager(!1,"district",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[T(m,{icon:"pen"})],8,Ne)],2))),128))])])):j("",!0)])]),t.showModal?(a(),fe(b,{key:0,onClose:i[6]||(i[6]=o=>t.showModal=!1)},{header:J(()=>[n("h3",Be,p(t.formTitle),1)]),body:J(()=>[n("form",{class:"space-y-6",onSubmit:i[5]||(i[5]=x((...o)=>t.saveForm&&t.saveForm(...o),["prevent"]))},[n("div",$e,[n("label",qe,[i[10]||(i[10]=n("span",{class:"text-sm font-medium text-foreground"},"Name",-1)),K(n("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":i[3]||(i[3]=o=>t.name=o),placeholder:"Name ..."},null,512),[[Q,t.name]]),n("div",Re,p(t.errors.name),1)]),n("label",ze,[i[11]||(i[11]=n("span",{class:"text-sm font-medium text-foreground"},"Code",-1)),K(n("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":i[4]||(i[4]=o=>t.code=o),placeholder:"Code ..."},null,512),[[Q,t.code]]),n("div",Je,p(t.errors.code),1)])]),i[12]||(i[12]=n("hr",{class:"border-border"},null,-1)),i[13]||(i[13]=n("button",{type:"submit",class:"inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"}," Save Form ",-1))],32)]),_:1})):j("",!0)],64)}const We=le(Ce,[["render",Ke],["__scopeId","data-v-cf24237d"],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{We as default};
