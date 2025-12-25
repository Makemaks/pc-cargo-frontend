/**
 * ==========================
 * Show Job by Reference
 * ==========================
 *
 * Fetch a job using job_reference.
 * Public-safe access path.
 * Uses LIMITED (public) transformer.
 */

import http from '@/api/http'
import jobPublicTransformer from '@/app/transformers/jobPublic'
import type { PublicJob } from '@/app/types/job'

export default async function showByReference(
  reference: string,
): Promise<PublicJob> {
  const response = await http.get(`/jobs/reference/${reference}`)

  return jobPublicTransformer.fetch(response.data.data)
}
