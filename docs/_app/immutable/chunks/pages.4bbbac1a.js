var FT=Object.defineProperty;var UT=(i,n,t)=>n in i?FT(i,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[n]=t;var De=(i,n,t)=>(UT(i,typeof n!="symbol"?n+"":n,t),t),RT=(i,n,t)=>{if(!n.has(i))throw TypeError("Cannot "+t)};var ea=(i,n,t)=>{if(n.has(i))throw TypeError("Cannot add the same private member more than once");n instanceof WeakSet?n.add(i):n.set(i,t)};var ss=(i,n,t)=>(RT(i,n,"access private method"),t);import{b as As}from"./paths.35803d68.js";import{S as Oe,i as Le,a as te,t as ue,g as Ft,c as Ut,b as Wt,d as ci,m as zt,e as Qt}from"./index.012ade26.js";import{s as Ue,e as tn,i as Ae,d as Z,r as nt,u as Yc,f as ke,g as we,h as je,a4 as fs,x as tt,y as it,z as rt,R as ur,q as cc,l as Sa,m as Ta,n as Da,H as Xe,j as yn,G as Bt,a as Ea,c as Aa,U as bT,V as kT,a7 as pc,o as wT}from"./scheduler.88297443.js";function ct(i){return(i==null?void 0:i.length)!==void 0?i:Array.from(i)}function Hc(i,n){const t={},s={},o={$$scope:1};let u=i.length;for(;u--;){const l=i[u],d=n[u];if(d){for(const f in l)f in d||(s[f]=1);for(const f in d)o[f]||(t[f]=d[f],o[f]=1);i[u]=d}else for(const f in l)o[f]=1}for(const l in s)l in t||(t[l]=void 0);return t}function BA(i){return typeof i=="object"&&i!==null?i:{}}function la(...i){return"/"+i.flatMap(n=>n.split("/")).filter(n=>!!n).join("/")}function ca(i){return i.startsWith("/")||i.startsWith("#")}function Jc(i,n){return n.slug(i).replace(/--+/g,"-")}function na(i){let n,t;const s=i[5].default,o=nt(s,i,i[4],null);let u=[{id:i[1]}],l={};for(let d=0;d<u.length;d+=1)l=Yc(l,u[d]);return{c(){n=ke(`h${i[0].depth}`),o&&o.c(),this.h()},l(d){n=we(d,(`h${i[0].depth}`||"null").toUpperCase(),{id:!0});var f=je(n);o&&o.l(f),f.forEach(Z),this.h()},h(){fs(`h${i[0].depth}`)(n,l)},m(d,f){Ae(d,n,f),o&&o.m(n,null),t=!0},p(d,f){o&&o.p&&(!t||f&16)&&tt(o,s,d,d[4],t?rt(s,d[4],f,null):it(d[4]),null),fs(`h${d[0].depth}`)(n,l=Hc(u,[(!t||f&2)&&{id:d[1]}]))},i(d){t||(te(o,d),t=!0)},o(d){ue(o,d),t=!1},d(d){d&&Z(n),o&&o.d(d)}}}function NT(i){let n=`h${i[0].depth}`,t,s,o=`h${i[0].depth}`&&na(i);return{c(){o&&o.c(),t=tn()},l(u){o&&o.l(u),t=tn()},m(u,l){o&&o.m(u,l),Ae(u,t,l),s=!0},p(u,[l]){`h${u[0].depth}`?n?Ue(n,`h${u[0].depth}`)?(o.d(1),o=na(u),n=`h${u[0].depth}`,o.c(),o.m(t.parentNode,t)):o.p(u,l):(o=na(u),n=`h${u[0].depth}`,o.c(),o.m(t.parentNode,t)):n&&(o.d(1),o=null,n=`h${u[0].depth}`)},i(u){s||(te(o,u),s=!0)},o(u){ue(o,u),s=!1},d(u){u&&Z(t),o&&o.d(u)}}}function xT(i,n,t){let{$$slots:s={},$$scope:o}=n,{token:u}=n,{options:l}=n;const d=void 0;let f;return i.$$set=m=>{"token"in m&&t(0,u=m.token),"options"in m&&t(2,l=m.options),"$$scope"in m&&t(4,o=m.$$scope)},i.$$.update=()=>{i.$$.dirty&5&&t(1,f=Jc(u.text,l.slugger))},[u,f,l,d,o,s]}class OT extends Oe{constructor(n){super(),Le(this,n,xT,NT,Ue,{token:0,options:2,renderers:3})}get renderers(){return this.$$.ctx[3]}}function LT(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("blockquote"),o&&o.c()},l(u){n=we(u,"BLOCKQUOTE",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function PT(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class MT extends Oe{constructor(n){super(),Le(this,n,PT,LT,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function dc(i,n,t){const s=i.slice();return s[3]=n[t],s}function fc(i){let n,t,s=ct(i[0]),o=[];for(let l=0;l<s.length;l+=1)o[l]=gc(dc(i,s,l));const u=l=>ue(o[l],1,1,()=>{o[l]=null});return{c(){for(let l=0;l<o.length;l+=1)o[l].c();n=tn()},l(l){for(let d=0;d<o.length;d+=1)o[d].l(l);n=tn()},m(l,d){for(let f=0;f<o.length;f+=1)o[f]&&o[f].m(l,d);Ae(l,n,d),t=!0},p(l,d){if(d&7){s=ct(l[0]);let f;for(f=0;f<s.length;f+=1){const m=dc(l,s,f);o[f]?(o[f].p(m,d),te(o[f],1)):(o[f]=gc(m),o[f].c(),te(o[f],1),o[f].m(n.parentNode,n))}for(Ft(),f=s.length;f<o.length;f+=1)u(f);Ut()}},i(l){if(!t){for(let d=0;d<s.length;d+=1)te(o[d]);t=!0}},o(l){o=o.filter(Boolean);for(let d=0;d<o.length;d+=1)ue(o[d]);t=!1},d(l){l&&Z(n),ur(o,l)}}}function gc(i){let n,t;return n=new Xc({props:{token:i[3],renderers:i[1],options:i[2]}}),{c(){Wt(n.$$.fragment)},l(s){ci(n.$$.fragment,s)},m(s,o){zt(n,s,o),t=!0},p(s,o){const u={};o&1&&(u.token=s[3]),o&2&&(u.renderers=s[1]),o&4&&(u.options=s[2]),n.$set(u)},i(s){t||(te(n.$$.fragment,s),t=!0)},o(s){ue(n.$$.fragment,s),t=!1},d(s){Qt(n,s)}}}function $T(i){let n,t,s=i[0]&&fc(i);return{c(){s&&s.c(),n=tn()},l(o){s&&s.l(o),n=tn()},m(o,u){s&&s.m(o,u),Ae(o,n,u),t=!0},p(o,[u]){o[0]?s?(s.p(o,u),u&1&&te(s,1)):(s=fc(o),s.c(),te(s,1),s.m(n.parentNode,n)):s&&(Ft(),ue(s,1,1,()=>{s=null}),Ut())},i(o){t||(te(s),t=!0)},o(o){ue(s),t=!1},d(o){o&&Z(n),s&&s.d(o)}}}function VT(i,n,t){let{tokens:s}=n,{renderers:o}=n,{options:u}=n;return i.$$set=l=>{"tokens"in l&&t(0,s=l.tokens),"renderers"in l&&t(1,o=l.renderers),"options"in l&&t(2,u=l.options)},[s,o,u]}class _s extends Oe{constructor(n){super(),Le(this,n,VT,$T,Ue,{tokens:0,renderers:1,options:2})}}function hc(i){let n,t,s;var o=i[1][i[0].type];function u(l,d){return{props:{token:l[0],options:l[2],renderers:l[1],$$slots:{default:[jT]},$$scope:{ctx:l}}}}return o&&(n=cc(o,u(i))),{c(){n&&Wt(n.$$.fragment),t=tn()},l(l){n&&ci(n.$$.fragment,l),t=tn()},m(l,d){n&&zt(n,l,d),Ae(l,t,d),s=!0},p(l,d){if(d&3&&o!==(o=l[1][l[0].type])){if(n){Ft();const f=n;ue(f.$$.fragment,1,0,()=>{Qt(f,1)}),Ut()}o?(n=cc(o,u(l)),Wt(n.$$.fragment),te(n.$$.fragment,1),zt(n,t.parentNode,t)):n=null}else if(o){const f={};d&1&&(f.token=l[0]),d&4&&(f.options=l[2]),d&2&&(f.renderers=l[1]),d&15&&(f.$$scope={dirty:d,ctx:l}),n.$set(f)}},i(l){s||(n&&te(n.$$.fragment,l),s=!0)},o(l){n&&ue(n.$$.fragment,l),s=!1},d(l){l&&Z(t),n&&Qt(n,l)}}}function GT(i){let n=i[0].raw+"",t;return{c(){t=Sa(n)},l(s){t=Ta(s,n)},m(s,o){Ae(s,t,o)},p(s,o){o&1&&n!==(n=s[0].raw+"")&&Da(t,n)},i:Xe,o:Xe,d(s){s&&Z(t)}}}function qT(i){let n,t;return n=new _s({props:{tokens:i[0].tokens,renderers:i[1],options:i[2]}}),{c(){Wt(n.$$.fragment)},l(s){ci(n.$$.fragment,s)},m(s,o){zt(n,s,o),t=!0},p(s,o){const u={};o&1&&(u.tokens=s[0].tokens),o&2&&(u.renderers=s[1]),o&4&&(u.options=s[2]),n.$set(u)},i(s){t||(te(n.$$.fragment,s),t=!0)},o(s){ue(n.$$.fragment,s),t=!1},d(s){Qt(n,s)}}}function jT(i){let n,t,s,o;const u=[qT,GT],l=[];function d(f,m){return"tokens"in f[0]&&f[0].tokens?0:1}return n=d(i),t=l[n]=u[n](i),{c(){t.c(),s=tn()},l(f){t.l(f),s=tn()},m(f,m){l[n].m(f,m),Ae(f,s,m),o=!0},p(f,m){let S=n;n=d(f),n===S?l[n].p(f,m):(Ft(),ue(l[S],1,1,()=>{l[S]=null}),Ut(),t=l[n],t?t.p(f,m):(t=l[n]=u[n](f),t.c()),te(t,1),t.m(s.parentNode,s))},i(f){o||(te(t),o=!0)},o(f){ue(t),o=!1},d(f){f&&Z(s),l[n].d(f)}}}function WT(i){let n,t,s=i[1][i[0].type]&&hc(i);return{c(){s&&s.c(),n=tn()},l(o){s&&s.l(o),n=tn()},m(o,u){s&&s.m(o,u),Ae(o,n,u),t=!0},p(o,[u]){o[1][o[0].type]?s?(s.p(o,u),u&3&&te(s,1)):(s=hc(o),s.c(),te(s,1),s.m(n.parentNode,n)):s&&(Ft(),ue(s,1,1,()=>{s=null}),Ut())},i(o){t||(te(s),t=!0)},o(o){ue(s),t=!1},d(o){o&&Z(n),s&&s.d(o)}}}function zT(i,n,t){let{token:s}=n,{renderers:o}=n,{options:u}=n;return i.$$set=l=>{"token"in l&&t(0,s=l.token),"renderers"in l&&t(1,o=l.renderers),"options"in l&&t(2,u=l.options)},[s,o,u]}class Xc extends Oe{constructor(n){super(),Le(this,n,zT,WT,Ue,{token:0,renderers:1,options:2})}}function yc(i,n,t){const s=i.slice();return s[4]=n[t],s}function mc(i){let n,t;return n=new Xc({props:{token:{...i[4]},options:i[1],renderers:i[2]}}),{c(){Wt(n.$$.fragment)},l(s){ci(n.$$.fragment,s)},m(s,o){zt(n,s,o),t=!0},p(s,o){const u={};o&1&&(u.token={...s[4]}),o&2&&(u.options=s[1]),o&4&&(u.renderers=s[2]),n.$set(u)},i(s){t||(te(n.$$.fragment,s),t=!0)},o(s){ue(n.$$.fragment,s),t=!1},d(s){Qt(n,s)}}}function ta(i){let n,t,s,o=ct(i[0].items),u=[];for(let m=0;m<o.length;m+=1)u[m]=mc(yc(i,o,m));const l=m=>ue(u[m],1,1,()=>{u[m]=null});let d=[{start:t=i[0].start||1}],f={};for(let m=0;m<d.length;m+=1)f=Yc(f,d[m]);return{c(){n=ke(i[3]);for(let m=0;m<u.length;m+=1)u[m].c();this.h()},l(m){n=we(m,(i[3]||"null").toUpperCase(),{start:!0});var S=je(n);for(let E=0;E<u.length;E+=1)u[E].l(S);S.forEach(Z),this.h()},h(){fs(i[3])(n,f)},m(m,S){Ae(m,n,S);for(let E=0;E<u.length;E+=1)u[E]&&u[E].m(n,null);s=!0},p(m,S){if(S&7){o=ct(m[0].items);let E;for(E=0;E<o.length;E+=1){const B=yc(m,o,E);u[E]?(u[E].p(B,S),te(u[E],1)):(u[E]=mc(B),u[E].c(),te(u[E],1),u[E].m(n,null))}for(Ft(),E=o.length;E<u.length;E+=1)l(E);Ut()}fs(m[3])(n,f=Hc(d,[(!s||S&1&&t!==(t=m[0].start||1))&&{start:t}]))},i(m){if(!s){for(let S=0;S<o.length;S+=1)te(u[S]);s=!0}},o(m){u=u.filter(Boolean);for(let S=0;S<u.length;S+=1)ue(u[S]);s=!1},d(m){m&&Z(n),ur(u,m)}}}function QT(i){let n=i[3],t,s=i[3]&&ta(i);return{c(){s&&s.c(),t=tn()},l(o){s&&s.l(o),t=tn()},m(o,u){s&&s.m(o,u),Ae(o,t,u)},p(o,[u]){o[3]?n?Ue(n,o[3])?(s.d(1),s=ta(o),n=o[3],s.c(),s.m(t.parentNode,t)):s.p(o,u):(s=ta(o),n=o[3],s.c(),s.m(t.parentNode,t)):n&&(s.d(1),s=null,n=o[3])},i:Xe,o(o){ue(s,o)},d(o){o&&Z(t),s&&s.d(o)}}}function YT(i,n,t){let{token:s}=n,{options:o}=n,{renderers:u}=n,l;return i.$$set=d=>{"token"in d&&t(0,s=d.token),"options"in d&&t(1,o=d.options),"renderers"in d&&t(2,u=d.renderers)},i.$$.update=()=>{i.$$.dirty&1&&t(3,l=s.ordered?"ol":"ul")},[s,o,u,l]}class HT extends Oe{constructor(n){super(),Le(this,n,YT,QT,Ue,{token:0,options:1,renderers:2})}}function JT(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("li"),o&&o.c()},l(u){n=we(u,"LI",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function XT(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class ZT extends Oe{constructor(n){super(),Le(this,n,XT,JT,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function KT(i){let n;return{c(){n=ke("br")},l(t){n=we(t,"BR",{})},m(t,s){Ae(t,n,s)},p:Xe,i:Xe,o:Xe,d(t){t&&Z(n)}}}function e0(i,n,t){return[void 0,void 0,void 0]}class n0 extends Oe{constructor(n){super(),Le(this,n,e0,KT,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function t0(i){let n,t,s=i[0].text+"",o,u;return{c(){n=ke("pre"),t=ke("code"),o=Sa(s),this.h()},l(l){n=we(l,"PRE",{});var d=je(n);t=we(d,"CODE",{class:!0});var f=je(t);o=Ta(f,s),f.forEach(Z),d.forEach(Z),this.h()},h(){yn(t,"class",u=`lang-${i[0].lang}`)},m(l,d){Ae(l,n,d),Bt(n,t),Bt(t,o)},p(l,[d]){d&1&&s!==(s=l[0].text+"")&&Da(o,s),d&1&&u!==(u=`lang-${l[0].lang}`)&&yn(t,"class",u)},i:Xe,o:Xe,d(l){l&&Z(n)}}}function i0(i,n,t){let{token:s}=n;const o=void 0,u=void 0;return i.$$set=l=>{"token"in l&&t(0,s=l.token)},[s,o,u]}class r0 extends Oe{constructor(n){super(),Le(this,n,i0,t0,Ue,{token:0,options:1,renderers:2})}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function s0(i){let n,t=i[0].raw.slice(1,i[0].raw.length-1)+"",s;return{c(){n=ke("code"),s=Sa(t)},l(o){n=we(o,"CODE",{});var u=je(n);s=Ta(u,t),u.forEach(Z)},m(o,u){Ae(o,n,u),Bt(n,s)},p(o,[u]){u&1&&t!==(t=o[0].raw.slice(1,o[0].raw.length-1)+"")&&Da(s,t)},i:Xe,o:Xe,d(o){o&&Z(n)}}}function o0(i,n,t){let{token:s}=n;const o=void 0,u=void 0;return i.$$set=l=>{"token"in l&&t(0,s=l.token)},[s,o,u]}class a0 extends Oe{constructor(n){super(),Le(this,n,o0,s0,Ue,{token:0,options:1,renderers:2})}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function Sc(i,n,t){const s=i.slice();return s[3]=n[t],s}function Tc(i,n,t){const s=i.slice();return s[6]=n[t],s}function Dc(i,n,t){const s=i.slice();return s[9]=n[t],s}function Ec(i){let n,t,s,o;return t=new _s({props:{tokens:i[9].tokens,options:i[1],renderers:i[2]}}),{c(){n=ke("th"),Wt(t.$$.fragment),s=Ea(),this.h()},l(u){n=we(u,"TH",{scope:!0});var l=je(n);ci(t.$$.fragment,l),s=Aa(l),l.forEach(Z),this.h()},h(){yn(n,"scope","col")},m(u,l){Ae(u,n,l),zt(t,n,null),Bt(n,s),o=!0},p(u,l){const d={};l&1&&(d.tokens=u[9].tokens),l&2&&(d.options=u[1]),l&4&&(d.renderers=u[2]),t.$set(d)},i(u){o||(te(t.$$.fragment,u),o=!0)},o(u){ue(t.$$.fragment,u),o=!1},d(u){u&&Z(n),Qt(t)}}}function Ac(i){let n,t,s;return t=new _s({props:{tokens:i[6].tokens,options:i[1],renderers:i[2]}}),{c(){n=ke("td"),Wt(t.$$.fragment)},l(o){n=we(o,"TD",{});var u=je(n);ci(t.$$.fragment,u),u.forEach(Z)},m(o,u){Ae(o,n,u),zt(t,n,null),s=!0},p(o,u){const l={};u&1&&(l.tokens=o[6].tokens),u&2&&(l.options=o[1]),u&4&&(l.renderers=o[2]),t.$set(l)},i(o){s||(te(t.$$.fragment,o),s=!0)},o(o){ue(t.$$.fragment,o),s=!1},d(o){o&&Z(n),Qt(t)}}}function _c(i){let n,t,s,o=ct(i[3]),u=[];for(let d=0;d<o.length;d+=1)u[d]=Ac(Tc(i,o,d));const l=d=>ue(u[d],1,1,()=>{u[d]=null});return{c(){n=ke("tr");for(let d=0;d<u.length;d+=1)u[d].c();t=Ea()},l(d){n=we(d,"TR",{});var f=je(n);for(let m=0;m<u.length;m+=1)u[m].l(f);t=Aa(f),f.forEach(Z)},m(d,f){Ae(d,n,f);for(let m=0;m<u.length;m+=1)u[m]&&u[m].m(n,null);Bt(n,t),s=!0},p(d,f){if(f&7){o=ct(d[3]);let m;for(m=0;m<o.length;m+=1){const S=Tc(d,o,m);u[m]?(u[m].p(S,f),te(u[m],1)):(u[m]=Ac(S),u[m].c(),te(u[m],1),u[m].m(n,t))}for(Ft(),m=o.length;m<u.length;m+=1)l(m);Ut()}},i(d){if(!s){for(let f=0;f<o.length;f+=1)te(u[f]);s=!0}},o(d){u=u.filter(Boolean);for(let f=0;f<u.length;f+=1)ue(u[f]);s=!1},d(d){d&&Z(n),ur(u,d)}}}function u0(i){let n,t,s,o,u,l,d=ct(i[0].header),f=[];for(let k=0;k<d.length;k+=1)f[k]=Ec(Dc(i,d,k));const m=k=>ue(f[k],1,1,()=>{f[k]=null});let S=ct(i[0].rows),E=[];for(let k=0;k<S.length;k+=1)E[k]=_c(Sc(i,S,k));const B=k=>ue(E[k],1,1,()=>{E[k]=null});return{c(){n=ke("table"),t=ke("thead"),s=ke("tr");for(let k=0;k<f.length;k+=1)f[k].c();o=Ea(),u=ke("tbody");for(let k=0;k<E.length;k+=1)E[k].c()},l(k){n=we(k,"TABLE",{});var N=je(n);t=we(N,"THEAD",{});var x=je(t);s=we(x,"TR",{});var X=je(s);for(let Ge=0;Ge<f.length;Ge+=1)f[Ge].l(X);X.forEach(Z),x.forEach(Z),o=Aa(N),u=we(N,"TBODY",{});var ge=je(u);for(let Ge=0;Ge<E.length;Ge+=1)E[Ge].l(ge);ge.forEach(Z),N.forEach(Z)},m(k,N){Ae(k,n,N),Bt(n,t),Bt(t,s);for(let x=0;x<f.length;x+=1)f[x]&&f[x].m(s,null);Bt(n,o),Bt(n,u);for(let x=0;x<E.length;x+=1)E[x]&&E[x].m(u,null);l=!0},p(k,[N]){if(N&7){d=ct(k[0].header);let x;for(x=0;x<d.length;x+=1){const X=Dc(k,d,x);f[x]?(f[x].p(X,N),te(f[x],1)):(f[x]=Ec(X),f[x].c(),te(f[x],1),f[x].m(s,null))}for(Ft(),x=d.length;x<f.length;x+=1)m(x);Ut()}if(N&7){S=ct(k[0].rows);let x;for(x=0;x<S.length;x+=1){const X=Sc(k,S,x);E[x]?(E[x].p(X,N),te(E[x],1)):(E[x]=_c(X),E[x].c(),te(E[x],1),E[x].m(u,null))}for(Ft(),x=S.length;x<E.length;x+=1)B(x);Ut()}},i(k){if(!l){for(let N=0;N<d.length;N+=1)te(f[N]);for(let N=0;N<S.length;N+=1)te(E[N]);l=!0}},o(k){f=f.filter(Boolean);for(let N=0;N<f.length;N+=1)ue(f[N]);E=E.filter(Boolean);for(let N=0;N<E.length;N+=1)ue(E[N]);l=!1},d(k){k&&Z(n),ur(f,k),ur(E,k)}}}function l0(i,n,t){let{token:s}=n,{options:o}=n,{renderers:u}=n;return i.$$set=l=>{"token"in l&&t(0,s=l.token),"options"in l&&t(1,o=l.options),"renderers"in l&&t(2,u=l.renderers)},[s,o,u]}class c0 extends Oe{constructor(n){super(),Le(this,n,l0,u0,Ue,{token:0,options:1,renderers:2})}}function p0(i){let n,t=i[0].text+"",s;return{c(){n=new bT(!1),s=tn(),this.h()},l(o){n=kT(o,!1),s=tn(),this.h()},h(){n.a=s},m(o,u){n.m(t,o,u),Ae(o,s,u)},p(o,[u]){u&1&&t!==(t=o[0].text+"")&&n.p(t)},i:Xe,o:Xe,d(o){o&&(Z(s),n.d())}}}function d0(i,n,t){let{token:s}=n;const o=void 0,u=void 0;return i.$$set=l=>{"token"in l&&t(0,s=l.token)},[s,o,u]}class f0 extends Oe{constructor(n){super(),Le(this,n,d0,p0,Ue,{token:0,options:1,renderers:2})}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function g0(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("p"),o&&o.c()},l(u){n=we(u,"P",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function h0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class y0 extends Oe{constructor(n){super(),Le(this,n,h0,g0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function m0(i){let n,t,s,o;const u=i[4].default,l=nt(u,i,i[3],null);return{c(){n=ke("a"),l&&l.c(),this.h()},l(d){n=we(d,"A",{href:!0,title:!0});var f=je(n);l&&l.l(f),f.forEach(Z),this.h()},h(){yn(n,"href",t=ca(i[0].href)?la(i[1].baseUrl,i[0].href):i[0].href),yn(n,"title",s=i[0].title)},m(d,f){Ae(d,n,f),l&&l.m(n,null),o=!0},p(d,[f]){l&&l.p&&(!o||f&8)&&tt(l,u,d,d[3],o?rt(u,d[3],f,null):it(d[3]),null),(!o||f&3&&t!==(t=ca(d[0].href)?la(d[1].baseUrl,d[0].href):d[0].href))&&yn(n,"href",t),(!o||f&1&&s!==(s=d[0].title))&&yn(n,"title",s)},i(d){o||(te(l,d),o=!0)},o(d){ue(l,d),o=!1},d(d){d&&Z(n),l&&l.d(d)}}}function S0(i,n,t){let{$$slots:s={},$$scope:o}=n,{token:u}=n,{options:l}=n;const d=void 0;return i.$$set=f=>{"token"in f&&t(0,u=f.token),"options"in f&&t(1,l=f.options),"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class T0 extends Oe{constructor(n){super(),Le(this,n,S0,m0,Ue,{token:0,options:1,renderers:2})}get renderers(){return this.$$.ctx[2]}}function D0(i){let n;const t=i[4].default,s=nt(t,i,i[3],null);return{c(){s&&s.c()},l(o){s&&s.l(o)},m(o,u){s&&s.m(o,u),n=!0},p(o,[u]){s&&s.p&&(!n||u&8)&&tt(s,t,o,o[3],n?rt(t,o[3],u,null):it(o[3]),null)},i(o){n||(te(s,o),n=!0)},o(o){ue(s,o),n=!1},d(o){s&&s.d(o)}}}function E0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class A0 extends Oe{constructor(n){super(),Le(this,n,E0,D0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function _0(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("dfn"),o&&o.c()},l(u){n=we(u,"DFN",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function v0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class I0 extends Oe{constructor(n){super(),Le(this,n,v0,_0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function C0(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("del"),o&&o.c()},l(u){n=we(u,"DEL",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function B0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class F0 extends Oe{constructor(n){super(),Le(this,n,B0,C0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function U0(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("em"),o&&o.c()},l(u){n=we(u,"EM",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function R0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class b0 extends Oe{constructor(n){super(),Le(this,n,R0,U0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function k0(i){let n;return{c(){n=ke("hr")},l(t){n=we(t,"HR",{})},m(t,s){Ae(t,n,s)},p:Xe,i:Xe,o:Xe,d(t){t&&Z(n)}}}function w0(i,n,t){return[void 0,void 0,void 0]}class N0 extends Oe{constructor(n){super(),Le(this,n,w0,k0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function x0(i){let n,t;const s=i[4].default,o=nt(s,i,i[3],null);return{c(){n=ke("strong"),o&&o.c()},l(u){n=we(u,"STRONG",{});var l=je(n);o&&o.l(l),l.forEach(Z)},m(u,l){Ae(u,n,l),o&&o.m(n,null),t=!0},p(u,[l]){o&&o.p&&(!t||l&8)&&tt(o,s,u,u[3],t?rt(s,u[3],l,null):it(u[3]),null)},i(u){t||(te(o,u),t=!0)},o(u){ue(o,u),t=!1},d(u){u&&Z(n),o&&o.d(u)}}}function O0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class L0 extends Oe{constructor(n){super(),Le(this,n,O0,x0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function P0(i){let n,t,s,o;return{c(){n=ke("img"),this.h()},l(u){n=we(u,"IMG",{src:!0,title:!0,alt:!0,class:!0}),this.h()},h(){pc(n.src,t=i[0].href)||yn(n,"src",t),yn(n,"title",s=i[0].title),yn(n,"alt",o=i[0].text),yn(n,"class","markdown-image svelte-z38cge")},m(u,l){Ae(u,n,l)},p(u,[l]){l&1&&!pc(n.src,t=u[0].href)&&yn(n,"src",t),l&1&&s!==(s=u[0].title)&&yn(n,"title",s),l&1&&o!==(o=u[0].text)&&yn(n,"alt",o)},i:Xe,o:Xe,d(u){u&&Z(n)}}}function M0(i,n,t){let{token:s}=n;const o=void 0,u=void 0;return i.$$set=l=>{"token"in l&&t(0,s=l.token)},[s,o,u]}class $0 extends Oe{constructor(n){super(),Le(this,n,M0,P0,Ue,{token:0,options:1,renderers:2})}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function V0(i){let n;const t=i[4].default,s=nt(t,i,i[3],null);return{c(){s&&s.c()},l(o){s&&s.l(o)},m(o,u){s&&s.m(o,u),n=!0},p(o,[u]){s&&s.p&&(!n||u&8)&&tt(s,t,o,o[3],n?rt(t,o[3],u,null):it(o[3]),null)},i(o){n||(te(s,o),n=!0)},o(o){ue(s,o),n=!1},d(o){s&&s.d(o)}}}function G0(i,n,t){let{$$slots:s={},$$scope:o}=n;const u=void 0,l=void 0,d=void 0;return i.$$set=f=>{"$$scope"in f&&t(3,o=f.$$scope)},[u,l,d,o,s]}class vc extends Oe{constructor(n){super(),Le(this,n,G0,V0,Ue,{token:0,options:1,renderers:2})}get token(){return this.$$.ctx[0]}get options(){return this.$$.ctx[1]}get renderers(){return this.$$.ctx[2]}}function _a(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let pi=_a();function Zc(i){pi=i}const Kc=/[&<>"']/,q0=new RegExp(Kc.source,"g"),ep=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,j0=new RegExp(ep.source,"g"),W0={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ic=i=>W0[i];function Cn(i,n){if(n){if(Kc.test(i))return i.replace(q0,Ic)}else if(ep.test(i))return i.replace(j0,Ic);return i}const z0=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Q0(i){return i.replace(z0,(n,t)=>(t=t.toLowerCase(),t==="colon"?":":t.charAt(0)==="#"?t.charAt(1)==="x"?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const Y0=/(^|[^\[])\^/g;function Se(i,n){i=typeof i=="string"?i:i.source,n=n||"";const t={replace:(s,o)=>(o=typeof o=="object"&&"source"in o?o.source:o,o=o.replace(Y0,"$1"),i=i.replace(s,o),t),getRegex:()=>new RegExp(i,n)};return t}function Cc(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch{return null}return i}const gs={exec:()=>null};function Bc(i,n){const t=i.replace(/\|/g,(u,l,d)=>{let f=!1,m=l;for(;--m>=0&&d[m]==="\\";)f=!f;return f?"|":" |"}),s=t.split(/ \|/);let o=0;if(s[0].trim()||s.shift(),s.length>0&&!s[s.length-1].trim()&&s.pop(),n)if(s.length>n)s.splice(n);else for(;s.length<n;)s.push("");for(;o<s.length;o++)s[o]=s[o].trim().replace(/\\\|/g,"|");return s}function ia(i,n,t){const s=i.length;if(s===0)return"";let o=0;for(;o<s;){const u=i.charAt(s-o-1);if(u===n&&!t)o++;else if(u!==n&&t)o++;else break}return i.slice(0,s-o)}function H0(i,n){if(i.indexOf(n[1])===-1)return-1;let t=0;for(let s=0;s<i.length;s++)if(i[s]==="\\")s++;else if(i[s]===n[0])t++;else if(i[s]===n[1]&&(t--,t<0))return s;return-1}function Fc(i,n,t,s){const o=n.href,u=n.title?Cn(n.title):null,l=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){s.state.inLink=!0;const d={type:"link",raw:t,href:o,title:u,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,d}return{type:"image",raw:t,href:o,title:u,text:Cn(l)}}function J0(i,n){const t=i.match(/^(\s+)(?:```)/);if(t===null)return n;const s=t[1];return n.split(`
`).map(o=>{const u=o.match(/^\s+/);if(u===null)return o;const[l]=u;return l.length>=s.length?o.slice(s.length):o}).join(`
`)}class hs{constructor(n){De(this,"options");De(this,"rules");De(this,"lexer");this.options=n||pi}space(n){const t=this.rules.block.newline.exec(n);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(n){const t=this.rules.block.code.exec(n);if(t){const s=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?s:ia(s,`
`)}}}fences(n){const t=this.rules.block.fences.exec(n);if(t){const s=t[0],o=J0(s,t[3]||"");return{type:"code",raw:s,lang:t[2]?t[2].trim().replace(this.rules.inline._escapes,"$1"):t[2],text:o}}}heading(n){const t=this.rules.block.heading.exec(n);if(t){let s=t[2].trim();if(/#$/.test(s)){const o=ia(s,"#");(this.options.pedantic||!o||/ $/.test(o))&&(s=o.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:s,tokens:this.lexer.inline(s)}}}hr(n){const t=this.rules.block.hr.exec(n);if(t)return{type:"hr",raw:t[0]}}blockquote(n){const t=this.rules.block.blockquote.exec(n);if(t){const s=t[0].replace(/^ *>[ \t]?/gm,""),o=this.lexer.state.top;this.lexer.state.top=!0;const u=this.lexer.blockTokens(s);return this.lexer.state.top=o,{type:"blockquote",raw:t[0],tokens:u,text:s}}}list(n){let t=this.rules.block.list.exec(n);if(t){let s=t[1].trim();const o=s.length>1,u={type:"list",raw:"",ordered:o,start:o?+s.slice(0,-1):"",loose:!1,items:[]};s=o?`\\d{1,9}\\${s.slice(-1)}`:`\\${s}`,this.options.pedantic&&(s=o?s:"[*+-]");const l=new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`);let d="",f="",m=!1;for(;n;){let S=!1;if(!(t=l.exec(n))||this.rules.block.hr.test(n))break;d=t[0],n=n.substring(d.length);let E=t[2].split(`
`,1)[0].replace(/^\t+/,ge=>" ".repeat(3*ge.length)),B=n.split(`
`,1)[0],k=0;this.options.pedantic?(k=2,f=E.trimStart()):(k=t[2].search(/[^ ]/),k=k>4?1:k,f=E.slice(k),k+=t[1].length);let N=!1;if(!E&&/^ *$/.test(B)&&(d+=B+`
`,n=n.substring(B.length+1),S=!0),!S){const ge=new RegExp(`^ {0,${Math.min(3,k-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),Ge=new RegExp(`^ {0,${Math.min(3,k-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),Ie=new RegExp(`^ {0,${Math.min(3,k-1)}}(?:\`\`\`|~~~)`),Re=new RegExp(`^ {0,${Math.min(3,k-1)}}#`);for(;n;){const Ne=n.split(`
`,1)[0];if(B=Ne,this.options.pedantic&&(B=B.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),Ie.test(B)||Re.test(B)||ge.test(B)||Ge.test(n))break;if(B.search(/[^ ]/)>=k||!B.trim())f+=`
`+B.slice(k);else{if(N||E.search(/[^ ]/)>=4||Ie.test(E)||Re.test(E)||Ge.test(E))break;f+=`
`+B}!N&&!B.trim()&&(N=!0),d+=Ne+`
`,n=n.substring(Ne.length+1),E=B.slice(k)}}u.loose||(m?u.loose=!0:/\n *\n *$/.test(d)&&(m=!0));let x=null,X;this.options.gfm&&(x=/^\[[ xX]\] /.exec(f),x&&(X=x[0]!=="[ ] ",f=f.replace(/^\[[ xX]\] +/,""))),u.items.push({type:"list_item",raw:d,task:!!x,checked:X,loose:!1,text:f,tokens:[]}),u.raw+=d}u.items[u.items.length-1].raw=d.trimEnd(),u.items[u.items.length-1].text=f.trimEnd(),u.raw=u.raw.trimEnd();for(let S=0;S<u.items.length;S++)if(this.lexer.state.top=!1,u.items[S].tokens=this.lexer.blockTokens(u.items[S].text,[]),!u.loose){const E=u.items[S].tokens.filter(k=>k.type==="space"),B=E.length>0&&E.some(k=>/\n.*\n/.test(k.raw));u.loose=B}if(u.loose)for(let S=0;S<u.items.length;S++)u.items[S].loose=!0;return u}}html(n){const t=this.rules.block.html.exec(n);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(n){const t=this.rules.block.def.exec(n);if(t){const s=t[1].toLowerCase().replace(/\s+/g," "),o=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline._escapes,"$1"):"",u=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline._escapes,"$1"):t[3];return{type:"def",tag:s,raw:t[0],href:o,title:u}}}table(n){const t=this.rules.block.table.exec(n);if(t){if(!/[:|]/.test(t[2]))return;const s={type:"table",raw:t[0],header:Bc(t[1]).map(o=>({text:o,tokens:[]})),align:t[2].replace(/^\||\| *$/g,"").split("|"),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[]};if(s.header.length===s.align.length){let o=s.align.length,u,l,d,f;for(u=0;u<o;u++){const m=s.align[u];m&&(/^ *-+: *$/.test(m)?s.align[u]="right":/^ *:-+: *$/.test(m)?s.align[u]="center":/^ *:-+ *$/.test(m)?s.align[u]="left":s.align[u]=null)}for(o=s.rows.length,u=0;u<o;u++)s.rows[u]=Bc(s.rows[u],s.header.length).map(m=>({text:m,tokens:[]}));for(o=s.header.length,l=0;l<o;l++)s.header[l].tokens=this.lexer.inline(s.header[l].text);for(o=s.rows.length,l=0;l<o;l++)for(f=s.rows[l],d=0;d<f.length;d++)f[d].tokens=this.lexer.inline(f[d].text);return s}}}lheading(n){const t=this.rules.block.lheading.exec(n);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(n){const t=this.rules.block.paragraph.exec(n);if(t){const s=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:s,tokens:this.lexer.inline(s)}}}text(n){const t=this.rules.block.text.exec(n);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(n){const t=this.rules.inline.escape.exec(n);if(t)return{type:"escape",raw:t[0],text:Cn(t[1])}}tag(n){const t=this.rules.inline.tag.exec(n);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(n){const t=this.rules.inline.link.exec(n);if(t){const s=t[2].trim();if(!this.options.pedantic&&/^</.test(s)){if(!/>$/.test(s))return;const l=ia(s.slice(0,-1),"\\");if((s.length-l.length)%2===0)return}else{const l=H0(t[2],"()");if(l>-1){const f=(t[0].indexOf("!")===0?5:4)+t[1].length+l;t[2]=t[2].substring(0,l),t[0]=t[0].substring(0,f).trim(),t[3]=""}}let o=t[2],u="";if(this.options.pedantic){const l=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(o);l&&(o=l[1],u=l[3])}else u=t[3]?t[3].slice(1,-1):"";return o=o.trim(),/^</.test(o)&&(this.options.pedantic&&!/>$/.test(s)?o=o.slice(1):o=o.slice(1,-1)),Fc(t,{href:o&&o.replace(this.rules.inline._escapes,"$1"),title:u&&u.replace(this.rules.inline._escapes,"$1")},t[0],this.lexer)}}reflink(n,t){let s;if((s=this.rules.inline.reflink.exec(n))||(s=this.rules.inline.nolink.exec(n))){let o=(s[2]||s[1]).replace(/\s+/g," ");if(o=t[o.toLowerCase()],!o){const u=s[0].charAt(0);return{type:"text",raw:u,text:u}}return Fc(s,o,s[0],this.lexer)}}emStrong(n,t,s=""){let o=this.rules.inline.emStrong.lDelim.exec(n);if(!o||o[3]&&s.match(/[\p{L}\p{N}]/u))return;if(!(o[1]||o[2]||"")||!s||this.rules.inline.punctuation.exec(s)){const l=[...o[0]].length-1;let d,f,m=l,S=0;const E=o[0][0]==="*"?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(E.lastIndex=0,t=t.slice(-1*n.length+o[0].length-1);(o=E.exec(t))!=null;){if(d=o[1]||o[2]||o[3]||o[4]||o[5]||o[6],!d)continue;if(f=[...d].length,o[3]||o[4]){m+=f;continue}else if((o[5]||o[6])&&l%3&&!((l+f)%3)){S+=f;continue}if(m-=f,m>0)continue;f=Math.min(f,f+m+S);const B=[...n].slice(0,l+o.index+f+1).join("");if(Math.min(l,f)%2){const N=B.slice(1,-1);return{type:"em",raw:B,text:N,tokens:this.lexer.inlineTokens(N)}}const k=B.slice(2,-2);return{type:"strong",raw:B,text:k,tokens:this.lexer.inlineTokens(k)}}}}codespan(n){const t=this.rules.inline.code.exec(n);if(t){let s=t[2].replace(/\n/g," ");const o=/[^ ]/.test(s),u=/^ /.test(s)&&/ $/.test(s);return o&&u&&(s=s.substring(1,s.length-1)),s=Cn(s,!0),{type:"codespan",raw:t[0],text:s}}}br(n){const t=this.rules.inline.br.exec(n);if(t)return{type:"br",raw:t[0]}}del(n){const t=this.rules.inline.del.exec(n);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(n){const t=this.rules.inline.autolink.exec(n);if(t){let s,o;return t[2]==="@"?(s=Cn(t[1]),o="mailto:"+s):(s=Cn(t[1]),o=s),{type:"link",raw:t[0],text:s,href:o,tokens:[{type:"text",raw:s,text:s}]}}}url(n){let t;if(t=this.rules.inline.url.exec(n)){let s,o;if(t[2]==="@")s=Cn(t[0]),o="mailto:"+s;else{let u;do u=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])[0];while(u!==t[0]);s=Cn(t[0]),t[1]==="www."?o="http://"+t[0]:o=t[0]}return{type:"link",raw:t[0],text:s,href:o,tokens:[{type:"text",raw:s,text:s}]}}}inlineText(n){const t=this.rules.inline.text.exec(n);if(t){let s;return this.lexer.state.inRawBlock?s=t[0]:s=Cn(t[0]),{type:"text",raw:t[0],text:s}}}}const W={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:gs,lheading:/^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/};W._label=/(?!\s*\])(?:\\.|[^\[\]\\])+/;W._title=/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;W.def=Se(W.def).replace("label",W._label).replace("title",W._title).getRegex();W.bullet=/(?:[*+-]|\d{1,9}[.)])/;W.listItemStart=Se(/^( *)(bull) */).replace("bull",W.bullet).getRegex();W.list=Se(W.list).replace(/bull/g,W.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+W.def.source+")").getRegex();W._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";W._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/;W.html=Se(W.html,"i").replace("comment",W._comment).replace("tag",W._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();W.lheading=Se(W.lheading).replace(/bull/g,W.bullet).getRegex();W.paragraph=Se(W._paragraph).replace("hr",W.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",W._tag).getRegex();W.blockquote=Se(W.blockquote).replace("paragraph",W.paragraph).getRegex();W.normal={...W};W.gfm={...W.normal,table:"^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"};W.gfm.table=Se(W.gfm.table).replace("hr",W.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",W._tag).getRegex();W.gfm.paragraph=Se(W._paragraph).replace("hr",W.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",W.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",W._tag).getRegex();W.pedantic={...W.normal,html:Se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",W._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:gs,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Se(W.normal._paragraph).replace("hr",W.hr).replace("heading",` *#{1,6} *[^
]`).replace("lheading",W.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()};const P={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:gs,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,rDelimAst:/^[^_*]*?__[^_*]*?\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\*)[punct](\*+)(?=[\s]|$)|[^punct\s](\*+)(?!\*)(?=[punct\s]|$)|(?!\*)[punct\s](\*+)(?=[^punct\s])|[\s](\*+)(?!\*)(?=[punct])|(?!\*)[punct](\*+)(?!\*)(?=[punct])|[^punct\s](\*+)(?=[^punct\s])/,rDelimUnd:/^[^_*]*?\*\*[^_*]*?_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\s]|$)|[^punct\s](_+)(?!_)(?=[punct\s]|$)|(?!_)[punct\s](_+)(?=[^punct\s])|[\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:gs,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^((?![*_])[\spunctuation])/};P._punctuation="\\p{P}$+<=>`^|~";P.punctuation=Se(P.punctuation,"u").replace(/punctuation/g,P._punctuation).getRegex();P.blockSkip=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;P.anyPunctuation=/\\[punct]/g;P._escapes=/\\([punct])/g;P._comment=Se(W._comment).replace("(?:-->|$)","-->").getRegex();P.emStrong.lDelim=Se(P.emStrong.lDelim,"u").replace(/punct/g,P._punctuation).getRegex();P.emStrong.rDelimAst=Se(P.emStrong.rDelimAst,"gu").replace(/punct/g,P._punctuation).getRegex();P.emStrong.rDelimUnd=Se(P.emStrong.rDelimUnd,"gu").replace(/punct/g,P._punctuation).getRegex();P.anyPunctuation=Se(P.anyPunctuation,"gu").replace(/punct/g,P._punctuation).getRegex();P._escapes=Se(P._escapes,"gu").replace(/punct/g,P._punctuation).getRegex();P._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;P._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;P.autolink=Se(P.autolink).replace("scheme",P._scheme).replace("email",P._email).getRegex();P._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;P.tag=Se(P.tag).replace("comment",P._comment).replace("attribute",P._attribute).getRegex();P._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;P._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;P._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;P.link=Se(P.link).replace("label",P._label).replace("href",P._href).replace("title",P._title).getRegex();P.reflink=Se(P.reflink).replace("label",P._label).replace("ref",W._label).getRegex();P.nolink=Se(P.nolink).replace("ref",W._label).getRegex();P.reflinkSearch=Se(P.reflinkSearch,"g").replace("reflink",P.reflink).replace("nolink",P.nolink).getRegex();P.normal={...P};P.pedantic={...P.normal,strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:Se(/^!?\[(label)\]\((.*?)\)/).replace("label",P._label).getRegex(),reflink:Se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",P._label).getRegex()};P.gfm={...P.normal,escape:Se(P.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/};P.gfm.url=Se(P.gfm.url,"i").replace("email",P.gfm._extended_email).getRegex();P.breaks={...P.gfm,br:Se(P.br).replace("{2,}","*").getRegex(),text:Se(P.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()};class Hn{constructor(n){De(this,"tokens");De(this,"options");De(this,"state");De(this,"tokenizer");De(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=n||pi,this.options.tokenizer=this.options.tokenizer||new hs,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:W.normal,inline:P.normal};this.options.pedantic?(t.block=W.pedantic,t.inline=P.pedantic):this.options.gfm&&(t.block=W.gfm,this.options.breaks?t.inline=P.breaks:t.inline=P.gfm),this.tokenizer.rules=t}static get rules(){return{block:W,inline:P}}static lex(n,t){return new Hn(t).lex(n)}static lexInline(n,t){return new Hn(t).inlineTokens(n)}lex(n){n=n.replace(/\r\n|\r/g,`
`),this.blockTokens(n,this.tokens);let t;for(;t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(n,t=[]){this.options.pedantic?n=n.replace(/\t/g,"    ").replace(/^ +$/gm,""):n=n.replace(/^( *)(\t+)/gm,(d,f,m)=>f+"    ".repeat(m.length));let s,o,u,l;for(;n;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(d=>(s=d.call({lexer:this},n,t))?(n=n.substring(s.raw.length),t.push(s),!0):!1))){if(s=this.tokenizer.space(n)){n=n.substring(s.raw.length),s.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(s);continue}if(s=this.tokenizer.code(n)){n=n.substring(s.raw.length),o=t[t.length-1],o&&(o.type==="paragraph"||o.type==="text")?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue[this.inlineQueue.length-1].src=o.text):t.push(s);continue}if(s=this.tokenizer.fences(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.heading(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.hr(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.blockquote(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.list(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.html(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.def(n)){n=n.substring(s.raw.length),o=t[t.length-1],o&&(o.type==="paragraph"||o.type==="text")?(o.raw+=`
`+s.raw,o.text+=`
`+s.raw,this.inlineQueue[this.inlineQueue.length-1].src=o.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title});continue}if(s=this.tokenizer.table(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.lheading(n)){n=n.substring(s.raw.length),t.push(s);continue}if(u=n,this.options.extensions&&this.options.extensions.startBlock){let d=1/0;const f=n.slice(1);let m;this.options.extensions.startBlock.forEach(S=>{m=S.call({lexer:this},f),typeof m=="number"&&m>=0&&(d=Math.min(d,m))}),d<1/0&&d>=0&&(u=n.substring(0,d+1))}if(this.state.top&&(s=this.tokenizer.paragraph(u))){o=t[t.length-1],l&&o.type==="paragraph"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=o.text):t.push(s),l=u.length!==n.length,n=n.substring(s.raw.length);continue}if(s=this.tokenizer.text(n)){n=n.substring(s.raw.length),o=t[t.length-1],o&&o.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=o.text):t.push(s);continue}if(n){const d="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return this.state.top=!0,t}inline(n,t=[]){return this.inlineQueue.push({src:n,tokens:t}),t}inlineTokens(n,t=[]){let s,o,u,l=n,d,f,m;if(this.tokens.links){const S=Object.keys(this.tokens.links);if(S.length>0)for(;(d=this.tokenizer.rules.inline.reflinkSearch.exec(l))!=null;)S.includes(d[0].slice(d[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,d.index)+"["+"a".repeat(d[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(d=this.tokenizer.rules.inline.blockSkip.exec(l))!=null;)l=l.slice(0,d.index)+"["+"a".repeat(d[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(d=this.tokenizer.rules.inline.anyPunctuation.exec(l))!=null;)l=l.slice(0,d.index)+"++"+l.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;n;)if(f||(m=""),f=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(S=>(s=S.call({lexer:this},n,t))?(n=n.substring(s.raw.length),t.push(s),!0):!1))){if(s=this.tokenizer.escape(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.tag(n)){n=n.substring(s.raw.length),o=t[t.length-1],o&&s.type==="text"&&o.type==="text"?(o.raw+=s.raw,o.text+=s.text):t.push(s);continue}if(s=this.tokenizer.link(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.reflink(n,this.tokens.links)){n=n.substring(s.raw.length),o=t[t.length-1],o&&s.type==="text"&&o.type==="text"?(o.raw+=s.raw,o.text+=s.text):t.push(s);continue}if(s=this.tokenizer.emStrong(n,l,m)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.codespan(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.br(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.del(n)){n=n.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.autolink(n)){n=n.substring(s.raw.length),t.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(n))){n=n.substring(s.raw.length),t.push(s);continue}if(u=n,this.options.extensions&&this.options.extensions.startInline){let S=1/0;const E=n.slice(1);let B;this.options.extensions.startInline.forEach(k=>{B=k.call({lexer:this},E),typeof B=="number"&&B>=0&&(S=Math.min(S,B))}),S<1/0&&S>=0&&(u=n.substring(0,S+1))}if(s=this.tokenizer.inlineText(u)){n=n.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(m=s.raw.slice(-1)),f=!0,o=t[t.length-1],o&&o.type==="text"?(o.raw+=s.raw,o.text+=s.text):t.push(s);continue}if(n){const S="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(S);break}else throw new Error(S)}}return t}}class ys{constructor(n){De(this,"options");this.options=n||pi}code(n,t,s){var u;const o=(u=(t||"").match(/^\S*/))==null?void 0:u[0];return n=n.replace(/\n$/,"")+`
`,o?'<pre><code class="language-'+Cn(o)+'">'+(s?n:Cn(n,!0))+`</code></pre>
`:"<pre><code>"+(s?n:Cn(n,!0))+`</code></pre>
`}blockquote(n){return`<blockquote>
${n}</blockquote>
`}html(n,t){return n}heading(n,t,s){return`<h${t}>${n}</h${t}>
`}hr(){return`<hr>
`}list(n,t,s){const o=t?"ol":"ul",u=t&&s!==1?' start="'+s+'"':"";return"<"+o+u+`>
`+n+"</"+o+`>
`}listitem(n,t,s){return`<li>${n}</li>
`}checkbox(n){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(n){return`<p>${n}</p>
`}table(n,t){return t&&(t=`<tbody>${t}</tbody>`),`<table>
<thead>
`+n+`</thead>
`+t+`</table>
`}tablerow(n){return`<tr>
${n}</tr>
`}tablecell(n,t){const s=t.header?"th":"td";return(t.align?`<${s} align="${t.align}">`:`<${s}>`)+n+`</${s}>
`}strong(n){return`<strong>${n}</strong>`}em(n){return`<em>${n}</em>`}codespan(n){return`<code>${n}</code>`}br(){return"<br>"}del(n){return`<del>${n}</del>`}link(n,t,s){const o=Cc(n);if(o===null)return s;n=o;let u='<a href="'+n+'"';return t&&(u+=' title="'+t+'"'),u+=">"+s+"</a>",u}image(n,t,s){const o=Cc(n);if(o===null)return s;n=o;let u=`<img src="${n}" alt="${s}"`;return t&&(u+=` title="${t}"`),u+=">",u}text(n){return n}}class va{strong(n){return n}em(n){return n}codespan(n){return n}del(n){return n}html(n){return n}text(n){return n}link(n,t,s){return""+s}image(n,t,s){return""+s}br(){return""}}class pt{constructor(n){De(this,"options");De(this,"renderer");De(this,"textRenderer");this.options=n||pi,this.options.renderer=this.options.renderer||new ys,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new va}static parse(n,t){return new pt(t).parse(n)}static parseInline(n,t){return new pt(t).parseInline(n)}parse(n,t=!0){let s="";for(let o=0;o<n.length;o++){const u=n[o];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[u.type]){const l=u,d=this.options.extensions.renderers[l.type].call({parser:this},l);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){s+=d||"";continue}}switch(u.type){case"space":continue;case"hr":{s+=this.renderer.hr();continue}case"heading":{const l=u;s+=this.renderer.heading(this.parseInline(l.tokens),l.depth,Q0(this.parseInline(l.tokens,this.textRenderer)));continue}case"code":{const l=u;s+=this.renderer.code(l.text,l.lang,!!l.escaped);continue}case"table":{const l=u;let d="",f="";for(let S=0;S<l.header.length;S++)f+=this.renderer.tablecell(this.parseInline(l.header[S].tokens),{header:!0,align:l.align[S]});d+=this.renderer.tablerow(f);let m="";for(let S=0;S<l.rows.length;S++){const E=l.rows[S];f="";for(let B=0;B<E.length;B++)f+=this.renderer.tablecell(this.parseInline(E[B].tokens),{header:!1,align:l.align[B]});m+=this.renderer.tablerow(f)}s+=this.renderer.table(d,m);continue}case"blockquote":{const l=u,d=this.parse(l.tokens);s+=this.renderer.blockquote(d);continue}case"list":{const l=u,d=l.ordered,f=l.start,m=l.loose;let S="";for(let E=0;E<l.items.length;E++){const B=l.items[E],k=B.checked,N=B.task;let x="";if(B.task){const X=this.renderer.checkbox(!!k);m?B.tokens.length>0&&B.tokens[0].type==="paragraph"?(B.tokens[0].text=X+" "+B.tokens[0].text,B.tokens[0].tokens&&B.tokens[0].tokens.length>0&&B.tokens[0].tokens[0].type==="text"&&(B.tokens[0].tokens[0].text=X+" "+B.tokens[0].tokens[0].text)):B.tokens.unshift({type:"text",text:X+" "}):x+=X+" "}x+=this.parse(B.tokens,m),S+=this.renderer.listitem(x,N,!!k)}s+=this.renderer.list(S,d,f);continue}case"html":{const l=u;s+=this.renderer.html(l.text,l.block);continue}case"paragraph":{const l=u;s+=this.renderer.paragraph(this.parseInline(l.tokens));continue}case"text":{let l=u,d=l.tokens?this.parseInline(l.tokens):l.text;for(;o+1<n.length&&n[o+1].type==="text";)l=n[++o],d+=`
`+(l.tokens?this.parseInline(l.tokens):l.text);s+=t?this.renderer.paragraph(d):d;continue}default:{const l='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}parseInline(n,t){t=t||this.renderer;let s="";for(let o=0;o<n.length;o++){const u=n[o];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[u.type]){const l=this.options.extensions.renderers[u.type].call({parser:this},u);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(u.type)){s+=l||"";continue}}switch(u.type){case"escape":{const l=u;s+=t.text(l.text);break}case"html":{const l=u;s+=t.html(l.text);break}case"link":{const l=u;s+=t.link(l.href,l.title,this.parseInline(l.tokens,t));break}case"image":{const l=u;s+=t.image(l.href,l.title,l.text);break}case"strong":{const l=u;s+=t.strong(this.parseInline(l.tokens,t));break}case"em":{const l=u;s+=t.em(this.parseInline(l.tokens,t));break}case"codespan":{const l=u;s+=t.codespan(l.text);break}case"br":{s+=t.br();break}case"del":{const l=u;s+=t.del(this.parseInline(l.tokens,t));break}case"text":{const l=u;s+=t.text(l.text);break}default:{const l='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}}class or{constructor(n){De(this,"options");this.options=n||pi}preprocess(n){return n}postprocess(n){return n}}De(or,"passThroughHooks",new Set(["preprocess","postprocess"]));var cr,pa,Es,np;class X0{constructor(...n){ea(this,cr);ea(this,Es);De(this,"defaults",_a());De(this,"options",this.setOptions);De(this,"parse",ss(this,cr,pa).call(this,Hn.lex,pt.parse));De(this,"parseInline",ss(this,cr,pa).call(this,Hn.lexInline,pt.parseInline));De(this,"Parser",pt);De(this,"parser",pt.parse);De(this,"Renderer",ys);De(this,"TextRenderer",va);De(this,"Lexer",Hn);De(this,"lexer",Hn.lex);De(this,"Tokenizer",hs);De(this,"Hooks",or);this.use(...n)}walkTokens(n,t){var o,u;let s=[];for(const l of n)switch(s=s.concat(t.call(this,l)),l.type){case"table":{const d=l;for(const f of d.header)s=s.concat(this.walkTokens(f.tokens,t));for(const f of d.rows)for(const m of f)s=s.concat(this.walkTokens(m.tokens,t));break}case"list":{const d=l;s=s.concat(this.walkTokens(d.items,t));break}default:{const d=l;(u=(o=this.defaults.extensions)==null?void 0:o.childTokens)!=null&&u[d.type]?this.defaults.extensions.childTokens[d.type].forEach(f=>{s=s.concat(this.walkTokens(d[f],t))}):d.tokens&&(s=s.concat(this.walkTokens(d.tokens,t)))}}return s}use(...n){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(s=>{const o={...s};if(o.async=this.defaults.async||o.async||!1,s.extensions&&(s.extensions.forEach(u=>{if(!u.name)throw new Error("extension name required");if("renderer"in u){const l=t.renderers[u.name];l?t.renderers[u.name]=function(...d){let f=u.renderer.apply(this,d);return f===!1&&(f=l.apply(this,d)),f}:t.renderers[u.name]=u.renderer}if("tokenizer"in u){if(!u.level||u.level!=="block"&&u.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const l=t[u.level];l?l.unshift(u.tokenizer):t[u.level]=[u.tokenizer],u.start&&(u.level==="block"?t.startBlock?t.startBlock.push(u.start):t.startBlock=[u.start]:u.level==="inline"&&(t.startInline?t.startInline.push(u.start):t.startInline=[u.start]))}"childTokens"in u&&u.childTokens&&(t.childTokens[u.name]=u.childTokens)}),o.extensions=t),s.renderer){const u=this.defaults.renderer||new ys(this.defaults);for(const l in s.renderer){const d=s.renderer[l],f=l,m=u[f];u[f]=(...S)=>{let E=d.apply(u,S);return E===!1&&(E=m.apply(u,S)),E||""}}o.renderer=u}if(s.tokenizer){const u=this.defaults.tokenizer||new hs(this.defaults);for(const l in s.tokenizer){const d=s.tokenizer[l],f=l,m=u[f];u[f]=(...S)=>{let E=d.apply(u,S);return E===!1&&(E=m.apply(u,S)),E}}o.tokenizer=u}if(s.hooks){const u=this.defaults.hooks||new or;for(const l in s.hooks){const d=s.hooks[l],f=l,m=u[f];or.passThroughHooks.has(l)?u[f]=S=>{if(this.defaults.async)return Promise.resolve(d.call(u,S)).then(B=>m.call(u,B));const E=d.call(u,S);return m.call(u,E)}:u[f]=(...S)=>{let E=d.apply(u,S);return E===!1&&(E=m.apply(u,S)),E}}o.hooks=u}if(s.walkTokens){const u=this.defaults.walkTokens,l=s.walkTokens;o.walkTokens=function(d){let f=[];return f.push(l.call(this,d)),u&&(f=f.concat(u.call(this,d))),f}}this.defaults={...this.defaults,...o}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}}cr=new WeakSet,pa=function(n,t){return(s,o)=>{const u={...o},l={...this.defaults,...u};this.defaults.async===!0&&u.async===!1&&(l.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),l.async=!0);const d=ss(this,Es,np).call(this,!!l.silent,!!l.async);if(typeof s>"u"||s===null)return d(new Error("marked(): input parameter is undefined or null"));if(typeof s!="string")return d(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(s)+", string expected"));if(l.hooks&&(l.hooks.options=l),l.async)return Promise.resolve(l.hooks?l.hooks.preprocess(s):s).then(f=>n(f,l)).then(f=>l.walkTokens?Promise.all(this.walkTokens(f,l.walkTokens)).then(()=>f):f).then(f=>t(f,l)).then(f=>l.hooks?l.hooks.postprocess(f):f).catch(d);try{l.hooks&&(s=l.hooks.preprocess(s));const f=n(s,l);l.walkTokens&&this.walkTokens(f,l.walkTokens);let m=t(f,l);return l.hooks&&(m=l.hooks.postprocess(m)),m}catch(f){return d(f)}}},Es=new WeakSet,np=function(n,t){return s=>{if(s.message+=`
Please report this to https://github.com/markedjs/marked.`,n){const o="<p>An error occurred:</p><pre>"+Cn(s.message+"",!0)+"</pre>";return t?Promise.resolve(o):o}if(t)return Promise.reject(s);throw s}};const ui=new X0;function Ee(i,n){return ui.parse(i,n)}Ee.options=Ee.setOptions=function(i){return ui.setOptions(i),Ee.defaults=ui.defaults,Zc(Ee.defaults),Ee};Ee.getDefaults=_a;Ee.defaults=pi;Ee.use=function(...i){return ui.use(...i),Ee.defaults=ui.defaults,Zc(Ee.defaults),Ee};Ee.walkTokens=function(i,n){return ui.walkTokens(i,n)};Ee.parseInline=ui.parseInline;Ee.Parser=pt;Ee.parser=pt.parse;Ee.Renderer=ys;Ee.TextRenderer=va;Ee.Lexer=Hn;Ee.lexer=Hn.lex;Ee.Tokenizer=hs;Ee.Hooks=or;Ee.parse=Ee;Ee.options;Ee.setOptions;Ee.use;Ee.walkTokens;Ee.parseInline;pt.parse;Hn.lex;const Z0=/[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g,K0=Object.hasOwnProperty;class tp{constructor(){this.occurrences,this.reset()}slug(n,t){const s=this;let o=eD(n,t===!0);const u=o;for(;K0.call(s.occurrences,o);)s.occurrences[u]++,o=u+"-"+s.occurrences[u];return s.occurrences[o]=0,o}reset(){this.occurrences=Object.create(null)}}function eD(i,n){return typeof i!="string"?"":(n||(i=i.toLowerCase()),i.replace(Z0,"").replace(/ /g,"-"))}function nD(i){return new Hn().lex(i)}const tD=()=>({heading:OT,blockquote:MT,list:HT,list_item:ZT,br:n0,code:r0,codespan:a0,table:c0,html:f0,paragraph:y0,link:T0,text:A0,def:I0,del:F0,em:b0,hr:N0,strong:L0,image:$0,space:vc,escape:vc}),iD=()=>({baseUrl:"/",slugger:new tp});function rD(){const i=console.warn;console.warn=n=>{n.includes("unknown prop")||n.includes("unexpected slot")||i(n)},wT(()=>{console.warn=i})}function sD(i){let n,t;return n=new _s({props:{tokens:i[0],renderers:i[1],options:i[2]}}),{c(){Wt(n.$$.fragment)},l(s){ci(n.$$.fragment,s)},m(s,o){zt(n,s,o),t=!0},p(s,[o]){const u={};o&1&&(u.tokens=s[0]),o&2&&(u.renderers=s[1]),o&4&&(u.options=s[2]),n.$set(u)},i(s){t||(te(n.$$.fragment,s),t=!0)},o(s){ue(n.$$.fragment,s),t=!1},d(s){Qt(n,s)}}}function oD(i,n,t){rD();let{source:s}=n,{options:o={}}=n,{renderers:u={}}=n,l,d,f;return i.$$set=m=>{"source"in m&&t(3,s=m.source),"options"in m&&t(4,o=m.options),"renderers"in m&&t(5,u=m.renderers)},i.$$.update=()=>{i.$$.dirty&56&&(t(0,l=nD(s)),t(1,d={...tD(),...u}),t(2,f={...iD(),...o}))},[l,d,f,s,o,u]}class FA extends Oe{constructor(n){super(),Le(this,n,oD,sD,Ue,{source:3,options:4,renderers:5})}}const pr={joinUrlPaths:la,isRelative:ca,generatePathSegment:Jc};var tr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function aD(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function os(){return{convert:i=>i==null||i===""?null:String(i),asString:i=>String(i),type:i=>i.string().optional()}}function Uc(i){return{convert:n=>{if(typeof n=="object")return n;if(typeof n=="string"){const t=JSON.parse(n);return typeof t!="object"?null:t}return null},asString:n=>JSON.stringify(n),type:n=>n.record(i(n).optional()).optional()}}function as(i){return{convert:n=>{if(Array.isArray(n))return n;if(typeof n=="string"){const t=JSON.parse(n);return Array.isArray(t)?t:null}return null},asString:n=>JSON.stringify(n),type:n=>n.array(i(n)).optional()}}function Rc(i){return{convert:n=>n==null||!i.find(t=>t===n)?null:n,asString:n=>String(n),type:n=>n.enum(i).optional()}}function In(i,n){const t=s=>n.convert(s[i]);return{name:uD(i),key:i,asEnv:s=>({[i]:n.asString(s)}),zod:{type:n.type},get:t,getOrDefault:(s,o)=>t(s)??o}}function uD(i){return i.toLowerCase().replace(/([-_][a-z])/gi,n=>n.toUpperCase().replace("-","").replace("_",""))}var Ia={APP_LOGO:In("APP_LOGO",os()),APP_TITLE:In("APP_TITLE",os()),APP_FAVICON:In("APP_FAVICON",os()),SITE_ROOT:In("SITE_ROOT",os()),SITE_META:In("SITE_META",Uc(i=>i.string())),CUSTOM_STYLES:In("CUSTOM_STYLES",as(i=>i.string())),FIELDS_SORTING:In("FIELDS_SORTING",Rc(["default","alphabetical"])),ARGUMENTS_SORTING:In("ARGUMENTS_SORTING",Rc(["default","alphabetical"])),QUERY_GENERATION_FACTORIES:In("QUERY_GENERATION_FACTORIES",Uc(i=>i.union([i.string(),i.boolean(),i.number(),i.null(),i.record(i.unknown())]))),PAGES:In("PAGES",as(i=>{const n=i.lazy(()=>i.object({title:i.string().min(1),content:i.union([i.array(n),i.string().min(1)])}));return n})),EXTERNAL_LINKS:In("EXTERNAL_LINKS",as(i=>i.object({label:i.string().min(1),href:i.string().min(1),position:i.union([i.literal("header"),i.literal("navigation")]).optional(),kind:i.string().min(1).optional(),group:i.string().min(1).optional()}))),DIRECTIVES:In("DIRECTIVES",as(i=>i.object({name:i.string().min(1),args:i.array(i.string())})))};function lD(){return{convert:i=>{if(i===null||i===void 0)return null;switch(typeof i){case"boolean":return i;case"string":const n=i.toLowerCase().trim();return n==="true"||n==="t"||n==="1";case"number":return i!==0;default:return null}},asString:i=>String(i),type:i=>i.boolean().optional()}}In("MAGIDOC_GENERATE",lD());var ms={exports:{}};/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ms.exports;(function(i,n){(function(){var t,s="4.17.21",o=200,u="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",l="Expected a function",d="Invalid `variable` option passed into `_.template`",f="__lodash_hash_undefined__",m=500,S="__lodash_placeholder__",E=1,B=2,k=4,N=1,x=2,X=1,ge=2,Ge=4,Ie=8,Re=16,Ne=32,rn=64,Ze=128,ht=256,b=512,K=30,sn="...",wt=800,Jt=16,gr=1,fi=2,hr=3,ot=1/0,$n=9007199254740991,gi=17976931348623157e292,Xt=0/0,Bn=4294967295,C=Bn-1,V=Bn>>>1,L=[["ary",Ze],["bind",X],["bindKey",ge],["curry",Ie],["curryRight",Re],["flip",b],["partial",Ne],["partialRight",rn],["rearg",ht]],M="[object Arguments]",he="[object Array]",Pe="[object AsyncFunction]",ye="[object Boolean]",Fn="[object Date]",xi="[object DOMException]",Nt="[object Error]",Ke="[object Function]",wa="[object GeneratorFunction]",Vn="[object Map]",Oi="[object Number]",jp="[object Null]",yt="[object Object]",Na="[object Promise]",Wp="[object Proxy]",Li="[object RegExp]",Gn="[object Set]",Pi="[object String]",yr="[object Symbol]",zp="[object Undefined]",Mi="[object WeakMap]",Qp="[object WeakSet]",$i="[object ArrayBuffer]",hi="[object DataView]",ks="[object Float32Array]",ws="[object Float64Array]",Ns="[object Int8Array]",xs="[object Int16Array]",Os="[object Int32Array]",Ls="[object Uint8Array]",Ps="[object Uint8ClampedArray]",Ms="[object Uint16Array]",$s="[object Uint32Array]",Yp=/\b__p \+= '';/g,Hp=/\b(__p \+=) '' \+/g,Jp=/(__e\(.*?\)|\b__t\)) \+\n'';/g,xa=/&(?:amp|lt|gt|quot|#39);/g,Oa=/[&<>"']/g,Xp=RegExp(xa.source),Zp=RegExp(Oa.source),Kp=/<%-([\s\S]+?)%>/g,ed=/<%([\s\S]+?)%>/g,La=/<%=([\s\S]+?)%>/g,nd=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,td=/^\w*$/,id=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Vs=/[\\^$.*+?()[\]{}|]/g,rd=RegExp(Vs.source),Gs=/^\s+/,sd=/\s/,od=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ad=/\{\n\/\* \[wrapped with (.+)\] \*/,ud=/,? & /,ld=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,cd=/[()=,{}\[\]\/\s]/,pd=/\\(\\)?/g,dd=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Pa=/\w*$/,fd=/^[-+]0x[0-9a-f]+$/i,gd=/^0b[01]+$/i,hd=/^\[object .+?Constructor\]$/,yd=/^0o[0-7]+$/i,md=/^(?:0|[1-9]\d*)$/,Sd=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,mr=/($^)/,Td=/['\n\r\u2028\u2029\\]/g,Sr="\\ud800-\\udfff",Dd="\\u0300-\\u036f",Ed="\\ufe20-\\ufe2f",Ad="\\u20d0-\\u20ff",Ma=Dd+Ed+Ad,$a="\\u2700-\\u27bf",Va="a-z\\xdf-\\xf6\\xf8-\\xff",_d="\\xac\\xb1\\xd7\\xf7",vd="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",Id="\\u2000-\\u206f",Cd=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Ga="A-Z\\xc0-\\xd6\\xd8-\\xde",qa="\\ufe0e\\ufe0f",ja=_d+vd+Id+Cd,qs="['’]",Bd="["+Sr+"]",Wa="["+ja+"]",Tr="["+Ma+"]",za="\\d+",Fd="["+$a+"]",Qa="["+Va+"]",Ya="[^"+Sr+ja+za+$a+Va+Ga+"]",js="\\ud83c[\\udffb-\\udfff]",Ud="(?:"+Tr+"|"+js+")",Ha="[^"+Sr+"]",Ws="(?:\\ud83c[\\udde6-\\uddff]){2}",zs="[\\ud800-\\udbff][\\udc00-\\udfff]",yi="["+Ga+"]",Ja="\\u200d",Xa="(?:"+Qa+"|"+Ya+")",Rd="(?:"+yi+"|"+Ya+")",Za="(?:"+qs+"(?:d|ll|m|re|s|t|ve))?",Ka="(?:"+qs+"(?:D|LL|M|RE|S|T|VE))?",eu=Ud+"?",nu="["+qa+"]?",bd="(?:"+Ja+"(?:"+[Ha,Ws,zs].join("|")+")"+nu+eu+")*",kd="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",wd="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",tu=nu+eu+bd,Nd="(?:"+[Fd,Ws,zs].join("|")+")"+tu,xd="(?:"+[Ha+Tr+"?",Tr,Ws,zs,Bd].join("|")+")",Od=RegExp(qs,"g"),Ld=RegExp(Tr,"g"),Qs=RegExp(js+"(?="+js+")|"+xd+tu,"g"),Pd=RegExp([yi+"?"+Qa+"+"+Za+"(?="+[Wa,yi,"$"].join("|")+")",Rd+"+"+Ka+"(?="+[Wa,yi+Xa,"$"].join("|")+")",yi+"?"+Xa+"+"+Za,yi+"+"+Ka,wd,kd,za,Nd].join("|"),"g"),Md=RegExp("["+Ja+Sr+Ma+qa+"]"),$d=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Vd=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Gd=-1,Be={};Be[ks]=Be[ws]=Be[Ns]=Be[xs]=Be[Os]=Be[Ls]=Be[Ps]=Be[Ms]=Be[$s]=!0,Be[M]=Be[he]=Be[$i]=Be[ye]=Be[hi]=Be[Fn]=Be[Nt]=Be[Ke]=Be[Vn]=Be[Oi]=Be[yt]=Be[Li]=Be[Gn]=Be[Pi]=Be[Mi]=!1;var Ce={};Ce[M]=Ce[he]=Ce[$i]=Ce[hi]=Ce[ye]=Ce[Fn]=Ce[ks]=Ce[ws]=Ce[Ns]=Ce[xs]=Ce[Os]=Ce[Vn]=Ce[Oi]=Ce[yt]=Ce[Li]=Ce[Gn]=Ce[Pi]=Ce[yr]=Ce[Ls]=Ce[Ps]=Ce[Ms]=Ce[$s]=!0,Ce[Nt]=Ce[Ke]=Ce[Mi]=!1;var qd={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},jd={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Wd={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},zd={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Qd=parseFloat,Yd=parseInt,iu=typeof tr=="object"&&tr&&tr.Object===Object&&tr,Hd=typeof self=="object"&&self&&self.Object===Object&&self,He=iu||Hd||Function("return this")(),Ys=n&&!n.nodeType&&n,Zt=Ys&&!0&&i&&!i.nodeType&&i,ru=Zt&&Zt.exports===Ys,Hs=ru&&iu.process,Un=function(){try{var D=Zt&&Zt.require&&Zt.require("util").types;return D||Hs&&Hs.binding&&Hs.binding("util")}catch{}}(),su=Un&&Un.isArrayBuffer,ou=Un&&Un.isDate,au=Un&&Un.isMap,uu=Un&&Un.isRegExp,lu=Un&&Un.isSet,cu=Un&&Un.isTypedArray;function Tn(D,I,v){switch(v.length){case 0:return D.call(I);case 1:return D.call(I,v[0]);case 2:return D.call(I,v[0],v[1]);case 3:return D.call(I,v[0],v[1],v[2])}return D.apply(I,v)}function Jd(D,I,v,$){for(var ee=-1,fe=D==null?0:D.length;++ee<fe;){var We=D[ee];I($,We,v(We),D)}return $}function Rn(D,I){for(var v=-1,$=D==null?0:D.length;++v<$&&I(D[v],v,D)!==!1;);return D}function Xd(D,I){for(var v=D==null?0:D.length;v--&&I(D[v],v,D)!==!1;);return D}function pu(D,I){for(var v=-1,$=D==null?0:D.length;++v<$;)if(!I(D[v],v,D))return!1;return!0}function xt(D,I){for(var v=-1,$=D==null?0:D.length,ee=0,fe=[];++v<$;){var We=D[v];I(We,v,D)&&(fe[ee++]=We)}return fe}function Dr(D,I){var v=D==null?0:D.length;return!!v&&mi(D,I,0)>-1}function Js(D,I,v){for(var $=-1,ee=D==null?0:D.length;++$<ee;)if(v(I,D[$]))return!0;return!1}function Fe(D,I){for(var v=-1,$=D==null?0:D.length,ee=Array($);++v<$;)ee[v]=I(D[v],v,D);return ee}function Ot(D,I){for(var v=-1,$=I.length,ee=D.length;++v<$;)D[ee+v]=I[v];return D}function Xs(D,I,v,$){var ee=-1,fe=D==null?0:D.length;for($&&fe&&(v=D[++ee]);++ee<fe;)v=I(v,D[ee],ee,D);return v}function Zd(D,I,v,$){var ee=D==null?0:D.length;for($&&ee&&(v=D[--ee]);ee--;)v=I(v,D[ee],ee,D);return v}function Zs(D,I){for(var v=-1,$=D==null?0:D.length;++v<$;)if(I(D[v],v,D))return!0;return!1}var Kd=Ks("length");function ef(D){return D.split("")}function nf(D){return D.match(ld)||[]}function du(D,I,v){var $;return v(D,function(ee,fe,We){if(I(ee,fe,We))return $=fe,!1}),$}function Er(D,I,v,$){for(var ee=D.length,fe=v+($?1:-1);$?fe--:++fe<ee;)if(I(D[fe],fe,D))return fe;return-1}function mi(D,I,v){return I===I?gf(D,I,v):Er(D,fu,v)}function tf(D,I,v,$){for(var ee=v-1,fe=D.length;++ee<fe;)if($(D[ee],I))return ee;return-1}function fu(D){return D!==D}function gu(D,I){var v=D==null?0:D.length;return v?no(D,I)/v:Xt}function Ks(D){return function(I){return I==null?t:I[D]}}function eo(D){return function(I){return D==null?t:D[I]}}function hu(D,I,v,$,ee){return ee(D,function(fe,We,_e){v=$?($=!1,fe):I(v,fe,We,_e)}),v}function rf(D,I){var v=D.length;for(D.sort(I);v--;)D[v]=D[v].value;return D}function no(D,I){for(var v,$=-1,ee=D.length;++$<ee;){var fe=I(D[$]);fe!==t&&(v=v===t?fe:v+fe)}return v}function to(D,I){for(var v=-1,$=Array(D);++v<D;)$[v]=I(v);return $}function sf(D,I){return Fe(I,function(v){return[v,D[v]]})}function yu(D){return D&&D.slice(0,Du(D)+1).replace(Gs,"")}function Dn(D){return function(I){return D(I)}}function io(D,I){return Fe(I,function(v){return D[v]})}function Vi(D,I){return D.has(I)}function mu(D,I){for(var v=-1,$=D.length;++v<$&&mi(I,D[v],0)>-1;);return v}function Su(D,I){for(var v=D.length;v--&&mi(I,D[v],0)>-1;);return v}function of(D,I){for(var v=D.length,$=0;v--;)D[v]===I&&++$;return $}var af=eo(qd),uf=eo(jd);function lf(D){return"\\"+zd[D]}function cf(D,I){return D==null?t:D[I]}function Si(D){return Md.test(D)}function pf(D){return $d.test(D)}function df(D){for(var I,v=[];!(I=D.next()).done;)v.push(I.value);return v}function ro(D){var I=-1,v=Array(D.size);return D.forEach(function($,ee){v[++I]=[ee,$]}),v}function Tu(D,I){return function(v){return D(I(v))}}function Lt(D,I){for(var v=-1,$=D.length,ee=0,fe=[];++v<$;){var We=D[v];(We===I||We===S)&&(D[v]=S,fe[ee++]=v)}return fe}function Ar(D){var I=-1,v=Array(D.size);return D.forEach(function($){v[++I]=$}),v}function ff(D){var I=-1,v=Array(D.size);return D.forEach(function($){v[++I]=[$,$]}),v}function gf(D,I,v){for(var $=v-1,ee=D.length;++$<ee;)if(D[$]===I)return $;return-1}function hf(D,I,v){for(var $=v+1;$--;)if(D[$]===I)return $;return $}function Ti(D){return Si(D)?mf(D):Kd(D)}function qn(D){return Si(D)?Sf(D):ef(D)}function Du(D){for(var I=D.length;I--&&sd.test(D.charAt(I)););return I}var yf=eo(Wd);function mf(D){for(var I=Qs.lastIndex=0;Qs.test(D);)++I;return I}function Sf(D){return D.match(Qs)||[]}function Tf(D){return D.match(Pd)||[]}var Df=function D(I){I=I==null?He:Di.defaults(He.Object(),I,Di.pick(He,Vd));var v=I.Array,$=I.Date,ee=I.Error,fe=I.Function,We=I.Math,_e=I.Object,so=I.RegExp,Ef=I.String,bn=I.TypeError,_r=v.prototype,Af=fe.prototype,Ei=_e.prototype,vr=I["__core-js_shared__"],Ir=Af.toString,Te=Ei.hasOwnProperty,_f=0,Eu=function(){var e=/[^.]+$/.exec(vr&&vr.keys&&vr.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),Cr=Ei.toString,vf=Ir.call(_e),If=He._,Cf=so("^"+Ir.call(Te).replace(Vs,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Br=ru?I.Buffer:t,Pt=I.Symbol,Fr=I.Uint8Array,Au=Br?Br.allocUnsafe:t,Ur=Tu(_e.getPrototypeOf,_e),_u=_e.create,vu=Ei.propertyIsEnumerable,Rr=_r.splice,Iu=Pt?Pt.isConcatSpreadable:t,Gi=Pt?Pt.iterator:t,Kt=Pt?Pt.toStringTag:t,br=function(){try{var e=ri(_e,"defineProperty");return e({},"",{}),e}catch{}}(),Bf=I.clearTimeout!==He.clearTimeout&&I.clearTimeout,Ff=$&&$.now!==He.Date.now&&$.now,Uf=I.setTimeout!==He.setTimeout&&I.setTimeout,kr=We.ceil,wr=We.floor,oo=_e.getOwnPropertySymbols,Rf=Br?Br.isBuffer:t,Cu=I.isFinite,bf=_r.join,kf=Tu(_e.keys,_e),ze=We.max,en=We.min,wf=$.now,Nf=I.parseInt,Bu=We.random,xf=_r.reverse,ao=ri(I,"DataView"),qi=ri(I,"Map"),uo=ri(I,"Promise"),Ai=ri(I,"Set"),ji=ri(I,"WeakMap"),Wi=ri(_e,"create"),Nr=ji&&new ji,_i={},Of=si(ao),Lf=si(qi),Pf=si(uo),Mf=si(Ai),$f=si(ji),xr=Pt?Pt.prototype:t,zi=xr?xr.valueOf:t,Fu=xr?xr.toString:t;function g(e){if(xe(e)&&!ne(e)&&!(e instanceof le)){if(e instanceof kn)return e;if(Te.call(e,"__wrapped__"))return Ul(e)}return new kn(e)}var vi=function(){function e(){}return function(r){if(!be(r))return{};if(_u)return _u(r);e.prototype=r;var a=new e;return e.prototype=t,a}}();function Or(){}function kn(e,r){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!r,this.__index__=0,this.__values__=t}g.templateSettings={escape:Kp,evaluate:ed,interpolate:La,variable:"",imports:{_:g}},g.prototype=Or.prototype,g.prototype.constructor=g,kn.prototype=vi(Or.prototype),kn.prototype.constructor=kn;function le(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Bn,this.__views__=[]}function Vf(){var e=new le(this.__wrapped__);return e.__actions__=dn(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=dn(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=dn(this.__views__),e}function Gf(){if(this.__filtered__){var e=new le(this);e.__dir__=-1,e.__filtered__=!0}else e=this.clone(),e.__dir__*=-1;return e}function qf(){var e=this.__wrapped__.value(),r=this.__dir__,a=ne(e),c=r<0,p=a?e.length:0,h=nh(0,p,this.__views__),y=h.start,T=h.end,A=T-y,F=c?T:y-1,U=this.__iteratees__,w=U.length,O=0,q=en(A,this.__takeCount__);if(!a||!c&&p==A&&q==A)return Zu(e,this.__actions__);var H=[];e:for(;A--&&O<q;){F+=r;for(var re=-1,J=e[F];++re<w;){var oe=U[re],pe=oe.iteratee,_n=oe.type,un=pe(J);if(_n==fi)J=un;else if(!un){if(_n==gr)continue e;break e}}H[O++]=J}return H}le.prototype=vi(Or.prototype),le.prototype.constructor=le;function ei(e){var r=-1,a=e==null?0:e.length;for(this.clear();++r<a;){var c=e[r];this.set(c[0],c[1])}}function jf(){this.__data__=Wi?Wi(null):{},this.size=0}function Wf(e){var r=this.has(e)&&delete this.__data__[e];return this.size-=r?1:0,r}function zf(e){var r=this.__data__;if(Wi){var a=r[e];return a===f?t:a}return Te.call(r,e)?r[e]:t}function Qf(e){var r=this.__data__;return Wi?r[e]!==t:Te.call(r,e)}function Yf(e,r){var a=this.__data__;return this.size+=this.has(e)?0:1,a[e]=Wi&&r===t?f:r,this}ei.prototype.clear=jf,ei.prototype.delete=Wf,ei.prototype.get=zf,ei.prototype.has=Qf,ei.prototype.set=Yf;function mt(e){var r=-1,a=e==null?0:e.length;for(this.clear();++r<a;){var c=e[r];this.set(c[0],c[1])}}function Hf(){this.__data__=[],this.size=0}function Jf(e){var r=this.__data__,a=Lr(r,e);if(a<0)return!1;var c=r.length-1;return a==c?r.pop():Rr.call(r,a,1),--this.size,!0}function Xf(e){var r=this.__data__,a=Lr(r,e);return a<0?t:r[a][1]}function Zf(e){return Lr(this.__data__,e)>-1}function Kf(e,r){var a=this.__data__,c=Lr(a,e);return c<0?(++this.size,a.push([e,r])):a[c][1]=r,this}mt.prototype.clear=Hf,mt.prototype.delete=Jf,mt.prototype.get=Xf,mt.prototype.has=Zf,mt.prototype.set=Kf;function St(e){var r=-1,a=e==null?0:e.length;for(this.clear();++r<a;){var c=e[r];this.set(c[0],c[1])}}function eg(){this.size=0,this.__data__={hash:new ei,map:new(qi||mt),string:new ei}}function ng(e){var r=Hr(this,e).delete(e);return this.size-=r?1:0,r}function tg(e){return Hr(this,e).get(e)}function ig(e){return Hr(this,e).has(e)}function rg(e,r){var a=Hr(this,e),c=a.size;return a.set(e,r),this.size+=a.size==c?0:1,this}St.prototype.clear=eg,St.prototype.delete=ng,St.prototype.get=tg,St.prototype.has=ig,St.prototype.set=rg;function ni(e){var r=-1,a=e==null?0:e.length;for(this.__data__=new St;++r<a;)this.add(e[r])}function sg(e){return this.__data__.set(e,f),this}function og(e){return this.__data__.has(e)}ni.prototype.add=ni.prototype.push=sg,ni.prototype.has=og;function jn(e){var r=this.__data__=new mt(e);this.size=r.size}function ag(){this.__data__=new mt,this.size=0}function ug(e){var r=this.__data__,a=r.delete(e);return this.size=r.size,a}function lg(e){return this.__data__.get(e)}function cg(e){return this.__data__.has(e)}function pg(e,r){var a=this.__data__;if(a instanceof mt){var c=a.__data__;if(!qi||c.length<o-1)return c.push([e,r]),this.size=++a.size,this;a=this.__data__=new St(c)}return a.set(e,r),this.size=a.size,this}jn.prototype.clear=ag,jn.prototype.delete=ug,jn.prototype.get=lg,jn.prototype.has=cg,jn.prototype.set=pg;function Uu(e,r){var a=ne(e),c=!a&&oi(e),p=!a&&!c&&qt(e),h=!a&&!c&&!p&&Fi(e),y=a||c||p||h,T=y?to(e.length,Ef):[],A=T.length;for(var F in e)(r||Te.call(e,F))&&!(y&&(F=="length"||p&&(F=="offset"||F=="parent")||h&&(F=="buffer"||F=="byteLength"||F=="byteOffset")||At(F,A)))&&T.push(F);return T}function Ru(e){var r=e.length;return r?e[Do(0,r-1)]:t}function dg(e,r){return Jr(dn(e),ti(r,0,e.length))}function fg(e){return Jr(dn(e))}function lo(e,r,a){(a!==t&&!Wn(e[r],a)||a===t&&!(r in e))&&Tt(e,r,a)}function Qi(e,r,a){var c=e[r];(!(Te.call(e,r)&&Wn(c,a))||a===t&&!(r in e))&&Tt(e,r,a)}function Lr(e,r){for(var a=e.length;a--;)if(Wn(e[a][0],r))return a;return-1}function gg(e,r,a,c){return Mt(e,function(p,h,y){r(c,p,a(p),y)}),c}function bu(e,r){return e&&ut(r,Qe(r),e)}function hg(e,r){return e&&ut(r,gn(r),e)}function Tt(e,r,a){r=="__proto__"&&br?br(e,r,{configurable:!0,enumerable:!0,value:a,writable:!0}):e[r]=a}function co(e,r){for(var a=-1,c=r.length,p=v(c),h=e==null;++a<c;)p[a]=h?t:Wo(e,r[a]);return p}function ti(e,r,a){return e===e&&(a!==t&&(e=e<=a?e:a),r!==t&&(e=e>=r?e:r)),e}function wn(e,r,a,c,p,h){var y,T=r&E,A=r&B,F=r&k;if(a&&(y=p?a(e,c,p,h):a(e)),y!==t)return y;if(!be(e))return e;var U=ne(e);if(U){if(y=ih(e),!T)return dn(e,y)}else{var w=nn(e),O=w==Ke||w==wa;if(qt(e))return nl(e,T);if(w==yt||w==M||O&&!p){if(y=A||O?{}:Dl(e),!T)return A?zg(e,hg(y,e)):Wg(e,bu(y,e))}else{if(!Ce[w])return p?e:{};y=rh(e,w,T)}}h||(h=new jn);var q=h.get(e);if(q)return q;h.set(e,y),Hl(e)?e.forEach(function(J){y.add(wn(J,r,a,J,e,h))}):Ql(e)&&e.forEach(function(J,oe){y.set(oe,wn(J,r,a,oe,e,h))});var H=F?A?bo:Ro:A?gn:Qe,re=U?t:H(e);return Rn(re||e,function(J,oe){re&&(oe=J,J=e[oe]),Qi(y,oe,wn(J,r,a,oe,e,h))}),y}function yg(e){var r=Qe(e);return function(a){return ku(a,e,r)}}function ku(e,r,a){var c=a.length;if(e==null)return!c;for(e=_e(e);c--;){var p=a[c],h=r[p],y=e[p];if(y===t&&!(p in e)||!h(y))return!1}return!0}function wu(e,r,a){if(typeof e!="function")throw new bn(l);return er(function(){e.apply(t,a)},r)}function Yi(e,r,a,c){var p=-1,h=Dr,y=!0,T=e.length,A=[],F=r.length;if(!T)return A;a&&(r=Fe(r,Dn(a))),c?(h=Js,y=!1):r.length>=o&&(h=Vi,y=!1,r=new ni(r));e:for(;++p<T;){var U=e[p],w=a==null?U:a(U);if(U=c||U!==0?U:0,y&&w===w){for(var O=F;O--;)if(r[O]===w)continue e;A.push(U)}else h(r,w,c)||A.push(U)}return A}var Mt=ol(at),Nu=ol(fo,!0);function mg(e,r){var a=!0;return Mt(e,function(c,p,h){return a=!!r(c,p,h),a}),a}function Pr(e,r,a){for(var c=-1,p=e.length;++c<p;){var h=e[c],y=r(h);if(y!=null&&(T===t?y===y&&!An(y):a(y,T)))var T=y,A=h}return A}function Sg(e,r,a,c){var p=e.length;for(a=ie(a),a<0&&(a=-a>p?0:p+a),c=c===t||c>p?p:ie(c),c<0&&(c+=p),c=a>c?0:Xl(c);a<c;)e[a++]=r;return e}function xu(e,r){var a=[];return Mt(e,function(c,p,h){r(c,p,h)&&a.push(c)}),a}function Je(e,r,a,c,p){var h=-1,y=e.length;for(a||(a=oh),p||(p=[]);++h<y;){var T=e[h];r>0&&a(T)?r>1?Je(T,r-1,a,c,p):Ot(p,T):c||(p[p.length]=T)}return p}var po=al(),Ou=al(!0);function at(e,r){return e&&po(e,r,Qe)}function fo(e,r){return e&&Ou(e,r,Qe)}function Mr(e,r){return xt(r,function(a){return _t(e[a])})}function ii(e,r){r=Vt(r,e);for(var a=0,c=r.length;e!=null&&a<c;)e=e[lt(r[a++])];return a&&a==c?e:t}function Lu(e,r,a){var c=r(e);return ne(e)?c:Ot(c,a(e))}function on(e){return e==null?e===t?zp:jp:Kt&&Kt in _e(e)?eh(e):fh(e)}function go(e,r){return e>r}function Tg(e,r){return e!=null&&Te.call(e,r)}function Dg(e,r){return e!=null&&r in _e(e)}function Eg(e,r,a){return e>=en(r,a)&&e<ze(r,a)}function ho(e,r,a){for(var c=a?Js:Dr,p=e[0].length,h=e.length,y=h,T=v(h),A=1/0,F=[];y--;){var U=e[y];y&&r&&(U=Fe(U,Dn(r))),A=en(U.length,A),T[y]=!a&&(r||p>=120&&U.length>=120)?new ni(y&&U):t}U=e[0];var w=-1,O=T[0];e:for(;++w<p&&F.length<A;){var q=U[w],H=r?r(q):q;if(q=a||q!==0?q:0,!(O?Vi(O,H):c(F,H,a))){for(y=h;--y;){var re=T[y];if(!(re?Vi(re,H):c(e[y],H,a)))continue e}O&&O.push(H),F.push(q)}}return F}function Ag(e,r,a,c){return at(e,function(p,h,y){r(c,a(p),h,y)}),c}function Hi(e,r,a){r=Vt(r,e),e=vl(e,r);var c=e==null?e:e[lt(xn(r))];return c==null?t:Tn(c,e,a)}function Pu(e){return xe(e)&&on(e)==M}function _g(e){return xe(e)&&on(e)==$i}function vg(e){return xe(e)&&on(e)==Fn}function Ji(e,r,a,c,p){return e===r?!0:e==null||r==null||!xe(e)&&!xe(r)?e!==e&&r!==r:Ig(e,r,a,c,Ji,p)}function Ig(e,r,a,c,p,h){var y=ne(e),T=ne(r),A=y?he:nn(e),F=T?he:nn(r);A=A==M?yt:A,F=F==M?yt:F;var U=A==yt,w=F==yt,O=A==F;if(O&&qt(e)){if(!qt(r))return!1;y=!0,U=!1}if(O&&!U)return h||(h=new jn),y||Fi(e)?ml(e,r,a,c,p,h):Zg(e,r,A,a,c,p,h);if(!(a&N)){var q=U&&Te.call(e,"__wrapped__"),H=w&&Te.call(r,"__wrapped__");if(q||H){var re=q?e.value():e,J=H?r.value():r;return h||(h=new jn),p(re,J,a,c,h)}}return O?(h||(h=new jn),Kg(e,r,a,c,p,h)):!1}function Cg(e){return xe(e)&&nn(e)==Vn}function yo(e,r,a,c){var p=a.length,h=p,y=!c;if(e==null)return!h;for(e=_e(e);p--;){var T=a[p];if(y&&T[2]?T[1]!==e[T[0]]:!(T[0]in e))return!1}for(;++p<h;){T=a[p];var A=T[0],F=e[A],U=T[1];if(y&&T[2]){if(F===t&&!(A in e))return!1}else{var w=new jn;if(c)var O=c(F,U,A,e,r,w);if(!(O===t?Ji(U,F,N|x,c,w):O))return!1}}return!0}function Mu(e){if(!be(e)||uh(e))return!1;var r=_t(e)?Cf:hd;return r.test(si(e))}function Bg(e){return xe(e)&&on(e)==Li}function Fg(e){return xe(e)&&nn(e)==Gn}function Ug(e){return xe(e)&&ts(e.length)&&!!Be[on(e)]}function $u(e){return typeof e=="function"?e:e==null?hn:typeof e=="object"?ne(e)?qu(e[0],e[1]):Gu(e):uc(e)}function mo(e){if(!Ki(e))return kf(e);var r=[];for(var a in _e(e))Te.call(e,a)&&a!="constructor"&&r.push(a);return r}function Rg(e){if(!be(e))return dh(e);var r=Ki(e),a=[];for(var c in e)c=="constructor"&&(r||!Te.call(e,c))||a.push(c);return a}function So(e,r){return e<r}function Vu(e,r){var a=-1,c=fn(e)?v(e.length):[];return Mt(e,function(p,h,y){c[++a]=r(p,h,y)}),c}function Gu(e){var r=wo(e);return r.length==1&&r[0][2]?Al(r[0][0],r[0][1]):function(a){return a===e||yo(a,e,r)}}function qu(e,r){return xo(e)&&El(r)?Al(lt(e),r):function(a){var c=Wo(a,e);return c===t&&c===r?zo(a,e):Ji(r,c,N|x)}}function $r(e,r,a,c,p){e!==r&&po(r,function(h,y){if(p||(p=new jn),be(h))bg(e,r,y,a,$r,c,p);else{var T=c?c(Lo(e,y),h,y+"",e,r,p):t;T===t&&(T=h),lo(e,y,T)}},gn)}function bg(e,r,a,c,p,h,y){var T=Lo(e,a),A=Lo(r,a),F=y.get(A);if(F){lo(e,a,F);return}var U=h?h(T,A,a+"",e,r,y):t,w=U===t;if(w){var O=ne(A),q=!O&&qt(A),H=!O&&!q&&Fi(A);U=A,O||q||H?ne(T)?U=T:Me(T)?U=dn(T):q?(w=!1,U=nl(A,!0)):H?(w=!1,U=tl(A,!0)):U=[]:nr(A)||oi(A)?(U=T,oi(T)?U=Zl(T):(!be(T)||_t(T))&&(U=Dl(A))):w=!1}w&&(y.set(A,U),p(U,A,c,h,y),y.delete(A)),lo(e,a,U)}function ju(e,r){var a=e.length;if(a)return r+=r<0?a:0,At(r,a)?e[r]:t}function Wu(e,r,a){r.length?r=Fe(r,function(h){return ne(h)?function(y){return ii(y,h.length===1?h[0]:h)}:h}):r=[hn];var c=-1;r=Fe(r,Dn(Y()));var p=Vu(e,function(h,y,T){var A=Fe(r,function(F){return F(h)});return{criteria:A,index:++c,value:h}});return rf(p,function(h,y){return jg(h,y,a)})}function kg(e,r){return zu(e,r,function(a,c){return zo(e,c)})}function zu(e,r,a){for(var c=-1,p=r.length,h={};++c<p;){var y=r[c],T=ii(e,y);a(T,y)&&Xi(h,Vt(y,e),T)}return h}function wg(e){return function(r){return ii(r,e)}}function To(e,r,a,c){var p=c?tf:mi,h=-1,y=r.length,T=e;for(e===r&&(r=dn(r)),a&&(T=Fe(e,Dn(a)));++h<y;)for(var A=0,F=r[h],U=a?a(F):F;(A=p(T,U,A,c))>-1;)T!==e&&Rr.call(T,A,1),Rr.call(e,A,1);return e}function Qu(e,r){for(var a=e?r.length:0,c=a-1;a--;){var p=r[a];if(a==c||p!==h){var h=p;At(p)?Rr.call(e,p,1):_o(e,p)}}return e}function Do(e,r){return e+wr(Bu()*(r-e+1))}function Ng(e,r,a,c){for(var p=-1,h=ze(kr((r-e)/(a||1)),0),y=v(h);h--;)y[c?h:++p]=e,e+=a;return y}function Eo(e,r){var a="";if(!e||r<1||r>$n)return a;do r%2&&(a+=e),r=wr(r/2),r&&(e+=e);while(r);return a}function se(e,r){return Po(_l(e,r,hn),e+"")}function xg(e){return Ru(Ui(e))}function Og(e,r){var a=Ui(e);return Jr(a,ti(r,0,a.length))}function Xi(e,r,a,c){if(!be(e))return e;r=Vt(r,e);for(var p=-1,h=r.length,y=h-1,T=e;T!=null&&++p<h;){var A=lt(r[p]),F=a;if(A==="__proto__"||A==="constructor"||A==="prototype")return e;if(p!=y){var U=T[A];F=c?c(U,A,T):t,F===t&&(F=be(U)?U:At(r[p+1])?[]:{})}Qi(T,A,F),T=T[A]}return e}var Yu=Nr?function(e,r){return Nr.set(e,r),e}:hn,Lg=br?function(e,r){return br(e,"toString",{configurable:!0,enumerable:!1,value:Yo(r),writable:!0})}:hn;function Pg(e){return Jr(Ui(e))}function Nn(e,r,a){var c=-1,p=e.length;r<0&&(r=-r>p?0:p+r),a=a>p?p:a,a<0&&(a+=p),p=r>a?0:a-r>>>0,r>>>=0;for(var h=v(p);++c<p;)h[c]=e[c+r];return h}function Mg(e,r){var a;return Mt(e,function(c,p,h){return a=r(c,p,h),!a}),!!a}function Vr(e,r,a){var c=0,p=e==null?c:e.length;if(typeof r=="number"&&r===r&&p<=V){for(;c<p;){var h=c+p>>>1,y=e[h];y!==null&&!An(y)&&(a?y<=r:y<r)?c=h+1:p=h}return p}return Ao(e,r,hn,a)}function Ao(e,r,a,c){var p=0,h=e==null?0:e.length;if(h===0)return 0;r=a(r);for(var y=r!==r,T=r===null,A=An(r),F=r===t;p<h;){var U=wr((p+h)/2),w=a(e[U]),O=w!==t,q=w===null,H=w===w,re=An(w);if(y)var J=c||H;else F?J=H&&(c||O):T?J=H&&O&&(c||!q):A?J=H&&O&&!q&&(c||!re):q||re?J=!1:J=c?w<=r:w<r;J?p=U+1:h=U}return en(h,C)}function Hu(e,r){for(var a=-1,c=e.length,p=0,h=[];++a<c;){var y=e[a],T=r?r(y):y;if(!a||!Wn(T,A)){var A=T;h[p++]=y===0?0:y}}return h}function Ju(e){return typeof e=="number"?e:An(e)?Xt:+e}function En(e){if(typeof e=="string")return e;if(ne(e))return Fe(e,En)+"";if(An(e))return Fu?Fu.call(e):"";var r=e+"";return r=="0"&&1/e==-ot?"-0":r}function $t(e,r,a){var c=-1,p=Dr,h=e.length,y=!0,T=[],A=T;if(a)y=!1,p=Js;else if(h>=o){var F=r?null:Jg(e);if(F)return Ar(F);y=!1,p=Vi,A=new ni}else A=r?[]:T;e:for(;++c<h;){var U=e[c],w=r?r(U):U;if(U=a||U!==0?U:0,y&&w===w){for(var O=A.length;O--;)if(A[O]===w)continue e;r&&A.push(w),T.push(U)}else p(A,w,a)||(A!==T&&A.push(w),T.push(U))}return T}function _o(e,r){return r=Vt(r,e),e=vl(e,r),e==null||delete e[lt(xn(r))]}function Xu(e,r,a,c){return Xi(e,r,a(ii(e,r)),c)}function Gr(e,r,a,c){for(var p=e.length,h=c?p:-1;(c?h--:++h<p)&&r(e[h],h,e););return a?Nn(e,c?0:h,c?h+1:p):Nn(e,c?h+1:0,c?p:h)}function Zu(e,r){var a=e;return a instanceof le&&(a=a.value()),Xs(r,function(c,p){return p.func.apply(p.thisArg,Ot([c],p.args))},a)}function vo(e,r,a){var c=e.length;if(c<2)return c?$t(e[0]):[];for(var p=-1,h=v(c);++p<c;)for(var y=e[p],T=-1;++T<c;)T!=p&&(h[p]=Yi(h[p]||y,e[T],r,a));return $t(Je(h,1),r,a)}function Ku(e,r,a){for(var c=-1,p=e.length,h=r.length,y={};++c<p;){var T=c<h?r[c]:t;a(y,e[c],T)}return y}function Io(e){return Me(e)?e:[]}function Co(e){return typeof e=="function"?e:hn}function Vt(e,r){return ne(e)?e:xo(e,r)?[e]:Fl(me(e))}var $g=se;function Gt(e,r,a){var c=e.length;return a=a===t?c:a,!r&&a>=c?e:Nn(e,r,a)}var el=Bf||function(e){return He.clearTimeout(e)};function nl(e,r){if(r)return e.slice();var a=e.length,c=Au?Au(a):new e.constructor(a);return e.copy(c),c}function Bo(e){var r=new e.constructor(e.byteLength);return new Fr(r).set(new Fr(e)),r}function Vg(e,r){var a=r?Bo(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.byteLength)}function Gg(e){var r=new e.constructor(e.source,Pa.exec(e));return r.lastIndex=e.lastIndex,r}function qg(e){return zi?_e(zi.call(e)):{}}function tl(e,r){var a=r?Bo(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.length)}function il(e,r){if(e!==r){var a=e!==t,c=e===null,p=e===e,h=An(e),y=r!==t,T=r===null,A=r===r,F=An(r);if(!T&&!F&&!h&&e>r||h&&y&&A&&!T&&!F||c&&y&&A||!a&&A||!p)return 1;if(!c&&!h&&!F&&e<r||F&&a&&p&&!c&&!h||T&&a&&p||!y&&p||!A)return-1}return 0}function jg(e,r,a){for(var c=-1,p=e.criteria,h=r.criteria,y=p.length,T=a.length;++c<y;){var A=il(p[c],h[c]);if(A){if(c>=T)return A;var F=a[c];return A*(F=="desc"?-1:1)}}return e.index-r.index}function rl(e,r,a,c){for(var p=-1,h=e.length,y=a.length,T=-1,A=r.length,F=ze(h-y,0),U=v(A+F),w=!c;++T<A;)U[T]=r[T];for(;++p<y;)(w||p<h)&&(U[a[p]]=e[p]);for(;F--;)U[T++]=e[p++];return U}function sl(e,r,a,c){for(var p=-1,h=e.length,y=-1,T=a.length,A=-1,F=r.length,U=ze(h-T,0),w=v(U+F),O=!c;++p<U;)w[p]=e[p];for(var q=p;++A<F;)w[q+A]=r[A];for(;++y<T;)(O||p<h)&&(w[q+a[y]]=e[p++]);return w}function dn(e,r){var a=-1,c=e.length;for(r||(r=v(c));++a<c;)r[a]=e[a];return r}function ut(e,r,a,c){var p=!a;a||(a={});for(var h=-1,y=r.length;++h<y;){var T=r[h],A=c?c(a[T],e[T],T,a,e):t;A===t&&(A=e[T]),p?Tt(a,T,A):Qi(a,T,A)}return a}function Wg(e,r){return ut(e,No(e),r)}function zg(e,r){return ut(e,Sl(e),r)}function qr(e,r){return function(a,c){var p=ne(a)?Jd:gg,h=r?r():{};return p(a,e,Y(c,2),h)}}function Ii(e){return se(function(r,a){var c=-1,p=a.length,h=p>1?a[p-1]:t,y=p>2?a[2]:t;for(h=e.length>3&&typeof h=="function"?(p--,h):t,y&&an(a[0],a[1],y)&&(h=p<3?t:h,p=1),r=_e(r);++c<p;){var T=a[c];T&&e(r,T,c,h)}return r})}function ol(e,r){return function(a,c){if(a==null)return a;if(!fn(a))return e(a,c);for(var p=a.length,h=r?p:-1,y=_e(a);(r?h--:++h<p)&&c(y[h],h,y)!==!1;);return a}}function al(e){return function(r,a,c){for(var p=-1,h=_e(r),y=c(r),T=y.length;T--;){var A=y[e?T:++p];if(a(h[A],A,h)===!1)break}return r}}function Qg(e,r,a){var c=r&X,p=Zi(e);function h(){var y=this&&this!==He&&this instanceof h?p:e;return y.apply(c?a:this,arguments)}return h}function ul(e){return function(r){r=me(r);var a=Si(r)?qn(r):t,c=a?a[0]:r.charAt(0),p=a?Gt(a,1).join(""):r.slice(1);return c[e]()+p}}function Ci(e){return function(r){return Xs(oc(sc(r).replace(Od,"")),e,"")}}function Zi(e){return function(){var r=arguments;switch(r.length){case 0:return new e;case 1:return new e(r[0]);case 2:return new e(r[0],r[1]);case 3:return new e(r[0],r[1],r[2]);case 4:return new e(r[0],r[1],r[2],r[3]);case 5:return new e(r[0],r[1],r[2],r[3],r[4]);case 6:return new e(r[0],r[1],r[2],r[3],r[4],r[5]);case 7:return new e(r[0],r[1],r[2],r[3],r[4],r[5],r[6])}var a=vi(e.prototype),c=e.apply(a,r);return be(c)?c:a}}function Yg(e,r,a){var c=Zi(e);function p(){for(var h=arguments.length,y=v(h),T=h,A=Bi(p);T--;)y[T]=arguments[T];var F=h<3&&y[0]!==A&&y[h-1]!==A?[]:Lt(y,A);if(h-=F.length,h<a)return fl(e,r,jr,p.placeholder,t,y,F,t,t,a-h);var U=this&&this!==He&&this instanceof p?c:e;return Tn(U,this,y)}return p}function ll(e){return function(r,a,c){var p=_e(r);if(!fn(r)){var h=Y(a,3);r=Qe(r),a=function(T){return h(p[T],T,p)}}var y=e(r,a,c);return y>-1?p[h?r[y]:y]:t}}function cl(e){return Et(function(r){var a=r.length,c=a,p=kn.prototype.thru;for(e&&r.reverse();c--;){var h=r[c];if(typeof h!="function")throw new bn(l);if(p&&!y&&Yr(h)=="wrapper")var y=new kn([],!0)}for(c=y?c:a;++c<a;){h=r[c];var T=Yr(h),A=T=="wrapper"?ko(h):t;A&&Oo(A[0])&&A[1]==(Ze|Ie|Ne|ht)&&!A[4].length&&A[9]==1?y=y[Yr(A[0])].apply(y,A[3]):y=h.length==1&&Oo(h)?y[T]():y.thru(h)}return function(){var F=arguments,U=F[0];if(y&&F.length==1&&ne(U))return y.plant(U).value();for(var w=0,O=a?r[w].apply(this,F):U;++w<a;)O=r[w].call(this,O);return O}})}function jr(e,r,a,c,p,h,y,T,A,F){var U=r&Ze,w=r&X,O=r&ge,q=r&(Ie|Re),H=r&b,re=O?t:Zi(e);function J(){for(var oe=arguments.length,pe=v(oe),_n=oe;_n--;)pe[_n]=arguments[_n];if(q)var un=Bi(J),vn=of(pe,un);if(c&&(pe=rl(pe,c,p,q)),h&&(pe=sl(pe,h,y,q)),oe-=vn,q&&oe<F){var $e=Lt(pe,un);return fl(e,r,jr,J.placeholder,a,pe,$e,T,A,F-oe)}var zn=w?a:this,It=O?zn[e]:e;return oe=pe.length,T?pe=gh(pe,T):H&&oe>1&&pe.reverse(),U&&A<oe&&(pe.length=A),this&&this!==He&&this instanceof J&&(It=re||Zi(It)),It.apply(zn,pe)}return J}function pl(e,r){return function(a,c){return Ag(a,e,r(c),{})}}function Wr(e,r){return function(a,c){var p;if(a===t&&c===t)return r;if(a!==t&&(p=a),c!==t){if(p===t)return c;typeof a=="string"||typeof c=="string"?(a=En(a),c=En(c)):(a=Ju(a),c=Ju(c)),p=e(a,c)}return p}}function Fo(e){return Et(function(r){return r=Fe(r,Dn(Y())),se(function(a){var c=this;return e(r,function(p){return Tn(p,c,a)})})})}function zr(e,r){r=r===t?" ":En(r);var a=r.length;if(a<2)return a?Eo(r,e):r;var c=Eo(r,kr(e/Ti(r)));return Si(r)?Gt(qn(c),0,e).join(""):c.slice(0,e)}function Hg(e,r,a,c){var p=r&X,h=Zi(e);function y(){for(var T=-1,A=arguments.length,F=-1,U=c.length,w=v(U+A),O=this&&this!==He&&this instanceof y?h:e;++F<U;)w[F]=c[F];for(;A--;)w[F++]=arguments[++T];return Tn(O,p?a:this,w)}return y}function dl(e){return function(r,a,c){return c&&typeof c!="number"&&an(r,a,c)&&(a=c=t),r=vt(r),a===t?(a=r,r=0):a=vt(a),c=c===t?r<a?1:-1:vt(c),Ng(r,a,c,e)}}function Qr(e){return function(r,a){return typeof r=="string"&&typeof a=="string"||(r=On(r),a=On(a)),e(r,a)}}function fl(e,r,a,c,p,h,y,T,A,F){var U=r&Ie,w=U?y:t,O=U?t:y,q=U?h:t,H=U?t:h;r|=U?Ne:rn,r&=~(U?rn:Ne),r&Ge||(r&=~(X|ge));var re=[e,r,p,q,w,H,O,T,A,F],J=a.apply(t,re);return Oo(e)&&Il(J,re),J.placeholder=c,Cl(J,e,r)}function Uo(e){var r=We[e];return function(a,c){if(a=On(a),c=c==null?0:en(ie(c),292),c&&Cu(a)){var p=(me(a)+"e").split("e"),h=r(p[0]+"e"+(+p[1]+c));return p=(me(h)+"e").split("e"),+(p[0]+"e"+(+p[1]-c))}return r(a)}}var Jg=Ai&&1/Ar(new Ai([,-0]))[1]==ot?function(e){return new Ai(e)}:Xo;function gl(e){return function(r){var a=nn(r);return a==Vn?ro(r):a==Gn?ff(r):sf(r,e(r))}}function Dt(e,r,a,c,p,h,y,T){var A=r&ge;if(!A&&typeof e!="function")throw new bn(l);var F=c?c.length:0;if(F||(r&=~(Ne|rn),c=p=t),y=y===t?y:ze(ie(y),0),T=T===t?T:ie(T),F-=p?p.length:0,r&rn){var U=c,w=p;c=p=t}var O=A?t:ko(e),q=[e,r,a,c,p,U,w,h,y,T];if(O&&ph(q,O),e=q[0],r=q[1],a=q[2],c=q[3],p=q[4],T=q[9]=q[9]===t?A?0:e.length:ze(q[9]-F,0),!T&&r&(Ie|Re)&&(r&=~(Ie|Re)),!r||r==X)var H=Qg(e,r,a);else r==Ie||r==Re?H=Yg(e,r,T):(r==Ne||r==(X|Ne))&&!p.length?H=Hg(e,r,a,c):H=jr.apply(t,q);var re=O?Yu:Il;return Cl(re(H,q),e,r)}function hl(e,r,a,c){return e===t||Wn(e,Ei[a])&&!Te.call(c,a)?r:e}function yl(e,r,a,c,p,h){return be(e)&&be(r)&&(h.set(r,e),$r(e,r,t,yl,h),h.delete(r)),e}function Xg(e){return nr(e)?t:e}function ml(e,r,a,c,p,h){var y=a&N,T=e.length,A=r.length;if(T!=A&&!(y&&A>T))return!1;var F=h.get(e),U=h.get(r);if(F&&U)return F==r&&U==e;var w=-1,O=!0,q=a&x?new ni:t;for(h.set(e,r),h.set(r,e);++w<T;){var H=e[w],re=r[w];if(c)var J=y?c(re,H,w,r,e,h):c(H,re,w,e,r,h);if(J!==t){if(J)continue;O=!1;break}if(q){if(!Zs(r,function(oe,pe){if(!Vi(q,pe)&&(H===oe||p(H,oe,a,c,h)))return q.push(pe)})){O=!1;break}}else if(!(H===re||p(H,re,a,c,h))){O=!1;break}}return h.delete(e),h.delete(r),O}function Zg(e,r,a,c,p,h,y){switch(a){case hi:if(e.byteLength!=r.byteLength||e.byteOffset!=r.byteOffset)return!1;e=e.buffer,r=r.buffer;case $i:return!(e.byteLength!=r.byteLength||!h(new Fr(e),new Fr(r)));case ye:case Fn:case Oi:return Wn(+e,+r);case Nt:return e.name==r.name&&e.message==r.message;case Li:case Pi:return e==r+"";case Vn:var T=ro;case Gn:var A=c&N;if(T||(T=Ar),e.size!=r.size&&!A)return!1;var F=y.get(e);if(F)return F==r;c|=x,y.set(e,r);var U=ml(T(e),T(r),c,p,h,y);return y.delete(e),U;case yr:if(zi)return zi.call(e)==zi.call(r)}return!1}function Kg(e,r,a,c,p,h){var y=a&N,T=Ro(e),A=T.length,F=Ro(r),U=F.length;if(A!=U&&!y)return!1;for(var w=A;w--;){var O=T[w];if(!(y?O in r:Te.call(r,O)))return!1}var q=h.get(e),H=h.get(r);if(q&&H)return q==r&&H==e;var re=!0;h.set(e,r),h.set(r,e);for(var J=y;++w<A;){O=T[w];var oe=e[O],pe=r[O];if(c)var _n=y?c(pe,oe,O,r,e,h):c(oe,pe,O,e,r,h);if(!(_n===t?oe===pe||p(oe,pe,a,c,h):_n)){re=!1;break}J||(J=O=="constructor")}if(re&&!J){var un=e.constructor,vn=r.constructor;un!=vn&&"constructor"in e&&"constructor"in r&&!(typeof un=="function"&&un instanceof un&&typeof vn=="function"&&vn instanceof vn)&&(re=!1)}return h.delete(e),h.delete(r),re}function Et(e){return Po(_l(e,t,kl),e+"")}function Ro(e){return Lu(e,Qe,No)}function bo(e){return Lu(e,gn,Sl)}var ko=Nr?function(e){return Nr.get(e)}:Xo;function Yr(e){for(var r=e.name+"",a=_i[r],c=Te.call(_i,r)?a.length:0;c--;){var p=a[c],h=p.func;if(h==null||h==e)return p.name}return r}function Bi(e){var r=Te.call(g,"placeholder")?g:e;return r.placeholder}function Y(){var e=g.iteratee||Ho;return e=e===Ho?$u:e,arguments.length?e(arguments[0],arguments[1]):e}function Hr(e,r){var a=e.__data__;return ah(r)?a[typeof r=="string"?"string":"hash"]:a.map}function wo(e){for(var r=Qe(e),a=r.length;a--;){var c=r[a],p=e[c];r[a]=[c,p,El(p)]}return r}function ri(e,r){var a=cf(e,r);return Mu(a)?a:t}function eh(e){var r=Te.call(e,Kt),a=e[Kt];try{e[Kt]=t;var c=!0}catch{}var p=Cr.call(e);return c&&(r?e[Kt]=a:delete e[Kt]),p}var No=oo?function(e){return e==null?[]:(e=_e(e),xt(oo(e),function(r){return vu.call(e,r)}))}:Zo,Sl=oo?function(e){for(var r=[];e;)Ot(r,No(e)),e=Ur(e);return r}:Zo,nn=on;(ao&&nn(new ao(new ArrayBuffer(1)))!=hi||qi&&nn(new qi)!=Vn||uo&&nn(uo.resolve())!=Na||Ai&&nn(new Ai)!=Gn||ji&&nn(new ji)!=Mi)&&(nn=function(e){var r=on(e),a=r==yt?e.constructor:t,c=a?si(a):"";if(c)switch(c){case Of:return hi;case Lf:return Vn;case Pf:return Na;case Mf:return Gn;case $f:return Mi}return r});function nh(e,r,a){for(var c=-1,p=a.length;++c<p;){var h=a[c],y=h.size;switch(h.type){case"drop":e+=y;break;case"dropRight":r-=y;break;case"take":r=en(r,e+y);break;case"takeRight":e=ze(e,r-y);break}}return{start:e,end:r}}function th(e){var r=e.match(ad);return r?r[1].split(ud):[]}function Tl(e,r,a){r=Vt(r,e);for(var c=-1,p=r.length,h=!1;++c<p;){var y=lt(r[c]);if(!(h=e!=null&&a(e,y)))break;e=e[y]}return h||++c!=p?h:(p=e==null?0:e.length,!!p&&ts(p)&&At(y,p)&&(ne(e)||oi(e)))}function ih(e){var r=e.length,a=new e.constructor(r);return r&&typeof e[0]=="string"&&Te.call(e,"index")&&(a.index=e.index,a.input=e.input),a}function Dl(e){return typeof e.constructor=="function"&&!Ki(e)?vi(Ur(e)):{}}function rh(e,r,a){var c=e.constructor;switch(r){case $i:return Bo(e);case ye:case Fn:return new c(+e);case hi:return Vg(e,a);case ks:case ws:case Ns:case xs:case Os:case Ls:case Ps:case Ms:case $s:return tl(e,a);case Vn:return new c;case Oi:case Pi:return new c(e);case Li:return Gg(e);case Gn:return new c;case yr:return qg(e)}}function sh(e,r){var a=r.length;if(!a)return e;var c=a-1;return r[c]=(a>1?"& ":"")+r[c],r=r.join(a>2?", ":" "),e.replace(od,`{
/* [wrapped with `+r+`] */
`)}function oh(e){return ne(e)||oi(e)||!!(Iu&&e&&e[Iu])}function At(e,r){var a=typeof e;return r=r??$n,!!r&&(a=="number"||a!="symbol"&&md.test(e))&&e>-1&&e%1==0&&e<r}function an(e,r,a){if(!be(a))return!1;var c=typeof r;return(c=="number"?fn(a)&&At(r,a.length):c=="string"&&r in a)?Wn(a[r],e):!1}function xo(e,r){if(ne(e))return!1;var a=typeof e;return a=="number"||a=="symbol"||a=="boolean"||e==null||An(e)?!0:td.test(e)||!nd.test(e)||r!=null&&e in _e(r)}function ah(e){var r=typeof e;return r=="string"||r=="number"||r=="symbol"||r=="boolean"?e!=="__proto__":e===null}function Oo(e){var r=Yr(e),a=g[r];if(typeof a!="function"||!(r in le.prototype))return!1;if(e===a)return!0;var c=ko(a);return!!c&&e===c[0]}function uh(e){return!!Eu&&Eu in e}var lh=vr?_t:Ko;function Ki(e){var r=e&&e.constructor,a=typeof r=="function"&&r.prototype||Ei;return e===a}function El(e){return e===e&&!be(e)}function Al(e,r){return function(a){return a==null?!1:a[e]===r&&(r!==t||e in _e(a))}}function ch(e){var r=es(e,function(c){return a.size===m&&a.clear(),c}),a=r.cache;return r}function ph(e,r){var a=e[1],c=r[1],p=a|c,h=p<(X|ge|Ze),y=c==Ze&&a==Ie||c==Ze&&a==ht&&e[7].length<=r[8]||c==(Ze|ht)&&r[7].length<=r[8]&&a==Ie;if(!(h||y))return e;c&X&&(e[2]=r[2],p|=a&X?0:Ge);var T=r[3];if(T){var A=e[3];e[3]=A?rl(A,T,r[4]):T,e[4]=A?Lt(e[3],S):r[4]}return T=r[5],T&&(A=e[5],e[5]=A?sl(A,T,r[6]):T,e[6]=A?Lt(e[5],S):r[6]),T=r[7],T&&(e[7]=T),c&Ze&&(e[8]=e[8]==null?r[8]:en(e[8],r[8])),e[9]==null&&(e[9]=r[9]),e[0]=r[0],e[1]=p,e}function dh(e){var r=[];if(e!=null)for(var a in _e(e))r.push(a);return r}function fh(e){return Cr.call(e)}function _l(e,r,a){return r=ze(r===t?e.length-1:r,0),function(){for(var c=arguments,p=-1,h=ze(c.length-r,0),y=v(h);++p<h;)y[p]=c[r+p];p=-1;for(var T=v(r+1);++p<r;)T[p]=c[p];return T[r]=a(y),Tn(e,this,T)}}function vl(e,r){return r.length<2?e:ii(e,Nn(r,0,-1))}function gh(e,r){for(var a=e.length,c=en(r.length,a),p=dn(e);c--;){var h=r[c];e[c]=At(h,a)?p[h]:t}return e}function Lo(e,r){if(!(r==="constructor"&&typeof e[r]=="function")&&r!="__proto__")return e[r]}var Il=Bl(Yu),er=Uf||function(e,r){return He.setTimeout(e,r)},Po=Bl(Lg);function Cl(e,r,a){var c=r+"";return Po(e,sh(c,hh(th(c),a)))}function Bl(e){var r=0,a=0;return function(){var c=wf(),p=Jt-(c-a);if(a=c,p>0){if(++r>=wt)return arguments[0]}else r=0;return e.apply(t,arguments)}}function Jr(e,r){var a=-1,c=e.length,p=c-1;for(r=r===t?c:r;++a<r;){var h=Do(a,p),y=e[h];e[h]=e[a],e[a]=y}return e.length=r,e}var Fl=ch(function(e){var r=[];return e.charCodeAt(0)===46&&r.push(""),e.replace(id,function(a,c,p,h){r.push(p?h.replace(pd,"$1"):c||a)}),r});function lt(e){if(typeof e=="string"||An(e))return e;var r=e+"";return r=="0"&&1/e==-ot?"-0":r}function si(e){if(e!=null){try{return Ir.call(e)}catch{}try{return e+""}catch{}}return""}function hh(e,r){return Rn(L,function(a){var c="_."+a[0];r&a[1]&&!Dr(e,c)&&e.push(c)}),e.sort()}function Ul(e){if(e instanceof le)return e.clone();var r=new kn(e.__wrapped__,e.__chain__);return r.__actions__=dn(e.__actions__),r.__index__=e.__index__,r.__values__=e.__values__,r}function yh(e,r,a){(a?an(e,r,a):r===t)?r=1:r=ze(ie(r),0);var c=e==null?0:e.length;if(!c||r<1)return[];for(var p=0,h=0,y=v(kr(c/r));p<c;)y[h++]=Nn(e,p,p+=r);return y}function mh(e){for(var r=-1,a=e==null?0:e.length,c=0,p=[];++r<a;){var h=e[r];h&&(p[c++]=h)}return p}function Sh(){var e=arguments.length;if(!e)return[];for(var r=v(e-1),a=arguments[0],c=e;c--;)r[c-1]=arguments[c];return Ot(ne(a)?dn(a):[a],Je(r,1))}var Th=se(function(e,r){return Me(e)?Yi(e,Je(r,1,Me,!0)):[]}),Dh=se(function(e,r){var a=xn(r);return Me(a)&&(a=t),Me(e)?Yi(e,Je(r,1,Me,!0),Y(a,2)):[]}),Eh=se(function(e,r){var a=xn(r);return Me(a)&&(a=t),Me(e)?Yi(e,Je(r,1,Me,!0),t,a):[]});function Ah(e,r,a){var c=e==null?0:e.length;return c?(r=a||r===t?1:ie(r),Nn(e,r<0?0:r,c)):[]}function _h(e,r,a){var c=e==null?0:e.length;return c?(r=a||r===t?1:ie(r),r=c-r,Nn(e,0,r<0?0:r)):[]}function vh(e,r){return e&&e.length?Gr(e,Y(r,3),!0,!0):[]}function Ih(e,r){return e&&e.length?Gr(e,Y(r,3),!0):[]}function Ch(e,r,a,c){var p=e==null?0:e.length;return p?(a&&typeof a!="number"&&an(e,r,a)&&(a=0,c=p),Sg(e,r,a,c)):[]}function Rl(e,r,a){var c=e==null?0:e.length;if(!c)return-1;var p=a==null?0:ie(a);return p<0&&(p=ze(c+p,0)),Er(e,Y(r,3),p)}function bl(e,r,a){var c=e==null?0:e.length;if(!c)return-1;var p=c-1;return a!==t&&(p=ie(a),p=a<0?ze(c+p,0):en(p,c-1)),Er(e,Y(r,3),p,!0)}function kl(e){var r=e==null?0:e.length;return r?Je(e,1):[]}function Bh(e){var r=e==null?0:e.length;return r?Je(e,ot):[]}function Fh(e,r){var a=e==null?0:e.length;return a?(r=r===t?1:ie(r),Je(e,r)):[]}function Uh(e){for(var r=-1,a=e==null?0:e.length,c={};++r<a;){var p=e[r];c[p[0]]=p[1]}return c}function wl(e){return e&&e.length?e[0]:t}function Rh(e,r,a){var c=e==null?0:e.length;if(!c)return-1;var p=a==null?0:ie(a);return p<0&&(p=ze(c+p,0)),mi(e,r,p)}function bh(e){var r=e==null?0:e.length;return r?Nn(e,0,-1):[]}var kh=se(function(e){var r=Fe(e,Io);return r.length&&r[0]===e[0]?ho(r):[]}),wh=se(function(e){var r=xn(e),a=Fe(e,Io);return r===xn(a)?r=t:a.pop(),a.length&&a[0]===e[0]?ho(a,Y(r,2)):[]}),Nh=se(function(e){var r=xn(e),a=Fe(e,Io);return r=typeof r=="function"?r:t,r&&a.pop(),a.length&&a[0]===e[0]?ho(a,t,r):[]});function xh(e,r){return e==null?"":bf.call(e,r)}function xn(e){var r=e==null?0:e.length;return r?e[r-1]:t}function Oh(e,r,a){var c=e==null?0:e.length;if(!c)return-1;var p=c;return a!==t&&(p=ie(a),p=p<0?ze(c+p,0):en(p,c-1)),r===r?hf(e,r,p):Er(e,fu,p,!0)}function Lh(e,r){return e&&e.length?ju(e,ie(r)):t}var Ph=se(Nl);function Nl(e,r){return e&&e.length&&r&&r.length?To(e,r):e}function Mh(e,r,a){return e&&e.length&&r&&r.length?To(e,r,Y(a,2)):e}function $h(e,r,a){return e&&e.length&&r&&r.length?To(e,r,t,a):e}var Vh=Et(function(e,r){var a=e==null?0:e.length,c=co(e,r);return Qu(e,Fe(r,function(p){return At(p,a)?+p:p}).sort(il)),c});function Gh(e,r){var a=[];if(!(e&&e.length))return a;var c=-1,p=[],h=e.length;for(r=Y(r,3);++c<h;){var y=e[c];r(y,c,e)&&(a.push(y),p.push(c))}return Qu(e,p),a}function Mo(e){return e==null?e:xf.call(e)}function qh(e,r,a){var c=e==null?0:e.length;return c?(a&&typeof a!="number"&&an(e,r,a)?(r=0,a=c):(r=r==null?0:ie(r),a=a===t?c:ie(a)),Nn(e,r,a)):[]}function jh(e,r){return Vr(e,r)}function Wh(e,r,a){return Ao(e,r,Y(a,2))}function zh(e,r){var a=e==null?0:e.length;if(a){var c=Vr(e,r);if(c<a&&Wn(e[c],r))return c}return-1}function Qh(e,r){return Vr(e,r,!0)}function Yh(e,r,a){return Ao(e,r,Y(a,2),!0)}function Hh(e,r){var a=e==null?0:e.length;if(a){var c=Vr(e,r,!0)-1;if(Wn(e[c],r))return c}return-1}function Jh(e){return e&&e.length?Hu(e):[]}function Xh(e,r){return e&&e.length?Hu(e,Y(r,2)):[]}function Zh(e){var r=e==null?0:e.length;return r?Nn(e,1,r):[]}function Kh(e,r,a){return e&&e.length?(r=a||r===t?1:ie(r),Nn(e,0,r<0?0:r)):[]}function ey(e,r,a){var c=e==null?0:e.length;return c?(r=a||r===t?1:ie(r),r=c-r,Nn(e,r<0?0:r,c)):[]}function ny(e,r){return e&&e.length?Gr(e,Y(r,3),!1,!0):[]}function ty(e,r){return e&&e.length?Gr(e,Y(r,3)):[]}var iy=se(function(e){return $t(Je(e,1,Me,!0))}),ry=se(function(e){var r=xn(e);return Me(r)&&(r=t),$t(Je(e,1,Me,!0),Y(r,2))}),sy=se(function(e){var r=xn(e);return r=typeof r=="function"?r:t,$t(Je(e,1,Me,!0),t,r)});function oy(e){return e&&e.length?$t(e):[]}function ay(e,r){return e&&e.length?$t(e,Y(r,2)):[]}function uy(e,r){return r=typeof r=="function"?r:t,e&&e.length?$t(e,t,r):[]}function $o(e){if(!(e&&e.length))return[];var r=0;return e=xt(e,function(a){if(Me(a))return r=ze(a.length,r),!0}),to(r,function(a){return Fe(e,Ks(a))})}function xl(e,r){if(!(e&&e.length))return[];var a=$o(e);return r==null?a:Fe(a,function(c){return Tn(r,t,c)})}var ly=se(function(e,r){return Me(e)?Yi(e,r):[]}),cy=se(function(e){return vo(xt(e,Me))}),py=se(function(e){var r=xn(e);return Me(r)&&(r=t),vo(xt(e,Me),Y(r,2))}),dy=se(function(e){var r=xn(e);return r=typeof r=="function"?r:t,vo(xt(e,Me),t,r)}),fy=se($o);function gy(e,r){return Ku(e||[],r||[],Qi)}function hy(e,r){return Ku(e||[],r||[],Xi)}var yy=se(function(e){var r=e.length,a=r>1?e[r-1]:t;return a=typeof a=="function"?(e.pop(),a):t,xl(e,a)});function Ol(e){var r=g(e);return r.__chain__=!0,r}function my(e,r){return r(e),e}function Xr(e,r){return r(e)}var Sy=Et(function(e){var r=e.length,a=r?e[0]:0,c=this.__wrapped__,p=function(h){return co(h,e)};return r>1||this.__actions__.length||!(c instanceof le)||!At(a)?this.thru(p):(c=c.slice(a,+a+(r?1:0)),c.__actions__.push({func:Xr,args:[p],thisArg:t}),new kn(c,this.__chain__).thru(function(h){return r&&!h.length&&h.push(t),h}))});function Ty(){return Ol(this)}function Dy(){return new kn(this.value(),this.__chain__)}function Ey(){this.__values__===t&&(this.__values__=Jl(this.value()));var e=this.__index__>=this.__values__.length,r=e?t:this.__values__[this.__index__++];return{done:e,value:r}}function Ay(){return this}function _y(e){for(var r,a=this;a instanceof Or;){var c=Ul(a);c.__index__=0,c.__values__=t,r?p.__wrapped__=c:r=c;var p=c;a=a.__wrapped__}return p.__wrapped__=e,r}function vy(){var e=this.__wrapped__;if(e instanceof le){var r=e;return this.__actions__.length&&(r=new le(this)),r=r.reverse(),r.__actions__.push({func:Xr,args:[Mo],thisArg:t}),new kn(r,this.__chain__)}return this.thru(Mo)}function Iy(){return Zu(this.__wrapped__,this.__actions__)}var Cy=qr(function(e,r,a){Te.call(e,a)?++e[a]:Tt(e,a,1)});function By(e,r,a){var c=ne(e)?pu:mg;return a&&an(e,r,a)&&(r=t),c(e,Y(r,3))}function Fy(e,r){var a=ne(e)?xt:xu;return a(e,Y(r,3))}var Uy=ll(Rl),Ry=ll(bl);function by(e,r){return Je(Zr(e,r),1)}function ky(e,r){return Je(Zr(e,r),ot)}function wy(e,r,a){return a=a===t?1:ie(a),Je(Zr(e,r),a)}function Ll(e,r){var a=ne(e)?Rn:Mt;return a(e,Y(r,3))}function Pl(e,r){var a=ne(e)?Xd:Nu;return a(e,Y(r,3))}var Ny=qr(function(e,r,a){Te.call(e,a)?e[a].push(r):Tt(e,a,[r])});function xy(e,r,a,c){e=fn(e)?e:Ui(e),a=a&&!c?ie(a):0;var p=e.length;return a<0&&(a=ze(p+a,0)),is(e)?a<=p&&e.indexOf(r,a)>-1:!!p&&mi(e,r,a)>-1}var Oy=se(function(e,r,a){var c=-1,p=typeof r=="function",h=fn(e)?v(e.length):[];return Mt(e,function(y){h[++c]=p?Tn(r,y,a):Hi(y,r,a)}),h}),Ly=qr(function(e,r,a){Tt(e,a,r)});function Zr(e,r){var a=ne(e)?Fe:Vu;return a(e,Y(r,3))}function Py(e,r,a,c){return e==null?[]:(ne(r)||(r=r==null?[]:[r]),a=c?t:a,ne(a)||(a=a==null?[]:[a]),Wu(e,r,a))}var My=qr(function(e,r,a){e[a?0:1].push(r)},function(){return[[],[]]});function $y(e,r,a){var c=ne(e)?Xs:hu,p=arguments.length<3;return c(e,Y(r,4),a,p,Mt)}function Vy(e,r,a){var c=ne(e)?Zd:hu,p=arguments.length<3;return c(e,Y(r,4),a,p,Nu)}function Gy(e,r){var a=ne(e)?xt:xu;return a(e,ns(Y(r,3)))}function qy(e){var r=ne(e)?Ru:xg;return r(e)}function jy(e,r,a){(a?an(e,r,a):r===t)?r=1:r=ie(r);var c=ne(e)?dg:Og;return c(e,r)}function Wy(e){var r=ne(e)?fg:Pg;return r(e)}function zy(e){if(e==null)return 0;if(fn(e))return is(e)?Ti(e):e.length;var r=nn(e);return r==Vn||r==Gn?e.size:mo(e).length}function Qy(e,r,a){var c=ne(e)?Zs:Mg;return a&&an(e,r,a)&&(r=t),c(e,Y(r,3))}var Yy=se(function(e,r){if(e==null)return[];var a=r.length;return a>1&&an(e,r[0],r[1])?r=[]:a>2&&an(r[0],r[1],r[2])&&(r=[r[0]]),Wu(e,Je(r,1),[])}),Kr=Ff||function(){return He.Date.now()};function Hy(e,r){if(typeof r!="function")throw new bn(l);return e=ie(e),function(){if(--e<1)return r.apply(this,arguments)}}function Ml(e,r,a){return r=a?t:r,r=e&&r==null?e.length:r,Dt(e,Ze,t,t,t,t,r)}function $l(e,r){var a;if(typeof r!="function")throw new bn(l);return e=ie(e),function(){return--e>0&&(a=r.apply(this,arguments)),e<=1&&(r=t),a}}var Vo=se(function(e,r,a){var c=X;if(a.length){var p=Lt(a,Bi(Vo));c|=Ne}return Dt(e,c,r,a,p)}),Vl=se(function(e,r,a){var c=X|ge;if(a.length){var p=Lt(a,Bi(Vl));c|=Ne}return Dt(r,c,e,a,p)});function Gl(e,r,a){r=a?t:r;var c=Dt(e,Ie,t,t,t,t,t,r);return c.placeholder=Gl.placeholder,c}function ql(e,r,a){r=a?t:r;var c=Dt(e,Re,t,t,t,t,t,r);return c.placeholder=ql.placeholder,c}function jl(e,r,a){var c,p,h,y,T,A,F=0,U=!1,w=!1,O=!0;if(typeof e!="function")throw new bn(l);r=On(r)||0,be(a)&&(U=!!a.leading,w="maxWait"in a,h=w?ze(On(a.maxWait)||0,r):h,O="trailing"in a?!!a.trailing:O);function q($e){var zn=c,It=p;return c=p=t,F=$e,y=e.apply(It,zn),y}function H($e){return F=$e,T=er(oe,r),U?q($e):y}function re($e){var zn=$e-A,It=$e-F,lc=r-zn;return w?en(lc,h-It):lc}function J($e){var zn=$e-A,It=$e-F;return A===t||zn>=r||zn<0||w&&It>=h}function oe(){var $e=Kr();if(J($e))return pe($e);T=er(oe,re($e))}function pe($e){return T=t,O&&c?q($e):(c=p=t,y)}function _n(){T!==t&&el(T),F=0,c=A=p=T=t}function un(){return T===t?y:pe(Kr())}function vn(){var $e=Kr(),zn=J($e);if(c=arguments,p=this,A=$e,zn){if(T===t)return H(A);if(w)return el(T),T=er(oe,r),q(A)}return T===t&&(T=er(oe,r)),y}return vn.cancel=_n,vn.flush=un,vn}var Jy=se(function(e,r){return wu(e,1,r)}),Xy=se(function(e,r,a){return wu(e,On(r)||0,a)});function Zy(e){return Dt(e,b)}function es(e,r){if(typeof e!="function"||r!=null&&typeof r!="function")throw new bn(l);var a=function(){var c=arguments,p=r?r.apply(this,c):c[0],h=a.cache;if(h.has(p))return h.get(p);var y=e.apply(this,c);return a.cache=h.set(p,y)||h,y};return a.cache=new(es.Cache||St),a}es.Cache=St;function ns(e){if(typeof e!="function")throw new bn(l);return function(){var r=arguments;switch(r.length){case 0:return!e.call(this);case 1:return!e.call(this,r[0]);case 2:return!e.call(this,r[0],r[1]);case 3:return!e.call(this,r[0],r[1],r[2])}return!e.apply(this,r)}}function Ky(e){return $l(2,e)}var em=$g(function(e,r){r=r.length==1&&ne(r[0])?Fe(r[0],Dn(Y())):Fe(Je(r,1),Dn(Y()));var a=r.length;return se(function(c){for(var p=-1,h=en(c.length,a);++p<h;)c[p]=r[p].call(this,c[p]);return Tn(e,this,c)})}),Go=se(function(e,r){var a=Lt(r,Bi(Go));return Dt(e,Ne,t,r,a)}),Wl=se(function(e,r){var a=Lt(r,Bi(Wl));return Dt(e,rn,t,r,a)}),nm=Et(function(e,r){return Dt(e,ht,t,t,t,r)});function tm(e,r){if(typeof e!="function")throw new bn(l);return r=r===t?r:ie(r),se(e,r)}function im(e,r){if(typeof e!="function")throw new bn(l);return r=r==null?0:ze(ie(r),0),se(function(a){var c=a[r],p=Gt(a,0,r);return c&&Ot(p,c),Tn(e,this,p)})}function rm(e,r,a){var c=!0,p=!0;if(typeof e!="function")throw new bn(l);return be(a)&&(c="leading"in a?!!a.leading:c,p="trailing"in a?!!a.trailing:p),jl(e,r,{leading:c,maxWait:r,trailing:p})}function sm(e){return Ml(e,1)}function om(e,r){return Go(Co(r),e)}function am(){if(!arguments.length)return[];var e=arguments[0];return ne(e)?e:[e]}function um(e){return wn(e,k)}function lm(e,r){return r=typeof r=="function"?r:t,wn(e,k,r)}function cm(e){return wn(e,E|k)}function pm(e,r){return r=typeof r=="function"?r:t,wn(e,E|k,r)}function dm(e,r){return r==null||ku(e,r,Qe(r))}function Wn(e,r){return e===r||e!==e&&r!==r}var fm=Qr(go),gm=Qr(function(e,r){return e>=r}),oi=Pu(function(){return arguments}())?Pu:function(e){return xe(e)&&Te.call(e,"callee")&&!vu.call(e,"callee")},ne=v.isArray,hm=su?Dn(su):_g;function fn(e){return e!=null&&ts(e.length)&&!_t(e)}function Me(e){return xe(e)&&fn(e)}function ym(e){return e===!0||e===!1||xe(e)&&on(e)==ye}var qt=Rf||Ko,mm=ou?Dn(ou):vg;function Sm(e){return xe(e)&&e.nodeType===1&&!nr(e)}function Tm(e){if(e==null)return!0;if(fn(e)&&(ne(e)||typeof e=="string"||typeof e.splice=="function"||qt(e)||Fi(e)||oi(e)))return!e.length;var r=nn(e);if(r==Vn||r==Gn)return!e.size;if(Ki(e))return!mo(e).length;for(var a in e)if(Te.call(e,a))return!1;return!0}function Dm(e,r){return Ji(e,r)}function Em(e,r,a){a=typeof a=="function"?a:t;var c=a?a(e,r):t;return c===t?Ji(e,r,t,a):!!c}function qo(e){if(!xe(e))return!1;var r=on(e);return r==Nt||r==xi||typeof e.message=="string"&&typeof e.name=="string"&&!nr(e)}function Am(e){return typeof e=="number"&&Cu(e)}function _t(e){if(!be(e))return!1;var r=on(e);return r==Ke||r==wa||r==Pe||r==Wp}function zl(e){return typeof e=="number"&&e==ie(e)}function ts(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=$n}function be(e){var r=typeof e;return e!=null&&(r=="object"||r=="function")}function xe(e){return e!=null&&typeof e=="object"}var Ql=au?Dn(au):Cg;function _m(e,r){return e===r||yo(e,r,wo(r))}function vm(e,r,a){return a=typeof a=="function"?a:t,yo(e,r,wo(r),a)}function Im(e){return Yl(e)&&e!=+e}function Cm(e){if(lh(e))throw new ee(u);return Mu(e)}function Bm(e){return e===null}function Fm(e){return e==null}function Yl(e){return typeof e=="number"||xe(e)&&on(e)==Oi}function nr(e){if(!xe(e)||on(e)!=yt)return!1;var r=Ur(e);if(r===null)return!0;var a=Te.call(r,"constructor")&&r.constructor;return typeof a=="function"&&a instanceof a&&Ir.call(a)==vf}var jo=uu?Dn(uu):Bg;function Um(e){return zl(e)&&e>=-$n&&e<=$n}var Hl=lu?Dn(lu):Fg;function is(e){return typeof e=="string"||!ne(e)&&xe(e)&&on(e)==Pi}function An(e){return typeof e=="symbol"||xe(e)&&on(e)==yr}var Fi=cu?Dn(cu):Ug;function Rm(e){return e===t}function bm(e){return xe(e)&&nn(e)==Mi}function km(e){return xe(e)&&on(e)==Qp}var wm=Qr(So),Nm=Qr(function(e,r){return e<=r});function Jl(e){if(!e)return[];if(fn(e))return is(e)?qn(e):dn(e);if(Gi&&e[Gi])return df(e[Gi]());var r=nn(e),a=r==Vn?ro:r==Gn?Ar:Ui;return a(e)}function vt(e){if(!e)return e===0?e:0;if(e=On(e),e===ot||e===-ot){var r=e<0?-1:1;return r*gi}return e===e?e:0}function ie(e){var r=vt(e),a=r%1;return r===r?a?r-a:r:0}function Xl(e){return e?ti(ie(e),0,Bn):0}function On(e){if(typeof e=="number")return e;if(An(e))return Xt;if(be(e)){var r=typeof e.valueOf=="function"?e.valueOf():e;e=be(r)?r+"":r}if(typeof e!="string")return e===0?e:+e;e=yu(e);var a=gd.test(e);return a||yd.test(e)?Yd(e.slice(2),a?2:8):fd.test(e)?Xt:+e}function Zl(e){return ut(e,gn(e))}function xm(e){return e?ti(ie(e),-$n,$n):e===0?e:0}function me(e){return e==null?"":En(e)}var Om=Ii(function(e,r){if(Ki(r)||fn(r)){ut(r,Qe(r),e);return}for(var a in r)Te.call(r,a)&&Qi(e,a,r[a])}),Kl=Ii(function(e,r){ut(r,gn(r),e)}),rs=Ii(function(e,r,a,c){ut(r,gn(r),e,c)}),Lm=Ii(function(e,r,a,c){ut(r,Qe(r),e,c)}),Pm=Et(co);function Mm(e,r){var a=vi(e);return r==null?a:bu(a,r)}var $m=se(function(e,r){e=_e(e);var a=-1,c=r.length,p=c>2?r[2]:t;for(p&&an(r[0],r[1],p)&&(c=1);++a<c;)for(var h=r[a],y=gn(h),T=-1,A=y.length;++T<A;){var F=y[T],U=e[F];(U===t||Wn(U,Ei[F])&&!Te.call(e,F))&&(e[F]=h[F])}return e}),Vm=se(function(e){return e.push(t,yl),Tn(ec,t,e)});function Gm(e,r){return du(e,Y(r,3),at)}function qm(e,r){return du(e,Y(r,3),fo)}function jm(e,r){return e==null?e:po(e,Y(r,3),gn)}function Wm(e,r){return e==null?e:Ou(e,Y(r,3),gn)}function zm(e,r){return e&&at(e,Y(r,3))}function Qm(e,r){return e&&fo(e,Y(r,3))}function Ym(e){return e==null?[]:Mr(e,Qe(e))}function Hm(e){return e==null?[]:Mr(e,gn(e))}function Wo(e,r,a){var c=e==null?t:ii(e,r);return c===t?a:c}function Jm(e,r){return e!=null&&Tl(e,r,Tg)}function zo(e,r){return e!=null&&Tl(e,r,Dg)}var Xm=pl(function(e,r,a){r!=null&&typeof r.toString!="function"&&(r=Cr.call(r)),e[r]=a},Yo(hn)),Zm=pl(function(e,r,a){r!=null&&typeof r.toString!="function"&&(r=Cr.call(r)),Te.call(e,r)?e[r].push(a):e[r]=[a]},Y),Km=se(Hi);function Qe(e){return fn(e)?Uu(e):mo(e)}function gn(e){return fn(e)?Uu(e,!0):Rg(e)}function eS(e,r){var a={};return r=Y(r,3),at(e,function(c,p,h){Tt(a,r(c,p,h),c)}),a}function nS(e,r){var a={};return r=Y(r,3),at(e,function(c,p,h){Tt(a,p,r(c,p,h))}),a}var tS=Ii(function(e,r,a){$r(e,r,a)}),ec=Ii(function(e,r,a,c){$r(e,r,a,c)}),iS=Et(function(e,r){var a={};if(e==null)return a;var c=!1;r=Fe(r,function(h){return h=Vt(h,e),c||(c=h.length>1),h}),ut(e,bo(e),a),c&&(a=wn(a,E|B|k,Xg));for(var p=r.length;p--;)_o(a,r[p]);return a});function rS(e,r){return nc(e,ns(Y(r)))}var sS=Et(function(e,r){return e==null?{}:kg(e,r)});function nc(e,r){if(e==null)return{};var a=Fe(bo(e),function(c){return[c]});return r=Y(r),zu(e,a,function(c,p){return r(c,p[0])})}function oS(e,r,a){r=Vt(r,e);var c=-1,p=r.length;for(p||(p=1,e=t);++c<p;){var h=e==null?t:e[lt(r[c])];h===t&&(c=p,h=a),e=_t(h)?h.call(e):h}return e}function aS(e,r,a){return e==null?e:Xi(e,r,a)}function uS(e,r,a,c){return c=typeof c=="function"?c:t,e==null?e:Xi(e,r,a,c)}var tc=gl(Qe),ic=gl(gn);function lS(e,r,a){var c=ne(e),p=c||qt(e)||Fi(e);if(r=Y(r,4),a==null){var h=e&&e.constructor;p?a=c?new h:[]:be(e)?a=_t(h)?vi(Ur(e)):{}:a={}}return(p?Rn:at)(e,function(y,T,A){return r(a,y,T,A)}),a}function cS(e,r){return e==null?!0:_o(e,r)}function pS(e,r,a){return e==null?e:Xu(e,r,Co(a))}function dS(e,r,a,c){return c=typeof c=="function"?c:t,e==null?e:Xu(e,r,Co(a),c)}function Ui(e){return e==null?[]:io(e,Qe(e))}function fS(e){return e==null?[]:io(e,gn(e))}function gS(e,r,a){return a===t&&(a=r,r=t),a!==t&&(a=On(a),a=a===a?a:0),r!==t&&(r=On(r),r=r===r?r:0),ti(On(e),r,a)}function hS(e,r,a){return r=vt(r),a===t?(a=r,r=0):a=vt(a),e=On(e),Eg(e,r,a)}function yS(e,r,a){if(a&&typeof a!="boolean"&&an(e,r,a)&&(r=a=t),a===t&&(typeof r=="boolean"?(a=r,r=t):typeof e=="boolean"&&(a=e,e=t)),e===t&&r===t?(e=0,r=1):(e=vt(e),r===t?(r=e,e=0):r=vt(r)),e>r){var c=e;e=r,r=c}if(a||e%1||r%1){var p=Bu();return en(e+p*(r-e+Qd("1e-"+((p+"").length-1))),r)}return Do(e,r)}var mS=Ci(function(e,r,a){return r=r.toLowerCase(),e+(a?rc(r):r)});function rc(e){return Qo(me(e).toLowerCase())}function sc(e){return e=me(e),e&&e.replace(Sd,af).replace(Ld,"")}function SS(e,r,a){e=me(e),r=En(r);var c=e.length;a=a===t?c:ti(ie(a),0,c);var p=a;return a-=r.length,a>=0&&e.slice(a,p)==r}function TS(e){return e=me(e),e&&Zp.test(e)?e.replace(Oa,uf):e}function DS(e){return e=me(e),e&&rd.test(e)?e.replace(Vs,"\\$&"):e}var ES=Ci(function(e,r,a){return e+(a?"-":"")+r.toLowerCase()}),AS=Ci(function(e,r,a){return e+(a?" ":"")+r.toLowerCase()}),_S=ul("toLowerCase");function vS(e,r,a){e=me(e),r=ie(r);var c=r?Ti(e):0;if(!r||c>=r)return e;var p=(r-c)/2;return zr(wr(p),a)+e+zr(kr(p),a)}function IS(e,r,a){e=me(e),r=ie(r);var c=r?Ti(e):0;return r&&c<r?e+zr(r-c,a):e}function CS(e,r,a){e=me(e),r=ie(r);var c=r?Ti(e):0;return r&&c<r?zr(r-c,a)+e:e}function BS(e,r,a){return a||r==null?r=0:r&&(r=+r),Nf(me(e).replace(Gs,""),r||0)}function FS(e,r,a){return(a?an(e,r,a):r===t)?r=1:r=ie(r),Eo(me(e),r)}function US(){var e=arguments,r=me(e[0]);return e.length<3?r:r.replace(e[1],e[2])}var RS=Ci(function(e,r,a){return e+(a?"_":"")+r.toLowerCase()});function bS(e,r,a){return a&&typeof a!="number"&&an(e,r,a)&&(r=a=t),a=a===t?Bn:a>>>0,a?(e=me(e),e&&(typeof r=="string"||r!=null&&!jo(r))&&(r=En(r),!r&&Si(e))?Gt(qn(e),0,a):e.split(r,a)):[]}var kS=Ci(function(e,r,a){return e+(a?" ":"")+Qo(r)});function wS(e,r,a){return e=me(e),a=a==null?0:ti(ie(a),0,e.length),r=En(r),e.slice(a,a+r.length)==r}function NS(e,r,a){var c=g.templateSettings;a&&an(e,r,a)&&(r=t),e=me(e),r=rs({},r,c,hl);var p=rs({},r.imports,c.imports,hl),h=Qe(p),y=io(p,h),T,A,F=0,U=r.interpolate||mr,w="__p += '",O=so((r.escape||mr).source+"|"+U.source+"|"+(U===La?dd:mr).source+"|"+(r.evaluate||mr).source+"|$","g"),q="//# sourceURL="+(Te.call(r,"sourceURL")?(r.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Gd+"]")+`
`;e.replace(O,function(J,oe,pe,_n,un,vn){return pe||(pe=_n),w+=e.slice(F,vn).replace(Td,lf),oe&&(T=!0,w+=`' +
__e(`+oe+`) +
'`),un&&(A=!0,w+=`';
`+un+`;
__p += '`),pe&&(w+=`' +
((__t = (`+pe+`)) == null ? '' : __t) +
'`),F=vn+J.length,J}),w+=`';
`;var H=Te.call(r,"variable")&&r.variable;if(!H)w=`with (obj) {
`+w+`
}
`;else if(cd.test(H))throw new ee(d);w=(A?w.replace(Yp,""):w).replace(Hp,"$1").replace(Jp,"$1;"),w="function("+(H||"obj")+`) {
`+(H?"":`obj || (obj = {});
`)+"var __t, __p = ''"+(T?", __e = _.escape":"")+(A?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+w+`return __p
}`;var re=ac(function(){return fe(h,q+"return "+w).apply(t,y)});if(re.source=w,qo(re))throw re;return re}function xS(e){return me(e).toLowerCase()}function OS(e){return me(e).toUpperCase()}function LS(e,r,a){if(e=me(e),e&&(a||r===t))return yu(e);if(!e||!(r=En(r)))return e;var c=qn(e),p=qn(r),h=mu(c,p),y=Su(c,p)+1;return Gt(c,h,y).join("")}function PS(e,r,a){if(e=me(e),e&&(a||r===t))return e.slice(0,Du(e)+1);if(!e||!(r=En(r)))return e;var c=qn(e),p=Su(c,qn(r))+1;return Gt(c,0,p).join("")}function MS(e,r,a){if(e=me(e),e&&(a||r===t))return e.replace(Gs,"");if(!e||!(r=En(r)))return e;var c=qn(e),p=mu(c,qn(r));return Gt(c,p).join("")}function $S(e,r){var a=K,c=sn;if(be(r)){var p="separator"in r?r.separator:p;a="length"in r?ie(r.length):a,c="omission"in r?En(r.omission):c}e=me(e);var h=e.length;if(Si(e)){var y=qn(e);h=y.length}if(a>=h)return e;var T=a-Ti(c);if(T<1)return c;var A=y?Gt(y,0,T).join(""):e.slice(0,T);if(p===t)return A+c;if(y&&(T+=A.length-T),jo(p)){if(e.slice(T).search(p)){var F,U=A;for(p.global||(p=so(p.source,me(Pa.exec(p))+"g")),p.lastIndex=0;F=p.exec(U);)var w=F.index;A=A.slice(0,w===t?T:w)}}else if(e.indexOf(En(p),T)!=T){var O=A.lastIndexOf(p);O>-1&&(A=A.slice(0,O))}return A+c}function VS(e){return e=me(e),e&&Xp.test(e)?e.replace(xa,yf):e}var GS=Ci(function(e,r,a){return e+(a?" ":"")+r.toUpperCase()}),Qo=ul("toUpperCase");function oc(e,r,a){return e=me(e),r=a?t:r,r===t?pf(e)?Tf(e):nf(e):e.match(r)||[]}var ac=se(function(e,r){try{return Tn(e,t,r)}catch(a){return qo(a)?a:new ee(a)}}),qS=Et(function(e,r){return Rn(r,function(a){a=lt(a),Tt(e,a,Vo(e[a],e))}),e});function jS(e){var r=e==null?0:e.length,a=Y();return e=r?Fe(e,function(c){if(typeof c[1]!="function")throw new bn(l);return[a(c[0]),c[1]]}):[],se(function(c){for(var p=-1;++p<r;){var h=e[p];if(Tn(h[0],this,c))return Tn(h[1],this,c)}})}function WS(e){return yg(wn(e,E))}function Yo(e){return function(){return e}}function zS(e,r){return e==null||e!==e?r:e}var QS=cl(),YS=cl(!0);function hn(e){return e}function Ho(e){return $u(typeof e=="function"?e:wn(e,E))}function HS(e){return Gu(wn(e,E))}function JS(e,r){return qu(e,wn(r,E))}var XS=se(function(e,r){return function(a){return Hi(a,e,r)}}),ZS=se(function(e,r){return function(a){return Hi(e,a,r)}});function Jo(e,r,a){var c=Qe(r),p=Mr(r,c);a==null&&!(be(r)&&(p.length||!c.length))&&(a=r,r=e,e=this,p=Mr(r,Qe(r)));var h=!(be(a)&&"chain"in a)||!!a.chain,y=_t(e);return Rn(p,function(T){var A=r[T];e[T]=A,y&&(e.prototype[T]=function(){var F=this.__chain__;if(h||F){var U=e(this.__wrapped__),w=U.__actions__=dn(this.__actions__);return w.push({func:A,args:arguments,thisArg:e}),U.__chain__=F,U}return A.apply(e,Ot([this.value()],arguments))})}),e}function KS(){return He._===this&&(He._=If),this}function Xo(){}function eT(e){return e=ie(e),se(function(r){return ju(r,e)})}var nT=Fo(Fe),tT=Fo(pu),iT=Fo(Zs);function uc(e){return xo(e)?Ks(lt(e)):wg(e)}function rT(e){return function(r){return e==null?t:ii(e,r)}}var sT=dl(),oT=dl(!0);function Zo(){return[]}function Ko(){return!1}function aT(){return{}}function uT(){return""}function lT(){return!0}function cT(e,r){if(e=ie(e),e<1||e>$n)return[];var a=Bn,c=en(e,Bn);r=Y(r),e-=Bn;for(var p=to(c,r);++a<e;)r(a);return p}function pT(e){return ne(e)?Fe(e,lt):An(e)?[e]:dn(Fl(me(e)))}function dT(e){var r=++_f;return me(e)+r}var fT=Wr(function(e,r){return e+r},0),gT=Uo("ceil"),hT=Wr(function(e,r){return e/r},1),yT=Uo("floor");function mT(e){return e&&e.length?Pr(e,hn,go):t}function ST(e,r){return e&&e.length?Pr(e,Y(r,2),go):t}function TT(e){return gu(e,hn)}function DT(e,r){return gu(e,Y(r,2))}function ET(e){return e&&e.length?Pr(e,hn,So):t}function AT(e,r){return e&&e.length?Pr(e,Y(r,2),So):t}var _T=Wr(function(e,r){return e*r},1),vT=Uo("round"),IT=Wr(function(e,r){return e-r},0);function CT(e){return e&&e.length?no(e,hn):0}function BT(e,r){return e&&e.length?no(e,Y(r,2)):0}return g.after=Hy,g.ary=Ml,g.assign=Om,g.assignIn=Kl,g.assignInWith=rs,g.assignWith=Lm,g.at=Pm,g.before=$l,g.bind=Vo,g.bindAll=qS,g.bindKey=Vl,g.castArray=am,g.chain=Ol,g.chunk=yh,g.compact=mh,g.concat=Sh,g.cond=jS,g.conforms=WS,g.constant=Yo,g.countBy=Cy,g.create=Mm,g.curry=Gl,g.curryRight=ql,g.debounce=jl,g.defaults=$m,g.defaultsDeep=Vm,g.defer=Jy,g.delay=Xy,g.difference=Th,g.differenceBy=Dh,g.differenceWith=Eh,g.drop=Ah,g.dropRight=_h,g.dropRightWhile=vh,g.dropWhile=Ih,g.fill=Ch,g.filter=Fy,g.flatMap=by,g.flatMapDeep=ky,g.flatMapDepth=wy,g.flatten=kl,g.flattenDeep=Bh,g.flattenDepth=Fh,g.flip=Zy,g.flow=QS,g.flowRight=YS,g.fromPairs=Uh,g.functions=Ym,g.functionsIn=Hm,g.groupBy=Ny,g.initial=bh,g.intersection=kh,g.intersectionBy=wh,g.intersectionWith=Nh,g.invert=Xm,g.invertBy=Zm,g.invokeMap=Oy,g.iteratee=Ho,g.keyBy=Ly,g.keys=Qe,g.keysIn=gn,g.map=Zr,g.mapKeys=eS,g.mapValues=nS,g.matches=HS,g.matchesProperty=JS,g.memoize=es,g.merge=tS,g.mergeWith=ec,g.method=XS,g.methodOf=ZS,g.mixin=Jo,g.negate=ns,g.nthArg=eT,g.omit=iS,g.omitBy=rS,g.once=Ky,g.orderBy=Py,g.over=nT,g.overArgs=em,g.overEvery=tT,g.overSome=iT,g.partial=Go,g.partialRight=Wl,g.partition=My,g.pick=sS,g.pickBy=nc,g.property=uc,g.propertyOf=rT,g.pull=Ph,g.pullAll=Nl,g.pullAllBy=Mh,g.pullAllWith=$h,g.pullAt=Vh,g.range=sT,g.rangeRight=oT,g.rearg=nm,g.reject=Gy,g.remove=Gh,g.rest=tm,g.reverse=Mo,g.sampleSize=jy,g.set=aS,g.setWith=uS,g.shuffle=Wy,g.slice=qh,g.sortBy=Yy,g.sortedUniq=Jh,g.sortedUniqBy=Xh,g.split=bS,g.spread=im,g.tail=Zh,g.take=Kh,g.takeRight=ey,g.takeRightWhile=ny,g.takeWhile=ty,g.tap=my,g.throttle=rm,g.thru=Xr,g.toArray=Jl,g.toPairs=tc,g.toPairsIn=ic,g.toPath=pT,g.toPlainObject=Zl,g.transform=lS,g.unary=sm,g.union=iy,g.unionBy=ry,g.unionWith=sy,g.uniq=oy,g.uniqBy=ay,g.uniqWith=uy,g.unset=cS,g.unzip=$o,g.unzipWith=xl,g.update=pS,g.updateWith=dS,g.values=Ui,g.valuesIn=fS,g.without=ly,g.words=oc,g.wrap=om,g.xor=cy,g.xorBy=py,g.xorWith=dy,g.zip=fy,g.zipObject=gy,g.zipObjectDeep=hy,g.zipWith=yy,g.entries=tc,g.entriesIn=ic,g.extend=Kl,g.extendWith=rs,Jo(g,g),g.add=fT,g.attempt=ac,g.camelCase=mS,g.capitalize=rc,g.ceil=gT,g.clamp=gS,g.clone=um,g.cloneDeep=cm,g.cloneDeepWith=pm,g.cloneWith=lm,g.conformsTo=dm,g.deburr=sc,g.defaultTo=zS,g.divide=hT,g.endsWith=SS,g.eq=Wn,g.escape=TS,g.escapeRegExp=DS,g.every=By,g.find=Uy,g.findIndex=Rl,g.findKey=Gm,g.findLast=Ry,g.findLastIndex=bl,g.findLastKey=qm,g.floor=yT,g.forEach=Ll,g.forEachRight=Pl,g.forIn=jm,g.forInRight=Wm,g.forOwn=zm,g.forOwnRight=Qm,g.get=Wo,g.gt=fm,g.gte=gm,g.has=Jm,g.hasIn=zo,g.head=wl,g.identity=hn,g.includes=xy,g.indexOf=Rh,g.inRange=hS,g.invoke=Km,g.isArguments=oi,g.isArray=ne,g.isArrayBuffer=hm,g.isArrayLike=fn,g.isArrayLikeObject=Me,g.isBoolean=ym,g.isBuffer=qt,g.isDate=mm,g.isElement=Sm,g.isEmpty=Tm,g.isEqual=Dm,g.isEqualWith=Em,g.isError=qo,g.isFinite=Am,g.isFunction=_t,g.isInteger=zl,g.isLength=ts,g.isMap=Ql,g.isMatch=_m,g.isMatchWith=vm,g.isNaN=Im,g.isNative=Cm,g.isNil=Fm,g.isNull=Bm,g.isNumber=Yl,g.isObject=be,g.isObjectLike=xe,g.isPlainObject=nr,g.isRegExp=jo,g.isSafeInteger=Um,g.isSet=Hl,g.isString=is,g.isSymbol=An,g.isTypedArray=Fi,g.isUndefined=Rm,g.isWeakMap=bm,g.isWeakSet=km,g.join=xh,g.kebabCase=ES,g.last=xn,g.lastIndexOf=Oh,g.lowerCase=AS,g.lowerFirst=_S,g.lt=wm,g.lte=Nm,g.max=mT,g.maxBy=ST,g.mean=TT,g.meanBy=DT,g.min=ET,g.minBy=AT,g.stubArray=Zo,g.stubFalse=Ko,g.stubObject=aT,g.stubString=uT,g.stubTrue=lT,g.multiply=_T,g.nth=Lh,g.noConflict=KS,g.noop=Xo,g.now=Kr,g.pad=vS,g.padEnd=IS,g.padStart=CS,g.parseInt=BS,g.random=yS,g.reduce=$y,g.reduceRight=Vy,g.repeat=FS,g.replace=US,g.result=oS,g.round=vT,g.runInContext=D,g.sample=qy,g.size=zy,g.snakeCase=RS,g.some=Qy,g.sortedIndex=jh,g.sortedIndexBy=Wh,g.sortedIndexOf=zh,g.sortedLastIndex=Qh,g.sortedLastIndexBy=Yh,g.sortedLastIndexOf=Hh,g.startCase=kS,g.startsWith=wS,g.subtract=IT,g.sum=CT,g.sumBy=BT,g.template=NS,g.times=cT,g.toFinite=vt,g.toInteger=ie,g.toLength=Xl,g.toLower=xS,g.toNumber=On,g.toSafeInteger=xm,g.toString=me,g.toUpper=OS,g.trim=LS,g.trimEnd=PS,g.trimStart=MS,g.truncate=$S,g.unescape=VS,g.uniqueId=dT,g.upperCase=GS,g.upperFirst=Qo,g.each=Ll,g.eachRight=Pl,g.first=wl,Jo(g,function(){var e={};return at(g,function(r,a){Te.call(g.prototype,a)||(e[a]=r)}),e}(),{chain:!1}),g.VERSION=s,Rn(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){g[e].placeholder=g}),Rn(["drop","take"],function(e,r){le.prototype[e]=function(a){a=a===t?1:ze(ie(a),0);var c=this.__filtered__&&!r?new le(this):this.clone();return c.__filtered__?c.__takeCount__=en(a,c.__takeCount__):c.__views__.push({size:en(a,Bn),type:e+(c.__dir__<0?"Right":"")}),c},le.prototype[e+"Right"]=function(a){return this.reverse()[e](a).reverse()}}),Rn(["filter","map","takeWhile"],function(e,r){var a=r+1,c=a==gr||a==hr;le.prototype[e]=function(p){var h=this.clone();return h.__iteratees__.push({iteratee:Y(p,3),type:a}),h.__filtered__=h.__filtered__||c,h}}),Rn(["head","last"],function(e,r){var a="take"+(r?"Right":"");le.prototype[e]=function(){return this[a](1).value()[0]}}),Rn(["initial","tail"],function(e,r){var a="drop"+(r?"":"Right");le.prototype[e]=function(){return this.__filtered__?new le(this):this[a](1)}}),le.prototype.compact=function(){return this.filter(hn)},le.prototype.find=function(e){return this.filter(e).head()},le.prototype.findLast=function(e){return this.reverse().find(e)},le.prototype.invokeMap=se(function(e,r){return typeof e=="function"?new le(this):this.map(function(a){return Hi(a,e,r)})}),le.prototype.reject=function(e){return this.filter(ns(Y(e)))},le.prototype.slice=function(e,r){e=ie(e);var a=this;return a.__filtered__&&(e>0||r<0)?new le(a):(e<0?a=a.takeRight(-e):e&&(a=a.drop(e)),r!==t&&(r=ie(r),a=r<0?a.dropRight(-r):a.take(r-e)),a)},le.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},le.prototype.toArray=function(){return this.take(Bn)},at(le.prototype,function(e,r){var a=/^(?:filter|find|map|reject)|While$/.test(r),c=/^(?:head|last)$/.test(r),p=g[c?"take"+(r=="last"?"Right":""):r],h=c||/^find/.test(r);p&&(g.prototype[r]=function(){var y=this.__wrapped__,T=c?[1]:arguments,A=y instanceof le,F=T[0],U=A||ne(y),w=function(oe){var pe=p.apply(g,Ot([oe],T));return c&&O?pe[0]:pe};U&&a&&typeof F=="function"&&F.length!=1&&(A=U=!1);var O=this.__chain__,q=!!this.__actions__.length,H=h&&!O,re=A&&!q;if(!h&&U){y=re?y:new le(this);var J=e.apply(y,T);return J.__actions__.push({func:Xr,args:[w],thisArg:t}),new kn(J,O)}return H&&re?e.apply(this,T):(J=this.thru(w),H?c?J.value()[0]:J.value():J)})}),Rn(["pop","push","shift","sort","splice","unshift"],function(e){var r=_r[e],a=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",c=/^(?:pop|shift)$/.test(e);g.prototype[e]=function(){var p=arguments;if(c&&!this.__chain__){var h=this.value();return r.apply(ne(h)?h:[],p)}return this[a](function(y){return r.apply(ne(y)?y:[],p)})}}),at(le.prototype,function(e,r){var a=g[r];if(a){var c=a.name+"";Te.call(_i,c)||(_i[c]=[]),_i[c].push({name:r,func:a})}}),_i[jr(t,ge).name]=[{name:"wrapper",func:t}],le.prototype.clone=Vf,le.prototype.reverse=Gf,le.prototype.value=qf,g.prototype.at=Sy,g.prototype.chain=Ty,g.prototype.commit=Dy,g.prototype.next=Ey,g.prototype.plant=_y,g.prototype.reverse=vy,g.prototype.toJSON=g.prototype.valueOf=g.prototype.value=Iy,g.prototype.first=g.prototype.head,Gi&&(g.prototype[Gi]=Ay),g},Di=Df();Zt?((Zt.exports=Di)._=Di,Ys._=Di):He._=Di}).call(tr)})(ms,ms.exports);var cD=ms.exports;const Rt=aD(cD),pD="true",ip={MAGIDOC_GENERATE:pD};function UA(i){return i.get(ip)}function Ca(i,n){return i.getOrDefault(ip,n)}function de(i,n){if(!!!i)throw new Error(n)}function bt(i){return typeof i=="object"&&i!==null}function Xn(i,n){if(!!!i)throw new Error(n??"Unexpected invariant triggered.")}const dD=/\r\n|[\n\r]/g;function da(i,n){let t=0,s=1;for(const o of i.body.matchAll(dD)){if(typeof o.index=="number"||Xn(!1),o.index>=n)break;t=o.index+o[0].length,s+=1}return{line:s,column:n+1-t}}function fD(i){return rp(i.source,da(i.source,i.start))}function rp(i,n){const t=i.locationOffset.column-1,s="".padStart(t)+i.body,o=n.line-1,u=i.locationOffset.line-1,l=n.line+u,d=n.line===1?t:0,f=n.column+d,m=`${i.name}:${l}:${f}
`,S=s.split(/\r\n|[\n\r]/g),E=S[o];if(E.length>120){const B=Math.floor(f/80),k=f%80,N=[];for(let x=0;x<E.length;x+=80)N.push(E.slice(x,x+80));return m+bc([[`${l} |`,N[0]],...N.slice(1,B+1).map(x=>["|",x]),["|","^".padStart(k)],["|",N[B+1]]])}return m+bc([[`${l-1} |`,S[o-1]],[`${l} |`,E],["|","^".padStart(f)],[`${l+1} |`,S[o+1]]])}function bc(i){const n=i.filter(([s,o])=>o!==void 0),t=Math.max(...n.map(([s])=>s.length));return n.map(([s,o])=>s.padStart(t)+(o?" "+o:"")).join(`
`)}function gD(i){const n=i[0];return n==null||"kind"in n||"length"in n?{nodes:n,source:i[1],positions:i[2],path:i[3],originalError:i[4],extensions:i[5]}:n}class j extends Error{constructor(n,...t){var s,o,u;const{nodes:l,source:d,positions:f,path:m,originalError:S,extensions:E}=gD(t);super(n),this.name="GraphQLError",this.path=m??void 0,this.originalError=S??void 0,this.nodes=kc(Array.isArray(l)?l:l?[l]:void 0);const B=kc((s=this.nodes)===null||s===void 0?void 0:s.map(N=>N.loc).filter(N=>N!=null));this.source=d??(B==null||(o=B[0])===null||o===void 0?void 0:o.source),this.positions=f??(B==null?void 0:B.map(N=>N.start)),this.locations=f&&d?f.map(N=>da(d,N)):B==null?void 0:B.map(N=>da(N.source,N.start));const k=bt(S==null?void 0:S.extensions)?S==null?void 0:S.extensions:void 0;this.extensions=(u=E??k)!==null&&u!==void 0?u:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),S!=null&&S.stack?Object.defineProperty(this,"stack",{value:S.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,j):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let n=this.message;if(this.nodes)for(const t of this.nodes)t.loc&&(n+=`

`+fD(t.loc));else if(this.source&&this.locations)for(const t of this.locations)n+=`

`+rp(this.source,t);return n}toJSON(){const n={message:this.message};return this.locations!=null&&(n.locations=this.locations),this.path!=null&&(n.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(n.extensions=this.extensions),n}}function kc(i){return i===void 0||i.length===0?void 0:i}function Ye(i,n,t){return new j(`Syntax Error: ${t}`,{source:i,positions:[n]})}class hD{constructor(n,t,s){this.start=n.start,this.end=t.end,this.startToken=n,this.endToken=t,this.source=s}get[Symbol.toStringTag](){return"Location"}toJSON(){return{start:this.start,end:this.end}}}class sp{constructor(n,t,s,o,u,l){this.kind=n,this.start=t,this.end=s,this.line=o,this.column=u,this.value=l,this.prev=null,this.next=null}get[Symbol.toStringTag](){return"Token"}toJSON(){return{kind:this.kind,value:this.value,line:this.line,column:this.column}}}const op={Name:[],Document:["definitions"],OperationDefinition:["name","variableDefinitions","directives","selectionSet"],VariableDefinition:["variable","type","defaultValue","directives"],Variable:["name"],SelectionSet:["selections"],Field:["alias","name","arguments","directives","selectionSet"],Argument:["name","value"],FragmentSpread:["name","directives"],InlineFragment:["typeCondition","directives","selectionSet"],FragmentDefinition:["name","variableDefinitions","typeCondition","directives","selectionSet"],IntValue:[],FloatValue:[],StringValue:[],BooleanValue:[],NullValue:[],EnumValue:[],ListValue:["values"],ObjectValue:["fields"],ObjectField:["name","value"],Directive:["name","arguments"],NamedType:["name"],ListType:["type"],NonNullType:["type"],SchemaDefinition:["description","directives","operationTypes"],OperationTypeDefinition:["type"],ScalarTypeDefinition:["description","name","directives"],ObjectTypeDefinition:["description","name","interfaces","directives","fields"],FieldDefinition:["description","name","arguments","type","directives"],InputValueDefinition:["description","name","type","defaultValue","directives"],InterfaceTypeDefinition:["description","name","interfaces","directives","fields"],UnionTypeDefinition:["description","name","directives","types"],EnumTypeDefinition:["description","name","directives","values"],EnumValueDefinition:["description","name","directives"],InputObjectTypeDefinition:["description","name","directives","fields"],DirectiveDefinition:["description","name","arguments","locations"],SchemaExtension:["directives","operationTypes"],ScalarTypeExtension:["name","directives"],ObjectTypeExtension:["name","interfaces","directives","fields"],InterfaceTypeExtension:["name","interfaces","directives","fields"],UnionTypeExtension:["name","directives","types"],EnumTypeExtension:["name","directives","values"],InputObjectTypeExtension:["name","directives","fields"]},yD=new Set(Object.keys(op));function wc(i){const n=i==null?void 0:i.kind;return typeof n=="string"&&yD.has(n)}var Ln;(function(i){i.QUERY="query",i.MUTATION="mutation",i.SUBSCRIPTION="subscription"})(Ln||(Ln={}));var Q;(function(i){i.QUERY="QUERY",i.MUTATION="MUTATION",i.SUBSCRIPTION="SUBSCRIPTION",i.FIELD="FIELD",i.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",i.FRAGMENT_SPREAD="FRAGMENT_SPREAD",i.INLINE_FRAGMENT="INLINE_FRAGMENT",i.VARIABLE_DEFINITION="VARIABLE_DEFINITION",i.SCHEMA="SCHEMA",i.SCALAR="SCALAR",i.OBJECT="OBJECT",i.FIELD_DEFINITION="FIELD_DEFINITION",i.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",i.INTERFACE="INTERFACE",i.UNION="UNION",i.ENUM="ENUM",i.ENUM_VALUE="ENUM_VALUE",i.INPUT_OBJECT="INPUT_OBJECT",i.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(Q||(Q={}));var _;(function(i){i.NAME="Name",i.DOCUMENT="Document",i.OPERATION_DEFINITION="OperationDefinition",i.VARIABLE_DEFINITION="VariableDefinition",i.SELECTION_SET="SelectionSet",i.FIELD="Field",i.ARGUMENT="Argument",i.FRAGMENT_SPREAD="FragmentSpread",i.INLINE_FRAGMENT="InlineFragment",i.FRAGMENT_DEFINITION="FragmentDefinition",i.VARIABLE="Variable",i.INT="IntValue",i.FLOAT="FloatValue",i.STRING="StringValue",i.BOOLEAN="BooleanValue",i.NULL="NullValue",i.ENUM="EnumValue",i.LIST="ListValue",i.OBJECT="ObjectValue",i.OBJECT_FIELD="ObjectField",i.DIRECTIVE="Directive",i.NAMED_TYPE="NamedType",i.LIST_TYPE="ListType",i.NON_NULL_TYPE="NonNullType",i.SCHEMA_DEFINITION="SchemaDefinition",i.OPERATION_TYPE_DEFINITION="OperationTypeDefinition",i.SCALAR_TYPE_DEFINITION="ScalarTypeDefinition",i.OBJECT_TYPE_DEFINITION="ObjectTypeDefinition",i.FIELD_DEFINITION="FieldDefinition",i.INPUT_VALUE_DEFINITION="InputValueDefinition",i.INTERFACE_TYPE_DEFINITION="InterfaceTypeDefinition",i.UNION_TYPE_DEFINITION="UnionTypeDefinition",i.ENUM_TYPE_DEFINITION="EnumTypeDefinition",i.ENUM_VALUE_DEFINITION="EnumValueDefinition",i.INPUT_OBJECT_TYPE_DEFINITION="InputObjectTypeDefinition",i.DIRECTIVE_DEFINITION="DirectiveDefinition",i.SCHEMA_EXTENSION="SchemaExtension",i.SCALAR_TYPE_EXTENSION="ScalarTypeExtension",i.OBJECT_TYPE_EXTENSION="ObjectTypeExtension",i.INTERFACE_TYPE_EXTENSION="InterfaceTypeExtension",i.UNION_TYPE_EXTENSION="UnionTypeExtension",i.ENUM_TYPE_EXTENSION="EnumTypeExtension",i.INPUT_OBJECT_TYPE_EXTENSION="InputObjectTypeExtension"})(_||(_={}));function fa(i){return i===9||i===32}function lr(i){return i>=48&&i<=57}function ap(i){return i>=97&&i<=122||i>=65&&i<=90}function Ba(i){return ap(i)||i===95}function up(i){return ap(i)||lr(i)||i===95}function mD(i){var n;let t=Number.MAX_SAFE_INTEGER,s=null,o=-1;for(let l=0;l<i.length;++l){var u;const d=i[l],f=SD(d);f!==d.length&&(s=(u=s)!==null&&u!==void 0?u:l,o=l,l!==0&&f<t&&(t=f))}return i.map((l,d)=>d===0?l:l.slice(t)).slice((n=s)!==null&&n!==void 0?n:0,o+1)}function SD(i){let n=0;for(;n<i.length&&fa(i.charCodeAt(n));)++n;return n}function TD(i,n){const t=i.replace(/"""/g,'\\"""'),s=t.split(/\r\n|[\n\r]/g),o=s.length===1,u=s.length>1&&s.slice(1).every(k=>k.length===0||fa(k.charCodeAt(0))),l=t.endsWith('\\"""'),d=i.endsWith('"')&&!l,f=i.endsWith("\\"),m=d||f,S=!(n!=null&&n.minimize)&&(!o||i.length>70||m||u||l);let E="";const B=o&&fa(i.charCodeAt(0));return(S&&!B||u)&&(E+=`
`),E+=t,(S||m)&&(E+=`
`),'"""'+E+'"""'}var R;(function(i){i.SOF="<SOF>",i.EOF="<EOF>",i.BANG="!",i.DOLLAR="$",i.AMP="&",i.PAREN_L="(",i.PAREN_R=")",i.SPREAD="...",i.COLON=":",i.EQUALS="=",i.AT="@",i.BRACKET_L="[",i.BRACKET_R="]",i.BRACE_L="{",i.PIPE="|",i.BRACE_R="}",i.NAME="Name",i.INT="Int",i.FLOAT="Float",i.STRING="String",i.BLOCK_STRING="BlockString",i.COMMENT="Comment"})(R||(R={}));class DD{constructor(n){const t=new sp(R.SOF,0,0,0,0);this.source=n,this.lastToken=t,this.token=t,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let n=this.token;if(n.kind!==R.EOF)do if(n.next)n=n.next;else{const t=AD(this,n.end);n.next=t,t.prev=n,n=t}while(n.kind===R.COMMENT);return n}}function ED(i){return i===R.BANG||i===R.DOLLAR||i===R.AMP||i===R.PAREN_L||i===R.PAREN_R||i===R.SPREAD||i===R.COLON||i===R.EQUALS||i===R.AT||i===R.BRACKET_L||i===R.BRACKET_R||i===R.BRACE_L||i===R.PIPE||i===R.BRACE_R}function wi(i){return i>=0&&i<=55295||i>=57344&&i<=1114111}function vs(i,n){return lp(i.charCodeAt(n))&&cp(i.charCodeAt(n+1))}function lp(i){return i>=55296&&i<=56319}function cp(i){return i>=56320&&i<=57343}function li(i,n){const t=i.source.body.codePointAt(n);if(t===void 0)return R.EOF;if(t>=32&&t<=126){const s=String.fromCodePoint(t);return s==='"'?`'"'`:`"${s}"`}return"U+"+t.toString(16).toUpperCase().padStart(4,"0")}function qe(i,n,t,s,o){const u=i.line,l=1+t-i.lineStart;return new sp(n,t,s,u,l,o)}function AD(i,n){const t=i.source.body,s=t.length;let o=n;for(;o<s;){const u=t.charCodeAt(o);switch(u){case 65279:case 9:case 32:case 44:++o;continue;case 10:++o,++i.line,i.lineStart=o;continue;case 13:t.charCodeAt(o+1)===10?o+=2:++o,++i.line,i.lineStart=o;continue;case 35:return _D(i,o);case 33:return qe(i,R.BANG,o,o+1);case 36:return qe(i,R.DOLLAR,o,o+1);case 38:return qe(i,R.AMP,o,o+1);case 40:return qe(i,R.PAREN_L,o,o+1);case 41:return qe(i,R.PAREN_R,o,o+1);case 46:if(t.charCodeAt(o+1)===46&&t.charCodeAt(o+2)===46)return qe(i,R.SPREAD,o,o+3);break;case 58:return qe(i,R.COLON,o,o+1);case 61:return qe(i,R.EQUALS,o,o+1);case 64:return qe(i,R.AT,o,o+1);case 91:return qe(i,R.BRACKET_L,o,o+1);case 93:return qe(i,R.BRACKET_R,o,o+1);case 123:return qe(i,R.BRACE_L,o,o+1);case 124:return qe(i,R.PIPE,o,o+1);case 125:return qe(i,R.BRACE_R,o,o+1);case 34:return t.charCodeAt(o+1)===34&&t.charCodeAt(o+2)===34?UD(i,o):ID(i,o)}if(lr(u)||u===45)return vD(i,o,u);if(Ba(u))return RD(i,o);throw Ye(i.source,o,u===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:wi(u)||vs(t,o)?`Unexpected character: ${li(i,o)}.`:`Invalid character: ${li(i,o)}.`)}return qe(i,R.EOF,s,s)}function _D(i,n){const t=i.source.body,s=t.length;let o=n+1;for(;o<s;){const u=t.charCodeAt(o);if(u===10||u===13)break;if(wi(u))++o;else if(vs(t,o))o+=2;else break}return qe(i,R.COMMENT,n,o,t.slice(n+1,o))}function vD(i,n,t){const s=i.source.body;let o=n,u=t,l=!1;if(u===45&&(u=s.charCodeAt(++o)),u===48){if(u=s.charCodeAt(++o),lr(u))throw Ye(i.source,o,`Invalid number, unexpected digit after 0: ${li(i,o)}.`)}else o=ra(i,o,u),u=s.charCodeAt(o);if(u===46&&(l=!0,u=s.charCodeAt(++o),o=ra(i,o,u),u=s.charCodeAt(o)),(u===69||u===101)&&(l=!0,u=s.charCodeAt(++o),(u===43||u===45)&&(u=s.charCodeAt(++o)),o=ra(i,o,u),u=s.charCodeAt(o)),u===46||Ba(u))throw Ye(i.source,o,`Invalid number, expected digit but got: ${li(i,o)}.`);return qe(i,l?R.FLOAT:R.INT,n,o,s.slice(n,o))}function ra(i,n,t){if(!lr(t))throw Ye(i.source,n,`Invalid number, expected digit but got: ${li(i,n)}.`);const s=i.source.body;let o=n+1;for(;lr(s.charCodeAt(o));)++o;return o}function ID(i,n){const t=i.source.body,s=t.length;let o=n+1,u=o,l="";for(;o<s;){const d=t.charCodeAt(o);if(d===34)return l+=t.slice(u,o),qe(i,R.STRING,n,o+1,l);if(d===92){l+=t.slice(u,o);const f=t.charCodeAt(o+1)===117?t.charCodeAt(o+2)===123?CD(i,o):BD(i,o):FD(i,o);l+=f.value,o+=f.size,u=o;continue}if(d===10||d===13)break;if(wi(d))++o;else if(vs(t,o))o+=2;else throw Ye(i.source,o,`Invalid character within String: ${li(i,o)}.`)}throw Ye(i.source,o,"Unterminated string.")}function CD(i,n){const t=i.source.body;let s=0,o=3;for(;o<12;){const u=t.charCodeAt(n+o++);if(u===125){if(o<5||!wi(s))break;return{value:String.fromCodePoint(s),size:o}}if(s=s<<4|ir(u),s<0)break}throw Ye(i.source,n,`Invalid Unicode escape sequence: "${t.slice(n,n+o)}".`)}function BD(i,n){const t=i.source.body,s=Nc(t,n+2);if(wi(s))return{value:String.fromCodePoint(s),size:6};if(lp(s)&&t.charCodeAt(n+6)===92&&t.charCodeAt(n+7)===117){const o=Nc(t,n+8);if(cp(o))return{value:String.fromCodePoint(s,o),size:12}}throw Ye(i.source,n,`Invalid Unicode escape sequence: "${t.slice(n,n+6)}".`)}function Nc(i,n){return ir(i.charCodeAt(n))<<12|ir(i.charCodeAt(n+1))<<8|ir(i.charCodeAt(n+2))<<4|ir(i.charCodeAt(n+3))}function ir(i){return i>=48&&i<=57?i-48:i>=65&&i<=70?i-55:i>=97&&i<=102?i-87:-1}function FD(i,n){const t=i.source.body;switch(t.charCodeAt(n+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw Ye(i.source,n,`Invalid character escape sequence: "${t.slice(n,n+2)}".`)}function UD(i,n){const t=i.source.body,s=t.length;let o=i.lineStart,u=n+3,l=u,d="";const f=[];for(;u<s;){const m=t.charCodeAt(u);if(m===34&&t.charCodeAt(u+1)===34&&t.charCodeAt(u+2)===34){d+=t.slice(l,u),f.push(d);const S=qe(i,R.BLOCK_STRING,n,u+3,mD(f).join(`
`));return i.line+=f.length-1,i.lineStart=o,S}if(m===92&&t.charCodeAt(u+1)===34&&t.charCodeAt(u+2)===34&&t.charCodeAt(u+3)===34){d+=t.slice(l,u),l=u+1,u+=4;continue}if(m===10||m===13){d+=t.slice(l,u),f.push(d),m===13&&t.charCodeAt(u+1)===10?u+=2:++u,d="",l=u,o=u;continue}if(wi(m))++u;else if(vs(t,u))u+=2;else throw Ye(i.source,u,`Invalid character within String: ${li(i,u)}.`)}throw Ye(i.source,u,"Unterminated string.")}function RD(i,n){const t=i.source.body,s=t.length;let o=n+1;for(;o<s;){const u=t.charCodeAt(o);if(up(u))++o;else break}return qe(i,R.NAME,n,o,t.slice(n,o))}const bD=10,pp=2;function z(i){return Is(i,[])}function Is(i,n){switch(typeof i){case"string":return JSON.stringify(i);case"function":return i.name?`[function ${i.name}]`:"[function]";case"object":return kD(i,n);default:return String(i)}}function kD(i,n){if(i===null)return"null";if(n.includes(i))return"[Circular]";const t=[...n,i];if(wD(i)){const s=i.toJSON();if(s!==i)return typeof s=="string"?s:Is(s,t)}else if(Array.isArray(i))return xD(i,t);return ND(i,t)}function wD(i){return typeof i.toJSON=="function"}function ND(i,n){const t=Object.entries(i);return t.length===0?"{}":n.length>pp?"["+OD(i)+"]":"{ "+t.map(([o,u])=>o+": "+Is(u,n)).join(", ")+" }"}function xD(i,n){if(i.length===0)return"[]";if(n.length>pp)return"[Array]";const t=Math.min(bD,i.length),s=i.length-t,o=[];for(let u=0;u<t;++u)o.push(Is(i[u],n));return s===1?o.push("... 1 more item"):s>1&&o.push(`... ${s} more items`),"["+o.join(", ")+"]"}function OD(i){const n=Object.prototype.toString.call(i).replace(/^\[object /,"").replace(/]$/,"");if(n==="Object"&&typeof i.constructor=="function"){const t=i.constructor.name;if(typeof t=="string"&&t!=="")return t}return n}const gt=globalThis.process?function(n,t){return n instanceof t}:function(n,t){if(n instanceof t)return!0;if(typeof n=="object"&&n!==null){var s;const o=t.prototype[Symbol.toStringTag],u=Symbol.toStringTag in n?n[Symbol.toStringTag]:(s=n.constructor)===null||s===void 0?void 0:s.name;if(o===u){const l=z(n);throw new Error(`Cannot use ${o} "${l}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class dp{constructor(n,t="GraphQL request",s={line:1,column:1}){typeof n=="string"||de(!1,`Body must be a string. Received: ${z(n)}.`),this.body=n,this.name=t,this.locationOffset=s,this.locationOffset.line>0||de(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||de(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function LD(i){return gt(i,dp)}function PD(i,n){return new fp(i,n).parseDocument()}function MD(i,n){const t=new fp(i,n);t.expectToken(R.SOF);const s=t.parseValueLiteral(!1);return t.expectToken(R.EOF),s}class fp{constructor(n,t={}){const s=LD(n)?n:new dp(n);this._lexer=new DD(s),this._options=t,this._tokenCounter=0}parseName(){const n=this.expectToken(R.NAME);return this.node(n,{kind:_.NAME,value:n.value})}parseDocument(){return this.node(this._lexer.token,{kind:_.DOCUMENT,definitions:this.many(R.SOF,this.parseDefinition,R.EOF)})}parseDefinition(){if(this.peek(R.BRACE_L))return this.parseOperationDefinition();const n=this.peekDescription(),t=n?this._lexer.lookahead():this._lexer.token;if(t.kind===R.NAME){switch(t.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(n)throw Ye(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(t.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(t)}parseOperationDefinition(){const n=this._lexer.token;if(this.peek(R.BRACE_L))return this.node(n,{kind:_.OPERATION_DEFINITION,operation:Ln.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const t=this.parseOperationType();let s;return this.peek(R.NAME)&&(s=this.parseName()),this.node(n,{kind:_.OPERATION_DEFINITION,operation:t,name:s,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const n=this.expectToken(R.NAME);switch(n.value){case"query":return Ln.QUERY;case"mutation":return Ln.MUTATION;case"subscription":return Ln.SUBSCRIPTION}throw this.unexpected(n)}parseVariableDefinitions(){return this.optionalMany(R.PAREN_L,this.parseVariableDefinition,R.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:_.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(R.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(R.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const n=this._lexer.token;return this.expectToken(R.DOLLAR),this.node(n,{kind:_.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:_.SELECTION_SET,selections:this.many(R.BRACE_L,this.parseSelection,R.BRACE_R)})}parseSelection(){return this.peek(R.SPREAD)?this.parseFragment():this.parseField()}parseField(){const n=this._lexer.token,t=this.parseName();let s,o;return this.expectOptionalToken(R.COLON)?(s=t,o=this.parseName()):o=t,this.node(n,{kind:_.FIELD,alias:s,name:o,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(R.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(n){const t=n?this.parseConstArgument:this.parseArgument;return this.optionalMany(R.PAREN_L,t,R.PAREN_R)}parseArgument(n=!1){const t=this._lexer.token,s=this.parseName();return this.expectToken(R.COLON),this.node(t,{kind:_.ARGUMENT,name:s,value:this.parseValueLiteral(n)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const n=this._lexer.token;this.expectToken(R.SPREAD);const t=this.expectOptionalKeyword("on");return!t&&this.peek(R.NAME)?this.node(n,{kind:_.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(n,{kind:_.INLINE_FRAGMENT,typeCondition:t?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const n=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(n,{kind:_.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(n,{kind:_.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(n){const t=this._lexer.token;switch(t.kind){case R.BRACKET_L:return this.parseList(n);case R.BRACE_L:return this.parseObject(n);case R.INT:return this.advanceLexer(),this.node(t,{kind:_.INT,value:t.value});case R.FLOAT:return this.advanceLexer(),this.node(t,{kind:_.FLOAT,value:t.value});case R.STRING:case R.BLOCK_STRING:return this.parseStringLiteral();case R.NAME:switch(this.advanceLexer(),t.value){case"true":return this.node(t,{kind:_.BOOLEAN,value:!0});case"false":return this.node(t,{kind:_.BOOLEAN,value:!1});case"null":return this.node(t,{kind:_.NULL});default:return this.node(t,{kind:_.ENUM,value:t.value})}case R.DOLLAR:if(n)if(this.expectToken(R.DOLLAR),this._lexer.token.kind===R.NAME){const s=this._lexer.token.value;throw Ye(this._lexer.source,t.start,`Unexpected variable "$${s}" in constant value.`)}else throw this.unexpected(t);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const n=this._lexer.token;return this.advanceLexer(),this.node(n,{kind:_.STRING,value:n.value,block:n.kind===R.BLOCK_STRING})}parseList(n){const t=()=>this.parseValueLiteral(n);return this.node(this._lexer.token,{kind:_.LIST,values:this.any(R.BRACKET_L,t,R.BRACKET_R)})}parseObject(n){const t=()=>this.parseObjectField(n);return this.node(this._lexer.token,{kind:_.OBJECT,fields:this.any(R.BRACE_L,t,R.BRACE_R)})}parseObjectField(n){const t=this._lexer.token,s=this.parseName();return this.expectToken(R.COLON),this.node(t,{kind:_.OBJECT_FIELD,name:s,value:this.parseValueLiteral(n)})}parseDirectives(n){const t=[];for(;this.peek(R.AT);)t.push(this.parseDirective(n));return t}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(n){const t=this._lexer.token;return this.expectToken(R.AT),this.node(t,{kind:_.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(n)})}parseTypeReference(){const n=this._lexer.token;let t;if(this.expectOptionalToken(R.BRACKET_L)){const s=this.parseTypeReference();this.expectToken(R.BRACKET_R),t=this.node(n,{kind:_.LIST_TYPE,type:s})}else t=this.parseNamedType();return this.expectOptionalToken(R.BANG)?this.node(n,{kind:_.NON_NULL_TYPE,type:t}):t}parseNamedType(){return this.node(this._lexer.token,{kind:_.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(R.STRING)||this.peek(R.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("schema");const s=this.parseConstDirectives(),o=this.many(R.BRACE_L,this.parseOperationTypeDefinition,R.BRACE_R);return this.node(n,{kind:_.SCHEMA_DEFINITION,description:t,directives:s,operationTypes:o})}parseOperationTypeDefinition(){const n=this._lexer.token,t=this.parseOperationType();this.expectToken(R.COLON);const s=this.parseNamedType();return this.node(n,{kind:_.OPERATION_TYPE_DEFINITION,operation:t,type:s})}parseScalarTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("scalar");const s=this.parseName(),o=this.parseConstDirectives();return this.node(n,{kind:_.SCALAR_TYPE_DEFINITION,description:t,name:s,directives:o})}parseObjectTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("type");const s=this.parseName(),o=this.parseImplementsInterfaces(),u=this.parseConstDirectives(),l=this.parseFieldsDefinition();return this.node(n,{kind:_.OBJECT_TYPE_DEFINITION,description:t,name:s,interfaces:o,directives:u,fields:l})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(R.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(R.BRACE_L,this.parseFieldDefinition,R.BRACE_R)}parseFieldDefinition(){const n=this._lexer.token,t=this.parseDescription(),s=this.parseName(),o=this.parseArgumentDefs();this.expectToken(R.COLON);const u=this.parseTypeReference(),l=this.parseConstDirectives();return this.node(n,{kind:_.FIELD_DEFINITION,description:t,name:s,arguments:o,type:u,directives:l})}parseArgumentDefs(){return this.optionalMany(R.PAREN_L,this.parseInputValueDef,R.PAREN_R)}parseInputValueDef(){const n=this._lexer.token,t=this.parseDescription(),s=this.parseName();this.expectToken(R.COLON);const o=this.parseTypeReference();let u;this.expectOptionalToken(R.EQUALS)&&(u=this.parseConstValueLiteral());const l=this.parseConstDirectives();return this.node(n,{kind:_.INPUT_VALUE_DEFINITION,description:t,name:s,type:o,defaultValue:u,directives:l})}parseInterfaceTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("interface");const s=this.parseName(),o=this.parseImplementsInterfaces(),u=this.parseConstDirectives(),l=this.parseFieldsDefinition();return this.node(n,{kind:_.INTERFACE_TYPE_DEFINITION,description:t,name:s,interfaces:o,directives:u,fields:l})}parseUnionTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("union");const s=this.parseName(),o=this.parseConstDirectives(),u=this.parseUnionMemberTypes();return this.node(n,{kind:_.UNION_TYPE_DEFINITION,description:t,name:s,directives:o,types:u})}parseUnionMemberTypes(){return this.expectOptionalToken(R.EQUALS)?this.delimitedMany(R.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("enum");const s=this.parseName(),o=this.parseConstDirectives(),u=this.parseEnumValuesDefinition();return this.node(n,{kind:_.ENUM_TYPE_DEFINITION,description:t,name:s,directives:o,values:u})}parseEnumValuesDefinition(){return this.optionalMany(R.BRACE_L,this.parseEnumValueDefinition,R.BRACE_R)}parseEnumValueDefinition(){const n=this._lexer.token,t=this.parseDescription(),s=this.parseEnumValueName(),o=this.parseConstDirectives();return this.node(n,{kind:_.ENUM_VALUE_DEFINITION,description:t,name:s,directives:o})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw Ye(this._lexer.source,this._lexer.token.start,`${us(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("input");const s=this.parseName(),o=this.parseConstDirectives(),u=this.parseInputFieldsDefinition();return this.node(n,{kind:_.INPUT_OBJECT_TYPE_DEFINITION,description:t,name:s,directives:o,fields:u})}parseInputFieldsDefinition(){return this.optionalMany(R.BRACE_L,this.parseInputValueDef,R.BRACE_R)}parseTypeSystemExtension(){const n=this._lexer.lookahead();if(n.kind===R.NAME)switch(n.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(n)}parseSchemaExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const t=this.parseConstDirectives(),s=this.optionalMany(R.BRACE_L,this.parseOperationTypeDefinition,R.BRACE_R);if(t.length===0&&s.length===0)throw this.unexpected();return this.node(n,{kind:_.SCHEMA_EXTENSION,directives:t,operationTypes:s})}parseScalarTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const t=this.parseName(),s=this.parseConstDirectives();if(s.length===0)throw this.unexpected();return this.node(n,{kind:_.SCALAR_TYPE_EXTENSION,name:t,directives:s})}parseObjectTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const t=this.parseName(),s=this.parseImplementsInterfaces(),o=this.parseConstDirectives(),u=this.parseFieldsDefinition();if(s.length===0&&o.length===0&&u.length===0)throw this.unexpected();return this.node(n,{kind:_.OBJECT_TYPE_EXTENSION,name:t,interfaces:s,directives:o,fields:u})}parseInterfaceTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const t=this.parseName(),s=this.parseImplementsInterfaces(),o=this.parseConstDirectives(),u=this.parseFieldsDefinition();if(s.length===0&&o.length===0&&u.length===0)throw this.unexpected();return this.node(n,{kind:_.INTERFACE_TYPE_EXTENSION,name:t,interfaces:s,directives:o,fields:u})}parseUnionTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const t=this.parseName(),s=this.parseConstDirectives(),o=this.parseUnionMemberTypes();if(s.length===0&&o.length===0)throw this.unexpected();return this.node(n,{kind:_.UNION_TYPE_EXTENSION,name:t,directives:s,types:o})}parseEnumTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const t=this.parseName(),s=this.parseConstDirectives(),o=this.parseEnumValuesDefinition();if(s.length===0&&o.length===0)throw this.unexpected();return this.node(n,{kind:_.ENUM_TYPE_EXTENSION,name:t,directives:s,values:o})}parseInputObjectTypeExtension(){const n=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const t=this.parseName(),s=this.parseConstDirectives(),o=this.parseInputFieldsDefinition();if(s.length===0&&o.length===0)throw this.unexpected();return this.node(n,{kind:_.INPUT_OBJECT_TYPE_EXTENSION,name:t,directives:s,fields:o})}parseDirectiveDefinition(){const n=this._lexer.token,t=this.parseDescription();this.expectKeyword("directive"),this.expectToken(R.AT);const s=this.parseName(),o=this.parseArgumentDefs(),u=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const l=this.parseDirectiveLocations();return this.node(n,{kind:_.DIRECTIVE_DEFINITION,description:t,name:s,arguments:o,repeatable:u,locations:l})}parseDirectiveLocations(){return this.delimitedMany(R.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const n=this._lexer.token,t=this.parseName();if(Object.prototype.hasOwnProperty.call(Q,t.value))return t;throw this.unexpected(n)}node(n,t){return this._options.noLocation!==!0&&(t.loc=new hD(n,this._lexer.lastToken,this._lexer.source)),t}peek(n){return this._lexer.token.kind===n}expectToken(n){const t=this._lexer.token;if(t.kind===n)return this.advanceLexer(),t;throw Ye(this._lexer.source,t.start,`Expected ${gp(n)}, found ${us(t)}.`)}expectOptionalToken(n){return this._lexer.token.kind===n?(this.advanceLexer(),!0):!1}expectKeyword(n){const t=this._lexer.token;if(t.kind===R.NAME&&t.value===n)this.advanceLexer();else throw Ye(this._lexer.source,t.start,`Expected "${n}", found ${us(t)}.`)}expectOptionalKeyword(n){const t=this._lexer.token;return t.kind===R.NAME&&t.value===n?(this.advanceLexer(),!0):!1}unexpected(n){const t=n??this._lexer.token;return Ye(this._lexer.source,t.start,`Unexpected ${us(t)}.`)}any(n,t,s){this.expectToken(n);const o=[];for(;!this.expectOptionalToken(s);)o.push(t.call(this));return o}optionalMany(n,t,s){if(this.expectOptionalToken(n)){const o=[];do o.push(t.call(this));while(!this.expectOptionalToken(s));return o}return[]}many(n,t,s){this.expectToken(n);const o=[];do o.push(t.call(this));while(!this.expectOptionalToken(s));return o}delimitedMany(n,t){this.expectOptionalToken(n);const s=[];do s.push(t.call(this));while(this.expectOptionalToken(n));return s}advanceLexer(){const{maxTokens:n}=this._options,t=this._lexer.advance();if(n!==void 0&&t.kind!==R.EOF&&(++this._tokenCounter,this._tokenCounter>n))throw Ye(this._lexer.source,t.start,`Document contains more that ${n} tokens. Parsing aborted.`)}}function us(i){const n=i.value;return gp(i.kind)+(n!=null?` "${n}"`:"")}function gp(i){return ED(i)?`"${i}"`:i}const $D=5;function Cs(i,n){const[t,s]=n?[i,n]:[void 0,i];let o=" Did you mean ";t&&(o+=t+" ");const u=s.map(f=>`"${f}"`);switch(u.length){case 0:return"";case 1:return o+u[0]+"?";case 2:return o+u[0]+" or "+u[1]+"?"}const l=u.slice(0,$D),d=l.pop();return o+l.join(", ")+", or "+d+"?"}function xc(i){return i}function bi(i,n){const t=Object.create(null);for(const s of i)t[n(s)]=s;return t}function ai(i,n,t){const s=Object.create(null);for(const o of i)s[n(o)]=t(o);return s}function Ct(i,n){const t=Object.create(null);for(const s of Object.keys(i))t[s]=n(i[s],s);return t}function VD(i,n){let t=0,s=0;for(;t<i.length&&s<n.length;){let o=i.charCodeAt(t),u=n.charCodeAt(s);if(ls(o)&&ls(u)){let l=0;do++t,l=l*10+o-ga,o=i.charCodeAt(t);while(ls(o)&&l>0);let d=0;do++s,d=d*10+u-ga,u=n.charCodeAt(s);while(ls(u)&&d>0);if(l<d)return-1;if(l>d)return 1}else{if(o<u)return-1;if(o>u)return 1;++t,++s}}return i.length-n.length}const ga=48,GD=57;function ls(i){return!isNaN(i)&&ga<=i&&i<=GD}function Bs(i,n){const t=Object.create(null),s=new qD(i),o=Math.floor(i.length*.4)+1;for(const u of n){const l=s.measure(u,o);l!==void 0&&(t[u]=l)}return Object.keys(t).sort((u,l)=>{const d=t[u]-t[l];return d!==0?d:VD(u,l)})}class qD{constructor(n){this._input=n,this._inputLowerCase=n.toLowerCase(),this._inputArray=Oc(this._inputLowerCase),this._rows=[new Array(n.length+1).fill(0),new Array(n.length+1).fill(0),new Array(n.length+1).fill(0)]}measure(n,t){if(this._input===n)return 0;const s=n.toLowerCase();if(this._inputLowerCase===s)return 1;let o=Oc(s),u=this._inputArray;if(o.length<u.length){const S=o;o=u,u=S}const l=o.length,d=u.length;if(l-d>t)return;const f=this._rows;for(let S=0;S<=d;S++)f[0][S]=S;for(let S=1;S<=l;S++){const E=f[(S-1)%3],B=f[S%3];let k=B[0]=S;for(let N=1;N<=d;N++){const x=o[S-1]===u[N-1]?0:1;let X=Math.min(E[N]+1,B[N-1]+1,E[N-1]+x);if(S>1&&N>1&&o[S-1]===u[N-2]&&o[S-2]===u[N-1]){const ge=f[(S-2)%3][N-2];X=Math.min(X,ge+1)}X<k&&(k=X),B[N]=X}if(k>t)return}const m=f[l%3][d];return m<=t?m:void 0}}function Oc(i){const n=i.length,t=new Array(n);for(let s=0;s<n;++s)t[s]=i.charCodeAt(s);return t}function Mn(i){if(i==null)return Object.create(null);if(Object.getPrototypeOf(i)===null)return i;const n=Object.create(null);for(const[t,s]of Object.entries(i))n[t]=s;return n}function jD(i){return`"${i.replace(WD,zD)}"`}const WD=/[\x00-\x1f\x22\x5c\x7f-\x9f]/g;function zD(i){return QD[i.charCodeAt(0)]}const QD=["\\u0000","\\u0001","\\u0002","\\u0003","\\u0004","\\u0005","\\u0006","\\u0007","\\b","\\t","\\n","\\u000B","\\f","\\r","\\u000E","\\u000F","\\u0010","\\u0011","\\u0012","\\u0013","\\u0014","\\u0015","\\u0016","\\u0017","\\u0018","\\u0019","\\u001A","\\u001B","\\u001C","\\u001D","\\u001E","\\u001F","","",'\\"',"","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","\\\\","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","\\u007F","\\u0080","\\u0081","\\u0082","\\u0083","\\u0084","\\u0085","\\u0086","\\u0087","\\u0088","\\u0089","\\u008A","\\u008B","\\u008C","\\u008D","\\u008E","\\u008F","\\u0090","\\u0091","\\u0092","\\u0093","\\u0094","\\u0095","\\u0096","\\u0097","\\u0098","\\u0099","\\u009A","\\u009B","\\u009C","\\u009D","\\u009E","\\u009F"],rr=Object.freeze({});function hp(i,n,t=op){const s=new Map;for(const ge of Object.values(_))s.set(ge,yp(n,ge));let o,u=Array.isArray(i),l=[i],d=-1,f=[],m=i,S,E;const B=[],k=[];do{d++;const ge=d===l.length,Ge=ge&&f.length!==0;if(ge){if(S=k.length===0?void 0:B[B.length-1],m=E,E=k.pop(),Ge)if(u){m=m.slice();let Re=0;for(const[Ne,rn]of f){const Ze=Ne-Re;rn===null?(m.splice(Ze,1),Re++):m[Ze]=rn}}else{m=Object.defineProperties({},Object.getOwnPropertyDescriptors(m));for(const[Re,Ne]of f)m[Re]=Ne}d=o.index,l=o.keys,f=o.edits,u=o.inArray,o=o.prev}else if(E){if(S=u?d:l[d],m=E[S],m==null)continue;B.push(S)}let Ie;if(!Array.isArray(m)){var N,x;wc(m)||de(!1,`Invalid AST Node: ${z(m)}.`);const Re=ge?(N=s.get(m.kind))===null||N===void 0?void 0:N.leave:(x=s.get(m.kind))===null||x===void 0?void 0:x.enter;if(Ie=Re==null?void 0:Re.call(n,m,S,E,B,k),Ie===rr)break;if(Ie===!1){if(!ge){B.pop();continue}}else if(Ie!==void 0&&(f.push([S,Ie]),!ge))if(wc(Ie))m=Ie;else{B.pop();continue}}if(Ie===void 0&&Ge&&f.push([S,m]),ge)B.pop();else{var X;o={inArray:u,index:d,keys:l,edits:f,prev:o},u=Array.isArray(m),l=u?m:(X=t[m.kind])!==null&&X!==void 0?X:[],d=-1,f=[],E&&k.push(E),E=m}}while(o!==void 0);return f.length!==0?f[f.length-1][1]:i}function YD(i){const n=new Array(i.length).fill(null),t=Object.create(null);for(const s of Object.values(_)){let o=!1;const u=new Array(i.length).fill(void 0),l=new Array(i.length).fill(void 0);for(let f=0;f<i.length;++f){const{enter:m,leave:S}=yp(i[f],s);o||(o=m!=null||S!=null),u[f]=m,l[f]=S}if(!o)continue;const d={enter(...f){const m=f[0];for(let E=0;E<i.length;E++)if(n[E]===null){var S;const B=(S=u[E])===null||S===void 0?void 0:S.apply(i[E],f);if(B===!1)n[E]=m;else if(B===rr)n[E]=rr;else if(B!==void 0)return B}},leave(...f){const m=f[0];for(let E=0;E<i.length;E++)if(n[E]===null){var S;const B=(S=l[E])===null||S===void 0?void 0:S.apply(i[E],f);if(B===rr)n[E]=rr;else if(B!==void 0&&B!==!1)return B}else n[E]===m&&(n[E]=null)}};t[s]=d}return t}function yp(i,n){const t=i[n];return typeof t=="object"?t:typeof t=="function"?{enter:t,leave:void 0}:{enter:i.enter,leave:i.leave}}function dt(i){return hp(i,JD)}const HD=80,JD={Name:{leave:i=>i.value},Variable:{leave:i=>"$"+i.name},Document:{leave:i=>G(i.definitions,`

`)},OperationDefinition:{leave(i){const n=ce("(",G(i.variableDefinitions,", "),")"),t=G([i.operation,G([i.name,n]),G(i.directives," ")]," ");return(t==="query"?"":t+" ")+i.selectionSet}},VariableDefinition:{leave:({variable:i,type:n,defaultValue:t,directives:s})=>i+": "+n+ce(" = ",t)+ce(" ",G(s," "))},SelectionSet:{leave:({selections:i})=>Qn(i)},Field:{leave({alias:i,name:n,arguments:t,directives:s,selectionSet:o}){const u=ce("",i,": ")+n;let l=u+ce("(",G(t,", "),")");return l.length>HD&&(l=u+ce(`(
`,ds(G(t,`
`)),`
)`)),G([l,G(s," "),o]," ")}},Argument:{leave:({name:i,value:n})=>i+": "+n},FragmentSpread:{leave:({name:i,directives:n})=>"..."+i+ce(" ",G(n," "))},InlineFragment:{leave:({typeCondition:i,directives:n,selectionSet:t})=>G(["...",ce("on ",i),G(n," "),t]," ")},FragmentDefinition:{leave:({name:i,typeCondition:n,variableDefinitions:t,directives:s,selectionSet:o})=>`fragment ${i}${ce("(",G(t,", "),")")} on ${n} ${ce("",G(s," ")," ")}`+o},IntValue:{leave:({value:i})=>i},FloatValue:{leave:({value:i})=>i},StringValue:{leave:({value:i,block:n})=>n?TD(i):jD(i)},BooleanValue:{leave:({value:i})=>i?"true":"false"},NullValue:{leave:()=>"null"},EnumValue:{leave:({value:i})=>i},ListValue:{leave:({values:i})=>"["+G(i,", ")+"]"},ObjectValue:{leave:({fields:i})=>"{"+G(i,", ")+"}"},ObjectField:{leave:({name:i,value:n})=>i+": "+n},Directive:{leave:({name:i,arguments:n})=>"@"+i+ce("(",G(n,", "),")")},NamedType:{leave:({name:i})=>i},ListType:{leave:({type:i})=>"["+i+"]"},NonNullType:{leave:({type:i})=>i+"!"},SchemaDefinition:{leave:({description:i,directives:n,operationTypes:t})=>ce("",i,`
`)+G(["schema",G(n," "),Qn(t)]," ")},OperationTypeDefinition:{leave:({operation:i,type:n})=>i+": "+n},ScalarTypeDefinition:{leave:({description:i,name:n,directives:t})=>ce("",i,`
`)+G(["scalar",n,G(t," ")]," ")},ObjectTypeDefinition:{leave:({description:i,name:n,interfaces:t,directives:s,fields:o})=>ce("",i,`
`)+G(["type",n,ce("implements ",G(t," & ")),G(s," "),Qn(o)]," ")},FieldDefinition:{leave:({description:i,name:n,arguments:t,type:s,directives:o})=>ce("",i,`
`)+n+(Lc(t)?ce(`(
`,ds(G(t,`
`)),`
)`):ce("(",G(t,", "),")"))+": "+s+ce(" ",G(o," "))},InputValueDefinition:{leave:({description:i,name:n,type:t,defaultValue:s,directives:o})=>ce("",i,`
`)+G([n+": "+t,ce("= ",s),G(o," ")]," ")},InterfaceTypeDefinition:{leave:({description:i,name:n,interfaces:t,directives:s,fields:o})=>ce("",i,`
`)+G(["interface",n,ce("implements ",G(t," & ")),G(s," "),Qn(o)]," ")},UnionTypeDefinition:{leave:({description:i,name:n,directives:t,types:s})=>ce("",i,`
`)+G(["union",n,G(t," "),ce("= ",G(s," | "))]," ")},EnumTypeDefinition:{leave:({description:i,name:n,directives:t,values:s})=>ce("",i,`
`)+G(["enum",n,G(t," "),Qn(s)]," ")},EnumValueDefinition:{leave:({description:i,name:n,directives:t})=>ce("",i,`
`)+G([n,G(t," ")]," ")},InputObjectTypeDefinition:{leave:({description:i,name:n,directives:t,fields:s})=>ce("",i,`
`)+G(["input",n,G(t," "),Qn(s)]," ")},DirectiveDefinition:{leave:({description:i,name:n,arguments:t,repeatable:s,locations:o})=>ce("",i,`
`)+"directive @"+n+(Lc(t)?ce(`(
`,ds(G(t,`
`)),`
)`):ce("(",G(t,", "),")"))+(s?" repeatable":"")+" on "+G(o," | ")},SchemaExtension:{leave:({directives:i,operationTypes:n})=>G(["extend schema",G(i," "),Qn(n)]," ")},ScalarTypeExtension:{leave:({name:i,directives:n})=>G(["extend scalar",i,G(n," ")]," ")},ObjectTypeExtension:{leave:({name:i,interfaces:n,directives:t,fields:s})=>G(["extend type",i,ce("implements ",G(n," & ")),G(t," "),Qn(s)]," ")},InterfaceTypeExtension:{leave:({name:i,interfaces:n,directives:t,fields:s})=>G(["extend interface",i,ce("implements ",G(n," & ")),G(t," "),Qn(s)]," ")},UnionTypeExtension:{leave:({name:i,directives:n,types:t})=>G(["extend union",i,G(n," "),ce("= ",G(t," | "))]," ")},EnumTypeExtension:{leave:({name:i,directives:n,values:t})=>G(["extend enum",i,G(n," "),Qn(t)]," ")},InputObjectTypeExtension:{leave:({name:i,directives:n,fields:t})=>G(["extend input",i,G(n," "),Qn(t)]," ")}};function G(i,n=""){var t;return(t=i==null?void 0:i.filter(s=>s).join(n))!==null&&t!==void 0?t:""}function Qn(i){return ce(`{
`,ds(G(i,`
`)),`
}`)}function ce(i,n,t=""){return n!=null&&n!==""?i+n+t:""}function ds(i){return ce("  ",i.replace(/\n/g,`
  `))}function Lc(i){var n;return(n=i==null?void 0:i.some(t=>t.includes(`
`)))!==null&&n!==void 0?n:!1}function ha(i,n){switch(i.kind){case _.NULL:return null;case _.INT:return parseInt(i.value,10);case _.FLOAT:return parseFloat(i.value);case _.STRING:case _.ENUM:case _.BOOLEAN:return i.value;case _.LIST:return i.values.map(t=>ha(t,n));case _.OBJECT:return ai(i.fields,t=>t.name.value,t=>ha(t.value,n));case _.VARIABLE:return n==null?void 0:n[i.name.value]}}function st(i){if(i!=null||de(!1,"Must provide name."),typeof i=="string"||de(!1,"Expected name to be a string."),i.length===0)throw new j("Expected name to be a non-empty string.");for(let n=1;n<i.length;++n)if(!up(i.charCodeAt(n)))throw new j(`Names must only contain [_a-zA-Z0-9] but "${i}" does not.`);if(!Ba(i.charCodeAt(0)))throw new j(`Names must start with [_a-zA-Z] but "${i}" does not.`);return i}function XD(i){if(i==="true"||i==="false"||i==="null")throw new j(`Enum values cannot be named: ${i}`);return st(i)}function Fa(i){return Ht(i)||Sn(i)||cn(i)||Zn(i)||Kn(i)||et(i)||di(i)||ln(i)}function Ht(i){return gt(i,kt)}function Sn(i){return gt(i,ft)}function ZD(i){if(!Sn(i))throw new Error(`Expected ${z(i)} to be a GraphQL Object type.`);return i}function cn(i){return gt(i,Ss)}function KD(i){if(!cn(i))throw new Error(`Expected ${z(i)} to be a GraphQL Interface type.`);return i}function Zn(i){return gt(i,Ts)}function Kn(i){return gt(i,ki)}function et(i){return gt(i,Ds)}function di(i){return gt(i,mn)}function ln(i){return gt(i,ae)}function mp(i){return Ht(i)||Kn(i)||et(i)||Ua(i)&&mp(i.ofType)}function Sp(i){return Ht(i)||Sn(i)||cn(i)||Zn(i)||Kn(i)||Ua(i)&&Sp(i.ofType)}function Tp(i){return Ht(i)||Kn(i)}function eE(i){return cn(i)||Zn(i)}class mn{constructor(n){Fa(n)||de(!1,`Expected ${z(n)} to be a GraphQL type.`),this.ofType=n}get[Symbol.toStringTag](){return"GraphQLList"}toString(){return"["+String(this.ofType)+"]"}toJSON(){return this.toString()}}class ae{constructor(n){Dp(n)||de(!1,`Expected ${z(n)} to be a GraphQL nullable type.`),this.ofType=n}get[Symbol.toStringTag](){return"GraphQLNonNull"}toString(){return String(this.ofType)+"!"}toJSON(){return this.toString()}}function Ua(i){return di(i)||ln(i)}function Dp(i){return Fa(i)&&!ln(i)}function nE(i){if(!Dp(i))throw new Error(`Expected ${z(i)} to be a GraphQL nullable type.`);return i}function RA(i){return Ht(i)||Sn(i)||cn(i)||Zn(i)||Kn(i)||et(i)}function tE(i){if(i){let n=i;for(;Ua(n);)n=n.ofType;return n}}function Ep(i){return typeof i=="function"?i():i}function Ap(i){return typeof i=="function"?i():i}class kt{constructor(n){var t,s,o,u;const l=(t=n.parseValue)!==null&&t!==void 0?t:xc;this.name=st(n.name),this.description=n.description,this.specifiedByURL=n.specifiedByURL,this.serialize=(s=n.serialize)!==null&&s!==void 0?s:xc,this.parseValue=l,this.parseLiteral=(o=n.parseLiteral)!==null&&o!==void 0?o:(d,f)=>l(ha(d,f)),this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(u=n.extensionASTNodes)!==null&&u!==void 0?u:[],n.specifiedByURL==null||typeof n.specifiedByURL=="string"||de(!1,`${this.name} must provide "specifiedByURL" as a string, but got: ${z(n.specifiedByURL)}.`),n.serialize==null||typeof n.serialize=="function"||de(!1,`${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`),n.parseLiteral&&(typeof n.parseValue=="function"&&typeof n.parseLiteral=="function"||de(!1,`${this.name} must provide both "parseValue" and "parseLiteral" functions.`))}get[Symbol.toStringTag](){return"GraphQLScalarType"}toConfig(){return{name:this.name,description:this.description,specifiedByURL:this.specifiedByURL,serialize:this.serialize,parseValue:this.parseValue,parseLiteral:this.parseLiteral,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}class ft{constructor(n){var t;this.name=st(n.name),this.description=n.description,this.isTypeOf=n.isTypeOf,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._fields=()=>vp(n),this._interfaces=()=>_p(n),n.isTypeOf==null||typeof n.isTypeOf=="function"||de(!1,`${this.name} must provide "isTypeOf" as a function, but got: ${z(n.isTypeOf)}.`)}get[Symbol.toStringTag](){return"GraphQLObjectType"}getFields(){return typeof this._fields=="function"&&(this._fields=this._fields()),this._fields}getInterfaces(){return typeof this._interfaces=="function"&&(this._interfaces=this._interfaces()),this._interfaces}toConfig(){return{name:this.name,description:this.description,interfaces:this.getInterfaces(),fields:Cp(this.getFields()),isTypeOf:this.isTypeOf,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}function _p(i){var n;const t=Ep((n=i.interfaces)!==null&&n!==void 0?n:[]);return Array.isArray(t)||de(!1,`${i.name} interfaces must be an Array or a function which returns an Array.`),t}function vp(i){const n=Ap(i.fields);return Ri(n)||de(!1,`${i.name} fields must be an object with field names as keys or a function which returns such an object.`),Ct(n,(t,s)=>{var o;Ri(t)||de(!1,`${i.name}.${s} field config must be an object.`),t.resolve==null||typeof t.resolve=="function"||de(!1,`${i.name}.${s} field resolver must be a function if provided, but got: ${z(t.resolve)}.`);const u=(o=t.args)!==null&&o!==void 0?o:{};return Ri(u)||de(!1,`${i.name}.${s} args must be an object with argument names as keys.`),{name:st(s),description:t.description,type:t.type,args:Ip(u),resolve:t.resolve,subscribe:t.subscribe,deprecationReason:t.deprecationReason,extensions:Mn(t.extensions),astNode:t.astNode}})}function Ip(i){return Object.entries(i).map(([n,t])=>({name:st(n),description:t.description,type:t.type,defaultValue:t.defaultValue,deprecationReason:t.deprecationReason,extensions:Mn(t.extensions),astNode:t.astNode}))}function Ri(i){return bt(i)&&!Array.isArray(i)}function Cp(i){return Ct(i,n=>({description:n.description,type:n.type,args:Bp(n.args),resolve:n.resolve,subscribe:n.subscribe,deprecationReason:n.deprecationReason,extensions:n.extensions,astNode:n.astNode}))}function Bp(i){return ai(i,n=>n.name,n=>({description:n.description,type:n.type,defaultValue:n.defaultValue,deprecationReason:n.deprecationReason,extensions:n.extensions,astNode:n.astNode}))}function iE(i){return ln(i.type)&&i.defaultValue===void 0}class Ss{constructor(n){var t;this.name=st(n.name),this.description=n.description,this.resolveType=n.resolveType,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._fields=vp.bind(void 0,n),this._interfaces=_p.bind(void 0,n),n.resolveType==null||typeof n.resolveType=="function"||de(!1,`${this.name} must provide "resolveType" as a function, but got: ${z(n.resolveType)}.`)}get[Symbol.toStringTag](){return"GraphQLInterfaceType"}getFields(){return typeof this._fields=="function"&&(this._fields=this._fields()),this._fields}getInterfaces(){return typeof this._interfaces=="function"&&(this._interfaces=this._interfaces()),this._interfaces}toConfig(){return{name:this.name,description:this.description,interfaces:this.getInterfaces(),fields:Cp(this.getFields()),resolveType:this.resolveType,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}class Ts{constructor(n){var t;this.name=st(n.name),this.description=n.description,this.resolveType=n.resolveType,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._types=rE.bind(void 0,n),n.resolveType==null||typeof n.resolveType=="function"||de(!1,`${this.name} must provide "resolveType" as a function, but got: ${z(n.resolveType)}.`)}get[Symbol.toStringTag](){return"GraphQLUnionType"}getTypes(){return typeof this._types=="function"&&(this._types=this._types()),this._types}toConfig(){return{name:this.name,description:this.description,types:this.getTypes(),resolveType:this.resolveType,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}function rE(i){const n=Ep(i.types);return Array.isArray(n)||de(!1,`Must provide Array of types or a function which returns such an array for Union ${i.name}.`),n}class ki{constructor(n){var t;this.name=st(n.name),this.description=n.description,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._values=sE(this.name,n.values),this._valueLookup=new Map(this._values.map(s=>[s.value,s])),this._nameLookup=bi(this._values,s=>s.name)}get[Symbol.toStringTag](){return"GraphQLEnumType"}getValues(){return this._values}getValue(n){return this._nameLookup[n]}serialize(n){const t=this._valueLookup.get(n);if(t===void 0)throw new j(`Enum "${this.name}" cannot represent value: ${z(n)}`);return t.name}parseValue(n){if(typeof n!="string"){const s=z(n);throw new j(`Enum "${this.name}" cannot represent non-string value: ${s}.`+cs(this,s))}const t=this.getValue(n);if(t==null)throw new j(`Value "${n}" does not exist in "${this.name}" enum.`+cs(this,n));return t.value}parseLiteral(n,t){if(n.kind!==_.ENUM){const o=dt(n);throw new j(`Enum "${this.name}" cannot represent non-enum value: ${o}.`+cs(this,o),{nodes:n})}const s=this.getValue(n.value);if(s==null){const o=dt(n);throw new j(`Value "${o}" does not exist in "${this.name}" enum.`+cs(this,o),{nodes:n})}return s.value}toConfig(){const n=ai(this.getValues(),t=>t.name,t=>({description:t.description,value:t.value,deprecationReason:t.deprecationReason,extensions:t.extensions,astNode:t.astNode}));return{name:this.name,description:this.description,values:n,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}function cs(i,n){const t=i.getValues().map(o=>o.name),s=Bs(n,t);return Cs("the enum value",s)}function sE(i,n){return Ri(n)||de(!1,`${i} values must be an object with value names as keys.`),Object.entries(n).map(([t,s])=>(Ri(s)||de(!1,`${i}.${t} must refer to an object with a "value" key representing an internal value but got: ${z(s)}.`),{name:XD(t),description:s.description,value:s.value!==void 0?s.value:t,deprecationReason:s.deprecationReason,extensions:Mn(s.extensions),astNode:s.astNode}))}class Ds{constructor(n){var t;this.name=st(n.name),this.description=n.description,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._fields=oE.bind(void 0,n)}get[Symbol.toStringTag](){return"GraphQLInputObjectType"}getFields(){return typeof this._fields=="function"&&(this._fields=this._fields()),this._fields}toConfig(){const n=Ct(this.getFields(),t=>({description:t.description,type:t.type,defaultValue:t.defaultValue,deprecationReason:t.deprecationReason,extensions:t.extensions,astNode:t.astNode}));return{name:this.name,description:this.description,fields:n,extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes}}toString(){return this.name}toJSON(){return this.toString()}}function oE(i){const n=Ap(i.fields);return Ri(n)||de(!1,`${i.name} fields must be an object with field names as keys or a function which returns such an object.`),Ct(n,(t,s)=>(!("resolve"in t)||de(!1,`${i.name}.${s} field has a resolve property, but Input Types cannot define resolvers.`),{name:st(s),description:t.description,type:t.type,defaultValue:t.defaultValue,deprecationReason:t.deprecationReason,extensions:Mn(t.extensions),astNode:t.astNode}))}const sa=2147483647,oa=-2147483648,aE=new kt({name:"Int",description:"The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",serialize(i){const n=dr(i);if(typeof n=="boolean")return n?1:0;let t=n;if(typeof n=="string"&&n!==""&&(t=Number(n)),typeof t!="number"||!Number.isInteger(t))throw new j(`Int cannot represent non-integer value: ${z(n)}`);if(t>sa||t<oa)throw new j("Int cannot represent non 32-bit signed integer value: "+z(n));return t},parseValue(i){if(typeof i!="number"||!Number.isInteger(i))throw new j(`Int cannot represent non-integer value: ${z(i)}`);if(i>sa||i<oa)throw new j(`Int cannot represent non 32-bit signed integer value: ${i}`);return i},parseLiteral(i){if(i.kind!==_.INT)throw new j(`Int cannot represent non-integer value: ${dt(i)}`,{nodes:i});const n=parseInt(i.value,10);if(n>sa||n<oa)throw new j(`Int cannot represent non 32-bit signed integer value: ${i.value}`,{nodes:i});return n}}),uE=new kt({name:"Float",description:"The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",serialize(i){const n=dr(i);if(typeof n=="boolean")return n?1:0;let t=n;if(typeof n=="string"&&n!==""&&(t=Number(n)),typeof t!="number"||!Number.isFinite(t))throw new j(`Float cannot represent non numeric value: ${z(n)}`);return t},parseValue(i){if(typeof i!="number"||!Number.isFinite(i))throw new j(`Float cannot represent non numeric value: ${z(i)}`);return i},parseLiteral(i){if(i.kind!==_.FLOAT&&i.kind!==_.INT)throw new j(`Float cannot represent non numeric value: ${dt(i)}`,i);return parseFloat(i.value)}}),Ve=new kt({name:"String",description:"The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",serialize(i){const n=dr(i);if(typeof n=="string")return n;if(typeof n=="boolean")return n?"true":"false";if(typeof n=="number"&&Number.isFinite(n))return n.toString();throw new j(`String cannot represent value: ${z(i)}`)},parseValue(i){if(typeof i!="string")throw new j(`String cannot represent a non string value: ${z(i)}`);return i},parseLiteral(i){if(i.kind!==_.STRING)throw new j(`String cannot represent a non string value: ${dt(i)}`,{nodes:i});return i.value}}),Pn=new kt({name:"Boolean",description:"The `Boolean` scalar type represents `true` or `false`.",serialize(i){const n=dr(i);if(typeof n=="boolean")return n;if(Number.isFinite(n))return n!==0;throw new j(`Boolean cannot represent a non boolean value: ${z(n)}`)},parseValue(i){if(typeof i!="boolean")throw new j(`Boolean cannot represent a non boolean value: ${z(i)}`);return i},parseLiteral(i){if(i.kind!==_.BOOLEAN)throw new j(`Boolean cannot represent a non boolean value: ${dt(i)}`,{nodes:i});return i.value}}),Fp=new kt({name:"ID",description:'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',serialize(i){const n=dr(i);if(typeof n=="string")return n;if(Number.isInteger(n))return String(n);throw new j(`ID cannot represent value: ${z(i)}`)},parseValue(i){if(typeof i=="string")return i;if(typeof i=="number"&&Number.isInteger(i))return i.toString();throw new j(`ID cannot represent value: ${z(i)}`)},parseLiteral(i){if(i.kind!==_.STRING&&i.kind!==_.INT)throw new j("ID cannot represent a non-string and non-integer value: "+dt(i),{nodes:i});return i.value}}),Fs=Object.freeze([Ve,aE,uE,Pn,Fp]);function lE(i){return Fs.some(({name:n})=>i.name===n)}function dr(i){if(bt(i)){if(typeof i.valueOf=="function"){const n=i.valueOf();if(!bt(n))return n}if(typeof i.toJSON=="function")return i.toJSON()}return i}function cE(i){return gt(i,Yt)}class Yt{constructor(n){var t,s;this.name=st(n.name),this.description=n.description,this.locations=n.locations,this.isRepeatable=(t=n.isRepeatable)!==null&&t!==void 0?t:!1,this.extensions=Mn(n.extensions),this.astNode=n.astNode,Array.isArray(n.locations)||de(!1,`@${n.name} locations must be an Array.`);const o=(s=n.args)!==null&&s!==void 0?s:{};bt(o)&&!Array.isArray(o)||de(!1,`@${n.name} args must be an object with argument names as keys.`),this.args=Ip(o)}get[Symbol.toStringTag](){return"GraphQLDirective"}toConfig(){return{name:this.name,description:this.description,locations:this.locations,args:Bp(this.args),isRepeatable:this.isRepeatable,extensions:this.extensions,astNode:this.astNode}}toString(){return"@"+this.name}toJSON(){return this.toString()}}const pE=new Yt({name:"include",description:"Directs the executor to include this field or fragment only when the `if` argument is true.",locations:[Q.FIELD,Q.FRAGMENT_SPREAD,Q.INLINE_FRAGMENT],args:{if:{type:new ae(Pn),description:"Included when true."}}}),dE=new Yt({name:"skip",description:"Directs the executor to skip this field or fragment when the `if` argument is true.",locations:[Q.FIELD,Q.FRAGMENT_SPREAD,Q.INLINE_FRAGMENT],args:{if:{type:new ae(Pn),description:"Skipped when true."}}}),fE="No longer supported",Up=new Yt({name:"deprecated",description:"Marks an element of a GraphQL schema as no longer supported.",locations:[Q.FIELD_DEFINITION,Q.ARGUMENT_DEFINITION,Q.INPUT_FIELD_DEFINITION,Q.ENUM_VALUE],args:{reason:{type:Ve,description:"Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",defaultValue:fE}}}),Rp=new Yt({name:"specifiedBy",description:"Exposes a URL that specifies the behavior of this scalar.",locations:[Q.SCALAR],args:{url:{type:new ae(Ve),description:"The URL that specifies the behavior of this scalar."}}}),Ni=Object.freeze([pE,dE,Up,Rp]);function gE(i){return typeof i=="object"&&typeof(i==null?void 0:i[Symbol.iterator])=="function"}function sr(i,n){if(ln(n)){const t=sr(i,n.ofType);return(t==null?void 0:t.kind)===_.NULL?null:t}if(i===null)return{kind:_.NULL};if(i===void 0)return null;if(di(n)){const t=n.ofType;if(gE(i)){const s=[];for(const o of i){const u=sr(o,t);u!=null&&s.push(u)}return{kind:_.LIST,values:s}}return sr(i,t)}if(et(n)){if(!bt(i))return null;const t=[];for(const s of Object.values(n.getFields())){const o=sr(i[s.name],s.type);o&&t.push({kind:_.OBJECT_FIELD,name:{kind:_.NAME,value:s.name},value:o})}return{kind:_.OBJECT,fields:t}}if(Tp(n)){const t=n.serialize(i);if(t==null)return null;if(typeof t=="boolean")return{kind:_.BOOLEAN,value:t};if(typeof t=="number"&&Number.isFinite(t)){const s=String(t);return Pc.test(s)?{kind:_.INT,value:s}:{kind:_.FLOAT,value:s}}if(typeof t=="string")return Kn(n)?{kind:_.ENUM,value:t}:n===Fp&&Pc.test(t)?{kind:_.INT,value:t}:{kind:_.STRING,value:t};throw new TypeError(`Cannot convert value to AST: ${z(t)}.`)}Xn(!1,"Unexpected input type: "+z(n))}const Pc=/^-?(?:0|[1-9][0-9]*)$/,Ra=new ft({name:"__Schema",description:"A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",fields:()=>({description:{type:Ve,resolve:i=>i.description},types:{description:"A list of all types supported by this server.",type:new ae(new mn(new ae(Jn))),resolve(i){return Object.values(i.getTypeMap())}},queryType:{description:"The type that query operations will be rooted at.",type:new ae(Jn),resolve:i=>i.getQueryType()},mutationType:{description:"If this server supports mutation, the type that mutation operations will be rooted at.",type:Jn,resolve:i=>i.getMutationType()},subscriptionType:{description:"If this server support subscription, the type that subscription operations will be rooted at.",type:Jn,resolve:i=>i.getSubscriptionType()},directives:{description:"A list of all directives supported by this server.",type:new ae(new mn(new ae(bp))),resolve:i=>i.getDirectives()}})}),bp=new ft({name:"__Directive",description:`A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.`,fields:()=>({name:{type:new ae(Ve),resolve:i=>i.name},description:{type:Ve,resolve:i=>i.description},isRepeatable:{type:new ae(Pn),resolve:i=>i.isRepeatable},locations:{type:new ae(new mn(new ae(kp))),resolve:i=>i.locations},args:{type:new ae(new mn(new ae(Us))),args:{includeDeprecated:{type:Pn,defaultValue:!1}},resolve(i,{includeDeprecated:n}){return n?i.args:i.args.filter(t=>t.deprecationReason==null)}}})}),kp=new ki({name:"__DirectiveLocation",description:"A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",values:{QUERY:{value:Q.QUERY,description:"Location adjacent to a query operation."},MUTATION:{value:Q.MUTATION,description:"Location adjacent to a mutation operation."},SUBSCRIPTION:{value:Q.SUBSCRIPTION,description:"Location adjacent to a subscription operation."},FIELD:{value:Q.FIELD,description:"Location adjacent to a field."},FRAGMENT_DEFINITION:{value:Q.FRAGMENT_DEFINITION,description:"Location adjacent to a fragment definition."},FRAGMENT_SPREAD:{value:Q.FRAGMENT_SPREAD,description:"Location adjacent to a fragment spread."},INLINE_FRAGMENT:{value:Q.INLINE_FRAGMENT,description:"Location adjacent to an inline fragment."},VARIABLE_DEFINITION:{value:Q.VARIABLE_DEFINITION,description:"Location adjacent to a variable definition."},SCHEMA:{value:Q.SCHEMA,description:"Location adjacent to a schema definition."},SCALAR:{value:Q.SCALAR,description:"Location adjacent to a scalar definition."},OBJECT:{value:Q.OBJECT,description:"Location adjacent to an object type definition."},FIELD_DEFINITION:{value:Q.FIELD_DEFINITION,description:"Location adjacent to a field definition."},ARGUMENT_DEFINITION:{value:Q.ARGUMENT_DEFINITION,description:"Location adjacent to an argument definition."},INTERFACE:{value:Q.INTERFACE,description:"Location adjacent to an interface definition."},UNION:{value:Q.UNION,description:"Location adjacent to a union definition."},ENUM:{value:Q.ENUM,description:"Location adjacent to an enum definition."},ENUM_VALUE:{value:Q.ENUM_VALUE,description:"Location adjacent to an enum value definition."},INPUT_OBJECT:{value:Q.INPUT_OBJECT,description:"Location adjacent to an input object type definition."},INPUT_FIELD_DEFINITION:{value:Q.INPUT_FIELD_DEFINITION,description:"Location adjacent to an input object field definition."}}}),Jn=new ft({name:"__Type",description:"The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",fields:()=>({kind:{type:new ae(xp),resolve(i){if(Ht(i))return ve.SCALAR;if(Sn(i))return ve.OBJECT;if(cn(i))return ve.INTERFACE;if(Zn(i))return ve.UNION;if(Kn(i))return ve.ENUM;if(et(i))return ve.INPUT_OBJECT;if(di(i))return ve.LIST;if(ln(i))return ve.NON_NULL;Xn(!1,`Unexpected type: "${z(i)}".`)}},name:{type:Ve,resolve:i=>"name"in i?i.name:void 0},description:{type:Ve,resolve:i=>"description"in i?i.description:void 0},specifiedByURL:{type:Ve,resolve:i=>"specifiedByURL"in i?i.specifiedByURL:void 0},fields:{type:new mn(new ae(wp)),args:{includeDeprecated:{type:Pn,defaultValue:!1}},resolve(i,{includeDeprecated:n}){if(Sn(i)||cn(i)){const t=Object.values(i.getFields());return n?t:t.filter(s=>s.deprecationReason==null)}}},interfaces:{type:new mn(new ae(Jn)),resolve(i){if(Sn(i)||cn(i))return i.getInterfaces()}},possibleTypes:{type:new mn(new ae(Jn)),resolve(i,n,t,{schema:s}){if(eE(i))return s.getPossibleTypes(i)}},enumValues:{type:new mn(new ae(Np)),args:{includeDeprecated:{type:Pn,defaultValue:!1}},resolve(i,{includeDeprecated:n}){if(Kn(i)){const t=i.getValues();return n?t:t.filter(s=>s.deprecationReason==null)}}},inputFields:{type:new mn(new ae(Us)),args:{includeDeprecated:{type:Pn,defaultValue:!1}},resolve(i,{includeDeprecated:n}){if(et(i)){const t=Object.values(i.getFields());return n?t:t.filter(s=>s.deprecationReason==null)}}},ofType:{type:Jn,resolve:i=>"ofType"in i?i.ofType:void 0}})}),wp=new ft({name:"__Field",description:"Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",fields:()=>({name:{type:new ae(Ve),resolve:i=>i.name},description:{type:Ve,resolve:i=>i.description},args:{type:new ae(new mn(new ae(Us))),args:{includeDeprecated:{type:Pn,defaultValue:!1}},resolve(i,{includeDeprecated:n}){return n?i.args:i.args.filter(t=>t.deprecationReason==null)}},type:{type:new ae(Jn),resolve:i=>i.type},isDeprecated:{type:new ae(Pn),resolve:i=>i.deprecationReason!=null},deprecationReason:{type:Ve,resolve:i=>i.deprecationReason}})}),Us=new ft({name:"__InputValue",description:"Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",fields:()=>({name:{type:new ae(Ve),resolve:i=>i.name},description:{type:Ve,resolve:i=>i.description},type:{type:new ae(Jn),resolve:i=>i.type},defaultValue:{type:Ve,description:"A GraphQL-formatted string representing the default value for this input value.",resolve(i){const{type:n,defaultValue:t}=i,s=sr(t,n);return s?dt(s):null}},isDeprecated:{type:new ae(Pn),resolve:i=>i.deprecationReason!=null},deprecationReason:{type:Ve,resolve:i=>i.deprecationReason}})}),Np=new ft({name:"__EnumValue",description:"One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",fields:()=>({name:{type:new ae(Ve),resolve:i=>i.name},description:{type:Ve,resolve:i=>i.description},isDeprecated:{type:new ae(Pn),resolve:i=>i.deprecationReason!=null},deprecationReason:{type:Ve,resolve:i=>i.deprecationReason}})});var ve;(function(i){i.SCALAR="SCALAR",i.OBJECT="OBJECT",i.INTERFACE="INTERFACE",i.UNION="UNION",i.ENUM="ENUM",i.INPUT_OBJECT="INPUT_OBJECT",i.LIST="LIST",i.NON_NULL="NON_NULL"})(ve||(ve={}));const xp=new ki({name:"__TypeKind",description:"An enum describing what kind of type a given `__Type` is.",values:{SCALAR:{value:ve.SCALAR,description:"Indicates this type is a scalar."},OBJECT:{value:ve.OBJECT,description:"Indicates this type is an object. `fields` and `interfaces` are valid fields."},INTERFACE:{value:ve.INTERFACE,description:"Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."},UNION:{value:ve.UNION,description:"Indicates this type is a union. `possibleTypes` is a valid field."},ENUM:{value:ve.ENUM,description:"Indicates this type is an enum. `enumValues` is a valid field."},INPUT_OBJECT:{value:ve.INPUT_OBJECT,description:"Indicates this type is an input object. `inputFields` is a valid field."},LIST:{value:ve.LIST,description:"Indicates this type is a list. `ofType` is a valid field."},NON_NULL:{value:ve.NON_NULL,description:"Indicates this type is a non-null. `ofType` is a valid field."}}});new ae(Ra);new ae(Ve);new ae(Ve);const Rs=Object.freeze([Ra,bp,kp,Jn,wp,Us,Np,xp]);function hE(i){return Rs.some(({name:n})=>i.name===n)}class Op{constructor(n){var t,s;this.__validationErrors=n.assumeValid===!0?[]:void 0,bt(n)||de(!1,"Must provide configuration object."),!n.types||Array.isArray(n.types)||de(!1,`"types" must be Array if provided but got: ${z(n.types)}.`),!n.directives||Array.isArray(n.directives)||de(!1,`"directives" must be Array if provided but got: ${z(n.directives)}.`),this.description=n.description,this.extensions=Mn(n.extensions),this.astNode=n.astNode,this.extensionASTNodes=(t=n.extensionASTNodes)!==null&&t!==void 0?t:[],this._queryType=n.query,this._mutationType=n.mutation,this._subscriptionType=n.subscription,this._directives=(s=n.directives)!==null&&s!==void 0?s:Ni;const o=new Set(n.types);if(n.types!=null)for(const u of n.types)o.delete(u),Yn(u,o);this._queryType!=null&&Yn(this._queryType,o),this._mutationType!=null&&Yn(this._mutationType,o),this._subscriptionType!=null&&Yn(this._subscriptionType,o);for(const u of this._directives)if(cE(u))for(const l of u.args)Yn(l.type,o);Yn(Ra,o),this._typeMap=Object.create(null),this._subTypeMap=Object.create(null),this._implementationsMap=Object.create(null);for(const u of o){if(u==null)continue;const l=u.name;if(l||de(!1,"One of the provided types for building the Schema is missing a name."),this._typeMap[l]!==void 0)throw new Error(`Schema must contain uniquely named types but contains multiple types named "${l}".`);if(this._typeMap[l]=u,cn(u)){for(const d of u.getInterfaces())if(cn(d)){let f=this._implementationsMap[d.name];f===void 0&&(f=this._implementationsMap[d.name]={objects:[],interfaces:[]}),f.interfaces.push(u)}}else if(Sn(u)){for(const d of u.getInterfaces())if(cn(d)){let f=this._implementationsMap[d.name];f===void 0&&(f=this._implementationsMap[d.name]={objects:[],interfaces:[]}),f.objects.push(u)}}}}get[Symbol.toStringTag](){return"GraphQLSchema"}getQueryType(){return this._queryType}getMutationType(){return this._mutationType}getSubscriptionType(){return this._subscriptionType}getRootType(n){switch(n){case Ln.QUERY:return this.getQueryType();case Ln.MUTATION:return this.getMutationType();case Ln.SUBSCRIPTION:return this.getSubscriptionType()}}getTypeMap(){return this._typeMap}getType(n){return this.getTypeMap()[n]}getPossibleTypes(n){return Zn(n)?n.getTypes():this.getImplementations(n).objects}getImplementations(n){const t=this._implementationsMap[n.name];return t??{objects:[],interfaces:[]}}isSubType(n,t){let s=this._subTypeMap[n.name];if(s===void 0){if(s=Object.create(null),Zn(n))for(const o of n.getTypes())s[o.name]=!0;else{const o=this.getImplementations(n);for(const u of o.objects)s[u.name]=!0;for(const u of o.interfaces)s[u.name]=!0}this._subTypeMap[n.name]=s}return s[t.name]!==void 0}getDirectives(){return this._directives}getDirective(n){return this.getDirectives().find(t=>t.name===n)}toConfig(){return{description:this.description,query:this.getQueryType(),mutation:this.getMutationType(),subscription:this.getSubscriptionType(),types:Object.values(this.getTypeMap()),directives:this.getDirectives(),extensions:this.extensions,astNode:this.astNode,extensionASTNodes:this.extensionASTNodes,assumeValid:this.__validationErrors!==void 0}}}function Yn(i,n){const t=tE(i);if(!n.has(t)){if(n.add(t),Zn(t))for(const s of t.getTypes())Yn(s,n);else if(Sn(t)||cn(t)){for(const s of t.getInterfaces())Yn(s,n);for(const s of Object.values(t.getFields())){Yn(s.type,n);for(const o of s.args)Yn(o.type,n)}}else if(et(t))for(const s of Object.values(t.getFields()))Yn(s.type,n)}return n}function yE(i){return i.kind===_.SCHEMA_DEFINITION||fr(i)||i.kind===_.DIRECTIVE_DEFINITION}function fr(i){return i.kind===_.SCALAR_TYPE_DEFINITION||i.kind===_.OBJECT_TYPE_DEFINITION||i.kind===_.INTERFACE_TYPE_DEFINITION||i.kind===_.UNION_TYPE_DEFINITION||i.kind===_.ENUM_TYPE_DEFINITION||i.kind===_.INPUT_OBJECT_TYPE_DEFINITION}function mE(i){return i.kind===_.SCHEMA_EXTENSION||ba(i)}function ba(i){return i.kind===_.SCALAR_TYPE_EXTENSION||i.kind===_.OBJECT_TYPE_EXTENSION||i.kind===_.INTERFACE_TYPE_EXTENSION||i.kind===_.UNION_TYPE_EXTENSION||i.kind===_.ENUM_TYPE_EXTENSION||i.kind===_.INPUT_OBJECT_TYPE_EXTENSION}function SE(i){const n=Object.create(null),t=i.getSchema(),s=t?t.getDirectives():Ni;for(const l of s)n[l.name]=l.args.map(d=>d.name);const o=i.getDocument().definitions;for(const l of o)if(l.kind===_.DIRECTIVE_DEFINITION){var u;const d=(u=l.arguments)!==null&&u!==void 0?u:[];n[l.name.value]=d.map(f=>f.name.value)}return{Directive(l){const d=l.name.value,f=n[d];if(l.arguments&&f)for(const m of l.arguments){const S=m.name.value;if(!f.includes(S)){const E=Bs(S,f);i.reportError(new j(`Unknown argument "${S}" on directive "@${d}".`+Cs(E),{nodes:m}))}}return!1}}}function TE(i){const n=Object.create(null),t=i.getSchema(),s=t?t.getDirectives():Ni;for(const u of s)n[u.name]=u.locations;const o=i.getDocument().definitions;for(const u of o)u.kind===_.DIRECTIVE_DEFINITION&&(n[u.name.value]=u.locations.map(l=>l.value));return{Directive(u,l,d,f,m){const S=u.name.value,E=n[S];if(!E){i.reportError(new j(`Unknown directive "@${S}".`,{nodes:u}));return}const B=DE(m);B&&!E.includes(B)&&i.reportError(new j(`Directive "@${S}" may not be used on ${B}.`,{nodes:u}))}}}function DE(i){const n=i[i.length-1];switch("kind"in n||Xn(!1),n.kind){case _.OPERATION_DEFINITION:return EE(n.operation);case _.FIELD:return Q.FIELD;case _.FRAGMENT_SPREAD:return Q.FRAGMENT_SPREAD;case _.INLINE_FRAGMENT:return Q.INLINE_FRAGMENT;case _.FRAGMENT_DEFINITION:return Q.FRAGMENT_DEFINITION;case _.VARIABLE_DEFINITION:return Q.VARIABLE_DEFINITION;case _.SCHEMA_DEFINITION:case _.SCHEMA_EXTENSION:return Q.SCHEMA;case _.SCALAR_TYPE_DEFINITION:case _.SCALAR_TYPE_EXTENSION:return Q.SCALAR;case _.OBJECT_TYPE_DEFINITION:case _.OBJECT_TYPE_EXTENSION:return Q.OBJECT;case _.FIELD_DEFINITION:return Q.FIELD_DEFINITION;case _.INTERFACE_TYPE_DEFINITION:case _.INTERFACE_TYPE_EXTENSION:return Q.INTERFACE;case _.UNION_TYPE_DEFINITION:case _.UNION_TYPE_EXTENSION:return Q.UNION;case _.ENUM_TYPE_DEFINITION:case _.ENUM_TYPE_EXTENSION:return Q.ENUM;case _.ENUM_VALUE_DEFINITION:return Q.ENUM_VALUE;case _.INPUT_OBJECT_TYPE_DEFINITION:case _.INPUT_OBJECT_TYPE_EXTENSION:return Q.INPUT_OBJECT;case _.INPUT_VALUE_DEFINITION:{const t=i[i.length-3];return"kind"in t||Xn(!1),t.kind===_.INPUT_OBJECT_TYPE_DEFINITION?Q.INPUT_FIELD_DEFINITION:Q.ARGUMENT_DEFINITION}default:Xn(!1,"Unexpected kind: "+z(n.kind))}}function EE(i){switch(i){case Ln.QUERY:return Q.QUERY;case Ln.MUTATION:return Q.MUTATION;case Ln.SUBSCRIPTION:return Q.SUBSCRIPTION}}function AE(i){const n=i.getSchema(),t=n?n.getTypeMap():Object.create(null),s=Object.create(null);for(const u of i.getDocument().definitions)fr(u)&&(s[u.name.value]=!0);const o=[...Object.keys(t),...Object.keys(s)];return{NamedType(u,l,d,f,m){const S=u.name.value;if(!t[S]&&!s[S]){var E;const B=(E=m[2])!==null&&E!==void 0?E:d,k=B!=null&&_E(B);if(k&&Mc.includes(S))return;const N=Bs(S,k?Mc.concat(o):o);i.reportError(new j(`Unknown type "${S}".`+Cs(N),{nodes:u}))}}}}const Mc=[...Fs,...Rs].map(i=>i.name);function _E(i){return"kind"in i&&(yE(i)||mE(i))}function vE(i){var n,t,s;const o=i.getSchema(),u=(n=(t=(s=o==null?void 0:o.astNode)!==null&&s!==void 0?s:o==null?void 0:o.getQueryType())!==null&&t!==void 0?t:o==null?void 0:o.getMutationType())!==null&&n!==void 0?n:o==null?void 0:o.getSubscriptionType();let l=0;return{SchemaDefinition(d){if(u){i.reportError(new j("Cannot define a new schema within a schema extension.",{nodes:d}));return}l>0&&i.reportError(new j("Must provide only one schema definition.",{nodes:d})),++l}}}function IE(i){const n=i.getSchema(),t=Object.create(null);for(const o of i.getDocument().definitions)fr(o)&&(t[o.name.value]=o);return{ScalarTypeExtension:s,ObjectTypeExtension:s,InterfaceTypeExtension:s,UnionTypeExtension:s,EnumTypeExtension:s,InputObjectTypeExtension:s};function s(o){const u=o.name.value,l=t[u],d=n==null?void 0:n.getType(u);let f;if(l?f=CE[l.kind]:d&&(f=BE(d)),f){if(f!==o.kind){const m=FE(o.kind);i.reportError(new j(`Cannot extend non-${m} type "${u}".`,{nodes:l?[l,o]:o}))}}else{const m=Object.keys({...t,...n==null?void 0:n.getTypeMap()}),S=Bs(u,m);i.reportError(new j(`Cannot extend type "${u}" because it is not defined.`+Cs(S),{nodes:o.name}))}}}const CE={[_.SCALAR_TYPE_DEFINITION]:_.SCALAR_TYPE_EXTENSION,[_.OBJECT_TYPE_DEFINITION]:_.OBJECT_TYPE_EXTENSION,[_.INTERFACE_TYPE_DEFINITION]:_.INTERFACE_TYPE_EXTENSION,[_.UNION_TYPE_DEFINITION]:_.UNION_TYPE_EXTENSION,[_.ENUM_TYPE_DEFINITION]:_.ENUM_TYPE_EXTENSION,[_.INPUT_OBJECT_TYPE_DEFINITION]:_.INPUT_OBJECT_TYPE_EXTENSION};function BE(i){if(Ht(i))return _.SCALAR_TYPE_EXTENSION;if(Sn(i))return _.OBJECT_TYPE_EXTENSION;if(cn(i))return _.INTERFACE_TYPE_EXTENSION;if(Zn(i))return _.UNION_TYPE_EXTENSION;if(Kn(i))return _.ENUM_TYPE_EXTENSION;if(et(i))return _.INPUT_OBJECT_TYPE_EXTENSION;Xn(!1,"Unexpected type: "+z(i))}function FE(i){switch(i){case _.SCALAR_TYPE_EXTENSION:return"scalar";case _.OBJECT_TYPE_EXTENSION:return"object";case _.INTERFACE_TYPE_EXTENSION:return"interface";case _.UNION_TYPE_EXTENSION:return"union";case _.ENUM_TYPE_EXTENSION:return"enum";case _.INPUT_OBJECT_TYPE_EXTENSION:return"input object";default:Xn(!1,"Unexpected kind: "+z(i))}}function UE(i){var n;const t=Object.create(null),s=i.getSchema(),o=(n=s==null?void 0:s.getDirectives())!==null&&n!==void 0?n:Ni;for(const d of o)t[d.name]=bi(d.args.filter(iE),f=>f.name);const u=i.getDocument().definitions;for(const d of u)if(d.kind===_.DIRECTIVE_DEFINITION){var l;const f=(l=d.arguments)!==null&&l!==void 0?l:[];t[d.name.value]=bi(f.filter(RE),m=>m.name.value)}return{Directive:{leave(d){const f=d.name.value,m=t[f];if(m){var S;const E=(S=d.arguments)!==null&&S!==void 0?S:[],B=new Set(E.map(k=>k.name.value));for(const[k,N]of Object.entries(m))if(!B.has(k)){const x=Fa(N.type)?z(N.type):dt(N.type);i.reportError(new j(`Directive "@${f}" argument "${k}" of type "${x}" is required, but it was not provided.`,{nodes:d}))}}}}}}function RE(i){return i.type.kind===_.NON_NULL_TYPE&&i.defaultValue==null}function jt(i,n,t){if(i){if(i.kind===_.VARIABLE){const s=i.name.value;if(t==null||t[s]===void 0)return;const o=t[s];return o===null&&ln(n)?void 0:o}if(ln(n))return i.kind===_.NULL?void 0:jt(i,n.ofType,t);if(i.kind===_.NULL)return null;if(di(n)){const s=n.ofType;if(i.kind===_.LIST){const u=[];for(const l of i.values)if($c(l,t)){if(ln(s))return;u.push(null)}else{const d=jt(l,s,t);if(d===void 0)return;u.push(d)}return u}const o=jt(i,s,t);return o===void 0?void 0:[o]}if(et(n)){if(i.kind!==_.OBJECT)return;const s=Object.create(null),o=bi(i.fields,u=>u.name.value);for(const u of Object.values(n.getFields())){const l=o[u.name];if(!l||$c(l.value,t)){if(u.defaultValue!==void 0)s[u.name]=u.defaultValue;else if(ln(u.type))return;continue}const d=jt(l.value,u.type,t);if(d===void 0)return;s[u.name]=d}return s}if(Tp(n)){let s;try{s=n.parseLiteral(i,t)}catch{return}return s===void 0?void 0:s}Xn(!1,"Unexpected input type: "+z(n))}}function $c(i,n){return i.kind===_.VARIABLE&&(n==null||n[i.name.value]===void 0)}function bE(i,n,t){var s;const o={},u=(s=n.arguments)!==null&&s!==void 0?s:[],l=bi(u,d=>d.name.value);for(const d of i.args){const f=d.name,m=d.type,S=l[f];if(!S){if(d.defaultValue!==void 0)o[f]=d.defaultValue;else if(ln(m))throw new j(`Argument "${f}" of required type "${z(m)}" was not provided.`,{nodes:n});continue}const E=S.value;let B=E.kind===_.NULL;if(E.kind===_.VARIABLE){const N=E.name.value;if(t==null||!kE(t,N)){if(d.defaultValue!==void 0)o[f]=d.defaultValue;else if(ln(m))throw new j(`Argument "${f}" of required type "${z(m)}" was provided the variable "$${N}" which was not provided a runtime value.`,{nodes:E});continue}B=t[N]==null}if(B&&ln(m))throw new j(`Argument "${f}" of non-null type "${z(m)}" must not be null.`,{nodes:E});const k=jt(E,m,t);if(k===void 0)throw new j(`Argument "${f}" has invalid value ${dt(E)}.`,{nodes:E});o[f]=k}return o}function Lp(i,n,t){var s;const o=(s=n.directives)===null||s===void 0?void 0:s.find(u=>u.name.value===i.name);if(o)return bE(i,o,t)}function kE(i,n){return Object.prototype.hasOwnProperty.call(i,n)}function Pp(i,n){const t=new Map;for(const s of i){const o=n(s),u=t.get(o);u===void 0?t.set(o,[s]):u.push(s)}return t}function wE(i){return{DirectiveDefinition(s){var o;const u=(o=s.arguments)!==null&&o!==void 0?o:[];return t(`@${s.name.value}`,u)},InterfaceTypeDefinition:n,InterfaceTypeExtension:n,ObjectTypeDefinition:n,ObjectTypeExtension:n};function n(s){var o;const u=s.name.value,l=(o=s.fields)!==null&&o!==void 0?o:[];for(const f of l){var d;const m=f.name.value,S=(d=f.arguments)!==null&&d!==void 0?d:[];t(`${u}.${m}`,S)}return!1}function t(s,o){const u=Pp(o,l=>l.name.value);for(const[l,d]of u)d.length>1&&i.reportError(new j(`Argument "${s}(${l}:)" can only be defined once.`,{nodes:d.map(f=>f.name)}));return!1}}function NE(i){return{Field:n,Directive:n};function n(t){var s;const o=(s=t.arguments)!==null&&s!==void 0?s:[],u=Pp(o,l=>l.name.value);for(const[l,d]of u)d.length>1&&i.reportError(new j(`There can be only one argument named "${l}".`,{nodes:d.map(f=>f.name)}))}}function xE(i){const n=Object.create(null),t=i.getSchema();return{DirectiveDefinition(s){const o=s.name.value;if(t!=null&&t.getDirective(o)){i.reportError(new j(`Directive "@${o}" already exists in the schema. It cannot be redefined.`,{nodes:s.name}));return}return n[o]?i.reportError(new j(`There can be only one directive named "@${o}".`,{nodes:[n[o],s.name]})):n[o]=s.name,!1}}}function OE(i){const n=Object.create(null),t=i.getSchema(),s=t?t.getDirectives():Ni;for(const d of s)n[d.name]=!d.isRepeatable;const o=i.getDocument().definitions;for(const d of o)d.kind===_.DIRECTIVE_DEFINITION&&(n[d.name.value]=!d.repeatable);const u=Object.create(null),l=Object.create(null);return{enter(d){if(!("directives"in d)||!d.directives)return;let f;if(d.kind===_.SCHEMA_DEFINITION||d.kind===_.SCHEMA_EXTENSION)f=u;else if(fr(d)||ba(d)){const m=d.name.value;f=l[m],f===void 0&&(l[m]=f=Object.create(null))}else f=Object.create(null);for(const m of d.directives){const S=m.name.value;n[S]&&(f[S]?i.reportError(new j(`The directive "@${S}" can only be used once at this location.`,{nodes:[f[S],m]})):f[S]=m)}}}}function LE(i){const n=i.getSchema(),t=n?n.getTypeMap():Object.create(null),s=Object.create(null);return{EnumTypeDefinition:o,EnumTypeExtension:o};function o(u){var l;const d=u.name.value;s[d]||(s[d]=Object.create(null));const f=(l=u.values)!==null&&l!==void 0?l:[],m=s[d];for(const S of f){const E=S.name.value,B=t[d];Kn(B)&&B.getValue(E)?i.reportError(new j(`Enum value "${d}.${E}" already exists in the schema. It cannot also be defined in this type extension.`,{nodes:S.name})):m[E]?i.reportError(new j(`Enum value "${d}.${E}" can only be defined once.`,{nodes:[m[E],S.name]})):m[E]=S.name}return!1}}function PE(i){const n=i.getSchema(),t=n?n.getTypeMap():Object.create(null),s=Object.create(null);return{InputObjectTypeDefinition:o,InputObjectTypeExtension:o,InterfaceTypeDefinition:o,InterfaceTypeExtension:o,ObjectTypeDefinition:o,ObjectTypeExtension:o};function o(u){var l;const d=u.name.value;s[d]||(s[d]=Object.create(null));const f=(l=u.fields)!==null&&l!==void 0?l:[],m=s[d];for(const S of f){const E=S.name.value;ME(t[d],E)?i.reportError(new j(`Field "${d}.${E}" already exists in the schema. It cannot also be defined in this type extension.`,{nodes:S.name})):m[E]?i.reportError(new j(`Field "${d}.${E}" can only be defined once.`,{nodes:[m[E],S.name]})):m[E]=S.name}return!1}}function ME(i,n){return Sn(i)||cn(i)||et(i)?i.getFields()[n]!=null:!1}function $E(i){const n=[];let t=Object.create(null);return{ObjectValue:{enter(){n.push(t),t=Object.create(null)},leave(){const s=n.pop();s||Xn(!1),t=s}},ObjectField(s){const o=s.name.value;t[o]?i.reportError(new j(`There can be only one input field named "${o}".`,{nodes:[t[o],s.name]})):t[o]=s.name}}}function VE(i){const n=i.getSchema(),t=Object.create(null),s=n?{query:n.getQueryType(),mutation:n.getMutationType(),subscription:n.getSubscriptionType()}:{};return{SchemaDefinition:o,SchemaExtension:o};function o(u){var l;const d=(l=u.operationTypes)!==null&&l!==void 0?l:[];for(const f of d){const m=f.operation,S=t[m];s[m]?i.reportError(new j(`Type for ${m} already defined in the schema. It cannot be redefined.`,{nodes:f})):S?i.reportError(new j(`There can be only one ${m} type in schema.`,{nodes:[S,f]})):t[m]=f}return!1}}function GE(i){const n=Object.create(null),t=i.getSchema();return{ScalarTypeDefinition:s,ObjectTypeDefinition:s,InterfaceTypeDefinition:s,UnionTypeDefinition:s,EnumTypeDefinition:s,InputObjectTypeDefinition:s};function s(o){const u=o.name.value;if(t!=null&&t.getType(u)){i.reportError(new j(`Type "${u}" already exists in the schema. It cannot also be defined in this type definition.`,{nodes:o.name}));return}return n[u]?i.reportError(new j(`There can be only one type named "${u}".`,{nodes:[n[u],o.name]})):n[u]=o.name,!1}}const qE=Object.freeze([vE,VE,GE,LE,PE,wE,xE,AE,TE,OE,IE,SE,NE,$E,UE]);class jE{constructor(n,t){this._ast=n,this._fragments=void 0,this._fragmentSpreads=new Map,this._recursivelyReferencedFragments=new Map,this._onError=t}get[Symbol.toStringTag](){return"ASTValidationContext"}reportError(n){this._onError(n)}getDocument(){return this._ast}getFragment(n){let t;if(this._fragments)t=this._fragments;else{t=Object.create(null);for(const s of this.getDocument().definitions)s.kind===_.FRAGMENT_DEFINITION&&(t[s.name.value]=s);this._fragments=t}return t[n]}getFragmentSpreads(n){let t=this._fragmentSpreads.get(n);if(!t){t=[];const s=[n];let o;for(;o=s.pop();)for(const u of o.selections)u.kind===_.FRAGMENT_SPREAD?t.push(u):u.selectionSet&&s.push(u.selectionSet);this._fragmentSpreads.set(n,t)}return t}getRecursivelyReferencedFragments(n){let t=this._recursivelyReferencedFragments.get(n);if(!t){t=[];const s=Object.create(null),o=[n.selectionSet];let u;for(;u=o.pop();)for(const l of this.getFragmentSpreads(u)){const d=l.name.value;if(s[d]!==!0){s[d]=!0;const f=this.getFragment(d);f&&(t.push(f),o.push(f.selectionSet))}}this._recursivelyReferencedFragments.set(n,t)}return t}}class WE extends jE{constructor(n,t,s){super(n,s),this._schema=t}get[Symbol.toStringTag](){return"SDLValidationContext"}getSchema(){return this._schema}}function zE(i,n,t=qE){const s=[],o=new WE(i,n,l=>{s.push(l)}),u=t.map(l=>l(o));return hp(i,YD(u)),s}function QE(i){const n=zE(i);if(n.length!==0)throw new Error(n.map(t=>t.message).join(`

`))}function YE(i,n){bt(i)&&bt(i.__schema)||de(!1,`Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${z(i)}.`);const t=i.__schema,s=ai(t.types,b=>b.name,b=>B(b));for(const b of[...Fs,...Rs])s[b.name]&&(s[b.name]=b);const o=t.queryType?S(t.queryType):null,u=t.mutationType?S(t.mutationType):null,l=t.subscriptionType?S(t.subscriptionType):null,d=t.directives?t.directives.map(ht):[];return new Op({description:t.description,query:o,mutation:u,subscription:l,types:Object.values(s),directives:d,assumeValid:n==null?void 0:n.assumeValid});function f(b){if(b.kind===ve.LIST){const K=b.ofType;if(!K)throw new Error("Decorated type deeper than introspection query.");return new mn(f(K))}if(b.kind===ve.NON_NULL){const K=b.ofType;if(!K)throw new Error("Decorated type deeper than introspection query.");const sn=f(K);return new ae(nE(sn))}return m(b)}function m(b){const K=b.name;if(!K)throw new Error(`Unknown type reference: ${z(b)}.`);const sn=s[K];if(!sn)throw new Error(`Invalid or incomplete schema, unknown type: ${K}. Ensure that a full introspection query is used in order to build a client schema.`);return sn}function S(b){return ZD(m(b))}function E(b){return KD(m(b))}function B(b){if(b!=null&&b.name!=null&&b.kind!=null)switch(b.kind){case ve.SCALAR:return k(b);case ve.OBJECT:return x(b);case ve.INTERFACE:return X(b);case ve.UNION:return ge(b);case ve.ENUM:return Ge(b);case ve.INPUT_OBJECT:return Ie(b)}const K=z(b);throw new Error(`Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${K}.`)}function k(b){return new kt({name:b.name,description:b.description,specifiedByURL:b.specifiedByURL})}function N(b){if(b.interfaces===null&&b.kind===ve.INTERFACE)return[];if(!b.interfaces){const K=z(b);throw new Error(`Introspection result missing interfaces: ${K}.`)}return b.interfaces.map(E)}function x(b){return new ft({name:b.name,description:b.description,interfaces:()=>N(b),fields:()=>Re(b)})}function X(b){return new Ss({name:b.name,description:b.description,interfaces:()=>N(b),fields:()=>Re(b)})}function ge(b){if(!b.possibleTypes){const K=z(b);throw new Error(`Introspection result missing possibleTypes: ${K}.`)}return new Ts({name:b.name,description:b.description,types:()=>b.possibleTypes.map(S)})}function Ge(b){if(!b.enumValues){const K=z(b);throw new Error(`Introspection result missing enumValues: ${K}.`)}return new ki({name:b.name,description:b.description,values:ai(b.enumValues,K=>K.name,K=>({description:K.description,deprecationReason:K.deprecationReason}))})}function Ie(b){if(!b.inputFields){const K=z(b);throw new Error(`Introspection result missing inputFields: ${K}.`)}return new Ds({name:b.name,description:b.description,fields:()=>rn(b.inputFields)})}function Re(b){if(!b.fields)throw new Error(`Introspection result missing fields: ${z(b)}.`);return ai(b.fields,K=>K.name,Ne)}function Ne(b){const K=f(b.type);if(!Sp(K)){const sn=z(K);throw new Error(`Introspection must provide output type for fields, but received: ${sn}.`)}if(!b.args){const sn=z(b);throw new Error(`Introspection result missing field args: ${sn}.`)}return{description:b.description,deprecationReason:b.deprecationReason,type:K,args:rn(b.args)}}function rn(b){return ai(b,K=>K.name,Ze)}function Ze(b){const K=f(b.type);if(!mp(K)){const wt=z(K);throw new Error(`Introspection must provide input type for arguments, but received: ${wt}.`)}const sn=b.defaultValue!=null?jt(MD(b.defaultValue),K):void 0;return{description:b.description,type:K,defaultValue:sn,deprecationReason:b.deprecationReason}}function ht(b){if(!b.args){const K=z(b);throw new Error(`Introspection result missing directive args: ${K}.`)}if(!b.locations){const K=z(b);throw new Error(`Introspection result missing directive locations: ${K}.`)}return new Yt({name:b.name,description:b.description,isRepeatable:b.isRepeatable,locations:b.locations.slice(),args:rn(b.args)})}}function HE(i,n,t){var s,o,u,l;const d=[],f=Object.create(null),m=[];let S;const E=[];for(const C of n.definitions)if(C.kind===_.SCHEMA_DEFINITION)S=C;else if(C.kind===_.SCHEMA_EXTENSION)E.push(C);else if(fr(C))d.push(C);else if(ba(C)){const V=C.name.value,L=f[V];f[V]=L?L.concat([C]):[C]}else C.kind===_.DIRECTIVE_DEFINITION&&m.push(C);if(Object.keys(f).length===0&&d.length===0&&m.length===0&&E.length===0&&S==null)return i;const B=Object.create(null);for(const C of i.types)B[C.name]=Ge(C);for(const C of d){var k;const V=C.name.value;B[V]=(k=Vc[V])!==null&&k!==void 0?k:Bn(C)}const N={query:i.query&&X(i.query),mutation:i.mutation&&X(i.mutation),subscription:i.subscription&&X(i.subscription),...S&&sn([S]),...sn(E)};return{description:(s=S)===null||s===void 0||(o=s.description)===null||o===void 0?void 0:o.value,...N,types:Object.values(B),directives:[...i.directives.map(ge),...m.map(gr)],extensions:Object.create(null),astNode:(u=S)!==null&&u!==void 0?u:i.astNode,extensionASTNodes:i.extensionASTNodes.concat(E),assumeValid:(l=t==null?void 0:t.assumeValid)!==null&&l!==void 0?l:!1};function x(C){return di(C)?new mn(x(C.ofType)):ln(C)?new ae(x(C.ofType)):X(C)}function X(C){return B[C.name]}function ge(C){const V=C.toConfig();return new Yt({...V,args:Ct(V.args,K)})}function Ge(C){if(hE(C)||lE(C))return C;if(Ht(C))return Ne(C);if(Sn(C))return rn(C);if(cn(C))return Ze(C);if(Zn(C))return ht(C);if(Kn(C))return Re(C);if(et(C))return Ie(C);Xn(!1,"Unexpected type: "+z(C))}function Ie(C){var V;const L=C.toConfig(),M=(V=f[L.name])!==null&&V!==void 0?V:[];return new Ds({...L,fields:()=>({...Ct(L.fields,he=>({...he,type:x(he.type)})),...ot(M)}),extensionASTNodes:L.extensionASTNodes.concat(M)})}function Re(C){var V;const L=C.toConfig(),M=(V=f[C.name])!==null&&V!==void 0?V:[];return new ki({...L,values:{...L.values,...$n(M)},extensionASTNodes:L.extensionASTNodes.concat(M)})}function Ne(C){var V;const L=C.toConfig(),M=(V=f[L.name])!==null&&V!==void 0?V:[];let he=L.specifiedByURL;for(const ye of M){var Pe;he=(Pe=Gc(ye))!==null&&Pe!==void 0?Pe:he}return new kt({...L,specifiedByURL:he,extensionASTNodes:L.extensionASTNodes.concat(M)})}function rn(C){var V;const L=C.toConfig(),M=(V=f[L.name])!==null&&V!==void 0?V:[];return new ft({...L,interfaces:()=>[...C.getInterfaces().map(X),...gi(M)],fields:()=>({...Ct(L.fields,b),...fi(M)}),extensionASTNodes:L.extensionASTNodes.concat(M)})}function Ze(C){var V;const L=C.toConfig(),M=(V=f[L.name])!==null&&V!==void 0?V:[];return new Ss({...L,interfaces:()=>[...C.getInterfaces().map(X),...gi(M)],fields:()=>({...Ct(L.fields,b),...fi(M)}),extensionASTNodes:L.extensionASTNodes.concat(M)})}function ht(C){var V;const L=C.toConfig(),M=(V=f[L.name])!==null&&V!==void 0?V:[];return new Ts({...L,types:()=>[...C.getTypes().map(X),...Xt(M)],extensionASTNodes:L.extensionASTNodes.concat(M)})}function b(C){return{...C,type:x(C.type),args:C.args&&Ct(C.args,K)}}function K(C){return{...C,type:x(C.type)}}function sn(C){const V={};for(const M of C){var L;const he=(L=M.operationTypes)!==null&&L!==void 0?L:[];for(const Pe of he)V[Pe.operation]=wt(Pe.type)}return V}function wt(C){var V;const L=C.name.value,M=(V=Vc[L])!==null&&V!==void 0?V:B[L];if(M===void 0)throw new Error(`Unknown type: "${L}".`);return M}function Jt(C){return C.kind===_.LIST_TYPE?new mn(Jt(C.type)):C.kind===_.NON_NULL_TYPE?new ae(Jt(C.type)):wt(C)}function gr(C){var V;return new Yt({name:C.name.value,description:(V=C.description)===null||V===void 0?void 0:V.value,locations:C.locations.map(({value:L})=>L),isRepeatable:C.repeatable,args:hr(C.arguments),astNode:C})}function fi(C){const V=Object.create(null);for(const he of C){var L;const Pe=(L=he.fields)!==null&&L!==void 0?L:[];for(const ye of Pe){var M;V[ye.name.value]={type:Jt(ye.type),description:(M=ye.description)===null||M===void 0?void 0:M.value,args:hr(ye.arguments),deprecationReason:ps(ye),astNode:ye}}}return V}function hr(C){const V=C??[],L=Object.create(null);for(const he of V){var M;const Pe=Jt(he.type);L[he.name.value]={type:Pe,description:(M=he.description)===null||M===void 0?void 0:M.value,defaultValue:jt(he.defaultValue,Pe),deprecationReason:ps(he),astNode:he}}return L}function ot(C){const V=Object.create(null);for(const he of C){var L;const Pe=(L=he.fields)!==null&&L!==void 0?L:[];for(const ye of Pe){var M;const Fn=Jt(ye.type);V[ye.name.value]={type:Fn,description:(M=ye.description)===null||M===void 0?void 0:M.value,defaultValue:jt(ye.defaultValue,Fn),deprecationReason:ps(ye),astNode:ye}}}return V}function $n(C){const V=Object.create(null);for(const he of C){var L;const Pe=(L=he.values)!==null&&L!==void 0?L:[];for(const ye of Pe){var M;V[ye.name.value]={description:(M=ye.description)===null||M===void 0?void 0:M.value,deprecationReason:ps(ye),astNode:ye}}}return V}function gi(C){return C.flatMap(V=>{var L,M;return(L=(M=V.interfaces)===null||M===void 0?void 0:M.map(wt))!==null&&L!==void 0?L:[]})}function Xt(C){return C.flatMap(V=>{var L,M;return(L=(M=V.types)===null||M===void 0?void 0:M.map(wt))!==null&&L!==void 0?L:[]})}function Bn(C){var V;const L=C.name.value,M=(V=f[L])!==null&&V!==void 0?V:[];switch(C.kind){case _.OBJECT_TYPE_DEFINITION:{var he;const Ke=[C,...M];return new ft({name:L,description:(he=C.description)===null||he===void 0?void 0:he.value,interfaces:()=>gi(Ke),fields:()=>fi(Ke),astNode:C,extensionASTNodes:M})}case _.INTERFACE_TYPE_DEFINITION:{var Pe;const Ke=[C,...M];return new Ss({name:L,description:(Pe=C.description)===null||Pe===void 0?void 0:Pe.value,interfaces:()=>gi(Ke),fields:()=>fi(Ke),astNode:C,extensionASTNodes:M})}case _.ENUM_TYPE_DEFINITION:{var ye;const Ke=[C,...M];return new ki({name:L,description:(ye=C.description)===null||ye===void 0?void 0:ye.value,values:$n(Ke),astNode:C,extensionASTNodes:M})}case _.UNION_TYPE_DEFINITION:{var Fn;const Ke=[C,...M];return new Ts({name:L,description:(Fn=C.description)===null||Fn===void 0?void 0:Fn.value,types:()=>Xt(Ke),astNode:C,extensionASTNodes:M})}case _.SCALAR_TYPE_DEFINITION:{var xi;return new kt({name:L,description:(xi=C.description)===null||xi===void 0?void 0:xi.value,specifiedByURL:Gc(C),astNode:C,extensionASTNodes:M})}case _.INPUT_OBJECT_TYPE_DEFINITION:{var Nt;const Ke=[C,...M];return new Ds({name:L,description:(Nt=C.description)===null||Nt===void 0?void 0:Nt.value,fields:()=>ot(Ke),astNode:C,extensionASTNodes:M})}}}}const Vc=bi([...Fs,...Rs],i=>i.name);function ps(i){const n=Lp(Up,i);return n==null?void 0:n.reason}function Gc(i){const n=Lp(Rp,i);return n==null?void 0:n.url}function JE(i,n){i!=null&&i.kind===_.DOCUMENT||de(!1,"Must provide valid Document AST."),(n==null?void 0:n.assumeValid)!==!0&&(n==null?void 0:n.assumeValidSDL)!==!0&&QE(i);const s=HE({description:void 0,types:[],directives:[],extensions:Object.create(null),extensionASTNodes:[],assumeValid:!1},i,n);if(s.astNode==null)for(const u of s.types)switch(u.name){case"Query":s.query=u;break;case"Mutation":s.mutation=u;break;case"Subscription":s.subscription=u;break}const o=[...s.directives,...Ni.filter(u=>s.directives.every(l=>l.name!==u.name))];return new Op({...s,directives:o})}function XE(i,n){const t=PD(i,{noLocation:n==null?void 0:n.noLocation,allowLegacyFragmentVariables:n==null?void 0:n.allowLegacyFragmentVariables});return JE(t,{assumeValidSDL:n==null?void 0:n.assumeValidSDL,assumeValid:n==null?void 0:n.assumeValid})}const qc=`scalar BytesScalar

"""json field"""
scalar JSONScalar

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type DeletedItem {
  uid: String!
}

type MessagesType {
  message: String!
}

type OperationError {
  error: String!
  suggestion: String
}

type OperationSuccess {
  message: String!
}

type CodingStandardType {
  uid: String!
  name: String!
  description: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

"""Date with time (isoformat)"""
scalar DateTime

type SampleTypeTyp {
  uid: String!
  name: String!
  description: String
  active: Boolean!
  internalUse: Boolean!
  abbr: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type SampleTypeMappingType {
  uid: String!
  sampleTypeUid: String!
  sampleType: SampleTypeTyp
  codingStandardUid: String!
  codingStandard: CodingStandardType
  name: String
  description: String
  code: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type QCLevelType {
  uid: String!
  level: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type QCSetType {
  uid: String!
  name: String!
  note: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type RejectionReasonType {
  uid: String!
  reason: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisRequestType {
  uid: String!
  patientUid: String!
  patient: PatientType!
  clientUid: String!
  client: ClientType!
  requestId: String!
  clientRequestId: String!
  internalUse: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisCategoryType {
  uid: String!
  name: String!
  departmentUid: String
  department: DepartmentType
  description: String
  active: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ResultOptionType {
  uid: String!
  optionKey: Int!
  value: String!
  analysisUid: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisType {
  uid: String!
  name: String!
  description: String
  keyword: String
  departmentUid: String
  department: DepartmentType
  unitUid: String
  unit: UnitType
  sampleTypes: [SampleTypeTyp!]
  categoryUid: String
  category: AnalysisCategoryType
  interims: [AnalysisInterimType!]
  correctionFactors: [AnalysisCorrectionFactorType!]
  specifications: [AnalysisSpecificationType!]
  detectionLimits: [AnalysisDetectionLimitType!]
  uncertainties: [AnalysisUncertaintyType!]
  resultOptions: [ResultOptionType!]
  instruments: [InstrumentType!]
  methods: [MethodType!]
  tatLengthMinutes: Int
  sortKey: Int
  precision: Int
  requiredVerifications: Int
  selfVerification: Boolean
  hidden: Boolean
  internalUse: Boolean
  active: Boolean
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisMappingType {
  uid: String!
  analysisUid: String!
  analysis: AnalysisType
  codingStandardUid: String!
  codingStandard: CodingStandardType
  name: String
  description: String
  code: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ProfileType {
  uid: String!
  name: String!
  description: String
  keyword: String
  departmentUid: String
  department: DepartmentType
  tatLengthMinutes: Int
  analyses: [AnalysisType!]
  sampleTypes: [SampleTypeTyp!]
  active: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ProfileMappingType {
  uid: String!
  profileUid: String!
  profile: ProfileType
  codingStandardUid: String!
  codingStandard: CodingStandardType
  name: String
  description: String
  code: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisWithProfiles {
  uid: String!
  name: String!
  description: String
  keyword: String
  departmentUid: String
  department: DepartmentType
  unitUid: String
  unit: UnitType
  sampleTypes: [SampleTypeTyp!]
  categoryUid: String
  category: AnalysisCategoryType
  interims: [AnalysisInterimType!]
  correctionFactors: [AnalysisCorrectionFactorType!]
  specifications: [AnalysisSpecificationType!]
  detectionLimits: [AnalysisDetectionLimitType!]
  uncertainties: [AnalysisUncertaintyType!]
  resultOptions: [ResultOptionType!]
  instruments: [InstrumentType!]
  methods: [MethodType!]
  tatLengthMinutes: Int
  sortKey: Int
  precision: Int
  requiredVerifications: Int
  selfVerification: Boolean
  hidden: Boolean
  internalUse: Boolean
  active: Boolean
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  profiles: [ProfileType!]
}

type AnalysisEdge {
  cursor: String!
  node: AnalysisWithProfiles!
}

type AnalysisCursorPage {
  pageInfo: PageInfo!
  edges: [AnalysisEdge!]
  items: [AnalysisWithProfiles!]
  totalCount: Int!
}

type SampleType {
  uid: String!
  analysisRequestUid: String!
  analysisRequest: AnalysisRequestType
  sampleTypeUid: String!
  sampleType: SampleTypeTyp
  sampleId: String!
  profiles: [ProfileType!]
  analyses: [AnalysisType!]
  priority: Int!
  status: String
  assigned: Boolean!
  dateCollected: DateTime
  submittedByUid: String
  submittedBy: UserType
  dateSubmitted: DateTime
  verifiedByUid: String
  verifiedBy: UserType
  dateVerified: DateTime
  invalidatedByUid: String
  invalidatedBy: UserType
  dateInvalidated: DateTime
  receivedByUid: String
  receivedBy: UserType
  dateReceived: DateTime
  publishedByUid: String
  publishedBy: UserType
  datePublished: DateTime
  cancelledByUid: String
  cancelledBy: UserType
  dateCancelled: DateTime
  printed: Boolean
  datePrinted: DateTime
  printedByUid: String
  printedBy: UserType
  dueDate: DateTime
  rejectionReasons: [RejectionReasonType!]
  internalUse: Boolean!
  parentId: String
  parent: SampleType
  qcSetUid: String
  qcSet: QCSetType
  qcLevelUid: String
  qcLevel: QCLevelType
  storageContainerUid: String
  storageContainer: StorageContainerType
  storageSlot: String
  storageSlotIndex: Int
  storedByUid: String
  storedBy: UserType
  dateStored: DateTime
  dateRetrievedFromStorage: DateTime
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisRequestWithSamples {
  uid: String!
  patientUid: String!
  patient: PatientType!
  clientUid: String!
  client: ClientType!
  requestId: String!
  clientRequestId: String!
  internalUse: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  samples: [SampleType!]
}

type AnalysisRequestEdge {
  cursor: String!
  node: AnalysisRequestWithSamples!
}

type AnalysisRequestCursorPage {
  pageInfo: PageInfo!
  edges: [AnalysisRequestEdge!]
  items: [AnalysisRequestWithSamples!]
  totalCount: Int!
}

type QCTemplateType {
  uid: String!
  name: String!
  description: String
  departments: [DepartmentType!]!
  qcLevels: [QCLevelType!]!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisInterimType {
  uid: String!
  key: Int!
  value: String!
  analysisUid: String!
  instrumentUid: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisCorrectionFactorType {
  uid: String!
  factor: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisDetectionLimitType {
  uid: String!
  lowerLimit: Float!
  upperLimit: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisUncertaintyType {
  uid: String!
  min: Float!
  max: Float!
  value: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisSpecificationType {
  uid: String!
  analysisUid: String!
  min: Float
  max: Float
  minWarn: Float
  maxWarn: Float
  minReport: String
  maxReport: String
  warnValues: String
  warnReport: String
  gender: String
  ageMin: Int
  ageMax: Int
  methodUid: String
  unitUid: String
  unit: UnitType
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type AnalysisResultType {
  uid: String!
  sampleUid: String!
  sample: SampleType!
  worksheetUid: String
  worksheetPosition: Int
  assigned: Boolean!
  analysisUid: String
  analysis: AnalysisType
  instrumentUid: String
  instrument: InstrumentType
  methodUid: String
  method: MethodType
  result: String
  analystUid: String
  analyst: UserType
  submittedByUid: String
  submittedBy: UserType
  dateSubmitted: DateTime
  verifiedBy: [UserType!]
  dateVerified: DateTime
  invalidatedBy: UserType
  invalidatedByUid: String
  dateInvalidated: DateTime
  dueDate: DateTime
  dateCancelled: DateTime
  cancelledByUid: String
  cancelledBy: UserType
  retest: Boolean!
  parentId: String
  parent: AnalysisResultType
  reportable: Boolean!
  status: String
  reflexLevel: Int
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  worksheetId: String
}

type SamplesWithResults {
  uid: String!
  analysisRequestUid: String!
  analysisRequest: AnalysisRequestType
  sampleTypeUid: String!
  sampleType: SampleTypeTyp
  sampleId: String!
  profiles: [ProfileType!]
  analyses: [AnalysisType!]
  priority: Int!
  status: String
  assigned: Boolean!
  dateCollected: DateTime
  submittedByUid: String
  submittedBy: UserType
  dateSubmitted: DateTime
  verifiedByUid: String
  verifiedBy: UserType
  dateVerified: DateTime
  invalidatedByUid: String
  invalidatedBy: UserType
  dateInvalidated: DateTime
  receivedByUid: String
  receivedBy: UserType
  dateReceived: DateTime
  publishedByUid: String
  publishedBy: UserType
  datePublished: DateTime
  cancelledByUid: String
  cancelledBy: UserType
  dateCancelled: DateTime
  printed: Boolean
  datePrinted: DateTime
  printedByUid: String
  printedBy: UserType
  dueDate: DateTime
  rejectionReasons: [RejectionReasonType!]
  internalUse: Boolean!
  parentId: String
  parent: SampleType
  qcSetUid: String
  qcSet: QCSetType
  qcLevelUid: String
  qcLevel: QCLevelType
  storageContainerUid: String
  storageContainer: StorageContainerType
  storageSlot: String
  storageSlotIndex: Int
  storedByUid: String
  storedBy: UserType
  dateStored: DateTime
  dateRetrievedFromStorage: DateTime
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  analysisResults: [AnalysisResultType!]
}

type SampleEdge {
  cursor: String!
  node: SamplesWithResults!
}

type SampleCursorPage {
  pageInfo: PageInfo!
  edges: [SampleEdge!]
  items: [SamplesWithResults!]
  totalCount: Int!
}

type AnalysisResultEdge {
  cursor: String!
  node: AnalysisResultType!
}

type AnalysisResultCursorPage {
  pageInfo: PageInfo!
  edges: [AnalysisResultEdge!]
  items: [AnalysisResultType!]
  totalCount: Int!
}

type QCSetWithSamples {
  uid: String!
  name: String!
  note: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  samples: [SamplesWithResults!]
}

type QCSetEdge {
  cursor: String!
  node: QCSetWithSamples!
}

type QCSetCursorPage {
  pageInfo: PageInfo!
  edges: [QCSetEdge!]
  items: [QCSetWithSamples!]
  totalCount: Int!
}

type Nothing {
  data: String
}

type GroupCount {
  group: String!
  count: Int
}

type GroupData {
  group: String!
  counts: [GroupCount!]
}

type GroupedCounts {
  data: [GroupCount!]!
}

type GroupedData {
  data: [GroupData!]!
}

type ProcessCounts {
  totalSamples: Int
  totalLate: Int
  totalNotLate: Int
  processAverage: Int
  avgExtraDays: Int
  service: String
}

type ProcessData {
  process: String!
  counts: ProcessCounts
  groups: [ProcessCounts!]
}

type ProcessStatistics {
  data: [ProcessData!]!
}

type LaggardCounts {
  lessThanTen: Int
  tenToTwenty: Int
  twentyToThirty: Int
  graterThanThirty: Int
  totalIncomplete: Int
  totalDelayed: Int
  totalNotDelayed: Int
}

type LaggardData {
  category: String!
  counts: LaggardCounts
}

type LaggardStatistics {
  data: [LaggardData!]!
}

type ReportMetaType {
  uid: String!
  periodStart: DateTime!
  periodEnd: DateTime!
  dateColumn: String!
  location: String
  sampleStates: String
  reportType: String!
  status: String
  temp: String
  analyses: [AnalysisType!]
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type AuditLogType {
  uid: String!
  userId: String
  targetType: String
  targetId: String
  action: Int
  stateBefore: String
  stateAfter: String
}

type ClientType {
  uid: String!
  name: String!
  code: String!
  districtUid: String
  district: DistrictType
  provinceUid: String
  province: ProvinceType
  email: String
  emailCc: String
  consentEmail: Boolean!
  phoneMobile: String
  phoneBusiness: String
  consentSms: Boolean!
  internalUse: Boolean!
  active: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ClientContactType {
  uid: String!
  firstName: String
  lastName: String
  email: String
  mobilePhone: String
  businessPhone: String
  isActive: Boolean
  emailCc: String
  consentSms: Boolean!
  clientUid: String!
  client: ClientType
  createdAt: DateTime
  creatorName: String
  creatorUid: String
  updatedAt: DateTime
  updatorName: String
  updatorUid: String
}

type ClientEdge {
  cursor: String!
  node: ClientType!
}

type ClientCursorPage {
  pageInfo: PageInfo!
  edges: [ClientEdge!]
  items: [ClientType!]
  totalCount: Int!
}

type ReportImpressType {
  uid: String!
  state: String
  sampleUid: String
  sample: SampleType
  jsonContent: JSONScalar
  pdfContent: BytesScalar
  emailRequired: Boolean
  emailSent: Boolean
  smsRequired: Boolean
  smsSent: Boolean
  generatedByUid: String
  generatedBy: UserType
  createdByUid: String
  createdBy: UserType
  updatedByUid: String
  updatedBy: UserType
  dateGenerated: DateTime
}

type InstrumentTypeType {
  uid: String!
  name: String
  description: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type InstrumentTypeEdge {
  cursor: String!
  node: InstrumentTypeType!
}

type InstrumentTypeCursorPage {
  pageInfo: PageInfo!
  edges: [InstrumentTypeEdge!]
  items: [InstrumentTypeType!]
  totalCount: Int!
}

type InstrumentType {
  uid: String!
  name: String
  description: String
  keyword: String
  supplierUid: String
  supplier: SupplierType
  manufacturerUid: String
  manufacturer: ManufacturerType
  instrumentTypeUid: String
  instrumentType: InstrumentTypeType
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  methods: [MethodType!]
}

type InstrumentEdge {
  cursor: String!
  node: InstrumentType!
}

type InstrumentCursorPage {
  pageInfo: PageInfo!
  edges: [InstrumentEdge!]
  items: [InstrumentType!]
  totalCount: Int!
}

type InstrumentCalibrationType {
  uid: String!
  instrumentUid: String!
  instrument: InstrumentType
  calibrationId: String!
  dateReported: DateTime!
  reportId: String!
  performedBy: String!
  startDate: DateTime!
  endDate: DateTime!
  notesBefore: String!
  workDone: String!
  remarks: String!
}

type CalibrationCertificateType {
  uid: String!
  instrumentUid: String!
  instrument: InstrumentType
  certificateCode: String!
  internal: Boolean!
  issuer: String!
  dateIssued: DateTime!
  validFromDate: DateTime!
  validToDate: DateTime!
  performedBy: String!
  approvedBy: String!
  remarks: String!
}

type MethodType {
  uid: String!
  name: String
  description: String
  keyword: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  instruments: [InstrumentType!]
}

type MethodEdge {
  cursor: String!
  node: MethodType!
}

type MethodCursorPage {
  pageInfo: PageInfo!
  edges: [MethodEdge!]
  items: [MethodType!]
  totalCount: Int!
}

type StockItemType {
  uid: String!
  name: String!
  departmentUid: String
  department: DepartmentType
  minimumLevel: Int
  maximumLevel: Int
  description: String
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockItemEdge {
  cursor: String!
  node: StockItemType!
}

type StockItemCursorPage {
  pageInfo: PageInfo!
  edges: [StockItemEdge!]
  items: [StockItemType!]
  totalCount: Int!
}

type StockCategoryType {
  uid: String!
  name: String!
  description: String
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type HazardType {
  uid: String!
  name: String!
  description: String
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockUnitType {
  uid: String!
  name: String!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockPackagingType {
  uid: String!
  name: String!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockProductType {
  uid: String!
  name: String!
  stockItemUid: String
  stockItem: StockItemType
  departmentUid: String
  department: DepartmentType
  supplierUid: String
  supplier: SupplierType
  categoryUid: String
  category: StockCategoryType
  hazardUid: String
  hazard: HazardType
  storeRoomUid: String
  storeRoom: StoreRoomType
  lotNumber: String
  batch: String
  size: Int
  unitUid: String
  unit: StockUnitType
  packagingUid: String
  packaging: StockPackagingType
  price: Int
  quantityReceived: Int
  remaining: Int
  dateReceived: DateTime
  expiryDate: DateTime
  receivedByUid: String
  receivedBy: UserType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockProductEdge {
  cursor: String!
  node: StockProductType!
}

type StockProductCursorPage {
  pageInfo: PageInfo!
  edges: [StockProductEdge!]
  items: [StockProductType!]
  totalCount: Int!
}

type StockOrderType {
  uid: String!
  fullfilledByUid: String
  fullfilledBy: UserType
  orderByUid: String
  orderBy: UserType
  departmentUid: String
  department: DepartmentType
  status: String
  remarks: String
  orderNumber: String
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockOrderEdge {
  cursor: String!
  node: StockOrderType!
}

type StockOrderCursorPage {
  pageInfo: PageInfo!
  edges: [StockOrderEdge!]
  items: [StockOrderType!]
  totalCount: Int!
}

type StockOrderProductType {
  uid: String!
  productUid: String
  product: StockProductType
  orderUid: String
  order: StockOrderType
  price: Int
  quantity: Int
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockTransactionType {
  uid: String!
  productUid: String
  product: StockProductType
  issued: Int
  issuedToUid: String
  issuedTo: UserType
  departmentUid: String
  department: DepartmentType
  dateIssued: DateTime
  transactionByUid: String
  transactionBy: UserType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockTransactionEdge {
  cursor: String!
  node: StockTransactionType!
}

type StockTransactionCursorPage {
  pageInfo: PageInfo!
  edges: [StockTransactionEdge!]
  items: [StockTransactionType!]
  totalCount: Int!
}

type StockAdjustmentType {
  uid: String!
  productUid: String
  product: StockProductType
  adjustmentType: String
  adjust: Int
  adjustmentDate: DateTime
  remarks: String
  adjustmentByUid: String
  adjustmentBy: UserType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type StockAdjustmentEdge {
  cursor: String!
  node: StockAdjustmentType!
}

type StockAdjustmentCursorPage {
  pageInfo: PageInfo!
  edges: [StockAdjustmentEdge!]
  items: [StockAdjustmentType!]
  totalCount: Int!
}

type MessageThreadType {
  uid: String!
  recipients: [UserType!]!
  messages: [MessageType!]
  broadcast: Boolean!
  deletedBy: [UserType!]
  createdByUid: String
  createdAt: DateTime
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type MessageType {
  uid: String!
  threadUid: String!
  thread: MessageThreadType
  body: String!
  viewers: [UserType!]
  deletedBy: [UserType!]
  parentId: String!
  parent: MessageType
  left: Int!
  right: Int!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type NoticeType {
  uid: String!
  departments: [DepartmentType!]
  groups: [GroupType!]
  title: String!
  body: String!
  viewers: [UserType!]
  expiry: String!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type UnknownObjectType {
  message: String!
}

type ActivityFeedType {
  uid: String!
  name: String!
  subscribers: [UserType!]
}

type ActivityStreamType {
  uid: String!
  feeds: [ActivityFeedType!]
  actorUid: String
  actor: UserType
  verb: String
  actionObjectType: String
  actionObjectUid: String
  targetUid: String
  target: String
  viewers: [UserType!]
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  actionObject: WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType!
}

union WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType = WorkSheetType | SampleType | AnalysisResultType | ReportMetaType | UnknownObjectType

type NotificationType {
  uid: String!
  departments: DepartmentType
  groups: GroupType
  users: UserType
  message: String!
  viewers: UserType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
}

type IdentificationType {
  uid: String!
  name: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type PatientIdentificationType {
  uid: String!
  patientUid: String!
  identificationUid: String!
  identification: IdentificationType
  value: String!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type PatientType {
  uid: String!
  clientPatientId: String!
  patientId: String!
  clientUid: String!
  client: ClientType
  firstName: String
  middleName: String
  lastName: String
  gender: String
  age: Int
  dateOfBirth: DateTime
  ageDobEstimated: Boolean!
  phoneMobile: String
  phoneHome: String
  consentSms: Boolean!
  email: String
  internalUse: Boolean!
  active: Boolean!
  districtUid: String
  district: DistrictType
  provinceUid: String
  province: ProvinceType
  countryUid: String
  country: CountryType
  identifications: [PatientIdentificationType]!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type PatientEdge {
  cursor: String!
  node: PatientType!
}

type PatientCursorPage {
  pageInfo: PageInfo!
  edges: [PatientEdge!]
  items: [PatientType!]
  totalCount: Int!
}

type ReflexRuleType {
  uid: String!
  name: String!
  description: String!
  reflexActions: [ReflexActionType!]
  createdByUid: String
  createdBy: UserType
  createdAt: String
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ReflexRuleEdge {
  cursor: String!
  node: ReflexRuleType!
}

type ReflexRuleCursorPage {
  pageInfo: PageInfo!
  edges: [ReflexRuleEdge!]
  items: [ReflexRuleType!]
  totalCount: Int!
}

type ReflexBrainAdditionType {
  analysisUid: String!
  analysis: AnalysisType
  reflexBrainUid: String!
  reflexBrain: ReflexBrainType
  count: Int!
}

type ReflexBrainCriteriaType {
  analysisUid: String!
  analysis: AnalysisType
  reflexBrainUid: String!
  reflexBrain: ReflexBrainType
  operator: String!
  value: String!
}

type ReflexBrainFinalType {
  analysisUid: String!
  analysis: AnalysisType
  reflexBrainUid: String!
  reflexBrain: ReflexBrainType
  value: String!
}

type ReflexBrainType {
  reflexActionUid: String!
  reflexAction: ReflexBrainType
  uid: String!
  description: String!
  analysesValues: [ReflexBrainCriteriaType!]
  addNew: [ReflexBrainAdditionType!]
  finalise: [ReflexBrainFinalType!]
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ReflexActionType {
  uid: String!
  level: Int!
  description: String!
  analyses: [AnalysisType!]
  sampleTypeUid: String
  sampleType: SampleTypeTyp
  reflexRuleUid: String!
  reflexRule: ReflexRuleType
  brains: [ReflexBrainType!]
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type LaboratoryType {
  uid: String!
  setupName: String!
  labName: String!
  labManagerUid: String
  labManager: UserType
  code: String
  email: String
  emailCc: String
  mobilePhone: String
  businessPhone: String
  address: String
  logo: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type LaboratorySettingType {
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
  uid: String!
  laboratoryUid: String!
  laboratory: LaboratoryType!
  allowSelfVerification: Boolean
  allowPatientRegistration: Boolean
  allowSampleRegistration: Boolean
  allowWorksheetCreation: Boolean
  defaultRoute: String
  passwordLifetime: Int
  defaultTatMinutes: Int
  inactivityLogOut: Int
  defaultTheme: String
  autoReceiveSamples: Boolean
  stickerCopies: Int
  allowAutoBilling: Boolean
  allowBilling: Boolean
  currency: String
}

type SupplierType {
  uid: String!
  name: String
  description: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ManufacturerType {
  uid: String!
  name: String
  description: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type UnitType {
  uid: String!
  name: String!
  isSiUnit: Boolean!
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type CountryType {
  uid: String!
  name: String
  code: String
  active: String
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ProvinceType {
  uid: String!
  code: String
  name: String
  email: String
  emailCc: String
  mobilePhone: String
  businessPhone: String
  active: Boolean
  countryUid: String
  country: CountryType
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ProvinceEdge {
  cursor: String!
  node: ProvinceType!
}

type ProvinceCursorPage {
  pageInfo: PageInfo!
  edges: [ProvinceEdge!]
  items: [ProvinceType!]
  totalCount: Int!
}

type DistrictType {
  uid: String!
  code: String
  name: String
  email: String
  emailCc: String
  mobilePhone: String
  businessPhone: String
  active: Boolean
  provinceUid: String
  province: ProvinceType
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type DistrictEdge {
  cursor: String!
  node: DistrictType!
}

type DistrictCursorPage {
  pageInfo: PageInfo!
  edges: [DistrictEdge!]
  items: [DistrictType!]
  totalCount: Int!
}

type DepartmentType {
  uid: String!
  name: String
  description: String
  code: String
  createdByUid: String
  createdAt: DateTime
  updatedByUid: String
  updatedAt: DateTime
}

type ReferralLaboratoryType {
  uid: String!
  name: String
  code: String
  url: String
  username: String
  password: String
  isReference: Boolean
  isReferral: Boolean
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ShipmentType {
  uid: String!
  shipmentId: String
  comment: String
  courier: String
  assignedCount: Int
  data: JSONScalar
  samples: [SampleType!]
  shippedSamples: [ShippedSampleType!]
  state: String
  incoming: Boolean
  laboratoryUid: String
  laboratory: ReferralLaboratoryType
  jsonContent: JSONScalar
  pdfContent: BytesScalar
  finalisedByUid: String
  finalisedBy: UserType
  dateFinalised: DateTime
  dispatchedByUid: String
  dispatchedBy: UserType
  dateDispatched: DateTime
  recalledByUid: String
  recalledBy: UserType
  dateRecalled: DateTime
  rejectedByUid: String
  rejectedBy: UserType
  dateRejected: DateTime
  receivedByUid: String
  receivedBy: UserType
  dateReceived: DateTime
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type ShipmentEdge {
  cursor: String!
  node: ShipmentType!
}

type ShipmentCursorPage {
  pageInfo: PageInfo!
  edges: [ShipmentEdge!]
  items: [ShipmentType!]
  totalCount: Int!
}

type ShippedSampleType {
  sampleUid: String!
  sample: SampleType!
  shipmentUid: String!
  shipment: ShipmentType!
  resultNotified: Boolean
  extSampleUid: String
  extSampleId: String
}

type StoreRoomType {
  uid: String!
  name: String!
  description: String
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  tag: String!
  children: [StorageLocationType]!
}

type StorageLocationType {
  uid: String!
  name: String!
  description: String
  storeRoomUid: String!
  storeRoom: StoreRoomType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  tag: String!
  children: [StorageSectionType]!
}

type StorageSectionType {
  uid: String!
  name: String!
  description: String
  storageLocationUid: String!
  storageLocation: StorageLocationType
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  tag: String!
  children: [StorageContainerType]!
}

type StorageContainerType {
  uid: String!
  name: String!
  description: String
  storageSectionUid: String!
  storageSection: StorageSectionType
  grid: Boolean
  rowWise: Boolean
  cols: Int
  rows: Int
  slots: Int
  storedCount: Int
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  tag: String!
}

type UserAuthType {
  uid: String!
  userName: String!
  loginRetry: Int!
  isBlocked: Boolean!
  userType: String
  createdAt: DateTime
  creatorName: String
  creatorUid: String
  updatedAt: DateTime
  updatorName: String
  updatorUid: String
}

type PermissionType {
  uid: String!
  action: String
  target: String
  active: Boolean
}

type GroupType {
  uid: String!
  name: String
  keyword: String
  members: [UserType!]
  permissions: [PermissionType!]
  active: Boolean
  pages: String
}

type UserType {
  uid: String!
  firstName: String
  lastName: String
  email: String
  mobilePhone: String
  businessPhone: String
  groups: [GroupType!]
  preferenceUid: String
  preference: UserPreferenceType
  isActive: Boolean!
  isSuperuser: Boolean!
  authUid: String
  auth: UserAuthType
  bio: String
  avatar: String
  defaultRoute: String
  createdAt: DateTime
  creatorName: String
  creatorUid: String
  updatedAt: DateTime
  updatorName: String
  updatorUid: String
}

type AuthenticatedData {
  user: UserType!
  token: String!
  refresh: String!
  tokenType: String!
}

type UpdatedGroupPerms {
  group: GroupType!
  permission: PermissionType!
}

type UserEdge {
  cursor: String!
  node: UserType!
}

type UserCursorPage {
  pageInfo: PageInfo!
  edges: [UserEdge!]
  items: [UserType!]
  totalCount: Int!
}

type UserPreferenceType {
  uid: String!
  expandedMenu: Boolean
  departments: [DepartmentType!]
  theme: String
}

type WorkSheetTemplateType {
  uid: String!
  worksheetType: String!
  reserved: JSONScalar
  numberOfSamples: Int
  rows: Int
  cols: Int
  rowWise: Boolean!
  state: String
  name: String!
  description: String
  analysisUid: String
  analysis: AnalysisType
  qcTemplateUid: String
  qcTemplate: QCTemplateType
  qcLevels: [QCLevelType!]
  instrumentUid: String
  instrument: InstrumentType
  sampleTypeUid: String
  sampleType: SampleTypeTyp
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type WorkSheetType {
  uid: String!
  worksheetType: String!
  reserved: JSONScalar
  numberOfSamples: Int
  rows: Int
  cols: Int
  rowWise: Boolean!
  state: String
  templateUid: String
  template: WorkSheetTemplateType
  analystUid: String
  analyst: UserType
  worksheetId: String!
  analysisUid: String
  analysis: AnalysisType
  instrumentUid: String
  instrument: InstrumentType
  sampleTypeUid: String
  sampleType: SampleTypeTyp
  assignedCount: Int!
  analysisResults: [AnalysisResultType!]
  submittedByUid: String
  submittedBy: UserType
  dateSubmitted: DateTime
  verifiedByUid: String
  verifiedBy: UserType
  dateVerified: DateTime
  createdByUid: String
  createdBy: UserType
  createdAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  updatedAt: DateTime
}

type WorkSheetEdge {
  cursor: String!
  node: WorkSheetType!
}

type WorkSheetCursorPage {
  pageInfo: PageInfo!
  edges: [WorkSheetEdge!]
  items: [WorkSheetType!]
  totalCount: Int!
}

type AnalysisPriceType {
  uid: String!
  analysisUid: String!
  analysis: AnalysisType!
  isActive: Boolean!
  amount: Float!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type ProfilePriceType {
  uid: String!
  profileUid: String!
  profile: ProfileType!
  isActive: Boolean!
  amount: Float!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type AnalysisDiscountType {
  uid: String!
  analysisUid: String!
  analysis: AnalysisType!
  name: String!
  discountType: String!
  valueType: String!
  startDate: DateTime!
  endDate: DateTime!
  voucherUid: String!
  voucher: VoucherType!
  valuePercent: Float!
  valueAmount: Float!
  isActive: Boolean!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type ProfileDiscountType {
  uid: String!
  profileUid: String!
  profile: ProfileType!
  name: String!
  discountType: String!
  valueType: String!
  startDate: DateTime!
  endDate: DateTime!
  voucherUid: String!
  voucher: VoucherType!
  valuePercent: Float!
  valueAmount: Float!
  isActive: Boolean!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type VoucherType {
  uid: String!
  name: String!
  usageLimit: Int!
  used: Int!
  startDate: DateTime!
  endDate: DateTime!
  oncePerCustomer: Boolean!
  oncePerOrder: Boolean!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type VoucherCodeType {
  uid: String!
  code: String!
  voucherUid: String!
  voucher: VoucherType!
  usageLimit: Int!
  used: Int!
  isActive: Boolean!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type VoucherCustomerType {
  uid: String!
  patientUid: String!
  patient: PatientType!
  voucherCodeUid: String!
  voucherCode: VoucherCodeType!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type TestBillType {
  uid: String!
  billId: String!
  patientUid: String!
  patient: PatientType!
  clientUid: String!
  client: ClientType!
  isActive: Boolean!
  toConfirm: Boolean!
  partial: Boolean!
  totalCharged: Float!
  jsonContent: JSONScalar
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
  orders: AnalysisRequestType!
}

type TestBillEdge {
  cursor: String!
  node: TestBillType!
}

type TestBillCursorPage {
  pageInfo: PageInfo!
  edges: [TestBillEdge!]
  items: [TestBillType!]
  totalCount: Int!
}

type TestBillTransactionType {
  uid: String!
  testBillUid: String!
  testBill: TestBillType!
  kind: String!
  amount: Float!
  error: Boolean!
  isSuccess: Boolean!
  actionRequired: String!
  processed: Boolean!
  notes: String!
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type TestBillInvoiceType {
  uid: String!
  testBillUid: String!
  testBill: TestBillType!
  jsonContent: JSONScalar
  pdfContent: BytesScalar
  createdAt: DateTime
  createdByUid: String
  createdBy: UserType
  updatedAt: DateTime
  updatedByUid: String
  updatedBy: UserType
}

type Query {
  laboratory(setupName: String!): LaboratoryType!
  laboratorySetting(setupName: String!): LaboratorySettingType!
  manufacturerAll: [ManufacturerType!]!
  supplierAll: [SupplierType!]!
  departmentAll: [DepartmentType!]!
  districtAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): DistrictCursorPage!
  provinceAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): ProvinceCursorPage!
  countryAll: [CountryType!]!
  unitAll: [UnitType!]!
  manufacturerByUid(uid: String!): ManufacturerType!
  supplierByUid(uid: String!): SupplierType!
  departmentByUid(uid: String!): DepartmentType!
  districtByUid(uid: String!): DistrictType!
  districtsByProvinceUid(uid: String!): [DistrictType!]!
  provinceByUid(uid: String!): ProvinceType!
  provincesByCountryUid(uid: String!): [ProvinceType!]!
  countryByUid(uid: String!): CountryType!
  unitByUid(uid: String!): UnitType!
  auditLogsFilter(targetType: String!, targetId: String!): [AuditLogType!]!
  userAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): UserCursorPage!
  userMe(token: String!): UserType
  userByEmail(email: String!): UserType
  groupAll: [GroupType!]!
  groupByUid(uid: String!): GroupType
  permissionAll: [PermissionType!]!
  permissionByUid(uid: String!): PermissionType
  clientAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): ClientCursorPage!
  clientByUid(uid: String!): ClientType!
  clientByCode(code: String!): ClientType!
  clientsByName(name: String!): [ClientType!]!
  clientSearch(queryString: String!): [ClientType!]!
  clientContactAll: [ClientContactType!]!
  clientContactUid(uid: String!): ClientContactType!
  clientContactByClientUid(clientUid: String!): [ClientContactType!]!
  patientAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): PatientCursorPage!
  patientByUid(uid: String!): PatientType
  patientByPatientId(patientId: String!): PatientType
  patientSearch(queryString: String!): [PatientType!]!
  identificationAll: [IdentificationType!]!
  identificationByUid(uid: String!): IdentificationType!
  codingStandardAll: [CodingStandardType!]!
  sampleTypeAll: [SampleTypeTyp!]!
  sampleTypeByUid(uid: String!): SampleTypeTyp!
  sampleTypeMappingsBySampleType(sampleTypeUid: String!): [SampleTypeMappingType!]!
  sampleAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, status: String = null, clientUid: String = null, sortBy: [String!] = null): SampleCursorPage!
  samplesForShipmentAssign(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null, analysisUid: String = null, sampleTypeUid: String = null): SampleCursorPage!
  sampleSearch(status: String!, text: String!, clientUid: String!): [SampleType!]!
  sampleCount(status: String!, text: String!, clientUid: String!): Int!
  sampleByUid(uid: String!): SampleType!
  sampleByParentId(parentId: String!, text: String = null): [SampleType!]!
  samplesByUids(sampleUids: [String!]! = []): [SamplesWithResults!]!
  samplesByStorageContainerUid(uid: String!): [SampleType!]!
  profileAll: [ProfileType!]!
  profileByUid(uid: String!): ProfileType!
  profileMappingsByProfile(profileUid: String!): [ProfileMappingType!]!
  analysisCategoryAll: [AnalysisCategoryType!]!
  analysisCategoryByUid(uid: String!): AnalysisCategoryType!
  analysisAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null, qcOnly: Boolean = false): AnalysisCursorPage!
  analysisByUid(uid: String!): AnalysisType!
  analysisMappingsByAnalysis(analysisUid: String!): [AnalysisMappingType!]!
  analysisWithoutProfile: [AnalysisType!]!
  analysisRequestAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): AnalysisRequestCursorPage!
  analysisRequestByUid(uid: String!): AnalysisRequestWithSamples!
  analysisRequestsByPatientUid(uid: String!): [AnalysisRequestWithSamples!]!
  analysisRequestsByClientUid(uid: String!): [AnalysisRequestWithSamples!]!
  analysisResultByUid(uid: String!): AnalysisResultType!
  analysisResultBySampleUid(uid: String!): [AnalysisResultType!]!
  analysisResultsForWsAssign(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null, analysisUid: String = null, sampleTypeUid: String = null): AnalysisResultCursorPage!
  analysisInterimAll: [AnalysisInterimType!]!
  analysisInterimByUid(uid: String!): AnalysisInterimType!
  analysisCorrectionFactorAll: [AnalysisCorrectionFactorType!]!
  analysisCorrectionFactorByUid(uid: String!): AnalysisCorrectionFactorType!
  analysisUncertaintyAll: [AnalysisUncertaintyType!]!
  analysisUncertaintyByUid(uid: String!): AnalysisUncertaintyType!
  analysisDetectionLimitAll: [AnalysisDetectionLimitType!]!
  analysisDetectionLimitByUid(uid: String!): AnalysisDetectionLimitType!
  analysisSpecificationAll: [AnalysisSpecificationType!]!
  analysisSpecificationUid(uid: String!): AnalysisSpecificationType!
  qcSetAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): QCSetCursorPage!
  qcSetByUid(uid: String!): QCSetWithSamples!
  qcLevelAll: [QCLevelType!]!
  qcLevelByUid(uid: String!): QCLevelType!
  qcTemplateAll: [QCTemplateType!]!
  qcTemplateByUid(uid: String!): QCTemplateType!
  resultOptionsByAnalysisUid(uid: String!): ResultOptionType!
  rejectionReasonsAll: [RejectionReasonType!]!
  rejectionReasonByUid(uid: String!): RejectionReasonType!
  worksheetAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, status: String = null, sortBy: [String!] = null): WorkSheetCursorPage!
  worksheetTemplateAll: [WorkSheetTemplateType!]!
  worksheetByAnalyst(analystUid: String!): [WorkSheetType!]!
  worksheetByUid(worksheetUid: String!): WorkSheetType!
  worksheetById(worksheetId: String!): WorkSheetType!
  worksheetByStatus(worksheetStatus: String!): [WorkSheetType!]!
  worksheetTemplateByUid(worksheetUid: String!): [WorkSheetType!]!
  threadsForUser(uid: String!): [MessageThreadType!]
  threadByUid(uid: String!): MessageThreadType
  noticeByUid(uid: String!): NoticeType
  noticesByCreator(uid: String!): [NoticeType!]
  noticeFilter(groupUid: String, departmentUid: String): [NoticeType!]!
  notificationFilter(groupUid: String, departmentUid: String, userUid: String): [NotificationType!]!
  notificationByUid(uid: String!): NotificationType
  countSampleGroupByStatus: GroupedCounts!
  countSampleGroupByAction(startDate: String = null, endDate: String = null): GroupedData!
  countAnalyteGroupByStatus: GroupedCounts!
  countWorksheetGroupByStatus: GroupedCounts!
  countExtrasGroupByStatus: GroupedCounts!
  countAnalyteGroupByInstrument(startDate: String = null, endDate: String = null): GroupedCounts!
  sampleProcessPerformance(startDate: String!, endDate: String!): ProcessStatistics!
  analysisProcessPerformance(process: String!, startDate: String!, endDate: String!): ProcessStatistics!
  sampleLaggards: LaggardStatistics!
  reflexRuleAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): ReflexRuleCursorPage!
  reflexRuleByUid(uid: String!): ReflexRuleType
  storeRoomAll: [StoreRoomType!]!
  storeRoomByUid(uid: String!): StoreRoomType
  storageLocations(storeRoomUid: String!): [StorageLocationType!]!
  storageLocationByUid(uid: String!): StorageLocationType
  storageSections(storageLocationUid: String!): [StorageSectionType!]!
  storageSectionByUid(uid: String!): StorageSectionType
  storageContainers(storageSectionUid: String!): [StorageContainerType!]!
  storageContainerByUid(uid: String!): StorageContainerType
  stockItemAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): StockItemCursorPage!
  stockItemByUid(uid: String!): StockItemType
  stockCategoryAll: [StockCategoryType!]!
  stockCategoryByUid(uid: String!): StockCategoryType
  hazardAll: [HazardType!]!
  hazardByUid(uid: String!): HazardType
  stockUnitAll: [StockUnitType!]!
  stockUnitByUid(uid: String!): StockUnitType
  stockPackagingAll: [StockPackagingType!]!
  stockPackagingByUid(uid: String!): StockPackagingType
  stockProductAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): StockProductCursorPage!
  stockProductByUid(uid: String!): StockProductType
  stockOrderAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, status: String = null, text: String = null, sortBy: [String!] = null): StockOrderCursorPage!
  stockOrderByUid(uid: String!): StockOrderType
  stockOrderProductAll(stockOrderUid: String!): [StockOrderProductType!]!
  stockOrderProductByUid(uid: String!): StockOrderProductType
  stockTransactionAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): StockTransactionCursorPage!
  stockTransactionByUid(uid: String!): StockTransactionType
  stockAdjustmentAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): StockAdjustmentCursorPage!
  stockAdjustmentByUid(uid: String!): StockAdjustmentType
  impressReportsMeta(uids: [String!]!): [ReportImpressType!]!
  impressReportsDownload(uids: [String!]!): BytesScalar
  impressReportDownload(uid: String!): BytesScalar
  instrumentTypeAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): InstrumentTypeCursorPage!
  instrumentAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): InstrumentCursorPage!
  methodAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, sortBy: [String!] = null): MethodCursorPage!
  instrumentTypeByUid(uid: String!): InstrumentTypeType!
  instrumentByUid(uid: String!): InstrumentType!
  methodByUid(uid: String!): MethodType!
  shipmentAll(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, incoming: Boolean! = false, status: String = null, sortBy: [String!] = null): ShipmentCursorPage!
  shipmentByUid(shipmentUid: String!): ShipmentType!
  shipmentById(shipmentId: String!): ShipmentType!
  shipmentByStatus(shipmentStatus: String!): [ShipmentType!]!
  referralLaboratoryAll: [ReferralLaboratoryType!]!
  referralLaboratoryByUid(uid: String!): ReferralLaboratoryType!
  referralLaboratoryByCode(code: String!): ReferralLaboratoryType!
  manifestReportDownload(uid: String!): BytesScalar
  bills(pageSize: Int = null, afterCursor: String = null, beforeCursor: String = null, text: String = null, isActive: Boolean = null, partial: Boolean = null, clientUid: String = null, sortBy: [String!] = null): TestBillCursorPage!
  billByUid(uid: String!): TestBillType
  billsForPatient(patientUid: String!): [TestBillType!]
  billsForClient(clientUid: String!): [TestBillType!]
  billTransactions(billUid: String!): [TestBillTransactionType!]
  billInvoices(billUid: String!): [TestBillInvoiceType!]
  billInvoice(invoiceUid: String!): TestBillInvoiceType
  priceForProfile(profileUid: String!): ProfilePriceType
  priceForAnalysis(analysisUid: String!): AnalysisPriceType
  discountForProfile(profileUid: String!): ProfileDiscountType
  discountForAnalysis(analysisUid: String!): AnalysisDiscountType
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, groupUid: String = null, openReg: Boolean = false): UserResponse!
  updateUser(userUid: String!, firstName: String, lastName: String, mobilePhone: String, email: String, groupUid: String, isActive: Boolean): UserResponse!
  createUserAuth(userUid: String!, userName: String!, password: String!, passwordc: String!): UserResponse!
  updateUserAuth(userUid: String!, userName: String, password: String, passwordc: String): UserResponse!
  authenticateUser(username: String!, password: String!): AuthenticatedDataResponse!
  refresh(refreshToken: String!): AuthenticatedDataResponse!
  unlinkUserAuth(userUid: String!): UserResponse!
  recoverPassword(username: String!): MessageResponse!
  createGroup(payload: GroupInputType!): GroupResponse!
  updateGroup(uid: String!, payload: GroupInputType!): GroupResponse!
  updateGroupPermissions(groupUid: String!, permissionUid: String!): UpdatedGroupPermsResponse!
  updateLaboratory(uid: String!, payload: LaboratoryInputType!): LaboratoryResponse!
  updateLaboratorySetting(uid: String!, payload: LaboratorySettingInputType!): LaboratorySettingResponse!
  createDepartment(payload: DepartmentInputType!): DepartmentResponse!
  updateDepartment(uid: String!, payload: DepartmentInputType!): DepartmentResponse!
  createSupplier(payload: SupplierInputType!): SupplierResponse!
  updateSupplier(uid: String!, payload: SupplierInputType!): SupplierResponse!
  createManufacturer(payload: ManufacturerInputType!): ManufacturerResponse!
  updateManufacturer(uid: String!, payload: ManufacturerInputType!): ManufacturerResponse!
  createCountry(payload: CountryInputType!): CountryResponse!
  updateCountry(uid: String!, payload: CountryInputType!): CountryResponse!
  createProvince(payload: ProvinceInputType!): ProvinceResponse!
  updateProvince(uid: String!, payload: ProvinceInputType!): ProvinceResponse!
  createDistrict(payload: DistrictInputType!): DistrictResponse!
  updateDistrict(uid: String!, payload: DistrictInputType!): DistrictResponse!
  createUnit(payload: UnitInputType!): UnitResponse!
  updateUnit(uid: String!, payload: UnitInputType!): UnitResponse!
  createClient(payload: ClientInputType!): ClientResponse!
  updateClient(uid: String!, payload: ClientInputType!): ClientResponse!
  createClientContact(payload: ClientContactInputType!): ClientContactResponse!
  updateClientContact(uid: String!, payload: ClientContactInputType!): ClientContactResponse!
  deleteClientContact(uid: String!): DeleteContactResponse!
  createIdentification(name: String!): IdentificationResponse!
  updateIdentification(uid: String!, name: String!): IdentificationResponse!
  createPatient(payload: PatientInputType!): PatientResponse!
  updatePatient(uid: String!, payload: PatientInputType!): PatientResponse!
  createCodingStandard(payload: CodingStandardInputType!): CodingStandardResponse!
  updateCodingStandard(uid: String!, payload: CodingStandardInputType!): CodingStandardResponse!
  createSampleType(payload: SampleTypeInputType!): SampleTypeResponse!
  updateSampleType(uid: String!, payload: SampleTypeInputType!): SampleTypeResponse!
  createSampleTypeMapping(payload: SampleTypeMappingInputType!): SampleTypeMappingResponse!
  updateSampleTypeMapping(uid: String!, payload: SampleTypeMappingInputType!): SampleTypeMappingResponse!
  createResultOption(payload: ResultOptionInputType!): ResultOptionResponse!
  updateResultOption(uid: String!, payload: ResultOptionInputType!): ResultOptionResponse!
  createRejectionReason(reason: String!): RejectionReasonResponse!
  updateRejectionReason(uid: String!, reason: String!): RejectionReasonResponse!
  createAnalysisCategory(payload: AnalysisCategoryInputType!): AnalysisCategoryResponse!
  updateAnalysisCategory(uid: String!, payload: AnalysisCategoryInputType!): AnalysisCategoryResponse!
  createProfile(payload: ProfileInputType!): AnalysisProfileResponse!
  updateProfile(uid: String!, payload: ProfileInputType!): AnalysisProfileResponse!
  createProfileMapping(payload: ProfileMappingInputType!): ProfileMappingResponse!
  updateProfileMapping(uid: String!, payload: ProfileMappingInputType!): ProfileMappingResponse!
  createAnalysis(payload: AnalysisInputType!): ProfilesServiceResponse!
  updateAnalysis(uid: String!, payload: AnalysisInputType!): ProfilesServiceResponse!
  createAnalysisMapping(payload: AnalysisMappingInputType!): AnalysisMappingResponse!
  updateAnalysisMapping(uid: String!, payload: AnalysisMappingInputType!): AnalysisMappingResponse!
  createAnalysisRequest(payload: AnalysisRequestInputType!): AnalysisRequestResponse!
  createAnalysisInterim(payload: AnalysisInterimInput!): AnalysisInterimResponse!
  updateAnalysisInterim(uid: String!, payload: AnalysisInterimInput!): AnalysisInterimResponse!
  createAnalysisUncertainty(payload: AnalysisUncertaintyInput!): AnalysisUncertaintyResponse!
  updateAnalysisUncertainty(uid: String!, payload: AnalysisUncertaintyInput!): AnalysisUncertaintyResponse!
  createAnalysisCorrectionFactor(payload: AnalysisCorrectionFactorInput!): AnalysisCorrectionFactorResponse!
  updateAnalysisCorrectionFactor(uid: String!, payload: AnalysisCorrectionFactorInput!): AnalysisCorrectionFactorResponse!
  createAnalysisDetectionLimit(payload: AnalysisDetectionLimitInput!): AnalysisDetectionLimitResponse!
  updateAnalysisDetectionLimit(uid: String!, payload: AnalysisDetectionLimitInput!): AnalysisDetectionLimitResponse!
  createAnalysisSpecification(payload: AnalysisSpecificationInput!): AnalysisSpecificationResponse!
  updateAnalysisSpecification(uid: String!, payload: AnalysisSpecificationInput!): AnalysisSpecificationResponse!
  cloneSamples(samples: [String!]!): SampleActionResponse!
  cancelSamples(samples: [String!]!): ResultedSampleActionResponse!
  reInstateSamples(samples: [String!]!): ResultedSampleActionResponse!
  receiveSamples(samples: [String!]!): ResultedSampleActionResponse!
  verifySamples(samples: [String!]!): SampleActionResponse!
  rejectSamples(samples: [SampleRejectInputType!]!): SampleActionResponse!
  publishSamples(samples: [SamplePublishInputType!]!): SuccessErrorResponse!
  printSamples(samples: [String!]!): SampleActionResponse!
  invalidateSamples(samples: [String!]!): SampleActionResponse!
  submitAnalysisResults(analysisResults: [ARResultInputType!]!, sourceObject: String!, sourceObjectUid: String!): AnalysisResultSubmitResponse!
  verifyAnalysisResults(analyses: [String!]!, sourceObject: String!, sourceObjectUid: String!): AnalysisResultSubmitResponse!
  retractAnalysisResults(analyses: [String!]!): AnalysisResultResponse!
  retestAnalysisResults(analyses: [String!]!): AnalysisResultResponse!
  cancelAnalysisResults(analyses: [String!]!): AnalysisResultResponse!
  reInstateAnalysisResults(analyses: [String!]!): AnalysisResultResponse!
  createQcSet(samples: [QCSetInputType!]!): QCSetResponse!
  createQcLevel(level: String!): QCLevelResponse!
  updateQcLevel(uid: String!, level: String!): QCLevelResponse!
  createQcTemplate(payload: QCTemplateInputType!): QCTemplateResponse!
  updateQcTemplate(uid: String!, payload: QCTemplateInputType!): QCTemplateResponse!
  createWorksheetTemplate(payload: WorksheetTemplateInputType!): WorkSheetTemplateResponse!
  updateWorksheetTemplate(uid: String!, payload: WorksheetTemplateInputType!): WorkSheetTemplateResponse!
  createWorksheet(templateUid: String!, analystUid: String!, count: Int = 1): WorkSheetsResponse!
  updateWorksheet(worksheetUid: String!, analystUid: String = null, instrumentUid: String = null, methodUid: String = null, action: String = null, samples: [String!] = null): WorkSheetResponse!
  updateWorksheetApplyTemplate(templateUid: String!, worksheetUid: String!): WorkSheetResponse!
  updateWorksheetManualAssign(uid: String!, analysesUids: [String!]!, qcTemplateUid: String = null): WorkSheetResponse!
  sendMessage(recipients: [String!]!, body: String!): MessageResponse!
  replyMessage(threadUid: String!, body: String!): MessageResponse!
  viewMessage(uid: String!): MessageResponse!
  deleteMessage(uid: String!): DeleteResponse!
  deleteThread(uid: String!): DeleteResponse!
  createNotice(payload: NoticeInputType!): NoticeResponse!
  updateNotice(uid: String!, payload: NoticeInputType!): NoticeResponse!
  viewNotice(uid: String!, viewer: String!): NoticeType!
  deleteNotice(uid: String!): DeleteResponse!
  createReflexRule(payload: ReflexRuleInput!): ReflexRuleResponse!
  updateReflexRule(uid: String!, payload: ReflexRuleInput!): ReflexRuleResponse!
  createReflexAction(payload: ReflexActionInput!): ReflexActionResponse!
  updateReflexAction(uid: String!, payload: ReflexActionInput!): ReflexActionResponse!
  createReflexBrain(payload: ReflexBrainInput!): ReflexBrainResponse!
  updateReflexBrain(uid: String!, payload: ReflexBrainInput!): ReflexBrainResponse!
  createStoreRoom(payload: StoreRoomInputType!): StoreRoomResponse!
  updateStoreRoom(uid: String!, payload: StoreRoomInputType!): StoreRoomResponse!
  createStorageLocation(payload: StorageLocationInputType!): StorageLocationResponse!
  updateStorageLocation(uid: String!, payload: StorageLocationInputType!): StorageLocationResponse!
  createStorageSection(payload: StorageSectionInputType!): StorageSectionResponse!
  updateStorageSection(uid: String!, payload: StorageSectionInputType!): StorageSectionResponse!
  createStorageContainer(payload: StorageContainerInputType!): StorageContainerResponse!
  updateStorageContainer(uid: String!, payload: StorageContainerInputType!): StorageContainerResponse!
  storeSamples(payload: [StoreSamplesInputType!]!): StoreSampleResponse!
  recoverSamples(sampleUids: [String!]!): StoreSampleResponse!
  createStockItem(payload: StockItemInputType!): StockItemResponse!
  updateStockItem(uid: String!, payload: StockItemInputType!): StockItemResponse!
  createStockCategory(payload: StockCategoryInputType!): StockCategoryResponse!
  updateStockCategory(uid: String!, payload: StockCategoryInputType!): StockCategoryResponse!
  createHazard(payload: HazardInputType!): HazardResponse!
  updateHazard(uid: String!, payload: HazardInputType!): HazardResponse!
  createStockUnit(payload: StockUnitInputType!): StockUnitResponse!
  updateStockUnit(uid: String!, payload: StockUnitInputType!): StockUnitResponse!
  createStockPackaging(payload: StockPackagingInputType!): StockPackagingResponse!
  updateStockPackaging(uid: String!, payload: StockPackagingInputType!): StockPackagingResponse!
  createStockProduct(payload: StockProductInputType!): StockProductResponse!
  updateStockProduct(uid: String!, payload: StockProductInputType!): StockProductResponse!
  createStockOrder(payload: StockOrderInputType!): StockOrderResponse!
  updateStockOrder(uid: String!, payload: StockOrderInputType!): StockOrderResponse!
  submitStockOrder(uid: String!): StockOrderResponse!
  approveStockOrder(uid: String!, payload: StockOrderApprovalInputType!): StockOrderResponse!
  issueStockOrder(uid: String!, payload: [StockOrderProductLineInputType!]!): StockOrderResponse!
  deleteStockOrder(uid: String!): StockOrderResponse!
  createStockTransaction(payload: StockTransactionInputType!): StockTransactionResponse!
  createStockAdjustment(payload: StockAdjustmentInputType!): StockAdjustmentResponse!
  createInstrumentType(payload: InstrumentTypeInputType!): InstrumentTypeResponse!
  updateInstrumentType(uid: String!, payload: InstrumentTypeInputType!): InstrumentTypeResponse!
  createInstrument(payload: InstrumentInputType!): InstrumentResponse!
  updateInstrument(uid: String!, payload: InstrumentInputType!): InstrumentResponse!
  createInstrumentCaliberation(payload: InstrumentCalibrationInput!): InstrumentCalibrationResponse!
  updateInstrumentCaliberation(uid: String!, payload: InstrumentInputType!): InstrumentCalibrationResponse!
  createCaliberationCertificate(payload: CalibrationCertificateInput!): CalibrationCertificateResponse!
  updateCaliberationCertificate(uid: String!, payload: CalibrationCertificateInput!): CalibrationCertificateResponse!
  createMethod(payload: MethodInputType!): MethodResponse!
  updateMethod(uid: String!, payload: MethodInputType!): MethodResponse!
  createShipment(payload: ShipmentInputType!): ShipmentsResponse!
  updateShipment(uid: String!, payload: ShipmentUpdateInputType!): ShipmentResponse!
  actionShipment(uid: String!, action: String!): ShipmentResponse!
  shipmentManageSamples(uid: String!, payload: ShipmentManageSamplesInput!): ShipmentResponse!
  createReferralLaboratory(payload: ReferralLaboratoryInputType!): ReferralLaboratoryResponse!
  updateReferralLaboratory(uid: String!, payload: ReferralLaboratoryInputType!): ReferralLaboratoryResponse!
  updateProfilePrice(uid: String!, payload: PriceInput!): ProfilePriceType!
  updateAnalysisPrice(uid: String!, payload: PriceInput!): AnalysisPriceType!
  updateProfileDiscount(uid: String!, payload: PriceDiscountInput!): ProfileDiscountResponse!
  updateAnalysisDiscount(uid: String!, payload: PriceDiscountInput!): AnalysisDiscountResponse!
  createVoucher(payload: VoucherInput!): VoucherResponse!
  updateVoucher(uid: String!, payload: VoucherInput!): VoucherResponse!
  createVoucherCode(payload: VoucherCodeInput!): VoucherCodeResponse!
  updateVoucherCode(uid: String!, payload: VoucherCodeInput!): VoucherResponse!
  createTestBillTransaction(payload: BillTransactionInput!): TestBillTransactionResponse!
  applyVoucher(payload: ApplyVoucherInput!): TestBillTransactionResponse!
}

""""""
union UserResponse = UserType | OperationError

""""""
union AuthenticatedDataResponse = AuthenticatedData | OperationError

"""Union of possible outcomes when deleting some object"""
union MessageResponse = MessagesType | OperationError

""""""
union GroupResponse = GroupType | OperationError

input GroupInputType {
  name: String!
  pages: String!
  active: Boolean! = true
}

""""""
union UpdatedGroupPermsResponse = UpdatedGroupPerms | OperationError

""""""
union LaboratoryResponse = LaboratoryType | OperationError

input LaboratoryInputType {
  labName: String!
  setupName: String! = "felicity"
  email: String = null
  emailCc: String = null
  mobilePhone: String = null
  businessPhone: String = null
  labManagerUid: String = null
  address: String = null
  logo: String = null
}

""""""
union LaboratorySettingResponse = LaboratorySettingType | OperationError

input LaboratorySettingInputType {
  laboratoryUid: String!
  allowSelfVerification: Boolean = false
  allowPatientRegistration: Boolean = true
  allowSampleRegistration: Boolean = true
  allowWorksheetCreation: Boolean = true
  defaultRoute: String = null
  passwordLifetime: Int = null
  inactivityLogOut: Int = null
  defaultTheme: String = null
  autoReceiveSamples: Boolean = true
  stickerCopies: Int = 2
  allowBilling: Boolean = false
  currency: String = "USD"
}

""""""
union DepartmentResponse = DepartmentType | OperationError

input DepartmentInputType {
  name: String!
  description: String = ""
  code: String = ""
}

""""""
union SupplierResponse = SupplierType | OperationError

input SupplierInputType {
  name: String!
  description: String = ""
  code: String = ""
}

""""""
union ManufacturerResponse = ManufacturerType | OperationError

input ManufacturerInputType {
  name: String!
  description: String = ""
}

""""""
union CountryResponse = CountryType | OperationError

input CountryInputType {
  name: String!
  code: String!
  active: Boolean = true
}

""""""
union ProvinceResponse = ProvinceType | OperationError

input ProvinceInputType {
  name: String
  countryUid: String
  code: String = ""
  email: String = ""
  emailCc: String = ""
  mobilePhone: String = ""
  businessPhone: String = ""
  active: Boolean = true
}

""""""
union DistrictResponse = DistrictType | OperationError

input DistrictInputType {
  name: String!
  provinceUid: String
  code: String = ""
  email: String = ""
  emailCc: String = ""
  mobilePhone: String = ""
  businessPhone: String = ""
  active: Boolean = true
}

""""""
union UnitResponse = UnitType | OperationError

input UnitInputType {
  name: String!
  isSiUnit: Boolean!
}

""""""
union ClientResponse = ClientType | OperationError

input ClientInputType {
  name: String!
  code: String!
  districtUid: String = null
  email: String = null
  emailCc: String = null
  consentEmail: Boolean = false
  phoneMobile: String = null
  phoneBusiness: String = null
  consentSms: Boolean = false
  internalUse: Boolean = false
  active: Boolean = true
}

""""""
union ClientContactResponse = ClientContactType | OperationError

input ClientContactInputType {
  firstName: String!
  clientUid: String!
  lastName: String = null
  email: String = null
  emailCc: String = null
  mobilePhone: String = null
  consentSms: Boolean = false
  isActive: Boolean! = true
}

""""""
union DeleteContactResponse = DeletedItem | OperationError

""""""
union IdentificationResponse = IdentificationType | OperationError

""""""
union PatientResponse = PatientType | OperationError

input PatientInputType {
  clientPatientId: String!
  firstName: String!
  lastName: String!
  clientUid: String!
  gender: String!
  middleName: String = null
  age: Int = null
  dateOfBirth: DateTime = null
  ageDobEstimated: Boolean = false
  phoneMobile: String = null
  phoneHome: String = null
  consentSms: Boolean = false
  internalUse: Boolean = false
  countryUid: String = null
  provinceUid: String = null
  districtUid: String = null
  identifications: [PatientidentificationInput!]
}

input PatientidentificationInput {
  value: String!
  identificationUid: String!
}

""""""
union CodingStandardResponse = CodingStandardType | OperationError

input CodingStandardInputType {
  name: String!
  description: String = ""
}

""""""
union SampleTypeResponse = SampleTypeTyp | OperationError

input SampleTypeInputType {
  name: String!
  abbr: String!
  description: String = ""
  internalUse: Boolean = false
  active: Boolean = true
}

"""Union of possible outcomes when adding a new notice"""
union SampleTypeMappingResponse = SampleTypeMappingType | OperationError

input SampleTypeMappingInputType {
  sampleTypeUid: String!
  codingStandardUid: String!
  name: String!
  code: String!
  description: String = null
}

""""""
union ResultOptionResponse = ResultOptionType | OperationError

input ResultOptionInputType {
  analysisUid: String!
  optionKey: Int!
  value: String!
}

""""""
union RejectionReasonResponse = RejectionReasonType | OperationError

"""Union of possible outcomes when adding a new notice"""
union AnalysisCategoryResponse = AnalysisCategoryType | OperationError

input AnalysisCategoryInputType {
  name: String!
  departmentUid: String = null
  description: String = null
  active: Boolean = true
}

"""Union of possible outcomes when adding a new notice"""
union AnalysisProfileResponse = ProfileType | OperationError

input ProfileInputType {
  name: String!
  description: String! = ""
  departmentUid: String = null
  sampleTypes: [String!]
  services: [String!]
  keyword: String = null
  active: Boolean = true
}

"""Union of possible outcomes when adding a new notice"""
union ProfileMappingResponse = ProfileMappingType | OperationError

input ProfileMappingInputType {
  profileUid: String!
  codingStandardUid: String!
  name: String!
  code: String!
  description: String = null
}

""""""
union ProfilesServiceResponse = AnalysisWithProfiles | OperationError

input AnalysisInputType {
  name: String!
  keyword: String!
  sortKey: Int!
  description: String! = ""
  departmentUid: String = null
  sampleTypes: [String!]
  methods: [String!]
  categoryUid: String = null
  unitUid: String = null
  internalUse: Boolean = false
  tatLengthMinutes: Int!
  precision: Int!
  requiredVerifications: Int! = 1
  selfVerification: Boolean = false
  active: Boolean = true
}

"""Union of possible outcomes when adding a new notice"""
union AnalysisMappingResponse = AnalysisMappingType | OperationError

input AnalysisMappingInputType {
  analysisUid: String!
  codingStandardUid: String!
  name: String!
  code: String!
  description: String = null
}

"""Union of possible outcomes when adding/editing analysis requests """
union AnalysisRequestResponse = AnalysisRequestWithSamples | OperationError

input AnalysisRequestInputType {
  patientUid: String!
  clientUid: String!
  clientContactUid: String!
  clinicalData: String = ""
  samples: [ARSampleInputType!]!
  clientRequestId: String = null
  internalUse: Boolean = false
  priority: Int! = 0
}

input ARSampleInputType {
  sampleType: String!
  profiles: [String!]!
  analyses: [String!]!
}

""""""
union AnalysisInterimResponse = AnalysisInterimType | OperationError

input AnalysisInterimInput {
  key: Int!
  value: String!
  analysisUid: String!
  instrumentUid: String!
}

""""""
union AnalysisUncertaintyResponse = AnalysisUncertaintyType | OperationError

input AnalysisUncertaintyInput {
  min: Float!
  max: Float!
  value: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
}

""""""
union AnalysisCorrectionFactorResponse = AnalysisCorrectionFactorType | OperationError

input AnalysisCorrectionFactorInput {
  factor: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
}

""""""
union AnalysisDetectionLimitResponse = AnalysisDetectionLimitType | OperationError

input AnalysisDetectionLimitInput {
  lowerLimit: Float!
  upperLimit: Float!
  analysisUid: String!
  instrumentUid: String!
  methodUid: String!
}

""""""
union AnalysisSpecificationResponse = AnalysisSpecificationType | OperationError

input AnalysisSpecificationInput {
  analysisUid: String!
  min: Float = null
  max: Float = null
  minWarn: Float = null
  maxWarn: Float = null
  minReport: String = null
  maxReport: String = null
  warnValues: String = null
  warnReport: String = null
  gender: String = null
  ageMin: Int = null
  ageMax: Int = null
  methodUid: String = null
  unitUid: String = null
}

"""Union of possible outcomes when actioning samples"""
union SampleActionResponse = SampleListingType | OperationError

type SampleListingType {
  samples: [SampleType!]!
}

"""Union of possible outcomes when actioning samples"""
union ResultedSampleActionResponse = ResultedSampleListingType | OperationError

type ResultedSampleListingType {
  samples: [SamplesWithResults!]!
}

input SampleRejectInputType {
  uid: String!
  reasons: [String!]!
  other: String = ""
}

"""Union of possible outcomes when deleting some object"""
union SuccessErrorResponse = OperationSuccess | OperationError

input SamplePublishInputType {
  uid: String!
  action: String! = ""
}

"""Union of possible outcomes when submitting/verifying results"""
union AnalysisResultSubmitResponse = OperationSuccess | OperationError

input ARResultInputType {
  uid: String!
  result: String!
  reportable: Boolean = true
}

"""Union of possible outcomes when actioning samples"""
union AnalysisResultResponse = ResultListingType | OperationError

type ResultListingType {
  results: [AnalysisResultType!]!
}

""""""
union QCSetResponse = CreateQCSetData | OperationError

type CreateQCSetData {
  samples: [SampleType!]!
  qcSets: [QCSetType!]!
}

input QCSetInputType {
  qcTemplateUid: String
  qcLevels: [String!]!
  analysisProfiles: [String!]!
  analysisServices: [String!]!
}

""""""
union QCLevelResponse = QCLevelType | OperationError

""""""
union QCTemplateResponse = QCTemplateType | OperationError

input QCTemplateInputType {
  name: String!
  description: String! = ""
  departments: [String!] = null
  levels: [String!]!
}

""""""
union WorkSheetTemplateResponse = WorkSheetTemplateType | OperationError

input WorksheetTemplateInputType {
  name: String!
  sampleTypeUid: String!
  reserved: [ReservedInputType!] = null
  analysisUid: String = null
  numberOfSamples: Int = null
  instrumentUid: String = null
  worksheetType: String = null
  rows: Int = null
  cols: Int = null
  rowWise: Boolean = true
  description: String = null
  qcTemplateUid: String = null
  profiles: [String!] = null
}

input ReservedInputType {
  position: Int!
  levelUid: String
}

""""""
union WorkSheetsResponse = WorksheetListingType | OperationError

type WorksheetListingType {
  worksheets: [WorkSheetType!]
}

""""""
union WorkSheetResponse = WorkSheetType | OperationError

"""Union of possible outcomes when deleting some object"""
union DeleteResponse = DeletedItem | OperationError

"""Union of possible outcomes when adding a new notice"""
union NoticeResponse = NoticeType | OperationError

input NoticeInputType {
  title: String!
  body: String!
  expiry: String!
  groups: [String!]
  departments: [String!]
}

""""""
union ReflexRuleResponse = ReflexRuleType | OperationError

input ReflexRuleInput {
  name: String!
  description: String!
}

""""""
union ReflexActionResponse = ReflexActionType | OperationError

input ReflexActionInput {
  level: Int!
  description: String!
  analyses: [String!]!
  reflexRuleUid: String!
  sampleTypeUid: String = null
}

""""""
union ReflexBrainResponse = ReflexBrainType | OperationError

input ReflexBrainInput {
  reflexActionUid: String!
  description: String!
  analysesValues: [ReflexCriteriaInput!] = null
  addNew: [ReflexAddNewInput!] = null
  finalise: [ReflexFinalInput!] = null
}

input ReflexCriteriaInput {
  analysisUid: String!
  operator: String!
  value: String!
}

input ReflexAddNewInput {
  analysisUid: String!
  count: Int!
}

input ReflexFinalInput {
  analysisUid: String!
  value: String!
}

""""""
union StoreRoomResponse = StoreRoomType | OperationError

input StoreRoomInputType {
  name: String!
  description: String!
}

""""""
union StorageLocationResponse = StorageLocationType | OperationError

input StorageLocationInputType {
  name: String!
  description: String
  storeRoomUid: String!
}

""""""
union StorageSectionResponse = StorageSectionType | OperationError

input StorageSectionInputType {
  name: String!
  description: String
  storageLocationUid: String!
}

""""""
union StorageContainerResponse = StorageContainerType | OperationError

input StorageContainerInputType {
  name: String!
  description: String
  storageSectionUid: String!
  grid: Boolean = false
  rowWise: Boolean = false
  cols: Int = 0
  rows: Int = 0
  slots: Int = 0
}

""""""
union StoreSampleResponse = StoredSamplesType | OperationError

type StoredSamplesType {
  samples: [SampleType!]!
}

input StoreSamplesInputType {
  sampleUid: String!
  storageSlot: String!
  storageSlotIndex: Int!
  storageContainerUid: String!
}

""""""
union StockItemResponse = StockItemType | OperationError

input StockItemInputType {
  name: String!
  description: String!
  departmentUid: String = null
  maximumLevel: Int = null
  minimumLevel: Int = null
}

""""""
union StockCategoryResponse = StockCategoryType | OperationError

input StockCategoryInputType {
  name: String!
  description: String!
}

""""""
union HazardResponse = HazardType | OperationError

input HazardInputType {
  name: String!
  description: String!
}

""""""
union StockUnitResponse = StockUnitType | OperationError

input StockUnitInputType {
  name: String!
}

""""""
union StockPackagingResponse = StockPackagingType | OperationError

input StockPackagingInputType {
  name: String!
}

""""""
union StockProductResponse = StockProductType | OperationError

input StockProductInputType {
  name: String!
  stockItemUid: String = null
  departmentUid: String = null
  supplierUid: String = null
  categoryUid: String = null
  hazardUid: String = null
  storeRoomUid: String = null
  lotNumber: String = null
  batch: String = null
  size: Int = null
  unitUid: String = null
  packagingUid: String = null
  price: Int = null
  quantityReceived: Int = null
  dateReceived: DateTime = null
  expiryDate: DateTime = null
  receivedByUid: String = null
}

""""""
union StockOrderResponse = StockOrderLineType | StockOrderType | OperationError

type StockOrderLineType {
  stockOrder: StockOrderType!
  orderProducts: [StockOrderProductType!]!
}

input StockOrderInputType {
  orderProducts: [StockOrderProductLineInputType!]!
  departmentUid: String = null
}

input StockOrderProductLineInputType {
  productUid: String!
  quantity: Int!
  remarks: String = null
}

input StockOrderApprovalInputType {
  remarks: String!
  status: String!
}

""""""
union StockTransactionResponse = StockTransactionType | OperationError

input StockTransactionInputType {
  productUid: String!
  issued: Int!
  issuedToUid: String!
  departmentUid: String = null
}

""""""
union StockAdjustmentResponse = StockAdjustmentType | OperationError

input StockAdjustmentInputType {
  productUid: String!
  adjustmentType: String!
  adjust: Int!
  remarks: String = null
}

""""""
union InstrumentTypeResponse = InstrumentTypeType | OperationError

input InstrumentTypeInputType {
  name: String!
  description: String = ""
}

""""""
union InstrumentResponse = InstrumentType | OperationError

input InstrumentInputType {
  name: String!
  keyword: String!
  description: String = ""
  instrumentTypeUid: String = null
  supplierUid: String = null
  manufacturerUid: String = null
}

""""""
union InstrumentCalibrationResponse = InstrumentCalibrationType | OperationError

input InstrumentCalibrationInput {
  instrumentUid: String!
  dateReported: DateTime
  startDate: DateTime
  endDate: DateTime
  calibrationId: String = ""
  reportId: String = ""
  performedBy: String = ""
  notesBefore: String = ""
  workDone: String = ""
  remarks: String = ""
}

""""""
union CalibrationCertificateResponse = CalibrationCertificateType | OperationError

input CalibrationCertificateInput {
  instrumentUid: String!
  dateIssued: DateTime
  validFromDate: DateTime
  validToDate: DateTime
  certificateCode: String = ""
  issuer: String = ""
  performedBy: String = ""
  approvedBy: String = ""
  remarks: String = ""
  internal: Boolean! = true
}

""""""
union MethodResponse = MethodType | OperationError

input MethodInputType {
  name: String!
  instruments: [String!]
  analyses: [String!]
  keyword: String = null
  description: String = ""
}

""""""
union ShipmentsResponse = ShipmentListingType | OperationError

type ShipmentListingType {
  shipments: [ShipmentType!]
}

input ShipmentInputType {
  laboratoryUid: String
  courier: String!
  comment: String
  count: Int = 1
}

""""""
union ShipmentResponse = ShipmentType | OperationError

input ShipmentUpdateInputType {
  laboratoryUid: String
  courier: String!
  comment: String = ""
}

input ShipmentManageSamplesInput {
  samples: [ReferenceSampleInput!]!
  action: String!
}

input ReferenceSampleInput {
  sampleUid: String = null
  shipedSampleUid: String = null
  analyses: [String!]!
}

""""""
union ReferralLaboratoryResponse = ReferralLaboratoryType | OperationError

input ReferralLaboratoryInputType {
  name: String!
  code: String!
  url: String!
  username: String!
  password: String!
  isReference: Boolean! = false
  isReferral: Boolean! = false
}

input PriceInput {
  amount: Float!
  isActive: Boolean = true
}

""""""
union ProfileDiscountResponse = ProfileDiscountType | OperationError

input PriceDiscountInput {
  name: String!
  discountType: String!
  valueType: String!
  startDate: DateTime!
  endDate: DateTime!
  voucherUid: String!
  valuePercent: Float!
  valueAmount: Float!
  isActive: Boolean!
}

""""""
union AnalysisDiscountResponse = AnalysisDiscountType | OperationError

""""""
union VoucherResponse = VoucherType | OperationError

input VoucherInput {
  name: String!
  usageLimit: Int!
  used: Int!
  startDate: DateTime!
  endDate: DateTime!
  oncePerCustomer: Boolean!
  oncePerOrder: Boolean!
}

""""""
union VoucherCodeResponse = VoucherCodeType | OperationError

input VoucherCodeInput {
  code: String!
  voucherUid: String!
  usageLimit: Int!
  used: Int!
  isActive: Boolean!
}

""""""
union TestBillTransactionResponse = TestBillTransactionType | OperationError

input BillTransactionInput {
  testBillUid: String!
  kind: String!
  amount: Float!
  error: Boolean = false
  isSuccess: Boolean = true
  actionRequired: String = ""
  processed: Boolean = false
  notes: String = ""
  patientUid: String!
  clientUid: String!
}

input ApplyVoucherInput {
  voucherCode: String!
  testBillUid: String!
  customerUid: String!
}

type Subscription {
  latestActivity: ActivityStreamType!
  streamAll: ActivityStreamType!
  count(target: Int! = 100): Int!
}`;class ZE{constructor(n){De(this,"mapping");this.mapping=n}getFor(n){return this.mapping.get(n.name)}}var ar;(function(i){i.UNION="union",i.ARGUMENT="argument",i.FIELD="field"})(ar||(ar={}));function KE(i){const n=new Map;return eA(i,t=>{Sn(t)&&nA(t,s=>{const o=ya(s.type);aa(n,o).references.push({kind:ar.FIELD,parent:t,by:s}),tA(s,l=>{const d=ya(l.type);aa(n,d).references.push({kind:ar.ARGUMENT,field:s,type:t,by:l})})}),Zn(t)&&t.getTypes().forEach(s=>{aa(n,s).references.push({kind:ar.UNION,by:t})})}),new ZE(n)}function eA(i,n){Object.entries(i.getTypeMap()).forEach(([,t])=>{t.name.startsWith("__")||n(t)})}function nA(i,n){Object.entries(i.getFields()).forEach(([,t])=>{n(t)})}function tA(i,n){Object.entries(i.args).forEach(([,t])=>{n(t)})}function aa(i,n){let t=i.get(n.name);return t||(t={references:[]},i.set(n.name,t)),t}function ya(i){return ln(i)||di(i)?ya(i.ofType):i}const pn=hA(),ma=Ca(Ia.DIRECTIVES,[]);var Wc;const iA=bs((Wc=pn.getQueryType())==null?void 0:Wc.getFields());var zc;const rA=bs((zc=pn.getMutationType())==null?void 0:zc.getFields());var Qc;const sA=bs((Qc=pn.getSubscriptionType())==null?void 0:Qc.getFields()),ka=Rt.keyBy($p(),i=>i.name.toLocaleLowerCase()),oA=Rt.mapValues(ka,i=>{const n=ma.find(t=>(t==null?void 0:t.name)===i.name||(t==null?void 0:t.name)==="*");return n?n.args.some(t=>t==="*")?i.args:n.args.map(t=>i.args.find(s=>s.name===t)).filter(t=>!!t):[]}),aA=bs(pn.getTypeMap()),uA=KE(pn);function bs(i){return Rt.mapKeys(i||{},(n,t)=>t.toLocaleLowerCase())}function lA(){return Rt.size(pn.getTypeMap())<=10}function cA(){return[ua("Queries",pn.getQueryType()),ua("Mutations",pn.getMutationType()),ua("Subscriptions",pn.getSubscriptionType()),yA(),fA()].filter(i=>!!i)}function ua(i,n){return dA(i,pA(n))}function pA(i){return Rt.sortBy((i==null?void 0:i.getFields())||{},n=>n.name)}function dA(i,n){return n.length===0?null:{type:"menu",title:i,children:n.map(t=>({type:"page",title:t.name,section:i,deprecated:!!t.deprecationReason,href:pr.joinUrlPaths(As,i.toLocaleLowerCase(),t.name)}))}}function fA(){return lA()?null:{type:"menu",title:"Types",children:Rt.sortBy(Rt.map(pn.getTypeMap()),n=>n.name).filter(n=>!n.name.startsWith("__")).map(n=>({type:"page",title:n.name,section:"Types",href:pr.joinUrlPaths(As,"types",n.name)}))}}function bA(){return!!pn.getQueryType()}function kA(i){return iA[i.toLocaleLowerCase()]}function wA(){return!!pn.getMutationType()}function NA(i){return rA[i.toLocaleLowerCase()]}function xA(){return!!pn.getSubscriptionType()}function OA(i){return sA[i.toLocaleLowerCase()]}function LA(i){return aA[i.toLocaleLowerCase()]}function gA(i){return ka[i.toLocaleLowerCase()]}function PA(i){return gA(i.name)!==void 0}function MA(){return Rt.size(ka)>0}function $A(i){return oA[i.name.toLocaleLowerCase()]||[]}function VA(i){if(i)return uA.getFor(i)}function GA(i){return Rt.flatMap(i.getFields(),n=>({field:n,possibleDescriptions:Mp(n,i)}))}function Mp(i,n){return i?i.description?[{description:i.description,from:n}]:Sn(n)?n.getInterfaces().flatMap(t=>Mp(t.getFields()[i.name],t)):[]:[]}function $p(){return ma.some(i=>(i==null?void 0:i.name)==="*")?pn.getDirectives().filter(i=>!["include","skip","deprecated","specifiedBy"].includes(i.name)):ma.filter(i=>!!(i!=null&&i.name)).map(({name:i})=>i?pn.getDirective(i):void 0).filter(i=>!!i)}function hA(){return qc.trim().length===0?YE(JSON.parse(JSON.stringify({__schema:{types:[]}}))):XE(qc)}function yA(){const i=$p();return i.length===0?null:{type:"menu",title:"Directives",children:i.map(n=>({type:"page",title:n.name,href:pr.joinUrlPaths(As,"directives",n.name),section:"Directives"}))}}const qA=Ca(Ia.APP_TITLE,"GraphQL Documentation"),Vp=SA().concat(cA());DA(Vp);const mA=Object.freeze(Vp),jA=TA();function SA(){return Ca(Ia.PAGES,AA()).filter(n=>!!n).map(n=>qp([],n))}function TA(){const i=EA();if(i)return i.href;throw new Error("No custom pages or query available to use as the root application URL. You need to provide at least one custom page or your schema should contain at least one query/mutation/subscription.")}function DA(i){function n(s,o){for(const u of s){if(u.type==="page"){o(u);continue}u.type==="menu"&&n(u.children,o)}}let t;n(i,s=>{t&&(t.next={title:s.title,section:s.section,href:s.href},s.previous={title:t.title,section:t.section,href:t.href}),t=s})}function EA(){return Gp(()=>!0)}function WA(i){return Gp(n=>n.href.toLocaleLowerCase()===i.toLocaleLowerCase())}function Gp(i){function n(t){for(const s of t){if(s.type==="page"&&i(s))return s;if(s.type==="menu"){const o=n(s.children);if(o)return o}}return null}return n(mA)}function qp(i,n){if(typeof n.content=="string")return{type:"page",title:n.title,content:n.content,href:pr.joinUrlPaths(As,...i,jc(n.title))};const t=i.concat([jc(n.title)]);return{type:"menu",title:n.title,children:n.content.map(s=>({...qp(t,s),section:n.title}))}}function jc(i){return pr.generatePathSegment(i,new tp)}function AA(){return[{title:"Introduction",content:[{title:"Welcome",content:`
        # Welcome 🎉

        [Congratulations!](https://www.youtube.com/watch?v=1Bix44C1EzY) You have successfully created your first Magidoc website.

        Now that you are up and running, you can customize this website even further by providing some configuration inside your [magidoc.mjs ⚙️](https://magidoc.js.org/cli/magidoc-configuration). 
        If you wish to remove or modify this page, have a look at the *customPages* configuration.
        `.split(`
`).map(i=>i.trim()).join(`
`)}]}]}export{bA as A,tp as B,kA as C,xA as D,OA as E,tE as F,ln as G,di as H,Dp as I,Tp as J,LA as K,VA as L,GA as M,PA as N,_ as O,RA as P,_s as Q,ar as R,Xc as S,FA as T,tr as U,aD as V,Rt as _,BA as a,Ca as b,Hn as c,Sn as d,ct as e,cn as f,Hc as g,Ht as h,Kn as i,Zn as j,et as k,lA as l,Ee as m,qA as n,UA as o,mA as p,jA as q,WA as r,pn as s,Ia as t,pr as u,MA as v,gA as w,$A as x,wA as y,NA as z};
