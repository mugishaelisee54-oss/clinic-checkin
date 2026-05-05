<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'

// Search functionality
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedLanguage = ref('en')

// Language functionality
const currentLanguage = ref('en')

const translations = {
  en: {
    clinicName: 'Mahoko Clinic',
    tagline: 'Quality Healthcare for All',
    welcome: 'Welcome to Mahoko Clinic',
    subtitle: 'Your trusted healthcare partner in Rubavu District, providing quality medical care with compassion and excellence.',
    checkInNow: 'Check-In Now',
    bookAppointment: 'Book Appointment',
    services: 'Services',
    gallery: 'Gallery',
    location: 'Location',
    doctors: 'Doctors',
    appointment: 'Appointment',
    emergency: 'Emergency',
    about: 'About',
    contact: 'Contact'
  },
  fr: {
    clinicName: 'Clinique Mahoko',
    tagline: 'Soins de Santé de Qualité pour Tous',
    welcome: 'Bienvenue à la Clinique Mahoko',
    subtitle: 'Votre partenaire de confiance en matière de santé dans le district de Rubavu, fournissant des soins médicaux de qualité avec compassion et excellence.',
    checkInNow: 'Enregistrement Maintenant',
    bookAppointment: 'Prendre Rendez-vous',
    services: 'Services',
    gallery: 'Galerie',
    location: 'Localisation',
    doctors: 'Médecins',
    appointment: 'Rendez-vous',
    emergency: 'Urgence',
    about: 'À Propos',
    contact: 'Contact'
  },
  rw: {
    clinicName: 'Kliniku ya Mahoko',
    tagline: 'Serivisi za Ubuvuzi bwiza kuri Buri wese',
    welcome: 'Murakaza neza kuri Kliniku ya Mahoko',
    subtitle: 'Umufasha wanyu wubuvuzi mu Karere ka Rubavu, ukora serivisi nziza zubuvuzi nubwitizo nubunyangamugayo.',
    checkInNow: 'Iyandikishe Nonaha',
    bookAppointment: 'Shaka Umunsi wo Kugenda',
    services: 'Serivisi',
    gallery: 'Galeri',
    location: 'Ahantu',
    doctors: 'Abaganga',
    appointment: 'Umunsi wo Kugenda',
    emergency: 'Ubukungu',
    about: 'Ibyerekeye',
    contact: 'Twandikire'
  }
}

const changeLanguage = () => {
  // Save language preference to localStorage
  localStorage.setItem('selectedLanguage', currentLanguage.value)
  // In a real app, you would update all UI text here
  console.log('Language changed to:', currentLanguage.value)
}

// Load saved language on component mount
const savedLanguage = localStorage.getItem('selectedLanguage')
if (savedLanguage) {
  currentLanguage.value = savedLanguage
}

// Modal states
const showEmergency = ref(false)
const showAppointment = ref(false)
const showSignIn = ref(false)

// User authentication state
const isAuthenticated = ref(false)
const currentUser = ref<any>(null)
const showUserMenu = ref(false)

// Appointment data
const appointmentData = reactive({
  department: '',
  date: '',
  time: '',
  description: ''
})

// Search database (simulated)
const searchDatabase = [
  { id: 1, type: 'doctor', title: 'Dr. Sarah Mugisha', description: 'General Medicine Specialist', icon: '👩‍⚕️' },
  { id: 2, type: 'doctor', title: 'Dr. Jean-Pierre Niyongabo', description: 'Pediatrician', icon: '👨‍⚕️' },
  { id: 3, type: 'service', title: 'General Medicine', description: 'Primary healthcare services', icon: '🏥' },
  { id: 4, type: 'service', title: 'Emergency Care', description: '24/7 emergency medical services', icon: '🚨' },
  { id: 5, type: 'service', title: 'Laboratory Services', description: 'Medical tests and diagnostics', icon: '🧪' },
  { id: 6, type: 'service', title: 'Vaccination', description: 'Immunization services', icon: '💉' },
  { id: 7, type: 'symptom', title: 'Fever', description: 'High temperature treatment', icon: '🌡️' },
  { id: 8, type: 'symptom', title: 'Cough', description: 'Respiratory infection treatment', icon: '🤧' },
  { id: 9, type: 'symptom', title: 'Headache', description: 'Pain management and treatment', icon: '🤕' },
  { id: 10, type: 'department', title: 'Maternity', description: 'Pregnancy and childbirth care', icon: '🤱' },
  { id: 11, type: 'department', title: 'Pediatrics', description: 'Children healthcare services', icon: '👶' },
  { id: 12, type: 'department', title: 'Laboratory', description: 'Medical testing facilities', icon: '🔬' }
]

