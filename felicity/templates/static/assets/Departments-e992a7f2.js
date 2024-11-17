import{d as x,K as w,r as d,q as D,x as k,o as i,c as u,b as e,F as b,E,t as h,f as r,A,B as f,e as C,v as T,w as M,i as N,D as B,j as F,_ as P,bK as R,bL as S,M as j,k as O}from"./index-6a324368.js";const V={class:"container w-full my-4"},$=e("hr",null,null,-1),L=e("hr",null,null,-1),U={class:"overflow-x-auto mt-4"},I={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},K={class:"min-w-full"},q=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Name"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),z={class:"bg-white"},G={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},H={class:"flex items-center"},J={class:"text-sm leading-5 text-gray-800"},Q={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},W=["onClick"],X={action:"post",class:"p-1"},Y={class:"grid grid-cols-2 gap-x-4 mb-4"},Z={class:"block col-span-2 mb-2"},ee=e("span",{class:"text-gray-700"},"Department Name",-1),te=e("hr",null,null,-1),se=x({__name:"Departments",setup(oe){const v=F(()=>P(()=>import("./FelModal-ad52dd5c.js"),["assets/FelModal-ad52dd5c.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/FelModal-780aeea9.css"])),l=w(),{withClientMutation:c}=j();let a=d(!1),m=d(""),n=D({});const p=d(!0);l.fetchDepartments({});const y=k(()=>l.getDepartments);function _(s,t){p.value=s,a.value=!0,m.value=(s?"CREATE":"EDIT")+" Department",s?Object.assign(n,{...new Object}):Object.assign(n,{...t})}function g(){p.value===!0?c(R,{payload:{name:n.name}},"createDepartment").then(s=>l.addDepartment(s)):c(S,{uid:n.uid,payload:{name:n.name}},"updateDepartment").then(s=>l.updateDepartment(s)),a.value=!1}return(s,t)=>(i(),u(b,null,[e("div",V,[$,e("button",{onClick:t[0]||(t[0]=o=>_(!0,null)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add Department"),L,e("div",U,[e("div",I,[e("table",K,[q,e("tbody",z,[(i(!0),u(b,null,E(y.value,o=>(i(),u("tr",{key:o?.uid},[e("td",G,[e("div",H,[e("div",null,[e("div",J,h(o?.name),1)])])]),e("td",Q,[e("button",{onClick:ne=>_(!1,o),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,W)])]))),128))])])])])]),r(a)?(i(),A(r(v),{key:0,onClose:t[3]||(t[3]=o=>N(a)?a.value=!1:a=!1)},{header:f(()=>[e("h3",null,h(r(m)),1)]),body:f(()=>[e("form",X,[e("div",Y,[e("label",Z,[ee,C(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=o=>r(n).name=o),placeholder:"Name ..."},null,512),[[T,r(n).name]])])]),te,e("button",{type:"button",onClick:t[2]||(t[2]=M(o=>g(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):B("",!0)],64))}}),re=O(se,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/laboratory/Departments.vue"]]);export{re as default};
