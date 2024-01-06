import{_ as w,as as P,j as H,q as z}from"./billing-356772f3.js";import{f as G,G as U,d as W,M as J,w as K,r as Q,v as X,h as u,k as m,x as e,u as i,B as A,F as L,ak as Y,D as y,j as Z,A as D,ag as x,s as S,i as p,y as ee,p as oe,e as se,_ as te}from"./_plugin-vue_export-helper-3f67fb71.js";import{g as ie,h as ae}from"./billing.mutations-59bfac39.js";import{c as de,a as _,d as le,g as re,u as ne,b as c}from"./array-a5aedee5.js";import{v as E,e as ue,a as ce}from"./runtime-dom.esm-bundler-6e07ef74.js";const l=h=>(oe("data-v-8e7b96f9"),h=h(),se(),h),he={class:"mt-4"},me={key:0},pe={key:1},_e=l(()=>e("h4",{class:"text-gray-800 text-l font-semibold"},"Voucher Codes",-1)),ve=l(()=>e("hr",null,null,-1)),fe={class:"grid grid-cols-5 gap-2 mt-2"},ge={class:"font-semibold text-gray-800 flex justify-between items-center"},be={class:"text-sm text-gray-500 flex-grow text-right"},ye=["onClick"],xe=l(()=>e("h3",null,"Voucher Code Form",-1)),Ce={class:"grid grid-cols-2 gap-x-4 mb-4"},Ve={class:"block col-span-1 mb-2"},ke=l(()=>e("span",{class:"text-gray-700"},"Voucher Code",-1)),we={class:"block col-span-1 mb-2"},Ue=l(()=>e("span",{class:"text-gray-700"},"Usage Limit",-1)),Ae={class:"grid grid-cols-2 gap-x-4 mb-4"},Le={class:"block col-span-1 mb-2"},De=l(()=>e("span",{class:"text-gray-700"},"Is Active",-1)),Se=l(()=>e("hr",null,null,-1)),Ee=G({__name:"VoucherCodes",props:{voucherUid:String},setup(h){const r=h,I=U(()=>w(()=>import("./LoadingMessage-83976fce.js"),["assets/LoadingMessage-83976fce.js","assets/_plugin-vue_export-helper-3f67fb71.js"])),F=U(()=>w(()=>import("./SimpleModal-1f91868a.js"),["assets/SimpleModal-1f91868a.js","assets/_plugin-vue_export-helper-3f67fb71.js","assets/runtime-dom.esm-bundler-6e07ef74.js","assets/SimpleModal-f645a074.css"])),{withClientMutation:C}=z();let n=P();const{fetchingVoucherCodes:M}=H(n),R=W(()=>{const o=n.getVouchers,s=o?.findIndex(b=>b.uid===r.voucherUid);return s>-1?o[s]?.codes:[]});J(()=>n.fetchVoucherCodes(r.voucherUid)),K(()=>r.voucherUid,o=>{n.fetchVoucherCodes(r.voucherUid)});let d=Q(!1);const q=de({uid:_().nullable(),voucherUid:_().required(),code:_().required("Code is Required"),usageLimit:le().required("Usage Limit is Required"),used:_().nullable(),isActive:re().default(!0)}),{handleSubmit:B,errors:V,setFieldValue:a}=ne({validationSchema:q,initialValues:{isActive:!0,voucherUid:r.voucherUid}}),{value:O}=c("uid");c("voucherUid");const{value:v}=c("code"),{value:f}=c("usageLimit");c("used");const{value:g}=c("isActive"),k=B(o=>{o.uid||j(o),o.uid&&N(o)});let T=o=>{a("uid",o.uid),a("code",o.code),a("usageLimit",o.usageLimit),a("used",o.used),a("isActive",o.isActive),d.value=!0};const $=()=>{a("uid",void 0),a("voucherUid",r.voucherUid),a("code",void 0),a("usageLimit",void 0),a("used",void 0),a("isActive",!0),d.value=!0},j=o=>{delete o.uid,C(ie,{payload:o},"createVoucherCode").then(s=>n.addVoucherCode(s)).finally(()=>d.value=!1)},N=o=>{delete o.uid,delete o.used,C(ae,{uid:O?.value,payload:o},"updateVoucherCode").then(s=>n.updateVoucherCode(s)).finally(()=>d.value=!1)};return(o,s)=>{const b=X("font-awesome-icon");return u(),m(L,null,[e("div",he,[i(M)?(u(),m("div",me,[A(i(I),{message:"Fetching voucher codes ..."})])):(u(),m("section",pe,[e("div",{class:"flex justify-between"},[_e,e("button",{class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100",onClick:$}," Add Voucher Code ")]),ve,e("div",fe,[(u(!0),m(L,null,Y(i(R),t=>(u(),m("div",{key:t.uid,class:"col-span-1 bg-white rounded-sm shadow-sm hover:shadow-md duration-500 px-2 py-2"},[e("div",ge,[e("h5",null,y(t.code),1),e("div",be,y(t.used)+" of "+y(t.usageLimit),1),e("a",{class:"ml-2 pl-2 text-gray-400 border-l-2 border-l-gray-400",onClick:Ie=>i(T)(t)},[A(b,{class:"text-xs hover:text-gray-800",icon:"pen"})],8,ye)])]))),128))])]))]),i(d)?(u(),Z(i(F),{key:0,onClose:s[4]||(s[4]=t=>p(d)?d.value=!1:d=!1),contentWidth:"w-3/6"},{header:D(()=>[xe]),body:D(()=>[e("form",null,[e("div",Ce,[e("label",Ve,[ke,x(e("input",{class:S(["form-input mt-1 block w-full",{"border-red-500 animate-pulse":i(V).code}]),type:"text","onUpdate:modelValue":s[0]||(s[0]=t=>p(v)?v.value=t:null),placeholder:"Code ..."},null,2),[[E,i(v)]])]),e("label",we,[Ue,x(e("input",{class:S(["form-input mt-1 block w-full",{"border-red-500 animate-pulse":i(V).usageLimit}]),type:"number",min:"1","onUpdate:modelValue":s[1]||(s[1]=t=>p(f)?f.value=t:null)},null,2),[[E,i(f)]])])]),e("div",Ae,[e("label",Le,[De,x(e("input",{class:"form-checkbox ml-4",type:"checkbox","onUpdate:modelValue":s[2]||(s[2]=t=>p(g)?g.value=t:null),checked:""},null,512),[[ue,i(g)]])])]),Se,e("button",{type:"submit",class:"-mb-4 border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 mt-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline",onClick:s[3]||(s[3]=ce((...t)=>i(k)&&i(k)(...t),["prevent"]))}," Save Voucher ")])]),_:1})):ee("v-if",!0)],64)}}});const Oe=te(Ee,[["__scopeId","data-v-8e7b96f9"],["__file","/home/aurthurm/Development/felicity-lims/webapp/views/admin/billing/VoucherCodes.vue"]]);export{Oe as default};
