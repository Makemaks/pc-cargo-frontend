<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { usePublicJobStore } from '@/app/stores/public'
import JobViewContent from '@/app/components/jobs/JobViewContent.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const jobStore = usePublicJobStore()

const reference = route.params.reference as string

onMounted(async () => {
  try {
    await jobStore.fetch(reference)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Not Found',
      detail: 'Job not found',
      life: 3000,
    })
    router.replace('/public/jobs')
  }
})

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
</script>

<template>
  <div class="public-job-view" v-if="jobStore.job">
    <JobViewContent :job="jobStore.job" />

    <Divider class="my-4" />

    <div class="actions">
      <Button
        v-if="paymentState === 'paid'"
        label="Paid"
        icon="pi pi-check"
        class="p-button-success"
        disabled
      />

      <RouterLink
        v-else-if="paymentState === 'payable'"
        :to="`/public/jobs/${reference}/pay`"
      >
        <Button
          label="Pay Now"
          icon="pi pi-credit-card"
          class="p-button-success"
        />
      </RouterLink>

      <Button
        v-else
        label="In Progress Payment"
        icon="pi pi-clock"
        class="p-button-warning"
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

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
