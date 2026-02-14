import{k as U,a0 as he,f as Ce,a7 as w,g as A,h as C,aW as we,_ as ke,r as B,c as l,o as a,A as r,C as F,E as v,a as d,N as g,P as b,L as m,F as P,a2 as L,Q as k,J as j,K as V,M as S,D as _}from"./index-DApeomWQ.js";import{c as Se,a as O,u as Ue,b as T}from"./index.esm-Cx9agkcQ.js";import{u as De}from"./location-CzglHsxT.js";import Pe from"./FelSelect-DP_cqdSE.js";const Le=U`
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
    `,Fe=U`
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
    `,Ee="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",Ae=he({__name:"LocationAdmin",setup(te,{expose:o}){o();const p=De(),{withClientMutation:e}=Ce();let x=w(!0),D=w(!1),c=w(""),f=A({}),u=A({}),n=A({}),y=w("");const h=w(null),N=w(""),q=w(""),K=w(""),I=Se({name:O().required("Name is required"),code:O().required("Code is required"),countryUid:O().nullable(),provinceUid:O().nullable()}),{handleSubmit:z,errors:oe,resetForm:J,setValues:Q}=Ue({validationSchema:I,initialValues:{name:"",code:"",countryUid:null,provinceUid:null}}),{value:ne}=T("name"),{value:re}=T("code"),{value:ie,setValue:se}=T("countryUid"),{value:ae,setValue:de}=T("provinceUid");p.fetchCountries();const M=C(()=>p.getCountries),E=C(()=>p.getProvinces),R=C(()=>p.getDistricts),ce=C(()=>{const t=M.value,i=N.value?.toLowerCase().trim()||"";return i?t.filter(s=>(s.name||"").toLowerCase().includes(i)||(s.code||"").toLowerCase().includes(i)):t}),le=C(()=>{const t=E.value,i=q.value?.toLowerCase().trim()||"";return i?t.filter(s=>(s.name||"").toLowerCase().includes(i)||(s.code||"").toLowerCase().includes(i)):t}),ue=C(()=>{const t=R.value,i=K.value?.toLowerCase().trim()||"";return i?t.filter(s=>(s.name||"").toLowerCase().includes(i)||(s.code||"").toLowerCase().includes(i)):t}),me=C(()=>M.value.map(t=>({value:t.uid,label:`${t.name||""} (${t.code||""})`}))),fe=C(()=>E.value.map(t=>({value:t.uid,label:`${t.name||""} (${t.code||""})`})));function W(t){e(Le,{payload:t},"createCountry").then(i=>{p.addCountry(i),Object.assign(f,i)})}function G(t){if(!h.value)return;const i={...t,active:!0};e(Fe,{uid:h.value,payload:i},"updateCountry").then(s=>{p.updateCountry(s),Object.assign(f,s)})}function H(t){const i={...t,countryUid:f.uid};e(je,{payload:i},"createProvince").then(s=>{p.addProvince(s),Object.assign(u,s)})}function X(t){if(!h.value)return;const i={...t,active:!0};e(Oe,{uid:h.value,payload:i},"updateProvince").then(s=>{p.updateProvince(s),Object.assign(u,s)})}function Y(t){const i={...t,provinceUid:u.uid};e(Te,{payload:i},"createDistrict").then(s=>{p.addDistrict(s),Object.assign(n,s)})}function Z(t){if(!h.value)return;const i={...t,active:!0};e(Me,{uid:h.value,payload:i},"updateDistrict").then(s=>{p.updateDistrict(s),Object.assign(n,s)})}function ye(){return f.uid!==void 0}function ve(){return u.uid!==void 0}function pe(t,i){t==="country"&&(Object.assign(f,{...i}),p.filterProvincesByCountry(i.uid)),t==="province"&&(Object.assign(u,{...i}),p.filterDistrictsByProvince(i.uid)),t==="district"&&Object.assign(n,{...i})}function $(t){t==="country"&&(Object.assign(f,{}),Object.assign(u,{}),Object.assign(n,{})),t==="province"&&(Object.assign(u,{}),Object.assign(n,{})),t==="district"&&Object.assign(n,{})}function ge(){Object.assign(f,{}),Object.assign(u,{}),Object.assign(n,{})}function be(t,i,s={}){x.value=t,c.value=i,D.value=!0,y.value=(t?"CREATE":"EDIT")+" "+i.charAt(0).toUpperCase()+i.slice(1),t?($(i),h.value=null,J({values:{name:"",code:"",countryUid:f.uid??null,provinceUid:u.uid??null}})):(h.value=s?.uid??null,Q({name:s?.name??"",code:s?.code??"",countryUid:s?.countryUid??f.uid??null,provinceUid:s?.provinceUid??u.uid??null}))}const xe=z(t=>{c.value==="country"&&(x.value===!0&&W({name:t.name,code:t.code}),x.value===!1&&G({name:t.name,code:t.code})),c.value==="province"&&(x.value===!0&&H({name:t.name,code:t.code}),x.value===!1&&X({name:t.name,code:t.code,countryUid:t.countryUid})),c.value==="district"&&(x.value===!0&&Y({name:t.name,code:t.code}),x.value===!1&&Z({name:t.name,code:t.code,provinceUid:t.provinceUid})),D.value=!1}),_e=C(()=>{const t=[];return f.name&&t.push(f.name),u.name&&t.push(u.name),n.name&&t.push(n.name),t}),ee={locationStore:p,withClientMutation:e,get createLocation(){return x},set createLocation(t){x=t},get showModal(){return D},set showModal(t){D=t},get targetLocation(){return c},set targetLocation(t){c=t},get country(){return f},set country(t){f=t},get province(){return u},set province(t){u=t},get district(){return n},set district(t){n=t},get formTitle(){return y},set formTitle(t){y=t},currentUid:h,countrySearch:N,provinceSearch:q,districtSearch:K,formSchema:I,handleSubmit:z,errors:oe,resetForm:J,setValues:Q,name:ne,code:re,countryUid:ie,setCountryUid:se,provinceUid:ae,setProvinceUid:de,countries:M,provinces:E,districts:R,filteredCountries:ce,filteredProvinces:le,filteredDistricts:ue,countryOptions:me,provinceOptions:fe,addCountry:W,editCountry:G,addProvince:H,editProvince:X,addDistrict:Y,editDistrict:Z,isCountrySelected:ye,isProvinceSelected:ve,selectLocation:pe,resetSelected:$,clearSelection:ge,FormManager:be,saveForm:xe,breadcrumbTrail:_e,inputClass:Ee,FelButton:we,FelSelect:Pe};return Object.defineProperty(ee,"__isScriptSetup",{enumerable:!1,value:!0}),ee}}),Be={class:"space-y-6"},Ve={key:0,class:"flex items-center gap-2 text-sm"},Ne={class:"font-medium text-foreground"},qe={class:"grid grid-cols-1 md:grid-cols-3 gap-6"},Ke={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},Ie={class:"shrink-0 p-4 border-b border-border bg-muted/30"},ze={class:"flex items-center justify-between mb-3"},Je={class:"text-base font-semibold text-foreground flex items-center gap-2"},Qe={class:"text-xs text-muted-foreground"},Re={class:"relative"},We={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},Ge=["onClick","onKeydown"],He={class:"font-medium truncate"},Xe={class:"shrink-0 text-xs text-muted-foreground"},Ye=["onClick"],Ze={key:1,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},$e={class:"text-sm"},et={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},tt={class:"shrink-0 p-4 border-b border-border bg-muted/30"},ot={class:"flex items-center justify-between mb-3"},nt={class:"text-base font-semibold text-foreground flex items-center gap-2"},rt={key:0,class:"text-xs text-muted-foreground"},it={key:0,class:"relative"},st={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},at={key:0,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},dt=["onClick","onKeydown"],ct={class:"font-medium truncate"},lt={class:"shrink-0 text-xs text-muted-foreground"},ut=["onClick"],mt={key:2,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},ft={class:"text-sm"},yt={key:0,class:"shrink-0 p-3 border-t border-border"},vt={class:"bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"},pt={class:"shrink-0 p-4 border-b border-border bg-muted/30"},gt={class:"flex items-center justify-between mb-3"},bt={class:"text-base font-semibold text-foreground flex items-center gap-2"},xt={key:0,class:"text-xs text-muted-foreground"},_t={key:0,class:"relative"},ht={class:"flex-1 min-h-[200px] max-h-[400px] overflow-y-auto"},Ct={key:0,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},wt=["onClick","onKeydown"],kt={class:"font-medium truncate"},St={class:"shrink-0 text-xs text-muted-foreground"},Ut=["onClick"],Dt={key:2,class:"flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground"},Pt={class:"text-sm"},Lt={key:0,class:"shrink-0 p-3 border-t border-border"},Ft={class:"text-lg font-semibold text-foreground"},jt={class:"grid grid-cols-2 gap-4"},Ot={class:"space-y-2"},Tt={key:0,class:"text-sm text-destructive"},Mt={class:"space-y-2"},Et={key:0,class:"text-sm text-destructive"},At={key:0,class:"space-y-2"},Bt={key:1,class:"space-y-2"},Vt={class:"flex gap-3 pt-2"};function Nt(te,o,p,e,x,D){const c=B("font-awesome-icon"),f=B("fel-heading"),u=B("fel-modal");return a(),l(j,null,[r("div",Be,[d(f,{title:"Country, Provinces & Districts"},{subtitle:g(()=>[...o[16]||(o[16]=[r("span",{class:"text-muted-foreground"},"Manage geographic hierarchy for patient and client addresses.",-1)])]),default:g(()=>[d(e.FelButton,{onClick:o[0]||(o[0]=n=>e.FormManager(!0,"country"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[17]||(o[17]=b(" Add Country ",-1))]),_:1})]),_:1}),e.breadcrumbTrail.length?(a(),l("div",Ve,[o[18]||(o[18]=r("span",{class:"text-muted-foreground"},"Selected:",-1)),r("span",Ne,m(e.breadcrumbTrail.join(" › ")),1),r("button",{type:"button",class:"ml-2 text-xs text-muted-foreground hover:text-foreground underline",onClick:e.clearSelection}," Clear selection ")])):v("",!0),r("div",qe,[r("section",Ke,[r("div",Ie,[r("div",ze,[r("h2",Je,[d(c,{icon:"flag",class:"text-primary/60"}),o[19]||(o[19]=b(" Countries ",-1))]),r("span",Qe,m(e.filteredCountries.length)+" total",1)]),r("div",Re,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(r("input",{"onUpdate:modelValue":o[1]||(o[1]=n=>e.countrySearch=n),type:"text",placeholder:"Search countries...",class:k([e.inputClass,"pl-9"])},null,2),[[L,e.countrySearch]])])]),r("div",We,[e.filteredCountries.length?(a(!0),l(j,{key:0},V(e.filteredCountries,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:k(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.country?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("country",n),onKeydown:[S(_(y=>e.selectLocation("country",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("country",n),["prevent"]),["space"])]},[r("span",He,m(n.name),1),r("span",Xe,m(n.code),1),r("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit country",onClick:_(y=>e.FormManager(!1,"country",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,Ye)],42,Ge))),128)):(a(),l("div",Ze,[d(c,{icon:"flag",class:"w-10 h-10 mb-3 opacity-40"}),r("p",$e,m(e.countrySearch?"No matches found":"No countries yet"),1),e.countrySearch?v("",!0):(a(),F(e.FelButton,{key:0,variant:"outline",class:"mt-3",onClick:o[2]||(o[2]=n=>e.FormManager(!0,"country"))},{default:g(()=>[...o[20]||(o[20]=[b(" Add first country ",-1)])]),_:1}))]))])]),r("section",et,[r("div",tt,[r("div",ot,[r("h2",nt,[d(c,{icon:"map",class:"text-primary/60"}),o[21]||(o[21]=b(" Provinces ",-1))]),e.isCountrySelected()?(a(),l("span",rt,m(e.filteredProvinces.length)+" total",1)):v("",!0)]),e.isCountrySelected()?(a(),l("div",it,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(r("input",{"onUpdate:modelValue":o[3]||(o[3]=n=>e.provinceSearch=n),type:"text",placeholder:"Search provinces...",class:k([e.inputClass,"pl-9"])},null,2),[[L,e.provinceSearch]])])):v("",!0)]),r("div",st,[e.isCountrySelected()?e.filteredProvinces.length?(a(!0),l(j,{key:1},V(e.filteredProvinces,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:k(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.province?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("province",n),onKeydown:[S(_(y=>e.selectLocation("province",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("province",n),["prevent"]),["space"])]},[r("span",ct,m(n.name),1),r("span",lt,m(n.code),1),r("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit province",onClick:_(y=>e.FormManager(!1,"province",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,ut)],42,dt))),128)):(a(),l("div",mt,[d(c,{icon:"map",class:"w-10 h-10 mb-3 opacity-40"}),r("p",ft,m(e.provinceSearch?"No matches found":"No provinces yet"),1),e.provinceSearch?v("",!0):(a(),F(e.FelButton,{key:0,variant:"outline",class:"mt-3",onClick:o[4]||(o[4]=n=>e.FormManager(!0,"province"))},{default:g(()=>[...o[23]||(o[23]=[b(" Add first province ",-1)])]),_:1}))])):(a(),l("div",at,[d(c,{icon:"map",class:"w-10 h-10 mb-3 opacity-40"}),o[22]||(o[22]=r("p",{class:"text-sm"},"Select a country to view provinces",-1))]))]),e.isCountrySelected()?(a(),l("div",yt,[d(e.FelButton,{variant:"outline",class:"w-full",onClick:o[5]||(o[5]=n=>e.FormManager(!0,"province"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[24]||(o[24]=b(" Add Province ",-1))]),_:1})])):v("",!0)]),r("section",vt,[r("div",pt,[r("div",gt,[r("h2",bt,[d(c,{icon:"location-dot",class:"text-primary/60"}),o[25]||(o[25]=b(" Districts ",-1))]),e.isProvinceSelected()?(a(),l("span",xt,m(e.filteredDistricts.length)+" total",1)):v("",!0)]),e.isProvinceSelected()?(a(),l("div",_t,[d(c,{icon:"magnifying-glass",class:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),P(r("input",{"onUpdate:modelValue":o[6]||(o[6]=n=>e.districtSearch=n),type:"text",placeholder:"Search districts...",class:k([e.inputClass,"pl-9"])},null,2),[[L,e.districtSearch]])])):v("",!0)]),r("div",ht,[e.isProvinceSelected()?e.filteredDistricts.length?(a(!0),l(j,{key:1},V(e.filteredDistricts,n=>(a(),l("div",{key:n.uid,role:"button",tabindex:"0",class:k(["w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0 cursor-pointer",e.district?.uid===n.uid?"bg-primary/10 text-primary":"hover:bg-muted/50 text-foreground"]),onClick:y=>e.selectLocation("district",n),onKeydown:[S(_(y=>e.selectLocation("district",n),["prevent"]),["enter"]),S(_(y=>e.selectLocation("district",n),["prevent"]),["space"])]},[r("span",kt,m(n.name),1),r("span",St,m(n.code),1),r("button",{type:"button",class:"shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground","aria-label":"Edit district",onClick:_(y=>e.FormManager(!1,"district",n),["stop"])},[d(c,{icon:"pen",class:"w-3.5 h-3.5"})],8,Ut)],42,wt))),128)):(a(),l("div",Dt,[d(c,{icon:"location-dot",class:"w-10 h-10 mb-3 opacity-40"}),r("p",Pt,m(e.districtSearch?"No matches found":"No districts yet"),1),e.districtSearch?v("",!0):(a(),F(e.FelButton,{key:0,variant:"outline",class:"mt-3",onClick:o[7]||(o[7]=n=>e.FormManager(!0,"district"))},{default:g(()=>[...o[27]||(o[27]=[b(" Add first district ",-1)])]),_:1}))])):(a(),l("div",Ct,[d(c,{icon:"location-dot",class:"w-10 h-10 mb-3 opacity-40"}),o[26]||(o[26]=r("p",{class:"text-sm"},"Select a province to view districts",-1))]))]),e.isProvinceSelected()?(a(),l("div",Lt,[d(e.FelButton,{variant:"outline",class:"w-full",onClick:o[8]||(o[8]=n=>e.FormManager(!0,"district"))},{default:g(()=>[d(c,{icon:"plus",class:"mr-2"}),o[28]||(o[28]=b(" Add District ",-1))]),_:1})])):v("",!0)])])]),e.showModal?(a(),F(u,{key:0,onClose:o[15]||(o[15]=n=>e.showModal=!1)},{header:g(()=>[r("h3",Ft,m(e.formTitle),1)]),body:g(()=>[r("form",{class:"space-y-5",onSubmit:o[14]||(o[14]=_((...n)=>e.saveForm&&e.saveForm(...n),["prevent"]))},[r("div",jt,[r("div",Ot,[o[29]||(o[29]=r("label",{class:"text-sm font-medium text-foreground"},"Name",-1)),P(r("input",{"onUpdate:modelValue":o[9]||(o[9]=n=>e.name=n),type:"text",class:k(e.inputClass),placeholder:"e.g. United States"},null,512),[[L,e.name]]),e.errors.name?(a(),l("p",Tt,m(e.errors.name),1)):v("",!0)]),r("div",Mt,[o[30]||(o[30]=r("label",{class:"text-sm font-medium text-foreground"},"Code",-1)),P(r("input",{"onUpdate:modelValue":o[10]||(o[10]=n=>e.code=n),type:"text",class:k(e.inputClass),placeholder:"e.g. US"},null,512),[[L,e.code]]),e.errors.code?(a(),l("p",Et,m(e.errors.code),1)):v("",!0)])]),e.targetLocation==="province"?(a(),l("div",At,[d(e.FelSelect,{label:"Country",name:"countryUid","model-value":e.countryUid,options:e.countryOptions,"onUpdate:modelValue":o[11]||(o[11]=n=>e.setCountryUid(n))},null,8,["model-value","options"])])):v("",!0),e.targetLocation==="district"?(a(),l("div",Bt,[d(e.FelSelect,{label:"Province",name:"provinceUid","model-value":e.provinceUid,options:e.provinceOptions,"onUpdate:modelValue":o[12]||(o[12]=n=>e.setProvinceUid(n))},null,8,["model-value","options"])])):v("",!0),r("div",Vt,[d(e.FelButton,{type:"submit",class:"flex-1"},{default:g(()=>[...o[31]||(o[31]=[b(" Save ",-1)])]),_:1}),d(e.FelButton,{variant:"outline",type:"button",onClick:o[13]||(o[13]=n=>e.showModal=!1)},{default:g(()=>[...o[32]||(o[32]=[b(" Cancel ",-1)])]),_:1})])],32)]),_:1})):v("",!0)],64)}const Jt=ke(Ae,[["render",Nt],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Jt as default};
