import{d,k as p,o as a,c as s,b as r,t as n,e as m,as as c,F as f,E as b}from"./index-4d0d48ab.js";const y=d({name:"GenericSelect",props:{label:{type:String,required:!0},name:{type:String,required:!0},modelValue:{type:[String,Number,null],required:!0},options:{type:Array,required:!0},disabled:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e,{emit:t}){return{updateValue:o=>{t("update:modelValue",o)}}}}),_={class:"flex justify-between items-center"},V={class:"text-gray-700 mr-2"},S=["name","disabled"],v=["value"];function g(e,t,u,o,h,k){return a(),s("label",_,[r("span",V,n(e.label),1),m(r("select",{name:e.name,"onUpdate:modelValue":t[0]||(t[0]=l=>e.modelValue=l),class:"form-input mt-1 block w-full py-1 disabled:opacity-50",disabled:e.disabled},[(a(!0),s(f,null,b(e.options,(l,i)=>(a(),s("option",{key:i,value:l.value},n(l.label),9,v))),128))],8,S),[[c,e.modelValue]])])}const w=p(y,[["render",g],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/components/ui/select/FelSelect.vue"]]);export{w as default};
