import{be as B,k as c,d as I,f as L,e as a,a7 as q,a5 as A,bf as y}from"./index-C5OmCQ1r.js";var g={exports:{}},$=g.exports,O;function x(){return O||(O=1,(function(r,b){(function(l,d){r.exports=d()})($,(function(){var l="month",d="quarter";return function(w,m){var i=m.prototype;i.quarter=function(s){return this.$utils().u(s)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(s-1))};var v=i.add;i.add=function(s,u){return s=Number(s),this.$utils().p(u)===d?this.add(3*s,l):v.bind(this)(s,u)};var S=i.startOf;i.startOf=function(s,u){var f=this.$utils(),h=!!f.u(u)||u;if(f.p(s)===d){var p=this.quarter()-1;return h?this.month(3*p).startOf(l).startOf("day"):this.month(3*p+2).endOf(l).endOf("day")}return S.bind(this)(s,u)}}}))})(g)),g.exports}var E=x();const R=B(E),W=c`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,Y=c`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,j=c`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,F=c`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,Q=c`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `,V=c`
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
    `,M=c`
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
    `,C=c`
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
    `,N=c`
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
    `,{withClientQuery:n}=L();a.extend(R);const z=I("dashboard",()=>{const r=q({currentTab:"overview",tabs:["overview","resource","laggard","peformance","notices","line-listing"],showFilters:!1,filterRange:{from:"",fromIso:"",to:"",toIso:""},currentFilter:"TW",filters:["T","Y","TW","LW","TM","LM","TQ","LQ","TY"],overViewStats:{analyses:[],samples:[],extras:[],worksheets:[]},fetchingOverViewStats:!1,resourceStats:{instruments:[],samples:[]},fetchingResourceStats:!1,peformancePeriods:[30,60,90,180,365],currentPeformancePeriod:30,peformanceStats:{sample:[],analysis:[]},fetchingSampePeformanceStats:!1,fetchingAnalysisPeformanceStats:!1,currentPeformance:"received_to_published",performances:["received_to_published","received_to_submitted","submitted_to_verified","verified_to_published"],perfs:{received_to_published:"Received to Published",received_to_submitted:"Received to Submitted",submitted_to_verified:"Submitted to Verified",verified_to_published:"Verified to Published"},laggards:{},fetchingLaggards:!1}),b=e=>e==="T"?"Today":e==="Y"?"Yesterday":e==="TW"?"This Week":e==="LW"?"Last Week":e==="TM"?"This Month":e==="LM"?"Last Month":e==="TQ"?"This Quarter":e==="LQ"?"Last Quarter":e==="TY"?"This Year":"Unknown Filter",l=async()=>{r.value.fetchingOverViewStats=!0;try{await w(),await m(),await i(),await v()}catch(e){console.error("Error fetching overview stats:",e)}finally{r.value.fetchingOverViewStats=!1}},d=async()=>{r.value.fetchingResourceStats=!0;try{await S(),await s()}catch(e){console.error("Error fetching resource stats:",e)}finally{r.value.fetchingResourceStats=!1}},w=async()=>{try{const t=await n(W,{},"countSampleGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?r.value.overViewStats.samples=y(t.data,["scheduled","expected","received","awaiting","approved"],"group"):console.error("Invalid sample group by status data received:",t)}catch(e){console.error("Error counting samples groups by status:",e)}},m=async()=>{try{const e={},t=await n(j,{},"countAnalyteGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?r.value.overViewStats.analyses=y(t.data,["pending","resulted"],"group"):console.error("Invalid analysis group by status data received:",t)}catch(e){console.error("Error counting analysis groups by status:",e)}},i=async()=>{try{const t=await n(F,{},"countWorksheetGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?r.value.overViewStats.worksheets=y(t.data,["empty","awaiting","pending"],"group"):console.error("Invalid worksheet group by status data received:",t)}catch(e){console.error("Error counting worksheet groups by status:",e)}},v=async()=>{try{const t=await n(Y,{},"countExtrasGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?r.value.overViewStats.extras=y(t.data,["sample cancelled","sample rejected","sample invalidated","analysis retracted","analysis retested"],"group"):console.error("Invalid extras group by status data received:",t)}catch(e){console.error("Error counting extras groups by status:",e)}},S=async()=>{try{const e={startDate:r.value.filterRange.fromIso,endDate:r.value.filterRange.toIso},t=await n(Q,e,"countAnalyteGroupByInstrument","network-only");t&&typeof t=="object"&&"data"in t?r.value.resourceStats.instruments=t.data:console.error("Invalid analysis group by instrument data received:",t)}catch(e){console.error("Error counting analysis groups by instrument:",e)}},s=async()=>{try{const e={startDate:r.value.filterRange.fromIso,endDate:r.value.filterRange.toIso},t=await n(C,e,"countSampleGroupByAction","network-only");t&&typeof t=="object"&&"data"in t?r.value.resourceStats.samples=t.data:console.error("Invalid sample group by action data received:",t)}catch(e){console.error("Error getting sample groups by action:",e)}},u=async()=>{try{r.value.fetchingSampePeformanceStats=!0;const e={startDate:a().startOf("day").subtract(r.value.currentPeformancePeriod,"day").toISOString(),endDate:a().endOf("day").toISOString()},t=await n(V,e,"sampleProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t?r.value.peformanceStats.sample=t.data:console.error("Invalid sample process performance data received:",t)}catch(e){console.error("Error getting sample process performance:",e)}finally{r.value.fetchingSampePeformanceStats=!1}},f=async()=>{try{r.value.fetchingAnalysisPeformanceStats=!0;const e={process:r.value.currentPeformance,startDate:a().startOf("day").subtract(r.value.currentPeformancePeriod,"day").toISOString(),endDate:a().endOf("day").toISOString()},t=await n(M,e,"analysisProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t?r.value.peformanceStats.analysis=t.data:console.error("Invalid analysis process performance data received:",t)}catch(e){console.error("Error getting analysis process performance:",e)}finally{r.value.fetchingAnalysisPeformanceStats=!1}},h=async()=>{try{r.value.fetchingLaggards=!0;const e=await n(N,{},"sampleLaggards","network-only");e&&typeof e=="object"&&"data"in e?r.value.laggards=e.data:console.error("Invalid sample laggards data received:",e)}catch(e){console.error("Error getting sample laggards:",e)}finally{r.value.fetchingLaggards=!1}},p=e=>{r.value.currentTab=e},_=e=>{r.value.currentFilter=e},o=(e,t)=>{r.value.filterRange.from=e.toDate().toLocaleDateString(),r.value.filterRange.fromIso=e.toISOString(),r.value.filterRange.to=t.toDate().toLocaleDateString(),r.value.filterRange.toIso=t.toISOString()},P=e=>{const t=e.target;r.value.currentPeformance=t.value},k=e=>{const T=+e.target.value;r.value.currentPeformancePeriod=T},G=e=>{r.value.showFilters=e},D=e=>{switch(e){case"T":o(a().startOf("day"),a().endOf("day"));break;case"Y":o(a().startOf("day").subtract(1,"day"),a().endOf("day").subtract(1,"day"));break;case"TW":o(a().startOf("week"),a().endOf("week"));break;case"LW":o(a().startOf("week").subtract(1,"week"),a().endOf("week").subtract(1,"week"));break;case"TM":o(a().startOf("month"),a().endOf("month"));break;case"LM":o(a().startOf("month").subtract(1,"month"),a().endOf("month").subtract(1,"month"));break;case"TQ":o(a().startOf("quarter"),a().endOf("quarter"));break;case"LQ":o(a().startOf("quarter").subtract(1,"quarter"),a().endOf("quarter").subtract(1,"quarter"));break;case"TY":o(a().startOf("year"),a().endOf("year"));break;default:console.error("Unknown Range Selected");break}};return D(r.value.currentFilter),A(()=>r.value.currentFilter,e=>{D(e)}),{dashboard:r,setShowFilters:G,filterToolTip:b,setCurrentTab:p,setCurrentFilter:_,setFilterRange:o,getOverViewStats:l,getResourceStats:d,getSampleLaggards:h,getSampleProcessPeformance:u,getAnalysisProcessPeformance:f,setCurrentPeformance:P,setCurrentPeformancePeriod:k}});export{z as u};
