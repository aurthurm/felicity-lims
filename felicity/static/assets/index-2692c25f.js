import{al as E,d as V,T as q,a7 as L,c as P,ae as R,a as M,af as j,am as S,b as Y,e as h,o as p,g,h as e,i as k,v as $,j as r,k as C,t as m,w as A,ak as O,_ as U,an as z,n as H,s as W,A as G,U as F,q as J,l as D,y as N,F as B,z as K,D as Q,E as I,I as X,W as Z,L as ee,ao as te}from"./index-cd9e6ac8.js";const oe=E`
    mutation AddNotice($payload: NoticeInputType!) {
        createNotice(payload: $payload) {
            ... on NoticeType {
                __typename
                uid
                title
                body
                expiry
                createdByUid
                departments {
                    uid
                    name
                }
                groups {
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
    }
`,se=E`
    mutation editNotice($uid: str!, $payload: NoticeInputType!) {
        updateNotice(uid: $uid, payload: $payload) {
            ... on NoticeType {
                __typename
                uid
                title
                body
                expiry
                createdByUid
                departments {
                    uid
                    name
                }
                groups {
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
    }
`,ie=E`
    mutation deleteNotice($uid: str!) {
        deleteNotice(uid: $uid) {
            ... on DeletedItem {
                __typename
                uid
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,ne={class:"grid grid-cols-2 gap-x-4 mb-4"},re={class:"block col-span-2 mb-2"},ae=e("span",{class:"text-gray-700"},"Title",-1),le={class:"text-orange-600 w-4/12"},de={class:"block col-span-2 mb-2"},ce=e("span",{class:"text-gray-700"},"Body",-1),ue={class:"text-orange-600 w-4/12"},pe={class:"block col-span-2 mb-2"},me=e("span",{class:"text-gray-700"},"Expiration",-1),ye={class:"text-orange-600 w-4/12"},be=e("hr",null,null,-1),he=e("button",{type:"submit",class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ",-1),ge=V({__name:"NoticeForm",props:{notice:Object},emits:["close"],setup(T,{emit:_}){const u=T,{withClientMutation:x}=O(),f=q(),{notice:l}=L(u),n=P({uid:R(),title:M().required("Notice is required"),body:M().required("Notice body message is required"),expiry:j().required("Expiry is required").typeError("Invalid Date format"),groups:S(),departments:S()}),{handleSubmit:v,errors:y}=Y({validationSchema:n,initialValues:{uid:l?.value?.uid,title:l?.value?.title,body:l?.value?.body,expiry:l?.value?.expiry,groups:l?.value?.groups,departments:l?.value?.departments}}),{value:d}=h("title"),{value:b}=h("body"),{value:a}=h("expiry");h("groups"),h("departments");const o=v(t=>{t.uid||s(t),t.uid&&w(t)});function s(t){x(oe,{payload:{title:t.title,body:t.body,expiry:t.expiry,groups:t.groups||[],departments:t.departments||[]}},"createNotice").then(i=>{f.addNotice(i),_("close")})}function w(t){x(se,{uid:t.uid,payload:{title:t.title,body:t.body,expiry:t.expiry,groups:t.groups||[],departments:t.departments||[]}},"updateNotice").then(i=>{f.updateNotice(i),_("close")})}return(t,i)=>(p(),g("form",{action:"post",class:"p-1",onSubmit:i[3]||(i[3]=A((...c)=>r(o)&&r(o)(...c),["prevent"]))},[e("div",ne,[e("label",re,[ae,k(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":i[0]||(i[0]=c=>C(d)?d.value=c:null),placeholder:"Name ..."},null,512),[[$,r(d)]]),e("div",le,m(r(y).title),1)]),e("label",de,[ce,k(e("textarea",{class:"form-input mt-1 block w-full",rows:"5","onUpdate:modelValue":i[1]||(i[1]=c=>C(b)?b.value=c:null),placeholder:"Name ..."},null,512),[[$,r(b)]]),e("div",ue,m(r(y).body),1)]),e("label",pe,[me,k(e("input",{class:"form-input mt-1 block w-full",type:"datetime-local","onUpdate:modelValue":i[2]||(i[2]=c=>C(a)?a.value=c:null),placeholder:"Name ..."},null,512),[[$,r(a)]]),e("div",ye,m(r(y).expiry),1)])]),be,he],32))}}),_e=U(ge,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/notice/NoticeForm.vue"]]),xe={class:"overflow-x-auto mt-4"},fe={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},ve={class:"min-w-full"},we=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),Ne={class:"bg-white"},ke={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},$e={class:"flex items-center"},Ce=["onClick"],De={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},Te=["onClick"],Me=["onClick"],Se={key:0,class:"py-4 text-center"},Fe=V({__name:"index",setup(T){let _=z();const u=q(),x=H(),{withClientMutation:f}=O(),{fetchingNotices:l}=W(u),n=G({notice:{},title:"",showModal:!1,newNotice:!0}),v=F(()=>x?.auth?.user);J(async()=>{_.fetchDepartments({}),await u.fetchMyNotices(v.value?.uid)});async function y(a){await te.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&f(ie,{uid:a},"deleteNotice").then(s=>u.deleteNotice(s))})}function d(a,o={}){n.showModal=!0,n.title=(a?"ADD":"EDIT")+" Notice",a?n.notice={}:n.notice={...o}}const b=F(()=>u.getMyNotices(v.value?.uid));return(a,o)=>(p(),g(B,null,[D(Z,{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=A(s=>d(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),N(" Notice Table View "),e("div",xe,[e("div",fe,[e("table",ve,[we,e("tbody",Ne,[(p(!0),g(B,null,K(r(b),s=>(p(),g("tr",{key:s.uid},[e("td",ke,[e("div",$e,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:w=>d(!1,s)},m(s.title),9,Ce)])]),e("td",De,m(s.status),1),e("td",Ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:w=>d(!1,s)}," View/Edit ",8,Te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:w=>y(s.uid)}," Delete ",8,Me)])]))),128))])]),r(l)?(p(),g("div",Se,[D(ee,{message:"Fetching notices ..."})])):N("v-if",!0)])]),N(" Notice Form Modal "),n.showModal?(p(),Q(X,{key:0,onClose:o[2]||(o[2]=s=>n.showModal=!1)},{header:I(()=>[e("h3",null,m(n.title),1)]),body:I(()=>[D(_e,{notice:n.notice,onClose:o[1]||(o[1]=s=>n.showModal=!1)},null,8,["notice"])]),_:1})):N("v-if",!0)],64))}}),Ie=U(Fe,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/notice/index.vue"]]);export{Ie as default};
