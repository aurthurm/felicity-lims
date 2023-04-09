import{d as T,bv as q,bw as E,q as R,x as A,U as w,c as L,al as P,b as $,e as W,B as j,o as n,g as i,h as e,F as v,z as b,D as z,j as t,t as r,y as h,w as J,i as C,R as O,C as G,l as H,bx as K,by as Q,_ as X}from"./index-8125dc25.js";import{u as Y}from"./samples-c45a4fcd.js";const Z=e("h4",null,"Store Samples",-1),M={class:"grid grid-cols-12 gap-4 min-h-full bg-white"},ee={className:"col-span-2 pt-4 pl-4 bg-sky-200"},se={className:"col-span-7 pt-4"},te={class:"mb-2"},oe={key:0},ae={class:"grid grid-cols-2 mt-2"},ne={class:"col-span-1"},le={class:"flex"},ie=e("span",{class:"text-gray-600 text-md font-bold w-52"},"Name:",-1),re={class:"text-gray-600 text-md"},ce={class:"flex"},de=e("span",{class:"text-gray-600 text-md font-bold w-52"},"Layout:",-1),me={class:"text-gray-600 text-md"},pe={key:0,class:"ml-2 text-gray-600 text-md italic bg-slate-400 px-1 rounded-sm"},ue={class:"col-span-1"},_e={class:"flex"},he=e("span",{class:"text-gray-600 text-md font-bold w-52"},"Slots:",-1),ge={class:"text-gray-600 text-md"},ve={class:"flex mt-2"},fe=e("span",{class:"text-gray-600 text-md font-bold w-52"},"Empty Slots:",-1),Se={class:"text-gray-600 text-md mr-2"},be={key:1},ye=e("hr",null,null,-1),xe=e("div",{class:"grid grid-cols-12 mb-4"},[e("div",{class:"col-span-1 font-semibold"},"Position"),e("div",{class:"col-span-1 font-semibold"},"Label"),e("div",{class:"col-span-10 font-semibold"},"Sample")],-1),we=e("div",{class:"col-span-12 mb-2"},[e("hr")],-1),Ce={class:"col-span-1"},Ue={class:"col-span-1"},ke={class:"col-span-10"},Ne=["onUpdate:modelValue"],De=["value"],Ie=["onClick"],Ve=e("hr",{class:"mt-8"},null,-1),Be={key:0,type:"submit",class:"px-2 py-1 mt-4 border-orange-600 border text-orange-600 rounded-sm transition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"},Fe=e("div",{className:"col-span-3 p-2"},null,-1),Te=T({__name:"StoreSamples",setup(qe){const{treeData:U,tags:f,activeTree:g,resetActiveTree:k}=q();k();const u=E(),{storeSamples:N}=Y();let _=JSON.parse(window.history.state.samples),p=[];const D=a=>{p=[],m.value.forEach(s=>{s.sampleUid&&p.push(s.sampleUid?.toString())})};R(()=>u.fetchStorageTree()),A(()=>g.value,(a,s)=>{a.tag==="storage-container"&&(u.fetchStorageContainer(a.uid),m.value=[])},{deep:!0});const l=w(()=>u.getStorageContainer),I=w(()=>{const a=u.getStorageContainer;return(a?.slots??0)-(a?.storedCount??0)}),y=()=>{_=[..._,...l.value?.samples??[]],m.value=[],K(l.value?.cols??1,l.value?.rows??1,!l.value?.grid,l.value?.rowWise??!1).map(s=>({...s,storageContainerUid:l.value?.uid})).forEach(s=>{const c=_.filter(o=>o.storageSlotIndex===s.storageSlotIndex&&o.storageContainerUid===s.storageContainerUid);c.length>0&&(console.log(c,s),s={...s,sampleUid:c[0].uid},p.push(s.sampleUid.toString())),m.value.push({sampleUid:void 0,...s})})},V=L({samples:P().required().min(1,"Select At least one sample")}),{handleSubmit:B,errors:Ee}=$({validationSchema:V,initialValues:{priority:0,samples:l.value?.samples??[]}}),{value:m}=W("samples"),F=a=>{m.value=m.value.map(s=>(s.sampleUid===a&&(s={...s,sampleUid:void 0}),s)),p=p.filter(s=>+s!==a)},x=B(async a=>{const s=a.samples.filter(c=>c.sampleUid);await N(s).then(async c=>{await u.fetchStorageContainer(s[0].storageContainerUid),y()})});return(a,s)=>{const c=j("font-awesome-icon");return n(),i(v,null,[Z,e("div",M,[e("div",ee,[e("ul",null,[(n(!0),i(v,null,b(t(U),(o,S)=>(n(),z(Q,{tree:o,key:S},null,8,["tree"]))),128))])]),e("div",se,[e("div",te,[t(g).tag===t(f).storageContainer?(n(),i("div",oe,[e("div",ae,[e("div",ne,[e("div",le,[ie,e("span",re,r(t(l)?.name),1)]),e("div",ce,[de,e("span",me,r(t(l)?.grid?"grid":"column"),1),t(l)?.grid?(n(),i("span",pe,r(t(l)?.rowWise?"by-row":"by-column"),1)):h("v-if",!0)])]),e("div",ue,[e("div",_e,[he,e("span",ge,r(t(l)?.slots),1)]),e("div",ve,[fe,e("span",Se,r(t(I)),1)])])])])):(n(),i("div",be,"Please select a storage container"))]),ye,t(g).tag===t(f).storageContainer?(n(),i("button",{key:0,class:"border border-sky-800 bg-sky-800 text-white rounded-sm mt-2 px-4 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline",onClick:s[0]||(s[0]=o=>y())}," Reset Slots ")):h("v-if",!0),e("form",{action:"post",class:"p-4 mb-8 bg-white",onSubmit:s[1]||(s[1]=J((...o)=>t(x)&&t(x)(...o),["prevent"]))},[xe,(n(!0),i(v,null,b(t(m),(o,S)=>(n(),i("div",{class:"mt-2 grid grid-cols-12",key:S},[we,e("div",Ce,r(o.storageSlotIndex),1),e("div",Ue,r(o.storageSlot),1),e("label",ke,[C(e("select",{name:"sampleUid",id:"sampleUid","onUpdate:modelValue":d=>o.sampleUid=d,class:"form-input w-64 h-6 p-0",onChange:D},[(n(!0),i(v,null,b(t(_),d=>C((n(),i("option",{key:d.uid,value:d.uid},r(d?.sampleId)+" ❲"+r(d?.analysisRequest?.clientRequestId)+"❳ ",9,De)),[[G,!t(p).includes(d.uid.toString())]])),128))],40,Ne),[[O,o.sampleUid]]),o.sampleUid?(n(),i("span",{key:0,class:"ml-2 text-red-500",onClick:d=>F(o.sampleUid)},[H(c,{icon:"ban"})],8,Ie)):h("v-if",!0)])]))),128)),Ve,t(g).tag===t(f).storageContainer&&t(_)?.length>0?(n(),i("button",Be," Store Samples ")):h("v-if",!0)],32),h("  ")]),Fe])],64)}}}),Le=X(Te,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/sample/StoreSamples.vue"]]);export{Le as default};
