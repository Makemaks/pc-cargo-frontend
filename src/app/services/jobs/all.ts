/**
 * ============
 * All Jobs
 * ============
 *
 * Fetch all jobs (optionally paginated).
 */

import http from '@/api/http'
import jobTransformer from '@/app/transformers/job'
import type { Job } from '@/app/types/job'

interface JobsParams {
  page?: number
  limit?: number
}

export default async function all(
  params: JobsParams = {}
): Promise<Job[]> {
  const query = new URLSearchParams()

  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())

  const response = await http.get(
    `/jobs${query.toString() ? `?${query}` : ''}`
  )

  // Laravel JsonResource → data.data
  return jobTransformer.fetchCollection(response.data.data)
}
