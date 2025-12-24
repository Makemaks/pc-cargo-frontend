import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/app/layouts/DefaultLayout.vue'
import DashboardHome from '@/app/pages/dashboard/DashboardHome.vue'
import JobsPage from '@/app/pages/job/JobsPage.vue'
import JobFormPage from '@/app/pages/job/JobFormPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardHome,
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: JobsPage,
      },
      {
        path: 'jobs/create',
        name: 'jobs.create',
        component: JobFormPage,
      },
      {
        path: 'jobs/:id/edit',
        name: 'jobs.edit',
        component: JobFormPage,
        props: true,
      },
    ],
  },
]

