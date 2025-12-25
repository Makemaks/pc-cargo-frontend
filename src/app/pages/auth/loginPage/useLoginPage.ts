/**
 * ============
 * Login Page Logic
 * ============
 *
 * Handles user login flow.
 * Orchestrates AuthStore + Router + UI state.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/app/stores/auth'

export function useLoginPage() {
  const email = ref('')
  const password = ref('')
  const loading = ref(false)

  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  async function submit() {
    if (!email.value || !password.value) {
      toast.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Email and password are required',
        life: 3000,
      })
      return
    }

    loading.value = true

    try {
      await authStore.login(email.value, password.value)
      router.push('/')
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail:
          error?.response?.data?.message ??
          'Invalid email or password',
        life: 4000,
      })
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    password,
    loading,
    submit,
  }
}
