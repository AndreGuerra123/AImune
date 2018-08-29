<template>
  <div id="app">
    <vue-particles class="particles"
        color="#ec70a8"
        :particleOpacity="0.8"
        linesColor="#4cb6c8"
        :particlesNumber="30"
        shapeType="triangle"
        :particleSize="5"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.8"
        :linesDistance="450"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="bubble"
      >
    </vue-particles>
    <img src="./assets/imgs/alcyomics-logo.png" alt="Alcyomics Logo" class="logo">
    <ul class="bar">
        <li v-if="token" class="bar-li"><button class="bar-li-btn" @click="showLoader=true">Load</button></li>
        <li v-if="token" class="bar-li"><button class="bar-li-btn" @click="showDesigner=true">Design</button></li>
        <li v-if="token" class="bar-li"><button class="bar-li-btn" @click="showTrainer=true">Train</button></li>
        <li v-if="token" class="bar-li"><button class="bar-li-btn" @click="showPredictor=true">Predict</button></li>
        <li v-if="!token" class="bar-li-last"><button id="show-modal" @click="initiateRegistry" class="bar-li-btn">Register</button></li>
        <li class="bar-li-last"><button class="bar-li-btn" v-on:click="logaction">{{logactiondesc()}}</button></li>
        <li v-if="!token" class="bar-li-last"><input class="bar-li-btn" type="password" placeholder="Password" v-model="password"></li>
        <li v-if="!token" class="bar-li-last"><input class="bar-li-btn" type="text" placeholder="Username" v-model="username"></li>
        <li v-if="token" class="bar-li-last-greet">{{greeting}}</li>
    </ul>
    <error :show="error" @close="clearError"></error>
    <regist :show="showRegister" @close="onRegist"></regist>
    <load :show="showLoader" :token="token" :username="username" @close="showLoader=false"></load>
    <design :show="showDesigner" :token="token" :username="username" @close="showDesigner=false"></design>
    <train :show="showTrainer" :token="token" :username="username" @close="showTrainer=false"></train>
    <predict :show="showPredictor" :token="token" :username="username" @close="showPredictor=false"></predict>


  </div>
</template>

<script>
import axios from 'axios';
const ax = axios.create({
          baseURL: "https://209.97.191.228:3000/",
          timeout: 2000});

export default {
  name: "app",
  data: function() {
    return {
      error: "",
      username: "",
      password: "",
      greeting: "",
      token: "",
      showRegister: false,
      showLoader: false,
      showDesigner: false,
      showTrainer: false,
      showPredictor: false
    };
  },
  methods: {
    logactiondesc() {
      if (!this.token) {
        return "Login";
      } else {
        return "Logout";
      }
    },
    login() {
      ax
        .post("login", {
          username: this.username,
          password: this.password
        })
        .then(response => {
          this.token = response.data.token;
          this.greet();
        }).catch(error => {
          try {
            this.error = error.response.data.details[0].message;
          } finally {
            if (!this.error) {
              try{
              console.log(error)
              console.log(error.response)
              }finally{
              this.error = error.toString();
              }
            }
            this.logout();
          }
        });
    },

    clearError() {
      this.error = '';
    },

    logout() {
      this.token = '';
      this.username = '';
      this.password = '';
      this.greeting = '';
    },

    logaction() {
      if (!this.token) {
        this.login();
      } else {
        this.logout();
      }
    },

    greet() {
      var morning = 7;
      var afternoon = 12;
      var evening = 18;
      var currentHour = new Date().getHours();

      if (currentHour >= morning && currentHour <= afternoon) {
        var g = "morning";
      } else if (currentHour >= afternoon && currentHour <= evening) {
        var g = "afternoon";
      } else {
        var g = "evening";
      }

      this.greeting = "  Good " + g + ", " + this.username + ".  ";
    },
    initiateRegistry() {
      this.showRegister = true;
    },
    onRegist(value) {
      this.showRegister = false;
      this.token = value.token;
      this.username = value.username;
      if (this.token) {
        this.greet();
      }
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

.particles{
position: absolute;
top: 10px;
bottom: 10px;
left: 10px;
right:10px;
z-index: -1;
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
