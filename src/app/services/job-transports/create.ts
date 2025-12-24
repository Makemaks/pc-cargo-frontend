import http from '@/api/http'
import jobTransportTransformer from '@/app/transformers/job-transport'
import { useJobTransportStore } from '@/app/stores/job-transport'
import type {
  JobTransport,
  CreateJobTransportPayload,
} from '@/app/types/job-transport'

export default (
  jobId: number,
  payload: CreateJobTransportPayload
) =>
  new Promise<JobTransport>((resolve, reject) => {
    http
      .post(`/jobs/${jobId}/transports`, payload)
      .then(response => {
        const transport = jobTransportTransformer.fetch(
          response.data.data
        )

        const store = useJobTransportStore()
        store.add(jobId, transport)

        resolve(transport)
      })
      .catch(reject)
  })
