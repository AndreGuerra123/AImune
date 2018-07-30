<script>
export default {
  template: "#trainproceed-template",
  props: ["show", "token", "show", "username", "model"],
  data: function() {
    return {};
  },
  methods: {
    close: function() {
      this.$emit("close");
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

<template name="trainproceed">
<transition>
        <div class="trainproceed-mask" @click="close" v-show="show">
            <div class="trainproceed-container" @click.stop>
              <div class="train-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
              </div>

            </div>
        </div>
</transition>
</template>

<style>

.trainproceed-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.trainproceed-container {
  width: 80%;
  height: 80%;
  margin: 100px auto 0;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}
.trainproceed-default-button {
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
.trainproceed-default-button:hover {
  background-color: #ec70a8;
}
</style>
