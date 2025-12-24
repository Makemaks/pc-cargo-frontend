import type { JobRevenue } from '@/app/types/job-revenue'

export default {
  fetch(revenue: any): JobRevenue {
    return {
      id: revenue.id,
      jobId: revenue.job_id,
      description: revenue.description,
      amount: Number(revenue.amount),
      currency: revenue.currency,
      createdAt: revenue.created_at,
    }
  },

  fetchCollection(revenues: any[]): JobRevenue[] {
    return revenues.map(this.fetch)
  },
}
