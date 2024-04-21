import{d as f,u as h,r as v,a as x,o as n,c as i,b as e,w as y,e as b,v as w,f as t,i as C,t as g,g as k,h as I,j as L,_ as S,k as B}from"./index-2a6c9271.js";import{c as F,a as M,u as N,b as V}from"./array-52a0b0d0.js";const D={class:"flex justify-center items-center h-screen bg-sky-800 px-6"},j={class:"p-6 max-w-sm w-full bg-white shadow-md rounded-sm"},R=I('<div class="flex justify-center items-center"><svg class="h-10 w-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z" fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z" fill="white"></path></svg><span class="text-gray-700 font-semibold text-2xl">Install Felicity LIMS</span></div>',1),E={class:"block"},q=e("span",{class:"text-gray-700 text-sm"},"Laboratory Name",-1),A=["disabled"],O={class:"text-orange-600 w-4/12"},P={class:"mt-6"},T={key:0,type:"submit",class:"py-2 px-4 text-center bg-sky-800 rounded-sm w-full text-white text-sm hover:bg-sky-800"},Z={key:1,class:"text-center"},G=f({__name:"Install",setup(U){const d=L(()=>S(()=>import("./LoadingMessage-72d34fcf.js"),["assets/LoadingMessage-72d34fcf.js","assets/index-2a6c9271.js","assets/index-88806377.css"])),u=h(),a=v(!1),m=F({name:M().required("Laboratory Name is Required")}),{handleSubmit:p,errors:_}=N({validationSchema:m,initialValues:{name:"Felicity Labs"}}),{value:o}=V("name"),r=p(c=>{a.value=!0,x.post("setup/installation",c).then(s=>{s.data.installed&&u.push({name:"LOGIN"})}).finally(()=>a.value=!1)});return(c,s)=>(n(),i("div",D,[e("div",j,[R,e("form",{class:"mt-4",onSubmit:s[1]||(s[1]=y((...l)=>t(r)&&t(r)(...l),["prevent"]))},[e("label",E,[q,b(e("input",{type:"text",class:"form-input mt-1 block w-full rounded-sm focus:border-sky-800","onUpdate:modelValue":s[0]||(s[0]=l=>C(o)?o.value=l:null),disabled:a.value},null,8,A),[[w,t(o)]]),e("div",O,g(t(_).name),1)]),e("div",P,[a.value?(n(),i("div",Z,[k(t(d),{message:"Installing felicity lims ..."})])):(n(),i("button",T," Install "))])],32)])]))}}),H=B(G,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/install/Install.vue"]]);export{H as default};
