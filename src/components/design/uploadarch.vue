<script>
export default {
  template: "#uploadarch-template",
  props: ["show", "token", "username", "list"],
  data: function() {
    return {
      name: null,
      shared: null,
      error: null,
      dropzoneOptions: {
        url: "https://209.97.191.228:3000/design/savenew",
        thumbnailWidth: 380,
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: ".json",
        headers: { token: this.token },
        paramName: "kerasfile",
        autoProcessQueue: false
      }
    };
  },
  methods: {
    close: function(event) {
      this.$emit("close",this.name);
    },
    reset: function() {
      try {
        this.$refs.uploadarchdropzone.removeAllFiles(true);
      } finally {
        this.name = "";
        this.shared = false;
      }
    },
    sending: function(file, xhr, formData) {
      formData.append("name", this.name);
      formData.append("user", this.username);
      formData.append("date", new Date());
      formData.append("shared", this.shared);
    },
    submit: function() {
      try {
        this.validation();
        this.$refs.uploadarchdropzone.processQueue();
      } catch (error) {
        this.error = error.toString();
      }
    },
    validation: function() {
      if (!this.name) {
        throw new Error("User must select a name for the model architecture.");
      } else if (!this.shared) {
        throw new Error(
          "User must decide the publicity of the model architecture."
        );
      } else if (this.repeated()) {
        throw new Error("Model architecture name is already taken.");
      }
    },
    repeated: function() {
      var badnames = this.list.map(a => a.name);
      return badnames.includes(this.name);
    },
    cancel: function() {
      this.reset();
      this.close();
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

<template name="uploadarch">
<transition>
        <div class="uploadarch-mask" @click="close" v-show="show">
            <div class="uploadarch-container" @click.stop>
                <div class="uploadarch-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <vue-dropzone ref="uploadarchdropzone" id="uploadarchcustomdropzone" :options="dropzoneOptions" v-on:vdropzone-sending="sending" v-on:vdropzone-success="close"></vue-dropzone>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_1">Architecture Name*: </label>
			            <div data-tip="Architecture Name: Identifies the name of the architecture to wich the file corresponds.">
                  <input id="element_1" name="element_1" class="field" type="text" maxlength="255" v-model="name"></div>
		            </li>
            		<li id="li_2" class="li-ele">
		              <label class="description" for="element_2">Public: </label>
		              <div data-tip="Public: identifies the availability of this model for other users.">
			              <input id="element_2" name="element_2" class="field" type="checkbox" maxlength="255" v-model="shared">
                  </div>
	            	</li>
			          </ul>
		            </form>
                </div>
            </div>
            <div class="uploadarch-footer" @click.stop>
                  <button class="uploadarch-default-button" @click="reset()">Reset</button>
                  <button class="uploadarch-default-button" @click="cancel()">Cancel</button>
                  <button class="uploadarch-default-button" @click="submit()">Submit</button>
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

.uploadarch-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.uploadarch-container {
  width: 500px;
  height: 600px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.uploadarch-default-button {
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
.uploadarch-default-button:hover {
  background-color: #ec70a8;
}

.uploadarch-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.uploadarch-body {
  margin: 15px 2px;
}

.uploadarch-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-uploadarch {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-uploadarch-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.uploadarch-enter {
  opacity: 0;
}

.uploadarch-leave-active {
  opacity: 0;
}

.uploadarch-enter .uploadarch-container,
.uploadarch-leave-active .uploadarch-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#uploadarchcustomdropzone {
  height: 280px;
}
</style>

