import{d as Re,aq as Ce,K as Se,aK as Ve,N as Ee,u as Ae,r as p,x as De,q as $e,m as Ie,z as G,o as n,c as l,e as i,g as k,f as r,i as Q,b as t,B as X,C as B,w as m,P as h,at as Y,F as g,E as x,I as Z,D as ee,A as Te,t as d,as as D,v as Ne,j as M,_ as j,aR as We,k as Oe}from"./index-6a324368.js";import{u as Pe}from"./analysis-6bc83d40.js";import{u as Ke}from"./worksheet-e59c78d0.js";import{h as w,o as U,a as R}from"./constants-94a3697a.js";const qe={class:""},Be=t("hr",{class:"mt-4"},null,-1),Me={class:"flex justify-between items-center"},je={action:"post",class:"p-1"},Le={class:"flex justify-start items-center gap-x-4 mb-4"},Fe={class:"ml-6 mt-2"},He=t("hr",{class:"mb-4"},null,-1),ze={class:"overflow-x-auto"},Je={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},Ge={class:"min-w-full"},Qe={class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},Xe=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"},null,-1),Ye=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"}," Sample ID ",-1),Ze=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Analysis/Test ",-1),et=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Instrument ",-1),tt=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Method ",-1),st=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Interim ",-1),ot=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Result ",-1),at=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Unit ",-1),nt=t("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Status ",-1),lt={class:"bg-white"},rt=["onUpdate:modelValue","disabled"],it={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},dt=t("i",{class:"fa fa-star"},null,-1),ut=[dt],ct={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},pt={class:"text-sm leading-5 text-gray-800 font-semibold"},mt={key:1},ht={key:0},yt={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},bt={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},_t={key:0,class:"text-sm leading-5 text-sky-800"},vt={key:1,class:"block col-span-2 mb-2"},ft=["onUpdate:modelValue","onChange"],kt=t("option",{value:""},null,-1),gt=["value"],xt={class:"flex justify-start items-center gap-x-1"},wt={class:"text-xs font-thin text-gray-300"},Ut={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Rt={key:0,class:"text-sm leading-5 text-sky-800"},Ct={key:1,class:"block col-span-2 mb-2"},St=["onUpdate:modelValue","onChange"],Vt=t("option",{value:""},null,-1),Et=["value"],At={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Dt={key:0,class:"text-sm leading-5 text-sky-800"},$t={key:1,class:"block col-span-2 mb-2"},It=["onUpdate:modelValue","onChange"],Tt=t("option",{value:""},null,-1),Nt=["value"],Wt={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Ot={key:0},Pt={key:1,class:"block"},Kt=["onUpdate:modelValue","onKeyup"],qt={key:2,class:"block col-span-2 mb-2"},Bt=["onUpdate:modelValue","onChange"],Mt=t("option",{value:""},null,-1),jt=["value"],Lt={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Ft={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Ht={type:"button",class:"bg-sky-800 text-white py-1 px-2 rounded-sm leading-none"},zt={class:"my-4"},Jt=Re({__name:"WorkSheetResults",setup(Gt){const te=M(()=>j(()=>import("./FelButton-b6a0b761.js"),["assets/FelButton-b6a0b761.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),$=M(()=>j(()=>import("./FelSelect-6461bd9a.js"),["assets/FelSelect-6461bd9a.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),se=M(()=>j(()=>import("./FelSwitch-b3808665.js"),["assets/FelSwitch-b3808665.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),I=Ce(),_=Se(),L=Ve(),F=Ee(),oe=Ae();let T=p(!1),N=p(!1),W=p(!1),O=p(!1),P=p(!1),K=p(!1),y=p(!1),f=p(!1),u=De(()=>I.getWorkSheet);const H=()=>{I.fetchWorksheetByUid(F.params.workSheetUid)};L.fetchUsers({}),_.fetchLaboratoryInstruments(),_.fetchMethods();const b=$e({analystUid:void 0,instrumentUid:void 0,methodUid:void 0}),C=p(!1),ae=()=>{C.value=!0,I.updateWorksheet({worksheetUid:F.params.workSheetUid,...b}).then(()=>{C.value=!1,H()})};function ne(){return u.value?.analysisResults?.every(o=>o.checked===!0)}function S(){let o=[];return u.value?.analysisResults?.forEach(s=>{s.checked&&o.push(s)}),o}function le(){ne()?y.value=!0:y.value=!1,A()}function v(o){if(z(o)){J(o);return}o.checked=!0,A()}function z(o){return["retracted","approved"].includes(o.status)}function J(o){o.checked=!1,A()}function re(){u?.value?.analysisResults?.forEach(o=>y.value?v(o):J(o)),A()}function ie(o){o.editable=!0}function V(o){return o.status!=="pending"?!1:o?.editable||We(o?.result)?(ie(o),!0):!1}function de(){let o=S(),s=[];return o?.forEach(c=>s.push({uid:c.uid,result:c.result,laboratoryInstrumentUid:c.laboratoryInstrumentUid,methodUid:c.methodUid})),s}function E(){const o=S();let s=[];return o?.forEach(c=>s.push(c.uid)),s}function ue(){const o=S();console.log(o);let s=[];return o?.forEach(c=>s.push(c.sample?.uid)),console.log(s),s}function ce(o){switch(o?.status){case"retracted":return"bg-gray-300 text-sm italic text-gray-500";default:return"text-sm leading-5 text-sky-800"}}function A(){T.value=!1,P.value=!1,N.value=!1,W.value=!1,O.value=!1,K.value=!1;const o=S();o.length!==0&&(K.value=!0,o.every(s=>s.status==="pending")&&(T.value=!0,P.value=!0),o.every(s=>s.status==="resulted")&&(N.value=!0,W.value=!0,O.value=!0))}const{submitResults:pe,approveResults:me,retractResults:he,retestResults:ye}=Pe(),{unAssignSamples:be}=Ke(),_e=()=>be(E()),ve=()=>pe(de(),"worksheet",u.value?.uid),fe=()=>me(E(),"worksheet",u.value?.uid),ke=()=>he(E()),ge=()=>ye(E()),xe=async()=>{window.open(oe.resolve({name:"print-barcodes",query:{sampleUids:JSON.stringify(ue().join(","))}}).href,"_blank")};return(o,s)=>{const c=Ie("router-link"),we=G("motion-slide-left"),Ue=G("motion-slide-right");return n(),l("div",qe,[Be,i((n(),l("div",Me,[k(r(se),{modelValue:r(f),"onUpdate:modelValue":s[0]||(s[0]=e=>Q(f)?f.value=e:f=e),label:"More Sample Detail"},null,8,["modelValue"]),i(t("form",je,[t("div",Le,[k(r($),{label:"Analyst",name:"analyst_uid",modelValue:b.analystUid,"onUpdate:modelValue":s[1]||(s[1]=e=>b.analystUid=e),options:r(L).users.map(e=>({value:e.uid,label:`${e.firstName} ${e.lastName}`})),disabled:r(u)?.state!=="pending"},null,8,["modelValue","options","disabled"]),k(r($),{label:"Instrument",name:"instrument_uid",modelValue:b.instrumentUid,"onUpdate:modelValue":s[2]||(s[2]=e=>b.instrumentUid=e),options:r(_).laboratoryInstruments.map(e=>({value:e.uid,label:`${e?.instrument.name} (${e?.labName})`})),disabled:r(u)?.state!=="pending"},null,8,["modelValue","options","disabled"]),k(r($),{label:"Method",name:"method_uid",modelValue:b.methodUid,"onUpdate:modelValue":s[3]||(s[3]=e=>b.methodUid=e),options:r(_).methods.map(e=>({value:e.uid,label:`${e.name}`})),disabled:r(u)?.state!=="pending"},null,8,["modelValue","options","disabled"]),t("div",Fe,[k(r(te),{onClick:s[4]||(s[4]=m(e=>ae(),["prevent"])),color:"sky-800",class:"p-1",disabled:!0},{default:X(()=>[B("Apply")]),_:1})])])],512),[[h,!C.value]]),i(t("p",null,"updating ...",512),[[h,C.value]]),t("div",null,[t("button",{onClick:s[5]||(s[5]=m(e=>H(),["prevent"])),class:"px-1 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Refresh ")])])),[[we]]),He,t("div",ze,[t("div",Je,[t("table",Ge,[t("thead",null,[t("tr",null,[t("th",Qe,[i(t("input",{type:"checkbox",class:"",onChange:s[6]||(s[6]=e=>re()),"onUpdate:modelValue":s[7]||(s[7]=e=>Q(y)?y.value=e:y=e)},null,544),[[Y,r(y)]])]),Xe,Ye,Ze,et,tt,st,ot,at,nt])]),t("tbody",lt,[(n(!0),l(g,null,x(r(u)?.analysisResults,e=>i((n(),l("tr",{key:e.uid,class:Z([ce(e)])},[t("td",null,[i(t("input",{type:"checkbox",class:"","onUpdate:modelValue":a=>e.checked=a,onChange:s[8]||(s[8]=a=>le()),disabled:z(e)},null,40,rt),[[Y,e.checked]])]),t("td",it,[(e?.sample?.priority??0)>0?(n(),l("span",{key:0,class:Z(["font-small",{"text-orange-600":(r(u)?.priority??0)>1}])},[...ut],2)):ee("",!0)]),t("td",ct,[t("div",pt,[e?.sample?.analysisRequest?.patient?.uid?(n(),Te(c,{key:0,to:{name:"sample-detail",params:{patientUid:e?.sample?.analysisRequest?.patient?.uid,sampleUid:e?.sample?.uid}}},{default:X(()=>[B(d(e?.sample?.sampleId),1)]),_:2},1032,["to"])):(n(),l("div",mt,d(e?.sample?.sampleId),1))]),r(f)?(n(),l("span",ht,[t("span",null,d(e?.sample?.qcLevel?.level),1),t("div",null,d(e?.sample?.analysisRequest?.patient?.firstName)+" "+d(e?.sample?.analysisRequest?.patient?.lastName),1),t("div",null,d(e?.sample?.analysisRequest?.client?.name),1)])):ee("",!0)]),t("td",yt,[t("div",null,d(e?.analysis?.name),1)]),t("td",bt,[V(e)?(n(),l("label",vt,[i(t("select",{class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.laboratoryInstrumentUid=a,onChange:a=>v(e)},[kt,(n(!0),l(g,null,x(r(_).laboratoryInstruments,a=>(n(),l("option",{key:a.uid,value:a.uid},[t("div",xt,[t("span",null,d(a.labName),1),B(" → "),t("span",wt,"("+d(a?.instrument?.name)+")",1)])],8,gt))),128))],40,ft),[[D,e.laboratoryInstrumentUid]])])):(n(),l("div",_t,d(e.laboratoryInstrument?.labName||"---"),1))]),t("td",Ut,[V(e)?(n(),l("label",Ct,[i(t("select",{class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.methodUid=a,onChange:a=>v(e)},[Vt,(n(!0),l(g,null,x(r(_).methods,a=>(n(),l("option",{key:a.uid,value:a.uid},d(a.name),9,Et))),128))],40,St),[[D,e.methodUid]])])):(n(),l("div",Rt,d(e.method?.name||"---"),1))]),t("td",At,[!V(e)||(e?.analysis?.interims?.length??0)===0?(n(),l("div",Dt," --- ")):(n(),l("label",$t,[i(t("select",{class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.result=a,onChange:a=>v(e)},[Tt,(n(!0),l(g,null,x(e?.analysis?.interims,(a,q)=>(n(),l("option",{key:a.key||q,value:a.value},d(a.value),9,Nt))),128))],40,It),[[D,e.result]])]))]),t("td",Wt,[V(e)?e?.analysis?.resultOptions?.length===0?(n(),l("label",Pt,[i(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.result=a,onKeyup:a=>v(e)},null,40,Kt),[[Ne,e.result]])])):(n(),l("label",qt,[i(t("select",{class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.result=a,onChange:a=>v(e)},[Mt,(n(!0),l(g,null,x(e?.analysis?.resultOptions,(a,q)=>(n(),l("option",{key:a.optionKey||q,value:a.value},d(a.value),9,jt))),128))],40,Bt),[[D,e.result]])])):(n(),l("div",Ot,d(e?.result),1))]),t("td",Lt,[t("div",null,d(e?.analysis?.unit?.name||"---"),1)]),t("td",Ft,[t("button",Ht,d(e?.status||"unknown"),1)])],2)),[[Ue]])),128))])])])]),t("section",zt,[i(t("button",{onClick:s[9]||(s[9]=m(e=>_e(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Un Assign ",512),[[h,w(R.CREATE,U.WORKSHEET)&&r(P)]]),i(t("button",{onClick:s[10]||(s[10]=m(e=>ve(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Submit ",512),[[h,w(R.UPDATE,U.WORKSHEET)&&r(T)]]),i(t("button",{onClick:s[11]||(s[11]=m(e=>ke(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Retract ",512),[[h,w(R.UPDATE,U.WORKSHEET)&&r(N)]]),i(t("button",{onClick:s[12]||(s[12]=m(e=>fe(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Approve ",512),[[h,w(R.UPDATE,U.WORKSHEET)&&r(W)]]),i(t("button",{onClick:s[13]||(s[13]=m(e=>ge(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Retest ",512),[[h,w(R.UPDATE,U.WORKSHEET)&&r(O)]]),i(t("button",{onClick:m(xe,["prevent"]),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Print Barcodes ",512),[[h,r(K)]])])])}}}),es=Oe(Jt,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/worksheet/_id/WorkSheetResults.vue"]]);export{es as default};
