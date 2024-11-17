import{d as v,r as h,y,a5 as g,k as _,o as u,A as b,B as m,c as k,b as o,g as w,aF as f,I as x,w as C,aD as r,C as $,G as S,H as B}from"./index-6a324368.js";const M=v({name:"enhanced-modal",props:{contentWidth:String},emits:["close","after-leave"],setup(e,{emit:t}){const a=h(null),i=d=>{const p=d.target;a.value?.contains(p)||t("close")},l=d=>{d.key==="Escape"&&t("close")},c=()=>{document.body.style.overflow="hidden"},s=()=>{document.body.style.overflow=""};return y(()=>{document.addEventListener("keydown",l),c()}),g(()=>{document.removeEventListener("keydown",l),s()}),{modalRef:a,handleOutsideClick:i}}});const n=e=>(S("data-v-05372a21"),e=e(),B(),e),j={class:"min-h-screen px-4 flex items-center justify-center"},D={class:"p-6"},E={class:"flex items-center justify-between mb-4"},I={class:"flex-1"},L=n(()=>o("h3",{class:"text-lg font-semibold text-gray-900"}," Default Header ",-1)),N=n(()=>o("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[o("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"})],-1)),V=[N],F=n(()=>o("div",{class:"h-px bg-gray-200 my-4"},null,-1)),O={class:"modal-body"},W=n(()=>o("div",{class:"h-px bg-gray-200 my-4"},null,-1)),z={class:"modal-footer"},A={class:"flex justify-end space-x-3"};function H(e,t,a,i,l,c){return u(),b(f,{appear:"",name:"modal",onAfterLeave:t[4]||(t[4]=s=>e.$emit("after-leave"))},{default:m(()=>[(u(),k("div",{key:0,class:"modal-mask fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm",onClick:t[3]||(t[3]=(...s)=>e.handleOutsideClick&&e.handleOutsideClick(...s)),role:"dialog","aria-modal":"true"},[o("div",j,[w(f,{name:"modal-inner",appear:""},{default:m(()=>[o("div",{class:x(["modal-container bg-white rounded-lg shadow-xl transform","max-h-[90vh] overflow-y-auto",e.contentWidth?e.contentWidth:"w-full max-w-2xl"]),onClick:t[2]||(t[2]=C(()=>{},["stop"])),ref:"modalRef"},[o("div",D,[o("div",E,[o("div",I,[r(e.$slots,"header",{},()=>[L],!0)]),o("button",{onClick:t[0]||(t[0]=s=>e.$emit("close")),class:"inline-flex items-center justify-center w-8 h-8 ml-4 text-gray-400 transition-colors duration-200 rounded-full hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500","aria-label":"Close modal"},[...V])]),F,o("div",O,[r(e.$slots,"body",{},()=>[$(" Default body content ")],!0)]),W,o("div",z,[r(e.$slots,"footer",{},()=>[o("div",A,[o("button",{class:"px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",onClick:t[1]||(t[1]=s=>e.$emit("close"))}," Cancel ")])],!0)])])],2)]),_:3})])]))]),_:3})}const T=_(M,[["render",H],["__scopeId","data-v-05372a21"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/components/ui/FelModal.vue"]]);export{T as default};
