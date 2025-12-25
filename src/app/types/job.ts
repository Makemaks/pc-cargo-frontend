/**
 * ==========================
 * Job Domain Types
 * ==========================
 */

import type { Client } from './client'

/* =========================
   TRANSPORT TYPES
========================= */

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

/* =========================
   INTERNAL FINANCIALS
========================= */

export interface JobFinancials {
  totalCosts: number
  totalRevenue: number
  totalAdjustments: number
  grossProfit: number
}

/* =========================
   INTERNAL JOB (AUTH)
========================= */

export interface Job {
  id: number
  reference: string
  client: Client

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
   PAYMENTS (PUBLIC SAFE)
========================= */

export interface PublicPayment {
  id: number
  method: 'paypal' | 'stripe'
  status: 'paid' | 'pending' | 'failed'
  receivedAt: string | null
}

/* =========================
   PUBLIC JOB (REFERENCE)
========================= */

export interface PublicJob {
  id: number
  reference: string

  /**
   * Limited client info
   */
  client: Pick<Client, 'id' | 'name'> | null

  transports: JobTransport[]

  /**
   * Payable amount (revenue-derived)
   */
  total_amount: number
  currency: string

  /**
   * Payment summary
   */
  payments: PublicPayment[]

  status: 'draft' | 'in_transit' | 'completed'
  is_paid: boolean
}

/* =========================
   REQUEST / FORM TYPES
========================= */

export interface JobTransportPayload {
  transport_mode: string
  origin: string
  destination: string
}

export interface CreateJobPayload {
  client_id: number
  status: 'draft' | 'in_transit' | 'completed'
}

export interface JobForm {
  client_id: number | null
  status: 'draft' | 'in_transit' | 'completed'
  transports: JobTransportPayload[]
  costs: { description: string; amount: number }[]
  revenues: { description: string; amount: number }[]
}

export type TransportMode = 'road' | 'sea' | 'air'

export interface UpdateJobPayload {
  client_id: number
  status: 'draft' | 'in_transit' | 'completed'
  currency?: string
}
