import{d as u,p as v,u as b,s as f,y as n,j as e,o as h,c as E,b as r,e as D,Q as P,w as g,f as p,g as T,_ as t,k as y}from"./index-ab5e4518.js";import{h as A,o as R,a as k}from"./constants-b3336749.js";const w={class:"col-span-12"},V={class:"my-4"},x=u({__name:"PatientDetail",setup(I){const l=e(()=>t(()=>import("./FelTabs-3a4c6610.js"),["assets/FelTabs-3a4c6610.js","assets/index-ab5e4518.js","assets/index-571501ec.css","assets/FelTabs-e0c91a0a.css"])),_=v(),d=b(),{patient:a}=f(_);function c(o){d?.push({name:"samples-add",params:{patientUid:o?.uid??""}})}const s=n(()=>a?.value?.uid),m=n(()=>[{id:"samples",label:"samples",component:e(()=>t(()=>import("./FelAnalyisRequestListing-c9252fe0.js"),["assets/FelAnalyisRequestListing-c9252fe0.js","assets/index-ab5e4518.js","assets/index-571501ec.css"])),props:{target:"patient-samples",targetUid:s.value}},{id:"cases",label:"cases",component:e(()=>t(()=>import("./CaseTable-dad2a27e.js"),["assets/CaseTable-dad2a27e.js","assets/index-ab5e4518.js","assets/index-571501ec.css"])),hidden:!0},{id:"billing",label:"billing",component:e(()=>t(()=>import("./PatientBill-834ddceb.js"),["assets/PatientBill-834ddceb.js","assets/index-ab5e4518.js","assets/index-571501ec.css","assets/billing.mutations-22a108cc.js","assets/array-5e69348d.js","assets/PatientBill-7bdbff76.css"])),props:{patientUid:s.value}},{id:"logs",label:"logs",component:e(()=>t(()=>import("./FelAuditLog-5b4f7111.js"),["assets/FelAuditLog-5b4f7111.js","assets/index-ab5e4518.js","assets/index-571501ec.css"])),props:{targetType:"patient",targetUid:s.value}}]);return(o,i)=>(h(),E("section",w,[r("section",V,[D(r("button",{class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",onClick:i[0]||(i[0]=g(U=>c(p(a)),["prevent"]))}," Add Sample ",512),[[P,A(k.UPDATE,R.PATIENT)]])]),T(p(l),{tabs:m.value,"initial-tab":"samples"},null,8,["tabs"])]))}}),S=y(x,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/patient/_id/PatientDetail.vue"]]);export{S as default};
