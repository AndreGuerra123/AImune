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
      showDelete:false,
      showClone: false,
      showNew: false,
      showProceed: false,
      list: null, //list of available models
      model: {
        _id: null,
        name: null,
        user: null,
        date: null,
        shared: null,
        architecture: { name: null, user: null }
      }
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
      this.showDelete = false;
      this.showClone = false;
      this.showNew = false;
      this.showProceed = false;

      await this.updateList();

      if (this.list) {
        if (value) {
          var idx = this.list.findIndex(({ _id }) => _id == value);
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
              <traindelete name="deletearch" :token="token" :username="username" :show="showDelete" :model="model" @close="refocus($event)"></traindelete>
              <trainclone name="trainclone" :token="token" :username="username" :list="list" :show="showClone" :model="model" @close="refocus($event)"></trainclone>
              <trainnew name="trainnew" :token="token" :username="username" :show="showNew" :architecture="model.architecture" :list="list" @close="refocus($event)"></trainnew>
              <trainproceed name="trainproceed" :token="token" :username="username" :show="showProceed" :model="model" @close="refocus($event)"></trainproceed>
              <div class="train-info">
                <table class="train-table">
                  <tr class="train-table-row">
                    <th class="train-table-header">ID</th>
                    <th class="train-table-header">Name</th>
                    <th class="train-table-header">Owner</th>
                  </tr>
                  <tr class="train-table-row">
                    <td class="train-table-data" >{{model._id}}</td>
                    <td class="train-table-data" >{{model.name}}</td>
                    <td class="train-table-data" >{{model.user}}</td>
                  </tr>
                  <tr class="train-table-row">
                    <th class="train-table-header">Date Created</th>
                    <th class="train-table-header">Architecture Name</th>
                    <th class="train-table-header">Architecture Owner</th>
                  </tr>
                  <tr class="train-table-row">
                    <td class="train-table-data" >{{model.date}}</td>
                    <td class="train-table-data" >{{model.architecture.name}}</td>
                    <td class="train-table-data" >{{model.architecture.user}}</td>
                  </tr>
                  <tr class="train-table-row">
                    <th class="train-table-header"></th>
                    <th class="train-table-header">Select Model:</th>
                    <th class="train-table-header"></th>
                  </tr>
                  <tr class="train-table-row">
                    <th class="train-table-data"></th>
                    <th class="train-table-data">
                      <select v-model="model">
                         <option :value="option" v-for="option in list">{{ option.name }}</option>
                      </select></th>
                    <th class="train-table-data"></th>
                  </tr>
                </table>
              </div>
              <div class="train-footer">
                <button class="train-default-button" @click="showDelete=true" @close="showDelete = false">Delete</button>
                <button class="train-default-button" @click="showClone=true" @close="showClone = false">Clone</button>
                <button class="train-default-button" @click="showNew=true" @close="showNew = false">New</button>
                <button class="train-default-button" @click="showProceed = true" @close="showProceed = false">Proceed</button>
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
  margin: 30% 17.5%;
  width: 100%;
  height: 50px;
}
.train-info {
  margin-top: 5%;
  margin-bottom: 5%;
  width: 100%;
  height: 50%;
}

.train-table{
  width:100%;

}
.train-table-row{
  border-bottom: 5px;
}
.train-table-header{
  font-family: Brandon_lighter;
  text-align:justify
}
.train-table-data{
  font-family: Brandon_thin;
  text-align: justify;
}

.train-form-label {
  display: block;

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

