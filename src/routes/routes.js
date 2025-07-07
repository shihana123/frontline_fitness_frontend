import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';
import Router from 'vue-router';

import NotFound from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    redirect: 'login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Register.vue')
      },
      // { path: '*', component: NotFound }
    ]
  },
  {
    path: '/',
    redirect: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard.vue'),
        component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard/SalesDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/dietitan/dashboard',
        name: 'dietitan/dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard/DietitianDashboard.vue'),
        // component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard/SalesDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Users/UserList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/users/create',
        name: 'users/create',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Users/CreateUser.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/programs',
        name: 'programs',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Programs/ProgramList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/programs/create',
        name: 'programs/create',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Programs/CreateProgram.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/trainer/new_client',
        name: 'clients/trainer/new_client',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/NewClientList.vue'),
        meta: { requiresAuth: true }
      },
      // {
      //   path: '/clients/dietitian/new_client',
      //   name: 'clients/dietitian/new_client',
      //   component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/NewClientList.vue'),
      //   meta: { requiresAuth: true }
      // },
      {
        path: '/clients/consultation_schedules',
        name: 'clients/consultation_schedules',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ConsulationScheduleList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/upcoming_consultation_schedules',
        name: 'clients/upcoming_consultation_schedules',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/UpcomingConsulationScheduleList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/missed_consultation_schedules',
        name: 'clients/missed_consultation_schedules',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/MissedConsulationScheduleList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/consultation_details/:id',
        name: 'clients/consultation_details',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ConsultationDetails.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/graphical_view/:id',
        name: 'clients/graphical_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/graphicalView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/measurement_graphical_view/:id',
        name: 'clients/measurement_graphical_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/MeasurementgraphicalView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/clients',
        name: 'clients/clients',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/view/:id',
        name: 'clients/view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/workout_view/:id',
        name: 'clients/workout_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientWorkoutView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/weekly_meeting_view/:id',
        name: 'clients/weekly_meeting_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientWeeklyMeetingView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/measurement_view/:id',
        name: 'clients/measurement_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientMeasurementView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/attendance',
        name: 'clients/attendance',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientAttendanceView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/attendance_view/:id',
        name: 'clients/attendance_view',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientAttendanceMonthlyView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/trainer/availabilityDay',
        name: 'trainer/availabilityDay',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/TrainerAvailability.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/trainer/availabilityTime',
        name: 'trainer/availabilityTime',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/TrainerAvailabilityTime.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/leads',
        name: 'leads',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/LeadsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/leads/create',
        name: 'leads/create',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/CreateLeads.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/leads/edit/:id',
        name: 'leads/edit',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/UpdateLeads.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/sales_clients',
        name: 'clients/sales_clients',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/leads/follow_ups/:id',
        name: 'leads/follow_ups',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Leads/FollowupList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/program/groupAvailability',
        name: 'program/groupAvailability',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Programs/GroupAvaliabilityList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/icons',
        name: 'icons',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Icons.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/UserProfile.vue')
      },
      {
        path: '/maps',
        name: 'maps',
        component: () => import(/* webpackChunkName: "demo" */ '../views/GoogleMaps.vue')
      },
      {
        path: '/tables',
        name: 'tables',
        component: () => import(/* webpackChunkName: "demo" */ '../views/RegularTables.vue')
      }
    ]
  },
  
];

const router = new Router({
  mode: 'history',
  routes
});

// 🔐 Global Guard
router.beforeEach((to, from, next) => {
  
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default routes;
