<template>
  <div>
    <v-container fluid px-4 py-0>
      <div class="dash-title">
        <span>{{$lang.strings.overview}}</span>
        <v-tooltip v-model="overview" top>
          <a href="javascript:void(0);" slot="activator">
            <v-icon>ti-help-alt</v-icon>
          </a>
          <span>Dashboard Overview</span>
        </v-tooltip>
      </div>
      <v-layout row wrap align-center>
        <v-flex xs12 class="text-xs-center">
          <v-dialog v-model="systemLoadingDialog" max-width="500px" class="mx-auto">
            <v-card class="text-xs-center">
              <v-card-text>
                <h3>{{ $lang.strings.system_running}}......</h3>
                <br>
                <v-progress-circular indeterminate :size="70" :width="7" color="blue"></v-progress-circular>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
      <!-- Dash Cards -->
      <v-layout row wrap border-rad-sm overflow-hidden>
        <v-flex sm10 offset-sm1 xs12 mb-1 no-gutter>
          <div class="pt-3 pb-3 purple white--text mb-3" align="center">
            <h2>{{ $lang.strings.system_amount }} : {{ displayAmount }}</h2>
          </div>
          <v-card class="mb-30">
            <v-card-title primary-title class="indigo white--text">
              <h3>{{ $lang.strings.add_transaction }}</h3>
            </v-card-title>
            <v-card-text>    
              <v-form v-model="form.valid" ref="form">
                <v-layout row wrap>
                  <v-flex xs12 sm4>
                    <v-text-field
                    :label=$lang.strings.address
                    v-model="form.address"
                    :rules='[v => !!v || "required"]'
                    required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 offset-sm1>
                    <v-text-field
                    :label=$lang.strings.amount
                    v-model="form.amount"
                    :rules='[v => !!v || "required"]'
                    required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <v-btn class="indigo white--text" @click="formSubmit()">
                      {{ $lang.strings.confirm }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
// -----------------
import firebase from 'firebase'
import swal from 'sweetalert2'

export default {
  data() {
    return {
      // -------------
      user: '',
      overview: false,
      systemLoadingDialog: false,
      displayAmount: '',
      form: {
        valid: false
      }
    }
  },
  methods: {
    async getSystemSettings () {
      try {
        this.systemLoadingDialog = true
        var db = firebase.firestore()
        var query = await db.collection('system').doc('system').get()
        this.displayAmount = query.data().displayAmount
        this.systemLoadingDialog = false
        // console.log(query.data())
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
      }
    },
    async formSubmit () {
      if (!this.$refs.form.validate()) {
        console.log("form submit error")
        return
      }
      var db = firebase.firestore()
      try {
        this.systemLoadingDialog = true
        await db.collection('transactions').add({
          address: this.form.address,
          amount: this.form.amount,
          verified: false,
          timestamp: this.parseDateTimeFormat()
        })
        this.systemLoadingDialog = false
        this.$refs.form.reset()
        swal(
          this.$lang.alert.success.title[0],
          '',
          'success'
        )
      } catch (error) {
        this.systemLoadingDialog = false
        swal(
          this.$lang.alert.error.title[0],
          error.message,
          'error'
        )
        console.log(error)
      }
    },
    parseDateTimeFormat () {
        var now = new Date()
        var mm = now.getMonth() + 1 // getMonth() is zero-based
        var dd = now.getDate()
        var hour = now.getHours()
        var min = now.getMinutes()
        var sec = now.getSeconds()
        var string = now.getFullYear() + '/' + (mm > 9 ? '' : '0') + mm + '/' + (dd > 9 ? '' : '0') + dd + ' ' + (hour > 9 ? '' : '0') + hour + ':' + (min > 9 ? '' : '0') + min + ':' + (sec > 9 ? '' : '0') + sec
        return string
    },
  },
  created () {
    this.user = this.$store.getters.getUser
    this.getSystemSettings()
  },
  watch: {
    // getUser: function () {
    //   console.log()
    // }
  },
  computed: {
    // ...mapGetters({
    //     getLang: 'getLang',
    //     getUser: 'getUser',
    // })
  }
};
</script>
