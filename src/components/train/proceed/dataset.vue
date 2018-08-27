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
      width: 100,
      height: 100,
      center: false,
      normalise: false,
      data_format: "channels_last",
      color_format: "RGB",
      rescale: 1/255,
      rounds: 0,
      transform: false,
      random: false,
      keep: false,
      rotation: 0.0,
      width_shift: 0.0,
      height_shift: 0.0,
      shear: 0.0,
      channel_shift: 0.0,
      brightness: 1.0,
      zoom: 1.0,
      horizontal_flip: false,
      vertical_flip: false,
      fill_mode: "nearest",
      cval: 0.0,
      patients: ["-1"],
      conditions: ["-1"],
      compounds: ["-1"],
      classes: ["-1"],
      patients_opts: null,
      conditions_opts: null,
      compounds_opts: null,
      classes_opts: null,
      data_format_opts: ["channels_last", "channels_first"],
      color_format_opts: ["L", "RGB", "RGBA"],
      fill_mode_opts: ["nearest","bilinear","bicubic","hamming","box","lanczos"],
      error: null,
      date: null

    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    isValidBoolean: function(obj,msg){
      if(typeof(obj)!="boolean"){
        throw new Error(msg)
      }
    },
    isValidOption: function(obj,opts,msg){
      if(!opts.includes(obj)){
        throw new Error(msg)
      }
    },
    isValidOptionPlus: function(obj,opts,msg){
      if(!obj.includes('-1') && obj.some((x)=>{!opts.includes(x)})){
        throw new Error(msg)
      }
    },
    isValidDimension: function(obj,msg){
      if(obj < 1 || !Number.isInteger(obj)){
        throw new Error(msg)
      }
    },
    isZeroOrInteger: function(obj,msg){
      if(obj < 0 || !Number.isInteger(obj)){
        throw new Error(msg)
      }
    },
    validation: function() {
        this.isValidBoolean(this.center,'Center is not a valid boolean.')
        this.isValidBoolean(this.normalise,'Normalise is not a valid boolean.')
        this.isValidBoolean(this.transform,'Transform is not a valid boolean.')
        this.isValidBoolean(this.random,'Random is not a valid boolean.')
        this.isValidBoolean(this.keep,'Keep is not a valid boolean.')
        this.isValidBoolean(this.horizontal_flip,'Horizontal flip is not a valid boolean.')
        this.isValidBoolean(this.vertical_flip,'Vertical flip is not a valid boolean.')
        this.isValidOption(this.data_format,this.data_format_opts,'Data format selected is not a valid option.')
        this.isValidOption(this.color_format,this.color_format_opts,'Color format selected is not a valid option.')
        this.isValidOption(this.fill_mode,this.fill_mode_opts,'Fill mode selected is not a valid option.')
        this.isValidOptionPlus(this.patients,this.patients,'Some patients selected are not a valid option.')
        this.isValidOptionPlus(this.conditions,this.conditions,'Some conditions selected are not a valid option.')
        this.isValidOptionPlus(this.compounds,this.compounds,'Some compounds selected are not a valid option.')
        this.isValidOptionPlus(this.classes,this.classes,'Some classes selected are not a valid option.')
        this.isValidDimension(this.width,'Width is not a valid dimension.')
        this.isValidDimension(this.height,'Height is not a valid dimension.')
        if(!Number.isInteger(this.rounds) || this.rounds < 0 ) throw new Error('Rounds is not a valid number of rounds for augmentation (>0, int).')
        if(typeof(this.rescale)!='number' || this.rescale == 0) throw new Error('Rescaling by a factor of zero would clear all data.')
        if(typeof(this.cval)!='number' || this.cval < 0) throw new Error('Cval value is not a valid positive number or zero.')
        if(typeof(this.width_shift)!='number' || this.width_shift < 0 || this.width_shift > 1 ) throw new Error('Width shift alue is not a valid positive number or zero.')
        if(typeof(this.height_shift)!='number' || this.height_shift < 0 || this.height_shif > 1 ) throw new Error('Height shift value is not a valid positive number or zero.')
        if(typeof(this.channel_shift)!='number' || this.channel_shift < 0 || this.channel_shift > 1 ) throw new Error('Channel shift value is not a valid positive number or zero.')
        if(typeof(this.brightness)!='number' || this.brightness == 0) throw new Error('Brightness with absolute value of zero would be completely dark.')
        if(typeof(this.shear)!='number' || this.shear < 0 || this.shear > 1 ) throw new Error('Shear value is not a valid positive number or zero.')
        if(typeof(this.rotation)!='number' || this.rotation < 0 || this.rotation > 1 ) throw new Error('Rotation value is not a valid positive number or zero.')
        if(typeof(this.zoom)!='number' || this.zoom < 0 || this.zoom > 2 ) throw new Error('Zoom value is not a valid positive number up to 2 or zero.')
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
            center: this.center,
            normalise: this.normalise,
            width: this.width,
            height: this.height,
            data_format: this.data_format,
            color_format: this.color_format,
            rescale: this.rescale,
            rounds: this.rounds,
            transform: this.transform,
            random: this.random,
            keep: this.keep,
            rotation: this.rotation,
            width_shift: this.width_shift,
            height_shift: this.height_shift,
            shear: this.shear,
            channel_shift: this.channel_shift,
            brightness: this.brightness,
            zoom: this.zoom,
            horizontal_flip: this.horizontal_flip,
            vertical_flip: this.vertical_flip,
            fill_mode: this.fill_mode,
            cval: this.cval
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
              patients,
              conditions,
              compounds,
              classes,
              center,
              normalise,
              width,
              height,
              data_format,
              color_format,
              rescale,
              rounds,
              transform,
              random,
              keep,
              rotation,
              width_shift,
              height_shift,
              shear,
              channel_shift,
              brightness,
              zoom,
              horizontal_flip,
              vertical_flip,
              fill_mode,
              cval,
              date
            } = res.data;
            this.patients = patients;
            this.conditions = conditions;
            this.compounds = compounds;
            this.classes = classes;
            this.center = center;
            this.normalise = normalise;
            this.width = width;
            this.height = height;
            this.data_format = data_format;
            this.color_format = color_format;
            this.rescale = rescale;
            this.rounds = rounds;
            this.transform = transform;
            this.random = random;
            this.keep = keep;
            this.rotation = rotation;
            this.width_shift = width_shift;
            this.height_shift = height_shift;
            this.shear = shear;
            this.channel_shift = channel_shift;
            this.brightness = brightness;
            this.zoom = zoom;
            this.horizontal_flip = horizontal_flip;
            this.vertical_flip = vertical_flip;
            this.fill_mode = fill_mode;
            this.cval = cval;
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

                  <table style="width: 100%; padding: 5px;" >
