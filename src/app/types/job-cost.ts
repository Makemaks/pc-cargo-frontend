export interface JobCost {
  id: number
  jobId: number
  description: string
  amount: number
  currency: string
  createdAt: string
}

export interface CreateJobCostPayload {
  description: string
  amount: number
  currency: string
}

export interface UpdateJobCostPayload {
  description?: string
  amount?: number
  currency?: string
}
