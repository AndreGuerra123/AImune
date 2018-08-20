<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#proceed-dataset-template",
  props: ["show", "token", "username", "model"],
  data: function() {
    return {
      width: 200,
      height: 200,
      rotate: true,
      normalise: true,
      patients: ["-1"],
      conditions: ["-1"],
      compounds: ["-1"],
      classes: ["-1"],
      patients_opts: null,
      conditions_opts: null,
      compounds_opts: null,
      classes_opts: null,
      error: null,
      date: null
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    validation: function() {
      if (this.width < 50 || this.height < 50) {
        throw new Error("Width and height should be bigger than 50px.");
      } else if (this.rotate == null) {
        throw new Error("Select valid rotation.");
      } else if (this.normalise == null) {
        throw new Error("Select valid normalisation.");
      } else if (this.classes.length == 1 && this.classes[0] != "-1") {
        throw new Error("Select at least two valid classes.");
      }
    },
    update: async function() {
      try {
        this.validation();
        await ax.post(
          "dataset/update",
          {
            source: this.model._id,
            patients: this.patients,
            conditions: this.conditions,
            compounds: this.compounds,
            classes: this.classes,
            rotate: this.rotate,
            normalise: this.normalise,
            width: this.width,
            height: this.height
          },
          {
            headers: { token: this.token }
          }
        );
        this.close();
        this.reset();
      } catch (err) {
        this.error = err.toString();
      }
    },
    reset: function() {
      this.error = null;
    },
    getDatasetConfiguration: async function() {
      await ax
        .get("dataset/current", {
          params: { source: this.model._id },
          header: { token: this.token }
        })
        .then(res => {
          if (res.data) {
            const {
              rotate,
              normalise,
              patients,
              conditions,
              compounds,
              classes,
              width,
              height,
              date
            } = res.data;
            this.rotate= rotate;
            this.normalise= normalise;
            this.patients= patients;
            this.conditions= conditions;
            this.compounds= compounds;
            this.classes= classes;
            this.width= width;
            this.height= height;
            this.date = date;
          }
        })
        .catch(err => (this.error = err.toString()));
    },
    getDatasetOptions: async function() {
      await ax
        .get("dataset/options", {
          params: { user: this.username },
          header: { token: this.token }
        })
        .then(res => {
          const {
            patients_opts,
            conditions_opts,
            compounds_opts,
            classes_opts
          } = res.data;
          this.patients_opts = patients_opts;
          this.conditions_opts = conditions_opts;
          this.compounds_opts = compounds_opts;
          this.classes_opts = classes_opts;
        })
        .catch(err => (this.error = err.toString()));
    }
  },
  mounted: function() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  },
  watch: {
    show: function(news, olds) {
      this.getDatasetOptions();
      this.getDatasetConfiguration();
    }
  }
};
</script>

<template name="proceed-dataset">
<transition>
        <div class="proceed-dataset-mask" @click="close" v-show="show">
            <div class="proceed-dataset-container" @click.stop>
                <span :value="date"></span>
                <div>
                   <form class="form">
			          <ul class="ul-list">
      					<li id="li_1" class="li-ele">
		              <label class="description" for="element_1">Final Width: </label>
			            <div data-tip="Final Width: Images final after rescaling, prior to training.">
                  <input id="element_1" name="element_1" class="field" type="number"   v-model="width"></div>
		            </li>
            		<li id="li_2" class="li-ele">
		              <label class="description" for="element_2">Final Height: </label>
			            <div data-tip="Final Height: Images final after rescaling, prior to training.">
			              <input id="element_2" name="element_2" class="field" type="number"   v-model="height">
                  </div>
	            	</li>
                <li id="li_3" class="li-ele">
		              <label class="description" for="element_3">Rotate: </label>
		              <div data-tip="Rotate: rotates the image in all direction prior to training.">
			              <input id="element_3" name="element_3" class="field" type="checkbox"   v-model="rotate"> </div>
		            </li>
                <li id="li_3" class="li-ele">
		              <label class="description" for="element_3">Normalise: </label>
		              <div data-tip="Normalise: normalises the color spetrum of between all images.">
			              <input id="element_3" name="element_3" class="field" type="checkbox"   v-model="normalise"> </div>
		            </li>
                <li id="li_4" class="li-ele">
		              <label class="description" for="element_4">Patients: </label>
		              <div data-tip="Patients: this allows to select images from specific patients (Leave empty for all).">
                    <select multiple="true"  id="element_4" name="element_4" class="field"  v-model="patients">
                         <option value="-1">All</option>
                         <option :value="patient" v-for="patient in patients_opts">{{ patient }}</option>
                    </select>
		              </div>
		            </li>
                <li id="li_4" class="li-ele">
		              <label class="description" for="element_4">Conditions: </label>
		              <div data-tip="Conditions: this allows to select images from specific conditions (Leave empty for all).">
		                <select multiple="true"  id="element_4" name="element_4" class="field"  v-model="conditions">
                         <option value="-1">All</option>
                         <option :value="condition" v-for="condition in conditions_opts">{{ condition }}</option>
                    </select>
		              </div>
		            </li>
                <li id="li_4" class="li-ele">
		              <label class="description" for="element_4">Compounds: </label>
		              <div data-tip="Compounds: this allows to select images from specific compounds (Leave empty for all).">
		                <select multiple="true"  id="element_4" name="element_4" class="field"  v-model="compounds">
                         <option value="-1">All</option>
                         <option :value="compound" v-for="compound in compounds_opts">{{ compound }}</option>
                    </select>
		              </div>
		            </li>
                <li id="li_4" class="li-ele">
		              <label class="description" for="element_4">Classes: </label>
		              <div data-tip="Classes: this allows to select images from specific classes (Leave empty for all or select at least 2).">
		                <select multiple="true"  id="element_4" name="element_4" class="field"  v-model="classes">
                         <option value="-1">All</option>
                         <option :value="classi" v-for="classi in classes_opts">{{ classi }}</option>
                    </select>
		              </div>
		            </li>
                 <li id="li_3" class="li-ele">
                    <label class="description" for="date_dataset">Last Modified </label>
                     <div data-tip="Date: represents the date when the dataset configuration was last updated."> </div>
                     <output id="date_dataset" name="date_dataset" class="field">{{date}}</output>
                     </li>
			          </ul>
		            </form>
                </div>
                <error :show="error" @close="error=null"></error>
            </div>
             <div class="proceed-dataset-footer" @click.stop>
                  <button class="proceed-dataset-default-button" @click="reset()">Reset</button>
                  <button class="proceed-dataset-default-button" @click="close()">Cancel</button>
                  <button class="proceed-dataset-default-button" @click="update()">Update</button>
            </div>
        </div>
</transition>
</template>

<style>
.proceed-dataset-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.proceed-dataset-container {
  width: 500px;
  height: 470px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.proceed-dataset-default-button {
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
.proceed-dataset-default-button:hover {
  background-color: #ec70a8;
}
.proceed-dataset-footer {
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 170px;
  height: 30px;
}

</style>
