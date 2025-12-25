<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

const jobReference = ref('')
const isLoading = ref(false)

function searchJob() {
  if (!jobReference.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Please enter a job reference',
      life: 3000,
    })
    return
  }

  isLoading.value = true

  // No API call here — we just redirect.
  // The JobView page will fetch & validate.
  router.push(`/public/jobs/${jobReference.value.trim()}`)
}
</script>

<template>
  <div class="public-job-search">
    <Card class="search-card">
      <template #title>
        Track & Pay Your Job
      </template>

      <template #content>
        <div class="search-content">
          <p class="search-description">
            Enter your job reference number to view shipment details and make a payment.
          </p>

          <div class="search-form">
            <div class="field">
              <label for="jobReference">Job Reference : </label>
              <InputText
                id="jobReference"
                v-model="jobReference"
                placeholder="e.g. PC-000123"
                class="w-full"
                @keyup.enter="searchJob"
              />
            </div>

            <Button
              label="Search Job"
              icon="pi pi-search"
              class="mt-3 w-full"
              :loading="isLoading"
              @click="searchJob"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.public-job-search {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pc-surface-ground);
}

.search-card {
  width: 100%;
  max-width: 420px;
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-description {
  font-size: 0.9rem;
  color: var(--pc-text-muted);
  margin: 0;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--pc-text-muted);
}
</style>
