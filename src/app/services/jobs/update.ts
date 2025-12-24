import http from '@/api/http'
import { useJobStore } from '@/app/stores/job'
import type { Job, UpdateJobPayload } from '@/app/types/job'

export default (
  jobId: number,
  payload: UpdateJobPayload
) =>
  new Promise<Job>((resolve, reject) => {
    // Hard guard – fail fast in dev
    if (typeof jobId !== 'number') {
      reject(new Error('[JobService.update] Invalid jobId'))
      return
    }

    http
      .put(`/jobs/${jobId}`, payload)
      .then(response => {
        const job: Job = response.data.data

        const store = useJobStore()
        store.replaceJob(job)

        resolve(job)
      })
      .catch(reject)
  })
