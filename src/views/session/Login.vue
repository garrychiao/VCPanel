<template>
  <div class="session-banner">
    <v-container px-0>
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
        <v-flex xs12 sm10 md6 lg5 mx-auto>
          <div class="mb-70">
            <router-link to="/" class="d-block text-xs-center"><img src="/static/img/session-logo.png" /></router-link></p>
          </div>
          <div class="session-block">
            <div class="session-head text-xs-center">
              <div class="div-icon mb-3">
                <i class="ti-lock font-2x"></i>
              </div>
              <h3 class="mb-4">Login To Admin</h3>
              <p class="fs-14 px-5">Enter username and password to access control panel of Vuely.</p>
            </div>
            <v-form v-model="valid" class="mb-4">
              <v-text-field label="E-mail ID" v-model="email" :rules="emailRules" required></v-text-field>
              <v-text-field label="Password" v-model="password" type="password" :rules="passwordRules" required></v-text-field>
              <v-checkbox label="Remember me" v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" required></v-checkbox>
              <v-btn @click="signIn" block class="btn-gradient-primary">Login Now</v-btn>
              <v-btn to="/session/sign-up" block class="btn-gradient-warning">Create Account</v-btn>
            </v-form>
            <p class="text-xs-center mb-0 log-link"><router-link to="/session/login">Forgot password?</router-link></p>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
import swal from 'sweetalert2'

export default {
  data() {
    return {
      checkbox: false,
      valid: false,
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      systemLoadingDialog: false
    };
  },
  methods: {
    async signIn() {
      try {
        var db = firebase.firestore()
        this.systemLoadingDialog = true
        // since firebase will handle the user registrations, no need to pass to server
        await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        var user = firebase.auth().currentUser
        var query = await db.collection('users').where('userUid', '==', firebase.auth().currentUser.uid).get()
        var data = query.docs[0].data()
        data.emailVerified = user.emailVerified
        // console.log(data)
        this.$store.dispatch('setUser', data)

        this.systemLoadingDialog = false
        swal(
          'Good!',
          'Logging in.',
          'success'
        )
        this.$router.push({ path: '/' })
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
        var errorCode = error.code
        var errorMessage = error.message
        switch(errorCode) {
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
              errorMessage,
              'error'
            )
        }
      }
    }
  }
};
</script>
