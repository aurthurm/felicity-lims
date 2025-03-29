import{g as a,e as o,d,ag as c}from"./index-e1b11e1a.js";const n=a`
    query getNoticesByCreatorUid($uid: String!) {
  noticesByCreator(uid: $uid) {
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
}
    `,{withClientQuery:y}=o(),l=d("notice",{state:()=>({notices:[],fetchingNotices:!1,filterBy:"all",filters:["all","active","expired"]}),getters:{getNotices:e=>e.notices,getActiveNotices:e=>e.notices?.filter(t=>!t.expired),getMyNotices:e=>t=>e.notices?.filter(i=>i.createdByUid===t),getFilterBy:e=>e.filterBy,getFilters:e=>e.filters},actions:{async fetchMyNotices(e){this.fetchingNotices=!0,await y(n,{uid:e},"noticesByCreator").then(t=>{this.fetchingNotices=!1,this.notices=t?.map(i=>s(i)).sort((i,r)=>i.expiry>r.expiry?1:-1)}).catch(t=>this.fetchingNotices=!1)},addNotice(e){this.notices?.unshift(s(e))},updateNotice(e){const t=this.notices?.findIndex(i=>i.uid===e.uid);t>-1&&(this.notices[t]=s(e))},deleteNotice(e){const t=this.notices?.findIndex(i=>i.uid===e.uid);t>-1&&this.notices?.splice(t,1)}}}),u=e=>new Date>new Date(e.expiry),f=e=>c(new Date,new Date(e.expiry)),s=e=>{const t=u(e),i=+f(e);return e.expired=t,e.dayToExpiration=i,t===!0?i===0?e.status="expired today":e.status="expired "+i+" days ago":i===0?e.status="expiring today":e.status="expiring in "+i+" days",e};export{l as u};
