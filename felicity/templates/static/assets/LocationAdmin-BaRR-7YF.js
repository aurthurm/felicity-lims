import{g as p,Y as ee,u as te,a0 as _,av as w,a7 as j,a3 as oe,_ as ne,r as K,c as b,o as g,z as n,A as ie,C as P,F as C,H as U,N as L,B as h,I as x,a as d,K as l,M,a4 as R}from"./index-OdhKCqIc.js";import{c as re,a as F,u as se,F as de}from"./index.esm-BfHj8iGm.js";import{I as ae}from"./Input-BEm5S0CJ.js";import{F as ce,a as ue,b as le}from"./FormMessage-CgXFMXx9.js";import{F as me}from"./FormLabel-DxP9wnWS.js";import{u as fe}from"./location-zigt6URg.js";import"./Label-CS46LzLb.js";const ge=p`
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
    `,ve=p`
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
    `,be=p`
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
    `,pe=p`
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
    `,ye=p`
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
    `,_e=p`
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
    `,Ce=ee({__name:"LocationAdmin",setup(Y,{expose:i}){i();const a=fe(),{withClientMutation:t}=te();let m=_(!0),y=_(!1),f=_(""),u=w({}),o=w({}),c=w({}),k=_("");const v=_(null),S=re({name:F().required("Name is required"),code:F().required("Code is required"),countryUid:F().nullable(),provinceUid:F().nullable()}),{handleSubmit:T,resetForm:I,setValues:O}=se({validationSchema:S,initialValues:{name:"",code:"",countryUid:null,provinceUid:null}});a.fetchCountries();const G=j(()=>a.getCountries);function E(e){t(ge,{payload:e},"createCountry").then(r=>{a.addCountry(r),Object.assign(u,r)})}function A(e){if(!v.value)return;const r={...e,active:!0};t(ve,{uid:v.value,payload:r},"updateCountry").then(s=>{a.updateCountry(s),Object.assign(u,s)})}function B(e){const r={...e,countryUid:u.uid};t(be,{payload:r},"createProvince").then(s=>{a.addProvince(s),Object.assign(o,s)})}function N(e){if(!v.value)return;const r={...e,active:!0};t(pe,{uid:v.value,payload:r},"updateProvince").then(s=>{a.updateProvince(s),Object.assign(o,s)})}function V(e){const r={...e,provinceUid:o.uid};t(ye,{payload:r},"createDistrict").then(s=>{a.addDistrict(s),Object.assign(c,s)})}function q(e){if(!v.value)return;const r={...e,active:!0};t(_e,{uid:v.value,payload:r},"updateDistrict").then(s=>{a.updateDistrict(s),Object.assign(c,s)})}function J(){return u.uid!==void 0}function Q(){return o.uid!==void 0}const W=j(()=>a.getProvinces),X=j(()=>a.getDistricts);let z=(e,r)=>{e==="country"&&(Object.assign(u,{...r}),a.filterProvincesByCountry(r.uid)),e==="province"&&(Object.assign(o,{...r}),a.filterDistrictsByProvince(r.uid)),e==="district"&&Object.assign(c,{...r})},D=e=>{e==="country"&&(Object.assign(u,{}),Object.assign(o,{}),Object.assign(c,{})),e==="province"&&(Object.assign(o,{}),Object.assign(c,{})),e==="district"&&Object.assign(c,{})};function Z(e,r,s={}){m.value=e,f.value=r,y.value=!0,k.value=(e?"CREATE":"EDIT")+" "+r.toUpperCase(),e?(D(r),v.value=null,I({values:{name:"",code:"",countryUid:u.uid??null,provinceUid:o.uid??null}})):(v.value=s?.uid??null,O({name:s?.name??"",code:s?.code??"",countryUid:s?.countryUid??u.uid??null,provinceUid:s?.provinceUid??o.uid??null}))}const $=T(e=>{f.value==="country"&&(m.value===!0&&E({name:e.name,code:e.code}),m.value===!1&&A({name:e.name,code:e.code})),f.value==="province"&&(m.value===!0&&B({name:e.name,code:e.code}),m.value===!1&&N({name:e.name,code:e.code,countryUid:e.countryUid})),f.value==="district"&&(m.value===!0&&V({name:e.name,code:e.code}),m.value===!1&&q({name:e.name,code:e.code,provinceUid:e.provinceUid})),y.value=!1}),H={locationStore:a,withClientMutation:t,get createLocation(){return m},set createLocation(e){m=e},get showModal(){return y},set showModal(e){y=e},get targetLocation(){return f},set targetLocation(e){f=e},get country(){return u},set country(e){u=e},get province(){return o},set province(e){o=e},get district(){return c},set district(e){c=e},get formTitle(){return k},set formTitle(e){k=e},currentUid:v,formSchema:S,handleSubmit:T,resetForm:I,setValues:O,countries:G,addCountry:E,editCountry:A,addProvince:B,editProvince:N,addDistrict:V,editDistrict:q,isCountrySelected:J,isProvinceSelected:Q,provinces:W,districts:X,get selectLocation(){return z},set selectLocation(e){z=e},get resetSelected(){return D},set resetSelected(e){D=e},FormManager:Z,saveForm:$,get Button(){return oe},get Input(){return ae},get FormControl(){return le},get FormField(){return de},get FormItem(){return ue},get FormLabel(){return me},get FormMessage(){return ce}};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}}),he={class:"space-y-6"},xe={class:"grid grid-cols-12 gap-6"},Fe={class:"col-span-3"},ke={class:"flex items-center justify-between mb-4"},De={class:"rounded-md border h-[70vh] overflow-y-auto"},we=["onClick"],je=["onClick"],Pe={key:0,class:"col-span-4"},Ue={class:"flex items-center justify-between mb-4"},Le={class:"rounded-md border h-[70vh] overflow-y-auto"},Me=["onClick"],Se=["onClick"],Te={key:1,class:"col-span-5"},Ie={class:"flex items-center justify-between mb-4"},Oe={class:"rounded-md border h-[70vh] overflow-y-auto"},Ee=["onClick"],Ae=["onClick"],Be={class:"text-lg font-semibold text-foreground"},Ne={class:"grid grid-cols-2 gap-6"};function Ve(Y,i,a,t,m,y){const f=K("font-awesome-icon"),u=K("Modal");return g(),b(C,null,[n("div",he,[n("div",xe,[n("section",Fe,[n("div",ke,[i[5]||(i[5]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Countries",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[0]||(i[0]=o=>t.FormManager(!0,"country"))}," Add Country ")]),n("div",De,[(g(!0),b(C,null,U(t.countries,o=>(g(),b("div",{key:o.uid,class:L(t.country?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:h(c=>t.selectLocation("country",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,we),n("button",{onClick:c=>t.FormManager(!1,"country",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[d(f,{icon:"pen"})],8,je)],2))),128))])]),t.isCountrySelected()?(g(),b("section",Pe,[n("div",Ue,[i[6]||(i[6]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Provinces",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[1]||(i[1]=o=>t.FormManager(!0,"province"))}," Add Province ")]),n("div",Le,[(g(!0),b(C,null,U(t.provinces,o=>(g(),b("div",{key:o.uid,class:L(t.province?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:h(c=>t.selectLocation("province",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,Me),n("button",{onClick:c=>t.FormManager(!1,"province",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[d(f,{icon:"pen"})],8,Se)],2))),128))])])):P("",!0),t.isProvinceSelected()?(g(),b("section",Te,[n("div",Ie,[i[7]||(i[7]=n("h2",{class:"text-2xl font-semibold text-foreground"},"Districts",-1)),n("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:i[2]||(i[2]=o=>t.FormManager(!0,"district"))}," Add District ")]),n("div",Oe,[(g(!0),b(C,null,U(t.districts,o=>(g(),b("div",{key:o.uid,class:L(t.district?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[n("a",{onClick:h(c=>t.selectLocation("district",o),["prevent","stop"]),class:"font-medium text-foreground"},[n("span",null,x(o.name),1)],8,Ee),n("button",{onClick:c=>t.FormManager(!1,"district",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[d(f,{icon:"pen"})],8,Ae)],2))),128))])])):P("",!0)])]),t.showModal?(g(),ie(u,{key:0,onClose:i[4]||(i[4]=o=>t.showModal=!1)},{header:l(()=>[n("h3",Be,x(t.formTitle),1)]),body:l(()=>[n("form",{class:"space-y-6",onSubmit:i[3]||(i[3]=h((...o)=>t.saveForm&&t.saveForm(...o),["prevent"]))},[n("div",Ne,[d(t.FormField,{name:"name"},{default:l(({componentField:o})=>[d(t.FormItem,null,{default:l(()=>[d(t.FormLabel,null,{default:l(()=>[...i[8]||(i[8]=[M("Name",-1)])]),_:1}),d(t.FormControl,null,{default:l(()=>[d(t.Input,R(o,{placeholder:"Name ..."}),null,16)]),_:2},1024),d(t.FormMessage)]),_:2},1024)]),_:1}),d(t.FormField,{name:"code"},{default:l(({componentField:o})=>[d(t.FormItem,null,{default:l(()=>[d(t.FormLabel,null,{default:l(()=>[...i[9]||(i[9]=[M("Code",-1)])]),_:1}),d(t.FormControl,null,{default:l(()=>[d(t.Input,R(o,{placeholder:"Code ..."}),null,16)]),_:2},1024),d(t.FormMessage)]),_:2},1024)]),_:1})]),i[11]||(i[11]=n("hr",{class:"border-border"},null,-1)),d(t.Button,{type:"submit",class:"w-full"},{default:l(()=>[...i[10]||(i[10]=[M(" Save Form ",-1)])]),_:1})],32)]),_:1})):P("",!0)],64)}const Je=ne(Ce,[["render",Ve],["__scopeId","data-v-cf24237d"],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Je as default};
