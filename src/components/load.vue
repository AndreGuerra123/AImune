<script>
export default {
  template: "#load-template",
  props: ["show","token"],
  data: function() {
    return {
      patient: 'a',
      condition: '',
      compound: '',
      classi: '',
      dropzoneOptions: {
        url: "https://209.97.191.228:3000/load",
        thumbnailWidth: 380,
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        headers: { "token": this.token },
        paramName:"image",
        autoProcessQueue: false
      }
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    reset: function(){
      try{
        this.$refs.loaddropzone.removeAllFiles(true);
      }finally{
             this.patient = '';
      this.condition = '';
      this.compound = '';
      this.classi = '';
      }

    },
    sending: function(file, xhr, formData){
      formData.append('username',this.username);
      formData.append('patient', this.patient);
      formData.append('condition', this.condition);
      formData.append('compound', this.compound);
      formData.append('classi', this.classi);
    },
    submit: function(){
      this.$refs.loaddropzone.processQueue();
    },
    cancel: function(){
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

<template name="load">
<transition>
        <div class="load-mask" @click="close" v-show="show">
            <div class="load-container" @click.stop>
                <div class="load-header">
                    <img src="../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <vue-dropzone ref="loaddropzone" id="customdropzone" :options="dropzoneOptions" v-on:vdropzone-sending="sending" v-on:vdropzone-sucess="close"></vue-dropzone>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_1">Patient Reference: </label>
			            <div data-tip="Patient Reference ID: Identifies the patient from which the sample was collected.">
                  <input id="element_1" name="element_1" class="field" type="text" maxlength="255" :value="patient"></div>
		            </li>
            		<li id="li_2" class="li-ele">
		              <label class="description" for="element_2">Tested Conditions: </label>
		              <div data-tip="Test Condition: identifies with conditions where performed in the design of experiments.">
			              <input id="element_2" name="element_2" class="field" type="text" maxlength="255" :value="condition">
                  </div>
	            	</li>
                <li id="li_3" class="li-ele">
		              <label class="description" for="element_3">Tested Compound: </label>
		              <div data-tip="Tested Compound: identifies wich compounds were used in oder to test their immunogeneicity.">
			              <input id="element_3" name="element_3" class="field" type="text" maxlength="255" :value="compound"> </div>
		            </li>
                <li id="li_4" class="li-ele">
		              <label class="description" for="element_4">*Classification: </label>
		              <div data-tip="*Classification: this value corresponds to the histopathological analysis of this image (0-4). This field is required.">
		                <input id="element_4" name="element_4" class="field" type="number" maxlength="255" :value="classi">
		              </div>
		            </li>
			          </ul>
		            </form>
                </div>
            </div>
            <div class="load-footer" @click.stop>
                  <button class="load-default-button" @click="reset()">Reset</button>
                  <button class="load-default-button" @click="cancel()">Cancel</button>
                  <button class="load-default-button" @click="submit()">Submit</button>
            </div>
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

.load-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.load-container {
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
.load-default-button {
  display: inline-block;
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  text-align: center;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin:1%
}
.load-default-button:hover {
  background-color: #ec70a8;
}

.load-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.load-body {
  margin: 15px 2px;
}

.load-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-load {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-load-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.load-enter {
  opacity: 0;
}

.load-leave-active {
  opacity: 0;
}

.load-enter .load-container,
.load-leave-active .load-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#customdropzone {
  height: 280px;
}
</style>

