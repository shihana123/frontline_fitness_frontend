<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item v-if="role_id == 'Admin' || 'Trainer'"
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Admin'"
            :link="{
              name: 'Users',
              path: '/users',
              icon: 'ni ni-single-02 text-yellow'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Admin'"
            :link="{
              name: 'Programs',
              path: '/programs',
              icon: 'ni ni-ui-04 text-orange'
              }"
            >
        </sidebar-item>


        <!-- trainer -->
         <sidebar-item v-if="role_id == 'Trainer'"
            :link="{
              name: 'New Clients',
              path: '/clients/new_client',
              icon: 'ni ni-ui-04 text-orange'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Trainer'"
            :link="{
              name: 'Consultation Schedules',
              path: '/clients/consultation_schedules',
              icon: 'ni ni-bullet-list-67 text-yellow'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Trainer'"
            :link="{
              name: 'Clients',
              path: '/clients/clients',
              icon: 'ni ni-single-02 text-info'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Trainer'"
            :link="{
              name: 'Attendance',
              path: '/clients/attendance',
              icon: 'ni ni-calendar-grid-58 text-pink'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Sales'"
            :link="{
              name: 'Trainer Availability',
              path: '/trainer/availability',
              icon: 'ni ni-calendar-grid-58 text-yellow'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Sales'"
            :link="{
              name: 'Lead Management',
              path: '/leads',
              icon: 'ni ni-circle-08 text-pink'
              }"
            >
        </sidebar-item>
        

        <!-- <sidebar-item
              :link="{
                name: 'Maps',
                path: '/maps',
                icon: 'ni ni-pin-3 text-orange'
              }">
        </sidebar-item>

        <sidebar-item
              :link="{
                name: 'User Profile',
                path: '/profile',
                icon: 'ni ni-single-02 text-yellow'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'Tables',
                  path: '/tables',
                  icon: 'ni ni-bullet-list-67 text-red'
                }">
        </sidebar-item>

        <sidebar-item
                  :link="{
                    name: 'Login',
                    path: '/login',
                    icon: 'ni ni-key-25 text-info'
                  }">
        </sidebar-item>
        <sidebar-item
                  :link="{
                    name: 'Register',
                    path: '/register',
                    icon: 'ni ni-circle-08 text-pink'
                  }">
        </sidebar-item> -->
      </template>

    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import { FadeTransition } from 'vue2-transitions';
  import axios from 'axios'

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      FadeTransition
    },
    data() {
      return {
        role_id: '',
      };
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('sidenav');
        }
      },
      async userData()
      {
        const token = localStorage.getItem('token');
        console.log(localStorage.getItem('token'));
        var userRes = await axios.get('http://127.0.0.1:8000/api/user/userDetails/', {
          headers: { Authorization: `Token ${token}` }
        });
        this.role_id = userRes.data.roles[0].role.rolename;
        
        // localStorage.setItem('userRole', userRes.data.role);
        
      }
    },
   
    mounted() {
      this.initScrollbar()
      this.userData()
    }
  };
</script>
<style lang="scss">
</style>
