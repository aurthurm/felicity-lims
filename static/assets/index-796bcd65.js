import{ab as E,d as q,T as B,a5 as L,c as R,ae as j,a as M,af as P,al as T,b as z,e as h,o as p,g as _,h as e,i as k,v as $,j as n,k as D,t as m,w as O,ak as A,_ as U,am as G,n as H,s as J,A as K,aa as S,q as Q,y as N,F,z as W,l as I,D as X,E as V,I as Y,L as Z}from"./index-32219e1a.js";const ee=E`
  mutation AddNotice($payload: NoticeInputType!) {
    createNotice(payload: $payload){
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
`,te=E`
  mutation editNotice($uid: FelicityID!, $payload: NoticeInputType!){
    updateNotice(uid: $uid, payload: $payload){
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
`,oe=E`
  mutation deleteNotice($uid: FelicityID!){
    deleteNotice(uid: $uid){
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
  `,se={class:"grid grid-cols-2 gap-x-4 mb-4"},ie={class:"block col-span-2 mb-2"},re=e("span",{class:"text-gray-700"},"Title",-1),ne={class:"text-orange-600 w-4/12"},ae={class:"block col-span-2 mb-2"},le=e("span",{class:"text-gray-700"},"Body",-1),de={class:"text-orange-600 w-4/12"},ce={class:"block col-span-2 mb-2"},ue=e("span",{class:"text-gray-700"},"Expiration",-1),pe={class:"text-orange-600 w-4/12"},me=e("hr",null,null,-1),ye=e("button",{type:"submit",class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ",-1),be=q({__name:"NoticeForm",props:{notice:Object},emits:["close"],setup(C,{emit:g}){const u=C,{withClientMutation:x}=A(),f=B(),{notice:l}=L(u),i=R({uid:j(),title:M().required("Notice is required"),body:M().required("Notice body message is required"),expiry:P().required("Expiry is required").typeError("Invalid Date format"),groups:T(),departments:T()}),{handleSubmit:v,errors:y}=z({validationSchema:i,initialValues:{uid:l?.value?.uid,title:l?.value?.title,body:l?.value?.body,expiry:l?.value?.expiry,groups:l?.value?.groups,departments:l?.value?.departments}}),{value:d}=h("title"),{value:b}=h("body"),{value:a}=h("expiry");h("groups"),h("departments");const o=v(t=>{t.uid||r(t),t.uid&&w(t)});function r(t){x(ee,{payload:{title:t.title,body:t.body,expiry:t.expiry,groups:t.groups||[],departments:t.departments||[]}},"createNotice").then(s=>{f.addNotice(s),g("close")})}function w(t){x(te,{uid:t.uid,payload:{title:t.title,body:t.body,expiry:t.expiry,groups:t.groups||[],departments:t.departments||[]}},"updateNotice").then(s=>{f.updateNotice(s),g("close")})}return(t,s)=>(p(),_("form",{action:"post",class:"p-1",onSubmit:s[3]||(s[3]=O((...c)=>n(o)&&n(o)(...c),["prevent"]))},[e("div",se,[e("label",ie,[re,k(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[0]||(s[0]=c=>D(d)?d.value=c:null),placeholder:"Name ..."},null,512),[[$,n(d)]]),e("div",ne,m(n(y).title),1)]),e("label",ae,[le,k(e("textarea",{class:"form-input mt-1 block w-full",rows:"5","onUpdate:modelValue":s[1]||(s[1]=c=>D(b)?b.value=c:null),placeholder:"Name ..."},null,512),[[$,n(b)]]),e("div",de,m(n(y).body),1)]),e("label",ce,[ue,k(e("input",{class:"form-input mt-1 block w-full",type:"datetime-local","onUpdate:modelValue":s[2]||(s[2]=c=>D(a)?a.value=c:null),placeholder:"Name ..."},null,512),[[$,n(a)]]),e("div",pe,m(n(y).expiry),1)])]),me,ye],32))}}),he=U(be,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/notice/NoticeForm.vue"]]),_e=e("h1",{class:"h1 my-4 font-bold text-dark-700 mr-4"},"Notice Manager",-1),ge={class:"overflow-x-auto mt-4"},xe={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},fe={class:"min-w-full"},ve=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),we={class:"bg-white"},Ne={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ke={class:"flex items-center"},$e=["onClick"],De={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},Ce=["onClick"],Me=["onClick"],Te={key:0,class:"py-4 text-center"},Se=q({__name:"index",setup(C){let g=G();const u=B(),x=H(),{withClientMutation:f}=A(),{fetchingNotices:l}=J(u),i=K({notice:{},title:"",showModal:!1,newNotice:!0}),v=S(()=>x?.auth?.user);Q(async()=>{g.fetchDepartments({}),await u.fetchMyNotices(v.value?.uid)});function y(a){f(oe,{uid:a},"deleteNotice").then(o=>u.deleteNotice(o))}function d(a,o={}){i.showModal=!0,i.title=(a?"ADD":"EDIT")+" Notice",a?i.notice={}:i.notice={...o}}const b=S(()=>u.getMyNotices(v.value?.uid));return(a,o)=>(p(),_(F,null,[_e,e("button",{onClick:o[0]||(o[0]=O(r=>d(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),N(" Notice Table View "),e("div",ge,[e("div",xe,[e("table",fe,[ve,e("tbody",we,[(p(!0),_(F,null,W(n(b),r=>(p(),_("tr",{key:r.uid},[e("td",Ne,[e("div",ke,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:w=>d(!1,r)},m(r.title),9,$e)])]),e("td",De,m(r.status),1),e("td",Ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:w=>d(!1,r)}," View/Edit ",8,Ce),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:w=>y(r.uid)}," Delete ",8,Me)])]))),128))])]),n(l)?(p(),_("div",Te,[I(Z,{message:"Fetching notices ..."})])):N("v-if",!0)])]),N(" Notice Form Modal "),i.showModal?(p(),X(Y,{key:0,onClose:o[2]||(o[2]=r=>i.showModal=!1)},{header:V(()=>[e("h3",null,m(i.title),1)]),body:V(()=>[I(he,{notice:i.notice,onClose:o[1]||(o[1]=r=>i.showModal=!1)},null,8,["notice"])]),_:1})):N("v-if",!0)],64))}}),Ie=U(Se,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/notice/index.vue"]]);export{Ie as default};
