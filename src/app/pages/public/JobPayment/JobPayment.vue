<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { usePublicJobStore } from '@/app/stores/public'
import JobViewContent from '@/app/components/jobs/JobViewContent.vue'
import PaypalButton from '@/app/components/payments/PaypalButton.vue'
import PaymentMethodSelector from '@/app/components/payments/PaymentMethodSelector.vue'

type PaymentMethod = 'paypal' | 'stripe'

const route = useRoute()
const router = useRouter()
const jobStore = usePublicJobStore()

const reference = route.params.reference as string
const selectedMethod = ref<PaymentMethod>('paypal')

/**
 * ✅ Correct payment state
 */
const paymentState = computed<'in_progress' | 'payable' | 'paid'>(() => {
  const job = jobStore.job
  if (!job) return 'in_progress'
  if (job.is_paid) return 'paid'
  if (job.status === 'completed') return 'payable'
  return 'in_progress'
})

const showTotal = computed(() =>
  paymentState.value === 'payable' || paymentState.value === 'paid'
)

const formattedTotal = computed(() => {
  const job = jobStore.job
  if (!job) return ''
  return `${job.currency} ${job.total_amount.toLocaleString()}`
})

/**
 * ✅ SAFE redirect (NO infinite loop)
 */
watch(
  () => paymentState.value,
  (state) => {
    if (state !== 'payable') {
      router.replace(`/public/jobs/${reference}`)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="public-job-view" v-if="jobStore.job">
    <!-- JOB SUMMARY -->
    <JobViewContent :job="jobStore.job" />

    <Divider class="my-4" />

    <!-- TOTAL -->
    <div v-if="showTotal" class="total-amount">
      <span class="label">Total Amount</span>
      <span class="value">{{ formattedTotal }}</span>
    </div>

    <Divider class="my-4" />

    <!-- =========================
         PAYMENT SECTION
    ========================= -->
    <section v-if="paymentState === 'payable'" class="payment-section">
      <PaymentMethodSelector v-model="selectedMethod">
        <!-- PAYPAL (NESTED) -->
        <template #paypal>
          <PaypalButton :job-id="jobStore.job.id" />
        </template>

        <!-- STRIPE (NESTED NOTICE) -->
        <template #stripe>
          <div class="stripe-notice">
            ⚠️ Stripe payment is not yet implemented.
          </div>
        </template>
      </PaymentMethodSelector>
    </section>

    <!-- PAID STATE -->
    <div v-if="paymentState === 'paid'" class="payment-details">
      <Button
        label="Paid"
        icon="pi pi-check"
        class="p-button-success"
        disabled
      />
    </div>
  </div>
</template>

<style scoped>
.public-job-view {
  max-width: 900px;
  margin: 2rem auto;
}

/* TOTAL */
.total-amount {
  text-align: right;
}

.total-amount .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--pc-text-muted);
}

.total-amount .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--pc-primary);
}

/* PAYMENT SECTION */
.payment-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* CENTERED FALLBACK (PAID) */
.payment-details {
  display: flex;
  justify-content: center;
}

/* STRIPE NOTICE */
.stripe-notice {
  padding: 1rem 1.25rem;
  border-radius: 6px;
  background: #fff5f5;
  color: #c53030;
  font-size: 0.9rem;
  text-align: center;
}
</style>
