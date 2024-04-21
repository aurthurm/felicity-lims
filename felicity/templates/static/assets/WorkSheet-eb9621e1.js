import{d as _,ah as m,aa as r,D as h,z as x,n as p,o as a,c as n,e as u,b as s,t as e,g as v,k as g}from"./index-2a6c9271.js";const f={class:""},w={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 py-4"},y={class:"grid grid-cols-12 gap-1"},k={class:"col-span-12 flex justify-between font-bold text-medium mb-2"},b={type:"button",class:"bg-sky-800 text-white px-2 py-1 rounded-sm leading-none"},S={class:"col-span-12 sm:col-end-13 px-3 sm:px-0"},D=s("hr",null,null,-1),W={class:"grid grid-cols-2 mt-2"},B={class:"col-span-1"},C={class:"flex"},N=s("span",{class:"text-gray-800 text-sm font-semibold w-1/6"},"Analyst",-1),A={class:"text-gray-600 text-sm md:text-md"},I={class:"flex"},U=s("span",{class:"text-gray-800 text-md font-semibold w-1/6"},"Instrument:",-1),V={class:"text-gray-600 text-sm md:text-md"},j={class:"flex"},z=s("span",{class:"text-gray-800 text-sm font-semibold w-1/6"},"Method:",-1),E={class:"text-gray-600 text-sm md:text-md"},M={class:"col-span-1"},R={class:"flex"},T=s("span",{class:"text-gray-800 text-sm font-semibold w-1/6"},"Analyses:",-1),q={class:"text-gray-600 text-sm md:text-md"},F={class:"flex"},G=s("span",{class:"text-gray-800 text-sm font-semibold w-1/6"},"Samples:",-1),H={class:"text-gray-600 text-sm md:text-md"},J={class:"flex"},K=s("span",{class:"text-gray-800 text-sm font-semibold w-1/6"},"Template:",-1),L={class:"text-gray-600 text-sm md:text-md"},O=_({__name:"WorkSheet",setup(P){const d=m(),o=r();o.fetchWorksheetByUid(d.params?.workSheetUid);const t=h(()=>o.getWorkSheet);return(c,Q)=>{const i=x("router-view"),l=p("motion-slide-top");return a(),n("div",f,[u((a(),n("div",w,[s("div",y,[s("div",k,[s("h3",null,e(t.value?.worksheetId),1),s("button",b,e(t.value?.state||"unknown"),1)]),s("div",S,[D,s("div",W,[s("div",B,[s("div",C,[N,s("span",A,e(t.value?.analyst?.firstName),1)]),s("div",I,[U,s("span",V,e(t.value?.instrument?.name),1)]),s("div",j,[z,s("span",E,e(t.value?.method?.name),1)])]),s("div",M,[s("div",R,[T,s("span",q,e(t.value?.analysis?.name),1)]),s("div",F,[G,s("span",H,e(t.value?.assignedCount),1)]),s("div",J,[K,s("span",L,e(t.value?.template?.name),1)])])])])])])),[[l]]),v(i)])}}}),Y=g(O,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/worksheet/_id/WorkSheet.vue"]]);export{Y as default};
