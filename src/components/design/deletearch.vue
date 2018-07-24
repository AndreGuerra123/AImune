<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#deletearch-template",
  props: ["show", "token", "username", "architecture"],
  data: function() {
    return {
      error: null,
      name: null,
      confirmed: false
    };
  },
  methods: {
    close: function(event) {
      this.$emit("close");
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
        .delete("design/delete", {
          params: {
            user: this.username,
            name: this.name
          },
          headers: { token: this.token }
        })
        .catch(err => {
          throw new Error(err.message);
        });
    },
    validation: function() {
      if (this.username != this.architecture.user) {
        throw new Error(
          "Only the original owner of the architecture can delete it."
        );
      } else if (!this.name) {
        throw new Error("Please, confirm the architecture name to be saved.");
      }
    }
  },
  watch: {
    name: {
      handler: async function(newv, oldv) {
        if (newv == this.architecture.name) {
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

<template name="deletearch">
<transition>
        <div class="deletearch-mask" @click="close" v-show="show">
            <div class="deletearch-container" @click.stop>
                <div class="deletearch-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_1">Confirm Architecture Name*: </label>
			            <div data-tip="Confirm Architecture Name: confirms the architecture name to be deleted.">
                  <input id="element_1" name="element_1" class="field" type="text" maxlength="255" v-model="name" v-bind:placeholder="architecture.name"></div>
		            </li>
			          </ul>
                </form>
                </div>
                <div class="note"><b>Attention:</b> Deletion of the architecture is irreversible.</div>

            </div>
                         <div class="deletearch-footer" @click.stop>
                  <button class="deletearch-default-button" @click="close()">Cancel</button>
                  <button v-if="confirmed" class="deletearch-default-button" @click="submit()">Delete Now</button>
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
  clear:both;
  font-family: Brandon_normal;
  font-size: 18px;
  color: red;
}

.deletearch-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.deletearch-container {
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
.deletearch-default-button {
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
.deletearch-default-button:hover {
  background-color: #ec70a8;
}

.deletearch-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.deletearch-body {
  margin: 15px 2px;
}

.deletearch-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-deletearch {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-deletearch-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.deletearch-enter {
  opacity: 0;
}

.deletearch-leave-active {
  opacity: 0;
}

.deletearch-enter .deletearch-container,
.deletearch-leave-active .deletearch-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#deletearchcustomdropzone {
  height: 280px;
}
</style>

