import{d as T,as as N,L,r as p,C as M,D as f,o as i,c as r,b as e,F as m,p as g,t as c,x as v,f as a,q as O,G as x,e as y,v as w,at as F,w as R,i as V,j as Y,_ as B,bB as I,bC as G,O as $,k as j}from"./index-03fd00e9.js";const P={class:"container w-full my-4"},q=e("hr",null,null,-1),z=e("hr",null,null,-1),H={class:"overflow-x-auto mt-4"},J={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},K={class:"min-w-full"},Q=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Category Name"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Department"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),W={class:"bg-white"},X={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"flex items-center"},ee={class:"text-sm leading-5 text-gray-800"},te={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},se={class:"text-sm leading-5 text-sky-800"},oe={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},ae=["onClick"],ne={action:"post",class:"p-1"},le={class:"grid grid-cols-2 gap-x-4 mb-4"},ie={class:"block col-span-2 mb-2"},re=e("span",{class:"text-gray-700"},"Category Name",-1),de={class:"block col-span-1 mb-2"},ce=e("span",{class:"text-gray-700"},"Department",-1),ue=e("option",null,null,-1),pe=["value"],me={class:"block col-span-2 mb-2"},ye=e("span",{class:"text-gray-700"},"Description",-1),_e=e("hr",null,null,-1),be=T({__name:"AnalysesCategories",setup(he){const C=Y(()=>B(()=>import("./FelModal-78db0624.js"),["assets/FelModal-78db0624.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/FelModal-a7d23795.css"])),d=N(),k=L(),{withClientMutation:_}=$();let l=p(!1),b=p(""),s=M({});const u=p(!0),A=f(()=>k.getDepartments);d.fetchAnalysesCategories();const D=f(()=>d.getAnalysesCategories);function S(){const n={name:s.name,description:s.description,departmentUid:s.departmentUid,active:s.active};_(I,{payload:n},"createAnalysisCategory").then(t=>d.addAnalysisCategory(t))}function E(){const n={name:s.name,description:s.description,departmentUid:s.departmentUid,active:s.active};_(G,{uid:s.uid,payload:n},"updateAnalysisCategory").then(t=>d.updateAnalysisCategory(t))}function h(n,t){u.value=n,l.value=!0,b.value=(n?"CREATE":"EDIT")+" ANALYSES CATEGORY",n?Object.assign(s,{}):Object.assign(s,{...t})}function U(){u.value===!0&&S(),u.value===!1&&E(),l.value=!1}return(n,t)=>(i(),r(m,null,[e("div",P,[q,e("button",{onClick:t[0]||(t[0]=o=>h(!0,null)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add Analyses Category"),z,e("div",H,[e("div",J,[e("table",K,[Q,e("tbody",W,[(i(!0),r(m,null,g(D.value,o=>(i(),r("tr",{key:o?.uid},[e("td",X,[e("div",Z,[e("div",null,[e("div",ee,c(o?.name),1)])])]),e("td",te,[e("div",se,c(o?.department?.name),1)]),e("td",oe,[e("button",{onClick:fe=>h(!1,o),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,ae)])]))),128))])])])])]),v(" Location Edit Form Modal "),a(l)?(i(),O(a(C),{key:0,onClose:t[5]||(t[5]=o=>V(l)?l.value=!1:l=!1)},{header:x(()=>[e("h3",null,c(a(b)),1)]),body:x(()=>[e("form",ne,[e("div",le,[e("label",ie,[re,y(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=o=>a(s).name=o),placeholder:"Name ..."},null,512),[[w,a(s).name]])]),e("label",de,[ce,y(e("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":t[2]||(t[2]=o=>a(s).departmentUid=o)},[ue,(i(!0),r(m,null,g(A.value,o=>(i(),r("option",{key:o.uid,value:o?.uid},c(o.name),9,pe))),128))],512),[[F,a(s).departmentUid]])]),e("label",me,[ye,y(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[3]||(t[3]=o=>a(s).description=o),placeholder:"Description ..."},null,512),[[w,a(s).description]])])]),_e,e("button",{type:"button",onClick:t[4]||(t[4]=R(o=>U(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):v("v-if",!0)],64))}}),ve=j(be,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/analyses/AnalysesCategories.vue"]]);export{ve as default};
