!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){new Vue({el:"#vue-app",data:{log:!1,error:!1,errormsg:"",username:"Username",password:"Password",greeting:"",client:""},methods:{logactiondesc:function(){return this.log?"Logout":"Login"},logaction:function(){this.log?this.logout():this.login()},login:function(){var e=this,t="mongodb://"+this.username+":"+this.password+"@aimune.science:6666/admin?authSource=admin";mongoclient.connect(t,function(t,n){t?(e.error=!0,e.errormsg=t.toString(),e.logout()):(e.greet(),e.log=!0,e.error=!1,n.close())})},logout:function(){try{this.client.disconnect()}catch(e){this.username="Username",this.password="Password",this.log=!1}},greet:function(){var e="",t=parseFloat(moment().format("HH").toString());e=t>=7&&t<=12?"morning":t>=12&&t<=18?"afternoon":"evening",this.greeting="Good "+e+", "+this.username+"."}}})}]);