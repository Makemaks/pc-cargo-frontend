import { defineStore } from 'pinia'
import type { Job } from '@/app/types/job'

export const useJobStore = defineStore('job', {
  /**
   * State
   */
  state: () => ({
    list: [] as Job[],
  }),

  /**
   * Getters
   */
  getters: {
    getById: (state) => {
      return (id: number): Job | undefined =>
        state.list.find(job => job.id === id)
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Normalize job so UI NEVER sees undefined fields
     */
    normalize(job: Job): Job {
      return {
        ...job,
        reference: job.reference ?? '',
        financials: job.financials ?? {
          totalCosts: 0,
          totalRevenue: 0,
          totalAdjustments: 0,
          grossProfit: 0,
        },
      }
    },

    /**
     * Replace full job list
     */
    setJobs(jobs: Job[]) {
      this.list = jobs.map(j => this.normalize(j))
    },

    /**
     * Insert or update a single job
     */
    upsertJob(job: Job) {
      const normalized = this.normalize(job)
      const index = this.list.findIndex(j => j.id === normalized.id)

      if (index === -1) {
        this.list.push(normalized)
      } else {
        this.list[index] = normalized
      }
    },

    /**
     * Explicit replace (semantic clarity for show/update)
     */
    replaceJob(job: Job) {
      this.upsertJob(job)
    },

    /**
     * Clear store (logout, org switch, etc.)
     */
    clear() {
      this.list = []
    },

    /**
     * Remove job from store
     */
    remove(jobId: number) {
      this.list = this.list.filter(job => job.id !== jobId)
    },
  },
})
