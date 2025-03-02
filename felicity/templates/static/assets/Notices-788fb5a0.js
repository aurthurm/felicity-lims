import{H as y,d as $,l as A,I as B,s as I,n as O,p as b,q as V,o as r,c as d,g as _,f as s,b as e,w as P,y as c,F as f,C as F,z as L,A as w,t as m,j as l,_ as u,S as R,k as j}from"./index-68ba4247.js";import{u as U}from"./notice-22807baf.js";import{u as q}from"./setup-a704442f.js";const le=y`
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
    `,ue=y`
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
    `,z=y`
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
    `,H={class:"overflow-x-auto mt-4"},Y={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},G={class:"min-w-full"},J=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),K={class:"bg-white"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"flex items-center"},X=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},ie=$({__name:"Notices",setup(se){const x=l(()=>u(()=>import("./index-68ba4247.js").then(i=>i.br),["assets/index-68ba4247.js","assets/index-d6482eee.css"])),N=l(()=>u(()=>import("./FelLoadingMessage-98edf6b0.js"),["assets/FelLoadingMessage-98edf6b0.js","assets/index-68ba4247.js","assets/index-d6482eee.css"])),v=l(()=>u(()=>import("./NoticeForm-b5110764.js"),["assets/NoticeForm-b5110764.js","assets/index-68ba4247.js","assets/index-d6482eee.css","assets/index-536f8712.js","assets/isArray-513c67aa.js","assets/index-25a679cd.css","assets/notice-22807baf.js","assets/array-71d713d1.js","assets/setup-a704442f.js","assets/_queries-6796a35a.js"])),k=l(()=>u(()=>import("./index-68ba4247.js").then(i=>i.bs),["assets/index-68ba4247.js","assets/index-d6482eee.css"]));let C=q();const a=U(),D=A(),{withClientMutation:E}=B(),{fetchingNotices:M}=I(a),n=O({notice:{},title:"",showModal:!1,newNotice:!0}),g=b(()=>D?.auth?.user);V(async()=>{C.fetchDepartments({}),await a.fetchMyNotices(g.value?.uid)});async function S(i){await R.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&E(z,{uid:i},"deleteNotice").then(t=>a.deleteNotice(t))})}function p(i,o={}){n.showModal=!0,n.title=(i?"ADD":"EDIT")+" Notice",i?n.notice={}:n.notice={...o}}const T=b(()=>a.getMyNotices(g.value?.uid));return(i,o)=>(r(),d(f,null,[_(s(x),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=P(t=>p(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),c(" Notice Table View "),e("div",H,[e("div",Y,[e("table",G,[J,e("tbody",K,[(r(!0),d(f,null,F(T.value,t=>(r(),d("tr",{key:t.uid},[e("td",Q,[e("div",W,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:h=>p(!1,t)},m(t.title),9,X)])]),e("td",Z,m(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:h=>p(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:h=>S(t.uid)}," Delete ",8,oe)])]))),128))])]),s(M)?(r(),d("div",ne,[_(s(N),{message:"Fetching notices ..."})])):c("v-if",!0)])]),c(" Notice Form Modal "),n.showModal?(r(),L(s(k),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1),"content-width":"w-1/2"},{header:w(()=>[e("h3",null,m(n.title),1)]),body:w(()=>[_(s(v),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):c("v-if",!0)],64))}}),re=j(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,ue as E,pe as N};
