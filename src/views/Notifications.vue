<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar Navigation -->
      <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky pt-3">
          <h5 class="sidebar-heading">Clinic System</h5>
          <ul class="nav flex-column">
            <li v-for="item in navigationItems" :key="item.route" class="nav-item">
              <router-link :to="item.route" class="nav-link">
                <span class="me-2">{{ item.icon }}</span>
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Check-in Notifications</h1>
          <button @click="refreshNotifications" class="btn btn-outline-primary btn-sm">
            <span class="spinner-border spinner-border-sm me-2" v-if="isRefreshing"></span>
            Refresh
          </button>
        </div>

        <!-- Notifications List -->
        <div v-if="notifications.length === 0" class="text-center py-5">
          <div class="empty-state">
            <h3 class="text-muted">No Check-in Notifications Yet</h3>
            <p class="text-muted">Patient check-ins will appear here when they complete the check-in process.</p>
          </div>
        </div>

        <div v-else class="notifications-list">
          <div v-for="notification in sortedNotifications" :key="notification.id" class="notification-card mb-3">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-1">{{ notification.subject }}</h5>
                  <small class="text-muted">{{ formatTimestamp(notification.timestamp) }}</small>
                </div>
                <div class="notification-actions">
                  <button @click="markAsRead(notification.id)" class="btn btn-sm btn-outline-secondary me-2">
                    Mark as Read
                  </button>
                  <button @click="deleteNotification(notification.id)" class="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="patient-info">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Name:</strong> {{ extractName(notification.body) }}</p>
                      <p><strong>Email:</strong> {{ extractEmail(notification.body) }}</p>
                      <p><strong>National ID:</strong> {{ extractNationalID(notification.body) }}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Queue Number:</strong> {{ extractQueueNumber(notification.body) }}</p>
                      <p><strong>Check-in Time:</strong> {{ extractCheckInTime(notification.body) }}</p>
                      <p><strong>Symptoms:</strong> {{ extractSymptoms(notification.body) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="card text-center">
              <div class="card-body">
                <h3 class="text-primary">{{ notifications.length }}</h3>
                <p class="mb-0">Total Check-ins</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-center">
              <div class="card-body">
                <h3 class="text-success">{{ todayCheckIns }}</h3>
                <p class="mb-0">Today's Check-ins</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-center">
              <div class="card-body">
                <h3 class="text-info">{{ unreadCount }}</h3>
                <p class="mb-0">Unread Notifications</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePatientStore } from '../stores/patientStore'

const patientStore = usePatientStore()
const { navigationItems } = patientStore

const notifications = ref<any[]>([])
const isRefreshing = ref(false)

// Computed properties
const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

const todayCheckIns = computed(() => {
  const today = new Date().toDateString()
  return notifications.value.filter(n => 
    new Date(n.timestamp).toDateString() === today
  ).length
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const loadNotifications = () => {
  const stored = localStorage.getItem('clinicNotifications')
  if (stored) {
    notifications.value = JSON.parse(stored)
  }
}

const refreshNotifications = () => {
  isRefreshing.value = true
  setTimeout(() => {
    loadNotifications()
    isRefreshing.value = false
  }, 1000)
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
    saveNotifications()
  }
}

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
  saveNotifications()
}

const saveNotifications = () => {
  localStorage.setItem('clinicNotifications', JSON.stringify(notifications.value))
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

// Helper functions to extract data from email body
const extractName = (body: string) => {
  const match = body.match(/Name:\s*(.+)/)
  return match ? match[1].trim() : 'N/A'
}

const extractEmail = (body: string) => {
  const match = body.match(/Email:\s*(.+)/)
  return match ? match[1].trim() : 'N/A'
}

const extractNationalID = (body: string) => {
  const match = body.match(/National ID:\s*(.+)/)
  return match ? match[1].trim() : 'N/A'
}

const extractQueueNumber = (body: string) => {
  const match = body.match(/Queue Number:\s*(.+)/)
  return match ? match[1].trim() : 'N/A'
}

const extractCheckInTime = (body: string) => {
  const match = body.match(/Check-in Time:\s*(.+)/)
  return match ? match[1].trim() : 'N/A'
}

const extractSymptoms = (body: string) => {
  const match = body.match(/Symptoms:\s*(.+)/)
  return match ? match[1].trim() : 'None specified'
}

// Lifecycle
onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(180deg, var(--sidebar-bg), #2d3748);
}

.sidebar-heading {
  color: var(--sidebar-text);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: .875rem;
}

.nav-link {
  color: var(--sidebar-text);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: white;
  background: var(--primary-color);
}

.notification-card {
  transition: transform 0.2s ease;
}

.notification-card:hover {
  transform: translateY(-2px);
}

.empty-state {
  padding: 3rem 0;
}

.card-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
}

.patient-info p {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .sidebar {
    position: relative;
    padding: 1rem 0;
  }
  
  .notification-actions {
    flex-direction: column;
  }
}
</style>
