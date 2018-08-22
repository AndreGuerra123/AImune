<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#trainproceed-template",
  props: ["show", "token", "username", "model"],
  data: function() {
    return {
      showConfig: false,
      showDataset: false,
      showLearning: false,
      showResults: false,
      error: null,
      approved: require("../../assets/icons/approved.png"),
      empty: require("../../assets/icons/disabled.png"),
      errored: require("../../assets/icons/error.png"),
      processing: require("../../assets/icons/loading.gif"),
      unknown: require("../../assets/icons/unknown.png"),
      status: [0,0,0,0]
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    reset: function(){
      this.showConfig= false,
      this.showDataset= false,
      this.showLearning= false,
      this.showResults= false,
      this.error= null,
      this.status= [0,0,0,0]
    },
    isEnabled: function(e) {
      if (e == 0) {
        return true;
      } else {
        return this.status.slice(0,e).every(x => x > 2);
      }
    },
    displayStatus: function(e) {
      switch (this.status[e]) {
        case 0:
          return this.empty;
        case 1:
          return this.processing;
        case 2:
          return this.errored;
        case 3:
          return this.approved;
        default:
          return this.unknown;
      }
    },
    updateStatus: async function(){
      await ax.get("proceed/status", {
          params: { source: this.model._id},
          header: { token: this.token }
        })
        .then(res => {
          this.status = res.data;
        }).catch(err =>{
             console.log(err)
             this.error = err.toString();
        });
    },
    update: function(){
      this.reset();
      this.updateStatus();
    }
  },
  mounted: function() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  },
  watch:{
    show: function (newShow, oldShow) {
      this.reset();
      this.updateStatus();
    }
  }
};
</script>

<template name="trainproceed">
<transition>
        <div class="trainproceed-mask" @click="close" v-show="show">
            <div class="trainproceed-container" @click.stop>
              <div class="trainproceed-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>
              <div class="trainproceed-progress">
                <ul class="list">
                                  <li class="step"><button :disabled="!isEnabled(0)" class="trainproceed-default-button" @click="showDataset = true"><span class="step-span"><img :src="displayStatus(0)" class="span-img"></span>
                  <span class="step-span">Dataset</span></button></li>
                <li class="step"><button :disabled="!isEnabled(1)" class="trainproceed-default-button" @click="showConfig = true">
                  <span class="step-span"><img :src="displayStatus(1)" class="span-img"></span>
                  <span class="step-span">Settings</span>
                  </button></li>
                <li class="step"><button :disabled="!isEnabled(2)" class="trainproceed-default-button" @click="showLearning = true"><span class="step-span"><img :src="displayStatus(2)" class="span-img"></span>
                  <span class="step-span">Learning</span></button></li>
                <li class="step"><button :disabled="!isEnabled(3)" class="trainproceed-default-button" @click="showResults = true"><span class="step-span"><img :src="displayStatus(3)" class="span-img"></span>
                  <span class="step-span">Results</span></button></li>
              </ul>
              </div>
              <proceed-dataset :show="showDataset" :token="token" :username="username" :model="model" @close="update"></proceed-dataset>
              <proceed-config :show="showConfig" :token="token" :username="username" :model="model" @close="update"></proceed-config>
              <proceed-learning :show="showLearning" :token="token" :username="username" :model="model" @close="update"></proceed-learning>
              <proceed-results :show="showResults" :token="token" :username="username" :model="model" @close="update"></proceed-results>
              <error :show="error" @close="error = null"></error>
            </div>
        </div>
</transition>
</template>

<style>
.trainproceed-header {
  width: 100%;
  height: 15%;
  margin: 15px;
  text-align: center;
}

.trainproceed-progress {
  width: 100%;
  margin-top: 15%;
  margin-left: auto;
  margin-right: auto;
}
.list {
  list-style-type: none;
  padding: 0px;
  display: table;
  table-layout: fixed;
  width: 100%;
}
.step {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.step-span {
  display: inline;
  text-align: center;
}
.span-img {
  width: 64px;
  height: 64px;
}

.trainproceed-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.trainproceed-container {
  width: 80%;
  height: 80%;
  margin: 100px auto 0;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.trainproceed-default-button {
  width: 120px;
  height: 120px;
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  border-radius: 50%;
  text-decoration: uppercase;
  background-color: #4cb6c8;
}
.trainproceed-default-button:hover {
  background-color: #ec70a8;
}
.trainproceed-default-button:disabled {
  background-color: lightgrey;
  opacity: 0.3;
}
</style>
