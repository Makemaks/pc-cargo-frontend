import http from '@/api/http'
import { useJobRevenueStore } from '@/app/stores/job-revenue'

export default (jobId: number, revenueId: number) =>
  new Promise<void>((resolve, reject) => {
    http
      .delete(`/jobs/${jobId}/revenue/${revenueId}`)
      .then(() => {
        const store = useJobRevenueStore()
        store.remove(jobId, revenueId)
        resolve()
      })
      .catch(reject)
  })
