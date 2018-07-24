<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#savearch-template",
  props: ["show", "token", "username", "architecture", "list"],
  data: function() {
    return {
      status: true,
      savedisplay: "Save",
      error: null,
      name: this.architecture.name,
      shared: this.architecture.shared
    };
  },
  methods: {
    close: function(event) {
      this.$emit("close", this.name);
    },
    submit: async function() {
      try {
        this.validation();
        await this.submition();
        this.close();
      } catch (err) {
        this.error = err.toString();
      }
    },
    submition: async function() {
      await ax
        .post(
          "design/saveold",
          {
           name:this.name,
           shared:this.shared,
           date: new Date(),
           user:this.username,
           file:this.architecture.file
          },
          {
            headers: { token: this.token }
          }
        )
        .catch(err => {
          throw new Error(err.message);
        });
    },
    validation: function() {
      if (this.username != this.architecture.user) {
        throw new Error(
          "Only the original owner of the architecture can modify it."
        );
      } else if (!this.name) {
        throw new Error("Please, confirm the architecture name to be saved.");
      } else if (this.isDifferentOwnedModel()){
        throw new Error("The model architecture name selected is already taken for this user.");
      }
    },
    isDifferentOwnedModel: function(){
      return this.list
      .filter(e=>{return (e.user==this.username)}) //Find archs of this username
      .filter(e=>{return (e.name!=this.architecture.name)}) //This arch name is allowed for current saving
      .some(e=>{return (e.name==this.name)})
    }
  },
  watch: {
    name: {
      handler: async function(newv, oldv) {
        if (newv == this.architecture.name) {
          this.status = true;
          this.savedisplay = "Save";
        } else {
          this.status = false;
          this.savedisplay = "Save New";
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

<template name="savearch">
<transition>
        <div class="savearch-mask" @click="close" v-show="show">
            <div class="savearch-container" @click.stop>
                <div class="savearch-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_11">Architecture Name*: </label>
			            <div data-tip="Architecture Name: Identifies the name of the architecture to wich the file corresponds.">
                  <input id="element_11" name="element_11" class="field" type="text" maxlength="255" v-model="name" v-bind:placeholder="architecture.name"></div>
		            </li>
            		<li id="li_2" class="li-ele">
		              <label class="description" for="element_21">Public: </label>
		              <div data-tip="Public: identifies the availability of this model for other users.">
			              <input id="element_21" name="element_21" class="field" type="checkbox" maxlength="255" v-model="shared">
                  </div>
	            	</li>
			          </ul>
                </form>
                </div>
                <div v-if="status" class="note"><b>Attention:</b> Overriding the architecture is irreversible.</div>
            </div>
            <div class="savearch-footer" @click.stop>
                  <button class="savearch-default-button" @click="close()">Cancel</button>
                  <button class="savearch-default-button" @click="submit()">{{savedisplay}}</button>
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
.note {
clear:both;
  font-family: Brandon_normal;
  font-size: 18px;
  color: red;
}

.description {
  font-family: Brandon_normal;
  font-size: 22px;
}
.field {
  font-family: Brandon_lighter;
  font-size: 18px;
}

.savearch-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.savearch-container {
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
.savearch-default-button {
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
.savearch-default-button:hover {
  background-color: #ec70a8;
}

.savearch-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.savearch-body {
  margin: 15px 2px;
}

.savearch-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-savearch {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-savearch-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.savearch-enter {
  opacity: 0;
}

.savearch-leave-active {
  opacity: 0;
}

.savearch-enter .savearch-container,
.savearch-leave-active .savearch-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#savearchcustomdropzone {
  height: 280px;
}
</style>

