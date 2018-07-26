<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#trainnew-template",
  props: ["show", "token", "username", "list"],
  data: function() {
    return {
      name: null,
      shared: false,
      architecture: null,
      error: null,
      archlist: null,
    };
  },
  methods: {
    close: function(value) {
      this.$emit("close",value);
      this.reset();
    },
    reset: function(){
      this.name=null;
      this.shared=false;
      this.architecture=null;
      this.error=null;
      this.archlist=null;
    },
    update: async function(){
      //Here existing archs are restrieved
      await ax
        .get("design/init", {
          params: { user: this.username },
          header: { token: this.token }
        })
        .then(res => {
          this.archlist = res.data;
        });
    },
    validation: function() {

      if(!this.name){
        throw new Error("Please select a valid name for the new model.")
      }else if(this.used()){
        throw new Error("Please select a unique name for the new model.")
      }else if(!this.architecture){
        throw new Error("Please select a valid architecture for the new model.")
      }

    },
    used: function(){

        var badnames = this.list
        .filter(a =>  a.user == this.username) //FROM THIS USER
        .map(a => a.name);//GET THE EXISTENT NAMES OF MODELS
        return badnames.includes(this.newname); //IF newname is prsent then badluck
    },
    submit: async function() {

      try{
        this.validation();
        await ax
        .post(
          "/model/new",
          {
            user: this.username,
            date: new Date(),
            shared: this.shared,
            architecture: this.architecture
          },
          {
            headers: { token: this.token }
          }
        )
        .then(res => {
          this.close(res.data.id);
        })
        .catch(err => {
          throw err;
        });
      }catch(err){
        this.error = err.toString()
      }

    }
  },
  watch: {
    show: {
      handler: async function(newmodel,oldmodel){
      this.update();
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

<template name="trainnew">
<transition>
        <div class="trainnew-mask" @click="close" v-show="show">
              <error :show="error" @close="error = false"></error>
              <div class="trainnew-container" @click.stop>
              <div class="train-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>
              <div class="trainnew-info">
                  <ul class="trainnew-entries">
                    <li class='trainnew-entry-first'>
                    <label class="trainnew-form-label">Model Name</label>
                    <input class="trainnew-form-control" :value = "name">
                    </li>
                    <li class='trainnew-entry-first'>
                    <label class="trainnew-form-label">Model Architecture</label>
                    <select class="trainnew-form-control" v-model="architecture">
                         <option :value="option" v-for="option in archlist">{{ option.name }}</option>
                    </select>
                    </li>
                    <li class='trainnew-entry-first'>
                    <label class="trainnew-form-label">Public</label>
                    <input class="trainnew-form-control" type="checkbox" :value = "shared">
                    </li>
                  </ul>
              </div>
              <div class="trainnew-footer">
              <button class="train-default-button" @click="submit">Confirm</button>
             </div>
            </div>
        </div>
</transition>
</template>

<style>
.trainnew-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.trainnew-container {
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

.trainnew-footer {
  display: block;
  text-align:center;
  margin-top: 10%;

}
.trainnew-info {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trainnew-entries {
  display: inline-block;
  list-style-type: none;
  padding: 3px;
  margin: 3%;
}

.trainnew-entry-first {
  float: left;
  padding: 5px
}
.trainnew-entry-second {
  float: right;
    padding: 5px

}

.trainnew-form-label {
  display: block;
  font-family: Brandon_lighter;
}

.trainnew-form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.trainnew-default-button {
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 2%;
}
.trainnew-default-button:hover {
  background-color: #ec70a8;
}

.trainnew-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.trainnew-body {
  margin: 15px 2px;
}

.trainnew-enter {
  opacity: 0;
}

.trainnew-leave-active {
  opacity: 0;
}

.trainnew-enter .trainnew-container,
.trainnew-leave-active .trainnew-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

