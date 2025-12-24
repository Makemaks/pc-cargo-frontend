import type { Client } from '@/app/types/client'

export default {
  fetch(client: any): Client {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      createdAt: client.created_at,
    }
  },

  fetchCollection(clients: any[]): Client[] {
    return clients.map(this.fetch)
  },
}
