import{d as I,as as M,X as N,D as F,ab as L,r as y,C as P,W as j,o as i,c as r,b as e,F as m,p as v,t as d,f as a,x,q as B,G as w,e as k,v as T,H as $,g as q,w as W,i as G,j as O,_ as R,c6 as H,c7 as X,O as z,k as J}from"./index-03fd00e9.js";const Q=e("hr",null,null,-1),Y={class:"overflow-x-auto mt-4"},Z={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},ee={class:"min-w-full"},te=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Result Key"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Result Value"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Sample Tyes"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),se={class:"bg-white"},oe={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},le={class:"flex items-center"},ae={class:"text-sm leading-5 text-gray-800"},ne={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ie={class:"text-sm leading-5 text-sky-800"},re={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},de={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},ue=["onClick"],pe={action:"post",class:"p-1"},ce={class:"grid grid-cols-3 gap-x-4 mb-4"},ye={class:"block col-span-1 mb-2"},me=e("span",{class:"text-gray-700"},"Result Key",-1),be={class:"block col-span-2 mb-2"},_e=e("span",{class:"text-gray-700"},"Result Value",-1),he={class:"block col-span-3 mb-2"},fe=e("span",{class:"text-gray-700"},"Sample Types",-1),ge=e("hr",null,null,-1),ve=I({__name:"ResultOptions",props:{analysis:{type:Object,required:!0,default:()=>({})},analysisUid:{type:String,required:!0,default:0}},setup(V){const S=O(()=>R(()=>import("./FelModal-78db0624.js"),["assets/FelModal-78db0624.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/FelModal-a7d23795.css"])),E=O(()=>R(()=>import("./vue-multiselect.esm-37364f6f.js"),["assets/vue-multiselect.esm-37364f6f.js","assets/index-03fd00e9.js","assets/index-91994633.css"])),b=M(),C=N(),{withClientMutation:_}=z(),D=F(()=>C.getSampleTypes),h=V,{analysis:u}=L(h);let n=y(!1),f=y(""),s=P({});const p=y(!0);j(()=>h.analysisUid,(l,t)=>{});function U(){s.optionKey=+s.optionKey;const l={...s,analysisUid:u?.value?.uid,sampleTypes:s.sampleTypes?.map(t=>t.uid)};_(H,{payload:l},"createResultOption").then(t=>b.addResultOption(t))}function A(){const l={...s,analysisUid:u?.value?.uid,sampleTypes:s.sampleTypes?.map(t=>t.uid)};delete l.__typename,delete l.uid,_(X,{uid:s.uid,payload:l},"updateResultOption").then(t=>b.updateResultOption(t))}function g(l,t={}){p.value=l,n.value=!0,f.value=(l?"CREATE":"EDIT")+" RESULT OPTION",l?Object.assign(s,{optionKey:null,value:null}):Object.assign(s,{...t})}function K(){p.value===!0&&U(),p.value===!1&&A(),n.value=!1}return(l,t)=>(i(),r(m,null,[e("button",{class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",onClick:t[0]||(t[0]=o=>g(!0))},"Add Result Option"),Q,e("div",Y,[e("div",Z,[e("table",ee,[te,e("tbody",se,[(i(!0),r(m,null,v(a(u)?.resultOptions,o=>(i(),r("tr",{key:o?.uid},[e("td",oe,[e("div",le,[e("div",null,[e("div",ae,d(o?.optionKey),1)])])]),e("td",ne,[e("div",ie,d(o?.value),1)]),e("td",re,[(i(!0),r(m,null,v(o?.sampleTypes,c=>(i(),r("span",{class:"p-1 rounded-sm text-sm leading-5 text-sky-800 bg-gray-200 mr-2",key:c.uid},d(c.name),1))),128))]),e("td",de,[e("button",{onClick:c=>g(!1,o),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,ue)])]))),128))])])])]),x(" Result Options Form Modal "),a(n)?(i(),B(a(S),{key:0,onClose:t[5]||(t[5]=o=>G(n)?n.value=!1:n=!1),contentWidth:"w-2/4"},{header:w(()=>[e("h3",null,d(a(f)),1)]),body:w(()=>[e("form",pe,[e("div",ce,[e("label",ye,[me,k(e("input",{type:"number",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=o=>a(s).optionKey=o),placeholder:"Key ..."},null,512),[[T,a(s).optionKey]])]),e("label",be,[_e,k(e("input",{type:"text",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[2]||(t[2]=o=>a(s).value=o),placeholder:"Value ..."},null,512),[[T,a(s).value]])]),$(),e("label",he,[fe,q(a(E),{modelValue:a(s).sampleTypes,"onUpdate:modelValue":t[3]||(t[3]=o=>a(s).sampleTypes=o),options:D.value,multiple:!0,searchable:!0,label:"name","track-by":"uid"},null,8,["modelValue","options"])])]),ge,e("button",{type:"button",onClick:t[4]||(t[4]=W(o=>K(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):x("v-if",!0)],64))}}),we=J(ve,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/analyses/services/ResultOptions.vue"]]);export{we as default};
