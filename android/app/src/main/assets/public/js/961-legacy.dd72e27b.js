"use strict";(self["webpackChunkpapillon"]=self["webpackChunkpapillon"]||[]).push([[961],{7961:(e,t,i)=>{i.r(t),i.d(t,{DeviceWeb:()=>o});var n=i(9895);class o extends n.Uw{async getId(){return{identifier:this.getUid()}}async getInfo(){if("undefined"===typeof navigator||!navigator.userAgent)throw this.unavailable("Device API not available in this browser");const e=navigator.userAgent,t=this.parseUa(e);return{model:t.model,platform:"web",operatingSystem:t.operatingSystem,osVersion:t.osVersion,manufacturer:navigator.vendor,isVirtual:!1,webViewVersion:t.browserVersion}}async getBatteryInfo(){if("undefined"===typeof navigator||!navigator.getBattery)throw this.unavailable("Device API not available in this browser");let e={};try{e=await navigator.getBattery()}catch(t){}return{batteryLevel:e.level,isCharging:e.charging}}async getLanguageCode(){return{value:navigator.language.split("-")[0].toLowerCase()}}async getLanguageTag(){return{value:navigator.language}}parseUa(e){const t={},i=e.indexOf("(")+1;let n=e.indexOf(") AppleWebKit");-1!==e.indexOf(") Gecko")&&(n=e.indexOf(") Gecko"));const o=e.substring(i,n);if(-1!==e.indexOf("Android")){const e=o.replace("; wv","").split("; ").pop();e&&(t.model=e.split(" Build")[0]),t.osVersion=o.split("; ")[1]}else if(t.model=o.split("; ")[0],"undefined"!==typeof navigator&&navigator.oscpu)t.osVersion=navigator.oscpu;else if(-1!==e.indexOf("Windows"))t.osVersion=o;else{const e=o.split("; ").pop();if(e){const i=e.replace(" like Mac OS X","").split(" ");t.osVersion=i[i.length-1].replace(/_/g,".")}}/android/i.test(e)?t.operatingSystem="android":/iPad|iPhone|iPod/.test(e)&&!window.MSStream?t.operatingSystem="ios":/Win/.test(e)?t.operatingSystem="windows":/Mac/i.test(e)?t.operatingSystem="mac":t.operatingSystem="unknown";const r=!!window.InstallTrigger,s=!!window.ApplePaySession,a=!!window.chrome,l=/Edg/.test(e),g=/FxiOS/.test(e),d=/CriOS/.test(e),p=/EdgiOS/.test(e);if(s||a&&!l||g||d||p){let i;i=g?"FxiOS":d?"CriOS":p?"EdgiOS":s?"Version":"Chrome";const n=e.split(" ");for(const e of n)if(e.includes(i)){const i=e.split("/")[1];t.browserVersion=i}}else if(r||l){const i=e.split("").reverse().join(""),n=i.split("/")[0],o=n.split("").reverse().join("");t.browserVersion=o}return t}getUid(){if("undefined"!==typeof window&&window.localStorage){let e=window.localStorage.getItem("_capuid");return e||(e=this.uuid4(),window.localStorage.setItem("_capuid",e),e)}return this.uuid4()}uuid4(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){const t=16*Math.random()|0,i="x"===e?t:3&t|8;return i.toString(16)}))}}}}]);
//# sourceMappingURL=961-legacy.dd72e27b.js.map