<script>
import axios from "axios";
const ax = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});
export default {
  template: "#traindelete-template",
  props: ["show", "token", "username", "model"],
  data: function() {
    return {
      error: null,
      name: null,
      confirmed: false
    };
  },
  methods: {
    reset: function(){
      this.name = '';
      this.error = '';
    },
    close: function(event) {
      this.reset();
      this.$emit("close");
    },
    submit: async function() {
      try {
        this.validation();
        await this.submition();
        this.close(null);
      } catch (err) {
        this.error = err.toString();
      }
    },
    submition: async function() {
      await ax
        .delete("model/delete", {
          headers: { token: this.token },
          params: {
            //for future reference it arrives as req.query
            user: this.username,
            name: this.name
          }
        })
        .catch(err => {
          throw err;
        });
    },
    validation: function() {
      if (this.username != this.model.user) {
        throw new Error(
          "Only the original owner of the model can delete it."
        );
      } else if (!this.name) {
        throw new Error("Please, confirm the model name to be saved.");
      }
    }
  },
  watch: {
    name: {
      handler: async function(newv, oldv) {
        if (newv == this.model.name) {
          this.confirmed = true;
        } else {
          this.confirmed = false;
        }
      }
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

<template name="traindelete">
<transition>
        <div class="traindelete-mask" @click="close" v-show="show">
            <div class="traindelete-container" @click.stop>
                <div class="traindelete-header">
                    <img src="../../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div class = "traindelete-info">
                   <form class="form">
			          <ul class="traindelete-entries">
      					<li class="traindelete-entry-first">
		              <label class="trainddelete-form-label" for="element_1">Confirm Model Name</label>
			            <div data-tip="Confirm Model Name: confirms the model name to be deleted.">
                  <input id="element_1" name="element_1" class="traindelete-form-control" type="text" maxlength="255" v-model="name" v-bind:placeholder="model.name"></div>
		            </li>
			          </ul>
                </form>
                </div>
                <div class="note"><b>Attention:</b> Deletion of the model is irreversible.</div>
                <div class="traindelete-footer" @click.stop>
                  <button class="traindelete-default-button" @click="close()">Cancel</button>
                  <button v-if="confirmed" class="traindelete-default-button" @click="submit()">Delete Now</button>
                </div>
            </div>
            <error :show="error" @close="error=null"></error>
        </div>
</transition>
</template>

<style>
.traindelete-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.note{
  text-align: center
}

.traindelete-container {
  position: fixed;
  top: 30%;
  left: 35%;
  width: 30%;
  height: 30%;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_normal;
}

.traindelete-footer {
  display: block;
  text-align:center;
  margin-top: 5%;

}
.traindelete-info {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.traindelete-entries {
  display: inline-block;
  list-style-type: none;
  padding: 3px;
  margin: 3%;
}

.traindelete-entry-first {
  float: left;
  padding: 5px
}
.traindelete-entry-second {
  float: right;
    padding: 5px

}

.traindelete-form-label {
  display: block;
  font-family: Brandon_lighter;
}

.traindelete-form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.traindelete-default-button {
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  font-size: 20px;
  text-decoration: uppercase;
  background-color: #4cb6c8;
  margin: 2%;
}
.traindelete-default-button:hover {
  background-color: #ec70a8;
}

.traindelete-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.traindelete-body {
  margin: 15px 2px;
}

.traindelete-enter {
  opacity: 0;
}

.traindelete-leave-active {
  opacity: 0;
}

.traindelete-enter .traindelete-container,
.traindelete-leave-active .traindelete-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

