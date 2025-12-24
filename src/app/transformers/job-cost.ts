import type { JobCost } from '@/app/types/job-cost'

export default {
  fetch(cost: any): JobCost {
    return {
      id: cost.id,
      jobId: cost.job_id,
      description: cost.description,
      amount: Number(cost.amount),
      currency: cost.currency,
      createdAt: cost.created_at,
    }
  },

  fetchCollection(costs: any[]): JobCost[] {
    return costs.map(this.fetch)
  },
}
