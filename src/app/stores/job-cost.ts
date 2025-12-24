import { defineStore } from 'pinia'
import type { JobCost } from '@/app/types/job-cost'

export const useJobCostStore = defineStore('jobCost', {
  state: () => ({
    byJob: {} as Record<number, JobCost[]>,
  }),

  getters: {
    forJob: (state) => {
      return (jobId: number): JobCost[] =>
        state.byJob[jobId] ?? []
    },
  },

  actions: {
    setForJob(jobId: number, costs: JobCost[]) {
      this.byJob[jobId] = costs
    },

    add(jobId: number, cost: JobCost) {
      if (!this.byJob[jobId]) {
        this.byJob[jobId] = []
      }

      this.byJob[jobId].push(cost)
    },

    update(jobId: number, cost: JobCost) {
      const list = this.byJob[jobId]
      if (!list) return

      const index = list.findIndex(c => c.id === cost.id)
      if (index !== -1) {
        list[index] = cost
      }
    },

    remove(jobId: number, costId: number) {
      const list = this.byJob[jobId]
      if (!list) return

      this.byJob[jobId] = list.filter(c => c.id !== costId)
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
