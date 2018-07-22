<!-- Side Structure -->
<template>
  <div class="sidebar" :class="sidebarFilter">
        <v-toolbar flat class="transparent scroll-area navigation">
          <v-list class="pa-0">
            <v-list-tile avatar class="sidebar-profile">
              <v-list-tile-avatar>
                <img src="/static/img/user.png" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="fw-bold">{{ user.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-spacer></v-spacer>
            </v-list-tile>
            <div class="sidebar-title px-3">
              <span>{{$lang.strings.general}}</span>
            </div>
            <template v-for="item in category1"  v-if="user.authority == 'SuperAdmin' || user.authority == 'Admin'">
              <template v-if="item.items!= null">
                <v-list-group
                  :key="item.title"
                  :prepend-icon="item.action"
                  no-action
                  v-model="item.active"
                >
                <v-list-tile ripple slot="activator" v-if="item.items !== null">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile ripple slot="activator" :to="item.path" v-else>
                  <v-list-tile-action>
                    <i :class="item.action"></i>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile ripple v-for="subItem in item.items" v-bind:key="subItem.title" v-if="subItem !== null" :to="subItem.path">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[subItem.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
              </template>
              <template v-else>
                <v-list-tile :to="item.path" :key="item.path">
                  <v-list-tile-action>
                    <v-icon>{{ item.action }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </template>
            <template v-for="item in category2" v-if="user.authority == 'SuperAdmin'">
              <template v-if="item.items!= null">
                <v-list-group
                  :key="item.title"
                  :prepend-icon="item.action"
                  no-action
                  v-model="item.active"
                >
                <v-list-tile ripple slot="activator" v-if="item.items !== null">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile ripple slot="activator" :to="item.path" v-else>
                  <v-list-tile-action>
                    <i :class="item.action"></i>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile ripple v-for="subItem in item.items" v-bind:key="subItem.title" v-if="subItem !== null" :to="subItem.path">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[subItem.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
              </template>
              <template v-else>
                <v-list-tile :to="item.path" :key="item.path">
                  <v-list-tile-action>
                    <v-icon>{{ item.action }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ $lang.strings[item.title] }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </template>
            <template>
              <v-list-tile @click="signOut">
                <v-list-tile-action>
                  <v-icon>power_settings_new</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ $lang.strings.logout }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-toolbar>
  </div>
</template>

<script>
/* eslint-disable */
import { categoryAdmin, categorySuperAdmin} from "./SidebarLinks";
import EventBus from "../../lib/eventBus";
import firebase from 'firebase'
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      category1: categoryAdmin,
      category2: categorySuperAdmin,
      backgroundFilters: null,
      expandSidebar: "",
      user: ''
    };
  },
  methods: {
    async signOut () {
      try {
        await firebase.auth().signOut()
        console.log("sign out completed");
        swal(
          'Good Bye!',
          '',
          'success'
        )
        this.$router.push({ path: '/session/login' });
      } catch(error) {
        console.log(error)
      }
    }
  },
  computed: {
    // change the background color of the sidebar
    sidebarFilter() {
      EventBus.$on("sidebarFilters", payload => {
        this.backgroundFilters = payload;
      });
      return this.backgroundFilters;
    },
    ...mapGetters({
        getLang: 'getLang',
        getUser: 'getUser'
    })
  },
  watch: {
    getUser: function () {
      this.user = this.$store.getters.getUser
    }
  },
  created() {
    this.user = this.$store.getters.getUser
  }
};
</script>
