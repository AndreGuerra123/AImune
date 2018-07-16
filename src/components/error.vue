<script>
export default {
  template:"#error-template",
  props: ["show"],
  methods:{
    close: function(){

      this.$emit("close");

    }
  },
  mounted: function(){
    document.addEventListener("keydown", e => {
      if(this.show && e.keyCode == 27){
        this.close();
      }
    })
  }
}
</script>
<template>
<transition name="error">
        <div class="error-mask" @click="close" v-show="show">
            <div class="error-container" @click.stop>
                <div class="error-header">
                    <img src="../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div class="error-body">
                  <label class="form-label-error">
                        Something went wrong!
                        <p class="form-error-desc">{{show}}</p>
                    </label>
                </div>
                <div class="error-footer">
                    <button class="error-default-button" @click="close()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style>
* {
  box-sizing: border-box;
}

.error-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.error-container {
  width: 500px;
  margin: 330px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.error-default-button {
  display: block;
  margin-top: 20%;
  margin-left: auto;
  margin-right: auto;
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  text-align: center;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
}
.error-default-button:hover {
  background-color: #ec70a8;
}

.error-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.error-body {
  margin: 15px 2px;
}

.error-footer{
width: 100px;
position:absolute;
bottom:350px;
left: 50%;
margin-left: -50px
}

.form-label-error {
  display: block;
  margin-left: auto;
  margin-right:auto;
  text-align: left;
  font-family: Brandon_bolder;
  font-weight: bolder;
  font-size: 22px;
  color: black

}
.form-error-desc {
  display: block;
  margin-left: auto;
  margin-right:auto;
  text-align: left;
  font-family: Brandon_lighter;
  font-weight: bolder;
  font-size: 16px;
  color: red
}

.error-enter {
  opacity: 0;
}

.error-leave-active {
  opacity: 0;
}

.error-enter .error-container,
.error-leave-active .error-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

