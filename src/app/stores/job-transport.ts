import { defineStore } from 'pinia'
import type { JobTransport } from '@/app/types/job-transport'

export const useJobTransportStore = defineStore('jobTransport', {
  state: () => ({
    byJob: {} as Record<number, JobTransport[]>,
  }),

    getters: {
    forJob: (state) => {
        return (jobId: number): JobTransport[] =>
        [...(state.byJob[jobId] ?? [])].sort(
            (a, b) => a.sequence - b.sequence
        )
    },
    },

  actions: {
    setForJob(jobId: number, transports: JobTransport[]) {
      this.byJob[jobId] = transports
    },

    add(jobId: number, transport: JobTransport) {
      if (!this.byJob[jobId]) {
        this.byJob[jobId] = []
      }

      this.byJob[jobId].push(transport)
    },

    update(jobId: number, transport: JobTransport) {
      const list = this.byJob[jobId]
      if (!list) return

      const index = list.findIndex(t => t.id === transport.id)
      if (index !== -1) {
        list[index] = transport
      }
    },

    remove(jobId: number, transportId: number) {
      const list = this.byJob[jobId]
      if (!list) return

      this.byJob[jobId] = list.filter(t => t.id !== transportId)
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
