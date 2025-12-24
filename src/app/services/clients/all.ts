/**
 * ===============
 * All Clients
 * ===============
 *
 * Fetch all clients (optionally paginated).
 */

import http from '@/api/http'
import clientTransformer from '@/app/transformers/client'
import { useClientStore } from '@/app/stores/client'
import type { Client } from '@/app/stores/client'

interface ClientsParams {
  page?: number
  limit?: number
}

const success = (
  response: any,
  resolve: (value: Client[]) => void
) => {
  const clients = clientTransformer.fetchCollection(response.data.data)

  // ✅ Global state update (single source of truth)
  const clientStore = useClientStore()
  clientStore.setClients(clients)

  resolve(clients)
}

const failed = (
  error: unknown,
  reject: (reason?: unknown) => void
) => {
  reject(error)
}

export default (params: ClientsParams = {}) =>
  new Promise<Client[]>((resolve, reject) => {
    const query = new URLSearchParams()

    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())

    http
      .get(`/clients${query.toString() ? `?${query}` : ''}`)
      .then((response) => success(response, resolve))
      .catch((error) => failed(error, reject))
  })
