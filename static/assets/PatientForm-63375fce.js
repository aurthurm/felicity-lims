import{ab as G,d as ae,ac as ne,a2 as ie,a1 as oe,u as de,ad as re,A as T,aa as $,q as ue,a5 as ce,c as H,ae as h,a as p,af as me,ag as L,b as pe,ah as fe,e as d,o as c,g as m,h as e,i as u,v as f,j as a,k as r,t as i,ai as j,R as b,F as x,z as N,y as _e,l as he,aj as ve,w as we,ak as ge,_ as be}from"./index-e95f8522.js";/* empty css                                                                 */const xe=G`
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
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`,Ne=G`
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
    }

    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}`,ye={class:"flex whitespace-nowrap w-full"},Pe=e("span",{class:"text-gray-700 w-4/12"},"Patient Unique Identifier",-1),Ue={class:"w-full"},Se={class:"text-orange-600 w-4/12"},De={class:"flex whitespace-nowrap w-full"},Ie=e("span",{class:"text-gray-700 w-4/12"},"First Name",-1),Me={class:"w-full"},Be={class:"text-orange-600 w-4/12"},ke={class:"flex whitespace-nowrap mb-2 w-full"},Ee=e("span",{class:"text-gray-700 w-4/12"},"Middle Name",-1),Ve={class:"w-full"},Oe={class:"text-orange-600 w-4/12"},Ce={class:"flex whitespace-nowrap w-full"},qe=e("span",{class:"text-gray-700 w-4/12"},"Last Name",-1),Fe={class:"w-full"},Ae={class:"text-orange-600 w-4/12"},Re={class:"flex whitespace-nowrap mb-2 w-full"},Te=e("span",{class:"text-gray-700 w-4/12"},"Age",-1),$e={class:"w-full"},He={class:"text-orange-600 w-4/12"},Le={class:"flex whitespace-nowrap mb-2 w-full"},je=e("span",{class:"text-gray-700 w-4/12"},"Date of Birth",-1),Ge={class:"w-full"},ze={class:"text-orange-600 w-4/12"},We={class:"flex whitespace-nowrap mb-2 w-full"},Je=e("span",{class:"text-gray-700 w-4/12"},"Age/DOB Estimated?",-1),Ke={class:"w-full"},Qe={class:"text-orange-600 w-4/12"},Xe={class:"flex whitespace-nowrap mb-2 w-full"},Ye=e("span",{class:"text-gray-700 w-4/12"},"Gender",-1),Ze={class:"w-full"},et=e("option",null,null,-1),tt=["value"],st={class:"text-orange-600 w-4/12"},lt={class:"flex whitespace-nowrap mb-2 w-full"},at=e("span",{class:"text-gray-700 w-4/12"},"Mobile Number",-1),nt={class:"w-full"},it={class:"text-orange-600 w-4/12"},ot={class:"flex whitespace-nowrap mb-2 w-full"},dt=e("span",{class:"text-gray-700 w-4/12"},"Consent to SMS",-1),rt={class:"w-full"},ut={class:"text-orange-600 w-4/12"},ct={class:"flex whitespace-nowrap mb-2 w-full"},mt=e("span",{class:"text-gray-700 w-4/12"},"Primary Referrer",-1),pt={class:"w-full"},ft={class:"text-orange-600 w-4/12"},_t=e("hr",{class:"my-2"},null,-1),ht={class:"grid grid-cols-3 gap-x-4 mb-4"},vt={class:"flex items-center whitespace-nowrap col-span-1 mb-2 w-full"},wt=e("span",{class:"text-gray-700 w-4/12"},"Country",-1),gt=e("option",{value:null},null,-1),bt=["value"],xt={class:"flex items-center whitespace-nowrap col-span-1 mb-2 w-full"},Nt=e("span",{class:"text-gray-700 w-4/12"},"Province",-1),yt=e("option",{value:null},null,-1),Pt=["value"],Ut={class:"flex items-center whitespace-nowrap col-span-1 mb-2 w-full"},St=e("span",{class:"text-gray-700 w-4/12"},"District",-1),Dt=e("option",{value:null},null,-1),It=["value"],Mt={class:"text-orange-600 w-4/12"},Bt={class:"text-orange-600 w-4/12"},kt={class:"text-orange-600 w-4/12"},Et=e("hr",null,null,-1),Vt=e("button",{type:"submit",class:"-mb-4 w-1/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Patient ",-1),Ot=ae({__name:"PatientForm",props:{patient:Object,navigate:{type:Boolean,default:!1}},emits:["close"],setup(z,{emit:C}){const W=z;let q=ne(),v=ie(),F=oe();const{withClientMutation:A}=ge();let J=de(),K=re();const _=T({genders:["Male","Female","Missing","Trans Gender"],createAction:!0,countries:$(()=>v.getCountries),provinces:[],districts:[],clients:$(()=>q.getClients)});let Q=T({first:void 0,after:"",text:"",sortBy:["name"],filterAction:!1});ue(async()=>{await v.fetchCountries(),await q.fetchClients(Q)});const{patient:n,navigate:X}=ce(W),Y=H({uid:h(),clientPatientId:p().required("Client Patient ID is Required"),patientId:p().nullable(),firstName:p().required("First Name is Required"),middleName:p().nullable(),lastName:p().required("Last Name is Required"),client:H().required("Client is Required"),gender:p().required("Gender is Required"),age:h().nullable(),dateOfBirth:me().nullable(),ageDobEstimated:L().nullable(),phoneHome:p().nullable(),phoneMobile:p().nullable(),consentSms:L().nullable(),districtUid:h().nullable(),provinceUid:h().nullable(),countryUid:h().nullable()}),{handleSubmit:Z,errors:o}=pe({validationSchema:Y,initialValues:{uid:n?.value?.uid,clientPatientId:n?.value?.clientPatientId||K?.query?.cpid,patientId:n?.value?.patientId,firstName:n?.value?.firstName,middleName:n?.value?.middleName,lastName:n?.value?.lastName,client:n?.value?.client,gender:n?.value?.gender,age:n?.value?.age,dateOfBirth:fe(n?.value?.dateOfBirth)?void 0:new Date(n?.value?.dateOfBirth).toISOString().split("T")[0],ageDobEstimated:n?.value?.ageDobEstimated,phoneHome:n?.value?.phoneHome,phoneMobile:n?.value?.phoneMobile,consentSms:n?.value?.consentSms,districtUid:n?.value?.districtUid,provinceUid:n?.value?.provinceUid,countryUid:n?.value?.countryUid}}),{value:y}=d("clientPatientId"),{value:P}=d("firstName"),{value:U}=d("middleName"),{value:S}=d("lastName"),{value:D}=d("client"),{value:I}=d("gender"),{value:M}=d("age"),{value:B}=d("dateOfBirth"),{value:k}=d("ageDobEstimated"),{value:E}=d("phoneMobile"),{value:V}=d("consentSms"),{value:O}=d("districtUid"),{value:w}=d("provinceUid"),{value:g}=d("countryUid"),R=Z(l=>{console.log(l),l.uid||ee(l),l.uid&&te(l)});function ee(l){A(xe,{payload:{clientPatientId:l.clientPatientId,firstName:l.firstName,middleName:l.middleName,lastName:l.lastName,age:l.age,gender:l.gender,dateOfBirth:l.dateOfBirth,ageDobEstimated:l.ageDobEstimated,clientUid:l.client.uid,phoneMobile:l.phoneMobile,consentSms:l.consentSms}},"createPatient").then(s=>{F.addPatient(s),C("close"),X.value===!0&&J.push({name:"patient-detail",params:{patientUid:s.uid}})})}function te(l){A(Ne,{uid:l.uid,payload:{clientPatientId:l.clientPatientId,firstName:l.firstName,middleName:l.middleName,lastName:l.lastName,age:l.age,gender:l.gender,dateOfBirth:l.dateOfBirth,ageDobEstimated:l.ageDobEstimated,clientUid:l.client.uid,phoneMobile:l.phoneMobile,consentSms:l.consentSms}},"updatePatient").then(s=>{F.updatePatient(s),C("close",s)})}function se(l){v.filterProvincesByCountry(g.value)}function le(l){v.filterDistrictsByProvince(w.value)}return(l,s)=>(c(),m("form",{onSubmit:s[16]||(s[16]=we((...t)=>a(R)&&a(R)(...t),["prevent"])),class:"border-2 border-gray-900 border-dotted rounded-sm px-4 py-8",autocomplete:"off"},[e("label",ye,[Pe,e("div",Ue,[u(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[0]||(s[0]=t=>r(y)?y.value=t:null),placeholder:"Patient Unique Identifier"},null,512),[[f,a(y)]]),e("div",Se,i(a(o).clientPatientId),1)])]),e("label",De,[Ie,e("div",Me,[u(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":s[1]||(s[1]=t=>r(P)?P.value=t:null),placeholder:"First Name"},null,512),[[f,a(P)]]),e("div",Be,i(a(o).firstName),1)])]),e("label",ke,[Ee,e("div",Ve,[u(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":s[2]||(s[2]=t=>r(U)?U.value=t:null),placeholder:"Middle Name"},null,512),[[f,a(U)]]),e("div",Oe,i(a(o).middleName),1)])]),e("label",Ce,[qe,e("div",Fe,[u(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":s[3]||(s[3]=t=>r(S)?S.value=t:null),placeholder:"Last Name"},null,512),[[f,a(S)]]),e("div",Ae,i(a(o).lastName),1)])]),e("label",Re,[Te,e("div",$e,[u(e("input",{class:"form-input mt-1 w-full",type:"number","onUpdate:modelValue":s[4]||(s[4]=t=>r(M)?M.value=t:null),placeholder:"Age"},null,512),[[f,a(M)]]),e("div",He,i(a(o).age),1)])]),e("label",Le,[je,e("div",Ge,[u(e("input",{class:"form-input mt-1 w-full",type:"date","onUpdate:modelValue":s[5]||(s[5]=t=>r(B)?B.value=t:null),placeholder:"Date of Birth"},null,512),[[f,a(B)]]),e("div",ze,i(a(o).dateOfBirth),1)])]),e("label",We,[Je,e("div",Ke,[u(e("input",{type:"checkbox",class:"form-checkbox text-sky-800","onUpdate:modelValue":s[6]||(s[6]=t=>r(k)?k.value=t:null)},null,512),[[j,a(k)]]),e("div",Qe,i(a(o).ageDobEstimated),1)])]),e("label",Xe,[Ye,e("div",Ze,[u(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":s[7]||(s[7]=t=>r(I)?I.value=t:null)},[et,(c(!0),m(x,null,N(_.genders,t=>(c(),m("option",{key:t,value:t},i(t),9,tt))),128))],512),[[b,a(I)]]),e("div",st,i(a(o).gender),1)])]),e("label",lt,[at,e("div",nt,[u(e("input",{class:"form-input mt-1 w-full","onUpdate:modelValue":s[8]||(s[8]=t=>r(E)?E.value=t:null),placeholder:"Mobile Number"},null,512),[[f,a(E)]]),e("div",it,i(a(o).phoneMobile),1)])]),e("label",ot,[dt,e("div",rt,[u(e("input",{type:"checkbox",class:"form-checkbox text-sky-800","onUpdate:modelValue":s[9]||(s[9]=t=>r(V)?V.value=t:null)},null,512),[[j,a(V)]]),e("div",ut,i(a(o).consentSms),1)])]),_e(" other identifiers: passport, client pid, national id "),e("label",ct,[mt,e("div",pt,[he(a(ve),{placeholder:"Select a Primary Referrer",modelValue:a(D),"onUpdate:modelValue":s[10]||(s[10]=t=>r(D)?D.value=t:null),options:_.clients,searchable:!0,label:"name","track-by":"uid"},null,8,["modelValue","options"]),e("div",ft,i(a(o).client),1)])]),_t,e("div",ht,[e("label",vt,[wt,u(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":s[11]||(s[11]=t=>r(g)?g.value=t:null),onChange:s[12]||(s[12]=t=>se())},[gt,(c(!0),m(x,null,N(_.countries,t=>(c(),m("option",{key:t.uid,value:t.uid},i(t.name),9,bt))),128))],544),[[b,a(g)]])]),e("label",xt,[Nt,u(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":s[13]||(s[13]=t=>r(w)?w.value=t:null),onChange:s[14]||(s[14]=t=>le())},[yt,(c(!0),m(x,null,N(_.provinces,t=>(c(),m("option",{key:t.uid,value:t.uid},i(t.name),9,Pt))),128))],544),[[b,a(w)]])]),e("label",Ut,[St,u(e("select",{class:"form-select mt-1 w-full","onUpdate:modelValue":s[15]||(s[15]=t=>r(O)?O.value=t:null)},[Dt,(c(!0),m(x,null,N(_.districts,t=>(c(),m("option",{key:t.uid,value:t.uid},i(t.name),9,It))),128))],512),[[b,a(O)]])])]),e("div",Mt,i(a(o).countryUid),1),e("div",Bt,i(a(o).provinceUid),1),e("div",kt,i(a(o).districtUid),1),Et,Vt],32))}}),Ft=be(Ot,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/patient/PatientForm.vue"]]);export{Ft as P};
