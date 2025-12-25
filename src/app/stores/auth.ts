import { defineStore } from 'pinia'
import type { User } from '@/app/types/user'
import AuthService from '@/app/services/auth'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', {
  /**
   * State
   */
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem(TOKEN_KEY),
    ready: false,
  }),

  /**
   * Getters
   */
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Replace user explicitly
     */
    setUser(user: User | null) {
      this.user = user
    },

    /**
     * Clear auth state (logout, token expiry)
     */
    clear() {
      this.user = null
      this.token = null
      localStorage.removeItem(TOKEN_KEY)
    },

    /**
     * ============================
     * Auth Actions (Store → Service)
     * ============================
     */

    async login(email: string, password: string) {
      const result = await AuthService.login({ email, password })

      this.token = result.token
      this.setUser(result.user)

      localStorage.setItem(TOKEN_KEY, result.token)
    },

    async hydrate() {
      if (!this.token) {
        this.ready = true
        return
      }

      try {
        const user = await AuthService.me()
        this.setUser(user)
      } catch {
        this.clear()
      } finally {
        this.ready = true
      }
    },

    async logout() {
      try {
        await AuthService.logout()
      } finally {
        this.clear()
      }
    },
  },
})
