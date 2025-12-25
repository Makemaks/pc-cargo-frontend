/**
 * ==========================
 * Create PayPal Order
 * ==========================
 *
 * Creates a PayPal order for a job.
 * Amount is calculated on the backend.
 */

import http from '@/api/http'

interface CreatePaypalOrderResponse {
  order_id: string
}

export default async function createPaypalOrder(
  jobId: number,
): Promise<CreatePaypalOrderResponse> {
  const response = await http.post(`/jobs/${jobId}/payments/paypal/order`)

  return {
    order_id: response.data.order_id,
  }
}
