<script>
  import axios from "axios";
  const get = require('lodash/get')
  const ax = axios.create({
    baseURL: "https://209.97.191.228:3000/",
    timeout: 5000
  });
  export default {
    template: "#proceed-learning-template",
    props: ["show", "token", "username", "model"],
    data: function () {
      return {
        progressbar_options: {
          color: "#007AFF",
          strokeWidth: 5,
          trailWidth: 5,
        },
        job: {
          _id: null,
          started: null,
          finished: null,
          value: null,
          description: null,
          error: null
        },
        error: null
      };
    },
    methods: {
      close: function () {
        this.$emit("close");
      },
      getLearningProgress: async function () {
        await ax
          .get("learning/current", {
            params: {
              source: this.model._id
            },
            headers: {
              token: this.token
            }
          })
          .then(res => {
            this.job = {_id: get(res.data,'_id'),
            started: get(res.data,'started'),
            finished: get(res.data,'finished'),
            error: get(res.data,'error'),
            value: get(res.data,'value'),
            description:get(res.data,'description')
            };
          })
          .catch(err => {
            this.error = err.toString();
          });
      },
      finished: function () {
        var millis = this.job.finished - this.job.started;
        return this.msToTime(millis);
      },
      start: async function () {
        await ax
          .post(
            "learning/start", {
              source: this.model._id
            }, {
              headers: {
                token: this.token
              }
            }
          )
          .catch(err => {
            this.error = err.toString();
          });
          this.update()
          this.resetProgressBar()
      },
      reset: async function () {
        await ax
          .post(
            "learning/reset", {
              source: this.model._id
            }, {
              headers: {
                token: this.token
              }
            }
          ).catch(err => {
            this.error = err.toString();
          });
          this.update()
      },
      resetProgressBar: function(){
        this.$refs.line.set(0)
        this.$refs.line.setText("")
      },
      restart: async function(){
        await this.reset()
        await this.start()
      },
      msToTime: function (s) {
        var pad = (n, z = 2) => ("00" + n).slice(-z);
        return (
          pad((s / 3.6e6) | 0) +
          ":" +
          pad(((s % 3.6e6) / 6e4) | 0) +
          ":" +
          pad(((s % 6e4) / 1000) | 0) +
          "." +
          pad(s % 1000, 3)
        );
      },
      update: function () {
        this.getLearningProgress();
      }
    },
    mounted: function () {
      document.addEventListener("keydown", e => {
        if (this.show && e.keyCode == 27) {
          this.close();
        }
      });
    },
    watch: {
      show: function (news, olds) {
        this.getLearningProgress();
      },
      job: {
        handler: function (newq, oldq) {
          this.error = this.job.error; //Shows the error as modal
          if(this.job.value){
            this.$refs.line.set(this.job.value)
            this.$refs.line.setText(Math.floor(this.job.value*100).toString()+' % '+this.job.description)
          }
        },
        deep: true
      }
    }
  };

</script>
<template name="proceed-learning">
  <transition>
    <div class="proceed-learning-mask" @click="close" v-show="show">
      <div class="proceed-learning-container" @click.stop>
        <ul class="ul-list">
          <li id="li_1" class="li-ele">
            <label class="description" for="element_1111">Job ID</label>
            <div data-tip="Job ID: Current job in the queue for this model.">
              <div id="element_1111" name="element_1111" class="field" type="text">{{job._id}}</div>
            </div>
          </li>
          <li id="li_2" class="li-ele">
            <label class="description" for="element_212">Date Started</label>
            <div data-tip="Date started: the exact date the job started to be executed.">
              <div id="element_212" name="element_212" class="field" type="text">{{job.started}}</div>
            </div>
          </li>
          <li v-if="job.finished" id="li_2" class="li-ele">
            <label class="description" for="element_2">Date Finished</label>
            <div data-tip="Date Finished: the exact date the job call was finished.">
              <div id="element_2" name="element_2" class="field">{{job.finished}}</div>
            </div>
          </li>
          <li id="li_2" class="li-ele">
            <label class="description" for="element_33">Elapsed Time</label>
            <div data-tip="Elapsed Time: the time elapsed from the beggining of execution of the job.">
              <div class="field" name="element_33">
                <timeago v-if="!job.finished && job.started" :datetime="job.started" :auto-update="1"></timeago>
                <div v-if="job.finished">{{finished()}}</div>
              </div>
            </div>
          </li>
          <li v-if="job.error" id="li_2" class="li-ele">
            <label class="description" for="element_2">Error</label>
            <div data-tip="Error: any error produced during the call will be displayed here.">
              <div id="element_2" name="element_2" class="fielderror">{{job.error}}</div>
            </div>
          </li>
        </ul>
        <div class="wrapperpro">
          <progress-bar type="line" ref="line" :options="progressbar_options"></progress-bar>
        </div>

      </div>
      <error :show="error" @close="error = null"></error>
      <div class="proceed-learning-footer" @click.stop>
        <button v-if="job._id" class="proceed-learning-default-button" @click="reset()">Cancel/Reset</button>
        <button v-if="!job._id" class="proceed-learning-default-button" @click="start()">Start</button>
        <button v-if="job._id" class="proceed-learning-default-button" @click="restart()">Restart</button>
      </div>
    </div>
  </transition>
</template>
<style>
  .proceed-learning-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }

  .proceed-learning-container {
    width: 1400px;
    height: auto;
    margin: 200px auto 0;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Brandon_normal;
  }

  .proceed-learning-default-button {
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

  .proceed-learning-default-button:hover {
    background-color: #ec70a8;
  }

  .proceed-learning-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ul-list {
    list-style-type: none;
    margin-right: 5%;
    margin-left: 5%;
    padding: 0;
    overflow: visible;
  }

  .li-ele {
    width:160px
  }
  .field {
    width:160px;
  }
    .fielderror {
    width:160px;
    color: red;
  }

  .description {
    font-family: Brandon_normal;
    font-size: 22px;
    width:160px;
  }


  .wrapperpro {
    width: 85%;
    margin: 0 auto;
  }

</style>
