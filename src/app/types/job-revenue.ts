export interface JobRevenue {
  id: number
  jobId: number
  description: string
  amount: number
  currency: string
  createdAt: string
}

export interface CreateJobRevenuePayload {
  description: string
  amount: number
  currency: string
}

export interface UpdateJobRevenuePayload {
  description?: string
  amount?: number
  currency?: string
}
