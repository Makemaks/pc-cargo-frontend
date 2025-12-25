import { defineStore } from 'pinia'
import PaymentService from '@/app/services/payment'

interface PaymentState {
  loading: boolean
  error: string | null
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Create PayPal order
     */
    async createPaypalOrder(jobId: number): Promise<string> {
      this.loading = true
      this.error = null

      try {
        const response =
          await PaymentService.createPaypalOrder(jobId)

        return response.order_id
      } catch (e) {
        this.error = 'Failed to create PayPal order'
        throw e
      } finally {
        this.loading = false
      }
    },

    /**
     * Capture PayPal order
     */
    async capturePaypalOrder(
      jobId: number,
      orderId: string,
    ): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await PaymentService.capturePaypalOrder(jobId, orderId)
      } catch (e) {
        this.error = 'Failed to capture PayPal payment'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
