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
          <h1 class="h2">Patient Check-In</h1>
          <div v-if="currentPatient" class="alert alert-info">
            Queue Number: #{{ currentPatient.queueNumber }}
          </div>
        </div>

        <!-- Registration Form -->
        <div v-if="!isRegistered" class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <div class="header-icon me-3">
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=40&h=40&fit=crop&crop=center" 
                       alt="Registration Icon" class="header-image" />
                </div>
                <div>
                  <h4 class="mb-0">Patient Information</h4>
                  <small class="text-white-50">Please fill in your details</small>
                </div>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitCheckIn">
                  <!-- Name Input -->
                  <div class="mb-3">
                    <label for="name" class="form-label">Full Name</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="form-control"
                      id="name"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <!-- Email Input -->
                  <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="form-control"
                      id="email"
                      required
                      placeholder="Enter your email address"
                      :class="{ 'is-invalid': errors.email }"
                    />
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                    <small class="form-text text-muted">We'll send check-in confirmation to this email</small>
                  </div>

                  <!-- National ID Input -->
                  <div class="mb-3">
                    <label for="nationalID" class="form-label">National ID</label>
                    <input
                      v-model="formData.nationalID"
                      type="text"
                      class="form-control"
                      id="nationalID"
                      required
                      placeholder="Enter your national ID"
                      :class="{ 'is-invalid': errors.nationalID }"
                    />
                    <div v-if="errors.nationalID" class="invalid-feedback">
                      {{ errors.nationalID }}
                    </div>
                  </div>

                  <!-- Symptoms Selection -->
                  <div class="mb-3">
                    <label class="form-label">Select Symptoms (choose all that apply)</label>
                    <div class="row">
                      <div v-for="symptom in availableSymptoms" :key="symptom" class="col-md-6 mb-2">
                        <div class="form-check">
                          <input
                            v-model="formData.symptoms"
                            :value="symptom"
                            type="checkbox"
                            class="form-check-input"
                            :id="`symptom-${symptom}`"
                          />
                          <label class="form-check-label" :for="`symptom-${symptom}`">
                            {{ symptom }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Alert Messages -->
                  <div v-if="alertMessage" :class="`alert alert-${alertType}`" role="alert">
                    {{ alertMessage }}
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                      <span v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </span>
                      <span v-else>Submit Check-In</span>
                    </button>
                    <button type="button" class="btn btn-secondary" @click="cancelRegistration">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Health Guide Game Component -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <div class="header-icon me-3">
                  <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=40&h=40&fit=crop&crop=center" 
                       alt="Health Guide Icon" class="header-image" />
                </div>
                <div>
                  <h5 class="mb-0">Digital Health Guide</h5>
                  <small class="text-white-50">Your virtual assistant</small>
                </div>
              </div>
              <div class="card-body">
                <div class="health-guide-game">
                  <div class="game-status">
                    <p>Guide Status: <span :class="gameStatus.class">{{ gameStatus.text }}</span></p>
                  </div>
                  <div class="game-actions">
                    <button @click="interactWithGuide" class="btn btn-sm btn-outline-primary mb-2">
                      Talk to Guide
                    </button>
                    <button @click="resetGuide" class="btn btn-sm btn-outline-secondary">
                      Reset Guide
                    </button>
                  </div>
                  <div v-if="guideMessage" class="alert alert-info mt-3">
                    {{ guideMessage }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Queue Status View -->
        <div v-else class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header bg-success d-flex align-items-center">
                <div class="header-icon me-3">
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=40&h=40&fit=crop&crop=center" 
                       alt="Success Icon" class="header-image" />
                </div>
                <div>
                  <h4 class="mb-0">✓ Registration Successful</h4>
                  <small class="text-white-50">You are now in the queue</small>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h5>Your Information</h5>
                    <p><strong>Name:</strong> {{ currentPatient?.name }}</p>
                    <p><strong>Queue Number:</strong> #{{ currentPatient?.queueNumber }}</p>
                    <p><strong>Check-in Time:</strong> {{ formatTime(currentPatient?.checkInTime) }}</p>
                    <p><strong>Symptoms:</strong> {{ currentPatient?.symptoms.join(', ') || 'None' }}</p>
                  </div>
                  <div class="col-md-6">
                    <h5>Current Queue Status</h5>
                    <p><strong>Patients ahead:</strong> {{ getPatientsAhead() }}</p>
                    <p><strong>Estimated wait:</strong> {{ getEstimatedWaitTime() }}</p>
                    <button @click="viewFullQueue" class="btn btn-primary mt-2">
                      View Full Queue
                    </button>
                  </div>
                </div>
                <div class="mt-3">
                  <button @click="resetRegistration" class="btn btn-secondary">
                    New Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patientStore'

const router = useRouter()
const patientStore = usePatientStore()

// Reactive variables for data binding
const formData = reactive({
  name: '',
  email: '',
  nationalID: '',
  symptoms: [] as string[]
})

const errors = reactive({
  nationalID: '',
  email: ''
})

const alertMessage = ref('')
const alertType = ref<'success' | 'danger' | 'warning' | 'info'>('info')
const isSubmitting = ref(false)

// Health guide game state
const gameStatus = ref({ text: 'Ready', class: 'text-success' })
const guideMessage = ref('')

// Computed properties from store
const { navigationItems, availableSymptoms, isRegistered, currentPatient } = patientStore

// Form validation function
const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  errors.nationalID = ''
  errors.email = ''
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate National ID
  if (!formData.nationalID.trim()) {
    errors.nationalID = 'National ID is required'
    isValid = false
  } else if (!patientStore.validateNationalID(formData.nationalID)) {
    errors.nationalID = 'National ID must be at least 8 digits'
    isValid = false
  }
  
  // Validate name
  if (!formData.name.trim()) {
    alertMessage.value = 'Name is required'
    alertType.value = 'danger'
    isValid = false
  }
  
  return isValid
}

// Email notification function
const sendEmailNotification = async (patient: any) => {
  try {
    // Create email content
    const emailContent = {
      to: 'mugishaelisee54@gmail.com', // Your Gmail address for receiving check-in notifications
      subject: `New Patient Check-In - ${patient.name} - Mahoko Clinic`,
      body: `
        New patient check-in details:
        
        Name: ${patient.name}
        Email: ${patient.email}
        National ID: ${patient.nationalID}
        Queue Number: #${patient.queueNumber}
        Check-in Time: ${new Date().toLocaleString()}
        Symptoms: ${patient.symptoms.join(', ') || 'None specified'}
        
        Please check the clinic management system for more details.
      `,
      patientEmail: patient.email
    }
    
    // For demo purposes, we'll simulate sending email
    // In production, you would integrate with an email service like:
    // - EmailJS (for frontend-only solution)
    // - Gmail API (requires backend setup)
    // - SendGrid, Mailgun, etc.
    
    console.log('Email notification sent:', emailContent)
    
    // Show notification to user
    alertMessage.value = `Check-in successful! Confirmation sent to ${patient.email}`
    
    // Store notification in localStorage for demo
    const notifications = JSON.parse(localStorage.getItem('clinicNotifications') || '[]')
    notifications.push({
      ...emailContent,
      timestamp: new Date().toISOString(),
      id: Date.now()
    })
    localStorage.setItem('clinicNotifications', JSON.stringify(notifications))
    
  } catch (error) {
    console.error('Failed to send email notification:', error)
    alertMessage.value = 'Check-in successful, but email notification failed.'
  }
}

// Event handler functions
const submitCheckIn = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  alertMessage.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add patient to store
    const newPatient = patientStore.addPatient({
      name: formData.name,
      email: formData.email,
      nationalID: formData.nationalID,
      symptoms: formData.symptoms
    })
    
    // Send email notification
    await sendEmailNotification(newPatient)
    
    // Show success message
    alertMessage.value = 'Check-in successful! You are now in the queue.'
    alertType.value = 'success'
    
    // Reset form
    Object.assign(formData, { name: '', email: '', nationalID: '', symptoms: [] })
    
  } catch (error) {
    alertMessage.value = 'An error occurred during check-in. Please try again.'
    alertType.value = 'danger'
  } finally {
    isSubmitting.value = false
  }
}

