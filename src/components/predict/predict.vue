<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 10000
});
export default {
  template: "#predict-template",
  props: ["show", "token", "username"],
  data: function() {
    return {
      error: null,
      patient: "",
      condition: "",
      compound: "",
      classi: "",
      predicted: false,
      showResults: false,
      allowClassification: false,
      allowSave: false,
      models: [],
      model: {
        _id: null,
        name: null,
        user: null,
        date: null,
        architecture: { name: null, user: null }
      },
      temp_id: null,
      dropzoneOptions: {
        url: "https://209.97.191.228:3000/predict/loadTemporary",
        thumbnailWidth: 1400*0.20,
        thumbnailHeight: 300,
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        headers: { token: this.token },
        paramName: "image",
        autoProcessQueue: true
      }
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    retrieveValidModels: async function() {
      await ax
        .post(
          "/predict/current",
          {
            user: this.username
          },
          {
            headers: {
              token: this.token
            }
          }
        )
        .then(res => {
          this.models = res.data
        })
        .catch(err => {
          this.error = err.toString();
        });
        if(this.models[0]) this.model = this.models[0]
    },
    successEvent: function(file,res){
      this.temp_id = res
    },
    classify: function(){
      ax.post('/predict/classifyTemporary',{
        model_id: this.model._id,
        temp_id: this.temp_id
      },{headers:{
        token: this.token
      }}).then(res=>{
        this.predicted = true
        this.classi = res
      }).catch(err=>{
        this.err = err.toString()
      })
    },
    save: function(){
      ax.post('/predict/transferTemporary',{
        user: this.username,
        patient: this.patient,
        condition: this.condition,
        compound: this.compound,
        classi: this.classi,
        temp_id: this.temp_id
      },{headers:{
        token: this.token
      }}).then(res=>{
        console.log(res)
        this.predicted = true
        this.classi = Number.parseInt(res)
      }).catch(err=>{
        this.err = err.toString()
      })
    },
    global: function(){
      this.allowClassification = (this.model && this.temp_id)
      this.allowSave = (this.temp_id && this.predicted)
    }
  },
  watch: {
    show: function(n, o) {
      if (n) {
        this.retrieveValidModels();
      }
    },
    model: function(n,o){
      this.global()
    },
    temp_id:function(n,o){
      this.global()
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

<template name="predict">
<transition>
        <div class="predict-mask" @click="close" v-show="show">
            <div class="predict-container" @click.stop>
                <div class="predict-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div class="panel">
                    <ul class="ul-list">
      					<li id="selectmodel" class="li-ele">
		              <label class="description" for="selectmodel">Select Model: </label>
			            <div data-tip="Select Model: Identifies the model to be used to make the prediction.">
                  <select v-model="model">
                         <option :value="mod" v-for="mod in models">{{ mod.name }}</option>
                  </select>
                  </div>
		            </li>
                <li id="liid" class="li-ele">
		              <label class="description" for="liid">ID: </label>
		              <div data-tip="ID: uniquely identifies the model.">
			              {{model._id}} </div>
		            </li>
                <li id="liname" class="li-ele">
		              <label class="description" for="liname">Name: </label>
		              <div data-tip="Name: name given by the user to the model.">
			              {{model.name}} </div>
		            </li>
                <li id="liuser" class="li-ele">
		              <label class="description" for="liuser">Owner: </label>
		              <div data-tip="Owner: the user which owns this model.">
			              {{model.user}} </div>
		            </li>
                <li id="lidate" class="li-ele">
		              <label class="description" for="lidate">Date Created: </label>
		              <div data-tip="Date Created: the user which owns this model.">
			              {{model.date}} </div>
		            </li>
                <li id="liarchname" class="li-ele">
		              <label class="description" for="liarchname">Architecture Name: </label>
		              <div data-tip="Architecture Name: the name of the model's architecture.">
			              {{model.architecture.name}} </div>
		            </li>
                <li id="liarchuser" class="li-ele">
		              <label class="description" for="liarchnuser">Architecture Owner: </label>
		              <div data-tip="Architecture Owner: the name of the model's architecture owner.">
			              {{model.architecture.user}} </div>
		            </li>
			          </ul>
                </div>

                <vue-dropzone ref="predictdropzone" id="customdropzone" :options="dropzoneOptions" v-on:vdropzone-success="successEvent"></vue-dropzone>

                <div class="panel">

			          <ul class="ul-list">
      					<li id="ppatient" class="li-ele">
		              <label class="description" for="ppatient">Patient: </label>
			            <div data-tip="Patient Reference ID: Identifies the patient from which the sample was collected.">
                  <input id="ppatient" name="ppatient" class="field" type="text" maxlength="255" v-model="patient"></div>
		            </li>
            		<li id="pconditions" class="li-ele">
		              <label class="description" for="pconditions">Conditions: </label>
		              <div data-tip="Test Condition: identifies with conditions where performed in the design of experiments.">
			              <input id="pconditions" name="pconditions" class="field" type="text" maxlength="255" v-model="condition">
                  </div>
	            	</li>
                <li id="pcompound" class="li-ele">
		              <label class="description" for="pcompound">Compound: </label>
		              <div data-tip="Tested Compound: identifies wich compounds were used in oder to test their immunogeneicity.">
			              <input id="pcompound" name="pcompound" class="field" type="text" maxlength="255" v-model="compound"> </div>
		            </li>
                <li id="pclasse" class="li-ele">
		              <label class="description" for="pclasse">*Classification: </label>
		              <div data-tip="Predicted Classification: (predicted) classification of the image.">
			              <input id="pclasse" name="pclasse" class="field" type="number" maxlength="255" v-model="classi"> </div>
		            </li>
			          </ul>
                <button v-if="predicted" class="predict-default-button" @click="showResults=true">Results</button>
                </div>
                <error :show="error" @close="error=null"></error>
            </div>
            <div class="predict-footer" @click.stop>
                  <button v-if="allowClassification" class="predict-default-button" @click="classify()">Classify</button>
                  <button v-if="allowSave" class="predict-default-button" @click="save()">Save</button>
            </div>
        </div>
</transition>
</template>

<style>
* {
  box-sizing: border-box;
}
.panel {
  width: 33%;
  float: left;
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
  }

.ul-list {
  list-style-type: none;
  padding: 0;
  overflow: visible;
}

.li-ele {
  float: left;
  width:90%
}

.description {
  font-family: Brandon_normal;
  font-size: 22px;
}
.field {
  font-family: Brandon_lighter;
  font-size: 18px;
}

.predict-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.predict-container {
  width: 1400px;
  height: 700px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.predict-default-button {
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
.predict-default-button:hover {
  background-color: #ec70a8;
}

.predict-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.predict-body {
  margin: 15px 2px;
}

.predict-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-label-predict {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black;
}
.form-predict-desc {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red;
}

.predict-enter {
  opacity: 0;
}

.predict-leave-active {
  opacity: 0;
}

.predict-enter .predict-container,
.predict-leave-active .predict-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#customdropzone {
  float:left;
  width:33%;
  height:82.5%
}
</style>

