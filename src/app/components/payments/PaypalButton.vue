<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { usePaymentStore } from '@/app/stores/payment'

const props = defineProps<{
  jobId: number
}>()

const toast = useToast()
const paymentStore = usePaymentStore()

const isReady = ref(false)
const paypalContainerId = `paypal-button-${props.jobId}`

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

/**
 * Load PayPal SDK once
 */
function loadPaypalSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      resolve()
      return
    }

    if (!PAYPAL_CLIENT_ID) {
      reject(new Error('Missing PayPal client ID'))
      return
    }

    const script = document.createElement('script')
    const params = new URLSearchParams({
      'client-id': PAYPAL_CLIENT_ID,
      intent: 'capture',
      currency: 'USD',
    })

    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('Failed to load PayPal SDK'))

    document.body.appendChild(script)
  })
}

onMounted(async () => {
  try {
    await loadPaypalSdk()

    const paypal = (window as any).paypal
    if (!paypal) {
      throw new Error('PayPal SDK not available')
    }

    paypal
      .Buttons({
        /**
         * Create order (via store)
         */
        createOrder: async () => {
          return await paymentStore.createPaypalOrder(
            props.jobId,
          )
        },

        /**
         * Capture order (via store)
         */
        onApprove: async (data: { orderID: string }) => {
          try {
            await paymentStore.capturePaypalOrder(
              props.jobId,
              data.orderID,
            )

            toast.add({
              severity: 'success',
              summary: 'Payment Successful',
              detail: 'Your payment has been completed.',
              life: 4000,
            })

          } catch {
            toast.add({
              severity: 'error',
              summary: 'Payment Failed',
              detail: 'Unable to capture PayPal payment.',
              life: 4000,
            })
          }
        },

        onError: () => {
          toast.add({
            severity: 'error',
            summary: 'PayPal Error',
            detail: 'Something went wrong with PayPal.',
            life: 4000,
          })
        },
      })
      .render(`#${paypalContainerId}`)

    isReady.value = true
  } catch (error) {
    console.error(error)

    toast.add({
      severity: 'error',
      summary: 'PayPal Load Failed',
      detail: 'Unable to load PayPal.',
      life: 4000,
    })
  }
})
</script>

<template>
  <div class="paypal-wrapper">
    <div :id="paypalContainerId" />

    <small v-if="!isReady" class="paypal-loading">
      Loading PayPal…
    </small>
  </div>
</template>

<style scoped>
.paypal-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.paypal-loading {
  font-size: 0.75rem;
  color: var(--pc-text-muted);
}
</style>
