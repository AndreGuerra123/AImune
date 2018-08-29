<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 10000
});
export default {
  template: "#proceed-results-template",
  props: ["show", "token", "username","model"],
  data: function() {
    return {
      results:null,
      error:null
    };
  },
  methods: {
    setFirst: function(){
      this.results=this.divs[0]
      this.idx = 0
    },
    update: async function(){
        await ax
          .post(
            "/results", {
              source: this.model._id
            }, {
              headers: {
                token: this.token
              }
            }
          ).then(res=>{
             const{div,script}=res.data
             this.results=div
             eval(script)
          }).catch(err => {
            throw new Error(err)
            this.error = err.toString();
          });
    },
    close: function() {
      this.$emit("close");
    }
  },
  watch:{
    show: function(n,o){
      if(n) this.update()
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
<template name="proceed-results">
<transition>
        <div class="proceed-results-mask" @click="close" v-show="show">
            <div class='proceed-results-container' v-bar @click.stop>
                  <div>
                    <div v-for="temp in results">
                      <div v-html="temp"></div>
                    </div>
                  </div>
            </div>
          <error :show="error" @close="error = null"></error>
        </div>
</transition>
</template>

<style>

::-webkit-scrollbar {
    display: none;
  }

.proceed-results-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.proceed-results-container {
  width: 1040px;
  height: 440px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.proceed-results-default-button {
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
.proceed-results-default-button:hover {
  background-color: #ec70a8;
}

.vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(48, 121, 244,.1);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
}

</style>

