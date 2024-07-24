import{d as M,as as U,L as N,ab as T,r as p,C as V,W as L,D as O,o as i,c as r,b as e,F as m,p as w,t as d,f as l,x as k,q as j,G as I,e as y,at as B,v as A,w as $,i as q,j as Y,_ as K,c8 as P,c9 as W,O as G,k as z}from"./index-03fd00e9.js";const H=e("hr",null,null,-1),J={class:"overflow-x-auto mt-4"},Q={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},X={class:"min-w-full"},Z=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Interim Key"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Result Value"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Intrument"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),ee={class:"bg-white"},te={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},se={class:"flex items-center"},oe={class:"text-sm leading-5 text-gray-800"},ne={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},le={class:"text-sm leading-5 text-sky-800"},ae={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ie={class:"text-sm leading-5 text-sky-800"},re={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},de=["onClick"],ue={action:"post",class:"p-1"},ce={class:"grid grid-cols-3 gap-x-4 mb-4"},pe={class:"block col-span-1 mb-2"},me=e("span",{class:"text-gray-700 w-4/12"},"Instrument",-1),ye={class:"w-full"},be=e("option",null,null,-1),_e=["value"],he={class:"block col-span-1 mb-2"},fe=e("span",{class:"text-gray-700"},"Interim",-1),ve={class:"block col-span-1 mb-2"},xe=e("span",{class:"text-gray-700"},"Result",-1),ge=e("hr",null,null,-1),we=M({__name:"InterimFields",props:{analysis:{type:Object,required:!0,default:()=>({})},analysisUid:{type:String,required:!0,default:0}},setup(S){const C=Y(()=>K(()=>import("./FelModal-78db0624.js"),["assets/FelModal-78db0624.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/FelModal-a7d23795.css"])),b=U(),_=N(),{withClientMutation:h}=G(),f=S,{analysis:v}=T(f);let a=p(!1),x=p(""),o=V({});const u=p(!0);L(()=>f.analysisUid,(n,t)=>{}),_.fetchInstruments();const c=O(()=>_.getInstruments);function E(){o.key=+o.key;const n={...o,analysisUid:v?.value?.uid};h(P,{payload:n},"createAnalysisInterim").then(t=>b.addAnalysisInterim(t))}function R(){const n={...o};delete n.uid,delete n.__typename,h(W,{uid:o.uid,payload:n},"updateAnalysisInterim").then(t=>b.updateAnalysisInterim(t))}function g(n,t={}){u.value=n,a.value=!0,x.value=(n?"CREATE":"EDIT")+" ANALYSIS INTERIM",n?Object.assign(o,{key:null,value:null}):Object.assign(o,{...t})}function D(){u.value===!0&&E(),u.value===!1&&R(),a.value=!1}const F=n=>{const t=c?.value?.findIndex(s=>s.uid===n);return c?.value[t]?.name||"unknown"};return(n,t)=>(i(),r(m,null,[e("button",{class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",onClick:t[0]||(t[0]=s=>g(!0))},"Add Interim Field"),H,e("div",J,[e("div",Q,[e("table",X,[Z,e("tbody",ee,[(i(!0),r(m,null,w(l(v)?.interims,s=>(i(),r("tr",{key:s?.uid},[e("td",te,[e("div",se,[e("div",null,[e("div",oe,d(s?.key),1)])])]),e("td",ne,[e("div",le,d(s?.value),1)]),e("td",ae,[e("div",ie,d(F(s?.instrumentUid)),1)]),e("td",re,[e("button",{onClick:ke=>g(!1,s),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,de)])]))),128))])])])]),k(" Result Options Form Modal "),l(a)?(i(),j(l(C),{key:0,onClose:t[5]||(t[5]=s=>q(a)?a.value=!1:a=!1),contentWidth:"w-2/4"},{header:I(()=>[e("h3",null,d(l(x)),1)]),body:I(()=>[e("form",ue,[e("div",ce,[e("label",pe,[me,e("div",ye,[y(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":t[1]||(t[1]=s=>l(o).instrumentUid=s)},[be,(i(!0),r(m,null,w(c.value,s=>(i(),r("option",{key:s?.uid,value:s.uid},d(s?.name),9,_e))),128))],512),[[B,l(o).instrumentUid]])])]),e("label",he,[fe,y(e("input",{type:"number",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[2]||(t[2]=s=>l(o).key=s),placeholder:"Interim Key ..."},null,512),[[A,l(o).key]])]),e("label",ve,[xe,y(e("input",{type:"text",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[3]||(t[3]=s=>l(o).value=s),placeholder:"Resut Value ..."},null,512),[[A,l(o).value]])])]),ge,e("button",{type:"button",onClick:t[4]||(t[4]=$(s=>D(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):k("v-if",!0)],64))}}),Ae=z(we,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/analyses/services/InterimFields.vue"]]);export{Ae as default};
