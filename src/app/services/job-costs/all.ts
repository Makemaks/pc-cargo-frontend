import http from '@/api/http'
import jobCostTransformer from '@/app/transformers/job-cost'
import { useJobCostStore } from '@/app/stores/job-cost'
import type { JobCost } from '@/app/types/job-cost'

export default (jobId: number) =>
  new Promise<JobCost[]>((resolve, reject) => {
    http
      .get(`/jobs/${jobId}/costs`)
      .then(response => {
        const costs = jobCostTransformer.fetchCollection(
          response.data.data
        )

        const store = useJobCostStore()
        store.setForJob(jobId, costs)

        resolve(costs)
      })
      .catch(reject)
  })
