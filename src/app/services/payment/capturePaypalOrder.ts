/**
 * ==========================
 * Capture PayPal Order
 * ==========================
 *
 * Captures an approved PayPal order for a job.
 * Backend validates:
 * - order ownership
 * - job state
 * - amount
 */

import http from '@/api/http'

interface CapturePaypalOrderResponse {
  status: 'paid' | 'failed'
}

export default async function capturePaypalOrder(
  jobId: number,
  orderId: string,
): Promise<CapturePaypalOrderResponse> {
  const response = await http.post(
    `/jobs/${jobId}/payments/paypal/capture`,
    {
      order_id: orderId,
    },
  )

  return {
    status: response.data.status,
  }
}
