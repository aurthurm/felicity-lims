import{H as m,d as T,l as A,I as B,s as I,n as O,p as h,q as V,o as s,c as d,g as p,f as r,b as e,w as P,F as b,C as L,B as f,y as F,z as x,t as _,j as c,_ as l,S as R,k as j}from"./index-52cc981d.js";import{u as U}from"./notice-da32db49.js";import{u as q}from"./setup-e28efb7a.js";const le=m`
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
    `,H={class:"overflow-x-auto mt-4"},Y={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},G={class:"min-w-full"},J=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),K={class:"bg-white"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"flex items-center"},X=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},ie=T({__name:"Notices",setup(re){const w=c(()=>l(()=>import("./FelPageHeading-05abdbbe.js"),["assets/FelPageHeading-05abdbbe.js","assets/index-52cc981d.js","assets/index-8ef91573.css"])),N=c(()=>l(()=>import("./FelLoadingMessage-71b84510.js"),["assets/FelLoadingMessage-71b84510.js","assets/index-52cc981d.js","assets/index-8ef91573.css"])),v=c(()=>l(()=>import("./NoticeForm-d859eaf8.js"),["assets/NoticeForm-d859eaf8.js","assets/index-52cc981d.js","assets/index-8ef91573.css","assets/notice-da32db49.js","assets/array-0f72becb.js","assets/isArray-513c67aa.js","assets/setup-e28efb7a.js","assets/_queries-75acebab.js","assets/NoticeForm-25a679cd.css"])),k=c(()=>l(()=>import("./FelModal-2b9d991a.js"),["assets/FelModal-2b9d991a.js","assets/index-52cc981d.js","assets/index-8ef91573.css","assets/FelModal-780aeea9.css"]));let C=q();const a=U(),D=A(),{withClientMutation:E}=B(),{fetchingNotices:S}=I(a),n=O({notice:{},title:"",showModal:!1,newNotice:!0}),y=h(()=>D?.auth?.user);V(async()=>{C.fetchDepartments({}),await a.fetchMyNotices(y.value?.uid)});async function $(i){await R.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&E(z,{uid:i},"deleteNotice").then(t=>a.deleteNotice(t))})}function u(i,o={}){n.showModal=!0,n.title=(i?"ADD":"EDIT")+" Notice",i?n.notice={}:n.notice={...o}}const M=h(()=>a.getMyNotices(y.value?.uid));return(i,o)=>(s(),d(b,null,[p(r(w),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=P(t=>u(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),e("div",H,[e("div",Y,[e("table",G,[J,e("tbody",K,[(s(!0),d(b,null,L(M.value,t=>(s(),d("tr",{key:t.uid},[e("td",Q,[e("div",W,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:g=>u(!1,t)},_(t.title),9,X)])]),e("td",Z,_(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:g=>u(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:g=>$(t.uid)}," Delete ",8,oe)])]))),128))])]),r(S)?(s(),d("div",ne,[p(r(N),{message:"Fetching notices ..."})])):f("",!0)])]),n.showModal?(s(),F(r(k),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1),"content-width":"w-1/2"},{header:x(()=>[e("h3",null,_(n.title),1)]),body:x(()=>[p(r(v),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):f("",!0)],64))}}),se=j(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:se},Symbol.toStringTag,{value:"Module"}));export{le as A,ue as E,pe as N};
