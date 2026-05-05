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
          <h1 class="h2">Help & Support</h1>
        </div>

        <!-- Help Categories -->
        <div class="row">
          <div class="col-md-4 mb-4" v-for="category in helpCategories" :key="category.id">
            <div class="card h-100">
              <div class="card-header">
                <h5>{{ category.icon }} {{ category.title }}</h5>
              </div>
              <div class="card-body">
                <p>{{ category.description }}</p>
                <button @click="expandCategory(category.id)" class="btn btn-primary">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Category Content -->
        <div v-if="expandedCategory" class="card mt-4">
          <div class="card-header">
            <h4>{{ getCategoryDetails(expandedCategory).icon }} {{ getCategoryDetails(expandedCategory).title }}</h4>
          </div>
          <div class="card-body">
            <div v-html="getCategoryDetails(expandedCategory).content"></div>
            <button @click="expandedCategory = null" class="btn btn-secondary mt-3">
              Close
            </button>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="card mt-4">
          <div class="card-header">
            <h4>Frequently Asked Questions</h4>
          </div>
          <div class="card-body">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item" v-for="(faq, index) in faqs" :key="faq.id">
                <h2 class="accordion-header" :id="`heading${faq.id}`">
                  <button class="accordion-button collapsed" type="button" 
                          data-bs-toggle="collapse" :data-bs-target="`#collapse${faq.id}`">
                    {{ faq.question }}
                  </button>
                </h2>
                <div :id="`collapse${faq.id}`" class="accordion-collapse collapse" 
                     :aria-labelledby="`heading${faq.id}`" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="card mt-4">
          <div class="card-header">
            <h4>Contact Support</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>Get in Touch</h5>
                <p>Our support team is available to help you with any questions or issues.</p>
                <ul class="list-unstyled">
                  <li><strong>Phone:</strong> +1-234-567-8900</li>
                  <li><strong>Email:</strong> support@clinic.com</li>
                  <li><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h5>Emergency Support</h5>
                <p>For urgent medical emergencies, please call emergency services immediately.</p>
                <div class="alert alert-danger">
                  <strong>Emergency: 911</strong>
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
import { ref } from 'vue'
import { usePatientStore } from '../stores/patientStore'

const patientStore = usePatientStore()
const { navigationItems } = patientStore

const expandedCategory = ref<string | null>(null)

// Help categories data
const helpCategories = [
  {
    id: 'checkin',
    title: 'Check-In Process',
    icon: '🏥',
    description: 'Learn how to complete the digital check-in process'
  },
  {
    id: 'queue',
    title: 'Queue Management',
    icon: '⏱️',
    description: 'Understanding queue status and wait times'
  },
  {
    id: 'symptoms',
    title: 'Symptoms Guide',
    icon: '🩺',
    description: 'How to accurately report your symptoms'
  },
  {
    id: 'profile',
    title: 'Profile Management',
    icon: '👤',
    description: 'Manage your patient profile and information'
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: '💻',
    description: 'Troubleshooting technical issues'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: '🔒',
    description: 'How we protect your personal information'
  }
]

// FAQ data
const faqs = [
  {
    id: 'faq1',
    question: 'How do I start the check-in process?',
    answer: 'Click on the "Check-in" link in the navigation menu, then fill out the registration form with your personal information and symptoms.'
  },
  {
    id: 'faq2',
    question: 'What information do I need for check-in?',
    answer: 'You will need your full name, national ID (at least 8 digits), and information about any symptoms you are experiencing.'
  },
  {
    id: 'faq3',
    question: 'How is my queue number determined?',
    answer: 'Queue numbers are assigned sequentially based on the order of check-in. The first patient gets queue #1, the second gets #2, and so on.'
  },
  {
    id: 'faq4',
    question: 'Can I cancel my registration?',
    answer: 'Yes, you can cancel your registration from your profile page or by clicking the cancel button during the check-in process.'
  },
  {
    id: 'faq5',
    question: 'How long is the typical wait time?',
    answer: 'Wait times vary based on the number of patients ahead of you. Each patient appointment is estimated to take approximately 10 minutes.'
  }
]

