import{d as P,l as T,s as V,r as y,C as D,D as F,o as r,c as a,b as e,f as s,w as p,e as b,v,y as c,g as f,F as g,x as w,H as h,t as S,h as B,j as M,_ as j,k as N}from"./index-03fd00e9.js";const E={class:"flex justify-center items-center h-screen bg-sky-800 px-6"},L={class:"p-6 max-w-sm w-full bg-white shadow-md rounded-sm"},U=B('<div class="flex justify-center items-center"><svg class="h-10 w-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z" fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z" fill="white"></path></svg><span class="text-gray-700 font-semibold text-2xl">FelicityLIMS</span></div>',1),q={key:0},A={class:"block mt-3"},I=e("span",{class:"text-gray-700 text-sm"},"Email",-1),$=["disabled"],H={class:"flex justify-between items-center mt-4"},Z={class:"mt-6"},z=["disabled"],O=e("span",null,"Request Password Reset",-1),G=[O],J={key:1,class:"text-center"},K={class:"block mt-3"},Q=e("span",{class:"text-gray-700 text-sm"},"Reset Token",-1),W=["disabled"],X={class:"mt-6"},Y=["disabled"],ee=e("span",null,"Submit token",-1),se=[ee],te={key:1,class:"text-center"},oe={class:"mt-2"},re={class:"bg-blue-100"},ae={class:"block mt-3"},de=e("span",{class:"text-gray-700 text-sm"},"Password",-1),ne=["disabled"],le={class:"block mt-3"},ie=e("span",{class:"text-gray-700 text-sm"},"Password Confirmation",-1),ce=["disabled"],ue={class:"mt-6"},me=["disabled"],pe=e("span",null,"Reset Password",-1),be=[pe],ve={key:1,class:"text-center"},_e=P({__name:"PasswordReset",emits:["forgot"],setup(fe,{emit:k}){const _=M(()=>j(()=>import("./FelLoadingMessage-6ca9c805.js"),["assets/FelLoadingMessage-6ca9c805.js","assets/index-03fd00e9.js","assets/index-91994633.css"])),x=k,u=T(),{auth:o}=V(u),l=y(""),i=y(""),C=()=>{o.value.receivedToken?u.validatePasswordResetToken(i.value):u.resetPasswordRequest(l.value)},d=D({password:"",passwordc:""}),m=F(()=>!(!d.password||!d.passwordc||d.password!==d.passwordc)),R=()=>{m||alert("Correct Form errrs"),u.resetPassword(d.password,d.passwordc)};return(ye,t)=>(r(),a("div",E,[e("div",L,[U,s(o).resetData?.canReset?(r(),a(g,{key:1},[w(" Passowrd reset "),e("form",{class:"mt-4",onSubmit:p(R,["prevent"])},[e("p",oe,[h("Hie "),e("span",re,"@"+S(s(o)?.resetData?.username),1),h(". Change your password")]),e("label",ae,[de,b(e("input",{type:"password",class:c(["form-input mt-1 block w-full rounded-sm focus:border-sky-800",{"border-red-500 focus:border-red-500":!m.value}]),"onUpdate:modelValue":t[5]||(t[5]=n=>d.password=n),disabled:s(o).processing},null,10,ne),[[v,d.password]])]),e("label",le,[ie,b(e("input",{type:"password",class:c(["form-input mt-1 block w-full rounded-sm focus:border-sky-800",{"border-red-500 focus:border-red-500":!m.value}]),"onUpdate:modelValue":t[6]||(t[6]=n=>d.passwordc=n),disabled:s(o).processing},null,10,ce),[[v,d.passwordc]])]),e("div",ue,[s(o).processing?(r(),a("div",ve,[f(s(_),{message:"Resetting password ..."})])):(r(),a("button",{key:0,type:"submit",class:c(["py-2 px-4 text-center  rounded-sm w-full text-white text-sm ",{"bg-gray-500":!m.value,"bg-sky-800 hover:bg-sky-600":m.value}]),disabled:!m.value},[...be],10,me))])],32)],2112)):(r(),a("form",{key:0,class:"mt-4",onSubmit:p(C,["prevent"])},[s(o).receivedToken?(r(),a(g,{key:1},[w(" Token "),e("div",null,[e("label",K,[e("div",null,[e("a",{class:"px-2 py-1 border rounded-sm border-gray-300 text-gray-500 text-xs font-semibold hover:bg-gray-600 hover:border-none hover:text-gray-100",onClick:t[3]||(t[3]=p(n=>s(u).setReceivedResetToken(!1),["prevent"]))},"← Token not received")]),Q,b(e("input",{type:"text",class:c(["form-input mt-1 block w-full rounded-sm focus:border-sky-800",{"border-red-500 focus:border-red-500":!i.value}]),"onUpdate:modelValue":t[4]||(t[4]=n=>i.value=n),disabled:s(o).processing},null,10,W),[[v,i.value]])]),e("div",X,[s(o).processing?(r(),a("div",te,[f(s(_),{message:"Validating password reset token ..."})])):(r(),a("button",{key:0,type:"submit",class:c(["py-2 px-4 text-center  rounded-sm w-full text-white text-sm ",{"bg-gray-500":!i.value,"bg-sky-800 hover:bg-sky-600":i.value}]),disabled:!i.value},[...se],10,Y))])])],2112)):(r(),a("div",q,[e("label",A,[e("div",null,[e("a",{class:"px-2 py-1 border rounded-sm border-gray-300 text-gray-500 text-xs font-semibold hover:bg-gray-600 hover:border-none hover:text-gray-100",onClick:t[0]||(t[0]=p(n=>x("forgot"),["prevent"]))},"← Back to Login")]),I,b(e("input",{type:"email",class:c(["form-input mt-1 block w-full rounded-sm focus:border-sky-800",{"border-red-500 focus:border-red-500":!l.value}]),"onUpdate:modelValue":t[1]||(t[1]=n=>l.value=n),disabled:s(o).processing},null,10,$),[[v,l.value]])]),e("div",H,[e("div",null,[e("a",{class:"block text-sm fontme text-indigo-700 hover:underline",onClick:t[2]||(t[2]=p(n=>s(u).setReceivedResetToken(!0),["prevent"]))},"Received a Token?")])]),e("div",Z,[s(o).processing?(r(),a("div",J,[f(s(_),{message:"Requesting ..."})])):(r(),a("button",{key:0,type:"submit",class:c(["py-2 px-4 text-center  rounded-sm w-full text-white text-sm ",{"bg-gray-500":!l.value,"bg-sky-800 hover:bg-sky-600":l.value}]),disabled:!l.value},[...G],10,z))])]))],32))])]))}}),we=N(_e,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/auth/PasswordReset.vue"]]);export{we as default};
