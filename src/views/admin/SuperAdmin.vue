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
      <v-layout row wrap overflow-hidden>
        <v-flex sm4 xs12 mb-1 no-gutter>
          <v-card class="mb-30 ml-2 mr-2">
            <v-card-title primary-title class="indigo white--text">
              <h3>{{ $lang.strings.display_amount }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form v-model="displayAmountForm.valid" ref="displayAmountForm">
                <v-layout row wrap>
                  <v-flex xs12 sm5 offset-sm1>
                    <v-text-field
                    :label=$lang.strings.amount
                    v-model="displayAmountForm.displayAmount"
                    :rules='[v => !!v || "required"]'
                    required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 offset-sm1>
                    <v-btn class="blue white--text" @click="displayAmountFormSubmit()">
                      {{ $lang.strings.confirm }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
        <!-- pending transactions table -->
        <v-flex sm8 xs12 mb-1 no-gutter>
          <v-card class="mb-30 ml-2 mr-2">
            <v-card-title primary-title class="indigo white--text">
              <h3>{{ $lang.strings.pending_transactions }}</h3>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headersTransaction"
                :items="itemsTransaction"
                v-model="selectedTransaction"
                item-key="time"
                select-all>
                <template slot="headerCell" slot-scope="props">
                  <v-tooltip bottom>
                    <span slot="activator">
                      {{ props.header.text }}
                    </span>
                    <span>
                      {{ props.header.text }}
                    </span>
                  </v-tooltip>
                </template>
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox
                      primary
                      hide-details
                      v-model="props.selected"
                    ></v-checkbox>
                  </td>
                  <td class="text-xs-left">{{ props.item.timestamp }}</td>
                  <td class="text-xs-left">{{ props.item.address }}</td>
                  <td class="text-xs-left">{{ props.item.amount }}</td>
                </template>
              </v-data-table>
              <v-btn class="green white--text" v-if="selectedTransaction != ''" @click="confirmTransaction()">
                {{ $lang.strings.confirm}}
              </v-btn>
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
import swal from 'sweetalert2'
import firebase from 'firebase'

export default {
  data() {
    return {
      // -------------
      user: '',
      overview: false,
      systemLoadingDialog: false,
      displayAmountForm: {
        valid: false
      },
      selectedTransaction: [],
      headersTransaction: [
        {
          text: this.$lang.strings.add_datetime,
          align: 'left',
          value: 'add_datetime'
        },
        { text: this.$lang.strings.address, value: 'address' },
        { text: this.$lang.strings.amount, value: 'amount' }
      ],
      itemsTransaction: []
    }
  },
  methods: {
    async getSystemSettings () {
      try {
        this.systemLoadingDialog = true
        var db = firebase.firestore()
        var query = await db.collection('system').doc('system').get()
        this.displayAmountForm = query.data()
        this.systemLoadingDialog = false
        // console.log(query.data())
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
      }
    },
    async getPendingTransactions () {
      try {
        this.systemLoadingDialog = true
        var db = firebase.firestore()
        var query = await db.collection('transactions').where('verified', '==', false).get()
        var data = []
        var item
        query.forEach(doc => {
          item = doc.data()
          item.docId = doc.id
          data.push(item)
        })
        this.itemsTransaction = data
        // console.log(data)
        this.systemLoadingDialog = false
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
      }
    },
    async displayAmountFormSubmit () {
      if (!this.$refs.displayAmountForm.validate()) {
        console.log("Display Amount Form submit error");
      }
      this.systemLoadingDialog = true
      var db = firebase.firestore()
      try {
        await db.collection('system').doc('system').update({
          displayAmount: this.displayAmountForm.displayAmount
        })
        this.systemLoadingDialog = false
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
    async confirmTransaction () {
      var db = firebase.firestore()
      try {
        for (var i = 0; i < this.selectedTransaction.length; i++) {
          await db.collection('transactions').doc(this.selectedTransaction[i].docId).update({
            verified: true
          })
        }
        this.getPendingTransactions()
        swal(
          this.$lang.alert.success.title[0],
          '',
          'success'
        )
      } catch (error) {
        swal(
          this.$lang.alert.error.title[0],
          error.message,
          'error'
        )
        console.log(error)
      }
    }
  },
  created () {
    this.user = this.$store.getters.getUser
    this.getSystemSettings()
    this.getPendingTransactions()
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
