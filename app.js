const mongoose = require('mongoose');

Vue.component('modal', {
  template: '#modal-template'
})


new Vue({
      el: '#vue-app',
      data: {
        log: false,
        username:'Username',
        password:'Password',
        user:'',
        userid:''
      },
      methods:{
        logactiondesc : function(){
          if(!this.log){
            return 'Login'
          }else{
            return 'Logout'
          }
        },
        logaction : function(){
          if(!this.log){
            this.login()
          }else{
            this.logout()
          }
        },
        login: function(){
          try{
            mongoose.connect('mongodb://'+this.username+':'+this.password+'@localhost/admin?authSource=admin');
            this.log = true;
          }catch{
            mongoose.disconnect();
            this.logout()
          }

        },
        logout: function(){
          this.username = 'Username';
          this.password = 'Password';
          this.log = false;

        },
        greeting: function(){
          return 'Welcome, '+this.username+'!'
        }

      }
    });