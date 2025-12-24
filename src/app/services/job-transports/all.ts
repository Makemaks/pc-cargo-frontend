import http from '@/api/http'
import jobTransportTransformer from '@/app/transformers/job-transport'
import { useJobTransportStore } from '@/app/stores/job-transport'
import type { JobTransport } from '@/app/types/job-transport'

export default (jobId: number) =>
  new Promise<JobTransport[]>((resolve, reject) => {
    http
      .get(`/jobs/${jobId}`)
      .then(response => {
        const transports = jobTransportTransformer.fetchCollection(
          response.data.data.transports
        )

        const store = useJobTransportStore()
        store.setForJob(jobId, transports)

        resolve(transports)
      })
      .catch(reject)
  })
