const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NoticeForm-UT7uafYF.js","assets/index-DCVfsbos.js","assets/index-C_1sfwqa.css","assets/index-BQ5jAWaE.js","assets/index-CxNZi_Cj.css","assets/notice-CbZMMqdg.js","assets/index-Cw3weLtk.js","assets/index.esm-89YX2EbQ.js","assets/setup-DMRnqeyP.js"])))=>i.map(i=>d[i]);
import{k as b,a0 as D,ab as E,f as T,aq as A,g as B,h as x,ad as F,a1 as O,a6 as $,aQ as V,_ as I,r as _,c as l,o as a,A as e,E as u,C as P,a as g,N as y,D as j,J as w,K as L,L as h}from"./index-DCVfsbos.js";import{u as U}from"./notice-CbZMMqdg.js";import{u as q}from"./setup-DMRnqeyP.js";const ce=b`
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
    `,le=b`
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
    `,R=b`
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
    `,Y=D({__name:"Notices",setup(k,{expose:n}){n();const N=O(()=>$(()=>import("./NoticeForm-UT7uafYF.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8])));let t=q();const r=U(),m=E(),{withClientMutation:d}=T(),{fetchingNotices:p}=A(r),i=B({notice:{},title:"",showModal:!1,newNotice:!0}),o=x(()=>m?.auth?.user);F(async()=>{t.fetchDepartments({}),await r.fetchMyNotices(o.value?.uid)});async function c(s){await V.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"hsl(var(--primary))",cancelButtonColor:"hsl(var(--destructive))",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async f=>{f.isConfirmed&&d(R,{uid:s},"deleteNotice").then(M=>r.deleteNotice(M))})}function S(s,f={}){i.showModal=!0,i.title=(s?"ADD":"EDIT")+"Notice",s?i.notice={}:i.notice={...f}}const C=x(()=>r.getMyNotices(o.value?.uid)),v={NoticeForm:N,get setupStore(){return t},set setupStore(s){t=s},noticeStore:r,authStore:m,withClientMutation:d,fetchingNotices:p,modalState:i,user:o,deleteNotice:c,FormManager:S,notices:C};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}}),z={class:"space-y-4"},J={class:"overflow-hidden shadow ring-1 ring-border ring-opacity/5 rounded-lg"},K={class:"min-w-full divide-y divide-border beak-table"},Q={class:"divide-y divide-border bg-background"},G={class:"whitespace-nowrap text-sm text-foreground"},H={class:"flex items-center"},W=["onClick"],X={class:"whitespace-nowrap text-sm text-foreground"},Z={class:"whitespace-nowrap text-sm text-right"},ee=["onClick"],te=["onClick"],oe={key:0,class:"py-4 text-center"},ne={class:"text-lg font-medium text-foreground"};function ie(k,n,N,t,r,m){const d=_("beak-heading"),p=_("beak-loader"),i=_("beak-modal");return a(),l(w,null,[e("div",z,[g(d,{title:"Notice Manager"},{default:y(()=>[e("button",{onClick:n[0]||(n[0]=j(o=>t.FormManager(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),u(" Notice Table View "),e("div",J,[e("table",K,[n[3]||(n[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",Q,[(a(!0),l(w,null,L(t.notices,o=>(a(),l("tr",{key:o.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",G,[e("div",H,[e("div",{class:"cursor-pointer",onClick:c=>t.FormManager(!1,o)},h(o.title),9,W)])]),e("td",X,h(o.status),1),e("td",Z,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:c=>t.FormManager(!1,o)}," View/Edit ",8,ee),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:c=>t.deleteNotice(o.uid)}," Delete ",8,te)])]))),128))])]),t.fetchingNotices?(a(),l("div",oe,[g(p,{message:"Fetching notices ..."})])):u("v-if",!0)])]),u(" Notice Form Modal "),t.modalState.showModal?(a(),P(i,{key:0,onClose:n[2]||(n[2]=o=>t.modalState.showModal=!1),"content-width":"w-1/2"},{header:y(()=>[e("h3",ne,h(t.modalState.title),1)]),body:y(()=>[g(t.NoticeForm,{notice:t.modalState.notice,onClose:n[1]||(n[1]=o=>t.modalState.showModal=!1)},null,8,["notice"])]),_:1})):u("v-if",!0)],64)}const re=I(Y,[["render",ie],["__file","/home/administrator/Documents/Development/beak-insights/beak/beak-lims/webapp/views/notice/Notices.vue"]]),ue=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{ce as A,le as E,ue as N};
