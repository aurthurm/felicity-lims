import{d as _,aq as l,x as s,j as e,o as c,c as p,g as d,f as m,_ as t,k as u}from"./index-6a324368.js";const h={class:"col-span-12"},f=_({__name:"WorkSheetDetail",setup(k){const a=e(()=>t(()=>import("./FelTabs-d766dadc.js"),["assets/FelTabs-d766dadc.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/FelTabs-e0c91a0a.css"]));let o=l();const i=s(()=>o.workSheet?.uid||""),n=s(()=>o.workSheet?.state!=="pending"),r=[{id:"detail",label:"detail",component:e(()=>t(()=>import("./WorkSheetResults-4d955222.js"),["assets/WorkSheetResults-4d955222.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/analysis-6bc83d40.js","assets/worksheet-e59c78d0.js","assets/constants-94a3697a.js"]))},{id:"assign-samples",label:"assign-samples",component:e(()=>t(()=>import("./WorkSheetAssign-ae93348b.js"),["assets/WorkSheetAssign-ae93348b.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/constants-94a3697a.js"])),hidden:n.value},{id:"logs",label:"logs",component:e(()=>t(()=>import("./FelAuditLog-c011c07b.js"),["assets/FelAuditLog-c011c07b.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),props:{targetType:"worksheet",targetUid:i?.value}}];return(g,v)=>(c(),p("section",h,[d(m(a),{tabs:r,"initial-tab":"default"})]))}}),E=u(f,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/worksheet/_id/WorkSheetDetail.vue"]]);export{E as default};
