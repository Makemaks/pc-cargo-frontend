/**
 * ==========================
 * Public Job Transformer
 * ==========================
 *
 * Used for job lookup by reference.
 * Intentionally excludes financials.
 * Includes ONLY payable amount (revenue-derived).
 */

import type { PublicJob } from '@/app/types/job'

export default {
  fetch(data: any): PublicJob {
    return {
      id: data.id,
      reference: data.reference,
      status: data.status,
      is_paid: data.is_paid ?? false,

      /**
       * Payable amount (derived from revenue on backend)
       */
      total_amount: data.total_amount ?? 0,
      currency: data.currency ?? 'USD',

      client: data.client
        ? {
            id: data.client.id,
            name: data.client.name,
          }
        : null,

      transports: (data.transports ?? []).map((t: any) => ({
        id: t.id,
        sequence: t.sequence ?? 0,
        transportMode: t.transportMode,
        origin: t.origin,
        destination: t.destination,
        status: t.status,
        createdAt: t.createdAt ?? null,
        updatedAt: t.updatedAt ?? null,
      })),

      payments: (data.payments ?? []).map((p: any) => ({
        id: p.id,
        method: p.method,
        status: p.status,
        receivedAt: p.receivedAt ?? null,
      })),
    }
  },
}