<tbody>
<tr>
<td><label class="description" for="width">Width: </label>
			            <div data-tip="Width: Images final width after rescaling, prior to training.">
                  <input id="width"  v-model.number="width" name="width" class="field" type="number"  >
                  </div></td>
<td><label class="description" for="height">Height: </label>
			            <div data-tip="Final Height: Images final after rescaling, prior to training.">
			              <input id="height" v-model.number="height" name="height" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="center">Center: </label>
		              <div data-tip="Center: center the batch of images to the feature-wise mean.">
			              <input id="center" name="center" class="field" type="checkbox"   v-model="center"> </div></td>
<td><label class="description" for="normalise">Normalise: </label>
		              <div data-tip="Normalise: normalises the batch of images to the feature_wise standard deviation.">
			              <input id="element_3" v-model="normalise" name="element_3" class="field" type="checkbox"   ></div></td>
<td><label class="description" for="rescale">Rescale: </label>
			            <div data-tip="Rescale: rescale ratio for every pixel.">
                  <input id="rescale" v-model.number="rescale" name="rescale" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="rounds">Rounds: </label>
			            <div data-tip="Rounds: augmentation rounds for each image loaded.">
                  <input id="rounds" v-model.number="rounds" name="rounds" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="transform">Transform: </label>
			            <div data-tip="Transform: transform the augmentation images accordingly to the following parameters.">
                  <input id="transform" name="transform" class="field" type="checkbox"   v-model="transform">
                  </div></td>
