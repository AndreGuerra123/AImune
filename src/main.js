import Vue from 'vue'
import App from './App.vue'


import axios from 'axios';
Vue.use(axios);

import Datepicker from 'vuejs-datepicker';
import Regist from './components/regist.vue'
import Error from './components/error.vue'

Vue.component('error', Error);
Vue.component('regist',Regist);
Vue.component('datepicker',Datepicker);


new Vue({
  el: '#app',
  render: h => h(App)
});

//In order to deploy this into nginx just:
//  create /etc/nginx/sites-enabled/site with root as the something like /var/www/sitename/html, change the blocks and leave location with / (do not modify anything from certbot)
//  go to the repo and in root of repo run:  npm install, npm run build
//  copy /dist and index.html to /var/www/sitename/html
