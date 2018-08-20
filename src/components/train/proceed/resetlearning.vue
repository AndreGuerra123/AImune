<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#resetlearn-template",
  props: ["show", "token", "username", "model"],
  data: function() {
    return {
      error: null,
      name: null,
      confirmed: false
    };
  },
  methods: {
    reset: function(){
      this.name = '';
      this.error = '';
    },
    close: function(event) {
      this.reset();
      this.$emit("close");
    },
    submit: async function() {
      try {
        this.validation();
        await this.submition();
        this.close(null);
      } catch (err) {
        this.error = err.toString();
      }
    },
    submition: async function() {
      await ax
        .post("learning/reset",{source: this.model._id},{
          headers: { token: this.token }
        })
        .catch(err => {
          throw err;
        });
    },
    validation: function() {
      if (this.username != this.model.user) {
        throw new Error(
          "Only the original owner of the model can delete/modify it."
        );
      } else if (!this.name) {
        throw new Error("Please, confirm the model name to be deleted.");
      }
    }
  },
  watch: {
    name: {
      handler: async function(newv, oldv) {
        if (newv == this.model.name) {
          this.confirmed = true;
        } else {
          this.confirmed = false;
        }
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

<template name="resetlearn">
<transition>
        <div class="resetlearn-mask" @click="close" v-show="show">
            <div class="resetlearn-container" @click.stop>
                <div class="resetlearn-header">
                    <img src="../../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_1">Confirm Model Name*: </label>
			            <div data-tip="Confirm Model Name: confirms the model name for wich the learning step will be cancel/reset.">
                  <input id="element_1" name="element_1" class="field" type="text" maxlength="255" v-model="name" v-bind:placeholder="model.name"></div>
		            </li>
			          </ul>
                </form>
                </div>
                <div class="note"><b>Attention:</b> Cancel/Reset of the model learning step is irreversible. The weights file will be deleted aswell as any job queue reference.</div>

            </div>
                         <div class="resetlearn-footer" @click.stop>
                  <button class="resetlearn-default-button" @click="close()">Cancel</button>
                  <button v-if="confirmed" class="resetlearn-default-button" @click="submit()">Cancel/Reset Now</button>
            </div>
            <error :show="error" @close="error=null"></error>
        </div>
</transition>
</template>

<style>
* {
  box-sizing: border-box;
}

[data-tip] {
  position: relative;
}
[data-tip]:before {
  content: "";
  /* hides the tooltip when not hovered */
  display: none;
  content: "";
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #1a1a1a;
  position: absolute;
  top: 30px;
  left: 35px;
  z-index: 8;
  font-size: 0;
  line-height: 0;
  width: 0;
  height: 0;
}
[data-tip]:after {
  display: none;
  content: attr(data-tip);
  position: absolute;
  top: 35px;
  left: 0px;
  padding: 5px 8px;
  background: #1a1a1a;
  color: #fff;
  z-index: 9;
  font-size: 0.75em;
  height: 18px;
  line-height: 18px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  white-space: nowrap;
  word-wrap: normal;
}
[data-tip]:hover:before,
[data-tip]:hover:after {
  display: block;
}

.form {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.ul-list {
  list-style-type: none;
  margin-right: 5%;
  margin-left: 5%;
  padding: 0;
  overflow: visible;
}

.li-ele {
  margin: 3%;
  float: left;
}
.description {
  font-family: Brandon_normal;
  font-size: 22px;
}
.field {
  font-family: Brandon_lighter;
  font-size: 18px;
}
.note {
  clear: both;
  font-family: Brandon_normal;
  font-size: 18px;
  color: red;
}

.resetlearn-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.resetlearn-container {
  width: 500px;
  height: 300px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.resetlearn-default-button {
  display: inline-block;
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  text-align: center;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 1%;
}
.resetlearn-default-button:hover {
  background-color: #ec70a8;
}

.resetlearn-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.resetlearn-body {
  margin: 15px 2px;
}

.resetlearn-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-resetlearn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-resetlearn-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.resetlearn-enter {
  opacity: 0;
}

.resetlearn-leave-active {
  opacity: 0;
}

.resetlearn-enter .resetlearn-container,
.resetlearn-leave-active .resetlearn-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#resetlearncustomdropzone {
  height: 280px;
}
</style>