const cancelRegistration = () => {
  if (confirm('Are you sure you want to cancel the registration?')) {
    Object.assign(formData, { name: '', nationalID: '', symptoms: [] })
    alertMessage.value = 'Registration cancelled'
    alertType.value = 'warning'
  }
}

// Health guide game functions
const interactWithGuide = () => {
  const interactions = [
    'Welcome to our clinic! Please fill out the check-in form.',
    'Make sure to provide accurate information for better service.',
    'If you have multiple symptoms, please select all that apply.',
    'Your queue number will be assigned after successful registration.',
    'Please wait patiently for your turn. We appreciate your cooperation.'
  ]
  
  const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)]
  guideMessage.value = randomInteraction
  
  // Update game status based on interaction
  if (formData.name && formData.nationalID) {
    gameStatus.value = { text: 'Helping', class: 'text-primary' }
  } else {
    gameStatus.value = { text: 'Waiting', class: 'text-warning' }
  }
  
  setTimeout(() => {
    gameStatus.value = { text: 'Ready', class: 'text-success' }
  }, 3000)
}

const resetGuide = () => {
  gameStatus.value = { text: 'Ready', class: 'text-success' }
  guideMessage.value = ''
}

// Utility functions
const formatTime = (date: Date | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString()
}

const getPatientsAhead = () => {
  if (!currentPatient) return 0
  return patientStore.currentQueue.findIndex(p => p.id === currentPatient.id)
}

const getEstimatedWaitTime = () => {
  const patientsAhead = getPatientsAhead()
  const estimatedMinutes = patientsAhead * 10 // 10 minutes per patient
  return `${estimatedMinutes} minutes`
}

const viewFullQueue = () => {
  router.push('/queue-status')
}

const resetRegistration = () => {
  patientStore.resetRegistration()
  Object.assign(formData, { name: '', nationalID: '', symptoms: [] })
  alertMessage.value = ''
}

// Lifecycle hook
onMounted(() => {
  console.log('Check-in component mounted')
  // Initialize any required data
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

.health-guide-game {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(79, 209, 197, 0.1), rgba(56, 178, 172, 0.1));
  border-radius: 12px;
  border: 2px solid rgba(79, 209, 197, 0.3);
}

.game-status {
  margin-bottom: 1rem;
  font-weight: 600;
}

.game-status .text-success {
  color: var(--success-color) !important;
}

.game-status .text-primary {
  color: var(--info-color) !important;
}

.game-status .text-warning {
  color: var(--warning-color) !important;
}

.game-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-check-input:checked {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.form-check-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(56, 178, 172, 0.25);
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Header image styling */
.header-icon {
  display: flex;
  align-items: center;
}

.header-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

/* Fade in animation for form */
.card {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom alert styling */
.alert {
  border: none;
  border-radius: 8px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Success message styling */
.card-header.bg-success {
  background: linear-gradient(135deg, var(--success-color), #38a169) !important;
}

/* Queue number badge */
.alert-info {
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(79, 209, 197, 0.1));
  color: var(--primary-color);
  border-left: 4px solid var(--info-color);
  font-weight: 600;
}

@media (max-width: 767.98px) {
  .sidebar {
    position: static;
    height: auto;
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-radius: 12px;
  }
}
</style>
