import{d as w,ad as P,a2 as C,s as k,B as x,V as j,i as l,o as i,g as a,j as e,l as c,y as n,h as t,t as o,C as h,E as D,F as I,z as S,L as N,_ as B}from"./index-8125dc25.js";import{h as M,o as E,a as R}from"./constants-06e43bc1.js";const T={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"},U={key:0,class:"py-4 text-center"},V={key:1,class:"grid grid-cols-12 gap-3"},A={class:"sm:col-span-2 text-center hidden sm:block"},F={class:"inline-block font-bold text-medium mb-2"},L={class:"flex flex-col items-center justify-center mx-auto py-2 w-4/5 2lg:w-3/5 rounded-sm bg-sky-800"},O={class:"inline-block font-semibold text-white text-sm lg:text-md"},Y={class:"inline-block font-bold text-2xl text-white my-2"},z=t("div",{class:"inline-block font-semibold text-white text-sm lg:text-md"}," Yrs Old ",-1),$={class:"col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0"},q={class:"flex justify-between sm:text-sm md:text-md lg:text-lg"},G={class:"font-bold text-gray-800"},H={class:"font-medium text-md"},J=t("hr",null,null,-1),K={class:"grid grid-cols-3 gap-x-8 mt-2"},Q={class:"col-span-1"},W=t("h1",{class:"uppercase text-sm font-semibold"},"patient Origin",-1),X=t("hr",{class:"my-1"},null,-1),Z={class:"flex justify-between items-center mt-2"},tt=t("span",{class:"text-gray-800 text-sm font-semibold"},"Country",-1),et={class:"text-gray-600 text-sm md:text-md"},st={class:"flex justify-between items-center mt-2"},ot=t("span",{class:"text-gray-800 text-sm font-semibold"},"District:",-1),nt={class:"text-gray-600 text-sm md:text-md"},it={class:"flex justify-between items-center mt-2"},at=t("span",{class:"text-gray-800 text-sm font-semibold"},"Province: ",-1),ct={class:"text-gray-600 text-sm md:text-md"},dt={class:"col-span-1"},lt=t("h1",{class:"uppercase text-sm font-semibold"},"Primary Referrer",-1),mt=t("hr",{class:"my-1"},null,-1),rt={class:"flex justify-between items-center mt-2"},_t=t("span",{class:"text-gray-800 text-sm font-semibold"},"Client",-1),xt={class:"text-gray-600 text-sm md:text-md"},ht={class:"flex justify-between items-center mt-2"},pt=t("span",{class:"text-gray-800 text-sm font-semibold"},"District:",-1),ft={class:"text-gray-600 text-sm md:text-md"},ut={class:"flex justify-between items-center mt-2"},yt=t("span",{class:"text-gray-800 text-sm font-semibold"},"Province: ",-1),gt={class:"text-gray-600 text-sm md:text-md"},bt={class:"col-span-1 mr-2"},vt={class:"flex justify-between items-center mt-2"},wt=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Client Patient ID: ",-1),Pt={class:"text-gray-600 text-sm md:text-md"},Ct={class:"flex justify-between items-center mt-2"},kt=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Mobile: ",-1),jt={class:"text-gray-600 text-sm md:text-md"},Dt={class:"flex justify-between items-center mt-2"},It=t("span",{class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},"Consent SMS: ",-1),St={class:"text-gray-600 text-sm md:text-md"},Nt={class:"flex justify-between items-center mt-2"},Bt={class:"text-gray-800 whitespace-nowrap text-sm font-semibold"},Mt={class:"text-gray-600 text-sm md:text-md"},Et=w({__name:"PatientInfo",emits:["editPatient"],setup(Rt,{emit:p}){const f=P(),u=C(),{patient:s,fetchingPatient:y}=k(u),g=m=>{p("editPatient",m)};return(m,r)=>{const _=x("font-awesome-icon"),b=x("router-link"),v=j("motion-slide-top");return l((i(),a("div",T,[e(y)?(i(),a("div",U,[c(N,{message:"Fetching patient details ..."})])):(i(),a("div",V,[n(" Meta Column "),t("div",A,[t("div",F,o(e(s)?.patientId),1),n(" Age "),t("div",L,[t("div",O,o(e(s)?.gender),1),t("div",Y,o(e(s)?.age),1),z])]),n(" Summary Column "),t("div",$,[t("div",q,[t("span",G,o(e(s)?.firstName?.toUpperCase())+" "+o(e(s)?.lastName?.toUpperCase()),1),t("div",null,[t("span",H,o(e(s)?.dateOfBirth),1),l(t("button",{onClick:r[0]||(r[0]=d=>g(e(s))),class:"p-1 ml-2 border-white border text-gray-500 text-md rounded-sm transition duration-300 hover:text-sky-800 focus:outline-none"},[c(_,{icon:"fa-edit"})],512),[[h,M(R.UPDATE,E.PATIENT)]]),l(c(b,{to:{name:"patient-detail",params:{patientUid:e(s)?.uid}},class:"p-1 ml-2 border-white border text-gray-500 rounded-sm transition duration-300 hover:text-sky-800 focus:outline-none"},{default:D(()=>[c(_,{icon:"fa-left-right"})]),_:1},8,["to"]),[[h,e(f).fullPath.includes("patients-compact")]])])]),J,t("div",K,[t("div",Q,[W,X,n(" Client Details "),t("div",Z,[tt,t("span",et,o(e(s)?.country?.name),1)]),t("div",st,[ot,t("span",nt,o(e(s)?.district?.name),1)]),t("div",it,[at,t("span",ct,o(e(s)?.province?.name),1)])]),t("div",dt,[lt,mt,n(" Client Details "),t("div",rt,[_t,t("span",xt,o(e(s)?.client?.name),1)]),t("div",ht,[pt,t("span",ft,o(e(s)?.client?.district?.name),1)]),t("div",ut,[yt,t("span",gt,o(e(s)?.client?.district?.province?.name),1)])]),t("div",bt,[n(" Identifiers "),t("div",vt,[wt,t("span",Pt,o(e(s)?.clientPatientId),1)]),t("div",Ct,[kt,t("span",jt,o(e(s)?.phoneMobile),1)]),t("div",Dt,[It,t("span",St,o(e(s)?.consentSms?"Yes":"No"),1)]),(i(!0),a(I,null,S(e(s)?.identifications,d=>(i(),a("div",Nt,[t("span",Bt,o(d?.identification?.name)+": ",1),t("span",Mt,o(d?.value),1)]))),256))])])])]))])),[[v]])}}}),Vt=B(Et,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/patient/PatientInfo.vue"]]);export{Vt as P};
