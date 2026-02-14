const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NoticeForm-D_JCg3dI.js","assets/index-B3ZheI5m.js","assets/index-C_1sfwqa.css","assets/index-BQ5jAWaE.js","assets/index-CxNZi_Cj.css","assets/notice-HYTHE_tw.js","assets/index-BXPsnD2P.js","assets/index.esm-C1wdlr_y.js","assets/setup-DpgcXA6u.js"])))=>i.map(i=>d[i]);
import{k as h,a0 as D,ab as E,f as A,aq as B,g as T,h as v,ad as F,a1 as O,a6 as $,aQ as I,_ as V,r as f,c as l,o as a,A as e,C as P,E as x,a as _,N as g,D as j,J as w,K as L,L as y}from"./index-B3ZheI5m.js";import{u as U}from"./notice-HYTHE_tw.js";import{u as q}from"./setup-DpgcXA6u.js";const ce=h`
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
    `,le=h`
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
    `,R=h`
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
    `,Y=D({__name:"Notices",setup(k,{expose:n}){n();const b=O(()=>$(()=>import("./NoticeForm-D_JCg3dI.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8])));let t=q();const i=U(),u=E(),{withClientMutation:d}=A(),{fetchingNotices:m}=B(i),r=T({notice:{},title:"",showModal:!1,newNotice:!0}),o=v(()=>u?.auth?.user);F(async()=>{t.fetchDepartments({}),await i.fetchMyNotices(o.value?.uid)});async function c(s){await I.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"hsl(var(--primary))",cancelButtonColor:"hsl(var(--destructive))",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async p=>{p.isConfirmed&&d(R,{uid:s},"deleteNotice").then(M=>i.deleteNotice(M))})}function S(s,p={}){r.showModal=!0,r.title=(s?"ADD":"EDIT")+"Notice",s?r.notice={}:r.notice={...p}}const C=v(()=>i.getMyNotices(o.value?.uid)),N={NoticeForm:b,get setupStore(){return t},set setupStore(s){t=s},noticeStore:i,authStore:u,withClientMutation:d,fetchingNotices:m,modalState:r,user:o,deleteNotice:c,FormManager:S,notices:C};return Object.defineProperty(N,"__isScriptSetup",{enumerable:!1,value:!0}),N}}),z={class:"space-y-4"},J={class:"overflow-hidden shadow ring-1 ring-border ring-opacity/5 rounded-lg"},K={class:"min-w-full divide-y divide-border beak-table"},Q={class:"divide-y divide-border bg-background"},G={class:"whitespace-nowrap text-sm text-foreground"},H={class:"flex items-center"},W=["onClick"],X={class:"whitespace-nowrap text-sm text-foreground"},Z={class:"whitespace-nowrap text-sm text-right"},ee=["onClick"],te=["onClick"],oe={key:0,class:"py-4 text-center"},ne={class:"text-lg font-medium text-foreground"};function re(k,n,b,t,i,u){const d=f("beak-heading"),m=f("beak-loader"),r=f("beak-modal");return a(),l(w,null,[e("div",z,[_(d,{title:"Notice Manager"},{default:g(()=>[e("button",{onClick:n[0]||(n[0]=j(o=>t.FormManager(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),e("div",J,[e("table",K,[n[3]||(n[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",Q,[(a(!0),l(w,null,L(t.notices,o=>(a(),l("tr",{key:o.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",G,[e("div",H,[e("div",{class:"cursor-pointer",onClick:c=>t.FormManager(!1,o)},y(o.title),9,W)])]),e("td",X,y(o.status),1),e("td",Z,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:c=>t.FormManager(!1,o)}," View/Edit ",8,ee),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:c=>t.deleteNotice(o.uid)}," Delete ",8,te)])]))),128))])]),t.fetchingNotices?(a(),l("div",oe,[_(m,{message:"Fetching notices ..."})])):x("",!0)])]),t.modalState.showModal?(a(),P(r,{key:0,onClose:n[2]||(n[2]=o=>t.modalState.showModal=!1),"content-width":"w-1/2"},{header:g(()=>[e("h3",ne,y(t.modalState.title),1)]),body:g(()=>[_(t.NoticeForm,{notice:t.modalState.notice,onClose:n[1]||(n[1]=o=>t.modalState.showModal=!1)},null,8,["notice"])]),_:1})):x("",!0)],64)}const ie=V(Y,[["render",re],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),ue=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"}));export{ce as A,le as E,ue as N};
