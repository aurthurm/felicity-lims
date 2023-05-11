import{al as f,d as Q,a4 as W,r as w,A as k,U as P,B as X,o as r,g as c,h as t,F as x,z as T,H as I,j as s,w as D,t as $,l as U,y as j,D as Z,E as A,i as S,v as F,k as ee,I as te,a5 as oe,a6 as ne,ak as ie,_ as se}from"./index-cd9e6ac8.js";const ae=f`
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
`,re=f`
    mutation editCountry($uid: str!, $payload: CountryInputType!) {
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
`,ce=f`
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
`,de=f`
    mutation editProvince($uid: str!, $payload: ProvinceInputType!) {
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
`,le=f`
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
`,ue=f`
    mutation editDistrict($uid: str!, $payload: DistrictInputType!) {
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
`,_=g=>(oe("data-v-54de798d"),g=g(),ne(),g),pe={class:"mt-4"},ye={class:"grid grid-cols-12 gap-4 mt-2"},me={class:"col-span-3"},ve={class:"w-full flex justify-between items-center pr-4"},fe=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Countries",-1)),_e={class:"overflow-y-scroll overscroll-contain scroll-section"},be=["onClick"],he=["onClick"],ge={key:0,class:"col-span-4"},Ce={class:"w-full flex justify-between items-center pr-4"},we=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Provinces",-1)),ke={class:"overflow-y-scroll overscroll-contain scroll-section"},xe=["onClick"],De=["onClick"],$e={key:1,class:"col-span-5"},je={class:"w-full flex justify-between items-center pr-4"},Oe=_(()=>t("h2",{class:"text-l font-semibold inline uppercase"},"Districts",-1)),Pe={class:"overflow-y-scroll overscroll-contain scroll-section"},Te=["onClick"],Ie=["onClick"],Ue={action:"post",class:"p-1"},Ee={class:"grid grid-cols-2 gap-x-4 mb-4"},Ae={class:"block col-span-1 mb-2"},Se=_(()=>t("span",{class:"text-gray-700"},"Name",-1)),Fe={class:"block col-span-1 mb-2"},Ne=_(()=>t("span",{class:"text-gray-700"},"Code",-1)),Re=_(()=>t("hr",null,null,-1)),Be=Q({__name:"index",setup(g){const a=W(),{withClientMutation:y}=ie();let l=w(!0),m=w(!1),C=w(""),u=k({}),d=k({}),p=k({}),i=k({}),E=w("");a.fetchCountries();const N=P(()=>a.getCountries);function R(){const n={name:i.name,code:i.code};y(ae,{payload:n},"createCountry").then(e=>{a.addCountry(e),Object.assign(u,e)})}function B(){const n={name:i.name,code:i.code,active:!0};y(re,{uid:i.uid,payload:n},"updateCountry").then(e=>{a.updateCountry(e),Object.assign(u,e)})}function V(){const n={name:i.name,code:i.code,countryUid:u.uid};y(ce,{payload:n},"createProvince").then(e=>{a.addProvince(e),Object.assign(d,e)})}function L(){const n={name:i.name,code:i.code,active:!0,countryUid:+i.countryUid};y(de,{uid:i.uid,payload:n},"updateProvince").then(e=>{a.updateProvince(e),Object.assign(d,e)})}function M(){const n={name:i.name,code:i.code,provinceUid:d.uid};y(le,{payload:n},"createDistrict").then(e=>{a.addDistrict(e),Object.assign(p,e)})}function z(){const n={name:i.name,code:i.code,active:!0,provinceUid:+i.provinceUid};y(ue,{uid:i.uid,payload:n},"updateDistrict").then(e=>{a.updateDistrict(e),Object.assign(p,e)})}function Y(){return u.uid!==void 0}function q(){return d.uid!==void 0}const H=P(()=>a.getProvinces),G=P(()=>a.getDistricts);let O=(n,e)=>{n==="country"&&(Object.assign(u,{...e}),a.filterProvincesByCountry(e.uid)),n==="province"&&(Object.assign(d,{...e}),a.filterDistrictsByProvince(e.uid)),n==="district"&&Object.assign(p,{...e})},J=n=>{n==="country"&&(Object.assign(u,{}),Object.assign(d,{}),Object.assign(p,{})),n==="province"&&(Object.assign(d,{}),Object.assign(p,{})),n==="district"&&Object.assign(p,{})};function v(n,e,b={}){l.value=n,C.value=e,m.value=!0,E.value=(n?"CREATE":"EDIT")+" "+e.toUpperCase(),n?(J(e),Object.assign(i,{})):Object.assign(i,{...b})}function K(){C.value==="country"&&(l.value===!0&&R(),l.value===!1&&B()),C.value==="province"&&(l.value===!0&&V(),l.value===!1&&L()),C.value==="district"&&(l.value===!0&&M(),l.value===!1&&z()),m.value=!1}return(n,e)=>{const b=X("font-awesome-icon");return r(),c(x,null,[t("div",pe,[t("div",ye,[t("section",me,[t("div",ve,[fe,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[0]||(e[0]=o=>v(!0,"country"))}," Add Country ")]),t("div",_e,[(r(!0),c(x,null,T(s(N),o=>(r(),c("div",{key:o.uid,class:I(s(u)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:D(h=>s(O)("country",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(o.name),1)],8,be),t("a",{href:"#",onClick:h=>v(!1,"country",o),class:"px-2 cursor"},[U(b,{icon:"pen"})],8,he)],2))),128))])]),Y()?(r(),c("section",ge,[t("div",Ce,[we,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[1]||(e[1]=o=>v(!0,"province"))}," Add Province ")]),t("div",ke,[(r(!0),c(x,null,T(s(H),o=>(r(),c("div",{key:o.uid,class:I(s(d)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:D(h=>s(O)("province",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(o.name),1)],8,xe),t("a",{href:"#",onClick:h=>v(!1,"province",o),class:"px-2 cursor"},[U(b,{icon:"pen"})],8,De)],2))),128))])])):j("v-if",!0),q()?(r(),c("section",$e,[t("div",je,[Oe,t("button",{class:"p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:e[2]||(e[2]=o=>v(!0,"district"))}," Add District ")]),t("div",Pe,[(r(!0),c(x,null,T(s(G),o=>(r(),c("div",{key:o.uid,class:I(s(p)?.uid===o.uid?"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active":"bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border")},[t("a",{href:"#",onClick:D(h=>s(O)("district",o),["prevent","stop"]),class:"font-semibold text-gray-700"},[t("span",null,$(o.name),1)],8,Te),t("a",{href:"#",onClick:h=>v(!1,"district",o),class:"px-2 cursor"},[U(b,{icon:"pen"})],8,Ie)],2))),128))])])):j("v-if",!0)])]),j(" Location Edit Form Modal "),s(m)?(r(),Z(te,{key:0,onClose:e[6]||(e[6]=o=>ee(m)?m.value=!1:m=!1)},{header:A(()=>[t("h3",null,$(s(E)),1)]),body:A(()=>[t("form",Ue,[t("div",Ee,[t("label",Ae,[Se,S(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[3]||(e[3]=o=>s(i).name=o),placeholder:"Name ..."},null,512),[[F,s(i).name]])]),t("label",Fe,[Ne,S(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[4]||(e[4]=o=>s(i).code=o),placeholder:"Code ..."},null,512),[[F,s(i).code]])])]),Re,t("button",{type:"button",onClick:e[5]||(e[5]=D(o=>K(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):j("v-if",!0)],64)}}});const Le=se(Be,[["__scopeId","data-v-54de798d"],["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/admin/location/index.vue"]]);export{Le as default};
