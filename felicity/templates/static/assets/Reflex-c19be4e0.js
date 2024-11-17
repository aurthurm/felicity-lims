import{d as _e,aw as me,ar as he,N as fe,r as g,q,y as ve,m as ye,o,c as i,b as e,t as f,f as a,F as _,E as h,g as D,B as U,C as xe,A as P,e as v,v as E,as as k,w as b,i as Y,D as H,j as W,S as be,_ as z,M as ge,ax as ke,k as we}from"./index-6a324368.js";import{D as Re,a as Ce,b as Ae,c as Ue,d as Ee}from"./reflex.mutations-8f118cfb.js";const Be={class:"mt-4 mb-2 text-xl text-gray-600 font-semibold tracking-wide"},Ve={class:"leading-2 text-md italic tracking-wide"},De=e("hr",null,null,-1),Ne=e("hr",null,null,-1),Se=["onClick"],Fe={class:"flex justify-start items-center mb-2"},Te=e("h4",{class:"text-l leading-4 italic"},"Reflex Action Brains",-1),Oe=["onClick"],$e={class:"grid grid-cols-3 gap-4"},je={class:"flex justify-between items-center"},Le={class:"my-2 text-l text-gray-600 font-bold"},Me=["onClick"],Ie=["onClick"],Xe={class:"text-gray-500 text-sm"},qe={action:"post",class:"p-1"},Pe={class:"grid grid-cols-2 gap-x-4 mb-4"},Ye={class:"block col-span-1 mb-2"},He=e("span",{class:"text-gray-700"},"Level",-1),We={class:"block col-span-2 mb-2"},ze=e("span",{class:"text-gray-700"},"Target Analyses",-1),Ge=e("option",{value:""},null,-1),Je=["value"],Ke={class:"block col-span-2 mb-2"},Qe=e("span",{class:"text-gray-700"},"Description",-1),Ze=e("hr",null,null,-1),et={action:"post",class:"p-1"},tt={class:"mb-2"},st=e("span",{class:"text-gray-700"},"Description",-1),ot={class:"flex items-center justify-start my-4 font-bold text-l text-gray-600"},nt=e("span",null,"Conditions (OR)",-1),lt=e("p",{class:"italic text-sm text-gray-400"},"Criteria under a condition are evaluated as AND whilst conditions are evaluated as OR",-1),it={class:"grid grid-cols-2 gap-4 my-4"},at=e("hr",null,null,-1),rt={class:"flex justify-between items-center"},ct={class:"flex justify-start items-center py-2"},dt=e("h5",null,"Criteria (AND)",-1),ut=["onClick"],pt=["onClick"],_t=e("hr",{class:"mb-4"},null,-1),mt={class:"flex items-center justify-between"},ht={class:"flex items-bottom gap-x-2"},ft={class:"flex flex-col whitespace-nowrap mb-2"},vt=e("span",{class:"text-gray-700"},"Analysis",-1),yt=["onUpdate:modelValue","onChange"],xt=e("option",{value:""},null,-1),bt=["value"],gt={class:"flex flex-col whitespace-nowrap mb-2"},kt=e("span",{class:"text-white"},".",-1),wt=["onUpdate:modelValue"],Rt=e("option",{value:"eq"},"=",-1),Ct=e("option",{value:"gt"},">",-1),At=e("option",{value:"lt"},"<",-1),Ut=e("option",{value:"neq"},"≠",-1),Et=[Rt,Ct,At,Ut],Bt={class:"block col-span-1 mt-1"},Vt=e("span",{class:"text-gray-700"},"Result",-1),Dt=["onUpdate:modelValue"],Nt=["onUpdate:modelValue"],St=e("option",{value:""},null,-1),Ft=["value"],Tt={class:""},Ot=["onClick"],$t=e("hr",null,null,-1),jt=e("h3",{class:"mt-4 font-bold text-l text-gray-600"},"Actions",-1),Lt=e("p",{class:"italic text-sm text-gray-400"},"If conditions are met, auto create new analyses and or set final results",-1),Mt={class:"flex justify-start items-center py-2"},It=e("h5",null,"Create Analyses",-1),Xt=e("span",{class:"text-orange-600"},null,-1),qt=["onClick"],Pt=e("hr",null,null,-1),Yt={class:"flex items-center justify-between"},Ht={class:"flex items-top gap-x-4"},Wt={class:"flex flex-col whitespace-nowrap mb-2"},zt=e("span",{class:"text-gray-700"},"Analysis",-1),Gt=["onUpdate:modelValue"],Jt=e("option",{value:""},null,-1),Kt=["value"],Qt={class:"block col-span-1 mb-2"},Zt=e("span",{class:"text-gray-700"},"Count",-1),es=["onUpdate:modelValue"],ts={class:""},ss=["onClick"],os={class:"flex justify-start items-center py-2"},ns=e("h5",null,"Set Final Analyses",-1),ls=e("span",{class:"text-orange-600"},null,-1),is=["onClick"],as=e("hr",null,null,-1),rs={class:"flex items-center justify-between"},cs={class:"flex items-top gap-x-4"},ds={class:"flex flex-col whitespace-nowrap mb-2"},us=e("span",{class:"text-gray-700"},"Analysis",-1),ps=["onUpdate:modelValue","onChange"],_s=e("option",{value:""},null,-1),ms=["value"],hs={class:"block col-span-1 mb-2"},fs=e("span",{class:"text-gray-700"},"Result",-1),vs=["onUpdate:modelValue"],ys=["onUpdate:modelValue"],xs=e("option",{value:""},null,-1),bs=["value"],gs={class:""},ks=["onClick"],ws=e("hr",null,null,-1),Rs=_e({__name:"Reflex",setup(Cs){const O=W(()=>z(()=>import("./FelModal-ad52dd5c.js"),["assets/FelModal-ad52dd5c.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/FelModal-780aeea9.css"])),G=W(()=>z(()=>import("./FelAccordion-8f91d055.js"),["assets/FelAccordion-8f91d055.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),y=me(),J=he(),{withClientMutation:B}=ge(),K=fe();let w=g(!1),V=g(""),m=q({});const R=g(!0);let C=g(!1),c=q({description:"",priority:0,conditions:[],actions:[]});ve(async()=>{y.fetchReflexRuleByUid(K.params?.uid)});const Q=n=>{const t=ke(n);return t.charAt(0).toUpperCase()+t.slice(1)},A=J.getAnalysesServicesSimple;function Z(){const n={reflexRuleUid:y.reflexRule?.uid,level:m.level,description:m.description,analyses:m.analyses};B(Ce,{payload:n},"createReflexAction").then(t=>y.addReflexAction(t))}function ee(){const n={reflexRuleUid:y.reflexRule?.uid,level:m.level,description:m.description,analyses:m.analyses};B(Ae,{uid:m.uid,payload:n},"updateReflexAction").then(t=>y.updateReflexAction(t))}function $(n,t={}){if(R.value=n,w.value=!0,V.value=(n?"CREATE":"EDIT")+" REFLEX ACTION",n)Object.assign(m,{});else{let r=[];t.analyses?.forEach(s=>r.push(s?.uid)),Object.assign(m,{...t,analyses:r})}}function te(){R.value===!0&&Z(),R.value===!1&&ee(),w.value=!1}const N=g();function se(){const n={...c,reflexActionUid:N.value};B(Ue,{payload:n},"createReflexBrain").then(t=>y.updateReflexBrain(t))}function oe(){const n={reflexActionUid:N.value,priority:c.priority,description:c.description,conditions:c.conditions?.map(t=>({description:t.description,priority:t.priority,criteria:t.criteria?.map(r=>({analysisUid:r.analysisUid,operator:r.operator,value:r.value}))})),actions:c.actions?.map(t=>({addNew:t.addNew?.map(r=>({analysisUid:r.analysisUid,count:r.count})),finalise:t.finalise?.map(r=>({analysisUid:r.analysisUid,value:r.value}))}))};B(Ee,{uid:c.uid,payload:n},"updateReflexBrain").then(t=>y.updateReflexBrain(t))}function j(){c.conditions?.push({description:"",priority:0,criteria:[]})}function ne(n){c.conditions?.splice(n,1)}function le(){c.actions?.push({addNew:[],finalise:[]})}function L(n){c.conditions[n].criteria?.push({operator:"eq"})}function ie(n,t){c.conditions[n].criteria?.splice(t,1)}let S=g([]);function ae(n,t){const r=A?.find(s=>s.uid===t.analysisUid);t.value=void 0,S.value=r?.resultOptions||[]}function M(n){c.actions[n]?.addNew?.push({})}function re(n){c.actions[0]?.addNew?.splice(n,1)}function I(n){c.actions[0]?.finalise?.push({})}function ce(n){c.actions[n]?.finalise?.splice(n,1)}let F=g([]);function de(n,t){const r=A?.find(s=>s.uid===t.analysisUid);t.value=void 0,F.value=r?.resultOptions||[]}function X(n,t,r={}){R.value=n,C.value=!0,V.value=(n?"CREATE":"EDIT")+" REFLEX BRAIN",N.value=t,n?(Object.assign(c,{priority:0,description:"",conditions:[],actions:[]}),j(),L(0),le(),M(0),I()):Object.assign(c,{...r})}function ue(){R.value===!0&&se(),R.value===!1&&oe(),C.value=!1}function pe(n,t){be.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!"}).then(r=>{r.isConfirmed&&B(Re,{uid:t},"deleteReflexBrain").then(s=>y.deleteReflexBrain(n,t))})}return(n,t)=>{const r=ye("font-awesome-icon");return o(),i(_,null,[e("h3",Be,f(a(y).reflexRule?.name),1),e("p",Ve,f(a(y).reflexRule?.description),1),De,e("button",{onClick:t[0]||(t[0]=s=>$(!0)),class:"my-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Reflex Action "),Ne,(o(!0),i(_,null,h(a(y).reflexRule?.reflexActions,s=>(o(),i("section",{class:"col-span-1",key:s?.uid},[D(a(G),null,{title:U(()=>[e("span",{class:"p-2",onClick:p=>$(!1,s)},[D(r,{icon:"edit",class:"text-md text-gray-400 mr-1"})],8,Se),xe(" Reflex Action Level "+f(s?.level)+" targeting ",1),(o(!0),i(_,null,h(s?.analyses,p=>(o(),i("span",{key:p.uid,class:"ml-1"},f(p?.name)+",",1))),128))]),body:U(()=>[e("div",Fe,[Te,e("button",{onClick:p=>X(!0,s?.uid,{}),class:"ml-4 px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Brain ",8,Oe)]),e("div",$e,[(o(!0),i(_,null,h(s?.brains,(p,d)=>(o(),i("div",{key:p?.uid,class:"block col-span-1 bg-white py-2 px-4 m"},[e("div",je,[e("h2",Le,f(Q(d+1))+" Brain ",1),e("div",null,[e("span",{class:"p-2",onClick:x=>X(!1,s.uid,p)},[D(r,{icon:"edit",class:"text-md text-gray-400 mr-1"})],8,Me),e("span",{class:"p-2",onClick:x=>pe(s.uid,p.uid)},[D(r,{icon:"trash",class:"text-md text-red-400 mr-1"})],8,Ie)])]),e("p",Xe,f(p?.description),1)]))),128))])]),_:2},1024)]))),128)),a(w)?(o(),P(a(O),{key:0,onClose:t[5]||(t[5]=s=>Y(w)?w.value=!1:w=!1)},{header:U(()=>[e("h3",null,f(a(V)),1)]),body:U(()=>[e("form",qe,[e("div",Pe,[e("label",Ye,[He,v(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[1]||(t[1]=s=>a(m).level=s),type:"number",min:"1",placeholder:"Name ..."},null,512),[[E,a(m).level]])]),e("label",We,[ze,v(e("select",{name:"analyses",id:"analyses","onUpdate:modelValue":t[2]||(t[2]=s=>a(m).analyses=s),class:"form-input mt-1 block w-full",multiple:""},[Ge,(o(!0),i(_,null,h(a(A),s=>(o(),i("option",{key:s.uid,value:s.uid},f(s.name),9,Je))),128))],512),[[k,a(m).analyses]])]),e("label",Ke,[Qe,v(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[3]||(t[3]=s=>a(m).description=s),placeholder:"Description ..."},null,512),[[E,a(m).description]])])]),Ze,e("button",{type:"button",onClick:t[4]||(t[4]=b(s=>te(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):H("",!0),a(C)?(o(),P(a(O),{key:1,onClose:t[9]||(t[9]=s=>Y(C)?C.value=!1:C=!1),contentWidth:"w-4/5"},{header:U(()=>[e("h3",null,f(a(V)),1)]),body:U(()=>[e("form",et,[e("label",tt,[st,v(e("textarea",{cols:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[6]||(t[6]=s=>a(c).description=s),placeholder:"Description ..."},null,512),[[E,a(c).description]])]),e("h3",ot,[nt,e("button",{onClick:t[7]||(t[7]=b(s=>j(),["prevent"])),class:"px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add ")]),lt,e("div",it,[(o(!0),i(_,null,h(a(c).conditions,(s,p)=>(o(),i("section",{class:"bg-slate-100 px-1",id:"criteria",key:p},[at,e("div",rt,[e("div",ct,[dt,e("button",{onClick:b(d=>L(p),["prevent"]),class:"px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," + criteria ",8,ut)]),e("button",{onClick:b(d=>ne(p),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," - condition ",8,pt)]),_t,(o(!0),i(_,null,h(s.criteria,(d,x)=>(o(),i("div",{key:x},[e("div",mt,[e("div",ht,[e("label",ft,[vt,v(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":l=>d.analysisUid=l,class:"form-input mt-1",onChange:l=>ae(l,d)},[xt,(o(!0),i(_,null,h(a(A),l=>(o(),i("option",{key:l.uid,value:l.uid},f(l.name),9,bt))),128))],40,yt),[[k,d.analysisUid]])]),e("label",gt,[kt,v(e("select",{name:"operator",id:"operator","onUpdate:modelValue":l=>d.operator=l,class:"form-input mt-1"},[...Et],8,wt),[[k,d.operator]])]),e("label",Bt,[Vt,a(S).length==0?v((o(),i("input",{key:0,class:"form-input mt-1 block w-full","onUpdate:modelValue":l=>d.value=l,type:"text",placeholder:"Result ..."},null,8,Dt)),[[E,d.value]]):v((o(),i("select",{key:1,name:"criteriaValue",id:"criteriaValue","onUpdate:modelValue":l=>d.value=l,class:"form-input"},[St,(o(!0),i(_,null,h(a(S),l=>(o(),i("option",{key:l.uid,value:l.value},f(l.value),9,Ft))),128))],8,Nt)),[[k,d.value]])])]),e("div",Tt,[e("button",{onClick:b(l=>ie(p,x),["prevent"]),class:"px-2 py-1 mt-5 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," - criteria ",8,Ot)])]),$t]))),128))]))),128))]),jt,Lt,(o(!0),i(_,null,h(a(c).actions,(s,p)=>(o(),i("section",{class:"grid grid-cols-2 gap-x-4 my-4",key:p},[(o(!0),i(_,null,h(s.addNew,(d,x)=>(o(),i("div",{class:"bg-green-50 px-1",key:x},[e("div",Mt,[It,Xt,e("button",{onClick:b(l=>M(x),["prevent"]),class:"px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add ",8,qt)]),Pt,e("div",Yt,[e("div",Ht,[e("label",Wt,[zt,v(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":l=>d.analysisUid=l,class:"form-input mt-1"},[Jt,(o(!0),i(_,null,h(a(A),l=>(o(),i("option",{key:l.uid,value:l.uid},f(l.name),9,Kt))),128))],8,Gt),[[k,d.analysisUid]])]),e("label",Qt,[Zt,v(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":l=>d.count=l,type:"number",placeholder:"How Many ...",default:"1"},null,8,es),[[E,d.count]])])]),e("div",ts,[e("button",{onClick:b(l=>re(x),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,ss)])])]))),128)),(o(!0),i(_,null,h(a(c).actions,(d,x)=>(o(),i("div",{key:x},[(o(!0),i(_,null,h(d.finalise,(l,T)=>(o(),i("div",{class:"bg-orange-50 px-1",key:T},[e("div",os,[ns,ls,e("button",{onClick:b(u=>I(T),["prevent"]),class:"px-2 py-1 ml-4 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add ",8,is)]),as,e("div",rs,[e("div",cs,[e("label",ds,[us,v(e("select",{name:"analysisService",id:"analysisService","onUpdate:modelValue":u=>l.analysisUid=u,class:"form-input mt-1",onChange:u=>de(u,l)},[_s,(o(!0),i(_,null,h(a(A),u=>(o(),i("option",{key:u.uid,value:u.uid},f(u.name),9,ms))),128))],40,ps),[[k,l.analysisUid]])]),e("label",hs,[fs,a(F).length==0?v((o(),i("input",{key:0,class:"form-input mt-1 block w-full","onUpdate:modelValue":u=>l.value=u,type:"text",placeholder:"Result ..."},null,8,vs)),[[E,l.value]]):v((o(),i("select",{key:1,name:"finalValue",id:"finalValue","onUpdate:modelValue":u=>l.value=u,class:"form-input mt-1"},[xs,(o(!0),i(_,null,h(a(F),u=>(o(),i("option",{key:u.uid,value:u.value},f(u.value),9,bs))),128))],8,ys)),[[k,l.value]])])]),e("div",gs,[e("button",{onClick:b(u=>ce(T),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,ks)])])]))),128))]))),128))]))),128)),ws,e("button",{type:"button",onClick:t[8]||(t[8]=b(s=>ue(),["prevent"])),class:"-mb-4 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save ")])]),_:1})):H("",!0)],64)}}}),Es=we(Rs,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/reflex/_id/Reflex.vue"]]);export{Es as default};
