import{ab as $,d as _e,ac as he,a3 as we,a2 as ge,u as be,ad as ye,A as X,U as V,q as xe,a6 as Ue,r as L,c as Q,ae as P,a as _,af as Ne,ag as Z,b as Pe,ah as De,e as d,o as c,g as m,h as e,i as l,v as p,j as n,k as u,t as o,ai as ee,C as Ie,R as D,F as g,z as b,y as Se,l as ke,aj as Me,w as te,ak as Ve,J as $e,_ as Be}from"./index-8125dc25.js";/* empty css                                                                 */$`
  mutation AddIdentification($name: String!){
  createIdentification(name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`;$`
  mutation EditIdentification($uid: FelicityID!,$name: String!){
  updateIdentification(uid: $uid, name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`;const Ce=$`
  mutation AddPatient($payload: PatientInputType!){
  createPatient(payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client { 
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
        identifications {
          uid
          value
          identificationUid
          identification {
            uid
            name
          }
        }
        countryUid
        country {
          uid
          name
        }
        provinceUid
        province {
          uid
          name
        }
        districtUid
        district {
          uid
          name
        }
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`,Ee=$`
  mutation EditPatient($uid: FelicityID!,$payload: PatientInputType!){
  updatePatient(uid: $uid, payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client { 
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
        identifications {
          uid
          value
          identificationUid
          identification {
            uid
            name
          }
        }
        countryUid
        country {
          uid
          name
        }
        provinceUid
        province {
          uid
          name
        }
        districtUid
        district {
          uid
          name
        }
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`,Oe={class:"flex whitespace-nowrap w-full"},Fe=e("span",{class:"text-gray-700 w-4/12"},"Patient Unique Identifier",-1),qe={class:"w-full"},Ae={class:"text-orange-600 w-4/12"},Te={class:"flex whitespace-nowrap w-full"},Re=e("span",{class:"text-gray-700 w-4/12"},"First Name",-1),Ye={class:"w-full"},je={class:"text-orange-600 w-4/12"},He={class:"flex whitespace-nowrap mb-2 w-full"},Le=e("span",{class:"text-gray-700 w-4/12"},"Middle Name",-1),Ke={class:"w-full"},Ge={class:"text-orange-600 w-4/12"},ze={class:"flex whitespace-nowrap w-full"},Je=e("span",{class:"text-gray-700 w-4/12"},"Last Name",-1),We={class:"w-full"},Xe={class:"text-orange-600 w-4/12"},Qe={class:"flex whitespace-nowrap my-2 w-full"},Ze=e("span",{class:"text-gray-700 w-4/12"},"Age/DOB Estimated?",-1),et={class:"w-full flex justify-between items-center"},tt={class:"flex justify-start items-center gap-x-2 ml-4"},it={for:"estimateYears"},st=e("span",{class:"mr-1"},"Years",-1),nt={for:"estimateMonths"},at=e("span",{class:"mr-1"},"Months",-1),lt={for:"estimateDays"},ot=e("span",{class:"mr-1"},"Days",-1),dt={class:"text-orange-600 w-4/12"},rt={class:"flex whitespace-nowrap mb-2 w-full"},ut=e("span",{class:"text-gray-700 w-4/12"},"Date of Birth",-1),ct={class:"w-full"},mt=["disabled"],pt={class:"text-orange-600 w-4/12"},ft={class:"flex whitespace-nowrap mb-2 w-full"},vt=e("span",{class:"text-gray-700 w-4/12"},"Age",-1),_t={class:"w-full"},ht={class:"text-orange-600 w-4/12"},wt={class:"flex whitespace-nowrap mb-2 w-full"},gt=e("span",{class:"text-gray-700 w-4/12"},"Gender",-1),bt={class:"w-full"},yt=e("option",null,null,-1),xt=["value"],Ut={class:"text-orange-600 w-4/12"},Nt={class:"flex whitespace-nowrap mb-2 w-full"},Pt=e("span",{class:"text-gray-700 w-4/12"},"Mobile Number",-1),Dt={class:"w-full"},It={class:"text-orange-600 w-4/12"},St={class:"flex whitespace-nowrap mb-2 w-full"},kt=e("span",{class:"text-gray-700 w-4/12"},"Consent to SMS",-1),Mt={class:"w-full"},Vt={class:"text-orange-600 w-4/12"},$t={class:"flex whitespace-nowrap mb-2 w-full"},Bt=e("span",{class:"text-gray-700 w-4/12"},"Primary Referrer",-1),Ct={class:"w-full"},Et={class:"text-orange-600 w-4/12"},Ot={class:"flex whitespace-nowrap mb-2 w-full"},Ft={class:"text-gray-700 w-4/12 flex justify-between items-center"},qt=e("span",{class:"mr-4"},"Extra Ids:",-1),At={class:"w-full border-gray-200"},Tt={class:"flex justify-around items-center w-full"},Rt=e("span",null,"Identification",-1),Yt=["onUpdate:modelValue"],jt=e("option",null,null,-1),Ht=["value"],Lt=e("span",null,"Value",-1),Kt=["onUpdate:modelValue"],Gt=["onClick"],zt=e("hr",{class:"my-2"},null,-1),Jt={class:"grid grid-cols-3 gap-x-4 mb-4"},Wt={class:"col-span-1"},Xt={class:"flex gap-x-2 items-center whitespace-nowrap w-full"},Qt=e("span",{class:"text-gray-700 w-4/12"},"Country",-1),Zt=e("option",{value:null},null,-1),ei=["value"],ti={class:"text-orange-600 w-4/12"},ii={class:"col-span-1"},si={class:"flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full"},ni=e("span",{class:"text-gray-700 w-4/12"},"Province",-1),ai=e("option",{value:null},null,-1),li=["value"],oi={class:"text-orange-600 w-4/12"},di={class:"col-span-1"},ri={class:"flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full"},ui=e("span",{class:"text-gray-700 w-4/12"},"District",-1),ci=e("option",{value:null},null,-1),mi=["value"],pi={class:"text-orange-600 w-4/12"},fi=e("hr",null,null,-1),vi=e("button",{type:"submit",class:"-mb-4 w-1/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Patient ",-1),_i=_e({__name:"PatientForm",props:{patient:Object,navigate:{type:Boolean,default:!1}},emits:["close"],setup(ie,{emit:K}){const y=ie;let G=he(),f=we(),I=ge();const{withClientMutation:z}=Ve();let se=be(),ne=ye();const x=X({genders:["Male","Female","Missing","Trans Gender"],createAction:!0,countries:V(()=>f.getCountries),provinces:V(()=>f.getProvinces),districts:V(()=>f.getDistricts),clients:V(()=>G.getClients)});let ae=X({first:void 0,after:"",text:"",sortBy:["name"],filterAction:!1});xe(async()=>{await f.fetchCountries(),await G.fetchClients(ae),y.patient?.countryUid&&await f.filterProvincesByCountry(y.patient?.countryUid),y.patient?.provinceUid&&await f.filterDistrictsByProvince(y.patient?.provinceUid),await I.fetchIdentifications()});const{patient:a,navigate:le}=Ue(y),S=L(0),B=L(0),C=L(0),h=()=>{const s=$e().subtract(S.value,"year").subtract(B.value,"month").subtract(C.value,"day");w.value=s.format("YYYY-MM-DD"),U.value=S.value},J=()=>{var s=new Date().getFullYear();if(w.value){const t=new Date(w.value).getFullYear();U.value=s-t}},oe=Q({uid:P(),clientPatientId:_().required("Client Patient ID is Required"),patientId:_().nullable(),firstName:_().required("First Name is Required"),middleName:_().nullable(),lastName:_().required("Last Name is Required"),client:Q().required("Client is Required"),gender:_().required("Gender is Required"),age:P().nullable(),dateOfBirth:Ne().nullable(),ageDobEstimated:Z().nullable(),phoneHome:_().nullable(),phoneMobile:_().nullable(),consentSms:Z().nullable(),districtUid:P().nullable(),provinceUid:P().nullable(),countryUid:P().nullable()}),{handleSubmit:de,errors:r}=Pe({validationSchema:oe,initialValues:{uid:a?.value?.uid,clientPatientId:a?.value?.clientPatientId||ne?.query?.cpid,patientId:a?.value?.patientId,firstName:a?.value?.firstName,middleName:a?.value?.middleName,lastName:a?.value?.lastName,client:a?.value?.client,gender:a?.value?.gender,age:a?.value?.age,dateOfBirth:De(a?.value?.dateOfBirth)?void 0:new Date(a?.value?.dateOfBirth).toISOString().split("T")[0],ageDobEstimated:a?.value?.ageDobEstimated,phoneHome:a?.value?.phoneHome,phoneMobile:a?.value?.phoneMobile,consentSms:a?.value?.consentSms,districtUid:a?.value?.districtUid,provinceUid:a?.value?.provinceUid,countryUid:a?.value?.countryUid,identifications:a?.value?.identifications??[]}}),{value:E}=d("clientPatientId"),{value:O}=d("firstName"),{value:F}=d("middleName"),{value:q}=d("lastName"),{value:A}=d("client"),{value:T}=d("gender"),{value:U}=d("age"),{value:w}=d("dateOfBirth"),{value:N}=d("ageDobEstimated"),{value:R}=d("phoneMobile"),{value:Y}=d("consentSms"),{value:j}=d("districtUid"),{value:k}=d("provinceUid"),{value:M}=d("countryUid"),{value:H}=d("identifications"),W=de(s=>{s.uid||re(s),s.uid&&ue(s)});function re(s){z(Ce,{payload:{clientPatientId:s.clientPatientId,firstName:s.firstName,middleName:s.middleName,lastName:s.lastName,age:s.age,gender:s.gender,dateOfBirth:s.dateOfBirth,ageDobEstimated:s.ageDobEstimated,clientUid:s.client.uid,phoneMobile:s.phoneMobile,consentSms:s.consentSms,countryUid:s.countryUid,provinceUid:s.provinceUid,districtUid:s.districtUid,identifications:s.identifications}},"createPatient").then(t=>{I.addPatient(t),K("close",t),le.value===!0&&se.push({name:"patient-detail",params:{patientUid:t.uid}})})}function ue(s){console.log(s),z(Ee,{uid:s.uid,payload:{clientPatientId:s.clientPatientId,firstName:s.firstName,middleName:s.middleName,lastName:s.lastName,age:s.age,gender:s.gender,dateOfBirth:s.dateOfBirth,ageDobEstimated:s.ageDobEstimated,clientUid:s.client.uid,phoneMobile:s.phoneMobile,consentSms:s.consentSms,countryUid:s.countryUid,provinceUid:s.provinceUid,districtUid:s.districtUid}},"updatePatient").then(t=>{I.updatePatient(t),K("close",t)})}function ce(s){f.filterProvincesByCountry(M.value)}function me(s){f.filterDistrictsByProvince(k.value)}const pe=()=>{H.value.push({identificationUid:"12122",value:""})},fe=s=>{H.value.splice(s,1)};return(s,t)=>(c(),m("form",{onSubmit:t[28]||(t[28]=te((...i)=>n(W)&&n(W)(...i),["prevent"])),class:"border-2 border-gray-900 border-dotted rounded-sm px-4 py-8",autocomplete:"off"},[e("label",Oe,[Fe,e("div",qe,[l(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":t[0]||(t[0]=i=>u(E)?E.value=i:null),placeholder:"Patient Unique Identifier"},null,512),[[p,n(E)]]),e("div",Ae,o(n(r).clientPatientId),1)])]),e("label",Te,[Re,e("div",Ye,[l(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":t[1]||(t[1]=i=>u(O)?O.value=i:null),placeholder:"First Name"},null,512),[[p,n(O)]]),e("div",je,o(n(r).firstName),1)])]),e("label",He,[Le,e("div",Ke,[l(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":t[2]||(t[2]=i=>u(F)?F.value=i:null),placeholder:"Middle Name"},null,512),[[p,n(F)]]),e("div",Ge,o(n(r).middleName),1)])]),e("label",ze,[Je,e("div",We,[l(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":t[3]||(t[3]=i=>u(q)?q.value=i:null),placeholder:"Last Name"},null,512),[[p,n(q)]]),e("div",Xe,o(n(r).lastName),1)])]),e("label",Qe,[Ze,e("div",et,[l(e("input",{type:"checkbox",class:"form-checkbox text-sky-800","onUpdate:modelValue":t[4]||(t[4]=i=>u(N)?N.value=i:null)},null,512),[[ee,n(N)]]),l(e("div",tt,[e("label",it,[st,l(e("input",{name:"estimateYears",type:"number",min:"0",class:"form-input w-24 py-0 text-sky-800","onUpdate:modelValue":t[5]||(t[5]=i=>S.value=i),onChange:t[6]||(t[6]=i=>h()),onKeyup:t[7]||(t[7]=i=>h())},null,544),[[p,S.value]])]),e("label",nt,[at,l(e("input",{name:"estimateMonths",type:"number",min:"0",max:"12",class:"form-input w-24 py-0 text-sky-800","onUpdate:modelValue":t[8]||(t[8]=i=>B.value=i),onChange:t[9]||(t[9]=i=>h()),onKeyup:t[10]||(t[10]=i=>h())},null,544),[[p,B.value]])]),e("label",lt,[ot,l(e("input",{name:"estimateDays",type:"number",min:"0",max:"365",class:"form-input w-24 py-0 text-sky-800","onUpdate:modelValue":t[11]||(t[11]=i=>C.value=i),onChange:t[12]||(t[12]=i=>h()),onKeyup:t[13]||(t[13]=i=>h())},null,544),[[p,C.value]])])],512),[[Ie,n(N)]]),e("div",dt,o(n(r).ageDobEstimated),1)])]),e("label",rt,[ut,e("div",ct,[l(e("input",{class:"form-input mt-1 w-full disabled:bg-slate-200",type:"date","onUpdate:modelValue":t[14]||(t[14]=i=>u(w)?w.value=i:null),placeholder:"Date of Birth",disabled:n(N),onChange:t[15]||(t[15]=i=>J()),onKeyup:t[16]||(t[16]=i=>J())},null,40,mt),[[p,n(w)]]),e("div",pt,o(n(r).dateOfBirth),1)])]),e("label",ft,[vt,e("div",_t,[l(e("input",{class:"form-input mt-1 w-full disabled:bg-slate-200",type:"number","onUpdate:modelValue":t[17]||(t[17]=i=>u(U)?U.value=i:null),placeholder:"Age",disabled:""},null,512),[[p,n(U)]]),e("div",ht,o(n(r).age),1)])]),e("label",wt,[gt,e("div",bt,[l(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":t[18]||(t[18]=i=>u(T)?T.value=i:null)},[yt,(c(!0),m(g,null,b(x.genders,i=>(c(),m("option",{key:i,value:i},o(i),9,xt))),128))],512),[[D,n(T)]]),e("div",Ut,o(n(r).gender),1)])]),e("label",Nt,[Pt,e("div",Dt,[l(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":t[19]||(t[19]=i=>u(R)?R.value=i:null),placeholder:"Mobile Number"},null,512),[[p,n(R)]]),e("div",It,o(n(r).phoneMobile),1)])]),e("label",St,[kt,e("div",Mt,[l(e("input",{type:"checkbox",class:"form-checkbox text-sky-800","onUpdate:modelValue":t[20]||(t[20]=i=>u(Y)?Y.value=i:null)},null,512),[[ee,n(Y)]]),e("div",Vt,o(n(r).consentSms),1)])]),Se(" other identifiers: passport, client pid, national id "),e("label",$t,[Bt,e("div",Ct,[ke(n(Me),{placeholder:"Select a Primary Referrer",modelValue:n(A),"onUpdate:modelValue":t[21]||(t[21]=i=>u(A)?A.value=i:null),options:x.clients,searchable:!0,label:"name","track-by":"uid"},null,8,["modelValue","options"]),e("div",Et,o(n(r).client),1)])]),e("label",Ot,[e("span",Ft,[qt,e("div",null,[e("span",{class:"relative px-1 mr-2 mt-4 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",onClick:t[22]||(t[22]=i=>pe())}," Add ")])]),e("div",At,[(c(!0),m(g,null,b(n(H),(i,ve)=>(c(),m("div",Tt,[Rt,l(e("select",{class:"form-select mt-1","onUpdate:modelValue":v=>i.identificationUid=v},[jt,(c(!0),m(g,null,b(n(I).identifications,v=>(c(),m("option",{key:v.uid,value:v.uid},o(v.name),9,Ht))),128))],8,Yt),[[D,i.identificationUid]]),Lt,l(e("input",{type:"text",class:"form-input text-sky-800","onUpdate:modelValue":v=>i.value=v},null,8,Kt),[[p,i.value]]),e("span",{class:"p-2 text-red-800",onClick:te(v=>fe(ve),["prevent"])},"X",8,Gt)]))),256))])]),zt,e("div",Jt,[e("div",Wt,[e("label",Xt,[Qt,l(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":t[23]||(t[23]=i=>u(M)?M.value=i:null),onChange:t[24]||(t[24]=i=>ce())},[Zt,(c(!0),m(g,null,b(x.countries,i=>(c(),m("option",{key:i.uid,value:i.uid},o(i.name),9,ei))),128))],544),[[D,n(M)]])]),e("div",ti,o(n(r).countryUid),1)]),e("div",ii,[e("label",si,[ni,l(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":t[25]||(t[25]=i=>u(k)?k.value=i:null),onChange:t[26]||(t[26]=i=>me())},[ai,(c(!0),m(g,null,b(x.provinces,i=>(c(),m("option",{key:i.uid,value:i.uid},o(i.name),9,li))),128))],544),[[D,n(k)]])]),e("div",oi,o(n(r).provinceUid),1)]),e("div",di,[e("label",ri,[ui,l(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":t[27]||(t[27]=i=>u(j)?j.value=i:null)},[ci,(c(!0),m(g,null,b(x.districts,i=>(c(),m("option",{key:i.uid,value:i.uid},o(i.name),9,mi))),128))],512),[[D,n(j)]])])]),e("div",pi,o(n(r).districtUid),1)]),fi,vi],32))}}),gi=Be(_i,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/patient/PatientForm.vue"]]);export{gi as P};
