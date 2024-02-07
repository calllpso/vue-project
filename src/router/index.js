import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',                         name: 'home',              component: () => import('@views/home/Home.vue') },
    { path: '/login',                    name: 'login',             component: () => import('@views/login/Login.vue') },
    { path: '/employees/create',         name: 'employees-create',  component: () => import('@views/employees/EmployeesCreate.vue') },
    { path: '/employees/update/:id',     name: 'employees-update',  component: () => import('@views/employees/EmployeesUpdate.vue'), },
    { path: '/employees',                name: 'employees',         component: () => import('@views/employees/Employees.vue'),},
    { path: '/lists',                    name: 'lists',             component: () => import('@views/calllist/Lists.vue'),},
    { path: '/lists/create',             name: 'lists-create',      component: () => import('@views/calllist/ListsCreate.vue') },
    { path: '/lists/update/:id',         name: 'lists-update',      component: () => import('@views/calllist/ListsUpdate.vue') },
    { path: '/position',                 name: 'position',          component: () => import('@views/position/Position.vue') },
    { path: '/division',                 name: 'division',          component: () => import('@views/division/Division.vue') },
    { path: '/audio',                    name: 'audio',             component: () => import('@views/audio/Audio.vue'),},
    { path: '/audio/create',             name: 'audio-create',      component: () => import('@views/audio/AudioCreate.vue'), },
    { path: '/audio/update/:id',         name: 'audio-update',      component: () => import('@views/audio/AudioUpdate.vue'), },
    { path: '/reports',                  name: 'reports',           component: () => import('@views/report/Reports.vue'), },
    { path: '/reports/detail/:id',       name: 'reports-detail',    component: () => import('@views/report/ReportsDetail.vue'), },
  ]
})

export default router
