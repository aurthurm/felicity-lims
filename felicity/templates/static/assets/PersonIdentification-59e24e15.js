import{d as I,A as k,r as c,C,D,o as l,c as u,b as e,F as _,p as A,t as h,f as a,q as E,G as b,e as N,v as T,w as F,i as O,x as P,j as M,_ as S,O as B,k as R}from"./index-2a6c9271.js";import{a as V,b as $}from"./patient.mutations-07df35b4.js";const j={class:"container w-full my-4"},U=e("hr",null,null,-1),L=e("hr",null,null,-1),q={class:"overflow-x-auto mt-4"},G={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},z={class:"min-w-full"},H=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Name"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),J={class:"bg-white"},K={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Q={class:"flex items-center"},W={class:"text-sm leading-5 text-gray-800"},X={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},Y=["onClick"],Z={action:"post",class:"p-1"},ee={class:"grid grid-cols-2 gap-x-4 mb-4"},te={class:"flex items-center gap-x-4 whitespace-nowrap col-span-2 mb-2"},oe=e("span",{class:"text-gray-700"},"Indentication Name",-1),se=e("hr",null,null,-1),ne=I({__name:"PersonIdentification",setup(ie){const v=M(()=>S(()=>import("./SimpleModal-0c0664c5.js"),["assets/SimpleModal-0c0664c5.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/SimpleModal-f645a074.css"])),r=k(),{withClientMutation:f}=B();let i=c(!1),m=c(""),n=C({});const d=c(!0);r.fetchIdentifications();function x(){f(V,{name:n.name},"createIdentification").then(o=>r.addIdentification(o))}function y(){f($,{uid:n.uid,name:n.name},"updateIdentification").then(o=>r.updateIdentification(o))}function p(o,t={}){d.value=o,i.value=!0,m.value=(o?"CREATE":"EDIT")+" PERSON IDENTIFICATION",o?Object.assign(n,{}):Object.assign(n,{...t})}function g(){d.value===!0&&x(),d.value===!1&&y(),i.value=!1}const w=D(()=>r.getIdentifications);return(o,t)=>(l(),u(_,null,[e("div",j,[U,e("button",{onClick:t[0]||(t[0]=s=>p(!0)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add Identification"),L,e("div",q,[e("div",G,[e("table",z,[H,e("tbody",J,[(l(!0),u(_,null,A(w.value,s=>(l(),u("tr",{key:s?.uid},[e("td",K,[e("div",Q,[e("div",null,[e("div",W,h(s?.name),1)])])]),e("td",X,[e("button",{onClick:ae=>p(!1,s),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,Y)])]))),128))])])])])]),a(i)?(l(),E(a(v),{key:0,onClose:t[3]||(t[3]=s=>O(i)?i.value=!1:i=!1)},{header:b(()=>[e("h3",null,h(a(m)),1)]),body:b(()=>[e("form",Z,[e("div",ee,[e("label",te,[oe,N(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=s=>a(n).name=s),placeholder:"Name ..."},null,512),[[T,a(n).name]])])]),se,e("button",{type:"button",onClick:t[2]||(t[2]=F(s=>g(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):P("",!0)],64))}}),de=R(ne,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/admin/patient/PersonIdentification.vue"]]);export{de as default};
