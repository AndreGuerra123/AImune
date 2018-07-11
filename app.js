
//const mongoclient = require('mongoose');

var vueapp = new Vue({
      el: '#vue-app',
      data: {
        log: false,
        error: false,
        errormsg:'',
        username:'Username',
        password:'Password',
        greeting: '',
        client:''
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
            var vue = this;
            var url = 'mongodb://'+this.username+':'+this.password+'@aimune.science:6666/admin?authSource=admin';
            mongoclient.connect(url, function(err,db){
            if(err){
              vue.error = true;
              vue.errormsg = err.toString();
              vue.logout();
            }else{
              vue.greet();
              vue.log = true;
              vue.error = false;
              db.close();
            }
            });
        },

        logout: function(){
          try{
           this.client.disconnect();
          }catch(err){
            this.username = 'Username';
            this.password = 'Password';
            this.log = false;
          }

        },
        greet: function(){

            var morning = 7;
            var afternoon = 12;
            var evening = 18;
            var g = '';
            
            var currentHour = parseFloat(moment().format("HH").toString());
            
            if(currentHour >= morning && currentHour <= afternoon) {
              g = 'morning';
            } else if(currentHour >= afternoon && currentHour <= evening) {
              g = 'afternoon';
            } else {
              g = 'evening';
            }
            
            this.greeting =  'Good '+g+', '+this.username+'.';
          }
        }
    });