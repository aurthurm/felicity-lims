import{g as _,S as E,a4 as T,f as A,ai as B,h as F,i as h,a7 as O,r as l,o as i,c as a,N as e,a as m,L as p,A as V,K as d,F as x,E as I,H as f,a5 as N,y as L,Z as P,af as U,$ as j,_ as R}from"./index-3686e2f1.js";import{u as Y}from"./notice-18897fec.js";import{u as q}from"./setup-613b4e8e.js";const le=_`
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
    `,me=_`
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
    `,H={class:"space-y-4"},K={class:"overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg"},Z={class:"min-w-full divide-y divide-border"},G={class:"divide-y divide-border bg-background"},J={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},Q={class:"flex items-center"},W=["onClick"],X={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},ee={class:"whitespace-nowrap px-3 py-4 text-sm text-right"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se={class:"text-lg font-medium text-foreground"},ie=E({__name:"Notices",setup(ae){const v=P(()=>j(()=>import("./NoticeForm-2328c140.js"),["assets/NoticeForm-2328c140.js","assets/index-3686e2f1.js","assets/index-f2df9813.css","assets/index-ff750461.js","assets/_baseForOwn-33007ed9.js","assets/merge-a1120275.js","assets/_isIterateeCall-1ed06e8a.js","assets/isArray-513c67aa.js","assets/mapValues-b7764e64.js","assets/isString-3d48de3a.js","assets/clone-98fb3be5.js","assets/_baseSet-274c0953.js","assets/index-25a679cd.css","assets/notice-18897fec.js","assets/index-31a85e3f.js","assets/array-b472961d.js","assets/setup-613b4e8e.js","assets/_queries-d6963687.js"]));let w=q();const r=Y(),b=T(),{withClientMutation:C}=A(),{fetchingNotices:$}=B(r),o=F({notice:{},title:"",showModal:!1,newNotice:!0}),y=h(()=>b?.auth?.user);O(async()=>{w.fetchDepartments({}),await r.fetchMyNotices(y.value?.uid)});async function S(s){await U.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&C(z,{uid:s},"deleteNotice").then(u=>r.deleteNotice(u))})}function c(s,t={}){o.showModal=!0,o.title=(s?"ADD":"EDIT")+" Notice",s?o.notice={}:o.notice={...t}}const k=h(()=>r.getMyNotices(y.value?.uid));return(s,t)=>{const u=l("fel-heading"),D=l("fel-loader"),M=l("fel-modal");return i(),a(x,null,[e("div",H,[m(u,{title:"Notice Manager"},{default:p(()=>[e("button",{onClick:t[0]||(t[0]=V(n=>c(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),d(" Notice Table View "),e("div",K,[e("table",Z,[t[3]||(t[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"px-3 py-3.5 text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",G,[(i(!0),a(x,null,I(k.value,n=>(i(),a("tr",{key:n.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",J,[e("div",Q,[e("div",{class:"cursor-pointer",onClick:g=>c(!1,n)},f(n.title),9,W)])]),e("td",X,f(n.status),1),e("td",ee,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:g=>c(!1,n)}," View/Edit ",8,te),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:g=>S(n.uid)}," Delete ",8,oe)])]))),128))])]),N($)?(i(),a("div",ne,[m(D,{message:"Fetching notices ..."})])):d("v-if",!0)])]),d(" Notice Form Modal "),o.showModal?(i(),L(M,{key:0,onClose:t[2]||(t[2]=n=>o.showModal=!1),"content-width":"w-1/2"},{header:p(()=>[e("h3",se,f(o.title),1)]),body:p(()=>[m(N(v),{notice:o.notice,onClose:t[1]||(t[1]=n=>o.showModal=!1)},null,8,["notice"])]),_:1})):d("v-if",!0)],64)}}}),re=R(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,me as E,pe as N};
