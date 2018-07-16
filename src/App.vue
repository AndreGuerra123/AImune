<template>
  <div id="app">
    <img src="./assets/imgs/alcyomics-logo.png" alt="Alcyomics Logo" class="logo">
    <ul class="bar">
        <li class="bar-li"><button class="bar-li-btn">Load</button></li>
        <li class="bar-li"><button class="bar-li-btn">Classify</button></li>
        <li class="bar-li"><button class="bar-li-btn">Model</button></li>
        <li class="bar-li"><button class="bar-li-btn">Predict</button></li>
        <li v-if="!log" class="bar-li-last"><button id="show-modal" @click="regist" class="bar-li-btn">Register</button></li>
        <li class="bar-li-last"><button class="bar-li-btn" v-on:click="logaction">{{logactiondesc()}}</button></li>
        <li v-if="!log" class="bar-li-last"><input class="bar-li-btn" type="password" placeholder="Password" v-model="password"></li>
        <li v-if="!log" class="bar-li-last"><input class="bar-li-btn" type="text" placeholder="Username" v-model="username"></li>
        <li v-if="log" class="bar-li-last-greet">{{greeting}}</li>
        <error :show="error" @close="clear()"></error>
    </ul>
    <regist :show="showRegister" @close="regist()"></regist>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
const ai = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});

export default {
  name: "app",
  data: function() {
    return {
      log: false,
      error: "",
      username: "",
      password: "",
      greeting: "",
      token: "",
      showRegister: false
    };
  },
  methods: {
    logactiondesc() {
      if (!this.log) {
        return "Login";
      } else {
        return "Logout";
      }
    },
    login() {
      ai
        .post("signin", {
          username: this.username,
          password: this.password
        })
        .then(
          response => {
            this.token = response.data.token;
            this.greet();
            this.log = true;
            this.error = "";
          }
        )
        .catch(error => {

          if(error.response.data.details[0].message){
            this.error = error.response.data.details[0].message;
          } else {
            this.error = error.toString;
          }

          this.logout();
        });
    },

    clear() {
      this.error = "";
    },

    logout() {
      this.username = "";
      this.password = "";
      this.log = false;
      this.token = "";
    },

    logaction() {
      if (!this.log) {
        this.login();
      } else {
        this.logout();
      }
    },

    greet() {
      var morning = 7;
      var afternoon = 12;
      var evening = 18;
      var g = "";

      var currentHour = parseFloat(
        moment()
          .format("HH")
          .toString()
      );

      if (currentHour >= morning && currentHour <= afternoon) {
        g = "morning";
      } else if (currentHour >= afternoon && currentHour <= evening) {
        g = "afternoon";
      } else {
        g = "evening";
      }

      this.greeting = " Good " + g + ", " + this.username + ". ";
    },

    regist() {
      this.showRegister = !this.showRegister;
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Brandon_thin";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_thin.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_thin_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_thin_it.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_normal";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_reg.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_normal_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_reg_it.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_lighter";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_light.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_lighter_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_light_it.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_median";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_med.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_median_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_med_it.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_bold";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_bld.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_bold_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_bld_it.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_bolder";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_blk.otf")
    format("opentype");
}
@font-face {
  font-family: "Brandon_bolder_italic";
  src: url("./assets/fonts/Brandon Grotesque/Brandon_blk_it.otf")
    format("opentype");
}

.logo {
  display: block;
  margin-left: 10%;
  margin-top: 5%;
  width: 20%;
  height: 20%;
}

.bar {
  list-style-type: none;
  margin-right: 10%;
  margin-left: 10%;
  padding: 0;
  overflow: hidden;
}

.bar-li {
  float: left;
}

.bar-li-last {
  float: right;
  border-right: none;
}

.bar-li-btn {
  display: block;
  color: white;
  border-color: transparent;
  font-family: Brandon_lighter;
  text-align: center;
  text-decoration: uppercase;
  background-color: #4cb6c8;
}
.bar-li-last-greet {
  float: right;
  color: white;
  font-family: Brandon_lighter;
  text-align: center;
  background-color: #4cb6c8;
}

.bar-li-last-error {
  float: rigth;
  color: red;
  font-family: Brandon_lighter;
  text-align: center;
  background-color: #4cb6c8;
}

.bar-li-btn:hover {
  background-color: #ec70a8;
}
</style>
