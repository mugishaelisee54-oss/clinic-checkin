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
          <h1 class="h2">My Profile</h1>
        </div>

        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h4>Patient Profile</h4>
              </div>
              <div class="card-body">
                <div v-if="!currentPatient" class="text-center py-4">
                  <p class="text-muted">No active registration found</p>
                  <router-link to="/check-in" class="btn btn-primary">
                    Start Check-In
                  </router-link>
                </div>
                <div v-else>
                  <div class="row">
                    <div class="col-md-6">
                      <h5>Personal Information</h5>
                      <p><strong>Full Name:</strong> {{ currentPatient.name }}</p>
                      <p><strong>National ID:</strong> {{ maskNationalID(currentPatient.nationalID) }}</p>
                      <p><strong>Queue Number:</strong> #{{ currentPatient.queueNumber }}</p>
                      <p><strong>Check-in Time:</strong> {{ formatDateTime(currentPatient.checkInTime) }}</p>
                    </div>
                    <div class="col-md-6">
                      <h5>Medical Information</h5>
                      <p><strong>Reported Symptoms:</strong></p>
                      <div v-if="currentPatient.symptoms.length === 0" class="text-muted">
                        No symptoms reported
                      </div>
                      <div v-else>
                        <span v-for="symptom in currentPatient.symptoms" :key="symptom" 
                              class="badge bg-info me-2 mb-2">
                          {{ symptom }}
                        </span>
                      </div>
                      <p class="mt-3"><strong>Status:</strong></p>
                      <span :class="getStatusBadgeClass(currentPatient.isRegistered)">
                        {{ getStatusText(currentPatient.isRegistered) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <router-link to="/check-in" class="btn btn-primary">
                    New Check-In
                  </router-link>
                  <router-link to="/queue-status" class="btn btn-outline-primary">
                    View Queue Status
                  </router-link>
                  <button @click="printProfile" class="btn btn-outline-secondary">
                    Print Profile
                  </button>
                  <button v-if="currentPatient" @click="cancelRegistration" class="btn btn-outline-danger">
                    Cancel Registration
                  </button>
                </div>
              </div>
            </div>

            <div class="card mt-3">
              <div class="card-header">
                <h5>Clinic Information</h5>
              </div>
              <div class="card-body">
                <p><strong>Operating Hours:</strong></p>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
                <hr>
                <p><strong>Contact:</strong></p>
                <p>📞 +1-234-567-8900</p>
                <p>📧 info@clinic.com</p>
                <p>📍 123 Healthcare Street</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patientStore'

const router = useRouter()
const patientStore = usePatientStore()

// Computed properties from store
const { navigationItems, currentPatient } = patientStore

// Event handler functions
const printProfile = () => {
  window.print()
}

const cancelRegistration = () => {
  if (currentPatient && confirm('Are you sure you want to cancel your registration?')) {
    patientStore.removePatient(currentPatient.id)
    patientStore.resetRegistration()
  }
}

// Utility functions
const maskNationalID = (nationalID: string) => {
  if (nationalID.length <= 4) return nationalID
  return nationalID.substring(0, 2) + '*'.repeat(nationalID.length - 4) + nationalID.substring(nationalID.length - 2)
}

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString()
}

const getStatusBadgeClass = (isRegistered: boolean) => {
  return isRegistered ? 'badge bg-success' : 'badge bg-warning'
}

const getStatusText = (isRegistered: boolean) => {
  return isRegistered ? 'Registered' : 'In Queue'
}
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

.badge {
  font-size: 0.8em;
  padding: 0.5em 0.8em;
  border-radius: 6px;
  font-weight: 500;
}

/* Badge colors */
.badge.bg-info {
  background: linear-gradient(135deg, var(--info-color), #3182ce) !important;
}

.badge.bg-success {
  background: linear-gradient(135deg, var(--success-color), #38a169) !important;
}

/* Card styling */
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

/* Button styling */
.d-grid .btn {
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.d-grid .btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

/* Clinic info card */
.card:last-child {
  background: linear-gradient(135deg, rgba(79, 209, 197, 0.1), rgba(56, 178, 172, 0.1));
  border: 2px solid rgba(79, 209, 197, 0.3);
}

/* Animation */
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

/* Empty state */
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
  
  .card {
    margin-bottom: 1rem;
  }
}

@media print {
  .sidebar {
    display: none;
  }
  
  main {
    margin-left: 0 !important;
  }
  
  .btn {
    display: none;
  }
}
</style>
