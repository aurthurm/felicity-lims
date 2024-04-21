import{d as I,ab as N,L as O,at as C,C as F,V as T,D as y,r as _,o as j,c as B,b as s,e as c,v as m,g as k,f as d,i as w,w as R,j as H,_ as L,O as P,k as K}from"./index-2a6c9271.js";import{k as q,l as z}from"./instrument.mutations-484b91f1.js";/* empty css                                                                 */const G={action:"post",class:"p-1"},J={class:"grid grid-cols-3 gap-x-4 mb-4"},Q={class:"block col-span-2 mb-2"},W=s("span",{class:"text-gray-700"},"Method Name",-1),X={class:"block col-span-1 mb-2"},Y=s("span",{class:"text-gray-700"},"keyword",-1),Z={class:"grid grid-cols-2 gap-x-4 mb-4"},$={class:"block col-span-2 mb-2"},ee=s("span",{class:"text-gray-700"},"Analyses",-1),se={class:"block col-span-2 mb-2"},te=s("span",{class:"text-gray-700"},"Instruments",-1),oe={class:"block col-span-2 mb-2"},ae=s("span",{class:"text-gray-700"},"Description",-1),le=s("hr",null,null,-1),ne=I({__name:"MethodForm",props:{method:Object,methodUid:Number,analysis:Object,analysisUid:Number},emits:["close"],setup(g,{emit:M}){const p=H(()=>L(()=>import("./vue-multiselect.esm-82622b05.js"),["assets/vue-multiselect.esm-82622b05.js","assets/index-2a6c9271.js","assets/index-88806377.css"])),x=N(),u=O(),{withClientMutation:h}=P(),b=g,{method:i,analysis:r}=C(b),t=F({...i?.value});T(()=>b.analysisUid,(o,e)=>{});const v=M,f=y(()=>x.getAnalysesServicesSimple);let l=_([]);r?.value?.uid!==void 0?l.value.push(r.value):f.value?.forEach(o=>{o?.methods?.some(e=>e.uid==i?.value?.uid)&&l.value.push(o)}),u.fetchInstruments();const V=y(()=>u.getInstruments);let n=_([]);const D=()=>{const o=[];return i?.value?.instruments?.forEach(e=>{r?.value?.instruments?.some(S=>S?.uid===e?.uid)&&o.push(e)}),o};n.value=D(),i?.value?.uid!==void 0&&i?.value?.instruments?.forEach(o=>n.value.push(o));function A(){const o={name:t?.name,keyword:t?.keyword,description:t?.description,instruments:n.value?.map(e=>e.uid),analyses:l.value?.map(e=>e.uid)};h(q,{payload:o},"createMethod").then(e=>{v("close"),u.addMethod(e)})}function E(){const o={name:t?.name,keyword:t?.keyword,description:t?.description,instruments:n.value?.map(e=>e.uid),analyses:l.value?.map(e=>e.uid)};h(z,{uid:t?.uid,payload:o},"updateMethod").then(e=>{v("close"),u.updateMethod(e)})}function U(){i?.value?.uid||A(),i?.value?.uid&&E()}return(o,e)=>(j(),B("form",G,[s("div",J,[s("label",Q,[W,c(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[0]||(e[0]=a=>t.name=a),placeholder:"Name ..."},null,512),[[m,t.name]])]),s("label",X,[Y,c(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":e[1]||(e[1]=a=>t.keyword=a),placeholder:"Keyword ..."},null,512),[[m,t.keyword]])])]),s("div",Z,[s("label",$,[ee,k(d(p),{modelValue:d(l),"onUpdate:modelValue":e[2]||(e[2]=a=>w(l)?l.value=a:l=a),options:f.value,multiple:!0,searchable:!0,label:"name","track-by":"uid",disabled:d(r)?.uid!=null},null,8,["modelValue","options","disabled"])]),s("label",se,[te,k(d(p),{modelValue:d(n),"onUpdate:modelValue":e[3]||(e[3]=a=>w(n)?n.value=a:n=a),options:V.value,multiple:!0,searchable:!0,label:"name","track-by":"uid"},null,8,["modelValue","options"])]),s("label",oe,[ae,c(s("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":e[4]||(e[4]=a=>t.description=a),placeholder:"Description ..."},null,512),[[m,t.description]])])]),le,s("button",{type:"button",onClick:e[5]||(e[5]=R(a=>U(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")]))}}),re=K(ne,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/admin/instruments/MethodForm.vue"]]);export{re as default};
