<template>
  <v-container fluid grid-list-xl py-0>
    <h3> {{$lang.basic_info.user_info}} </h3>
    <div class="profile-head app-card">
      <div class="profile-top">
        <img src="/static/img/profile-banner.jpg" alt="profile banner" width="1920" height="165" />
      </div>
      <div class="profile-bottom border-bottom-light-1">
        <div class="user-image text-xs-center mb-3">
          <img src="/static/img/user-7.jpg" class="img-responsive rounded-circle" alt="user images" />
        </div>
        <div class="user-list-content">
          <div class="text-xs-center">
            <h3 class="fw-bold">{{ user.name }}</h3>
            hello
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
          this.stepperForm = 2
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>

