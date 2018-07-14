import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  data: {
    log: false,
    error: '',
    username: '',
    password: '',
    greeting: '',
    token: ''
  },
  methods: {
    logactiondesc: function () {
      if (!this.log) {
        return 'Login'
      } else {
        return 'Logout'
      }
    },
    logaction: function () {
      if (!this.log) {
        this.login()
      } else {
        this.logout()
      }
    },
    login: function () {
      var vue = this;
      axios.post(BACKEND+'signin',{
        username: vue.username,
        password: vue.password
      }).then(function (res) {
        vue.token = res.token;
        vue.greet();
        vue.log = true;
        vue.error = '';
      }).catch(function (error) {
        vue.error = error.toString();
        vue.logout();
      })
    },

    logout: function () {

        this.username = '';
        this.password = '';
        this.log = false;
        this.token = '';

    },
    greet: function () {

      var morning = 7;
      var afternoon = 12;
      var evening = 18;
      var g = '';

      var currentHour = parseFloat(moment().format("HH").toString());

      if (currentHour >= morning && currentHour <= afternoon) {
        g = 'morning';
      } else if (currentHour >= afternoon && currentHour <= evening) {
        g = 'afternoon';
      } else {
        g = 'evening';
      }

      this.greeting = 'Good ' + g + ', ' + this.username + '.';
    }
  },
    render: h => h(App)
})