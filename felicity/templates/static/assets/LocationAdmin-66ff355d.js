import{g as v,S as Q,f as W,a0 as x,h,i as $,r as T,o as d,c as a,N as t,F as C,E as O,a3 as P,a5 as r,A as k,H as j,a as E,K as D,y as Y,L as U,C as L,X as S,ac as Z,_ as ee}from"./index-6c3e61f6.js";import{u as te}from"./location-3008fd14.js";const oe=v`
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
    `,ne=v`
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
    `,ie=v`
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
    `,se=v`
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
    `,re=v`
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
    `,de=v`
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
    `,ae={class:"space-y-6"},ce={class:"grid grid-cols-12 gap-6"},ue={class:"col-span-3"},le={class:"flex items-center justify-between mb-4"},fe={class:"rounded-md border h-[70vh] overflow-y-auto"},be=["onClick"],pe=["onClick"],me={key:0,class:"col-span-4"},ve={class:"flex items-center justify-between mb-4"},ge={class:"rounded-md border h-[70vh] overflow-y-auto"},ye=["onClick"],_e=["onClick"],xe={key:1,class:"col-span-5"},he={class:"flex items-center justify-between mb-4"},Ce={class:"rounded-md border h-[70vh] overflow-y-auto"},ke=["onClick"],je=["onClick"],De={class:"text-lg font-semibold text-foreground"},we={class:"space-y-6"},$e={class:"grid grid-cols-2 gap-6"},Oe={class:"block col-span-1 space-y-2"},Pe={class:"block col-span-1 space-y-2"},Ee=Q({__name:"LocationAdmin",setup(Ae){const s=te(),{withClientMutation:b}=W();let u=x(!0),p=x(!1),_=x(""),l=h({}),c=h({}),f=h({}),i=h({}),A=x("");s.fetchCountries();const I=$(()=>s.getCountries);function B(){const n={name:i.name,code:i.code};b(oe,{payload:n},"createCountry").then(e=>{s.addCountry(e),Object.assign(l,e)})}function F(){const n={name:i.name,code:i.code,active:!0};b(ne,{uid:i.uid,payload:n},"updateCountry").then(e=>{s.updateCountry(e),Object.assign(l,e)})}function M(){const n={name:i.name,code:i.code,countryUid:l.uid};b(ie,{payload:n},"createProvince").then(e=>{s.addProvince(e),Object.assign(c,e)})}function N(){const n={name:i.name,code:i.code,active:!0,countryUid:+i.countryUid};b(se,{uid:i.uid,payload:n},"updateProvince").then(e=>{s.updateProvince(e),Object.assign(c,e)})}function V(){const n={name:i.name,code:i.code,provinceUid:c.uid};b(re,{payload:n},"createDistrict").then(e=>{s.addDistrict(e),Object.assign(f,e)})}function R(){const n={name:i.name,code:i.code,active:!0,provinceUid:+i.provinceUid};b(de,{uid:i.uid,payload:n},"updateDistrict").then(e=>{s.updateDistrict(e),Object.assign(f,e)})}function q(){return l.uid!==void 0}function z(){return c.uid!==void 0}const H=$(()=>s.getProvinces),K=$(()=>s.getDistricts);let w=(n,e)=>{n==="country"&&(Object.assign(l,{...e}),s.filterProvincesByCountry(e.uid)),n==="province"&&(Object.assign(c,{...e}),s.filterDistrictsByProvince(e.uid)),n==="district"&&Object.assign(f,{...e})},X=n=>{n==="country"&&(Object.assign(l,{}),Object.assign(c,{}),Object.assign(f,{})),n==="province"&&(Object.assign(c,{}),Object.assign(f,{})),n==="district"&&Object.assign(f,{})};function m(n,e,g={}){u.value=n,_.value=e,p.value=!0,A.value=(n?"CREATE":"EDIT")+" "+e.toUpperCase(),n?(X(e),Object.assign(i,{})):Object.assign(i,{...g})}function G(){_.value==="country"&&(u.value===!0&&B(),u.value===!1&&F()),_.value==="province"&&(u.value===!0&&M(),u.value===!1&&N()),_.value==="district"&&(u.value===!0&&V(),u.value===!1&&R()),p.value=!1}return(n,e)=>{const g=T("font-awesome-icon"),J=T("fel-modal");return d(),a(C,null,[t("div",ae,[t("div",ce,[t("section",ue,[t("div",le,[e[7]||(e[7]=t("h2",{class:"text-2xl font-semibold text-foreground"},"Countries",-1)),t("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:e[0]||(e[0]=o=>m(!0,"country"))}," Add Country ")]),t("div",fe,[(d(!0),a(C,null,O(I.value,o=>(d(),a("div",{key:o.uid,class:P(r(l)?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[t("a",{onClick:k(y=>r(w)("country",o),["prevent","stop"]),class:"font-medium text-foreground"},[t("span",null,j(o.name),1)],8,be),t("button",{onClick:y=>m(!1,"country",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[E(g,{icon:"pen"})],8,pe)],2))),128))])]),q()?(d(),a("section",me,[t("div",ve,[e[8]||(e[8]=t("h2",{class:"text-2xl font-semibold text-foreground"},"Provinces",-1)),t("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:e[1]||(e[1]=o=>m(!0,"province"))}," Add Province ")]),t("div",ge,[(d(!0),a(C,null,O(H.value,o=>(d(),a("div",{key:o.uid,class:P(r(c)?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[t("a",{onClick:k(y=>r(w)("province",o),["prevent","stop"]),class:"font-medium text-foreground"},[t("span",null,j(o.name),1)],8,ye),t("button",{onClick:y=>m(!1,"province",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[E(g,{icon:"pen"})],8,_e)],2))),128))])])):D("v-if",!0),z()?(d(),a("section",xe,[t("div",he,[e[9]||(e[9]=t("h2",{class:"text-2xl font-semibold text-foreground"},"Districts",-1)),t("button",{class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",onClick:e[2]||(e[2]=o=>m(!0,"district"))}," Add District ")]),t("div",Ce,[(d(!0),a(C,null,O(K.value,o=>(d(),a("div",{key:o.uid,class:P(r(f)?.uid===o.uid?"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted":"flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted")},[t("a",{onClick:k(y=>r(w)("district",o),["prevent","stop"]),class:"font-medium text-foreground"},[t("span",null,j(o.name),1)],8,ke),t("button",{onClick:y=>m(!1,"district",o),class:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"},[E(g,{icon:"pen"})],8,je)],2))),128))])])):D("v-if",!0)])]),D(" Location Edit Form Modal "),r(p)?(d(),Y(J,{key:0,onClose:e[6]||(e[6]=o=>Z(p)?p.value=!1:p=!1)},{header:U(()=>[t("h3",De,j(r(A)),1)]),body:U(()=>[t("form",we,[t("div",$e,[t("label",Oe,[e[10]||(e[10]=t("span",{class:"text-sm font-medium text-foreground"},"Name",-1)),L(t("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":e[3]||(e[3]=o=>r(i).name=o),placeholder:"Name ..."},null,512),[[S,r(i).name]])]),t("label",Pe,[e[11]||(e[11]=t("span",{class:"text-sm font-medium text-foreground"},"Code",-1)),L(t("input",{class:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50","onUpdate:modelValue":e[4]||(e[4]=o=>r(i).code=o),placeholder:"Code ..."},null,512),[[S,r(i).code]])])]),e[12]||(e[12]=t("hr",{class:"border-border"},null,-1)),t("button",{type:"button",onClick:e[5]||(e[5]=k(o=>G(),["prevent"])),class:"inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"}," Save Form ")])]),_:1})):D("v-if",!0)],64)}}});const Le=ee(Ee,[["__scopeId","data-v-cf24237d"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/location/LocationAdmin.vue"]]);export{Le as default};
