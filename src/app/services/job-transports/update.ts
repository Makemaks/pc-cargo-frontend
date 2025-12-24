import http from '@/api/http'
import jobTransportTransformer from '@/app/transformers/job-transport'
import { useJobTransportStore } from '@/app/stores/job-transport'
import type {
  JobTransport,
  UpdateJobTransportPayload,
} from '@/app/types/job-transport'

export default (
  jobId: number,
  transportId: number,
  payload: UpdateJobTransportPayload
) =>
  new Promise<JobTransport>((resolve, reject) => {

    if (typeof transportId !== 'number') {
      console.error('[JobTransport.update] INVALID transportId', transportId)
      reject(new Error('Invalid transportId'))
      return
    }

    http
      .put(`/jobs/${jobId}/transports/${transportId}`, payload)
      .then(response => {
        const transport = jobTransportTransformer.fetch(
          response.data.data
        )

        const store = useJobTransportStore()
        store.update(jobId, transport)

        resolve(transport)
      })
      .catch(reject)
  })
