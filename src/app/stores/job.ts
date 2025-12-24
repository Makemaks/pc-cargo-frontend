import { defineStore } from 'pinia'
import type { Job } from '@/app/types/job'
import JobService from '@/app/services/jobs'

export const useJobStore = defineStore('job', {
  /**
   * State
   */
  state: () => ({
    list: [] as Job[],
    loading: false,
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
     * Explicit replace (semantic clarity)
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
     * Remove job locally
     */
    remove(jobId: number) {
      this.list = this.list.filter(job => job.id !== jobId)
    },

    /**
     * ============================
     * CRUD (Store → Service)
     * ============================
     */

    async fetchAll(params: { page?: number; limit?: number } = {}) {
      this.loading = true
      try {
        const jobs = await JobService.all(params)
        this.setJobs(jobs)
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id: number): Promise<Job> {
      const job = await JobService.show(id)
      this.upsertJob(job)
      return job
    },

    async create(payload: any): Promise<Job> {
      const job = await JobService.create(payload)
      this.upsertJob(job)
      return job
    },

    async update(id: number, payload: any): Promise<Job> {
      const job = await JobService.update(id, payload)
      this.replaceJob(job)
      return job
    },

    async deleteJob(id: number) {
      await JobService.remove(id)
      this.remove(id)
    },
  },
})
