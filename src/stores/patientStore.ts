import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Patient {
  id: string
  name: string
  email: string
  nationalID: string
  symptoms: string[]
  queueNumber: number
  isRegistered: boolean
  checkInTime: Date
}

export const usePatientStore = defineStore('patient', () => {
  // State variables
  const patients = ref<Patient[]>([])
  const currentQueueNumber = ref(1)
  const isRegistered = ref(false)
  const currentPatient = ref<Patient | null>(null)
  
  // Available symptoms for selection
  const availableSymptoms = ref([
    'Fever',
    'Cough',
    'Headache',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Chest Pain',
    'Shortness of Breath'
  ])

  // Navigation menu items
  const navigationItems = ref([
    { name: 'Check-in', route: '/check-in', icon: '🏥' },
    { name: 'Queue Status', route: '/queue-status', icon: '⏱️' },
    { name: 'My Profile', route: '/profile', icon: '👤' },
    { name: 'Notifications', route: '/notifications', icon: '📧' },
    { name: 'Help', route: '/help', icon: '❓' }
  ])

  // Getters
  const totalPatients = computed(() => patients.value.length)
  const currentQueue = computed(() => patients.value.filter(p => !p.isRegistered))
  const registeredPatients = computed(() => patients.value.filter(p => p.isRegistered))

  // Actions/Mutations
  const addPatient = (patientData: Omit<Patient, 'id' | 'queueNumber' | 'isRegistered' | 'checkInTime'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      queueNumber: currentQueueNumber.value,
      isRegistered: false,
      checkInTime: new Date()
    }
    
    patients.value.push(newPatient)
    currentPatient.value = newPatient
    currentQueueNumber.value++
    
    return newPatient
  }

  const registerPatient = (patientId: string) => {
    const patient = patients.value.find(p => p.id === patientId)
    if (patient) {
      patient.isRegistered = true
      isRegistered.value = true
    }
  }

  const removePatient = (patientId: string) => {
    const index = patients.value.findIndex(p => p.id === patientId)
    if (index > -1) {
      patients.value.splice(index, 1)
    }
  }

  const validateNationalID = (nationalID: string): boolean => {
    // Basic validation - check if it's not empty and has reasonable length
    return nationalID.trim().length >= 8 && /^\d+$/.test(nationalID)
  }

  const resetRegistration = () => {
    currentPatient.value = null
    isRegistered.value = false
  }

  const getPatientByQueueNumber = (queueNumber: number) => {
    return patients.value.find(p => p.queueNumber === queueNumber)
  }

  return {
    // State
    patients,
    currentQueueNumber,
    isRegistered,
    currentPatient,
    availableSymptoms,
    navigationItems,
    
    // Getters
    totalPatients,
    currentQueue,
    registeredPatients,
    
    // Actions
    addPatient,
    registerPatient,
    removePatient,
    validateNationalID,
    resetRegistration,
    getPatientByQueueNumber
  }
})
