"use strict";(self["webpackChunkpapillon"]=self["webpackChunkpapillon"]||[]).push([[593],{593:(e,i,t)=>{t.r(i),t.d(i,{FilePickerWeb:()=>n});var s=t(9895);class n extends s.Uw{constructor(){super(...arguments),this.ERROR_PICK_FILE_CANCELED="pickFiles canceled."}async convertHeicToJpeg(e){throw this.unimplemented("Not implemented on web.")}async pickFiles(e){const i=await this.openFilePicker(e);if(!i)throw new Error(this.ERROR_PICK_FILE_CANCELED);const t={files:[]};for(const s of i){const i={blob:s,modifiedAt:s.lastModified,mimeType:this.getMimeTypeFromUrl(s),name:this.getNameFromUrl(s),path:void 0,size:this.getSizeFromUrl(s)};(null===e||void 0===e?void 0:e.readData)&&(i.data=await this.getDataFromFile(s)),t.files.push(i)}return t}async pickImages(e){return this.pickFiles(Object.assign({types:["image/*"]},e))}async pickMedia(e){return this.pickFiles(Object.assign({types:["image/*","video/*"]},e))}async pickVideos(e){return this.pickFiles(Object.assign({types:["video/*"]},e))}async openFilePicker(e){var i;const t=(null===(i=null===e||void 0===e?void 0:e.types)||void 0===i?void 0:i.join(","))||"",s=!!(null===e||void 0===e?void 0:e.multiple);return new Promise((e=>{let i=!1;const n=document.createElement("input");n.type="file",n.accept=t,n.multiple=s,n.addEventListener("change",(()=>{i=!0;const t=Array.from(n.files||[]);e(t)}),{once:!0}),window.addEventListener("focus",(async()=>{await this.wait(1e3),i||e(void 0)}),{once:!0}),n.click()}))}async getDataFromFile(e){return new Promise(((i,t)=>{const s=new FileReader;s.readAsDataURL(e),s.onload=()=>{const e="string"===typeof s.result?s.result:"",t=e.split("base64,"),n=t[1]||"";i(n)},s.onerror=e=>{t(e)}}))}getNameFromUrl(e){return e.name}getMimeTypeFromUrl(e){return e.type}getSizeFromUrl(e){return e.size}async wait(e){return new Promise((i=>setTimeout(i,e)))}}}}]);
//# sourceMappingURL=593.26757a1e.js.map