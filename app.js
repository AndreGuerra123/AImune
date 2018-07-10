
var mongoose = require('/node_modules/mongoose');

var vueapp = new Vue({
      el: '#vue-app',
      data: {
        log: false,
        err:'',
        username:'Username',
        password:'Password',
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
            mongoose.connect('mongodb://'+this.username+':'+this.password+'@localhost:6666/admin?authSource=admin');
            this.log = true;
          }catch(err){
           this.err = err;
           this.logout();
          }
        },
        logout: function(){
          try{
            mongoose.disconnect();
          }finally{
            this.username = 'Username';
            this.password = 'Password';
            this.log = false;
          }

        },
        greeting: function(){
          return 'Welcome, '+this.username+'!'
        }
      }
    });