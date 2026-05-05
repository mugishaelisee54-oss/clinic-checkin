import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../views/SignIn.vue'
import CheckIn from '../views/CheckIn.vue'
import Profile from '../views/Profile.vue'
import Help from '../views/Help.vue'
import QueueStatus from '../views/QueueStatus.vue'
import Notifications from '../views/Notifications.vue'

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    component: CheckIn
  },
  {
    path: '/queue-status',
    name: 'QueueStatus',
    component: QueueStatus
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications
  }
]

// Use hash history for GitHub Pages compatibility
const router = createRouter({
  history: createWebHistory('/clinic-checkin/'),
  routes
})

export default router
