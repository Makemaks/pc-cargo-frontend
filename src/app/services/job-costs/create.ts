import http from '@/api/http'
import jobCostTransformer from '@/app/transformers/job-cost'
import { useJobCostStore } from '@/app/stores/job-cost'
import type { JobCost, CreateJobCostPayload } from '@/app/types/job-cost'

export default (
  jobId: number,
  payload: CreateJobCostPayload
) =>
  new Promise<JobCost>((resolve, reject) => {
    http
      .post(`/jobs/${jobId}/costs`, payload)
      .then(response => {
        const cost = jobCostTransformer.fetch(
          response.data.data
        )

        const store = useJobCostStore()
        store.add(jobId, cost)

        resolve(cost)
      })
      .catch(reject)
  })
