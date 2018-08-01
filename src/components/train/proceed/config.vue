<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#proceed-config-template",
  props: ["show", "token", "username","model"],
  data: function() {
    return {
      loss_opts: ["absoluteDifference","computeWeightedLoss","cosineDistance","hingeLoss","huberLoss","logLoss","meanSquaredError","softmaxCrossEntropy"],
      optimiser_opts: ["sgd","momentum","adagrad","adadelta","adam","adamax","rmsprop"],
      metrics_opts: ["binaryAccuracy","binaryCrossentropy","categoricalAccuracy","categoricalCrossentropy","cosineProximity","meanSquaredError"],
      loss: 'meanSquaredError',
      optimiser:'sgd',
      metrics:["-1"],
      batchsize: 1,
      epochs: 100,
      error: null
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    reset: function(){
      this.loss= 'meanSquaredError';
      this.optimiser='sgd';
      this.metrics=["-1"];
      this.batchsize= 1;
      this.epochs= 100;
      this.error= null;
    },
    update: async function(){
      try{
       await ax.post("config/update",{
         source: this.model._id,
          loss: this.loss,
          optimiser: this.optimiser,
          metrics: this.metrics,
          epochs: this.epochs,
          batchsize: this.batchsize
        },{
          headers:{token:this.token}
        }).then(res => {
            this.close()
            this.reset()
        }).catch(error =>{
          throw new Error(error.toString())
        })

      }catch(err){
        this.error = err.toString();
      }

    },
    validation: function(){
       if(!this.loss){
        throw new Error("Please, select a valid loss function.")
      }else if(!this.optimiser){
        throw new Error("Please, select a valid optimiser function.")
      }else if(!this.batchsize || this.bacthsize<1){
        throw new Error("Please, select a valid batchsize.")
      }else if(!this.epochs || this.epochs < 1){
        throw new Error("Please, select a valid epoch value.")
      }else if(!this.metrics || this.metrics.length<1){
        throw new Error("Select at least one valid metric.")
      }
    },
    getConfiguration: async function(){
      await ax.get("config/current",{
        params:{source:this.model._id},
        header:{token:this.token}
      }).then(res =>{
        const {loss,optimiser,epochs,batchsize,metrics}=res.data;
         this.assign(this.loss,loss);
         this.assign(this.optimiser,optimiser);
         this.assign(this.epochs,epochs);
         this.assign(this.bacthsize,batchsize);
         this.assign(this.metrics,metrics);
        }).catch(err => this.error = err.toString());
    },
    assign:function(to,from){
      if(from!=null && from!=undefined){
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
    show: function(news, olds){
      this.getConfiguration();
    }
  }
};
</script>

<template name="proceed-config">
<transition>
        <div class="proceed-config-mask" @click="close" v-show="show">
            <div class="proceed-config-container" @click.stop>
              <div>
                <form class="form">
			          <ul class="ul-list">
      					  <li id="li_1" class="li-ele">
		                <label class="description" for="element_1"> Loss: </label>
			              <div data-tip="Loss: represents the function which calculate the loss in order to compare iterations."> </div>
                    <select multiple="false"  id="element_4" name="element_4" class="field"  v-model="loss">
                         <option :value="los" v-for="los in loss_opts">{{ los }}</option>
                    </select>
		              </li>
            		    <li id="li_2" class="li-ele">
		                <label class="description" for="element_2">Optimiser: </label>
			              <div data-tip="Optimiser: respresents the algorithm which performes the optimisation."> </div>
			              <select multiple="false"  id="element_4" name="element_4" class="field"  v-model="optimiser">
                         <option :value="opt" v-for="opt in optimiser_opts">{{ opt }}</option>
                    </select>
	            	  </li>
                  <li id="li_3" class="li-ele">
		                <label class="description" for="element_3">Metrics: </label>
		                <div data-tip="Metrics: describe which metrics to use in order to evaluate the training instances."> </div>
                    <select multiple="true"  id="element_4" name="element_4" class="field"  v-model="metrics">
                         <option value="-1">All</option>
                         <option :value="metric" v-for="metric in metrics_opts">{{ metric }}</option>
                    </select>
		              </li>
                  <li id="li_3" class="li-ele">
		                <label class="description" for="element_3">Epochs: </label>
		                <div data-tip="Epochs: represents the total number of iterations to be performed."> </div>
			              <input id="element_3" name="element_3" class="field" type="number"   v-model="epochs">
		              </li>
                  <li id="li_3" class="li-ele">
		                <label class="description" for="element_3">Batch Size: </label>
		                <div data-tip="Batch Size: represents the number of samples to be loaded per iteration."> </div>
			              <input id="element_3" name="element_3" class="field" type="number"   v-model="batchsize">
		              </li>
                </ul>
		            </form>
                </div>
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
  width: 500px;
  height: 430px;
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
