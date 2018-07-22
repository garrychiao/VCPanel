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
      <!-- Dash Cards -->
      <v-layout row wrap border-rad-sm overflow-hidden>
        <v-flex xs5 no-gutter>
          <v-btn class="indigo white--text" block :to="adminPath" style="height:200px;">
            <h1>{{ $lang.strings.admin }}</h1>
          </v-btn>
        </v-flex>
        <v-flex xs5 offset-sm1 no-gutter>
          <v-btn class="purple white--text" block :to='superAdminPath' style="height:200px;">
            <h1>{{ $lang.strings.superAdmin }}</h1>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
// -----------------
import swal from 'sweetalert2'

export default {
  data() {
    return {
      // -------------
      user: '',
      overview: false,
      adminPath: '/admin/admin',
      superAdminPath: '/admin/super-admin'
    }
  },
  created () {
    this.user = this.$store.getters.getUser
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