// Search functionality
const performSearch = () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = []
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  searchResults.value = searchDatabase.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query)
  ).slice(0, 5) // Limit to 5 results
}

// Watch search query
const handleSearchInput = () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = []
  } else {
    performSearch()
  }
}

// Select search result
const selectResult = (result: any) => {
  searchQuery.value = result.title
  searchResults.value = []
  // Navigate to appropriate page based on result type
  console.log('Selected:', result)
}

// Modal functions
const showEmergencyModal = () => {
  showEmergency.value = true
}

const closeEmergencyModal = () => {
  showEmergency.value = false
}

const showAppointmentModal = () => {
  showAppointment.value = true
}

const closeAppointmentModal = () => {
  showAppointment.value = false
}

const showSignInModal = () => {
  showSignIn.value = true
}

const closeSignInModal = () => {
  showSignIn.value = false
}

// User authentication functions
const checkAuthStatus = () => {
  const userData = localStorage.getItem('clinicUser') || sessionStorage.getItem('clinicUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
    isAuthenticated.value = true
  }
}

const getUserInitial = () => {
  return currentUser.value?.username?.charAt(0).toUpperCase() || 'U'
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const signOut = () => {
  localStorage.removeItem('clinicUser')
  sessionStorage.removeItem('clinicUser')
  currentUser.value = null
  isAuthenticated.value = false
  showUserMenu.value = false
  // Redirect to sign-in page
  window.location.href = '/sign-in'
}

// Book appointment
const bookAppointment = () => {
  console.log('Appointment booked:', appointmentData)
  // Reset form
  Object.assign(appointmentData, {
    department: '',
    date: '',
    time: '',
    description: ''
  })
  closeAppointmentModal()
  // Show success message
  alert('Appointment booked successfully! We will contact you soon.')
}

// Language change handler
const handleLanguageChange = () => {
  console.log('Language changed to:', selectedLanguage.value)
  // Implement language switching logic
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    searchResults.value = []
  }
  if (!e.target.closest('.user-dropdown')) {
    showUserMenu.value = false
  }
})

// Check authentication status on mount
checkAuthStatus()
</script>

