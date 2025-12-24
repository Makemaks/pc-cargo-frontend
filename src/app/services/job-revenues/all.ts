import http from '@/api/http'
import jobRevenueTransformer from '@/app/transformers/job-revenue'
import { useJobRevenueStore } from '@/app/stores/job-revenue'
import type { JobRevenue } from '@/app/types/job-revenue'

export default (jobId: number) =>
  new Promise<JobRevenue[]>((resolve, reject) => {
    http
      .get(`/jobs/${jobId}/revenue`)
      .then(response => {
        const revenues = jobRevenueTransformer.fetchCollection(
          response.data.data
        )

        const store = useJobRevenueStore()
        store.setForJob(jobId, revenues)

        resolve(revenues)
      })
      .catch(reject)
  })
