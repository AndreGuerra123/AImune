new Vue({
      el: '#app',
      data: {
        log: false,
        user:"TEST",
        userid:""
      },
      methods: {

        logaction: function(){
          if(this.log){
            this.logout()
          }else{
            this.login()
          }
        },

        logactiondesc: function(){
          if(this.log){
            return 'Logout';
          }else{
            return 'Login';
          }
        },

        logout: function(){
          this.log = false;
          this.user = "";
          this.userid = "";
        },

        login: function (user, pass) {
          
              try{


              }catch{

              
              }

        }
      }
    })