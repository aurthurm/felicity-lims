import{d as I,L,r as u,C as P,D as A,o as p,c as _,b as e,F as v,p as F,t as m,x as y,f as n,q as M,G as g,e as x,v as w,w as R,i as T,j as U,_ as V,I as B,J as N,O,k as $}from"./index-8a5660e7.js";import{g as j,h as q}from"./instrument.mutations-c61103e0.js";const r=a=>(B("data-v-33160deb"),a=a(),N(),a),G={class:"container w-full my-4"},J=r(()=>e("hr",null,null,-1)),z=r(()=>e("hr",null,null,-1)),H={class:"overflow-x-auto mt-4"},K={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},Q={class:"min-w-full"},W=r(()=>e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Supplier"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Description"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1)),X={class:"bg-white"},Y={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"flex items-center"},ee={class:"text-sm leading-5 text-gray-800"},te={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},se={class:"text-sm leading-5 text-sky-800"},oe={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},ie=["onClick"],ne={action:"post",class:"p-1"},le={class:"grid grid-cols-2 gap-x-4 mb-4"},re={class:"block col-span-1 mb-2"},ae=r(()=>e("span",{class:"text-gray-700"},"Name",-1)),de={class:"block col-span-2 mb-2"},pe=r(()=>e("span",{class:"text-gray-700"},"Description",-1)),ce=r(()=>e("hr",null,null,-1)),ue=I({__name:"SuppliersListing",setup(a){const k=U(()=>V(()=>import("./FelModal-bb055ee6.js"),["assets/FelModal-bb055ee6.js","assets/index-8a5660e7.js","assets/index-227a7d92.css","assets/FelModal-a7d23795.css"])),d=L(),{withClientMutation:b}=O();let l=u(!1),h=u(""),s=P({});const c=u(!0);d.fetchSuppliers();const S=A(()=>d.getSuppliers);function D(){const i={name:s.name,description:s.description};b(j,{payload:i},"createSupplier").then(t=>d.addSupplier(t))}function C(){const i={name:s.name,description:s.description};b(q,{uid:s.uid,payload:i},"updateSupplier").then(t=>d.updateSupplier(t))}function f(i,t={}){c.value=i,l.value=!0,h.value=(i?"CREATE":"EDIT")+" SUPPLIER",i?Object.assign(s,{}):Object.assign(s,{...t})}function E(){c.value===!0&&D(),c.value===!1&&C(),l.value=!1}return(i,t)=>(p(),_(v,null,[e("div",G,[J,e("button",{onClick:t[0]||(t[0]=o=>f(!0)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add Supplier"),z,e("div",H,[e("div",K,[e("table",Q,[W,e("tbody",X,[(p(!0),_(v,null,F(S.value,o=>(p(),_("tr",{key:o?.uid},[e("td",Y,[e("div",Z,[e("div",null,[e("div",ee,m(o?.name),1)])])]),e("td",te,[e("div",se,m(o?.description),1)]),e("td",oe,[e("button",{onClick:_e=>f(!1,o),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,ie)])]))),128))])])])])]),y(" Location Edit Form Modal "),n(l)?(p(),M(n(k),{key:0,onClose:t[4]||(t[4]=o=>T(l)?l.value=!1:l=!1)},{header:g(()=>[e("h3",null,m(n(h)),1)]),body:g(()=>[e("form",ne,[e("div",le,[e("label",re,[ae,x(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=o=>n(s).name=o),placeholder:"Name ..."},null,512),[[w,n(s).name]])]),e("label",de,[pe,x(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[2]||(t[2]=o=>n(s).description=o),placeholder:"Description ..."},null,512),[[w,n(s).description]])])]),ce,e("button",{type:"button",onClick:t[3]||(t[3]=R(o=>E(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):y("v-if",!0)],64))}});const he=$(ue,[["__scopeId","data-v-33160deb"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/suppliers/SuppliersListing.vue"]]);export{he as default};
