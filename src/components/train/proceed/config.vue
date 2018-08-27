<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#proceed-config-template",
  props: ["show", "token", "username", "model"],
  data: function() {
    return {
      loss_opts: ["categorical_hinge", "categorical_crossentropy"],
      optimiser_opts: [
        "sgd",
        "rmsprop",
        "adagrad",
        "adadelta",
        "adam",
        "adamax",
        "nadam"
      ],
      loss: "categorical_crossentropy",
      optimiser: "sgd",
      lr: 0.01,
      momentum: 0.0,
      decay: 0.9,
      nesterov: false,
      rho: 0.9,
      epsilon: null,
      beta1: 0.9,
      beta2: 0.99,
      amsgrad: false,
      batchsize: 1,
      epochs: 100,
      shuffle: true,
      seed: null,
      validation_split: 0.25,
      date: null,
      error: null
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    reset: function() {
      this.error = null;
    },
    update: async function() {
      try{
      this.validation()
      await ax
        .post(
          "config/update",
          {
            source: this.model._id,
            loss: this.loss,
            optimiser: this.optimiser,
            lr: this.lr,
            momentum: this.momentum,
            decay: this.decay,
            nesterov: this.nesterov,
            rho: this.rho,
            epsilon: this.epsilon,
            beta1: this.beta1,
            beta2: this.beta2,
            amsgrad: this.amsgrad,
            batchsize: this.batchsize,
            epochs: this.epochs,
            shuffle: this.shuffle,
            seed: this.seed,
            validation_split: this.validation_split
          },
          {
            headers: { token: this.token }
          }
        )
        .then(res => {
          this.close();
          this.reset();
        })
        .catch(error => {
          throw new Error(error.toString());
        });
      }catch(err){
        this.error = err.toString()
      }
    },

    isValidBoolean: function(obj,msg){
      if(typeof(obj)!="boolean"){
        throw new Error(msg)
      }
    },
    isValid01: function(obj,msg){
      if(typeof(obj)!="number" || obj<=0 || obj >=1){
        throw new Error(msg)
      }
    },
    isLessThan1: function(obj,msg){
      if(typeof(obj)!="number" || obj>=1 || obj<0){
        throw new Error(msg)
      }
    },
    isAtLeastOneInteger: function(obj,msg){
      if(typeof(obj)!="number" ||  obj < 1 || !Number.isInteger(obj)){
        throw new Error(msg)
      }
    },
    isValidLoss(loss,msg){
      if(!loss || !this.loss_opts.includes(loss)){
        throw new Error(msg)
      }
    },
    isValidOpt(opt,msg){
      if(!opt || !this.optimiser_opts.includes(opt)){
         throw new Error(msg)
      }

    },
    isNullOr01(opt,msg){
      if(opt!=null && (opt<=0 || opt >= 1)){
        throw new Error(msg)
      }
    },
    isNullOrInteger(opt,msg){
      if(opt!=null && !Number.isInteger(opt)){
        throw new Error(msg)
      }
    },
    validation: function() {

      this.isValidLoss(this.loss, this.loss.toString()+" is not a valid loss function.")
      this.isValidOpt(this.optimiser,this.optimiser.toString()+" is not a valid optimiser function.")
      this.isLessThan1(this.momentum,this.momentum.toString()+" is not a valid number between 0 (inc) and 1 (exc) for momentum parameter.")
      this.isLessThan1(this.decay,this.decay.toString()+" is not a valid number between 0 (inc) and 1 (exc) for decay parameter.")
      this.isValidBoolean(this.nesterov,this.nesterov.toString()+ " is not a valid boolean for the Nesterov parameter.")
      this.isValidBoolean(this.amsgrad,this.amsgrad.toString()+ " is not a valid boolean for the Nesterov parameter.")
      this.isValidBoolean(this.shuffle,this.shuffle.toString()+ " is not a valid boolean for the Shuffle parameter.")
      this.isValid01(this.lr,this.lr.toString()+" is not a valid learning rate.")
      this.isValid01(this.rho,this.rho.toString()+" is not a valid number between 0 and 1 for Rho parameter.")
      this.isValid01(this.beta1,this.beta1.toString()+" is not a valid number between 0 and 1 for Beta1 parameter.")
      this.isValid01(this.beta2,this.beta2.toString()+" is not a valid number between 0 and 1 for Beta2 parameter.")
      this.isValid01(this.validation_split,this.validation_split.toString()+" is not a valid number between 0 and 1 for the validation split parameter.")
      this.isAtLeastOneInteger(this.batchsize,this.batchsize.toString()+" is not a valid integer for batchsize parameter.")
      this.isAtLeastOneInteger(this.epochs,this.epochs.toString()+" is not a valid integer for epochs parameter.")
      this.isNullOr01(this.epsilon, String(this.epsilon)+" is not null or between 0 and 1 for epsilon parameter.")
      this.isNullOrInteger(this.seed,String(this.seed)+" is not a null or valid integer for the seed parameter.")

    },
    getConfiguration: async function() {
      await ax
        .get("config/current", {
          params: { source: this.model._id },
          header: { token: this.token }
        })
        .then(res => {
          if (res.data) {
            const {
              loss,
              optimiser,
              epochs,
              batchsize,
              date,
              lr,
              momentum,
              decay,
              nesterov,
              rho,
              epsilon,
              beta1,
              beta2,
              amsgrad,
              shuffle,
              seed,
              validation_split
            } = res.data;
            this.loss = loss;
            this.optimiser = optimiser;
            this.epochs = epochs;
            this.bacthsize = batchsize;
            this.date = date;
            this.lr = lr
            this.momentum = momentum,
            this.decay = decay,
            this.nesterov = nesterov,
            this.rho = rho,
            this.epsilon = epsilon,
            this.beta1 = beta1,
            this.beta2=beta2,
            this.amsgrad = amsgrad,
            this.shuffle = shuffle,
            this.seed = seed,
            this.validation_split = validation_split
          }
        })
        .catch(err => (this.error = err.toString()));
    },
    assign: function(to, from) {
      if (from != null && from != undefined) {
        to = from;
      }
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
      this.getConfiguration();
    }
  }
};
</script>

