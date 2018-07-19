<template>
  <v-container fluid grid-list-xl py-0>
    <h3> {{$lang.basic_info.user_info}} </h3>
    <div class="profile-head app-card">
      <div class="profile-top">
        <img src="/static/img/profile-banner.jpg" alt="profile banner" width="1920" height="165" />
      </div>
      <div class="profile-bottom border-bottom-light-1">
        <div class="user-image text-xs-center mb-3">
          <img src="/static/img/user.png" class="img-responsive rounded-circle" alt="user images" />
        </div>
        <div class="user-list-content">
          <div class="text-xs-center">
            <h1 class="fw-bold">Hello {{ user.name }} !</h1>
            <v-layout row wrap>
              <v-flex xs12 sm8 offset-sm2>
                <div class="app-card" v-if="user.informationFilled">
                  <div class="app-card-content text-xs-left">
                    <div class="blog-content mb-3">
                      <h3>Email: {{ user.email }}</h3>
                      <h3>Phone: {{ user.phoneNumber }}</h3>
                      <h3>Gender: {{ user.gender }}</h3>
                      <h3>Birth Day: {{ user.birthDate }}</h3>
                      <h3>Address: {{ user.address }}</h3>
                    </div>
                    <div class="text-xs-center">
                      <v-btn class="btn-warning" to="/users/user-profile-update">
                        <span class="icon-title">{{ $lang.strings.edit }}</span>
                        <span><i class="ti-pencil"></i></span>
                      </v-btn>
                      <v-btn class="red white--text" v-on:click="resetPassword()">
                        {{ $lang.user_profile_update.reset_password }}
                      </v-btn>
                      <v-btn class="indigo white--text" id="verifyPhone" v-on:click="verifyPhone()">
                        {{ $lang.user_profile_update.verify_phone }}
                      </v-btn>
                      <div id="recaptcha-container" align="center">

                      </div>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
/* eslint-disable */
import firebase from "firebase"
import swal from "sweetalert2"
// import UserService from '@/services/UserService'

export default {
  data() {
    return {
      user: '',
      platformNotice: [
        { avatar: '/static/img/user-6.jpg', title: 'Customer Service', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { avatar: '/static/img/user-7.jpg', title: 'Customer Service', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
        { avatar: '/static/img/user-10.jpg', title: 'Sign up Notice', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
      ]
    };
  },
  created () {
    // prevent the store getter is faster than updated
    if (!this.$store.getters.getUser.informationFilled) {
      swal(
        'Information Not Updated Yet',
        '',
        'warning'
      )
      this.$router.push({path: '/users/user-profile-update'})
    } else {
      this.user = this.$store.getters.getUser
      console.log('got user from store')
    }
  },
  methods: {
    async resetPassword () {
      try {
        var result = await swal({
          title: this.$lang.alert.warning.are_you_sure,
          text: this.$lang.alert.warning.send_pw_reset_email,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.$lang.strings.confirm,
          cancelButtonText: this.$lang.strings.cancel
        })
        if (result.value) {
          var auth = firebase.auth();
          firebase.auth().useDeviceLanguage()
          var emailAddress = this.user.email;
          await auth.sendPasswordResetEmail(emailAddress)
          swal(
            this.$lang.alert.success.title[0],
            this.$lang.alert.success.email_sent,
            'success'
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    async verifyPhone () {
      var db = firebase.firestore()
      // formatting phone number
      var formattedPhone
      if (this.user.phoneNumber.charAt(0) === '0') {
        var res = this.user.phoneNumber.substring(1)
        formattedPhone = this.user.countryCode + res 
      } else {
        formattedPhone = this.user.countryCode + this.user.phoneNumber 
      }
      // console.log(formattedPhone)
      firebase.auth().useDeviceLanguage();
      var phoneNumber = formattedPhone;
      var appVerifier = window.recaptchaVerifier;

      try {
        var confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        window.confirmationResult = confirmationResult
        const {value: code} = await swal({
          title: 'Enter verification code',
          input: 'text',
          inputValue: '',
          showCancelButton: true,
          inputValidator: (value) => {
            return !value && 'You need to write something!'
          }
        })

        await confirmationResult.confirm(code)
        await db.collection('users').doc(this.user.docId).update({
          phoneVerified: true
        })
        swal(
          'Good !',
          '',
          'success'
        )
      } catch (error) {
        swal(
          'Verification Failed !',
          '',
          'error'
        )
        // Or, if you haven't stored the widget ID:
        window.recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
        })
        console.log(error)
      }
    },
    verifyEmail () {
      var user = firebase.auth().currentUser
      if (process.env.NODE_ENV === 'production') {
        var actionCodeSettings = {
          url: 'http://member.timespacefintech.com/users/user-profile',
          handleCodeInApp: false
        }  
      } else {
        var actionCodeSettings = {
          url: 'localhost:8080/users/user-profile',
          handleCodeInApp: false
        }
      }
      var actionCodeSettings = {
        url: 'http://member.timespacefintech.com/user/user-profile',
        handleCodeInApp: false
      }
      user.sendEmailVerification(actionCodeSettings)
        .then(() => {
          swal(
            this.$lang.alert.success.title[0],
            this.$lang.alert.success.description.verf_email,
            'success'
          )
      }).catch(function(error) {
        console.log(error)
      })
    }
  },
  mounted () {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
}
</script>

