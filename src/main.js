import Vue from 'vue'
import App from './App.vue'

import KerasModelEditor from './assets/dependencies/keras-model-editor.js';
Vue.use(KerasModelEditor);

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import V2D from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

import Datepicker from 'vuejs-datepicker';

Vue.component('vue-dropzone',V2D);

Vue.component('datepicker',Datepicker);

import Regist from './components/regist.vue'
import Error from './components/error.vue'
import Loader from './components/load.vue'
import Designer from './components/design/design.vue'
import UploadArch from './components/design/uploadarch.vue';
import SaveArch from './components/design/savearch.vue';
import DeleteArch from './components/design/deletearch.vue';

import Train from './components/train/train.vue'
import trainDelete from './components/train/traindelete.vue';
import trainClone from  './components/train/trainclone.vue'
import trainNew from  './components/train/trainnew.vue'
import trainProceed from  './components/train/trainproceed.vue'

import proceedConfig from './components/train/proceed/config.vue'
import proceedDataset from './components/train/proceed/dataset.vue'
import proceedLearning from './components/train/proceed/learning.vue'
import proceedResults from './components/train/proceed/results.vue'


Vue.component('load', Loader);
Vue.component('error', Error);
Vue.component('regist',Regist);
Vue.component('design',Designer);
Vue.component('uploadarch', UploadArch);
Vue.component('savearch',SaveArch);
Vue.component('deletearch',DeleteArch);
Vue.component('train',Train)
Vue.component('traindelete',trainDelete);
Vue.component('trainclone',trainClone);
Vue.component('trainnew',trainNew);
Vue.component('trainproceed',trainProceed);

Vue.component('proceed-config', proceedConfig);
Vue.component('proceed-dataset', proceedDataset);
Vue.component('proceed-learning', proceedLearning);
Vue.component('proceed-results', proceedResults);

new Vue({
  el: '#app',
  render: h => h(App)
});

//In order to deploy this into nginx just:
//  create /etc/nginx/sites-enabled/site with root as the something like /var/www/sitename/html, change the blocks and leave location with / (do not modify anything from certbot)
//  go to the repo and in root of repo run:  npm install, npm run build
//  copy /dist and index.html to /var/www/sitename/html
