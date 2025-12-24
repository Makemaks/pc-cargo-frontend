import type { Job } from '@/app/types/job'

export default {
  fetch(job: any): Job {
    return {
      id: job.id,
      reference: job.job_reference,

      client: job.client
        ? {
            id: job.client.id,
            name: job.client.name,
          }
        : { id: 0, name: '' },

      /**
       * Transport summary (primary / first leg)
       */
      transport: job.transport
        ? {
            transportMode: job.transport.transport_mode,
            origin: job.transport.origin,
            destination: job.transport.destination,
            status: job.transport.status,
          }
        : null,

      /**
       * All transport legs
       */
      transports: (job.transports ?? []).map((t: any) => ({
        id: t.id,
        sequence: t.sequence,
        transportMode: t.transport_mode,
        origin: t.origin,
        destination: t.destination,
        status: t.status,
        createdAt: t.created_at ?? null,
        updatedAt: t.updated_at ?? null,
      })),

      status: job.status,

      createdAt: job.created_at,
      completedAt: job.completed_at,

      financials: {
        totalCosts: job.financials?.total_costs ?? 0,
        totalRevenue: job.financials?.total_revenue ?? 0,
        totalAdjustments: job.financials?.total_adjustments ?? 0,
        grossProfit: job.financials?.gross_profit ?? 0,
      },

      /**
       * IMPORTANT: plural naming must match backend
       */
      costs: job.costs ?? [],
      revenues: job.revenues ?? [],
      adjustments: job.adjustments ?? [],
    }
  },

  fetchCollection(jobs: any[]): Job[] {
    return jobs.map(this.fetch)
  },
}
