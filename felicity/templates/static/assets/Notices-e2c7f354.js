import{g as f,S as E,a4 as A,f as B,ah as T,h as O,i as g,a7 as F,r as u,o as i,c as a,N as e,a as l,L as m,A as I,F as h,E as V,H as p,a5 as x,K as N,y as U,Z as L,ae as P,$ as j,_ as R}from"./index-54016222.js";import{u as Y}from"./notice-d890d235.js";import{u as q}from"./setup-20f4d78e.js";const le=f`
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
    `,me=f`
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
    `,z=f`
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
    `,H={class:"space-y-4"},K={class:"overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg"},Z={class:"min-w-full divide-y divide-border"},G={class:"divide-y divide-border bg-background"},J={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},Q={class:"flex items-center"},W=["onClick"],X={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},ee={class:"whitespace-nowrap px-3 py-4 text-sm text-right"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se={class:"text-lg font-medium text-foreground"},ie=E({__name:"Notices",setup(ae){const v=L(()=>j(()=>import("./NoticeForm-a29b8fcd.js"),["assets/NoticeForm-a29b8fcd.js","assets/index-54016222.js","assets/index-a1ed10d8.css","assets/index-d7491503.js","assets/_baseForOwn-47127574.js","assets/merge-cf81c653.js","assets/_isIterateeCall-77d89b8a.js","assets/isArray-513c67aa.js","assets/mapValues-b7d76680.js","assets/isString-bdefd96f.js","assets/clone-6fff1e0d.js","assets/_baseSet-572e3577.js","assets/index-25a679cd.css","assets/notice-d890d235.js","assets/index-f9df72b1.js","assets/array-7d74d738.js","assets/setup-20f4d78e.js","assets/_queries-7a4a5593.js"]));let w=q();const r=Y(),b=A(),{withClientMutation:C}=B(),{fetchingNotices:$}=T(r),o=O({notice:{},title:"",showModal:!1,newNotice:!0}),_=g(()=>b?.auth?.user);F(async()=>{w.fetchDepartments({}),await r.fetchMyNotices(_.value?.uid)});async function S(s){await P.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&C(z,{uid:s},"deleteNotice").then(c=>r.deleteNotice(c))})}function d(s,t={}){o.showModal=!0,o.title=(s?"ADD":"EDIT")+" Notice",s?o.notice={}:o.notice={...t}}const k=g(()=>r.getMyNotices(_.value?.uid));return(s,t)=>{const c=u("fel-heading"),D=u("fel-loader"),M=u("fel-modal");return i(),a(h,null,[e("div",H,[l(c,{title:"Notice Manager"},{default:m(()=>[e("button",{onClick:t[0]||(t[0]=I(n=>d(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),e("div",K,[e("table",Z,[t[3]||(t[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"px-3 py-3.5 text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",G,[(i(!0),a(h,null,V(k.value,n=>(i(),a("tr",{key:n.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",J,[e("div",Q,[e("div",{class:"cursor-pointer",onClick:y=>d(!1,n)},p(n.title),9,W)])]),e("td",X,p(n.status),1),e("td",ee,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:y=>d(!1,n)}," View/Edit ",8,te),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:y=>S(n.uid)}," Delete ",8,oe)])]))),128))])]),x($)?(i(),a("div",ne,[l(D,{message:"Fetching notices ..."})])):N("",!0)])]),o.showModal?(i(),U(M,{key:0,onClose:t[2]||(t[2]=n=>o.showModal=!1),"content-width":"w-1/2"},{header:m(()=>[e("h3",se,p(o.title),1)]),body:m(()=>[l(x(v),{notice:o.notice,onClose:t[1]||(t[1]=n=>o.showModal=!1)},null,8,["notice"])]),_:1})):N("",!0)],64)}}}),re=R(ie,[["__file","/Users/admin/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,me as E,pe as N};