</tr>
<tr>
<td><label class="description" for="patients">Patients: </label>
		              <div data-tip="Patients: this allows to select images from specific patients (Leave empty for all).">
                    <select multiple="true"  id="patients" name="patients" class="field"  v-model="patients">
                         <option value="-1">All</option>
                         <option :value="patient" v-for="patient in patients_opts">{{ patient }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="conditions">Conditions: </label>
		              <div data-tip="Conditions: this allows to select images from specific conditions (Leave empty for all).">
		                <select multiple="true"  id="conditions" name="conditions" class="field"  v-model="conditions">
                         <option value="-1">All</option>
                         <option :value="condition" v-for="condition in conditions_opts">{{ condition }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="compounds">Compounds: </label>
		              <div data-tip="Compounds: this allows to select images from specific compounds (Leave empty for all).">
		                <select multiple="true"  id="compounds" name="compounds" class="field"  v-model="compounds">
                         <option value="-1">All</option>
                         <option :value="compound" v-for="compound in compounds_opts">{{ compound }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="classes">Classes: </label>
		              <div data-tip="Classes: this allows to select images from specific classes (Leave empty for all or select at least 2).">
		                <select multiple="true"  id="classes" name="classes" class="field"  v-model="classes">
                         <option value="-1">All</option>
                         <option :value="classi" v-for="classi in classes_opts">{{ classi }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="random">Random: </label>
			            <div data-tip="Random: the transformation uses random parameters within the ranges hereby set or static if false.">
                  <input id="random" name="random" class="field" type="checkbox"   v-model="random">
                  </div></td>
<td><label class="description" for="keep">Keep Original: </label>
			            <div data-tip="Keep Original: keeps original images alongside with the augmented ones.">
                  <input id="keep" name="keep" class="field" type="checkbox"   v-model="keep">
                  </div></td>
<td><label class="description" for="fill_mode">Fill Mode: </label>
		              <div data-tip="Fill Mode: selects the way of fill tensor data in case of misplacement during transformations.">
		                <select id="fill_mode" name="fill_mode" class="field"  v-model="fill_mode">
                          <option :value="fill" v-for="fill in fill_mode_opts">{{ fill }}</option>
                    </select>
		              </div></td>
</tr>
<tr>
<td><label class="description" for="dataformat">Data Format: </label>
		              <div data-tip="Data Format: determines the positioning of the color channels in the tensor.">
		                <select id="dataformat" name="dataformat" class="field"  v-model="data_format">
                          <option :value="data" v-for="data in data_format_opts">{{ data }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="colorformat">Color Format: </label>
		              <div data-tip="Color Format: determines the channel number in the tensor.">
		                <select id="colorformat" name="colorformat" class="field"  v-model="color_format">
                          <option :value="color" v-for="color in color_format_opts">{{ color }}</option>
                    </select>
		              </div></td>
<td><label class="description" for="rotation">Rotation: </label>
			            <div data-tip="Rotation: determines the max rotation in degrees of the image.">
                  <input id="rotation"   v-model.number="rotation" name="rotation" class="field" type="number"  >
                  </div></td>
<td><label class="description" for="shear">Shear: </label>
			            <div data-tip="Shear: determines the max shear of the image.">
                  <input id="shear" v-model="shear" name="shear" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="brightness">Brightness: </label>
			            <div data-tip="Brightness: determines the percentage of brightness of original image.">
                  <input id="brightness" v-model.number="brightness" name="brightness" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="zoom">Zoom: </label>
			            <div data-tip="Zoom: determines the percentual zoom applied to image.">
                  <input id="zoom" v-model.number="zoom" name="zoom" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="cval">CVal: </label>
			            <div data-tip="CVal: determines the value of the pixels in case of fillmode=constant.">
                  <input id="cval" v-model.number="cval" name="cval" class="field" type="number"   >
                  </div></td>
</tr>
<tr>
<td><label class="description" for="hflip">Horizontal Flip: </label>
			            <div data-tip="Horizontal Flip: determines if image can be flipped horizontally.">
                  <input id="hflip" name="hflip" class="field" type="checkbox"   v-model="horizontal_flip">
                  </div></td>
<td><label class="description" for="vflip">Vertical Flip: </label>
			            <div data-tip="Vertical Flip: determines if image can be flipped vertically.">
                  <input id="vflip" name="vflip" class="field" type="checkbox"   v-model="vertical_flip">
                  </div></td>
<td><label class="description" for="ws">Width Shift: </label>
			            <div data-tip="Width Shift: determines the max value of the width shift.">
                  <input id="ws" v-model.number="width_shift" name="ws" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="hs">Height Shift: </label>
			            <div data-tip="Height Shift: determines the max value of the height shift.">
                  <input id="hs" v-model.number="height_shift" name="hs" class="field" type="number">
                  </div></td>
<td><label class="description" for="cs">Channel Shift: </label>
			            <div data-tip="Channel Shift: determines the max value of the channel shift.">
                  <input id="cs" v-model.number="channel_shift" name="cs" class="field" type="number"   >
                  </div></td>
<td><label class="description" for="date_dataset">Last Modified </label>
                     <div data-tip="Date: represents the date when the dataset configuration was last updated."> </div>
                     <output id="date_dataset" name="date_dataset" class="field">{{date}}</output></td>
<td>&nbsp;</td>
</tr>
</tbody>
</table>
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
  width: 1300px;
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
