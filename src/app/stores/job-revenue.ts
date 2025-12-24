import { defineStore } from 'pinia'
import type { JobRevenue } from '@/app/types/job-revenue'

export const useJobRevenueStore = defineStore('jobRevenue', {
  state: () => ({
    byJob: {} as Record<number, JobRevenue[]>,
  }),

  getters: {
    forJob: (state) => {
      return (jobId: number): JobRevenue[] =>
        state.byJob[jobId] ?? []
    },
  },

  actions: {
    setForJob(jobId: number, revenues: JobRevenue[]) {
      this.byJob[jobId] = revenues
    },

    add(jobId: number, revenue: JobRevenue) {
      if (!this.byJob[jobId]) {
        this.byJob[jobId] = []
      }

      this.byJob[jobId].push(revenue)
    },

    update(jobId: number, revenue: JobRevenue) {
      const list = this.byJob[jobId]
      if (!list) return

      const index = list.findIndex(r => r.id === revenue.id)
      if (index !== -1) {
        list[index] = revenue
      }
    },

    remove(jobId: number, revenueId: number) {
      const list = this.byJob[jobId]
      if (!list) return

      this.byJob[jobId] = list.filter(r => r.id !== revenueId)
    },

    clear(jobId?: number) {
      if (jobId) {
        delete this.byJob[jobId]
      } else {
        this.byJob = {}
      }
    },
  },
})
