import{p as U}from"./chunk-TMUBEWPD-37869b1d.js";import{X as x,P as z,aB as j,E as q,q as K,r as X,s as Z,g as H,c as J,b as Q,_ as u,l as F,x as Y,d as tt,F as et,K as at,a5 as rt,k as nt}from"./DocumentEditor-38315b9c.js";import{p as it}from"./mermaid-parser.core-0793d4b1.js";import{d as O}from"./arc-3bd8bab1.js";import{o as ot}from"./ordinal-ba9b4969.js";import"./index-fa13e788.js";import"./string-6dabfbe0.js";import"./merge-9af0dc11.js";import"./_isIterateeCall-63f093c4.js";import"./isArray-513c67aa.js";import"./document.mutations-cce26b80.js";import"./ArrowLeftIcon-9a3cd842.js";import"./_baseForOwn-f09f6708.js";import"./_basePickBy-2590a61a.js";import"./_baseUniq-d37daefa.js";import"./toFinite-e1ccf554.js";import"./_baseSet-8f475b6b.js";import"./isString-5d6832c3.js";import"./clone-304ea981.js";import"./init-77b53fdd.js";function st(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function lt(t){return t}function ct(){var t=lt,a=st,m=null,o=x(0),d=x(z),y=x(0);function i(e){var r,l=(e=j(e)).length,c,A,h=0,p=new Array(l),n=new Array(l),v=+o.apply(this,arguments),w=Math.min(z,Math.max(-z,d.apply(this,arguments)-v)),f,T=Math.min(Math.abs(w)/l,y.apply(this,arguments)),$=T*(w<0?-1:1),g;for(r=0;r<l;++r)(g=n[p[r]=r]=+t(e[r],r,e))>0&&(h+=g);for(a!=null?p.sort(function(S,C){return a(n[S],n[C])}):m!=null&&p.sort(function(S,C){return m(e[S],e[C])}),r=0,A=h?(w-l*$)/h:0;r<l;++r,v=f)c=p[r],g=n[c],f=v+(g>0?g*A:0)+$,n[c]={data:e[c],index:r,value:g,startAngle:v,endAngle:f,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:x(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,m=null,i):a},i.sort=function(e){return arguments.length?(m=e,a=null,i):m},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:x(+e),i):o},i.endAngle=function(e){return arguments.length?(d=typeof e=="function"?e:x(+e),i):d},i.padAngle=function(e){return arguments.length?(y=typeof e=="function"?e:x(+e),i):y},i}var R=q.pie,G={sections:new Map,showData:!1,config:R},b=G.sections,P=G.showData,pt=structuredClone(R),ut=u(()=>structuredClone(pt),"getConfig"),dt=u(()=>{b=new Map,P=G.showData,Y()},"clear"),gt=u(({label:t,value:a})=>{b.has(t)||(b.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=u(()=>b,"getSections"),mt=u(t=>{P=t},"setShowData"),ht=u(()=>P,"getShowData"),I={getConfig:ut,clear:dt,setDiagramTitle:K,getDiagramTitle:X,setAccTitle:Z,getAccTitle:H,setAccDescription:J,getAccDescription:Q,addSection:gt,getSections:ft,setShowData:mt,getShowData:ht},vt=u((t,a)=>{U(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),St={parse:u(async t=>{const a=await it("pie",t);F.debug(a),vt(a,I)},"parse")},xt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),yt=xt,At=u(t=>{const a=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,d)=>d.value-o.value);return ct().value(o=>o.value)(a)},"createPieArcs"),wt=u((t,a,m,o)=>{F.debug(`rendering pie chart
`+t);const d=o.db,y=tt(),i=et(d.getConfig(),y.pie),e=40,r=18,l=4,c=450,A=c,h=at(a),p=h.append("g");p.attr("transform","translate("+A/2+","+c/2+")");const{themeVariables:n}=y;let[v]=rt(n.pieOuterStrokeWidth);v??=2;const w=i.textPosition,f=Math.min(A,c)/2-e,T=O().innerRadius(0).outerRadius(f),$=O().innerRadius(f*w).outerRadius(f*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const g=d.getSections(),S=At(g),C=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=ot(C);p.selectAll("mySlices").data(S).enter().append("path").attr("d",T).attr("fill",s=>D(s.data.label)).attr("class","pieCircle");let W=0;g.forEach(s=>{W+=s}),p.selectAll("mySlices").data(S).enter().append("text").text(s=>(s.data.value/W*100).toFixed(0)+"%").attr("transform",s=>"translate("+$.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(d.getDiagramTitle()).attr("x",0).attr("y",-(c-50)/2).attr("class","pieTitleText");const M=p.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(s,k)=>{const E=r+l,_=E*D.domain().length/2,B=12*r,V=k*E-_;return"translate("+B+","+V+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),M.data(S).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:k,value:E}=s.data;return d.getShowData()?`${k} [${E}]`:k});const L=Math.max(...M.selectAll("text").nodes().map(s=>s?.getBoundingClientRect().width??0)),N=A+e+r+l+L;h.attr("viewBox",`0 0 ${N} ${c}`),nt(h,c,N,i.useMaxWidth)},"draw"),Ct={draw:wt},Ut={parser:St,db:I,renderer:Ct,styles:yt};export{Ut as diagram};
