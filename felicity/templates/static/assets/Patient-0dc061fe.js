import{d as E,N as C,n as h,r as w,m as y,o as _,c as B,b as p,g as n,i as l,f as t,A as D,B as u,D as V,F as k,j as s,_ as i,k as A}from"./index-6a324368.js";const R={class:""},x=p("h3",null,"Patient Form",-1),F=E({__name:"Patient",setup(I){const m=s(()=>i(()=>import("./FelModal-ad52dd5c.js"),["assets/FelModal-ad52dd5c.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/FelModal-780aeea9.css"])),c=s(()=>i(()=>import("./PatientForm-e4dae133.js"),["assets/PatientForm-e4dae133.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/vue-multiselect.esm-f46a8c18.js","assets/patient.mutations-71a8948b.js","assets/array-315fc095.js","assets/vue-multiselect-a538cd7c.css"])),d=s(()=>i(()=>import("./PatientInfo-865cc4b7.js"),["assets/PatientInfo-865cc4b7.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/constants-94a3697a.js"])),f=C(),a=h();let e=w(!1);a.fetchPtientByUid(f.params.patientUid);const v=r=>{a.updatePatient(r),e.value=!1};return(r,o)=>{const P=y("router-view");return _(),B(k,null,[p("div",R,[n(t(d),{onEditPatient:o[0]||(o[0]=()=>l(e)?e.value=!0:e=!0)}),n(P)]),t(e)?(_(),D(t(m),{key:0,onClose:o[1]||(o[1]=N=>l(e)?e.value=!1:e=!1)},{header:u(()=>[x]),body:u(()=>[n(t(c),{patient:t(a).patient,navigate:!1,onClose:v},null,8,["patient"])]),_:1})):V("",!0)],64)}}}),g=A(F,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/patient/_id/Patient.vue"]]);export{g as default};