<template name="proceed-config">
<transition>
        <div class="proceed-config-mask" @click="close" v-show="show">
            <div class="proceed-config-container" @click.stop>
              <table style="width: 95%;">
              <tbody>
              <tr>
              <td><label class="description" for="element_1"> Loss: </label>
			              <div data-tip="Loss: represents the function which calculate the loss in order to compare iterations."> </div>
                    <select  id="element_4" name="element_4" class="field"  v-model="loss">
                         <option :value="los" v-for="los in loss_opts">{{ los }}</option>
                    </select></td>
              <td><label class="description" for="element_2">Optimiser: </label>
			              <div data-tip="Optimiser: represents the algorithm which performes the optimisation."> </div>
			              <select id="element_4" name="element_4" class="field"  v-model="optimiser">
                         <option :value="opt" v-for="opt in optimiser_opts">{{ opt }}</option>
                    </select></td>
              <td><label class="description" for="element_3">Epochs: </label>
		                <div data-tip="Epochs: represents the total number of iterations to be performed."> </div>
			              <input id="element_3" name="element_3" class="field" type="number"   v-model.number="epochs"></td>
              <td><label class="description" for="element_3">Batch Size: </label>
		                <div data-tip="Batch Size: represents the number of samples to be loaded per iteration."> </div>
			              <input id="element_3" name="element_3" class="field" type="number" v-model.number="batchsize"></td>
              </tr>
              <tr>
              <td><label class="description" for="shuffle">Shuffle: </label>
		                <div data-tip="Shuffle: randomly suffle dataset prior to generating indexes."> </div>
			              <input id="shuffle" name="shuffle" class="field" type="checkbox" v-model="shuffle"></td>
              <td><label class="description" for="seed">Seed: </label>
		                <div data-tip="Seed: seed value for random number generator."> </div>
			              <input id="seed" name="seed" class="field" type="number" v-model.number="seed"></td>
              <td><label class="description" for="vsplit">Validation Split: </label>
		                <div data-tip="Validation Split: percentage of data used for test/validation."> </div>
			              <input id="vsplit" name="vsplit" class="field" type="number" v-model.number="validation_split"></td>
              <td><label class="description" for="lr">Learning Rate: </label>
		                <div data-tip="Learning Rate: optimiser initial learning rate."> </div>
			              <input id="lr" name="lr" class="field" type="number" v-model.number="lr"></td>
              </tr>
              <tr>
              <td><label class="description" for="momentum">Momentum: </label> 		                <div data-tip="Momemtum: optimiser initial momentum."> </div> 			              <input id="momentum" name="momentum" class="field" type="number" v-model.number="momentum"></td>
              <td><label class="description" for="decay">Decay: </label> 		                <div data-tip="Decay: optimiser initial decay."> </div> 			              <input id="decay" name="decay" class="field" type="number" v-model.number="decay"></td>
              <td><label class="description" for="nesterov">Nesterov: </label> 		                <div data-tip="Nesterov: optimiser with Nesterov momentum."> </div> 			              <input id="nesterov" name="nesterov" class="field" type="checkbox" v-model="nesterov"></td>
              <td><label class="description" for="rho">Rho: </label> 		                <div data-tip="Rho: optimiser initial rho."> </div> 			              <input id="rho" name="rho" class="field" type="number" v-model.number="rho"></td>
              </tr>
              <tr>
              <td><label class="description" for="shuffle">Epsilon: </label> 		                <div data-tip="Epsilon: optimiser epsilon parameter."> </div> 			              <input id="epsilon" name="epsilon" class="field" type="number" v-model.number="epsilon"></td>
              <td><label class="description" for="beta1">Beta 1: </label> 		                <div data-tip="Beta1: optimiser beta1 parameter."> </div> 			              <input id="beta1" name="beta1" class="field" type="number" v-model.number="beta1"></td>
              <td><label class="description" for="beta2">Beta 2: </label> 		                <div data-tip="Beta2: optimiser beta2 parameter."> </div> 			              <input id="beta2" name="beta2" class="field" type="number" v-model.number="beta2"></td>
              <td><label class="description" for="amsgrad">amsGrad: </label> 		                <div data-tip="amsGrad: optimiser amsGrad parameter."> </div> 			              <input id="amsgrad" name="amsgrad" class="field" type="checkbox" v-model="amsgrad"></td>
              </tr>
              <tr>
              <td><label class="description" for="element_3">Last Modified </label>
                     <div data-tip="Date: represents the date when the model configuration was last updated."> </div>
                     <output id="element_3" name="element_3" class="field">{{date}} </output></td>
              </tr>
              </tbody>
              </table>
            <error :show="error" @close="error=null"></error>
            </div>
            <div class="load-footer" @click.stop>
                  <button class="load-default-button" @click="reset()">Reset</button>
                  <button class="load-default-button" @click="close()">Cancel</button>
                  <button class="load-default-button" @click="update()">Update</button>
            </div>
        </div>
</transition>
</template>

<style>
.proceed-config-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.proceed-config-container {
  width: 1000px;
  height: 500px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.proceed-config-default-button {
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
.proceed-config-default-button:hover {
  background-color: #ec70a8;
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
  max-width: 170px;
  max-height: 30px;
}
</style>
