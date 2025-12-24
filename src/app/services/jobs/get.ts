/**
 * ============
 * Get Job
 * ============
 *
 * Fetches a single job with full details.
 * Used for show / edit pages.
 */

import http from '@/api/http'
import jobTransformer from '@/app/transformers/job'
import { useJobStore } from '@/app/stores/job'

import type { Job } from '@/app/types/job'

const success = (
  response: any,
  resolve: (value: Job) => void
) => {
  const job = jobTransformer.fetch(response.data.data)

  const jobStore = useJobStore()
  jobStore.replaceJob(job)

  resolve(job)
}

const failed = (
  error: unknown,
  reject: (reason?: unknown) => void
) => {
  reject(error)
}

export default (id: number) =>
  new Promise<Job>((resolve, reject) => {
    if (!id) {
      reject(new Error('Job ID is required'))
      return
    }

    http
      .get(`/jobs/${id}`)
      .then(response => success(response, resolve))
      .catch(error => failed(error, reject))
  })
