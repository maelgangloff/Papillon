"use strict";(self["webpackChunkpapillon"]=self["webpackChunkpapillon"]||[]).push([[775],{8775:(e,t,n)=>{n.r(t),n.d(t,{startInputShims:()=>M});var o=n(8487),i=n(6587),r=n(3541);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const s=new WeakMap,a=(e,t,n,o=0,i=!1)=>{s.has(e)!==n&&(n?d(e,t,o,i):c(e,t))},l=e=>e===e.getRootNode().activeElement,d=(e,t,n,o=!1)=>{const i=t.parentNode,r=t.cloneNode(!1);r.classList.add("cloned-input"),r.tabIndex=-1,o&&(r.disabled=!0),i.appendChild(r),s.set(e,r);const a=e.ownerDocument,l="rtl"===a.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform=`translate3d(${l}px,${n}px,0) scale(0)`},c=(e,t)=>{const n=s.get(e);n&&(s.delete(e),n.remove()),e.style.pointerEvents="",t.style.transform=""},u=50,m=(e,t,n)=>{if(!n||!t)return()=>{};const o=n=>{l(t)&&a(e,t,n)},r=()=>a(e,t,!1),s=()=>o(!0),d=()=>o(!1);return(0,i.a)(n,"ionScrollStart",s),(0,i.a)(n,"ionScrollEnd",d),t.addEventListener("blur",r),()=>{(0,i.b)(n,"ionScrollStart",s),(0,i.b)(n,"ionScrollEnd",d),t.removeEventListener("blur",r)}},p="input, textarea, [no-blur], [contenteditable]",v=()=>{let e=!0,t=!1;const n=document,o=()=>{t=!0},r=()=>{e=!0},s=o=>{if(t)return void(t=!1);const i=n.activeElement;if(!i)return;if(i.matches(p))return;const r=o.target;r!==i&&(r.matches(p)||r.closest(p)||(e=!1,setTimeout((()=>{e||i.blur()}),50)))};return(0,i.a)(n,"ionScrollStart",o),n.addEventListener("focusin",r,!0),n.addEventListener("touchend",s,!1),()=>{(0,i.b)(n,"ionScrollStart",o,!0),n.removeEventListener("focusin",r,!0),n.removeEventListener("touchend",s,!1)}},f=.3,w=(e,t,n)=>{var o;const i=null!==(o=e.closest("ion-item,[ion-item]"))&&void 0!==o?o:e;return h(i.getBoundingClientRect(),t.getBoundingClientRect(),n,e.ownerDocument.defaultView.innerHeight)},h=(e,t,n,o)=>{const i=e.top,r=e.bottom,s=t.top,a=Math.min(t.bottom,o-n),l=s+15,d=a-u,c=d-r,m=l-i,p=Math.round(c<0?-c:m>0?-m:0),v=Math.min(p,i-s),w=Math.abs(v),h=w/f,y=Math.min(400,Math.max(150,h));return{scrollAmount:v,scrollDuration:y,scrollPadding:n,inputSafeY:4-(i-l)}},y="$ionPaddingTimer",b=(e,t,n)=>{const o=e[y];o&&clearTimeout(o),t>0?e.style.setProperty("--keyboard-offset",`${t}px`):e[y]=setTimeout((()=>{e.style.setProperty("--keyboard-offset","0px"),n&&n()}),120)},g=(e,t,n)=>{const o=()=>{t&&b(t,0,n)};e.addEventListener("focusout",o,{once:!0})};let E=0;const S="data-ionic-skip-scroll-assist",L=(e,t,n,o,i,s,a,l=!1)=>{const d=s&&(void 0===a||a.mode===r.a.None),c=async()=>{t.hasAttribute(S)?t.removeAttribute(S):D(e,t,n,o,i,d,l)};return e.addEventListener("focusin",c,!0),()=>{e.removeEventListener("focusin",c,!0)}},k=e=>{document.activeElement!==e&&(e.setAttribute(S,"true"),e.focus())},D=async(e,t,n,r,s,l,d=!1)=>{if(!n&&!r)return;const c=w(e,n||r,s);if(n&&Math.abs(c.scrollAmount)<4)return k(t),void(l&&null!==n&&(b(n,E),g(t,n,(()=>E=0))));if(a(e,t,!0,c.inputSafeY,d),k(t),(0,i.r)((()=>e.click())),l&&n&&(E=c.scrollPadding,b(n,E)),"undefined"!==typeof window){let i;const r=async()=>{void 0!==i&&clearTimeout(i),window.removeEventListener("ionKeyboardDidShow",s),window.removeEventListener("ionKeyboardDidShow",r),n&&await(0,o.c)(n,0,c.scrollAmount,c.scrollDuration),a(e,t,!1,c.inputSafeY),k(t),l&&g(t,n,(()=>E=0))},s=()=>{window.removeEventListener("ionKeyboardDidShow",s),window.addEventListener("ionKeyboardDidShow",r)};if(n){const e=await(0,o.g)(n),a=e.scrollHeight-e.clientHeight;if(c.scrollAmount>a-e.scrollTop)return"password"===t.type?(c.scrollAmount+=u,window.addEventListener("ionKeyboardDidShow",s)):window.addEventListener("ionKeyboardDidShow",r),void(i=setTimeout(r,1e3))}r()}},A=!0,M=async(e,t)=>{const n=document,s="ios"===t,a="android"===t,l=e.getNumber("keyboardHeight",290),d=e.getBoolean("scrollAssist",!0),c=e.getBoolean("hideCaretOnScroll",s),u=e.getBoolean("inputBlurring",s),p=e.getBoolean("scrollPadding",!0),f=Array.from(n.querySelectorAll("ion-input, ion-textarea")),w=new WeakMap,h=new WeakMap,y=await r.K.getResizeMode(),b=async e=>{await new Promise((t=>(0,i.c)(e,t)));const t=e.shadowRoot||e,n=t.querySelector("input")||t.querySelector("textarea"),r=(0,o.a)(e),s=r?null:e.closest("ion-footer");if(!n)return;if(r&&c&&!w.has(e)){const t=m(e,n,r);w.set(e,t)}const u="date"===n.type||"datetime-local"===n.type;if(!u&&(r||s)&&d&&!h.has(e)){const t=L(e,n,r,s,l,p,y,a);h.set(e,t)}},g=e=>{if(c){const t=w.get(e);t&&t(),w.delete(e)}if(d){const t=h.get(e);t&&t(),h.delete(e)}};u&&A&&v();for(const o of f)b(o);n.addEventListener("ionInputDidLoad",(e=>{b(e.detail)})),n.addEventListener("ionInputDidUnload",(e=>{g(e.detail)}))}}}]);
//# sourceMappingURL=775-legacy.fbeb42c3.js.map