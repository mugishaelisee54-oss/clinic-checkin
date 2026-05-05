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
          <h1 class="h2">Queue Status</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
              <button @click="refreshQueue" class="btn btn-sm btn-outline-secondary">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <!-- Queue Statistics -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">{{ totalPatients }}</h5>
                <p class="card-text">Total Patients</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-warning">
              <div class="card-body">
                <h5 class="card-title">{{ currentQueue.length }}</h5>
                <p class="card-text">In Queue</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">{{ registeredPatients.length }}</h5>
                <p class="card-text">Registered</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-info text-white">
              <div class="card-body">
                <h5 class="card-title">{{ currentQueueNumber }}</h5>
                <p class="card-text">Next Queue #</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Queue Table -->
        <div class="card">
          <div class="card-header">
            <h4>Current Queue</h4>
          </div>
          <div class="card-body">
            <div v-if="currentQueue.length === 0" class="text-center py-4">
              <p class="text-muted">No patients currently in queue</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Queue #</th>
                    <th>Name</th>
                    <th>National ID</th>
                    <th>Symptoms</th>
                    <th>Check-in Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="patient in currentQueue" :key="patient.id">
                    <td>
                      <span class="badge bg-primary">#{{ patient.queueNumber }}</span>
                    </td>
                    <td>{{ patient.name }}</td>
                    <td>{{ maskNationalID(patient.nationalID) }}</td>
                    <td>
                      <span v-if="patient.symptoms.length === 0" class="text-muted">None</span>
                      <div v-else>
                        <span v-for="symptom in patient.symptoms.slice(0, 2)" :key="symptom" 
                              class="badge bg-secondary me-1">
                          {{ symptom }}
                        </span>
                        <span v-if="patient.symptoms.length > 2" class="badge bg-secondary">
                          +{{ patient.symptoms.length - 2 }}
                        </span>
                      </div>
                    </td>
                    <td>{{ formatTime(patient.checkInTime) }}</td>
                    <td>
                      <span class="badge bg-warning">Waiting</span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button @click="registerPatient(patient.id)" 
                                class="btn btn-success"
                                title="Register Patient">
                          ✓
                        </button>
                        <button @click="removePatient(patient.id)" 
                                class="btn btn-danger"
                                title="Remove from Queue">
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Registered Patients Table -->
        <div class="card mt-4">
          <div class="card-header">
            <h4>Registered Patients</h4>
          </div>
          <div class="card-body">
            <div v-if="registeredPatients.length === 0" class="text-center py-4">
              <p class="text-muted">No registered patients</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Queue #</th>
                    <th>Name</th>
                    <th>National ID</th>
                    <th>Symptoms</th>
                    <th>Check-in Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="patient in registeredPatients" :key="patient.id">
                    <td>
                      <span class="badge bg-success">#{{ patient.queueNumber }}</span>
                    </td>
                    <td>{{ patient.name }}</td>
                    <td>{{ maskNationalID(patient.nationalID) }}</td>
                    <td>
                      <span v-if="patient.symptoms.length === 0" class="text-muted">None</span>
                      <div v-else>
                        <span v-for="symptom in patient.symptoms.slice(0, 2)" :key="symptom" 
                              class="badge bg-secondary me-1">
                          {{ symptom }}
                        </span>
                        <span v-if="patient.symptoms.length > 2" class="badge bg-secondary">
                          +{{ patient.symptoms.length - 2 }}
                        </span>
                      </div>
                    </td>
                    <td>{{ formatTime(patient.checkInTime) }}</td>
                    <td>
                      <span class="badge bg-success">Registered</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePatientStore } from '../stores/patientStore'

const patientStore = usePatientStore()

// Computed properties from store
const { 
  navigationItems, 
  totalPatients, 
  currentQueue, 
  registeredPatients, 
  currentQueueNumber 
} = patientStore

// Event handler functions
const registerPatient = (patientId: string) => {
  if (confirm('Are you sure you want to register this patient?')) {
    patientStore.registerPatient(patientId)
  }
}

const removePatient = (patientId: string) => {
  if (confirm('Are you sure you want to remove this patient from the queue?')) {
    patientStore.removePatient(patientId)
  }
}

const refreshQueue = () => {
  // In a real application, this would fetch fresh data from the server
  console.log('Queue refreshed')
}

// Utility functions
const maskNationalID = (nationalID: string) => {
  if (nationalID.length <= 4) return nationalID
  return nationalID.substring(0, 2) + '*'.repeat(nationalID.length - 4) + nationalID.substring(nationalID.length - 2)
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString()
}

// Lifecycle hook
onMounted(() => {
  console.log('Queue status component mounted')
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
  border-radius: 8px;
  margin: 0.2rem 0;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(79, 209, 197, 0.2);
  color: var(--secondary-color);
  transform: translateX(4px);
}

.nav-link.router-link-active {
  background-color: rgba(79, 209, 197, 0.3);
  color: var(--secondary-color);
  font-weight: 600;
  border-left: 3px solid var(--secondary-color);
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
}

.badge {
  font-size: 0.8em;
  padding: 0.5em 0.8em;
  border-radius: 6px;
  font-weight: 500;
}

/* Statistics cards */
.card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

.card-header {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border: none;
  font-weight: 600;
}

/* Statistics card styling */
.card.text-center {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border: 2px solid rgba(79, 209, 197, 0.2);
}

.card.text-center.bg-warning {
  background: linear-gradient(135deg, rgba(237, 137, 54, 0.9), rgba(221, 107, 32, 0.9));
  color: white;
}

.card.text-center.bg-success {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.9), rgba(56, 161, 105, 0.9));
  color: white;
}

.card.text-center.bg-info {
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.9), rgba(49, 130, 206, 0.9));
  color: white;
}

/* Table styling */
.table {
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.table thead th {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table tbody tr:hover {
  background-color: rgba(79, 209, 197, 0.1);
  transition: background-color 0.3s ease;
}

.table tbody tr {
  transition: all 0.3s ease;
}

/* Badge colors */
.badge.bg-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color)) !important;
}

.badge.bg-warning {
  background: linear-gradient(135deg, var(--warning-color), #dd6b20) !important;
}

.badge.bg-success {
  background: linear-gradient(135deg, var(--success-color), #38a169) !important;
}

.badge.bg-secondary {
  background: linear-gradient(135deg, #718096, #4a5568) !important;
}

/* Button styling */
.btn-group-sm .btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-group-sm .btn:hover {
  transform: scale(1.05);
}

/* Animation for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

/* Empty state styling */
.text-muted {
  color: #718096 !important;
  font-style: italic;
}

/* Responsive improvements */
@media (max-width: 767.98px) {
  .sidebar {
    position: static;
    height: auto;
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-radius: 12px;
  }
  
  .table-responsive {
    max-height: 300px;
  }
  
  .card {
    margin-bottom: 1rem;
  }
}
</style>
