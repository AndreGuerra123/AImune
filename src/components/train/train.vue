<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});

export default {
  template: "#train-template",
  props: ["show", "token", "username"],
  data: function() {
    return {
      showClone:false,
      showNew:false,
      showProceed:false,
      list: null, //list of available models
      model: {id:null,name:null,user:null,date:null,shared:null,architecture:{name:null}}
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    updateList: async function() {
      await ax
        .get("model/init", {
          params: { user: this.username },
          header: { token: this.token }
        })
        .then(res => {
          this.list = res.data;
        });
    },
    refocus: async function(value) {
      this.showClone = false;
      this.showNew = false;
      this.showProceed = false;

      await this.updateList();

      if (this.list) {
        if (value) {
          var idx = this.list.findIndex(({ id }) => id === value);
          if (idx != -1) {
            this.model = this.list[idx];
          } else {
            this.setFirst();
          }
        } else {
          this.setFirst();
        }
      }
    },
    setFirst: function() {
      if (this.list && this.list[0]) {
        this.model = this.list[0];
      }
    }
  },
  watch: {
    show: {
      handler: async function(newtrain, oldtrain) {
        this.refocus(null);
      }
    }
  },
  mounted: function() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
    this.refocus();
  }
};
</script>

<template name="train">
<transition>
        <div class="train-mask" @click="close()" v-show="show">
            <div class="train-container" @click.stop>
              <div class="train-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>
              <trainclone name="trainclone" :token="token" :username="username" :list="list" :show="showClone" :model="model" @close="refocus($event)"></trainclone>
              <trainnew name="trainnew" :token="token" :username="username" :show="showNew" :architecture="model.architecture" :list="list" @close="refocus($event)"></trainnew>
              <trainproceed name="trainproceed" :token="token" :username="username" :show="showProceed" :architecture="model.architecture" @close="refocus($event)"></trainproceed>

              <div class="train-info">
                  <ul class="train-entries">
                    <li class='train-entry-first'><label class="train-form-label">ID</label>
                    <output class="train-form-control">{{model.id}}</output></li>
                    <li class='train-entry-first'><label class="train-form-label">Name</label>
                    <output class="train-form-control">{{model.name}}</output></li>
                    <li class='train-entry-first'><label class="train-form-label">Owner</label>
                    <output class="train-form-control">{{model.user}}</output></li>
                    <li class='train-entry-first'><label class="train-form-label">Date Created</label>
                    <output class="train-form-control">{{model.date}}</output></li>
                    <li class='train-entry-second'><label class="train-form-label">Architecture</label>
                    <output class="train-form-control">{{model.architecture.name}}</output></li>
                  </ul>
              </div>
              <div class="train-selector">
                  <ul class="train-entries">
                  <li class='train-entry-first'><label class="train-form-label">Select Model:</label></li>
                  <select class="train-form-control" v-model="model">
                         <option :value="option" v-for="option in list">{{ option.name }}</option>
                  </select>
                  </ul>
              </div>
               <div class="train-footer">
                  <button class="train-default-button" @click="showClone=true" @close="showClone = false">Clone</button>
                  <button class="train-default-button" @click="showNew=true" @close="showNew = false">New</button>
                  <button class="train-default-button" @click="showProceed=true" @close="showProceed = false">Proceed</button>
             </div>
            </div>
        </div>
</transition>
</template>

<style>
.train-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.train-container {
  position: fixed;
  top: 30%;
  left: 35%;
  width: 30%;
  height: 30%;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}

.train-footer {
  margin-top:20%;
  margin-left: 27.5%;
  width: 50%;
  height: 50px;
}
.train-info{
   width: 75%;
  height: 50%
}
.train-selector {
  width: 80%;
  height: 30%
}

.train-entries {
  list-style-type: none;
  padding: 3px;
  margin: 3%;
}

.train-entry-first {
  float: left;
  margin-left: 5%;
  margin-right: 0;
}
.train-entry-second {
  float: right;
  margin-left: 0;
  margin-right: 5%;
}

.train-form-label {
  display: block;
  font-family: Brandon_lighter;
}

.train-form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.train-default-button {
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 2%;
}
.train-default-button:hover {
  background-color: #ec70a8;
}

.train-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.train-body {
  margin: 15px 2px;
}

.train-enter {
  opacity: 0;
}

.train-leave-active {
  opacity: 0;
}

.train-enter .train-container,
.train-leave-active .train-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

