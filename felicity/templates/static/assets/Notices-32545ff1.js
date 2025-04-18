import{g as _,P as T,a8 as A,e as B,ai as O,f as I,h,aa as P,o as r,c as d,a as p,a2 as s,b as e,z as V,F as b,D as L,J as f,x as F,K as x,E as m,X as l,Y as c,S as R,_ as U}from"./index-03a7f0eb.js";import{u as Y}from"./notice-bd7b20da.js";import{u as j}from"./setup-4fedd75c.js";const le=_`
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
    `,ce=_`
    mutation editNotice($uid: String!, $payload: NoticeInputType!) {
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
    `,z=_`
    mutation deleteNotice($uid: String!) {
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
    `,q={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},J={class:"min-w-full"},K={class:"bg-white"},X={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},G={class:"flex items-center"},Q=["onClick"],W={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},ee=["onClick"],te=["onClick"],oe={key:0,class:"py-4 text-center"},ne=T({__name:"Notices",setup(re){const w=l(()=>c(()=>import("./index-03a7f0eb.js").then(i=>i.cM),["assets/index-03a7f0eb.js","assets/index-81d3252e.css"])),N=l(()=>c(()=>import("./FelLoadingMessage-343c7df3.js"),["assets/FelLoadingMessage-343c7df3.js","assets/index-03a7f0eb.js","assets/index-81d3252e.css"])),v=l(()=>c(()=>import("./NoticeForm-27dedcad.js"),["assets/NoticeForm-27dedcad.js","assets/index-03a7f0eb.js","assets/index-81d3252e.css","assets/index-5f6f66c3.js","assets/_baseForOwn-656fabb0.js","assets/merge-2849153f.js","assets/_isIterateeCall-6b47236c.js","assets/isArray-513c67aa.js","assets/mapValues-81d27fb1.js","assets/isString-588a66cc.js","assets/clone-e28103f1.js","assets/_baseSet-32e3b41c.js","assets/index-25a679cd.css","assets/notice-bd7b20da.js","assets/array-9b204d8d.js","assets/setup-4fedd75c.js","assets/_queries-175415ec.js"])),k=l(()=>c(()=>import("./index-03a7f0eb.js").then(i=>i.cN),["assets/index-03a7f0eb.js","assets/index-81d3252e.css"]));let C=j();const a=Y(),D=A(),{withClientMutation:E}=B(),{fetchingNotices:M}=O(a),n=I({notice:{},title:"",showModal:!1,newNotice:!0}),y=h(()=>D?.auth?.user);P(async()=>{C.fetchDepartments({}),await a.fetchMyNotices(y.value?.uid)});async function S(i){await R.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&E(z,{uid:i},"deleteNotice").then(o=>a.deleteNotice(o))})}function u(i,t={}){n.showModal=!0,n.title=(i?"ADD":"EDIT")+" Notice",i?n.notice={}:n.notice={...t}}const $=h(()=>a.getMyNotices(y.value?.uid));return(i,t)=>(r(),d(b,null,[p(s(w),{title:"Notice Manager"}),e("button",{onClick:t[0]||(t[0]=V(o=>u(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),e("div",q,[e("div",H,[e("table",J,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1)),e("tbody",K,[(r(!0),d(b,null,L($.value,o=>(r(),d("tr",{key:o.uid},[e("td",X,[e("div",G,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:g=>u(!1,o)},m(o.title),9,Q)])]),e("td",W,m(o.status),1),e("td",Z,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:g=>u(!1,o)}," View/Edit ",8,ee),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:g=>S(o.uid)}," Delete ",8,te)])]))),128))])]),s(M)?(r(),d("div",oe,[p(s(N),{message:"Fetching notices ..."})])):f("",!0)])]),n.showModal?(r(),F(s(k),{key:0,onClose:t[2]||(t[2]=o=>n.showModal=!1),"content-width":"w-1/2"},{header:x(()=>[e("h3",null,m(n.title),1)]),body:x(()=>[p(s(v),{notice:n.notice,onClose:t[1]||(t[1]=o=>n.showModal=!1)},null,8,["notice"])]),_:1})):f("",!0)],64))}}),ie=U(ne,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),ue=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"}));export{le as A,ce as E,ue as N};
