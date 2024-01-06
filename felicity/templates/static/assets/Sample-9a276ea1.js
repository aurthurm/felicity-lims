import{_ as ne,t as re,j as ie,F as y}from"./billing-356772f3.js";import{f as le,G as de,c as ce,w as C,d as c,v as k,aj as ue,h as u,k as m,x as e,al as b,B as x,u as s,j as pe,A as R,y as v,ag as i,s as me,D as o,F as j,ak as ve,_ as ye}from"./_plugin-vue_export-helper-3f67fb71.js";import{u as he}from"./samples-6869bb19.js";import{a as xe,u as _e}from"./index-3189f120.js";import{b as l}from"./runtime-dom.esm-bundler-6e07ef74.js";const be={class:"flex justify-between items-center"},fe=e("h3",{class:"my-4 font-bold"},"Sample Detail",-1),ge=e("hr",null,null,-1),we={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"},ke={key:0,class:"py-4 text-center"},Se={key:1,class:"grid grid-cols-12 gap-3"},Ce={class:"col-span-12 px-3 sm:px-0"},Re={class:"mb-2 flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"},je=e("i",{class:"fa fa-star"},null,-1),Le=[je],De={key:1},Pe={type:"button",class:"bg-sky-800 text-white px-2 py-1 rounded-sm leading-none"},$e={class:"ml-2"},Be={class:"absolute mt-4 py-0 bg-gray-300 rounded-sm shadow-xl z-20"},Ie=e("hr",null,null,-1),Oe={class:"grid grid-cols-3 gap-x-4 mt-2"},Te={class:"col-span-1"},qe={class:"flex justify-between"},Ue=e("span",{class:"text-gray-800 text-sm font-semibold"},"Client Request ID:",-1),Ve={class:"text-gray-600 text-sm md:text-md"},Ae={class:"flex justify-between"},Ne=e("span",{class:"text-gray-800 text-sm font-semibold"},"Client:",-1),Ee={class:"text-gray-600 text-sm md:text-md"},Fe=e("div",{class:"flex justify-between"},[e("span",{class:"text-gray-800 text-sm font-semibold"},"Cliet Contact:"),e("span",{class:"text-gray-600 text-sm md:text-md"},"Sister in Charge")],-1),ze={class:"col-span-1"},Je={class:"flex justify-between"},We=e("span",{class:"text-gray-800 text-sm font-semibold"},"Sample Type:",-1),Ge={class:"text-gray-600 text-sm md:text-md"},Me={class:"flex justify-between"},He=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Sampled:",-1),Ke={class:"text-gray-600 text-sm md:text-md"},Qe={class:"flex justify-between"},Xe=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Registered:",-1),Ye={class:"text-gray-600 text-sm md:text-md"},Ze={class:"flex justify-between"},et=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Received:",-1),tt={class:"text-gray-600 text-sm md:text-md"},st={class:"col-span-1"},at={class:"flex justify-between"},ot=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Submitted:",-1),nt={class:"text-gray-600 text-sm md:text-md"},rt={class:"flex justify-between"},it=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Verified:",-1),lt={class:"text-gray-600 text-sm md:text-md"},dt={class:"flex justify-between"},ct=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Published:",-1),ut={class:"text-gray-600 text-sm md:text-md"},pt={class:"flex justify-between"},mt=e("span",{class:"text-gray-800 text-sm font-semibold"},"Date Printed:",-1),vt={class:"text-gray-600 text-sm md:text-md"},yt={class:"bg-blue-300 rounded-sm shadow-md duration-500 px-4 sm:px-6 md:px-2 py-4 my-4"},ht={class:"flex"},xt=e("div",{class:"mr-4 font-semibold"},"Storage:",-1),_t={class:"bg-orange-600 rounded-sm shadow-md duration-500 px-4 sm:px-6 md:px-2 py-4 my-4"},bt=le({__name:"Sample",setup(ft){const L=de(()=>ne(()=>import("./LoadingMessage-83976fce.js"),["assets/LoadingMessage-83976fce.js","assets/_plugin-vue_export-helper-3f67fb71.js"])),p=re(),f=xe(),S=_e();p.resetSample();const{cancelSamples:D,reInstateSamples:P,receiveSamples:$,invalidateSamples:B,publishSamples:I,verifySamples:O,recoverSamples:T,barcodeSamples:q}=he(),_=ce({dropdownOpen:!1}),{sample:t,fetchingSample:U,repeatSample:g}=ie(p);p.fetchSampleByUid(f.params.sampleUid),C(()=>t?.value?.status,(n,a)=>{if(n)if(n!=="invalidated"){p.resetRepeatSample();return}else p.fetchRepeatSampleByParentId(f.params.sampleUid)}),C(()=>f.params.sampleUid,(n,a)=>{p.fetchSampleByUid(+n)});function V(n,a){let d=[];return n?.forEach(h=>d.push(h.name)),a?.forEach(h=>d.push(h.name)),d.join(", ")}const A=c(()=>!!["expected"].includes(t?.value?.status?.toLowerCase())),N=async()=>$([t?.value?.uid]),E=c(()=>!!["received","expected"].includes(t?.value?.status?.toLowerCase())),F=async()=>D([t?.value?.uid]),z=c(()=>!!["cancelled"].includes(t?.value?.status?.toLowerCase())),J=async()=>P([t?.value?.uid]),W=c(()=>t?.value?.status?.toLowerCase()==="awaiting"),G=async()=>O([t?.value?.uid]),M=c(()=>t?.value?.status?.toLowerCase()==="published"),w=c(()=>["approved"].includes(t?.value?.status?.toLowerCase())?"Publish":["published"].includes(t?.value?.status?.toLowerCase())?"Re publish":"Pre publish"),H=c(()=>{if(["awaiting","approved","published"].includes(t?.value?.status?.toLowerCase()))return!0;const n=p.analysisResults;return!!(["received","paired"].includes(t?.value?.status?.toLowerCase()??"")&&n?.some(a=>["approved"].includes(a.status?.toLowerCase()??"")))}),K=async()=>{const n=w.value.startsWith("Pre")?"pre-publish":w.value.startsWith("Re")?"re-publish":"publish";I([{uid:t?.value?.uid,action:n}])},Q=async()=>B([t?.value?.uid]).then(n=>{let a=n?.filter(d=>d.uid!==t?.value?.uid);a.length>0&&p.setRepeatSample(a[0])}),X=async()=>await q([t?.value?.uid]),Y=c(()=>!!["received","expected"].includes(t?.value?.status?.toLowerCase())),Z=async()=>S.push({name:"reject-samples",params:{samples:JSON.stringify([t?.value])}}),ee=c(()=>!!["stored"].includes(t?.value?.status?.toLowerCase())),te=async()=>T([t?.value?.uid]),se=async n=>{S.push({path:"/bio-banking",state:{sample:JSON.stringify(n)}})};return(n,a)=>{const d=k("font-awesome-icon"),h=k("router-link"),ae=k("router-view"),oe=ue("motion-slide-right");return u(),m(j,null,[e("div",be,[fe,e("div",null,[e("button",{class:"p-2 mr-8 text-sm hover:border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none",onClick:X},[b(" Barcode "),x(d,{icon:"barcode",class:"ml-2"})]),s(t)?.analysisRequest?.patient?.uid?(u(),pe(h,{key:0,to:{name:"patient-detail",params:{patientUid:s(t)?.analysisRequest?.patient?.uid}},class:"p-2 my-2 ml-4 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"},{default:R(()=>[b(" ... other samples ")]),_:1},8,["to"])):v("v-if",!0)])]),ge,i((u(),m("div",we,[s(U)?(u(),m("div",ke,[x(s(L),{message:"Fetching sample details ..."})])):(u(),m("div",Se,[v(" Summary Column "),e("div",Ce,[e("div",Re,[e("div",null,[s(t)?.priority??0<1?(u(),m("span",{key:0,class:me(["font-small",{"text-orange-600":s(t)?.priority??0<1}])},Le,2)):v("v-if",!0),b(" "+o(s(t)?.sampleId)+" ",1),v(` <button\r
                                                class="ml-4 text-xs inline-flex items-center justify-center w-6 h-6 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"\r
                                              >\r
                                                <i class="fa fa-pen"></i>\r
                                              </button> `),s(t)?.analysisRequest?.patient?.uid&&s(g)?.uid?(u(),m("span",De,[x(d,{icon:"angle-double-right",class:"mx-2"}),x(h,{to:{name:"sample-detail",params:{patientUid:s(t)?.analysisRequest?.patient?.uid,sampleUid:s(g)?.uid}},class:"p-2 my-2 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"},{default:R(()=>[b(o(s(g)?.sampleId),1)]),_:1},8,["to"])])):v("v-if",!0)]),e("span",null,o(V(s(t)?.profiles,s(t)?.analyses)),1),v(' <button type="button" class="bg-sky-800 text-white p-1rounded-smleading-none">{{ sample?.status }}</button> '),e("div",null,[e("div",{onClick:a[0]||(a[0]=r=>_.dropdownOpen=!_.dropdownOpen),class:"hidden md:block md:flex md:items-center ml-2 mt-2"},[e("button",Pe,o(s(t)?.status),1),e("div",$e,[x(d,{icon:"chevron-down",class:"text-gray-400"})])]),i(e("div",{onClick:a[1]||(a[1]=r=>_.dropdownOpen=!1),class:"fixed inset-0 h-full w-full z-10"},null,512),[[l,_.dropdownOpen]]),i(e("div",Be,[i(e("div",{onClick:a[2]||(a[2]=r=>N()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white"}," Receive ",512),[[l,s(A)]]),i(e("div",{onClick:a[3]||(a[3]=r=>G()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white"}," Approve ",512),[[l,s(W)]]),i(e("div",{onClick:a[4]||(a[4]=r=>Z()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"}," Reject ",512),[[l,s(Y)]]),i(e("div",{onClick:a[5]||(a[5]=r=>F()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"}," Cancel ",512),[[l,s(E)]]),i(e("div",{onClick:a[6]||(a[6]=r=>J()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"}," Reinstate ",512),[[l,s(z)]]),i(e("div",{onClick:a[7]||(a[7]=r=>K()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-400 hover:text-white"},o(s(w)),513),[[l,s(H)]]),i(e("div",{onClick:a[8]||(a[8]=r=>Q()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-400 hover:text-white"}," Invalidate ",512),[[l,s(M)]]),i(e("div",{onClick:a[9]||(a[9]=r=>te()),class:"no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-400 hover:text-white"}," Recover ",512),[[l,s(ee)]])],512),[[l,_.dropdownOpen]])])]),Ie,e("div",Oe,[e("div",Te,[e("div",qe,[Ue,e("span",Ve,o(s(t)?.analysisRequest?.clientRequestId),1)]),e("div",Ae,[Ne,e("span",Ee,o(s(t)?.analysisRequest?.client?.name),1)]),Fe]),e("div",ze,[e("div",Je,[We,e("span",Ge,o(s(t)?.sampleType?.name),1)]),e("div",Me,[He,e("span",Ke,o(s(y)(s(t)?.dateCollected,!0)),1)]),e("div",Qe,[Xe,e("span",Ye,o(s(y)(s(t)?.createdAt,!0)),1)]),e("div",Ze,[et,e("span",tt,o(s(y)(s(t)?.dateReceived,!0)),1)])]),e("div",st,[e("div",at,[ot,e("span",nt,o(s(y)(s(t)?.dateSubmitted,!0)),1)]),e("div",rt,[it,e("span",lt,o(s(y)(s(t)?.dateVerified,!0)),1)]),e("div",dt,[ct,e("span",ut,o(s(y)(s(t)?.datePublished,!0)),1)]),e("div",pt,[mt,e("span",vt,o(s(y)(s(t)?.datePrinted,!0)),1)])])])])]))])),[[oe]]),i(e("div",yt,[e("div",ht,[xt,v("  "),e("div",{class:"hover:underline hover:cursor-pointer",onClick:a[10]||(a[10]=r=>se(s(t)))},[e("span",null,o(s(t)?.storageContainer?.storageSection?.storageLocation?.storeRoom?.name)+" › ",1),e("span",null,o(s(t)?.storageContainer?.storageSection?.storageLocation?.name)+" › ",1),e("span",null,o(s(t)?.storageContainer?.storageSection?.name)+" › ",1),e("span",null,o(s(t)?.storageContainer?.name)+" › ",1),e("span",null,o(s(t)?.storageSlot),1)])])],512),[[l,s(t)?.status==="stored"]]),i(e("div",_t,[v(' <h3 clas="font-bold text-gray-800 text-md">This sample was rejected because of the following reason(s):</h3> '),e("ul",null,[(u(!0),m(j,null,ve(s(t)?.rejectionReasons,r=>(u(),m("li",{key:r.uid},o(r.reason),1))),128))])],512),[[l,s(t)?.status==="rejected"]]),x(ae)],64)}}}),Rt=ye(bt,[["__file","/home/aurthurm/Development/felicity-lims/webapp/views/sample/_id/Sample.vue"]]);export{Rt as default};
