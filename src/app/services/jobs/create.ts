/**
 * ============
 * Create Job
 * ============
 *
 * Matches backend StoreJobRequest exactly.
 * Creates a job with client + status only.
 */

import http from '@/api/http'
import jobTransformer from '@/app/transformers/job'
import { useJobStore } from '@/app/stores/job'
import type {
  Job,
  JobForm,
  CreateJobPayload,
} from '@/app/types/job'

export default (form: JobForm) =>
  new Promise<Job>((resolve, reject) => {
    /* ---------- VALIDATION ---------- */
    if (!form.client_id) {
      reject(new Error('Client is required'))
      return
    }

    if (!form.status) {
      reject(new Error('Status is required'))
      return
    }

    /* ---------- PAYLOAD ---------- */
    const payload: CreateJobPayload = {
      client_id: form.client_id,
      status: form.status,
    }

    /* ---------- REQUEST ---------- */
    http
      .post('/jobs', payload)
      .then(response => {
        const job = jobTransformer.fetch(response.data.data)

        const jobStore = useJobStore()
        jobStore.upsertJob(job)

        resolve(job)
      })
      .catch(reject)
  })
