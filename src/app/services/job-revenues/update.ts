import http from '@/api/http'
import jobRevenueTransformer from '@/app/transformers/job-revenue'
import { useJobRevenueStore } from '@/app/stores/job-revenue'
import type {
  JobRevenue,
  UpdateJobRevenuePayload,
} from '@/app/types/job-revenue'

export default (
  jobId: number,
  revenueId: number,
  payload: UpdateJobRevenuePayload
) =>
  new Promise<JobRevenue>((resolve, reject) => {
    http
      .put(`/jobs/${jobId}/revenue/${revenueId}`, payload)
      .then(response => {
        const revenue = jobRevenueTransformer.fetch(
          response.data.data
        )

        const store = useJobRevenueStore()
        store.update(jobId, revenue)

        resolve(revenue)
      })
      .catch(reject)
  })
