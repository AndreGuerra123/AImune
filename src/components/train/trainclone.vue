<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#trainclone-template",
  props: ["show", "token", "username", "list", "model"],
  data: function() {
    return {
      newname: null,
      error: null
    };
  },
  methods: {
    close: function(value) {
      this.$emit("close",value);
      this.name='';
    },
    validation: function() {
      if (!this.$optionsmodel) {
        throw new Error("Please go back and select a valid model.");
      } else if (!this.newname) {
        throw new Error("Please insert a valid model name.");
      } else if (this.used()) {
        throw new Error("Please insert an unique model name.");
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
          "/model/clone",
          {
            username: this.username,
            source: this.model.id,
            newname: this.newname
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
  mounted: function() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  }
};
</script>

<template name="trainclone">
<transition>
        <div class="trainclone-mask" @click="close" v-show="show">
              <error :show="error" @close="error = false"></error>
              <div class="trainclone-container" @click.stop>
              <div class="train-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>
              <div class="trainclone-info">
                  <ul class="trainclone-entries">
                    <li class='trainclone-entry-first'>
                    <label class="trainclone-form-label">New Model Name*:</label>
                    <input class="trainclone-form-control" :value = "newname">
                    </li>
                  </ul>
              </div>
              <div class="trainclone-footer">
              <button class="train-default-button" @click="submit">Confirm</button>
             </div>
            </div>
        </div>
</transition>
</template>

<style>
.trainclone-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.trainclone-container {
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

.trainclone-footer {
  display: block;
  text-align:center;
  margin-top: 10%;

}
.trainclone-info {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trainclone-entries {
  display: inline-block;
  list-style-type: none;
  padding: 3px;
  margin: 3%;
}

.trainclone-entry-first {
  float: left;
}
.trainclone-entry-second {
  float: right;
}

.trainclone-form-label {
  display: block;
  font-family: Brandon_lighter;
}

.trainclone-form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.trainclone-default-button {
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 2%;
}
.trainclone-default-button:hover {
  background-color: #ec70a8;
}

.trainclone-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.trainclone-body {
  margin: 15px 2px;
}

.trainclone-enter {
  opacity: 0;
}

.trainclone-leave-active {
  opacity: 0;
}

.trainclone-enter .trainclone-container,
.trainclone-leave-active .trainclone-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

