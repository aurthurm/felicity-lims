import{d as T,W as E,r as m,C,D as A,o as c,c as _,b as e,F as x,p as D,t as p,f as l,q as P,G as v,e as u,v as h,H as M,ad as I,w as V,i as F,x as L,j as N,_ as U,bR as B,bS as O,I as R,J as $,O as j,k as Y}from"./index-2a6c9271.js";const a=i=>(R("data-v-f73ce93d"),i=i(),$(),i),q={class:"container w-full my-4"},G=a(()=>e("hr",null,null,-1)),H=a(()=>e("hr",null,null,-1)),J={class:"overflow-x-auto mt-4"},W={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},z={class:"min-w-full"},K=a(()=>e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Sample Type"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Prefix"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Active"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1)),Q={class:"bg-white"},X={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"flex items-center"},ee={class:"text-sm leading-5 text-gray-800"},te={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},se={class:"text-sm leading-5 text-sky-800"},oe={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},le={class:"text-sm leading-5 text-sky-800"},ae={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},ne=["onClick"],re={action:"post",class:"p-1"},ie={class:"grid grid-cols-2 gap-x-4 mb-4"},de={class:"block col-span-1 mb-2"},ce=a(()=>e("span",{class:"text-gray-700"},"Sample Type Name",-1)),pe={class:"block col-span-1 mb-2"},ue=a(()=>e("span",{class:"text-gray-700"},"Prefix",-1)),be={class:"block col-span-2 mb-2"},me=a(()=>e("span",{class:"text-gray-700"},"Description",-1)),_e={for:"toggle",class:"text-xs text-gray-700 mr-4"},he={class:"relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"},ge=a(()=>e("label",{for:"toggle",class:"toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"},null,-1)),ye=a(()=>e("hr",null,null,-1)),fe=T({__name:"SampleTypes",setup(i){const w=N(()=>U(()=>import("./SimpleModal-0c0664c5.js"),["assets/SimpleModal-0c0664c5.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/SimpleModal-f645a074.css"])),d=E(),{withClientMutation:g}=j();let r=m(!1),y=m(""),o=C({});const b=m(!0);d.fetchSampleTypes();const k=A(()=>d.getSampleTypes);function f(n,t={}){b.value=n,r.value=!0,y.value=(n?"CREATE":"EDIT")+" SAMPLE TYPE",n?Object.assign(o,{}):Object.assign(o,{...t})}function S(){const n={name:o.name,abbr:o.abbr,description:o.description,active:o.active};b.value===!0&&g(B,{payload:n},"createSampleType").then(t=>d.addSampleType(t)),b.value===!1&&g(O,{uid:o.uid,payload:n},"updateSampleType").then(t=>d.updateSampleType(t)),r.value=!1}return(n,t)=>(c(),_(x,null,[e("div",q,[G,e("button",{onClick:t[0]||(t[0]=s=>f(!0)),class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Add Sample Type"),H,e("div",J,[e("div",W,[e("table",z,[K,e("tbody",Q,[(c(!0),_(x,null,D(k.value,s=>(c(),_("tr",{key:s?.uid},[e("td",X,[e("div",Z,[e("div",null,[e("div",ee,p(s?.name),1)])])]),e("td",te,[e("div",se,p(s?.abbr),1)]),e("td",oe,[e("div",le,p(s?.active),1)]),e("td",ae,[e("button",{onClick:xe=>f(!1,s),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,ne)])]))),128))])])])])]),l(r)?(c(),P(l(w),{key:0,onClose:t[6]||(t[6]=s=>F(r)?r.value=!1:r=!1)},{header:v(()=>[e("h3",null,p(l(y)),1)]),body:v(()=>[e("form",re,[e("div",ie,[e("label",de,[ce,u(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=s=>l(o).name=s),placeholder:"Name ..."},null,512),[[h,l(o).name]])]),e("label",pe,[ue,u(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[2]||(t[2]=s=>l(o).abbr=s),placeholder:"Prefix ..."},null,512),[[h,l(o).abbr]])]),e("label",be,[me,u(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[3]||(t[3]=s=>l(o).description=s),placeholder:"Description ..."},null,512),[[h,l(o).description]])]),e("label",_e,[M("Active "),e("div",he,[u(e("input",{type:"checkbox",name:"toggle",id:"toggle","onUpdate:modelValue":t[4]||(t[4]=s=>l(o).active=s),class:"toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"},null,512),[[I,l(o).active]]),ge])])]),ye,e("button",{type:"button",onClick:t[5]||(t[5]=V(s=>S(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):L("",!0)],64))}});const we=Y(fe,[["__scopeId","data-v-f73ce93d"],["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/admin/sample/SampleTypes.vue"]]);export{we as default};
