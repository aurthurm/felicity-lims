import{g as m,P as T,a8 as A,e as B,ai as O,f as I,h,aa as P,o as r,c as d,a as p,a2 as s,b as e,z as V,F as b,D as L,J as f,x as F,K as x,E as _,X as c,Y as l,S as R,_ as U}from"./index-fa13e788.js";import{u as Y}from"./notice-8d0545bb.js";import{u as j}from"./setup-8d8c5945.js";const le=m`
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
    `,ue=m`
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
    `,z=m`
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
    `,q={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},J={class:"min-w-full"},K=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),X={class:"bg-white"},G={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Q={class:"flex items-center"},W=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},ie=T({__name:"Notices",setup(se){const w=c(()=>l(()=>import("./index-fa13e788.js").then(i=>i.cM),["assets/index-fa13e788.js","assets/index-ccc6a521.css"])),N=c(()=>l(()=>import("./FelLoadingMessage-c4848162.js"),["assets/FelLoadingMessage-c4848162.js","assets/index-fa13e788.js","assets/index-ccc6a521.css"])),v=c(()=>l(()=>import("./NoticeForm-cfbd1472.js"),["assets/NoticeForm-cfbd1472.js","assets/index-fa13e788.js","assets/index-ccc6a521.css","assets/index-7d84edd6.js","assets/_baseForOwn-f09f6708.js","assets/merge-9af0dc11.js","assets/_isIterateeCall-63f093c4.js","assets/isArray-513c67aa.js","assets/mapValues-17240bfb.js","assets/isString-5d6832c3.js","assets/clone-304ea981.js","assets/_baseSet-8f475b6b.js","assets/index-25a679cd.css","assets/notice-8d0545bb.js","assets/array-5698c257.js","assets/setup-8d8c5945.js","assets/_queries-fa6c96fd.js"])),k=c(()=>l(()=>import("./index-fa13e788.js").then(i=>i.cN),["assets/index-fa13e788.js","assets/index-ccc6a521.css"]));let C=j();const a=Y(),D=A(),{withClientMutation:E}=B(),{fetchingNotices:M}=O(a),n=I({notice:{},title:"",showModal:!1,newNotice:!0}),y=h(()=>D?.auth?.user);P(async()=>{C.fetchDepartments({}),await a.fetchMyNotices(y.value?.uid)});async function S(i){await R.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&E(z,{uid:i},"deleteNotice").then(t=>a.deleteNotice(t))})}function u(i,o={}){n.showModal=!0,n.title=(i?"ADD":"EDIT")+" Notice",i?n.notice={}:n.notice={...o}}const $=h(()=>a.getMyNotices(y.value?.uid));return(i,o)=>(r(),d(b,null,[p(s(w),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=V(t=>u(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),e("div",q,[e("div",H,[e("table",J,[K,e("tbody",X,[(r(!0),d(b,null,L($.value,t=>(r(),d("tr",{key:t.uid},[e("td",G,[e("div",Q,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:g=>u(!1,t)},_(t.title),9,W)])]),e("td",Z,_(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:g=>u(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:g=>S(t.uid)}," Delete ",8,oe)])]))),128))])]),s(M)?(r(),d("div",ne,[p(s(N),{message:"Fetching notices ..."})])):f("",!0)])]),n.showModal?(r(),F(s(k),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1),"content-width":"w-1/2"},{header:x(()=>[e("h3",null,_(n.title),1)]),body:x(()=>[p(s(v),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):f("",!0)],64))}}),re=U(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,ue as E,pe as N};
