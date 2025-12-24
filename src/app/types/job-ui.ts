import type { Job } from './job'

/**
 * ============
 * UI Job Types
 * ============
 *
 * These types are UI-facing only.
 * They must NOT contain business logic.
 */

/**
 * Reuse backend-authoritative status values
 */
export type JobStatus = Job['status']

/**
 * Row structure for Jobs table
 */
export interface JobRow {
  reference: string
  client: string
  status: JobStatus
  revenue: number
  profit: number
}
