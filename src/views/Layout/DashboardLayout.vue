<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item v-if="role_id == 'Sales'"
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Dietitian'"
          :link="{
            name: 'Dashboard',
            path: '/dietitan/dashboard',
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


        <!-- trainer & Dietitian -->
        <sidebar-item v-if="role_id == 'Trainer'"
            :link="{
              name: 'New Clients',
              path: '/clients/trainer/new_client',
              icon: 'ni ni-ui-04 text-orange'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Dietitian'"
            :link="{
              name: 'New Clients',
              path: '/clients/trainer/new_client',
              icon: 'ni ni-ui-04 text-orange'
              }"
            >
        </sidebar-item>

        <!-- <sidebar-item v-if="role_id == 'Trainer' || role_id == 'Dietitian'"
            :link="{
              name: 'Consultation Schedules',
              path: '/clients/consultation_schedules',
              icon: 'ni ni-bullet-list-67 text-yellow'
              }"
            >
        </sidebar-item> -->

        <sidebar-item v-if="role_id == 'Trainer' || role_id == 'Dietitian'"
            :link="{
              name: 'Clients',
              path: '/clients/clients',
              icon: 'ni ni-single-02 text-info'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Trainer' || role_id == 'Dietitian'"
            :link="{
              name: 'Paused Clients',
              path: '/clients/paused_clients',
              icon: 'ni ni-bullet-list-67 text-yellow'
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

        <!-- Trainer  & Dietitian -->

        <!-- Sales -->
        <div @click="toggleDropdown('sales')" class="sidebar-item d-flex justify-content-between align-items-center" v-if="role_id == 'Sales'">
            <div class="d-flex align-items-center dropdown_slide_items">
              <i class="ni ni-calendar-grid-58 text-yellow text-primary mr-2"></i>
              <span>Availability</span>
            </div>
            <i :class="dropdowns.sales ? 'ni ni-bold-down' : 'ni ni-bold-right'" class="dropdown_slide_arrow"></i>
        </div>

          <!-- Dropdown child items -->
        <div v-if="dropdowns.sales" class="ml-4">
            <sidebar-item
              :link="{ 
                name: 'Trainer Availability - Day', 
                path: '/trainer/availabilityDay', 
                icon: 'ni ni-bullet-list-67 text-warning' }"
            />
            <sidebar-item
              :link="{ 
                name: 'Trainer Availability - Time', 
                path: '/trainer/availabilityTime', 
                icon: 'ni ni-bullet-list-67 text-warning' }"
            />
            <sidebar-item
              :link="{ 
                name: 'Group - Availability', 
                path: '/program/groupAvailability', 
                icon: 'ni ni-bullet-list-67 text-warning' }"
            />
        </div>

        <sidebar-item v-if="role_id == 'Sales'"
            :link="{
              name: 'Lead Management',
              path: '/leads',
              icon: 'ni ni-circle-08 text-pink'
              }"
            >
        </sidebar-item>

          
        <sidebar-item v-if="role_id == 'Sales'"
            :link="{
              name: 'Clients',
              path: '/clients/sales_clients',
              icon: 'ni ni-single-02 text-orange'
              }"
            >
        </sidebar-item>

        <sidebar-item v-if="role_id == 'Sales'"
            :link="{
              name: 'Clients - Paused',
              path: '/clients/paused_sales_clients',
              icon: 'ni ni-button-pause text-info'
              }"
            >
        </sidebar-item>


        <!-- VMC -->
         <sidebar-item v-if="role_id == 'VMC'"
          :link="{
            name: 'Dashboard',
            path: '/VMC/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        >
        </sidebar-item>
         <sidebar-item v-if="role_id == 'VMC'"
            :link="{
              name: 'Clients',
              path: '/clients/clients',
              icon: 'ni ni-single-02 text-info'
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
        dropdowns: {
      sales: false,
      dashboard: false,
    },
      };
    },
    methods: {
      toggleDropdown(item) {
      this.dropdowns[item] = !this.dropdowns[item];
    },
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
        var userRes = await axios.get('${process.env.VUE_APP_API_BASE_URL}userDetails/', {
          headers: { Authorization: `Token ${token}` }
        });
        this.role_id = userRes.data.roles[0].role.rolename;
        
      }
    },
   
    mounted() {
      this.initScrollbar()
      this.userData()
    }
  };
</script>
<style lang="scss">
.sidebar-item {
  cursor: pointer;
  padding: 0.5rem;
}
.ml-4 {
  margin-left: 1rem;
}
.dropdown_slide_items
{
  padding: 0.1rem 1.1rem !important;
  font-size: 0.9rem !important;
}
.dropdown_slide_icon
{
  min-width: 2.25rem;
  font-size: .9375rem;
  line-height: 1.5rem;
}
.dropdown_slide_arrow
{
  margin-right: 30px;
  font-size: 13px;
}
.dropdown_slide_items span
{
  margin-left: 10px;
}
</style>
