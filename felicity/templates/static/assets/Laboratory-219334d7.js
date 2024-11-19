import{d as B,aK as D,K as M,x as h,q as v,V as x,r as L,o as b,B as O,C as R,c as m,b as s,e as n,f as a,v as d,F as E,E as I,t as U,as as F,A as g,w as V,P as S,at as r,j,_ as q,bH as K,bI as Q,ap as W,M as Y,k as $}from"./index-4d0d48ab.js";const G={key:0},H=s("h2",{class:"text-lg font-semibold text-gray-700"},"Laboratory Information",-1),z=s("hr",{class:"my-4"},null,-1),J={class:"grid grid-cols-2 gap-x-4"},X={class:"block col-span-1 mb-2"},Z=s("span",{class:"text-gray-700"},"Laboratory Name",-1),ss=["disabled"],ls={class:"block col-span-1 mb-2"},es=s("span",{class:"text-gray-700"},"Tag Line",-1),ts=["disabled"],os={class:"block col-span-1 mb-2"},as=s("span",{class:"text-gray-700"},"Lab Manager",-1),ns={class:"w-full"},is=["disabled"],ds=s("option",null,null,-1),cs=["value"],rs={class:"block col-span-1 mb-2"},us=s("span",{class:"text-gray-700"},"Laboratory Email",-1),bs=["disabled"],ps={class:"block col-span-1 mb-2"},ms=s("span",{class:"text-gray-700"},"CC Emails",-1),_s=["disabled"],ys={class:"block col-span-1 mb-2"},hs=s("span",{class:"text-gray-700"},"Lab Mobile Phone",-1),gs=["disabled"],fs={class:"block col-span-1 mb-2"},ks=s("span",{class:"text-gray-700"},"Lab Bunsiness Phone",-1),ws=["disabled"],vs={class:"block col-span-1 mb-2"},xs=s("span",{class:"text-gray-700"},"Address",-1),Ls=["disabled"],Us={class:"block col-span-1 mb-2"},Vs=s("span",{class:"text-gray-700"},"Banking Details",-1),Ss=["disabled"],As={class:"block col-span-1 mb-2"},Ts=s("span",{class:"text-gray-700"},"Quality Statemnt",-1),Ns=["disabled"],Cs=s("hr",{class:"my-4"},null,-1),Ps={key:1},Bs=s("h2",{class:"text-lg font-semibold text-gray-700"},"Other Settings",-1),Ds=s("hr",{class:"my-4"},null,-1),Ms={class:"grid grid-cols-2 gap-x-4"},Os={class:"block col-span-1 mb-2"},Rs=s("span",{class:"text-gray-700"},"Default Landing Page",-1),Es=["disabled"],Is={class:"block col-span-1 mb-2"},Fs=s("span",{class:"text-gray-700"},"Default Theme",-1),js=["disabled"],qs={class:"block col-span-1 mb-2"},Ks=s("span",{class:"text-gray-700"},"Password Lifetime (days)",-1),Qs=["disabled"],Ws={class:"block col-span-1 mb-2"},Ys=s("span",{class:"text-gray-700"},"Inactivity Auto Logout (minutes)",-1),$s=["disabled"],Gs={class:"block col-span-1 mb-2"},Hs=s("span",{class:"text-gray-700 ml-3"},"Default Sticker copies",-1),zs=["disabled"],Js=s("span",{class:"block col-span-1 mb-2"},null,-1),Xs={class:"block col-span-1 mb-2"},Zs=["disabled"],sl=s("span",{class:"text-gray-700 ml-3"},"Allow self verificaion",-1),ll={class:"block col-span-1 mb-2"},el=["disabled"],tl=s("span",{class:"text-gray-700 ml-3"},"Allow patient registration",-1),ol={class:"block col-span-1 mb-2"},al=["disabled"],nl=s("span",{class:"text-gray-700 ml-3"},"Allow sample registration",-1),il={class:"block col-span-1 mb-2"},dl=["disabled"],cl=s("span",{class:"text-gray-700 ml-3"},"Allow worksheet creation",-1),rl={class:"block col-span-1 mb-2"},ul=["disabled"],bl=s("span",{class:"text-gray-700 ml-3"},"Auto receive samples",-1),pl=s("span",{class:"block col-span-1 mb-2"},null,-1),ml=s("hr",{class:"my-4"},null,-1),_l={class:"grid grid-cols-2 gap-x-4"},yl={class:"block col-span-1 mb-2"},hl=["disabled"],gl=s("span",{class:"text-gray-700 ml-3"},"Enable Sample Billing",-1),fl={class:"block col-span-1 mb-2"},kl=["disabled"],wl=s("span",{class:"text-gray-700 ml-3"},"Allow automatic billing on sample registration",-1),vl={class:"block col-span-1 mb-2"},xl=s("span",{class:"text-gray-700 ml-3"},"Currency",-1),Ll=["disabled"],Ul={class:"block col-span-1 mb-2"},Vl=s("span",{class:"text-gray-700 ml-3"},"Payment Terms (Days)",-1),Sl=["disabled"],Al=s("hr",{class:"my-4"},null,-1),Tl=B({__name:"Laboratory",setup(Nl){const A=j(()=>q(()=>import("./FelTabsAside-8ccfd485.js"),["assets/FelTabsAside-8ccfd485.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),{toastSuccess:f}=W(),k=D(),u=M();u.fetchLaboratory();const _=h(()=>u.getLaboratory),i=v({..._.value});x(()=>_.value?.uid,(c,l)=>Object.assign(i,_.value));const{withClientMutation:w}=Y();let o=L(!1);const T=()=>{o.value=!0;const c={...i};delete c.uid,delete c.__typename,c.labManagerUid=c.labManagerUid,w(K,{uid:i.uid,payload:c},"updateLaboratory").then(l=>{u.updateLaboratory(l),o.value=!1,f("Laboratory information updated")})};u.fetchLaboratorySetting();const y=h(()=>u.getLaboratorySetting),t=v({...y.value});x(()=>y.value?.uid,(c,l)=>Object.assign(t,y.value));const N=()=>{o.value=!0;const c={...t};delete c.uid,delete c.__typename,w(Q,{uid:t.uid,payload:c},"updateLaboratorySetting").then(l=>{u.updateLaboratorySetting(l),o.value=!1,f("Laboratory settings updated")})};k.fetchUsers({});const C=h(()=>k.getUsers),p=L("general-info"),P=[{id:"general-info",label:"Information",icon:"fas fa-chart-bar"},{id:"other-settings",label:"Other",icon:"fas fa-user-clock"}];return(c,l)=>(b(),O(a(A),{title:"Settings",items:P,modelValue:p.value,"onUpdate:modelValue":l[26]||(l[26]=e=>p.value=e)},{default:R(()=>[p.value==="general-info"?(b(),m("section",G,[H,z,s("form",null,[s("div",J,[s("label",X,[Z,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[0]||(l[0]=e=>i.labName=e),placeholder:"Name ...",disabled:a(o)},null,8,ss),[[d,i.labName]])]),s("label",ls,[es,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[1]||(l[1]=e=>i.tagLine=e),placeholder:"Tag Line ...",disabled:a(o)},null,8,ts),[[d,i.tagLine]])]),s("label",os,[as,s("div",ns,[n(s("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":l[2]||(l[2]=e=>i.labManagerUid=e),disabled:a(o)},[ds,(b(!0),m(E,null,I(C.value,e=>(b(),m("option",{key:e?.uid,value:e.uid},U(e?.firstName)+" "+U(e?.lastName),9,cs))),128))],8,is),[[F,i.labManagerUid]])])]),s("label",rs,[us,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[3]||(l[3]=e=>i.email=e),placeholder:"Name ...",disabled:a(o)},null,8,bs),[[d,i.email]])]),s("label",ps,[ms,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[4]||(l[4]=e=>i.emailCc=e),placeholder:"Name ...",disabled:a(o)},null,8,_s),[[d,i.emailCc]])]),s("label",ys,[hs,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[5]||(l[5]=e=>i.mobilePhone=e),placeholder:"Name ...",disabled:a(o)},null,8,gs),[[d,i.mobilePhone]])]),s("label",fs,[ks,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[6]||(l[6]=e=>i.businessPhone=e),placeholder:"Name ...",disabled:a(o)},null,8,ws),[[d,i.businessPhone]])]),s("label",vs,[xs,n(s("textarea",{cols:"3",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[7]||(l[7]=e=>i.address=e),placeholder:"Address ...",disabled:a(o)},null,8,Ls),[[d,i.address]])]),s("label",Us,[Vs,n(s("textarea",{cols:"3",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[8]||(l[8]=e=>i.banking=e),placeholder:"Banking ...",disabled:a(o)},null,8,Ss),[[d,i.banking]])]),s("label",As,[Ts,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[9]||(l[9]=e=>i.qualityStatement=e),placeholder:"Quality Statemnt ...",disabled:a(o)},null,8,Ns),[[d,i.qualityStatement]])]),g(` <label class="block col-span-1 mb-2">\r
            <span class="text-gray-700">Laboratory Logo</span>\r
            <input\r
              class="form-input mt-1 block w-full"\r
              v-model="formLaboratory.logo"\r
              placeholder="Name ..."\r
              :disabled="processing"\r
            />\r
          </label> `)]),Cs,n(s("button",{type:"button",onClick:l[10]||(l[10]=V(e=>T(),["prevent"])),class:"w-2/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Update ",512),[[S,!a(o)]])])])):g("v-if",!0),p.value==="other-settings"?(b(),m("section",Ps,[Bs,Ds,s("form",null,[s("div",Ms,[s("label",Os,[Rs,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[11]||(l[11]=e=>t.defaultRoute=e),placeholder:"Name ...",disabled:a(o)},null,8,Es),[[d,t.defaultRoute]])]),s("label",Is,[Fs,n(s("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l[12]||(l[12]=e=>t.defaultTheme=e),placeholder:"Name ...",disabled:a(o)},null,8,js),[[d,t.defaultTheme]])]),s("label",qs,[Ks,n(s("input",{type:"number",min:"0",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[13]||(l[13]=e=>t.passwordLifetime=e),placeholder:"Name ...",disabled:a(o)},null,8,Qs),[[d,t.passwordLifetime]])]),s("label",Ws,[Ys,n(s("input",{type:"number",min:"0",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[14]||(l[14]=e=>t.inactivityLogOut=e),placeholder:"Name ...",disabled:a(o)},null,8,$s),[[d,t.inactivityLogOut]])]),s("label",Gs,[Hs,n(s("input",{type:"number",min:"0",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[15]||(l[15]=e=>t.stickerCopies=e),placeholder:"Name ...",disabled:a(o)},null,8,zs),[[d,t.stickerCopies]])]),Js,s("label",Xs,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[16]||(l[16]=e=>t.allowSelfVerification=e),disabled:a(o)},null,8,Zs),[[r,t.allowSelfVerification]]),sl]),s("label",ll,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[17]||(l[17]=e=>t.allowPatientRegistration=e),disabled:a(o)},null,8,el),[[r,t.allowPatientRegistration]]),tl]),s("label",ol,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[18]||(l[18]=e=>t.allowSampleRegistration=e),disabled:a(o)},null,8,al),[[r,t.allowSampleRegistration]]),nl]),s("label",il,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[19]||(l[19]=e=>t.allowWorksheetCreation=e),disabled:a(o)},null,8,dl),[[r,t.allowWorksheetCreation]]),cl]),s("label",rl,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[20]||(l[20]=e=>t.autoReceiveSamples=e),disabled:a(o)},null,8,ul),[[r,t.autoReceiveSamples]]),bl]),pl]),ml,s("div",_l,[s("label",yl,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[21]||(l[21]=e=>t.allowBilling=e),disabled:a(o)},null,8,hl),[[r,t.allowBilling]]),gl]),s("label",fl,[n(s("input",{type:"checkbox",class:"","onUpdate:modelValue":l[22]||(l[22]=e=>t.allowAutoBilling=e),disabled:a(o)},null,8,kl),[[r,t.allowAutoBilling]]),wl]),s("label",vl,[xl,n(s("input",{type:"text",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[23]||(l[23]=e=>t.currency=e),disabled:a(o)},null,8,Ll),[[d,t.currency]])]),s("label",Ul,[Vl,n(s("input",{type:"number",min:"0",class:"form-input mt-1 block w-full","onUpdate:modelValue":l[24]||(l[24]=e=>t.paymentTermsDays=e),disabled:a(o)},null,8,Sl),[[d,t.paymentTermsDays]])])]),Al,n(s("button",{type:"button",onClick:l[25]||(l[25]=V(e=>N(),["prevent"])),class:"mb-4 w-2/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Update ",512),[[S,!a(o)]])])])):g("v-if",!0)]),_:1},8,["modelValue"]))}}),Pl=$(Tl,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/laboratory/Laboratory.vue"]]);export{Pl as default};
