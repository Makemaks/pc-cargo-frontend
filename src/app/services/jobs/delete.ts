import http from '@/api/http'
import { useJobStore } from '@/app/stores/job'

export default (jobId: number) =>
  new Promise<void>((resolve, reject) => {
    http
      .delete(`/jobs/${jobId}`)
      .then(() => {
        const store = useJobStore()
        store.remove(jobId)
        resolve()
      })
      .catch(reject)
  })
