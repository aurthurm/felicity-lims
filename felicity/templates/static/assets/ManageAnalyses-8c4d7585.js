import{d as Y,O as R,as as $,X as I,y as V,z as v,r as x,A as j,o as l,c as i,b as e,e as m,F as p,G as b,t as c,f as A,at as F,w as k,B as G,C,D as O,j as z,_ as K,S as T,b_ as X,b$ as q,N as H,k as J}from"./index-ab5e4518.js";const Q=e("hr",null,null,-1),W={action:"post",class:"mt-4"},Z={class:"flex justify-start items-center mr-4"},ee=e("span",{class:"text-gray-700"},"Analyses Template (Auto)",-1),te={class:"block mx-4"},se=e("option",null,null,-1),oe=["value"],ne=e("hr",{class:"mt-4 mb-2"},null,-1),ae={class:"font-bold"},le=e("hr",{class:"mb-4 mt-2"},null,-1),re={class:"col-span-2 overflow-y-scroll overscroll-contain max-h-[540px] bg-white"},ie={class:"w-full"},ce={class:"min-w-full"},de={class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},ue=["checked","onChange"],pe=e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},"Analysis",-1),ye=e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},"Keyword",-1),he=e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},"Description",-1),_e={class:"bg-white"},me={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-200"},be=["checked","onChange"],fe={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-200"},ge={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-200"},we={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-200"},ve=e("hr",null,null,-1),xe=Y({__name:"ManageAnalyses",emits:["changeTab"],setup(Ae,{emit:S}){const B=z(()=>K(()=>import("./FelAccordion-87f92b85.js"),["assets/FelAccordion-87f92b85.js","assets/index-ab5e4518.js","assets/index-571501ec.css"])),{withClientMutation:f}=H(),g=R(),d=$(),y=I(),M=V(()=>d.getAnalysesServices);v(()=>{d.fetchAnalysesTemplates(),d.fetchAnalysesServices({})});const E=S,w=t=>{E("changeTab",t)},h=x(),D=async()=>{try{T.fire({title:"Are you sure?",text:"You want to apply this template to add analyses?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, apply now!",cancelButtonText:"No, cancel apply!"}).then(t=>{t.isConfirmed&&f(X,{uid:g.params.sampleUid,analysisTemplateUid:h.value},"samplesApplyTemplate").then(s=>w("analysis-results"))})}catch{}},a=x([]);v(()=>{a.value=[...y.analysisResults?.map(t=>t.analysisUid)]});const _=t=>{a.value.includes(t)?a.value=a.value.filter(s=>s!==t):a.value=[...a.value,t]},u=t=>a.value.includes(t),U=t=>t.every(s=>u(s.uid)),L=t=>{t.every(s=>u(s.uid))?t.forEach(s=>_(s.uid)):t.forEach(s=>{u(s.uid)||_(s.uid)})},N=async()=>{const t=y.analysisResults?.filter(n=>!a.value.includes(n.analysisUid)).map(n=>n.uid),s=a.value.filter(n=>!y.analysisResults?.map(o=>o.analysisUid).includes(n));try{T.fire({title:"Are you sure?",text:"You want to apply these changes to the analyses?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, apply now!",cancelButtonText:"No, cancel apply!"}).then(n=>{n.isConfirmed&&f(q,{sampleUid:g.params.sampleUid,payload:{cancel:t,add:s}},"manageAnalyses").then(o=>w("analysis-results"))})}catch{}};return(t,s)=>{const n=j("motion-slide-right");return l(),i(p,null,[e("section",null,[Q,m((l(),i("form",W,[e("div",Z,[ee,e("label",te,[m(e("select",{class:"form-select block w-full py-1","onUpdate:modelValue":s[0]||(s[0]=o=>h.value=o)},[se,(l(!0),i(p,null,b(A(d).analysesTemplates,o=>(l(),i("option",{key:o.uid,value:o.uid},c(o.name),9,oe))),128))],512),[[F,h.value]])]),e("button",{type:"button",onClick:s[1]||(s[1]=k(o=>D(),["prevent"])),class:"border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Apply Template ")])])),[[n]])]),ne,e("h3",ae,"Manually Modify Analyses: ("+c(a.value?.length)+")",1),le,e("section",re,[e("div",ie,[(l(!0),i(p,null,b(M.value,(o,P)=>(l(),G(A(B),{key:P},{title:C(()=>[O(c(o[0]),1)]),body:C(()=>[e("table",ce,[e("thead",null,[e("tr",null,[e("th",de,[e("input",{type:"checkbox",class:"",checked:U(o[1]),onChange:r=>L(o[1])},null,40,ue)]),pe,ye,he])]),e("tbody",_e,[(l(!0),i(p,null,b(o[1],r=>m((l(),i("tr",{key:r?.uid},[e("td",me,[e("input",{type:"checkbox",class:"border-red-500",checked:u(r?.uid),onChange:ke=>_(r?.uid)},null,40,be)]),e("td",fe,c(r?.name),1),e("td",ge,c(r?.keyword),1),e("td",we,c(r?.description),1)])),[[n]])),128))])])]),_:2},1024))),128)),ve,e("button",{type:"button",onClick:s[2]||(s[2]=k(o=>N(),["prevent"])),class:"border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Apply Changes ")])])],64)}}}),Te=J(xe,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/sample/_id/ManageAnalyses.vue"]]);export{Te as default};
