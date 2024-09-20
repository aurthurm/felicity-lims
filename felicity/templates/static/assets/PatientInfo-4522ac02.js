import{d as k,P as C,A as j,s as D,z as x,n as I,e as l,o as i,c as a,f as e,g as d,x as n,b as t,t as o,aH as S,E as p,G as N,F as A,p as E,j as M,_ as R,k as T}from"./index-8a5660e7.js";import{h as B,o as O,a as U}from"./constants-4e81a61d.js";const V={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"},F={key:0,class:"py-4 text-center"},L={key:1,class:"grid grid-cols-12 gap-3"},Y={class:"sm:col-span-2 text-center hidden sm:block"},z={class:"inline-block font-bold text-medium mb-2"},G={class:"flex flex-col items-center justify-center mx-auto py-2 w-4/5 2lg:w-3/5 rounded-sm bg-sky-800"},H={class:"inline-block font-semibold text-white text-sm lg:text-md"},$={class:"inline-block font-bold text-2xl text-white my-2"},q=t("div",{class:"inline-block font-semibold text-white text-sm lg:text-md"}," Yrs Old ",-1),J={class:"col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0"},K={class:"flex justify-between sm:text-sm md:text-md lg:text-lg"},Q={class:"font-bold text-gray-800"},W={class:"font-medium text-md"},X=t("hr",null,null,-1),Z={class:"grid grid-cols-3 gap-x-8 mt-2"},tt={class:"col-span-1"},et=t("h1",{class:"uppercase text-sm font-semibold"},"patient Origin",-1),st=t("hr",{class:"my-1"},null,-1),ot={class:"flex justify-between items-center mt-2"},nt=t("span",{class:"text-gray-800 text-sm font-semibold"},"Country",-1),it={class:"text-gray-600 text-sm md:text-md"},at={class:"flex justify-between items-center mt-2"},ct=t("span",{class:"text-gray-800 text-sm font-semibold"},"District:",-1),dt={class:"text-gray-600 text-sm md:text-md"},lt={class:"flex justify-between items-center mt-2"},mt=t("span",{class:"text-gray-800 text-sm font-semibold"},"Province: ",-1),rt={class:"text-gray-600 text-sm md:text-md"},_t={class:"col-span-1"},xt=t("h1",{class:"uppercase text-sm font-semibold"},"Primary Referrer",-1),pt=t("hr",{class:"my-1"},null,-1),ht={class:"flex justify-between items-center mt-2"},ft=t("span",{class:"text-gray-800 text-sm font-semibold"},"Client",-1),ut={class:"text-gray-600 text-sm md:text-md"},yt={class:"flex justify-between items-center mt-2"},gt=t("span",{class:"text-gray-800 text-sm font-semibold"},"District:",-1),bt={class:"text-gray-600 text-sm md:text-md"},vt={class:"flex justify-between items-center mt-2"},wt=t("span",{class:"text-gray-800 text-sm font-semibold"},"Province: ",-1),Pt={class:"text-gray-600 text-sm md:text-md"},kt={class:"col-span-1 mr-2"},Ct={class:"flex justify-between items-center mt-2"},jt=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Client Patient ID: ",-1),Dt={class:"text-gray-600 text-sm md:text-md"},It={class:"flex justify-between items-center mt-2"},St=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Mobile: ",-1),Nt={class:"text-gray-600 text-sm md:text-md"},At={class:"flex justify-between items-center mt-2"},Et=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Consent SMS: ",-1),Mt={class:"text-gray-600 text-sm md:text-md"},Rt={class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},Tt={class:"text-gray-600 text-sm md:text-md"},Bt=k({__name:"PatientInfo",emits:["editPatient"],setup(Ot,{emit:h}){const f=M(()=>R(()=>import("./FelLoadingMessage-160ea06c.js"),["assets/FelLoadingMessage-160ea06c.js","assets/index-8a5660e7.js","assets/index-227a7d92.css"])),u=C(),y=j(),{patient:s,fetchingPatient:g}=D(y),b=h,v=m=>{b("editPatient",m)};return(m,r)=>{const _=x("font-awesome-icon"),w=x("router-link"),P=I("motion-slide-top");return l((i(),a("div",V,[e(g)?(i(),a("div",F,[d(e(f),{message:"Fetching patient details ..."})])):(i(),a("div",L,[n(" Meta Column "),t("div",Y,[t("div",z,o(e(s)?.patientId),1),n(" Age "),t("div",G,[t("div",H,o(e(s)?.gender),1),t("div",$,o(e(s)?.age),1),q])]),n(" Summary Column "),t("div",J,[t("div",K,[t("span",Q,o(e(s)?.firstName?.toUpperCase())+" "+o(e(s)?.lastName?.toUpperCase()),1),t("div",null,[t("span",W,o(e(S)(e(s)?.dateOfBirth,!1)),1),l(t("button",{onClick:r[0]||(r[0]=c=>v(e(s))),class:"p-1 ml-2 border-white border text-gray-500 text-md rounded-sm transition duration-300 hover:text-sky-800 focus:outline-none"},[d(_,{icon:"fa-edit"})],512),[[p,B(U.UPDATE,O.PATIENT)]]),l(d(w,{to:{name:"patient-detail",params:{patientUid:e(s)?.uid}},class:"p-1 ml-2 border-white border text-gray-500 rounded-sm transition duration-300 hover:text-sky-800 focus:outline-none"},{default:N(()=>[d(_,{icon:"fa-left-right"})]),_:1},8,["to"]),[[p,e(u).fullPath.includes("patients-compact")]])])]),X,t("div",Z,[t("div",tt,[et,st,n(" Client Details "),t("div",ot,[nt,t("span",it,o(e(s)?.country?.name),1)]),t("div",at,[ct,t("span",dt,o(e(s)?.district?.name),1)]),t("div",lt,[mt,t("span",rt,o(e(s)?.province?.name),1)])]),t("div",_t,[xt,pt,n(" Client Details "),t("div",ht,[ft,t("span",ut,o(e(s)?.client?.name),1)]),t("div",yt,[gt,t("span",bt,o(e(s)?.client?.district?.name),1)]),t("div",vt,[wt,t("span",Pt,o(e(s)?.client?.district?.province?.name),1)])]),t("div",kt,[n(" Identifiers "),t("div",Ct,[jt,t("span",Dt,o(e(s)?.clientPatientId),1)]),t("div",It,[St,t("span",Nt,o(e(s)?.phoneMobile),1)]),t("div",At,[Et,t("span",Mt,o(e(s)?.consentSms?"Yes":"No"),1)]),(i(!0),a(A,null,E(e(s)?.identifications,c=>(i(),a("div",{class:"flex justify-between items-center mt-2",key:c.uid},[t("span",Rt,o(c?.identification?.name)+": ",1),t("span",Tt,o(c?.value),1)]))),128))])])])]))])),[[P]])}}}),Ft=T(Bt,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/components/person/PatientInfo.vue"]]);export{Ft as default};
