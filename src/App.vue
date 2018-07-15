<template>

  <div id="app">
    <img src="./assets/imgs/alcyomics-logo.png" alt="Alcyomics Logo" class="logo">
    <ul class="bar">
        <li class="bar-li"><button class="bar-li-btn">Load</button></li>
        <li class="bar-li"><button class="bar-li-btn">Classify</button></li>
        <li class="bar-li"><button class="bar-li-btn">Model</button></li>
        <li class="bar-li"><button class="bar-li-btn">Predict</button></li>
        <li v-if="!log" class="bar-li-last"><button class="bar-li-btn">Register</button></li>
        <li class="bar-li-last"><button class="bar-li-btn" v-on:click="logaction">{{logactiondesc()}}</button></li>
        <li v-if="!log" class="bar-li-last"><input class="bar-li-btn" type="password" placeholder="Password" v-model="password"></li>
        <li v-if="!log" class="bar-li-last"><input class="bar-li-btn" type="text" placeholder="Username" v-model="username"></li>
        <li v-if="log" class="bar-li-last-greet">{{greeting()}}</li>
        <li v-if="error" class="bar-li-last-error">{{error}}</li>
    </ul>
  </div>
</template>

<script>

const BACKEND = 'https://209.97.191.228:3000/';

export default {
  name: "app",
  data: function() {
    return {
      log: false,
      error: "",
      username: "",
      password: "",
      greeting: "",
      token: ""
    };
  },
  methods: {
    logactiondesc: function() {
      if (!this.log) {
        return "Login";
      } else {
        return "Logout";
      }
    },
    logaction: function() {
      if (!this.log) {
        this.login();
      } else {
        this.logout();
      }
    },
    login: function() {
      axios
        .post(BACKEND + "signin", {
          username,
          password
        })
        .then(function(res) {
          token;
          greet();
          log = true;
          error = "";
        })
        .catch(function(error) {
          error = error.toString();
          logout();
        });
    },

    logout: function() {
      username = "";
      password = "";
      log = false;
      token = "";
    },
    greet: function() {
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

      greeting = "Good " + g + ", " + this.username + ".";
    }
  }
};
</script>

<style>
@font-face {
  font-family: brandon_grotesque;
  src: url("./assets/fonts/Brandon Grotesque/Brandon_thin.otf")
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
  font-family: brandon_grotesque;
  text-align: center;
  text-decoration: uppercase;
  background-color: #4cb6c8;
}
.bar-li-last-greet {
  float: right;
  color: white;
  font-family: brandon_grotesque;
  text-align: center;
  background-color: #4cb6c8;
}

.bar-li-last-error {
  float: rigth;
  color: red;
  font-family: brandon_grotesque;
  text-align: center;
  background-color: #4cb6c8;
}

.bar-li-btn:hover {
  background-color: #ec70a8;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
