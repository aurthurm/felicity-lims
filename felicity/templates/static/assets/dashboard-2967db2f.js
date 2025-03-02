import{a4 as k,a5 as T,H as u,I as B,aZ as r,Q as I,r as L,P as R,a_ as m}from"./index-68ba4247.js";var P={exports:{}};(function(e,h){(function(l,f){e.exports=f()})(k,function(){var l="month",f="quarter";return function(D,y){var i=y.prototype;i.quarter=function(s){return this.$utils().u(s)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(s-1))};var g=i.add;i.add=function(s,c){return s=Number(s),this.$utils().p(c)===f?this.add(3*s,l):g.bind(this)(s,c)};var S=i.startOf;i.startOf=function(s,c){var d=this.$utils(),v=!!d.u(c)||c;if(d.p(s)===f){var p=this.quarter()-1;return v?this.month(3*p).startOf(l).startOf("day"):this.month(3*p+2).endOf(l).endOf("day")}return S.bind(this)(s,c)}}})})(P);var A=P.exports;const q=T(A),$=u`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,x=u`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,W=u`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,F=u`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,V=u`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `,Y=u`
    query SampleProcessPeformance($startDate: String!, $endDate: String!) {
  sampleProcessPerformance(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      process
      counts {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
      }
    }
  }
}
    `,Q=u`
    query getAnalysisProcessPeformance($process: String!, $startDate: String!, $endDate: String!) {
  analysisProcessPerformance(
    process: $process
    startDate: $startDate
    endDate: $endDate
  ) {
    __typename
    data {
      process
      groups {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
        service
      }
    }
  }
}
    `,E=u`
    query SampleGroupByAction($startDate: String!, $endDate: String!) {
  countSampleGroupByAction(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      __typename
      group
      counts {
        __typename
        group
        count
      }
    }
  }
}
    `,M=u`
    query getSampleLaggards {
  sampleLaggards {
    __typename
    data {
      __typename
      category
      counts {
        __typename
        totalIncomplete
        totalDelayed
        totalNotDelayed
        lessThanTen
        tenToTwenty
        twentyToThirty
        graterThanThirty
      }
    }
  }
}
    `,{withClientQuery:o}=B();r.extend(q);const j=I("dashboard",()=>{const e=L({currentTab:"overview",tabs:["overview","resource","laggard","peformance","notices","line-listing"],showFilters:!1,filterRange:{from:"",fromIso:"",to:"",toIso:""},currentFilter:"TW",filters:["T","Y","TW","LW","TM","LM","TQ","LQ","TY"],overViewStats:{analyses:[],samples:[],extras:[],worksheets:[]},fetchingOverViewStats:!1,resourceStats:{instruments:[],samples:[]},fetchingResourceStats:!1,peformancePeriods:[30,60,90,180,365],currentPeformancePeriod:30,peformanceStats:{sample:[],analysis:[]},fetchingSampePeformanceStats:!1,fetchingAnalysisPeformanceStats:!1,currentPeformance:"received_to_published",performances:["received_to_published","received_to_submitted","submitted_to_verified","verified_to_published"],perfs:{received_to_published:"Received to Published",received_to_submitted:"Received to Submitted",submitted_to_verified:"Submitted to Verified",verified_to_published:"Verified to Published"},laggards:{},fetchingLaggards:!1}),h=t=>t==="T"?"Today":t==="Y"?"Yesterday":t==="TW"?"This Week":t==="LW"?"Last Week":t==="TM"?"This Month":t==="LM"?"Last Month":t==="TQ"?"This Quarter":t==="LQ"?"Last Quarter":t==="TY"?"This Year":"Unknown Filter",l=async()=>{e.value.fetchingOverViewStats=!0;try{await D(),await y(),await i(),await g()}catch{e.value.fetchingOverViewStats=!1}e.value.fetchingOverViewStats=!1},f=async()=>{e.value.fetchingResourceStats=!0;try{await S(),await s()}catch{e.value.fetchingResourceStats=!1}e.value.fetchingResourceStats=!1},D=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o($,t,"countSampleGroupByStatus","network-only").then(a=>e.value.overViewStats.samples=m(a.data,["scheduled","expected","received","awaiting","approved"],"group"))},y=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o(W,t,"countAnalyteGroupByStatus","network-only").then(a=>e.value.overViewStats.analyses=m(a.data,["pending","resulted"],"group"))},i=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o(F,t,"countWorksheetGroupByStatus","network-only").then(a=>e.value.overViewStats.worksheets=m(a.data,["empty","awaiting","pending"],"group"))},g=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o(x,t,"countExtrasGroupByStatus","network-only").then(a=>e.value.overViewStats.extras=m(a.data,["sample cancelled","sample rejected","sample invalidated","analysis retracted","analysis retested"],"group"))},S=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o(V,t,"countAnalyteGroupByInstrument","network-only").then(a=>e.value.resourceStats.instruments=a.data)},s=async()=>{const t={startDate:e.value.filterRange.fromIso,endDate:e.value.filterRange.toIso};await o(E,t,"countSampleGroupByAction","network-only").then(a=>e.value.resourceStats.samples=a.data)},c=async()=>{const t={startDate:r().startOf("day").subtract(e.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()};e.value.fetchingSampePeformanceStats=!0,await o(Y,t,"sampleProcessPerformance","network-only").then(a=>{e.value.fetchingSampePeformanceStats=!1,e.value.peformanceStats.sample=a.data}).catch(a=>e.value.fetchingSampePeformanceStats=!1)},d=async()=>{const t={process:e.value.currentPeformance,startDate:r().startOf("day").subtract(e.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()};e.value.fetchingAnalysisPeformanceStats=!0,await o(Q,t,"analysisProcessPerformance","network-only").then(a=>{e.value.fetchingAnalysisPeformanceStats=!1,e.value.peformanceStats.analysis=a.data}).catch(a=>e.value.fetchingAnalysisPeformanceStats=!1)},v=async()=>{e.value.fetchingLaggards=!0,await o(M,{},"sampleLaggards","network-only").then(t=>{e.value.laggards=t.data,e.value.fetchingLaggards=!1}).catch(t=>e.value.fetchingLaggards=!1)},p=t=>e.value.currentTab=t,_=t=>e.value.currentFilter=t,n=(t,a)=>{e.value.filterRange.from=t.toDate().toLocaleDateString(),e.value.filterRange.fromIso=t.toISOString(),e.value.filterRange.to=a.toDate().toLocaleDateString(),e.value.filterRange.toIso=a.toISOString()},b=t=>{e.value.currentPeformance=t.target.value},O=t=>{const a=+t.target.value;e.value.currentPeformancePeriod=a},G=t=>e.value.showFilters=t,w=t=>{switch(t){case"T":n(r().startOf("day"),r().endOf("day"));break;case"Y":n(r().startOf("day").subtract(1,"day"),r().endOf("day").subtract(1,"day"));break;case"TW":n(r().startOf("week"),r().endOf("week"));break;case"LW":n(r().startOf("week").subtract(1,"week"),r().endOf("week").subtract(1,"week"));break;case"TM":n(r().startOf("month"),r().endOf("month"));break;case"LM":n(r().startOf("month").subtract(1,"month"),r().endOf("month").subtract(1,"month"));break;case"TQ":n(r().startOf("quarter"),r().endOf("quarter"));break;case"LQ":n(r().startOf("quarter").subtract(1,"quarter"),r().endOf("quarter").subtract(1,"quarter"));break;case"TY":n(r().startOf("year"),r().endOf("year"));break;default:alert("Unknown Range Selected");break}};return w(e.value.currentFilter),R(()=>e.value.currentFilter,(t,a)=>{w(t)}),{dashboard:e,setShowFilters:G,filterToolTip:h,setCurrentTab:p,setCurrentFilter:_,setFilterRange:n,getOverViewStats:l,getResourceStats:f,getSampleLaggards:v,getSampleProcessPeformance:c,getAnalysisProcessPeformance:d,setCurrentPeformance:b,setCurrentPeformancePeriod:O}});export{j as u};
