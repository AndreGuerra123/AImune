<script>
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 10000
});
export default {
  template: "#proceed-results-template",
  props: ["show", "token", "username","model"],
  data: function() {
    return {
      results:null
    };
  },
  methods: {
    update: async function(){
        await ax.get("/results", {
          params: { source: this.model._id},
          header: { token: this.token }
        })
        .then(res => {
          this.results = res.data
        }).catch(err =>{
             this.error = err.toString();
        });
    },
    close: function() {
      this.$emit("close");
    }
  },
  watch:{
    show: function(n,o){
      this.update()
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
            <div class="proceed-results-container" @click.stop>
             <div v-html="results"></div>
            </div>
        </div>
</transition>
</template>

<style>

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
  width: 800px;
  height: 600px;
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

</style>

