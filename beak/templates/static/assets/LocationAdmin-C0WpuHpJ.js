import{k as U,a0 as he,f as Ce,a7 as k,g as F,h as C,aW as ke,_ as we,r as A,c as l,o as a,A as i,E as u,C as B,a as d,N as g,P as b,L as f,F as P,a2 as L,Q as w,J as j,K as V,M as S,D as _}from"./index-DCVfsbos.js";import{c as Se,a as O,u as Ue,b as T}from"./index.esm-89YX2EbQ.js";import{u as De}from"./location-DdmSnePa.js";import Pe from"./BeakSelect-BUgj-MLc.js";const Le=U`
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
    `,Be=U`
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
    `,je=U`
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
    `,Oe=U`
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
    `,Te=U`
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
    `,Me=U`
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
    `,Ee="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",Fe=he({__name:"LocationAdmin",setup(te,{expose:o}){o();const p=De(),{withClientMutation:e}=Ce();let x=k(!0),D=k(!1),c=k(""),v=F({}),m=F({}),n=F({}),y=k("");const h=k(null),N=k(""),q=k(""),K=k(""),I=Se({name:O().required("Name is required"),code:O().required("Code is required"),countryUid:O().nullable(),provinceUid:O().nullable()}),{handleSubmit:z,errors:oe,resetForm:J,setValues:Q}=Ue({validationSchema:I,initialValues:{name:"",code:"",countryUid:null,provinceUid:null}}),{value:ne}=T("name"),{value:ie}=T("code"),{value:re,setValue:se}=T("countryUid"),{value:ae,setValue:de}=T("provinceUid");p.fetchCountries();const M=C(()=>p.getCountries),E=C(()=>p.getProvinces),R=C(()=>p.getDistricts),ce=C(()=>{const t=M.value,r=N.value?.toLowerCase().trim()||"";return r?t.filter(s=>(s.name||"").toLowerCase().includes(r)||(s.code||"").toLowerCase().includes(r)):t}),le=C(()=>{const t=E.value,r=q.value?.toLowerCase().trim()||"";return r?t.filter(s=>(s.name||"").toLowerCase().includes(r)||(s.code||"").toLowerCase().includes(r)):t}),ue=C(()=>{const t=R.value,r=K.value?.toLowerCase().trim()||"";return r?t.filter(s=>(s.name||"").toLowerCase().includes(r)||(s.code||"").toLowerCase().includes(r)):t}),me=C(()=>M.value.map(t=>({value:t.uid,label:`${t.name||""} (${t.code||""})`}))),fe=C(()=>E.value.map(t=>({value:t.uid,label:`${t.name||""} (${t.code||""})`})));function W(t){e(Le,{payload:t},"createCountry").then(r=>{p.addCountry(r),Object.assign(v,r)})}function G(t){if(!h.value)return;const r={...t,active:!0};e(Be,{uid:h.value,payload:r},"updateCountry").then(s=>{p.updateCountry(s),Object.assign(v,s)})}function H(t){const r={...t,countryUid:v.uid};e(je,{payload:r},"createProvince").then(s=>{p.addProvince(s),Object.assign(m,s)})}function X(t){if(!h.value)return;const r={...t,active:!0};e(Oe,{uid:h.value,payload:r},"updateProvince").then(s=>{p.updateProvince(s),Object.assign(m,s)})}function Y(t){const r={...t,provinceUid:m.uid};e(Te,{payload:r},"createDistrict").then(s=>{p.addDistrict(s),Object.assign(n,s)})}function Z(t){if(!h.value)return;const r={...t,active:!0};e(Me,{uid:h.value,payload:r},"updateDistrict").then(s=>{p.updateDistrict(s),Object.assign(n,s)})}function ve(){return v.uid!==void 0}function ye(){return m.uid!==void 0}function pe(t,r){t==="country"&&(Object.assign(v,{...r}),p.filterProvincesByCountry(r.uid)),t==="province"&&(Object.assign(m,{...r}),p.filterDistrictsByProvince(r.uid)),t==="district"&&Object.assign(n,{...r})}function $(t){t==="country"&&(Object.assign(v,{}),Object.assign(m,{}),Object.assign(n,{})),t==="province"&&(Object.assign(m,{}),Object.assign(n,{})),t==="district"&&Object.assign(n,{})}function ge(){Object.assign(v,{}),Object.assign(m,{}),Object.assign(n,{})}function be(t,r,s={}){x.value=t,c.value=r,D.value=!0,y.value=(t?"CREATE":"EDIT")+" "+r.charAt(0).toUpperCase()+r.slice(1),t?($(r),h.value=null,J({values:{name:"",code:"",countryUid:v.uid??null,provinceUid:m.uid??null}})):(h.value=s?.uid??null,Q({name:s?.name??"",code:s?.code??"",countryUid:s?.countryUid??v.uid??null,provinceUid:s?.provinceUid??m.uid??null}))}const xe=z(t=>{c.value==="country"&&(x.value===!0&&W({name:t.name,code:t.code}),x.value===!1&&G({name:t.name,code:t.code})),c.value==="province"&&(x.value===!0&&H({name:t.name,code:t.code}),x.value===!1&&X({name:t.name,code:t.code,countryUid:t.countryUid})),c.value==="district"&&(x.value===!0&&Y({name:t.name,code:t.code}),x.value===!1&&Z({name:t.name,code:t.code,provinceUid:t.provinceUid})),D.value=!1}),_e=C(()=>{const t=[];return v.name&&t.push(v.name),m.name&&t.push(m.name),n.name&&t.push(n.name),t}),ee={locationStore:p,withClientMutation:e,get createLocation(){return x},set createLocation(t){x=t},get showModal(){return D},set showModal(t){D=t},get targetLocation(){return c},set targetLocation(t){c=t},get country(){return v},set country(t){v=t},get province(){return m},set province(t){m=t},get district(){return n},set district(t){n=t},get formTitle(){return y},set formTitle(t){y=t},currentUid:h,countrySearch:N,provinceSearch:q,districtSearch:K,formSchema:I,handleSubmit:z,errors:oe,resetForm:J,setValues:Q,name:ne,code:ie,countryUid:re,setCountryUid:se,provinceUid:ae,setProvinceUid:de,countries:M,provinces:E,districts:R,filteredCountries:ce,filteredProvinces:le,filteredDistricts:ue,countryOptions:me,provinceOptions:fe,addCountry:W,editCountry:G,addProvince:H,editProvince:X,addDistrict:Y,editDistrict:Z,isCountrySelected:ve,isProvinceSelected:ye,selectLocation:pe,resetSelected:$,clearSelection:ge,FormManager:be,saveForm:xe,breadcrumbTrail:_e,inputClass:Ee,BeakButton:ke,BeakSelect:Pe};return Object.defineProperty(ee,"__isScriptSetup",{enumerable:!1,value:!0}),ee}}),Ae={class:"space-y-6"},Ve={key:0,class:"flex items-center gap-2 text-sm"},Ne={class:"font-medium text-foreground"},qe={class:"grid grid-cols-1 md:grid-cols-3 gap-6"},Ke={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},Ie={class:"shrink-0 p-4 border-b border-border bg-muted/30"},ze={class:"flex items-center justify-between mb-3"},Je={class:"text-base font-semibold text-foreground flex items-center gap-2"},Qe={class:"text-xs text-muted-foreground"},Re={class:"relative"},We={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},Ge=["onClick","onKeydown"],He={class:"font-medium truncate"},Xe={class:"shrink-0 text-xs text-muted-foreground"},Ye=["onClick"],Ze={key:1,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},$e={class:"text-sm"},et={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},tt={class:"shrink-0 p-4 border-b border-border bg-muted/30"},ot={class:"flex items-center justify-between mb-3"},nt={class:"text-base font-semibold text-foreground flex items-center gap-2"},it={key:0,class:"text-xs text-muted-foreground"},rt={key:0,class:"relative"},st={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},at={key:0,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},dt=["onClick","onKeydown"],ct={class:"font-medium truncate"},lt={class:"shrink-0 text-xs text-muted-foreground"},ut=["onClick"],mt={key:2,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},ft={class:"text-sm"},vt={key:0,class:"shrink-0 p-3 border-t border-border"},yt={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},pt={class:"shrink-0 p-4 border-b border-border bg-muted/30"},gt={class:"flex items-center justify-between mb-3"},bt={class:"text-base font-semibold text-foreground flex items-center gap-2"},xt={key:0,class:"text-xs text-muted-foreground"},_t={key:0,class:"relative"},ht={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},Ct={key:0,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},kt=["onClick","onKeydown"],wt={class:"font-medium truncate"},St={class:"shrink-0 text-xs text-muted-foreground"},Ut=["onClick"],Dt={key:2,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},Pt={class:"text-sm"},Lt={key:0,class:"shrink-0 p-3 border-t border-border"},Bt={class:"text-lg font-semibold text-foreground"},jt={class:"grid grid-cols-2 gap-4"},Ot={class:"space-y-2"},Tt={key:0,class:"text-sm text-destructive"},Mt={class:"space-y-2"},Et={key:0,class:"text-sm text-destructive"},Ft={key:0,class:"space-y-2"},At={key:1,class:"space-y-2"},Vt={class:"flex gap-3 pt-2"};function Nt(te,o,p,e,x,D){const c=A("font-awesome-icon"),v=A("beak-heading"),m=A("beak-modal");return a(),l(j,null,[i("div",Ae,[d(v,{title:"Country, Provinces & Districts"},{subtitle:g(()=>[...o[16]||(o[16]=[i("span",{class:"text-muted-foreground"},"Manage geographic hierarchy for patient and client addresses.",-1)])]),default:g(()=>[d(e.BeakButton,{onClick:o[0]||(o[0]=n=>e.FormManager(!0,"country"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[17]||(o[17]=b(" Add Country ",-1))]),_:1})]),_:1}),u(" Breadcrumb trail "),e.breadcrumbTrail.length?(a(),l("div",Ve,[o[18]||(o[18]=i("span",{class:"text-muted-foreground"},"Selected:",-1)),i("span",Ne,f(e.breadcrumbTrail.join(" › ")),1),i("button",{type:"button",class:"ml-2 text-xs text-muted-foreground hover:text-foreground underline",onClick:e.clearSelection}," Clear selection ")])):u("v-if",!0),i("div",qe,[u(" Countries "),i("section",Ke,[i("div",Ie,[i("div",ze,[i("h2",Je,[d(c,{icon:"flag",class:"text-primary/60"}),o[19]||(o[19]=b(" Countries ",-1))]),i("span",Qe,f(e.filteredCountries.length)+" total",1)]),i("div",Re,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(i("input",{"onUpdate:modelValue":o[1]||(o[1]=n=>e.countrySearch=n),type:"text",placeholder:"Search countries...",class:w([e.inputClass,"pl-9"])},null,2),[[L,e.countrySearch]])])]),i("div",We,[e.filteredCountries.length?(a(!0),l(j,{key:0},V(e.filteredCountries,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:w(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.country?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("country",n),onKeydown:[S(_(y=>e.selectLocation("country",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("country",n),["prevent"]),["space"])]},[i("span",He,f(n.name),1),i("span",Xe,f(n.code),1),i("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit country",onClick:_(y=>e.FormManager(!1,"country",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,Ye)],42,Ge))),128)):(a(),l("div",Ze,[d(c,{icon:"flag",class:"w-10 h-10 mb-3 opacity-40"}),i("p",$e,f(e.countrySearch?"No matches found":"No countries yet"),1),e.countrySearch?u("v-if",!0):(a(),B(e.BeakButton,{key:0,variant:"outline",class:"mt-3",onClick:o[2]||(o[2]=n=>e.FormManager(!0,"country"))},{default:g(()=>[...o[20]||(o[20]=[b(" Add first country ",-1)])]),_:1}))]))])]),u(" Provinces "),i("section",et,[i("div",tt,[i("div",ot,[i("h2",nt,[d(c,{icon:"map",class:"text-primary/60"}),o[21]||(o[21]=b(" Provinces ",-1))]),e.isCountrySelected()?(a(),l("span",it,f(e.filteredProvinces.length)+" total",1)):u("v-if",!0)]),e.isCountrySelected()?(a(),l("div",rt,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(i("input",{"onUpdate:modelValue":o[3]||(o[3]=n=>e.provinceSearch=n),type:"text",placeholder:"Search provinces...",class:w([e.inputClass,"pl-9"])},null,2),[[L,e.provinceSearch]])])):u("v-if",!0)]),i("div",st,[e.isCountrySelected()?e.filteredProvinces.length?(a(!0),l(j,{key:1},V(e.filteredProvinces,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:w(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.province?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("province",n),onKeydown:[S(_(y=>e.selectLocation("province",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("province",n),["prevent"]),["space"])]},[i("span",ct,f(n.name),1),i("span",lt,f(n.code),1),i("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit province",onClick:_(y=>e.FormManager(!1,"province",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,ut)],42,dt))),128)):(a(),l("div",mt,[d(c,{icon:"map",class:"w-10 h-10 mb-3 opacity-40"}),i("p",ft,f(e.provinceSearch?"No matches found":"No provinces yet"),1),e.provinceSearch?u("v-if",!0):(a(),B(e.BeakButton,{key:0,variant:"outline",class:"mt-3",onClick:o[4]||(o[4]=n=>e.FormManager(!0,"province"))},{default:g(()=>[...o[23]||(o[23]=[b(" Add first province ",-1)])]),_:1}))])):(a(),l("div",at,[d(c,{icon:"map",class:"w-10 h-10 mb-3 opacity-40"}),o[22]||(o[22]=i("p",{class:"text-sm"},"Select a country to view provinces",-1))]))]),e.isCountrySelected()?(a(),l("div",vt,[d(e.BeakButton,{variant:"outline",class:"w-full",onClick:o[5]||(o[5]=n=>e.FormManager(!0,"province"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[24]||(o[24]=b(" Add Province ",-1))]),_:1})])):u("v-if",!0)]),u(" Districts "),i("section",yt,[i("div",pt,[i("div",gt,[i("h2",bt,[d(c,{icon:"location-dot",class:"text-primary/60"}),o[25]||(o[25]=b(" Districts ",-1))]),e.isProvinceSelected()?(a(),l("span",xt,f(e.filteredDistricts.length)+" total",1)):u("v-if",!0)]),e.isProvinceSelected()?(a(),l("div",_t,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(i("input",{"onUpdate:modelValue":o[6]||(o[6]=n=>e.districtSearch=n),type:"text",placeholder:"Search districts...",class:w([e.inputClass,"pl-9"])},null,2),[[L,e.districtSearch]])])):u("v-if",!0)]),i("div",ht,[e.isProvinceSelected()?e.filteredDistricts.length?(a(!0),l(j,{key:1},V(e.filteredDistricts,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:w(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.district?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("district",n),onKeydown:[S(_(y=>e.selectLocation("district",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("district",n),["prevent"]),["space"])]},[i("span",wt,f(n.name),1),i("span",St,f(n.code),1),i("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit district",onClick:_(y=>e.FormManager(!1,"district",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,Ut)],42,kt))),128)):(a(),l("div",Dt,[d(c,{icon:"location-dot",class:"w-10 h-10 mb-3 opacity-40"}),i("p",Pt,f(e.districtSearch?"No matches found":"No districts yet"),1),e.districtSearch?u("v-if",!0):(a(),B(e.BeakButton,{key:0,variant:"outline",class:"mt-3",onClick:o[7]||(o[7]=n=>e.FormManager(!0,"district"))},{default:g(()=>[...o[27]||(o[27]=[b(" Add first district ",-1)])]),_:1}))])):(a(),l("div",Ct,[d(c,{icon:"location-dot",class:"w-10 h-10 mb-3 opacity-40"}),o[26]||(o[26]=i("p",{class:"text-sm"},"Select a province to view districts",-1))]))]),e.isProvinceSelected()?(a(),l("div",Lt,[d(e.BeakButton,{variant:"outline",class:"w-full",onClick:o[8]||(o[8]=n=>e.FormManager(!0,"district"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[28]||(o[28]=b(" Add District ",-1))]),_:1})])):u("v-if",!0)])])]),u(" Location Edit Form Modal "),e.showModal?(a(),B(m,{key:0,onClose:o[15]||(o[15]=n=>e.showModal=!1)},{header:g(()=>[i("h3",Bt,f(e.formTitle),1)]),body:g(()=>[i("form",{class:"space-y-5",onSubmit:o[14]||(o[14]=_((...n)=>e.saveForm&&e.saveForm(...n),["prevent"]))},[i("div",jt,[i("div",Ot,[o[29]||(o[29]=i("label",{class:"text-sm font-medium text-foreground"},"Name",-1)),P(i("input",{"onUpdate:modelValue":o[9]||(o[9]=n=>e.name=n),type:"text",class:w(e.inputClass),placeholder:"e.g. United States"},null,512),[[L,e.name]]),e.errors.name?(a(),l("p",Tt,f(e.errors.name),1)):u("v-if",!0)]),i("div",Mt,[o[30]||(o[30]=i("label",{class:"text-sm font-medium text-foreground"},"Code",-1)),P(i("input",{"onUpdate:modelValue":o[10]||(o[10]=n=>e.code=n),type:"text",class:w(e.inputClass),placeholder:"e.g. US"},null,512),[[L,e.code]]),e.errors.code?(a(),l("p",Et,f(e.errors.code),1)):u("v-if",!0)])]),u(" Country selector when editing province "),e.targetLocation==="province"?(a(),l("div",Ft,[d(e.BeakSelect,{label:"Country",name:"countryUid","model-value":e.countryUid,options:e.countryOptions,"onUpdate:modelValue":o[11]||(o[11]=n=>e.setCountryUid(n))},null,8,["model-value","options"])])):u("v-if",!0),u(" Province selector when editing district "),e.targetLocation==="district"?(a(),l("div",At,[d(e.BeakSelect,{label:"Province",name:"provinceUid","model-value":e.provinceUid,options:e.provinceOptions,"onUpdate:modelValue":o[12]||(o[12]=n=>e.setProvinceUid(n))},null,8,["model-value","options"])])):u("v-if",!0),i("div",Vt,[d(e.BeakButton,{type:"submit",class:"flex-1"},{default:g(()=>[...o[31]||(o[31]=[b(" Save ",-1)])]),_:1}),d(e.BeakButton,{variant:"outline",type:"button",onClick:o[13]||(o[13]=n=>e.showModal=!1)},{default:g(()=>[...o[32]||(o[32]=[b(" Cancel ",-1)])]),_:1})])],32)]),_:1})):u("v-if",!0)],64)}const Jt=we(Fe,[["render",Nt],["__file","/home/administrator/Documents/Development/beak-insights/beak/beak-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Jt as default};
