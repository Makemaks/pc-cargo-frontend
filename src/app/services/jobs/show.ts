/**
 * ============
 * Show Job
 * ============
 *
 * Fetch a single job by ID.
 * Reuses store if already available.
 */

import http from '@/api/http'
import jobTransformer from '@/app/transformers/job'
import { useJobStore } from '@/app/stores/job'
import type { Job } from '@/app/types/job'

export default (id: number) =>
  new Promise<Job>((resolve, reject) => {
    const jobStore = useJobStore()

    // 1. Return from store if exists
    const cachedJob = jobStore.getById(id)
    if (cachedJob) {
      resolve(cachedJob)
      return
    }

    // 2. Fetch from API
    http
      .get(`/jobs/${id}`)
      .then((response) => {
        const job = jobTransformer.fetch(response.data.data)

        // ✅ Store update
        jobStore.upsertJob(job)

        resolve(job)
      })
      .catch(reject)
  })
