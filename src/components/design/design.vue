<script>
import axios from "axios";

const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});

export default {
  template: "#design-template",
  props: ["show", "token", "username"],
  data: function() {
    return {
      showUploader: false,
      showSaver: false,
      showDeleter: false,
      architecture: {
        _id: null,
        name: null,
        user: null,
        date: null,
        shared: null,
        file: null
      },
      configuritas: {
        rankdir: "UD",
        nodesep: 20,
        edgesep: 20,
        ranksep: 40,
        marginx: 0,
        marginy: 0
      },
      list: null
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    updateList: async function() {
      await ax
        .get("design/init", {
          params: { user: this.username },
          header: { token: this.token }
        })
        .then(res => {
          this.list = res.data;
        });
    },
    updateEditor: function() {
      if(this.architecture.file){
         console.log(typeof(this.architecture.file))
         console.log(this.architecture.file)
         // let editor = new KerasModelEditor(JSON.parse(this.architecture.file),"keras-editor", this.configuritas );
         // editor.show();
      }
    },
    refocus: async function(value) {
      this.showUploader = false;
      this.showSaver = false;
      this.showDeleter = false;

      await this.updateList();

      if (value != null) {
        var idx = this.list.findIndex(({ name }) => name === value);
        if (idx != -1) {
          this.architecture = this.list[idx];
        } else {
          this.setFirst();
        }
      } else {
        this.setFirst();
      }
    },
    setFirst: function() {
      if (this.list && this.list[0]) {
        this.architecture = this.list[0];
      }
    }
  },
  watch: {
    architecture: {
      handler: function(newArch, oldArch) {
        document.getElementById("keras-editor").innerHTML = "";
        this.updateEditor();
      },
      deep: true
    },
    show: {
      handler: async function(newDesign, oldDesign) {
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
    this.updateEditor();
  }
};
</script>

<template name="design">
<transition>
        <div class="design-mask" @click="close()" v-show="show">
            <div class="design-container" @click.stop>
              <div class="design-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>
              <uploadarch name="uploadarch" :token="token" :username="username" :list="list" :show="showUploader" @close="refocus($event)"></uploadarch>
              <savearch name="savearch" :token="token" :username="username" :show="showSaver" :architecture="architecture" :list="list" @close="refocus($event)"></savearch>
              <deletearch name="deletearch" :token="token" :username="username" :show="showDeleter" :architecture="architecture" @close="refocus($event)"></deletearch>

              <div id="keras-editor" ref="keras-editor" class="design-editor"></div>
              <div class="design-selector">
                  <ul class="design-entries">
                    <li class='design-entry-first'><label class="design-form-label">ID</label>
                    <output class="design-form-control">{{architecture._id}}</output>
                    <li class='design-entry-first'><label class="design-form-label">Name</label>
                    <output class="design-form-control">{{architecture.name}}</output></li>
                    <li class='design-entry-first'><label class="design-form-label">Owner</label>
                    <output class="design-form-control">{{architecture.user}}</output></li>
                    <li class='design-entry-first'><label class="design-form-label">Date Created</label>
                    <output class="design-form-control">{{architecture.date}}</output></li>
                    <li class='design-entry-second'><label class="design-form-label">Select Architecture:</label>
                    <select class="design-form-control" v-model="architecture">
                         <option :value="option" v-for="option in list">{{ option.name }}</option>
                    </select>
                    </li>
                  </ul>
              </div>
               <div class="design-footer">
                  <button class="design-default-button" @click="showUploader=true" @close="showUploader = false">Upload</button>
                  <button class="design-default-button" @click="showSaver=true" @close="showSaver = false">Save</button>
                  <button class="design-default-button" @click="showDeleter=true" @close="showDeleter = false">Delete</button>
             </div>
            </div>
        </div>
</transition>
</template>

<style>

.design-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.design-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}

.design-footer {
  margin-left: 42%;
  width:16%;
  height:50px;
}

.design-editor {
  width: 100%;
  height: 80%;
}
.design-selector {
  width: 100%;
  height: 10%;
}


.design-entries {
  list-style-type: none;
  padding: 3px;
  margin: 3%;
}

.design-entry-first {
  float: left;
  margin-left: 5%;
  margin-right: 0;
}
.design-entry-second {
  float: right;
  margin-left: 0;
  margin-right: 5%;
}

.design-form-label {
  display: block;
  font-family: Brandon_lighter;
}

.design-form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.design-default-button {
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 2%;
}
.design-default-button:hover {
  background-color: #ec70a8;
}

.design-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.design-body {
  margin: 15px 2px;
}



.design-enter {
  opacity: 0;
}

.design-leave-active {
  opacity: 0;
}

.design-enter .design-container,
.design-leave-active .design-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

