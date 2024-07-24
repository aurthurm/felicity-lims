import{d as S,P as j,u as k,as as C,C as D,N,D as V,z as E,o as l,c,F as u,p as v,b as s,t as n,e as _,at as q,v as I,E as M,g as P,w as T,x as U,k as A}from"./index-03fd00e9.js";import{u as B}from"./samples-72819b73.js";const F=s("h4",null,"Sample Rejection",-1),O=s("hr",{class:"my-4"},null,-1),$={class:"text-gray-800 font-bold"},z={class:"grid grid-cols-12 gap-1 mt-2"},J={class:"col-span-6 grid grid-cols-2 gap-1"},L={class:"col-span-1"},G={class:"flex w-full"},H=s("span",{class:"text-gray-700 font-semibold w-4/12"},"Sample Type",-1),K={class:"flex w-full"},Q=s("span",{class:"text-gray-700 font-semibold w-4/12"},"Client Sample ID",-1),W={class:"flex w-full"},X=s("span",{class:"text-gray-700 font-semibold w-4/12"},"Anayses",-1),Y={class:"col-span-1"},Z={class:"flex w-full"},ss=s("span",{class:"text-gray-700 font-semibold w-4/12"},"Patient",-1),es={class:"flex w-full"},ts=s("span",{class:"text-gray-700 font-semibold w-4/12"},"Client Patient ID",-1),os={class:"col-span-5"},ns={class:"grid grid-cols-2 gap-2"},as={class:"col-span-1"},ls={class:"flex flex-col whitespace-nowrap w-full"},cs=s("span",{class:"text-gray-800 font-bold"},"Rejection Reasons",-1),is=s("hr",null,null,-1),rs=["onUpdate:modelValue"],ds=s("option",{value:""},null,-1),us=["value"],_s={class:"col-span-1"},ps={class:"flex flex-col whitespace-nowrap w-full"},hs=s("span",{class:"text-gray-700 font-bold"},"Other",-1),fs=s("hr",null,null,-1),ms=["onUpdate:modelValue"],vs={class:"col-span-1 pt-4 pl-4"},ys=["onClick"],ws=S({__name:"RejectSamples",setup(gs){j();const d=k(),p=C(),{rejectSamples:y}=B(),h=d.options.history.state,i=D({rejections:[]}),w=JSON.parse(window.history.state.samples);let f=[];for(let t of w)t.reasons=[],t.other=void 0,f.push(t);i.rejections=f,N(()=>p.fetchRejectionReasons());const g=(t,o)=>{let r=[];return t?.forEach(e=>r.push(e.name)),o?.forEach(e=>r.push(e.name)),r.join(", ")},x=t=>{i.rejections?.forEach(o=>{o.reasons=t.reasons,o.other=t.other})},b=V(()=>p.getRejectionReasons),R=async()=>{const t=[];i.rejections?.forEach(o=>{t.push({uid:o?.uid,reasons:o?.reasons,other:o?.other})}),await y(t).then(o=>{t.length==1&&h.back?.toString().includes("patient")?d.push({path:h.back.toString()}):d.push({name:"samples-listing"})})};return(t,o)=>{const r=E("font-awesome-icon");return l(),c(u,null,[F,(l(!0),c(u,null,v(i.rejections,(e,m)=>(l(),c("div",{key:m},[O,s("h2",$,n(e?.sampleId)+" → "+n(e?.status),1),s("div",z,[s("div",J,[s("div",L,[s("div",G,[H,s("span",null,n(e?.sampleType?.name),1)]),s("div",K,[Q,s("span",null,n(e?.analysisRequest?.clientRequestId),1)]),s("div",W,[X,s("span",null,n(g(e?.profiles,e?.analyses)),1)])]),s("div",Y,[s("div",Z,[ss,s("span",null,n(e?.analysisRequest?.patient?.firstName)+" "+n(e?.analysisRequest?.patient?.lastName),1)]),s("div",es,[ts,s("span",null,n(e?.analysisRequest?.patient?.clientPatientId),1)])])]),s("div",os,[s("div",ns,[s("div",as,[s("label",ls,[cs,is,_(s("select",{name:"reasons",rows:"3",class:"form-input mt-1",multiple:"","onUpdate:modelValue":a=>e.reasons=a},[ds,(l(!0),c(u,null,v(b.value,a=>(l(),c("option",{key:a.uid,value:a.uid},n(a.reason),9,us))),128))],8,rs),[[q,e.reasons]])])]),s("div",_s,[s("label",ps,[hs,fs,_(s("input",{type:"text",class:"form-input mt-1 block w-full","onUpdate:modelValue":a=>e.other=a},null,8,ms),[[I,e.other]])])])])]),s("div",vs,[_(s("button",{class:"ml-4 mt-4",onClick:a=>x(e)},[P(r,{icon:"level-down-alt"})],8,ys),[[M,m===0]])])])]))),128)),i.rejections?.length>0?(l(),c("button",{key:0,onClick:o[0]||(o[0]=T(e=>R(),["prevent"])),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600 rounded-sm transition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Reject Samples ")):U("v-if",!0)],64)}}}),Rs=A(ws,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/sample/RejectSamples.vue"]]);export{Rs as default};
