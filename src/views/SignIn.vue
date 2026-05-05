<template>
  <div class="signin-container">
    <div class="signin-card">
      <!-- Logo Section -->
      <div class="logo-section">
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=60&h=60&fit=crop&crop=center" 
             alt="Mahoko Clinic Logo" class="clinic-logo" />
        <h2 class="clinic-name">Mahoko Clinic</h2>
        <p class="signin-subtitle">Patient Sign In</p>
      </div>

      <!-- Simple Form -->
      <form @submit.prevent="handleSignIn" class="signin-form">
        <div class="form-group">
          <input
            v-model="signInData.username"
            type="text"
            class="form-input"
            placeholder="Username"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="signInData.email"
            type="email"
            class="form-input"
            placeholder="Email Address"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="signInData.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="Password"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input v-model="signInData.rememberMe" type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <!-- Alert Messages -->
        <div v-if="alertMessage" :class="`alert alert-${alertType}`">
          {{ alertMessage }}
        </div>

        <button type="submit" class="signin-btn" :disabled="isSigningIn">
          <span v-if="isSigningIn">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <div class="signup-link">
          <p>New patient? <router-link to="/check-in">Register here</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const signInData = reactive({
  username: '',
  email: '',
  password: '',
  rememberMe: false
})

// UI state
const showPassword = ref(false)
const isSigningIn = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'danger' | 'warning' | 'info'>('info')

// Form validation errors
const errors = reactive({
  username: '',
  email: '',
  password: ''
})

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Validate form
const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  errors.username = ''
  errors.email = ''
  errors.password = ''
  
  // Username validation
  if (!signInData.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (signInData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }
  
  // Email validation
  if (!signInData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Password validation
  if (!signInData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (signInData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

// Handle sign in
const handleSignIn = async () => {
  if (!validateForm()) {
    return
  }
  
  isSigningIn.value = true
  alertMessage.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Store user data (in real app, this would be handled by backend)
    const userData = {
      username: signInData.username,
      email: signInData.email,
      signInTime: new Date(),
      rememberMe: signInData.rememberMe
    }
    
    // Store in localStorage (simulating email account storage)
    if (signInData.rememberMe) {
      localStorage.setItem('clinicUser', JSON.stringify(userData))
    } else {
      sessionStorage.setItem('clinicUser', JSON.stringify(userData))
    }
    
    // Show success message
    alertMessage.value = `Welcome back, ${signInData.username}! You are now signed in.`
    alertType.value = 'success'
    
    // Redirect to check-in page after successful sign in
    setTimeout(() => {
      router.push('/check-in')
    }, 1500)
    
  } catch (error) {
    alertMessage.value = 'Sign in failed. Please check your credentials and try again.'
    alertType.value = 'danger'
  } finally {
    isSigningIn.value = false
  }
}
</script>

<style scoped>
.signin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.signin-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(14, 165, 233, 0.2);
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.clinic-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 2px solid var(--primary-color);
  object-fit: cover;
}

.clinic-name {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.signin-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  accent-color: var(--primary-color);
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--secondary-color);
}

.alert {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 0;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.alert-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.signin-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.signin-btn:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
}

.signup-link p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: var(--secondary-color);
}

/* Responsive Design */
@media (max-width: 480px) {
  .signin-container {
    padding: 1rem;
  }
  
  .signin-card {
    padding: 2rem;
  }
  
  .clinic-name {
    font-size: 1.3rem;
  }
}
</style>
