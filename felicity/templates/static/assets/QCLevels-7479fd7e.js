import{d as k,ab as Q,r as v,C as E,D,o as c,c as _,b as e,F as m,p as A,t as f,f as a,q as I,G as y,e as S,v as M,w as T,i as V,x as F,j as B,_ as O,I as $,J as j,bL as N,bM as R,O as q,k as P}from"./index-2a6c9271.js";const i=r=>($("data-v-89951d03"),r=r(),j(),r),U={class:"container w-full my-4"},G=i(()=>e("hr",null,null,-1)),J=i(()=>e("hr",null,null,-1)),z={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},K={class:"min-w-full"},W=i(()=>e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Level"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1)),X={class:"bg-white"},Y={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"flex items-center"},ee={class:"text-sm leading-5 text-gray-800"},te={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},se=["onClick"],oe={action:"post",class:"p-1"},le={class:"grid grid-cols-2 gap-x-4 mb-4"},ne={class:"block col-span-2 mb-2"},ae=i(()=>e("span",{class:"text-gray-700"},"QC Level",-1)),ie=i(()=>e("hr",null,null,-1)),re=k({__name:"QCLevels",setup(r){const g=B(()=>O(()=>import("./SimpleModal-0c0664c5.js"),["assets/SimpleModal-0c0664c5.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/SimpleModal-f645a074.css"])),d=Q(),{withClientMutation:p}=q();let n=v(!1),h=v(""),l=E({});const u=v(!0);d.fetchQCLevels();const x=D(()=>d.getQCLevels);function w(){p(N,{level:l.level},"createQcLevel").then(s=>d.addQcLevel(s))}function C(){p(R,{uid:l.uid,level:l.level},"updateQcLevel").then(s=>d.updateQcLevel(s))}function b(s,t={}){u.value=s,n.value=!0,h.value=(s?"CREATE":"EDIT")+" QC Level",s?Object.assign(l,{}):Object.assign(l,{...t})}function L(){u.value===!0&&w(),u.value===!1&&C(),n.value=!1}return(s,t)=>(c(),_(m,null,[e("div",U,[G,e("button",{onClick:t[0]||(t[0]=o=>b(!0)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add QC Level"),J,e("div",z,[e("div",H,[e("table",K,[W,e("tbody",X,[(c(!0),_(m,null,A(x.value,o=>(c(),_("tr",{key:o?.uid},[e("td",Y,[e("div",Z,[e("div",null,[e("div",ee,f(o?.level),1)])])]),e("td",te,[e("button",{onClick:de=>b(!1,o),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,se)])]))),128))])])])])]),a(n)?(c(),I(a(g),{key:0,onClose:t[3]||(t[3]=o=>V(n)?n.value=!1:n=!1)},{header:y(()=>[e("h3",null,f(a(h)),1)]),body:y(()=>[e("form",oe,[e("div",le,[e("label",ne,[ae,S(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=o=>a(l).level=o),placeholder:"Level/Name ..."},null,512),[[M,a(l).level]])])]),ie,e("button",{type:"button",onClick:t[2]||(t[2]=T(o=>L(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):F("",!0)],64))}});const ue=P(re,[["__scopeId","data-v-89951d03"],["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/admin/analyses/QCLevels.vue"]]);export{ue as default};