// Category content details
const categoryContent: Record<string, { icon: string; title: string; content: string }> = {
  checkin: {
    icon: '🏥',
    title: 'Check-In Process',
    content: `
      <h5>Step-by-Step Check-In Guide</h5>
      <ol>
        <li><strong>Navigate to Check-In:</strong> Click on "Check-in" in the sidebar menu</li>
        <li><strong>Enter Personal Information:</strong> Fill in your full name and national ID</li>
        <li><strong>Select Symptoms:</strong> Choose all symptoms that apply to your condition</li>
        <li><strong>Submit Form:</strong> Review your information and click "Submit Check-In"</li>
        <li><strong>Receive Queue Number:</strong> You will be assigned a queue number automatically</li>
      </ol>
      <h5>Tips for Smooth Check-In</h5>
      <ul>
        <li>Have your national ID ready before starting</li>
        <li>Be honest about all symptoms for better care</li>
        <li>Double-check your information before submitting</li>
      </ul>
    `
  },
  queue: {
    icon: '⏱️',
    title: 'Queue Management',
    content: `
      <h5>Understanding Queue Status</h5>
      <p>The queue system helps manage patient flow and reduce wait times.</p>
      <h6>Queue Status Indicators:</h6>
      <ul>
        <li><span class="badge bg-warning">Waiting</span> - Patient is in the queue waiting to be registered</li>
        <li><span class="badge bg-success">Registered</span> - Patient has been registered and is being processed</li>
      </ul>
      <h5>Estimated Wait Times</h5>
      <p>Wait times are calculated based on:</p>
      <ul>
        <li>Number of patients ahead of you</li>
        <li>Average consultation time (10 minutes per patient)</li>
        <li>Current clinic capacity</li>
      </ul>
    `
  },
  symptoms: {
    icon: '🩺',
    title: 'Symptoms Guide',
    content: `
      <h5>How to Report Symptoms</h5>
      <p>Accurate symptom reporting helps our medical staff provide better care.</p>
      <h6>Available Symptoms:</h6>
      <ul>
        <li><strong>Fever:</strong> Elevated body temperature</li>
        <li><strong>Cough:</strong> Persistent coughing</li>
        <li><strong>Headache:</strong> Pain or discomfort in the head</li>
        <li><strong>Fatigue:</strong> Unusual tiredness or lack of energy</li>
        <li><strong>Nausea:</strong> Feeling sick to your stomach</li>
        <li><strong>Dizziness:</strong> Feeling lightheaded or unsteady</li>
        <li><strong>Chest Pain:</strong> Discomfort or pain in the chest area</li>
        <li><strong>Shortness of Breath:</strong> Difficulty breathing</li>
      </ul>
      <p><strong>Note:</strong> Select all symptoms that apply to your current condition.</p>
    `
  },
  profile: {
    icon: '👤',
    title: 'Profile Management',
    content: `
      <h5>Managing Your Profile</h5>
      <p>Your profile contains your registration information and current status.</p>
      <h6>Profile Features:</h6>
      <ul>
        <li>View your current registration details</li>
        <li>Check your queue status and position</li>
        <li>Print your registration information</li>
        <li>Cancel your registration if needed</li>
        <li>Access clinic contact information</li>
      </ul>
      <h6>Privacy Protection:</h6>
      <p>Your national ID is partially masked for privacy protection in the display.</p>
    `
  },
  technical: {
    icon: '💻',
    title: 'Technical Support',
    content: `
      <h5>Common Technical Issues</h5>
      <h6>Form Submission Problems:</h6>
      <ul>
        <li>Ensure all required fields are filled</li>
        <li>Check that your national ID contains only numbers</li>
        <li>Verify your internet connection is stable</li>
      </ul>
      <h6>Display Issues:</h6>
      <ul>
        <li>Try refreshing the page</li>
        <li>Clear your browser cache</li>
        <li>Use a modern web browser (Chrome, Firefox, Safari, Edge)</li>
      </ul>
      <h6>Performance Tips:</h6>
      <ul>
        <li>Close unnecessary browser tabs</li>
        <li>Ensure your browser is up to date</li>
        <li>Check your internet speed</li>
      </ul>
    `
  },
  privacy: {
    icon: '🔒',
    title: 'Privacy & Security',
    content: `
      <h5>Your Privacy Matters</h5>
      <p>We take your privacy seriously and implement multiple security measures.</p>
      <h6>Data Protection:</h6>
      <ul>
        <li>National IDs are masked in displays</li>
        <li>Data is stored securely on local systems</li>
        <li>Information is used only for medical purposes</li>
        <li>Regular security audits are conducted</li>
      </ul>
      <h6>Your Rights:</h6>
      <ul>
        <li>Access to your personal information</li>
        <li>Ability to correct inaccurate data</li>
        <li>Right to delete your information</li>
        <li>Control over data sharing preferences</li>
      </ul>
      <p><strong>Contact us</strong> if you have privacy concerns or questions about data handling.</p>
    `
  }
}

// Event handlers
const expandCategory = (categoryId: string) => {
  expandedCategory.value = expandedCategory.value === categoryId ? null : categoryId
}

const getCategoryDetails = (categoryId: string) => {
  return categoryContent[categoryId] || { icon: '❓', title: 'Unknown', content: 'Category not found' }
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

/* Help category cards */
.card.h-100 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border: 2px solid rgba(79, 209, 197, 0.2);
}

.card.h-100:hover {
  border-color: rgba(79, 209, 197, 0.4);
}

/* Accordion styling */
.accordion-item {
  border: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.accordion-button {
  background: linear-gradient(135deg, rgba(79, 209, 197, 0.1), rgba(56, 178, 172, 0.1));
  color: var(--primary-color);
  font-weight: 600;
  border: none;
}

.accordion-button:not(.collapsed) {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-body {
  background: rgba(255, 255, 255, 0.9);
}

/* Contact support styling */
.alert-danger {
  background: linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(229, 62, 62, 0.1));
  color: var(--danger-color);
  border-left: 4px solid var(--danger-color);
  border: none;
  font-weight: 600;
}

/* Button styling */
.btn {
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

/* Category content styling */
.card-body h5 {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-body h6 {
  color: var(--accent-color);
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.card-body ul {
  padding-left: 1.2rem;
}

.card-body li {
  margin-bottom: 0.3rem;
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
</style>