<template>
  <div class="app-container">
    <!-- Clean Header -->
    <header class="app-header">
      <div class="container">
        <div class="row align-items-center">
          <!-- Logo Section -->
          <div class="col-md-4">
            <div class="header-logo">
              <div class="brand-logo-icon">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=40&h=40&fit=crop&crop=center" 
                     alt="Mahoko Clinic Logo" class="logo-image" />
              </div>
              <div class="logo-info">
                <h4 class="logo-title">Mahoko Clinic</h4>
                <small class="logo-tagline">Quality Healthcare for All</small>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="col-md-4">
            <div class="header-contact">
              <p class="contact-phone">📞 0785739323</p>
              <p class="contact-location">📍 Rubavu District, Gisenyi</p>
            </div>
          </div>
          
          <!-- Language Switcher -->
          <div class="col-md-4">
            <div class="language-switcher">
              <select v-model="currentLanguage" @change="changeLanguage" class="language-select">
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="rw">🇷🇼 Kinyarwanda</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Bar with All Links -->
    <nav class="main-nav">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <ul class="nav-list">
              <li><router-link to="/" class="nav-link">Home</router-link></li>
              <li><router-link to="/sign-in" class="nav-link">Sign In</router-link></li>
              <li><router-link to="/check-in" class="nav-link">Check-In</router-link></li>
              <li><router-link to="/queue-status" class="nav-link">Queue Status</router-link></li>
              <li><router-link to="/profile" class="nav-link">Profile</router-link></li>
              <li><router-link to="/help" class="nav-link">Help</router-link></li>
              <li><a href="#services" class="nav-link">Services</a></li>
              <li><a href="#overview" class="nav-link">Overview</a></li>
              <li><a href="#location" class="nav-link">Location</a></li>
              <li><a href="#doctors" class="nav-link">Doctors</a></li>
              <li><a href="#appointment" class="nav-link">Appointment</a></li>
              <li><a href="#emergency" class="nav-link">Emergency</a></li>
              <li><a href="#about" class="nav-link">About</a></li>
              <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Body Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="hero-content">
                <h1 class="hero-title">Welcome to Mahoko Clinic</h1>
                <p class="hero-subtitle">Your trusted healthcare partner in Rubavu District, providing quality medical care with compassion and excellence.</p>
                <div class="hero-buttons">
                  <router-link to="/check-in" class="btn btn-primary">Check-In Now</router-link>
                  <router-link to="/appointment" class="btn btn-outline">Book Appointment</router-link>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="hero-image">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop&crop=center" 
                     alt="Medical Care" class="img-fluid rounded-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="services-section">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h2 class="section-title">Our Medical Services</h2>
              <p class="section-subtitle">Comprehensive healthcare services for your family</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <div class="service-card">
                <div class="service-icon">🏥</div>
                <h4>General Medicine</h4>
                <p>Primary healthcare for all ages</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="service-card">
                <div class="service-icon">🚨</div>
                <h4>Emergency Care</h4>
                <p>24/7 emergency medical services</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="service-card">
                <div class="service-icon">🧪</div>
                <h4>Laboratory</h4>
                <p>Medical tests and diagnostics</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="service-card">
                <div class="service-icon">💉</div>
                <h4>Vaccination</h4>
                <p>Immunization services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Emergency Section -->
      <section id="emergency" class="emergency-section">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="emergency-card">
                <h2 class="emergency-title">🚨 Emergency Services</h2>
                <div class="emergency-numbers">
                  <div class="emergency-item">
                    <h5>General Emergency</h5>
                    <p class="emergency-number">911</p>
                  </div>
                  <div class="emergency-item">
                    <h5>Clinic Emergency</h5>
                    <p class="emergency-number">0785739323</p>
                  </div>
                  <div class="emergency-item">
                    <h5>Ambulance</h5>
                    <p class="emergency-number">912</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <div class="container">
          <div class="row">
            <div class="col-md-3">
              <router-link to="/check-in" class="action-card">
                <div class="action-icon">📋</div>
                <h5>Patient Check-In</h5>
                <p>Register for consultation</p>
              </router-link>
            </div>
            <div class="col-md-3">
              <router-link to="/queue-status" class="action-card">
                <div class="action-icon">⏱️</div>
                <h5>Queue Status</h5>
                <p>View current queue</p>
              </router-link>
            </div>
            <div class="col-md-3">
              <router-link to="/appointment" class="action-card">
                <div class="action-icon">📅</div>
                <h5>Book Appointment</h5>
                <p>Schedule your visit</p>
              </router-link>
            </div>
            <div class="col-md-3">
              <router-link to="/help" class="action-card">
                <div class="action-icon">❓</div>
                <h5>Help & Support</h5>
                <p>Get assistance</p>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Clinic Overview Section -->
      <section id="overview" class="overview-section">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h2 class="section-title">Mahoko Clinic Services</h2>
              <p class="section-subtitle">Comprehensive healthcare services for our community</p>
            </div>
          </div>
          <div class="row">
            <!-- Service Cards -->
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">🏥</div>
                <h5>General Medicine</h5>
                <p>Primary healthcare and general medical consultations</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">🚨</div>
                <h5>Emergency Care</h5>
                <p>24/7 emergency medical services and urgent care</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">🧪</div>
                <h5>Laboratory</h5>
                <p>Modern diagnostic testing and laboratory services</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">💉</div>
                <h5>Vaccination</h5>
                <p>Immunization services and preventive care</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">📋</div>
                <h5>Patient Check-In</h5>
                <p>Digital registration and queue management</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="service-card">
                <div class="service-icon">💊</div>
                <h5>Pharmacy</h5>
                <p>Medication dispensing and pharmaceutical care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Location Section -->
      <section id="location" class="location-section">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h2 class="section-title">Visit Mahoko Clinic</h2>
              <p class="section-subtitle">Conveniently located in Rubavu District, Gisenyi</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="location-info">
                <h4>Clinic Address</h4>
                <p><strong>Mahoko Clinic</strong></p>
                <p>123 Healthcare Street</p>
                <p>Rubavu District, Gisenyi</p>
                <p>Rwanda</p>
                
                <h4 class="mt-4">Contact Information</h4>
                <p><strong>📞 Phone:</strong> 0785739323</p>
                <p><strong>📧 Email:</strong> mugishaelisee54@gmail.com</p>
                <p><strong>🌐 Website:</strong> www.mahokoclinic.rw</p>
                
                <h4 class="mt-4">Operating Hours</h4>
                <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
                <p><strong>Emergency:</strong> 24/7 Available</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="map-container">
                <iframe 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=29.2477%2C-1.6833%2C29.2677%2C-1.6633&layer=mapnik&marker=-1.6733%2C29.2577" 
                  width="100%" 
                  height="400" 
                  frameborder="0" 
                  style="border: 0; border-radius: 12px;"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- Simple Footer -->
    <footer class="app-footer">
      <div class="container-fluid">
        <div class="row">
          <!-- Clinic Info Section -->
          <div class="col-md-4">
            <div class="footer-section">
              <div class="clinic-logo">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&h=80&fit=crop&crop=center" 
                     alt="Mahoko Clinic Logo" class="footer-logo" />
                <h5>Mahoko Clinic</h5>
              </div>
              <p class="footer-description">
                Providing quality healthcare services to the Rubavu District community with compassion and excellence.
              </p>
              <div class="social-links">
                <a href="#" class="social-link" title="Facebook">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384015.png" alt="Facebook" width="24" />
                </a>
                <a href="#" class="social-link" title="Twitter">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384031.png" alt="Twitter" width="24" />
                </a>
                <a href="#" class="social-link" title="Instagram">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384065.png" alt="Instagram" width="24" />
                </a>
                <a href="#" class="social-link" title="LinkedIn">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384023.png" alt="LinkedIn" width="24" />
                </a>
                <a href="#" class="social-link" title="WhatsApp">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384072.png" alt="WhatsApp" width="24" />
                </a>
                <a href="#" class="social-link" title="YouTube">
                  <img src="https://cdn-icons-png.flaticon.com/24/1384/1384049.png" alt="YouTube" width="24" />
                </a>
              </div>
            </div>
          </div>
          
          <!-- Quick Links Section -->
          <div class="col-md-4">
            <div class="footer-section">
              <h6 class="footer-title">Quick Links</h6>
              <ul class="footer-links">
                <li><router-link to="/check-in">Patient Check-In</router-link></li>
                <li><router-link to="/queue-status">Queue Status</router-link></li>
                <li><router-link to="/profile">My Profile</router-link></li>
                <li><router-link to="/help">Help & Support</router-link></li>
              </ul>
            </div>
          </div>
          
          <!-- Location Map Section -->
          <div class="col-md-4">
            <div class="footer-section">
              <h6 class="footer-title">Our Location</h6>
              <div class="map-container">
                <iframe 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=29.2585%2C-1.6845%2C29.2685%2C-1.6745&layer=mapnik&marker=-1.6795%2C29.2635"
                  width="100%" 
                  height="200" 
                  frameborder="0" 
                  style="border: 0; border-radius: 8px;"
                  allowfullscreen>
                </iframe>
              </div>
              <div class="address-info">
                <p><strong>Rubavu District, Gisenyi</strong></p>
                <p>123 Healthcare Street</p>
                <p>Near Gisenyi Market</p>
                <p>📞 0785739323</p>
                <p>📧 info@rwandaclinic.rw</p>
                <p>🌐 www.rwandaclinic.rw</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Copyright Section -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="copyright-section">
              <hr class="footer-divider" />
              <p class="copyright-text">
                © 2024 Mahoko Clinic. All rights reserved. | Designed by <strong>faringa_wa_3</strong>
              </p>
              <p class="copyright-subtext">
                Empowering healthcare in Rubavu District through technology
              </p>
              
              <!-- Medical Website Essential Elements -->
              <div class="medical-essentials mt-4">
                <div class="row">
                  <!-- Emergency Contact -->
                  <div class="col-md-3">
                    <div class="emergency-box">
                      <h6>🚨 Emergency</h6>
                      <p><strong>24/7 Hotline:</strong></p>
                      <p class="emergency-number">911</p>
                      <p><strong>Clinic Emergency:</strong></p>
                      <p class="clinic-emergency">0785739323</p>
                    </div>
                  </div>
                  
                  <!-- Operating Hours -->
                  <div class="col-md-3">
                    <div class="hours-box">
                      <h6>🕐 Operating Hours</h6>
                      <p><strong>Monday - Friday:</strong><br>8:00 AM - 8:00 PM</p>
                      <p><strong>Saturday:</strong><br>9:00 AM - 6:00 PM</p>
                      <p><strong>Sunday:</strong><br>10:00 AM - 4:00 PM</p>
                      <p><strong>Emergency:</strong><br>24/7 Available</p>
                    </div>
                  </div>
                  
                  <!-- Services -->
                  <div class="col-md-3">
                    <div class="services-box">
                      <h6>🏥 Our Services</h6>
                      <ul class="services-list">
                        <li>General Medicine</li>
                        <li>Emergency Care</li>
                        <li>Laboratory Services</li>
                        <li>Vaccination</li>
                        <li>Maternal Health</li>
                        <li>Child Health</li>
                      </ul>
                    </div>
                  </div>
                  
                  <!-- Certifications -->
                  <div class="col-md-3">
                    <div class="certifications-box">
                      <h6>🏆 Certifications</h6>
                      <div class="cert-badges">
                        <span class="cert-badge">Ministry of Health</span>
                        <span class="cert-badge">ISO Certified</span>
                        <span class="cert-badge">WHO Approved</span>
                        <span class="cert-badge">Rwanda Medical Board</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Additional Medical Info -->
                <div class="row mt-3">
                  <div class="col-12">
                    <div class="medical-info-bar">
                      <div class="info-item">
                        <span class="info-icon">💉</span>
                        <span>COVID-19 Vaccination Available</span>
                      </div>
                      <div class="info-item">
                        <span class="info-icon">🧪</span>
                        <span>Laboratory Tests Available</span>
                      </div>
                      <div class="info-item">
                        <span class="info-icon">📋</span>
                        <span>Health Insurance Accepted</span>
                      </div>
                      <div class="info-item">
                        <span class="info-icon">👨‍⚕️</span>
                        <span>Qualified Medical Staff</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Legal & Compliance -->
                <div class="row mt-3">
                  <div class="col-12">
                    <div class="legal-links">
                      <a href="#">Privacy Policy</a>
                      <span class="separator">|</span>
                      <a href="#">Terms of Service</a>
                      <span class="separator">|</span>
                      <a href="#">Patient Rights</a>
                      <span class="separator">|</span>
                      <a href="#">Medical Disclaimer</a>
                      <span class="separator">|</span>
                      <a href="#">Accessibility</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  /* Professional Clinic Brand Colors */
  --primary-color: #0ea5e9;
  --secondary-color: #0284c7;
  --accent-color: #38bdf8;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #06b6d4;
  --light-bg: #ffffff;
  --sidebar-bg: #f0f9ff;
  --sidebar-text: #475569;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --hover-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-container {
  min-height: 100vh;
  background: var(--light-bg);
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2d3748;
}

