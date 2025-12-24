import http from '@/api/http'
import { useJobTransportStore } from '@/app/stores/job-transport'

export default (jobId: number, transportId: number) =>
  new Promise<void>((resolve, reject) => {
    http
      .delete(`/jobs/${jobId}/transports/${transportId}`)
      .then(() => {
        const store = useJobTransportStore()
        store.remove(jobId, transportId)
        resolve()
      })
      .catch(reject)
  })
