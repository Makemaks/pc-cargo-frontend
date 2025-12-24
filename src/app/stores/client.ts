import { defineStore } from 'pinia'
import type { Client } from '@/app/types/client'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
  }),

  actions: {
    setClients(clients: Client[]) {
      this.clients = clients
    },
  },
})
