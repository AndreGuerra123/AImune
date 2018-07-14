import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  data: function(){
    return {
        log: false,
        error: "",
        username: "",
        password: "",
        greeting: "",
        token: ""
      }
  },
  render: h => h(App)
})
