<template>
  <div class="session-banner">
    <v-container pa-0>
      <v-layout row wrap align-center>
          <v-flex xs12 class="text-xs-center">
              <v-dialog v-model="systemLoadingDialog" max-width="500px" class="mx-auto">
                  <v-card class="text-xs-center">
                      <v-card-text>
                          <h3>{{ $lang.strings.system_running }}......</h3>
                          <br>
                          <v-progress-circular indeterminate :size="70" :width="7" color="blue"></v-progress-circular>
                      </v-card-text>
                  </v-card>
              </v-dialog>
          </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm10 md10 mx-auto>
          <div class="mb-70">
            <a href="/" class="d-block text-xs-center"><img src="/static/img/session-logo.png" /></a>
          </div>
          <v-layout row wrap>
            <v-flex xs12 md6 offset-md3>
              <div class="session-block">
                <div class="session-head text-xs-center">
                  <div class="div-icon mb-3">
                    <i class="ti-lock font-2x"></i>
                  </div>
                  <h3 class="mb-4">{{ $lang.strings.register }}</h3>
                  <p class="fs-14 px-5">Enter username and password to access control panel of Vuely.</p>
                </div>
                <v-form v-model="valid" class="mb-4">
                  <v-text-field label="Username" v-model="name" :rules="nameRules" :counter="10" required></v-text-field>
                  <v-text-field label="E-mail ID" v-model="email" :rules="emailRules" required></v-text-field>
                  <v-text-field label="Password" v-model="password" :rules="passwordRules" type="password" required></v-text-field>
                  <v-btn @click="register" block class="btn-gradient-warning">Create Account</v-btn>
                </v-form>
                <p class="text-xs-center mb-0 log-link">Already have an account? <router-link to="/session/login">Log In</router-link></p>
              </div>
            </v-flex>
            <!--
            <v-flex xs12 md5 offset-md1 d-sm-none>
              <div class="block-center">
                <div class="mb-4 session-content">
                  <h3 class="mb-3">Register To Admin</h3>
                  <p class="fs-14">Enter username and password to access control panel of Vuely.</p>
                </div>
                <div class="session-social-links">
                  <ul class="list-unstyled">
                    <li>
                      <span class="facebook-bg session-icon"><i class="ti-facebook"></i></span>
                      <span>Signup Using Facebook</span>
                    </li>
                    <li>
                      <span class="google-bg session-icon"><i class="ti-google"></i></span>
                      <span>Signup Using Google+</span>
                    </li>
                    <li>
                      <span class="twitter-bg session-icon"><i class="ti-twitter-alt"></i></span>
                      <span>Signup Using Twitter</span>
                    </li>
                  </ul>
                </div>
              </div>
            </v-flex>
            -->
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import swal from 'sweetalert2'

  export default {
    data () {
      return {
        valid: false,
        name: '',
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 10 || 'Name must be less than 10 characters'
        ],
        email: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        password: '',
        passwordRules: [
          (v) => !!v || 'Password is required'
        ],
        systemLoadingDialog: false
      }
    },
    methods: {
      submit () {
        console.log("user signup")
      },
      async register () {
        try {
          this.systemLoadingDialog = true
          var db = firebase.firestore()
          // since firebase will handle the user registrations, no need to pass to server
          await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          var user = firebase.auth().currentUser
          await user.updateProfile({
            displayName: this.name
          })
          await db.collection("users").add({
            userUid: user.uid,
            name: this.name,
            email: this.email,
            informationFilled: false
          })
          var query = await db.collection('users').where('userUid', '==', firebase.auth().currentUser.uid).get()
          var data = query.docs[0].data()
          data.emailVerified = user.emailVerified
          data.docId = query.docs[0].id
          // console.log(data)
          this.$store.dispatch('setUser', data)

          console.log('success')

          this.systemLoadingDialog = false
          swal(
            'Good!',
            'Logging in.',
            'success'
          )
          this.$router.push({path: '/'})
          //
        } catch (error) {
          this.systemLoadingDialog = false
          console.log(error)
          switch(error.code) {
            case 'auth/invalid-email':
              swal(
                'Oops!',
                'Invalid email format.',
                'error'
              )
              break;
            case 'auth/wrong-password':
              swal(
                'Oops!',
                'Invalid password.',
                'error'
              )
              break;
            case 'auth/user-not-found':
              swal(
                'Oops!',
                'User not found.',
                'error'
              )
              break;
            default:
              swal(
                'Oops!',
                error.message,
                'error'
              )
              break;
          }
        }
      }
      //
    }
  }
</script>
