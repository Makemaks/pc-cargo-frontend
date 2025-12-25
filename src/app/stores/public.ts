import { defineStore } from 'pinia'
import JobService from '@/app/services/jobs'
import type { PublicJobState } from '@/app/types/public-job'

export const usePublicJobStore = defineStore('publicJob', {
  state: (): PublicJobState => ({
    job: null,
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Fetch a job by reference
     */
    async fetch(reference: string) {
      this.loading = true
      this.error = null

      try {
        // simple cache guard
        if (this.job?.reference === reference) {
          return this.job
        }

        const job = await JobService.showByReference(reference)
        this.job = job
        return job
      } catch (e) {
        this.job = null
        this.error = 'Job not found'
        throw e
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear public job state
     */
    reset() {
      this.job = null
      this.loading = false
      this.error = null
    },
  },
})
