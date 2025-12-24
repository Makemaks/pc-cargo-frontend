import http from '@/api/http'
import jobRevenueTransformer from '@/app/transformers/job-revenue'
import { useJobRevenueStore } from '@/app/stores/job-revenue'
import type {
  JobRevenue,
  CreateJobRevenuePayload,
} from '@/app/types/job-revenue'

export default (
  jobId: number,
  payload: CreateJobRevenuePayload
) =>
  new Promise<JobRevenue>((resolve, reject) => {
    http
      .post(`/jobs/${jobId}/revenue`, payload)
      .then(response => {
        const revenue = jobRevenueTransformer.fetch(
          response.data.data
        )

        const store = useJobRevenueStore()
        store.add(jobId, revenue)

        resolve(revenue)
      })
      .catch(reject)
  })
