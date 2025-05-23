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
        component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard.vue'),
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
        path: '/clients/new_client',
        name: 'clients/new_client',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ClientList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clients/consultation_schedules',
        name: 'clients/consultation_schedules',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Clients/ConsulationScheduleList.vue'),
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
