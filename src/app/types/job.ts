/**
 * ============
 * Job Domain Types
 * ============
 * Mirrors backend JobResource
 */

export interface JobClient {
  id: number
  name: string
}

/**
 * Transport summary (used in lists / tables)
 */
export interface JobTransportSummary {
  transportMode: string
  origin: string
  destination: string
  status: string
}

/**
 * Full transport leg
 */
export interface JobTransport {
  id: number
  sequence: number
  transportMode: string
  origin: string
  destination: string
  status: string
  createdAt: string | null
  updatedAt: string | null
}

export interface JobFinancials {
  totalCosts: number
  totalRevenue: number
  totalAdjustments: number
  grossProfit: number
}

/**
 * Job returned from API (JobResource)
 */
export interface Job {
  id: number
  reference: string

  client: JobClient

  transport: JobTransportSummary | null
  transports: JobTransport[]

  status: 'draft' | 'in_transit' | 'completed'

  createdAt: string | null
  completedAt: string | null

  financials: JobFinancials

  costs: unknown[]
  revenues: unknown[]
  adjustments: unknown[]
}


/* =========================
   REQUEST / FORM TYPES
========================= */

/**
 * Transport payload sent to backend
 * (matches StoreJobRequest)
 */
export interface JobTransportPayload {
  transport_mode: string
  origin: string
  destination: string
}

/**
 * Create Job payload (POST /jobs)
 * Matches StoreJobRequest exactly
 */
export interface CreateJobPayload {
  client_id: number
  status: 'draft' | 'in_transit' | 'completed'
}


/**
 * Job form state (frontend only)
 */
export interface JobForm {
  client_id: number | null
  status: 'draft' | 'in_transit' | 'completed'
  transports: JobTransportPayload[]
  costs: { description: string; amount: number }[]
  revenues: { description: string; amount: number }[]
}

/**
 * Transport modes
 * Mirrors backend TransportMode enum
 */
export type TransportMode = 'road' | 'sea' | 'air'

/**
 * Update Job payload (PUT /jobs/{id})
 * Core job fields ONLY
 */
export interface UpdateJobPayload {
  client_id: number
  status: 'draft' | 'in_transit' | 'completed'
  currency?: string
}

