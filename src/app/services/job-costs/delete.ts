import http from '@/api/http'
import { useJobCostStore } from '@/app/stores/job-cost'

export default (jobId: number, costId: number) =>
  new Promise<void>((resolve, reject) => {
    http
      .delete(`/jobs/${jobId}/costs/${costId}`)
      .then(() => {
        const store = useJobCostStore()
        store.remove(jobId, costId)
        resolve()
      })
      .catch(reject)
  })
