import http from '@/api/http'
import jobCostTransformer from '@/app/transformers/job-cost'
import { useJobCostStore } from '@/app/stores/job-cost'
import type { JobCost, UpdateJobCostPayload } from '@/app/types/job-cost'

export default (
  jobId: number,
  costId: number,
  payload: UpdateJobCostPayload
) =>
  new Promise<JobCost>((resolve, reject) => {
    http
      .put(`/jobs/${jobId}/costs/${costId}`, payload)
      .then(response => {
        const cost = jobCostTransformer.fetch(
          response.data.data
        )

        const store = useJobCostStore()
        store.update(jobId, cost)

        resolve(cost)
      })
      .catch(reject)
  })
