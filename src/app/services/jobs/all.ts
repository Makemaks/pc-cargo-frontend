/**
 * ============
 * All Jobs
 * ============
 *
 * Fetch all jobs (optionally paginated).
 */

import http from '@/api/http'
import jobTransformer from '@/app/transformers/job'
import { useJobStore } from '@/app/stores/job'
import type { Job } from '@/app/types/job'

interface JobsParams {
  page?: number
  limit?: number
}

const success = (
  response: any,
  resolve: (value: Job[]) => void
) => {
  const jobs = jobTransformer.fetchCollection(response.data.data)

  // ✅ Global state update (single source of truth)
  const jobStore = useJobStore()
  jobStore.setJobs(jobs)

  resolve(jobs)
}

const failed = (
  error: unknown,
  reject: (reason?: unknown) => void
) => {
  reject(error)
}

export default (params: JobsParams = {}) =>
  new Promise<Job[]>((resolve, reject) => {
    const query = new URLSearchParams()

    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())

    http
      .get(`/jobs${query.toString() ? `?${query}` : ''}`)
      .then((response) => success(response, resolve))
      .catch((error) => failed(error, reject))
  })
