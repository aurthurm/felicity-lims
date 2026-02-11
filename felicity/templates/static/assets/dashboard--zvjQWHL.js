import{be as B,k as u,d as L,f as q,e as r,a7 as A,a5 as $,bf as p}from"./index-Daoe3XS9.js";var m={exports:{}},x=m.exports,O;function I(){return O||(O=1,(function(a,w){(function(l,f){a.exports=f()})(x,(function(){var l="month",f="quarter";return function(b,g){var i=g.prototype;i.quarter=function(s){return this.$utils().u(s)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(s-1))};var S=i.add;i.add=function(s,c){return s=Number(s),this.$utils().p(c)===f?this.add(3*s,l):S.bind(this)(s,c)};var h=i.startOf;i.startOf=function(s,c){var y=this.$utils(),v=!!y.u(c)||c;if(y.p(s)===f){var d=this.quarter()-1;return v?this.month(3*d).startOf(l).startOf("day"):this.month(3*d+2).endOf(l).endOf("day")}return h.bind(this)(s,c)}}}))})(m)),m.exports}var R=I();const W=B(R),Y=u`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,j=u`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,F=u`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,Q=u`
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
    `,E=u`
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
    `,M=u`
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
    `,C=u`
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
    `,N=u`
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
    `,{withClientQuery:o}=q();r.extend(W);const z=L("dashboard",()=>{const a=A({currentTab:"overview",tabs:["overview","resource","laggard","peformance","notices","line-listing","inventory"],showFilters:!1,filterRange:{from:"",fromIso:"",to:"",toIso:""},currentFilter:"TW",filters:["T","Y","TW","LW","TM","LM","TQ","LQ","TY"],overViewStats:{analyses:[],samples:[],extras:[],worksheets:[]},fetchingOverViewStats:!1,resourceStats:{instruments:[],samples:[]},fetchingResourceStats:!1,peformancePeriods:[30,60,90,180,365],currentPeformancePeriod:30,peformanceStats:{sample:[],analysis:[]},fetchingSampePeformanceStats:!1,fetchingAnalysisPeformanceStats:!1,currentPeformance:"received_to_published",performances:["received_to_published","received_to_submitted","submitted_to_verified","verified_to_published"],perfs:{received_to_published:"Received to Published",received_to_submitted:"Received to Submitted",submitted_to_verified:"Submitted to Verified",verified_to_published:"Verified to Published"},laggards:{},fetchingLaggards:!1}),w=e=>e==="T"?"Today":e==="Y"?"Yesterday":e==="TW"?"This Week":e==="LW"?"Last Week":e==="TM"?"This Month":e==="LM"?"Last Month":e==="TQ"?"This Quarter":e==="LQ"?"Last Quarter":e==="TY"?"This Year":"Unknown Filter",l=async()=>{a.value.fetchingOverViewStats=!0;try{await b(),await g(),await i(),await S()}catch{}finally{a.value.fetchingOverViewStats=!1}},f=async()=>{a.value.fetchingResourceStats=!0;try{await h(),await s()}catch{}finally{a.value.fetchingResourceStats=!1}},b=async()=>{try{const t=await o(Y,{},"countSampleGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.overViewStats.samples=p(t.data,["scheduled","expected","received","awaiting","approved"],"group"))}catch{}},g=async()=>{try{const e={},t=await o(F,{},"countAnalyteGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.overViewStats.analyses=p(t.data,["pending","resulted"],"group"))}catch{}},i=async()=>{try{const t=await o(Q,{},"countWorksheetGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.overViewStats.worksheets=p(t.data,["empty","awaiting","pending"],"group"))}catch{}},S=async()=>{try{const t=await o(j,{},"countExtrasGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.overViewStats.extras=p(t.data,["sample cancelled","sample rejected","sample invalidated","analysis retracted","analysis retested"],"group"))}catch{}},h=async()=>{try{const e={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},t=await o(V,e,"countAnalyteGroupByInstrument","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.resourceStats.instruments=t.data)}catch{}},s=async()=>{try{const e={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},t=await o(C,e,"countSampleGroupByAction","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.resourceStats.samples=t.data)}catch{}},c=async()=>{try{a.value.fetchingSampePeformanceStats=!0;const e={startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},t=await o(E,e,"sampleProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.peformanceStats.sample=t.data)}catch{}finally{a.value.fetchingSampePeformanceStats=!1}},y=async()=>{try{a.value.fetchingAnalysisPeformanceStats=!0;const e={process:a.value.currentPeformance,startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},t=await o(M,e,"analysisProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.peformanceStats.analysis=t.data)}catch{}finally{a.value.fetchingAnalysisPeformanceStats=!1}},v=async()=>{try{a.value.fetchingLaggards=!0;const e=await o(N,{},"sampleLaggards","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.laggards=e.data)}catch{}finally{a.value.fetchingLaggards=!1}},d=e=>{a.value.currentTab=e},_=e=>{a.value.currentFilter=e},n=(e,t)=>{a.value.filterRange.from=e.toDate().toLocaleDateString(),a.value.filterRange.fromIso=e.toISOString(),a.value.filterRange.to=t.toDate().toLocaleDateString(),a.value.filterRange.toIso=t.toISOString()},P=e=>{const t=e.target;a.value.currentPeformance=t.value},G=e=>{const T=+e.target.value;a.value.currentPeformancePeriod=T},k=e=>{a.value.showFilters=e},D=e=>{switch(e){case"T":n(r().startOf("day"),r().endOf("day"));break;case"Y":n(r().startOf("day").subtract(1,"day"),r().endOf("day").subtract(1,"day"));break;case"TW":n(r().startOf("week"),r().endOf("week"));break;case"LW":n(r().startOf("week").subtract(1,"week"),r().endOf("week").subtract(1,"week"));break;case"TM":n(r().startOf("month"),r().endOf("month"));break;case"LM":n(r().startOf("month").subtract(1,"month"),r().endOf("month").subtract(1,"month"));break;case"TQ":n(r().startOf("quarter"),r().endOf("quarter"));break;case"LQ":n(r().startOf("quarter").subtract(1,"quarter"),r().endOf("quarter").subtract(1,"quarter"));break;case"TY":n(r().startOf("year"),r().endOf("year"));break}};return D(a.value.currentFilter),$(()=>a.value.currentFilter,e=>{D(e)}),{dashboard:a,setShowFilters:k,filterToolTip:w,setCurrentTab:d,setCurrentFilter:_,setFilterRange:n,getOverViewStats:l,getResourceStats:f,getSampleLaggards:v,getSampleProcessPeformance:c,getAnalysisProcessPeformance:y,setCurrentPeformance:P,setCurrentPeformancePeriod:G}});export{z as u};
