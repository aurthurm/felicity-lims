import{d as re,ag as de,ab as ue,ah as ce,r as x,C as j,N as _e,z as pe,o as n,c as l,b as e,t as d,f as i,F as c,p,g as F,G as A,H as $,q as I,e as h,v as C,ac as b,w as v,i as L,x as M,j as X,_ as q,ai as he,O as me,k as fe}from"./index-2a6c9271.js";import{a as ye,b as ve,c as xe,d as be}from"./reflex.mutations-0f64b103.js";const ge={class:"mt-4 mb-2 text-xl text-gray-600 font-semibold tracking-wide"},ke={class:"leading-2 text-md italic tracking-wide"},we=e("hr",null,null,-1),Re=e("hr",null,null,-1),Ae=["onClick"],Ce={class:"flex justify-start items-center mb-2"},Ue=e("h4",{class:"text-l leading-4 italic"},"Reflex Action Brains",-1),Ve=["onClick"],Ee={class:"grid grid-cols-3 gap-4"},Fe={class:"flex justify-between items-center"},Ne={class:"my-2 text-l text-gray-600 font-bold"},Be=["onClick"],De=e("hr",{class:"my-2"},null,-1),Se=e("h4",{class:"my-2 text-md text-gray-500 font-semibold"},"Analyses Criteria",-1),Oe={class:"flex justify-start items-baseline flex-wrap"},Te={class:"flex"},je={class:"px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none"},$e={class:"px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"},Ie=e("h4",{class:"my-2 text-md text-gray-500 font-semibold"},"Add New Analyses",-1),Le={class:"flex justify-start items-baseline flex-wrap"},Me={class:"flex"},Xe={class:"px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 focus:outline-none"},qe={class:"px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none"},Pe=e("h4",{class:"my-2 text-md text-gray-500 font-semibold"},"Finalise",-1),ze={class:"flex justify-start items-baseline flex-wrap"},He={class:"flex"},Ge={class:"px-2 py-1 border border-gray-500 bg-gray-500 text-white transition duration-300 focus:outline-none"},We={class:"px-2 py-1 border-gray-500 border text-gray-500 transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"},Je={action:"post",class:"p-1"},Ke={class:"grid grid-cols-2 gap-x-4 mb-4"},Qe={class:"block col-span-1 mb-2"},Ye=e("span",{class:"text-gray-700"},"Level",-1),Ze={class:"block col-span-2 mb-2"},et=e("span",{class:"text-gray-700"},"Target Analyses",-1),tt=e("option",{value:""},null,-1),st=["value"],ot={class:"block col-span-2 mb-2"},nt=e("span",{class:"text-gray-700"},"Description",-1),lt=e("hr",null,null,-1),it={action:"post",class:"p-1"},at={class:"grid grid-cols-3 gap-x-4 mb-4"},rt={class:"block col-span-3 mb-2"},dt=e("span",{class:"text-gray-700"},"Description",-1),ut={id:"criteria"},ct=e("hr",null,null,-1),_t={class:"flex justify-between items-center py-2"},pt=e("h5",null,"Criteria",-1),ht=e("span",{class:"text-orange-600"},null,-1),mt=e("hr",{class:"mb-4"},null,-1),ft={class:"flex items-center justify-between"},yt={class:"flex items-bottom gap-x-2"},vt={class:"flex flex-col whitespace-nowrap mb-2"},xt=e("span",{class:"text-gray-700"},"Analysis",-1),bt=["onUpdate:modelValue","onChange"],gt=e("option",{value:""},null,-1),kt=["value"],wt={class:"flex flex-col whitespace-nowrap mb-2"},Rt=e("span",{class:"text-white"},".",-1),At=["onUpdate:modelValue"],Ct=e("option",{value:"eq"},"=",-1),Ut=e("option",{value:"gt"},">",-1),Vt=e("option",{value:"lt"},"<",-1),Et=e("option",{value:"neq"},"≠",-1),Ft=[Ct,Ut,Vt,Et],Nt={class:"block col-span-1 mt-1"},Bt=e("span",{class:"text-gray-700"},"Result",-1),Dt=["onUpdate:modelValue"],St=["onUpdate:modelValue"],Ot=e("option",{value:""},null,-1),Tt=["value"],jt={class:""},$t=["onClick"],It=e("hr",null,null,-1),Lt={id:"add-new"},Mt=e("hr",null,null,-1),Xt={class:"flex justify-between items-center py-2"},qt=e("h5",null,"Add New",-1),Pt=e("span",{class:"text-orange-600"},null,-1),zt=e("hr",{class:"mb-4"},null,-1),Ht={class:"flex items-center justify-between"},Gt={class:"flex items-top gap-x-4"},Wt={class:"flex flex-col whitespace-nowrap mb-2"},Jt=e("span",{class:"text-gray-700"},"Analysis",-1),Kt=["onUpdate:modelValue"],Qt=e("option",{value:""},null,-1),Yt=["value"],Zt={class:"block col-span-1 mb-2"},es=e("span",{class:"text-gray-700"},"Count",-1),ts=["onUpdate:modelValue"],ss={class:""},os=["onClick"],ns=e("hr",null,null,-1),ls={id:"criteria"},is=e("hr",null,null,-1),as={class:"flex justify-between items-center py-2"},rs=e("h5",null,"Finalize",-1),ds=e("span",{class:"text-orange-600"},null,-1),us=e("hr",{class:"mb-4"},null,-1),cs={class:"flex items-center justify-between"},_s={class:"flex items-top gap-x-4"},ps={class:"flex flex-col whitespace-nowrap mb-2"},hs=e("span",{class:"text-gray-700"},"Analysis",-1),ms=["onUpdate:modelValue","onChange"],fs=e("option",{value:""},null,-1),ys=["value"],vs={class:"block col-span-1 mb-2"},xs=e("span",{class:"text-gray-700"},"Result",-1),bs=["onUpdate:modelValue"],gs=["onUpdate:modelValue"],ks=e("option",{value:""},null,-1),ws=["value"],Rs={class:""},As=["onClick"],Cs=e("hr",null,null,-1),Us=e("hr",null,null,-1),Vs=re({__name:"Reflex",setup(Es){const S=X(()=>q(()=>import("./SimpleModal-0c0664c5.js"),["assets/SimpleModal-0c0664c5.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/SimpleModal-f645a074.css"])),P=X(()=>q(()=>import("./Accordion-e7840e62.js"),["assets/Accordion-e7840e62.js","assets/index-2a6c9271.js","assets/index-88806377.css"])),m=de(),z=ue(),{withClientMutation:V}=me(),H=ce();let g=x(!1),E=x(""),_=j({});const k=x(!0);let w=x(!1),u=j({addNew:[],analysesValues:[],finalise:[]});_e(async()=>{m.fetchReflexRuleByUid(H.params?.uid)});const G=a=>{const s=he(a);return s.charAt(0).toUpperCase()+s.slice(1)},R=z.getAnalysesServicesSimple;function W(){const a={reflexRuleUid:m.reflexRule?.uid,level:_.level,description:_.description,analyses:_.analyses};V(ye,{payload:a},"createReflexAction").then(s=>m.addReflexAction(s))}function J(){const a={reflexRuleUid:m.reflexRule?.uid,level:_.level,description:_.description,analyses:_.analyses};V(ve,{uid:_.uid,payload:a},"updateReflexAction").then(s=>m.updateReflexAction(s))}function O(a,s={}){if(k.value=a,g.value=!0,E.value=(a?"CREATE":"EDIT")+" REFLEX ACTION",a)Object.assign(_,{});else{let f=[];s.analyses?.forEach(t=>f.push(t?.uid)),Object.assign(_,{...s,analyses:f})}}function K(){k.value===!0&&W(),k.value===!1&&J(),g.value=!1}const N=x();function Q(){const a={...u,reflexActionUid:N.value};V(xe,{payload:a},"createReflexBrain").then(s=>m.updateReflexBrain(s))}function Y(){const a={...u,reflexActionUid:N.value};V(be,{uid:u.uid,payload:a},"updateReflexBrain").then(s=>m.updateReflexBrain(s))}function Z(){u.analysesValues?.push({operator:"eq"})}function ee(a){u.analysesValues?.splice(a,1)}let B=x([]);function te(a,s){const f=R?.find(t=>t.uid===s.analysisUid);s.value=void 0,B.value=f?.resultOptions||[]}function se(){u.addNew?.push({})}function oe(a){u.addNew?.splice(a,1)}function ne(){u.finalise?.push({})}function le(a){u.finalise?.splice(a,1)}let D=x([]);function ie(a,s){const f=R?.find(t=>t.uid===s.analysisUid);s.value=void 0,D.value=f?.resultOptions||[]}function T(a,s={}){k.value=a,w.value=!0,E.value=(a?"CREATE":"EDIT")+" REFLEX BRAIN",N.value=s.uid,a?Object.assign(u,{}):Object.assign(u,{...s})}function ae(){k.value===!0&&Q(),k.value===!1&&Y(),w.value=!1}return(a,s)=>{const f=pe("font-awesome-icon");return n(),l(c,null,[e("h3",ge,d(i(m).reflexRule?.name),1),e("p",ke,d(i(m).reflexRule?.description),1),we,e("button",{onClick:s[0]||(s[0]=t=>O(!0)),class:"my-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Reflex Action "),Re,(n(!0),l(c,null,p(i(m).reflexRule?.reflexActions,t=>(n(),l("section",{class:"col-span-1",key:t?.uid},[F(i(P),null,{title:A(()=>[e("span",{class:"p-2",onClick:r=>O(!1,t)},[F(f,{icon:"edit",class:"text-md text-gray-400 mr-1"})],8,Ae),$(" Reflex Action Level "+d(t?.level)+" targeting ",1),(n(!0),l(c,null,p(t?.analyses,r=>(n(),l("span",{key:r.uid,class:"ml-1"},d(r?.name)+",",1))),128))]),body:A(()=>[e("div",Ce,[Ue,e("button",{onClick:r=>T(!0,t),class:"ml-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Brain ",8,Ve)]),e("div",Ee,[(n(!0),l(c,null,p(t?.brains,(r,o)=>(n(),l("div",{key:r?.uid,class:"block col-span-1 bg-white py-2 px-4 m"},[e("div",Fe,[e("h2",Ne,d(G(o+1))+" Brain ",1),e("span",{class:"p-2",onClick:y=>T(!1,r)},[F(f,{icon:"edit",class:"text-md text-gray-400 mr-1"})],8,Be)]),e("h3",null,d(r?.description),1),De,e("div",null,[Se,(n(!0),l(c,null,p(r?.analysesValues,(y,U)=>(n(),l("div",{key:U},[e("div",Oe,[e("div",Te,[e("button",je,d(y?.analysis?.name),1),e("button",$e,d(y?.value),1)])])]))),128)),Ie,(n(!0),l(c,null,p(r?.addNew,(y,U)=>(n(),l("div",{key:U},[e("div",Le,[e("div",Me,[e("button",Xe,[$(d(y?.count)+" ",1),F(f,{icon:"asterisk",class:"text-l text-gray-600 mx-1"})]),e("button",qe,d(y?.analysis?.name),1)])])]))),128)),Pe,(n(!0),l(c,null,p(r?.finalise,(y,U)=>(n(),l("div",{key:U},[e("div",ze,[e("div",He,[e("button",Ge,d(y?.analysis?.name),1),e("button",We,d(y?.value),1)])])]))),128))])]))),128))])]),_:2},1024)]))),128)),i(g)?(n(),I(i(S),{key:0,onClose:s[5]||(s[5]=t=>L(g)?g.value=!1:g=!1)},{header:A(()=>[e("h3",null,d(i(E)),1)]),body:A(()=>[e("form",Je,[e("div",Ke,[e("label",Qe,[Ye,h(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[1]||(s[1]=t=>i(_).level=t),type:"number",placeholder:"Name ..."},null,512),[[C,i(_).level]])]),e("label",Ze,[et,h(e("select",{name:"analyses",id:"analyses","onUpdate:modelValue":s[2]||(s[2]=t=>i(_).analyses=t),class:"form-input mt-1 block w-full",multiple:""},[tt,(n(!0),l(c,null,p(i(R),t=>(n(),l("option",{key:t.uid,value:t.uid},d(t.name),9,st))),128))],512),[[b,i(_).analyses]])]),e("label",ot,[nt,h(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":s[3]||(s[3]=t=>i(_).description=t),placeholder:"Description ..."},null,512),[[C,i(_).description]])])]),lt,e("button",{type:"button",onClick:s[4]||(s[4]=v(t=>K(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):M("",!0),i(w)?(n(),I(i(S),{key:1,onClose:s[11]||(s[11]=t=>L(w)?w.value=!1:w=!1),contentWidth:"w-4/5"},{header:A(()=>[e("h3",null,d(i(E)),1)]),body:A(()=>[e("form",it,[e("div",at,[e("label",rt,[dt,h(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":s[6]||(s[6]=t=>i(u).description=t),placeholder:"Description ..."},null,512),[[C,i(u).description]])]),e("section",ut,[ct,e("div",_t,[pt,ht,e("button",{onClick:s[7]||(s[7]=v(t=>Z(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Criteria ")]),mt,(n(!0),l(c,null,p(i(u).analysesValues,(t,r)=>(n(),l("div",{key:r},[e("div",ft,[e("div",yt,[e("label",vt,[xt,h(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":o=>t.analysisUid=o,class:"form-input mt-1",onChange:o=>te(o,t)},[gt,(n(!0),l(c,null,p(i(R),o=>(n(),l("option",{key:o.uid,value:o.uid},d(o.name),9,kt))),128))],40,bt),[[b,t.analysisUid]])]),e("label",wt,[Rt,h(e("select",{name:"operator",id:"operator","onUpdate:modelValue":o=>t.operator=o,class:"form-input mt-1"},[...Ft],8,At),[[b,t.operator]])]),e("label",Nt,[Bt,i(B).length==0?h((n(),l("input",{key:0,class:"form-input mt-1 block w-full","onUpdate:modelValue":o=>t.value=o,type:"text",placeholder:"Result ..."},null,8,Dt)),[[C,t.value]]):h((n(),l("select",{key:1,name:"criteriaValue",id:"criteriaValue","onUpdate:modelValue":o=>t.value=o,class:"form-input"},[Ot,(n(!0),l(c,null,p(i(B),o=>(n(),l("option",{key:o.uid,value:o.value},d(o.value),9,Tt))),128))],8,St)),[[b,t.value]])])]),e("div",jt,[e("button",{onClick:v(o=>ee(r),["prevent"]),class:"px-2 py-1 mt-5 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,$t)])]),It]))),128))]),e("section",Lt,[Mt,e("div",Xt,[qt,Pt,e("button",{onClick:s[8]||(s[8]=v(t=>se(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add New ")]),zt,(n(!0),l(c,null,p(i(u).addNew,(t,r)=>(n(),l("div",{key:r},[e("div",Ht,[e("div",Gt,[e("label",Wt,[Jt,h(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":o=>t.analysisUid=o,class:"form-input mt-1"},[Qt,(n(!0),l(c,null,p(i(R),o=>(n(),l("option",{key:o.uid,value:o.uid},d(o.name),9,Yt))),128))],8,Kt),[[b,t.analysisUid]])]),e("label",Zt,[es,h(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":o=>t.count=o,type:"number",placeholder:"How Many ...",default:"1"},null,8,ts),[[C,t.count]])])]),e("div",ss,[e("button",{onClick:v(o=>oe(r),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,os)])]),ns]))),128))]),e("section",ls,[is,e("div",as,[rs,ds,e("button",{onClick:s[9]||(s[9]=v(t=>ne(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Final ")]),us,(n(!0),l(c,null,p(i(u).finalise,(t,r)=>(n(),l("div",{key:r},[e("div",cs,[e("div",_s,[e("label",ps,[hs,h(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":o=>t.analysisUid=o,class:"form-input mt-1",onChange:o=>ie(o,t)},[fs,(n(!0),l(c,null,p(i(R),o=>(n(),l("option",{key:o.uid,value:o.uid},d(o.name),9,ys))),128))],40,ms),[[b,t.analysisUid]])]),e("label",vs,[xs,i(D).length==0?h((n(),l("input",{key:0,class:"form-input mt-1 block w-full","onUpdate:modelValue":o=>t.value=o,type:"text",placeholder:"Result ..."},null,8,bs)),[[C,t.value]]):h((n(),l("select",{key:1,name:"finalValue",id:"finalValue","onUpdate:modelValue":o=>t.value=o,class:"form-input mt-1"},[ks,(n(!0),l(c,null,p(i(D),o=>(n(),l("option",{key:o.uid,value:o.value},d(o.value),9,ws))),128))],8,gs)),[[b,t.value]])])]),e("div",Rs,[e("button",{onClick:v(o=>le(r),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,As)])]),Cs]))),128))])]),Us,e("button",{type:"button",onClick:s[10]||(s[10]=v(t=>ae(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):M("",!0)],64)}}}),Bs=fe(Vs,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/admin/reflex/_id/Reflex.vue"]]);export{Bs as default};
