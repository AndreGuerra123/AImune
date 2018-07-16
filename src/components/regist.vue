<script>
import axios from 'axios';
let ai = axios.create({
  baseURL: "https://209.97.191.228:3000/",
  timeout: 2000
});

export default {
  template: "#regist-template",
  props: ["show"],
  data: function() {
    return {
      firstname: "",
      lastname: "",
      username: "",
      birthdate: "",
      address: "",
      postalcode: "",
      city: "",
      country: "",
      telephone: "",
      email: "",
      password: "",
      password_confirm: "",
      auth_token: "",
      error : ""
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    clear: function() {
      this.error = "";
    },
    registUser: function() {
        ai.post("signup",{
          firstname: this.firstname,
          lastname: this.lastname,
          username: this.username,
          birthdate: this.birthdate,
          address: this.address,
          postalcode: this.postalcode,
          city: this.city,
          country: this.country,
          telephone: this.telephone,
          email: this.email,
          password: this.password,
          password_confirm: this.password_confirm,
          auth_token: this.auth_token
        }).then(res => {
          this.token = res.data.token;
          this.greet();
          this.log = true;
          this.error = "";
        }).catch(error => {

          if(error.response.data.details[0].message){
            this.error = error.response.data.details[0].message;
          } else {
            this.error = error.toString();
          }
        })
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

<template>
<transition name="regist">
        <div class="regist-mask" @click="close" v-show="show">
            <div class="regist-container" @click.stop>
                <div class="regist-header">
                    <img src="../assets/imgs/alcyomics-icon.png" alt="Alcyomics Icon" class="icon">
                </div>
                <div class="regist-body">
                  <ul class="entries">
                    <li class='entry1'><label class="form-label">
                        First Name:
                        <input v-model="firstname" class="form-control">
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        Last Name:
                        <input v-model="lastname" class="form-control">
                    </label>
                    </li>
                    </ul>
                      <ul class="entries">
                    <li class='entry1'><label class="form-label">
                        Address:
                        <input v-model="address" class="form-control">
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        City:
                        <input v-model="city" class="form-control">
                    </label>
                    </li>
                    </ul>
                    <ul class="entries">
                    <li class='entry1'><label class="form-label">
                        Post Code:
                        <input v-model="postalcode" class="form-control">
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        Country:
                        <input v-model="country" class="form-control">
                    </label>
                    </li>
                    </ul>
                    <ul class="entries">
                    <li class='entry1'><label class="form-label">
                         <label class="form-label">
                        Birthday:
                        <datepicker v-model="birthdate" class = "datepickform-control"></datepicker>
                    </label>
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        Invitation Token:
                        <input v-model="auth_token" class="form-control">
                    </label>
                    </li>
                    </ul>
                    <ul class="entries">
                    <li class='entry1'><label class="form-label">
                        Email:
                        <input v-model="email" class="form-control">
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        Telephone:
                        <input v-model="telephone" class="form-control">
                    </label>
                    </li>
                    </ul>

                    <ul class="entries">
                    <li class='entry1'><label class="form-label">
                        Username:
                        <input v-model="username" class="form-control">
                    </label>
                    </li>
                    <li class="entry2">
                        <label class="form-label">
                        Password:
                        <input v-model="password" class="form-control">
                    </label>
                    <li class="entry2">
                        <label class="form-label">
                        <input v-model="password_confirm" class="form-control">
                    </label>
                    </li>
                    </ul>
                </div>
                <div class="regist-footer">
                    <button class="regist-default-button" @click="registUser()">
                        Sign Up
                    </button>
                    <error :show="error" @close="clear()"></error>
                </div>
            </div>

        </div>
    </transition>
</template>


<style>
* {
  box-sizing: border-box;
}

.regist-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.regist-container {
  width: 500px;
  height: 500px;
  margin: 200px auto 0;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Brandon_lighter;
}
.regist-default-button {
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
.regist-default-button:hover {
  background-color: #ec70a8;
}

.regist-header .icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.regist-body {
  margin: 15px 2px;
}

.regist-footer{
width: 100px;
position:absolute;
bottom:200px;
left: 50%;
margin-left: -50px
}

.form-label {
  display: block;
  font-family: Brandon_lighter;
}


.form-control {
  display: block;
  padding: 0.3em 0.3em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
 .datepickform-control {
     display: block;

    padding: 0;
    line-height: 1.7;
      border: 1px solid #ddd;

 }

.regist-enter {
  opacity: 0;
}

.regist-leave-active {
  opacity: 0;
}

.regist-enter .regist-container,
.regist-leave-active .regist-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.entries {
  list-style-type: none;
  padding: 3px;
  margin: 3%
}

.entry1 {
  float: left;
  margin-left: 5%;
  margin-right: 0;

}
.entry2 {
  float: right;
  margin-left: 0;
  margin-right: 5%;


}
</style>