#app {
  padding-top: 0;
}

/* Custom Bootstrap overrides */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.btn-success {
  background-color: var(--success-color);
  border-color: var(--success-color);
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #38a169;
  border-color: #38a169;
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.btn-warning {
  background-color: var(--warning-color);
  border-color: var(--warning-color);
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background-color: #dd6b20;
  border-color: #dd6b20;
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.btn-danger {
  background-color: var(--danger-color);
  border-color: var(--danger-color);
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #e53e3e;
  border-color: #e53e3e;
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.btn-info {
  background-color: var(--info-color);
  border-color: var(--info-color);
  transition: all 0.3s ease;
}

.btn-info:hover {
  background-color: #3182ce;
  border-color: #3182ce;
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
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

.form-control {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1);
}

.form-control.is-invalid {
  border-color: var(--danger-color);
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
}

.badge {
  padding: 0.5em 0.8em;
  border-radius: 6px;
  font-weight: 500;
}

.alert {
  border: none;
  border-radius: 8px;
  font-weight: 500;
}

.alert-info {
  background-color: rgba(66, 153, 225, 0.1);
  color: var(--info-color);
  border-left: 4px solid var(--info-color);
}

.alert-success {
  background-color: rgba(72, 187, 120, 0.1);
  color: var(--success-color);
  border-left: 4px solid var(--success-color);
}

.alert-warning {
  background-color: rgba(237, 137, 54, 0.1);
  color: var(--warning-color);
  border-left: 4px solid var(--warning-color);
}

.alert-danger {
  background-color: rgba(245, 101, 101, 0.1);
  color: var(--danger-color);
  border-left: 4px solid var(--danger-color);
}

.table {
  border-radius: 8px;
  overflow: hidden;
}

.table thead th {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  font-weight: 600;
}

.table tbody tr:hover {
  background-color: rgba(79, 209, 197, 0.1);
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Custom animations */
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

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Sidebar improvements */
.sidebar {
  background: linear-gradient(180deg, var(--sidebar-bg), #2d3748);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-heading {
  color: var(--sidebar-text);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-link {
  color: var(--sidebar-text);
  border-radius: 8px;
  margin: 0.2rem 0;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
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

/* Page headers */
.h1, .h2 {
  color: var(--primary-color);
  font-weight: 700;
}

.border-bottom {
  border-bottom: 2px solid rgba(79, 209, 197, 0.3) !important;
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

/* Print styles */
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
  
  .app-container {
    background: white !important;
  }
  
  .app-footer {
    display: none;
  }
}

/* Clean Header Styles */
.app-header {
  background: white;
  padding: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.logo-text {
  color: #1f2937;
}

.logo-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
}

.logo-tagline {
  color: #64748b;
  font-size: 0.8rem;
  font-style: italic;
}

.header-nav {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background: #f3f4f6;
}

.nav-link.router-link-active {
  color: var(--primary-color);
  background: #eff6ff;
  font-weight: 600;
}

/* User Authentication Styles */
.btn-sign-in {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-sign-in:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);
}

.user-info {
  position: relative;
}

.user-dropdown {
  position: relative;
}

.user-menu-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-name {
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  z-index: 1000;
  margin-top: 0.5rem;
  overflow: hidden;
}

.user-menu-header {
  padding: 1rem;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  max-width: none;
}

.user-email {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0.5rem 0;
}

.user-menu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #2d3748;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
}

.user-menu-item:hover {
  background: rgba(74, 144, 226, 0.1);
  color: var(--accent-color);
}

.user-menu-item.sign-out {
  color: var(--danger-color);
}

.user-menu-item.sign-out:hover {
  background: rgba(231, 76, 60, 0.1);
  color: var(--danger-color);
}

/* Sign In Modal */
.signin-modal .modal-header {
  background: var(--gradient-primary);
  color: white;
  border-radius: 12px 12px 0 0;
}

.auth-buttons {
  display: flex;
  align-items: center;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.emergency-modal .modal-header {
  border-radius: 12px 12px 0 0;
}

.emergency-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.emergency-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(245, 101, 101, 0.1);
  border-radius: 8px;
  border: 2px solid rgba(245, 101, 101, 0.3);
}

.emergency-item h6 {
  color: var(--danger-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.emergency-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--danger-color);
  margin: 0;
}

.appointment-modal .modal-header {
  border-radius: 12px 12px 0 0;
}

/* Responsive Header */
@media (max-width: 768px) {
  .app-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-logo {
    justify-content: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .nav-menu {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
  }
}
.app-footer {
  background: linear-gradient(135deg, #1a202c, #2d3748);
  color: var(--sidebar-text);
  padding: 3rem 0 1rem;
  margin-top: 3rem;
  border-top: 3px solid var(--accent-color);
}

.footer-section {
  margin-bottom: 2rem;
}

.clinic-logo {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.footer-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1rem;
  border: 3px solid var(--accent-color);
  object-fit: cover;
}

.clinic-logo h5 {
  color: var(--secondary-color);
  margin: 0;
  font-weight: 700;
  font-size: 1.2rem;
}

.footer-description {
  color: #cbd5e0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(79, 209, 197, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.footer-title {
  color: var(--secondary-color);
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #cbd5e0;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--secondary-color);
  transform: translateX(4px);
}

.map-container {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.address-info {
  color: #cbd5e0;
}

.address-info p {
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

.address-info strong {
  color: var(--secondary-color);
}

.footer-divider {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
  margin: 2rem 0 1rem;
}

.copyright-section {
  text-align: center;
}

.copyright-text {
  color: #cbd5e0;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.copyright-text strong {
  color: var(--secondary-color);
  font-weight: 700;
}

.copyright-subtext {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
}

/* Responsive Footer */
@media (max-width: 767.98px) {
  .app-footer {
    padding: 2rem 0 1rem;
  }
  
  .footer-section {
    margin-bottom: 1.5rem;
  }
  
  .clinic-logo {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-logo {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .map-container iframe {
    height: 150px;
  }
}

/* Medical Website Essential Elements Styling */
.medical-essentials {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(79, 209, 197, 0.2);
}

.emergency-box {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(229, 62, 62, 0.1));
  border-radius: 8px;
  border: 2px solid rgba(245, 101, 101, 0.3);
}

.emergency-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--danger-color);
  margin: 0.5rem 0;
}

.clinic-emergency {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--warning-color);
  margin: 0.5rem 0;
}

.hours-box {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(49, 130, 206, 0.1));
  border-radius: 8px;
  border: 2px solid rgba(66, 153, 225, 0.3);
}

.hours-box h6 {
  color: var(--info-color);
  margin-bottom: 1rem;
}

.hours-box p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.services-box {
  padding: 1rem;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.1));
  border-radius: 8px;
  border: 2px solid rgba(72, 187, 120, 0.3);
}

.services-box h6 {
  color: var(--success-color);
  margin-bottom: 1rem;
  text-align: center;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li {
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(72, 187, 120, 0.2);
  font-size: 0.9rem;
}

.services-list li:last-child {
  border-bottom: none;
}

.services-list li::before {
  content: "✓";
  color: var(--success-color);
  font-weight: bold;
  margin-right: 0.5rem;
}

.certifications-box {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(237, 137, 54, 0.1), rgba(221, 107, 32, 0.1));
  border-radius: 8px;
  border: 2px solid rgba(237, 137, 54, 0.3);
}

.certifications-box h6 {
  color: var(--warning-color);
  margin-bottom: 1rem;
}

.cert-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cert-badge {
  background: linear-gradient(135deg, var(--warning-color), #dd6b20);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

.cert-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(237, 137, 54, 0.3);
}

.medical-info-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.info-item:hover {
  color: var(--secondary-color);
  transform: translateY(-2px);
}

.info-icon {
  font-size: 1.2rem;
}

.legal-links {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.legal-links a {
  color: #cbd5e0;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
}

.legal-links a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

.separator {
  color: #718096;
  margin: 0 0.5rem;
}

/* Responsive Medical Essentials */
@media (max-width: 767.98px) {
  .medical-essentials {
    padding: 1rem;
  }
  
  .emergency-box,
  .hours-box,
  .services-box,
  .certifications-box {
    margin-bottom: 1rem;
  }
  
  .medical-info-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .legal-links {
    font-size: 0.8rem;
  }
  
  .legal-links a {
    display: block;
    margin: 0.25rem 0;
  }
  
  .separator {
    display: none;
  }
}

/* Simple Footer Styles */
.app-footer {
  background: #f9fafb;
  padding: 2rem 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 3rem;
}

.footer-text {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.footer-contact {
  color: #9ca3af;
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
}

/* Header Contact and Status Styles */
.header-contact {
  text-align: center;
}

.contact-phone {
  margin: 0;
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.contact-location {
  margin: 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.header-status {
  text-align: center;
}

.status-badge {
  background: var(--success-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.status-hours {
  color: #6b7280;
  font-size: 0.85rem;
  display: block;
}

/* Main Navigation Styles */
.main-navigation {
  background: #f8fafc;
  padding: 3rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.nav-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid #e5e7eb;
}

.nav-section-title {
  color: var(--primary-color);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #eff6ff;
  padding-bottom: 0.5rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: #eff6ff;
  border-color: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.nav-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 40px;
  text-align: center;
}

.nav-content {
  flex: 1;
}

.nav-content h6 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.nav-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .main-navigation {
    padding: 2rem 0;
  }
  
  .nav-section {
    padding: 1rem;
  }
  
  .header-contact,
  .header-status {
    text-align: left;
  }
}

/* Language Switcher Styles */
.language-switcher {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.language-select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  background: white;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-select:hover {
  background: var(--primary-color);
  color: white;
}

.language-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Brand Logo Icon Styles */
.brand-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  border-radius: 12px;
  margin-right: 1rem;
  border: 2px solid var(--accent-color);
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.logo-info {
  flex: 1;
}

/* Navigation Bar Styles */
.main-nav {
  background: var(--sidebar-bg);
  border-bottom: 1px solid #e5e7eb;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-list li {
  margin: 0;
}

.nav-list .nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--sidebar-text);
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.nav-list .nav-link:hover {
  background: var(--primary-color);
  color: white;
}

.nav-list .nav-link.router-link-active {
  background: var(--primary-color);
  color: white;
}

/* Main Content Styles */
.main-content {
  min-height: 60vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 4rem 0;
}

.hero-title {
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

/* Services Section */
.services-section {
  padding: 4rem 0;
  background: white;
}

.section-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #64748b;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.service-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
  border-color: var(--primary-color);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card h4 {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.service-card p {
  color: #64748b;
  margin: 0;
}

/* Emergency Section */
.emergency-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.emergency-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.emergency-title {
  color: var(--danger-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.emergency-numbers {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.emergency-item {
  text-align: center;
}

.emergency-item h5 {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.emergency-number {
  color: var(--danger-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

/* Quick Actions */
.quick-actions {
  padding: 4rem 0;
  background: #f8fafc;
}

.action-card {
  display: block;
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
  border-color: var(--primary-color);
  color: inherit;
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.action-card h5 {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #64748b;
  margin: 0;
}

/* Footer Styles */
.app-footer {
  background: #1f2937;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-section {
  margin-bottom: 2rem;
}

.footer-title {
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.contact-info p,
.hours-info p {
  margin-bottom: 0.5rem;
  color: #d1d5db;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--accent-color);
}

.copyright {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #374151;
  margin-top: 2rem;
}

.copyright p {
  margin: 0;
  color: #9ca3af;
}

/* Service Cards Section */
.overview-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.service-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.service-card h5 {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.service-card p {
  color: #64748b;
  margin: 0;
}

/* Location Section */
.location-section {
  padding: 4rem 0;
  background: white;
}

.location-info {
  padding: 2rem;
}

.location-info h4 {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.location-info p {
  margin-bottom: 0.5rem;
  color: #475569;
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .nav-list {
    flex-direction: column;
    align-items: center;
  }
  
  .emergency-numbers {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .gallery-image {
    height: 200px;
  }
  
  .location-info {
    text-align: center;
  }
  
  .map-container iframe {
    height: 300px;
  }
}
</style>
