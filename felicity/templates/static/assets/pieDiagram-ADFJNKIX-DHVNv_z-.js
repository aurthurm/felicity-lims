import{Q as S,T as M,aF as j,_ as u,g as q,s as H,a as K,b as Q,t as Z,q as J,l as z,c as X,F as Y,K as ee,a4 as te,e as ae,z as re,H as ne}from"./umo-editor-BfPzXuMg.js";import{p as ie}from"./chunk-4BX2VUAB-Dfr-qN9J.js";import{p as se}from"./treemap-KMMF4GRG-CsgGT7ZJ.js";import{d as I}from"./arc-FGcBT2ez.js";import{o as oe}from"./ordinal-Cboi1Yqb.js";import"./index-OdhKCqIc.js";import"./string-CE8GzbCR.js";import"./_isIterateeCall-DnrZM974.js";import"./isArray-Dxzbedgu.js";import"./_baseUniq-DsWTgabl.js";import"./_basePickBy-BoMQIRST.js";import"./toFinite-6PuaOTJs.js";import"./clone-DeEIjZr8.js";import"./init-Gi6I4Gst.js";function le(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function pe(){var e=ce,a=le,f=null,x=S(0),s=S(M),l=S(0);function o(t){var n,c=(t=j(t)).length,d,y,h=0,p=new Array(c),i=new Array(c),v=+x.apply(this,arguments),w=Math.min(M,Math.max(-M,s.apply(this,arguments)-v)),m,C=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=C*(w<0?-1:1),g;for(n=0;n<c;++n)(g=i[p[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?p.sort(function(A,D){return a(i[A],i[D])}):f!=null&&p.sort(function(A,D){return f(t[A],t[D])}),n=0,y=h?(w-c*$)/h:0;n<c;++n,v=m)d=p[n],g=i[d],m=v+(g>0?g*y:0)+$,i[d]={data:t[d],index:n,value:g,startAngle:v,endAngle:m,padAngle:C};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(x=typeof t=="function"?t:S(+t),o):x},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:S(+t),o):s},o.padAngle=function(t){return arguments.length?(l=typeof t=="function"?t:S(+t),o):l},o}var ue=ne.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,de=structuredClone(ue),ge=u(()=>structuredClone(de),"getConfig"),fe=u(()=>{T=new Map,N=G.showData,re()},"clear"),me=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),z.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=u(()=>T,"getSections"),ve=u(e=>{N=e},"setShowData"),Se=u(()=>N,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:J,getDiagramTitle:Z,setAccTitle:Q,getAccTitle:K,setAccDescription:H,getAccDescription:q,addSection:me,getSections:he,setShowData:ve,getShowData:Se},xe=u((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ye={parse:u(async e=>{const a=await se("pie",e);z.debug(a),xe(a,L)},"parse")},we=u(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),Ae=we,De=u(e=>{const a=[...e.values()].reduce((s,l)=>s+l,0),f=[...e.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1).sort((s,l)=>l.value-s.value);return pe().value(s=>s.value)(f)},"createPieArcs"),Ce=u((e,a,f,x)=>{z.debug(`rendering pie chart
`+e);const s=x.db,l=X(),o=Y(s.getConfig(),l.pie),t=40,n=18,c=4,d=450,y=d,h=ee(a),p=h.append("g");p.attr("transform","translate("+y/2+","+d/2+")");const{themeVariables:i}=l;let[v]=te(i.pieOuterStrokeWidth);v??=2;const w=o.textPosition,m=Math.min(y,d)/2-t,C=I().innerRadius(0).outerRadius(m),$=I().innerRadius(m*w).outerRadius(m*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),A=De(g),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let b=0;g.forEach(r=>{b+=r});const W=A.filter(r=>(r.data.value/b*100).toFixed(0)!=="0"),E=oe(D);p.selectAll("mySlices").data(W).enter().append("path").attr("d",C).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(W).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...g.entries()].map(([r,F])=>({label:r,value:F})),k=p.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(r,F)=>{const R=n+c,B=R*O.length/2,V=12*n,U=F*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),P=y+t+n+c+_;h.attr("viewBox",`0 0 ${P} ${d}`),ae(h,d,P,o.useMaxWidth)},"draw"),$e={draw:Ce},Le={parser:ye,db:L,renderer:$e,styles:Ae};export{Le as diagram};
