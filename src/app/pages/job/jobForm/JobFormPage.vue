<template>
  <!-- Fullscreen Loader -->
  <div v-if="isLoading" class="fullscreen-loader">
    <ProgressSpinner strokeWidth="4" animationDuration=".8s" />
  </div>

  <div class="job-form-page">
    <!-- Header -->
    <header class="page-header">
      <h1>{{ isEdit ? 'Edit Job' : 'Create Job' }}</h1>
      <p class="text-muted">
        {{ isEdit
          ? 'Update job details, transport, and financials.'
          : 'Create a new freight job with transport and financial details.' }}
      </p>
    </header>

    <Steps :model="steps" :activeStep="activeStep" class="mb-4" />

    <form @submit.prevent="submit">
      <!-- STEP 1 -->
      <Card v-if="activeStep === 0" class="form-card">
        <template #title>Job Details</template>
        <template #content>
          <div class="form-grid">
            <div class="field">
              <label>Client</label>
              <Dropdown v-model="form.client_id" :options="clientOptions" optionLabel="name" optionValue="id" />
            </div>

            <div class="field">
              <label>Status</label>
              <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" />
            </div>

            <div class="field">
              <label>Currency</label>
              <Dropdown
                v-model="form.currency"
                :options="currencyOptions"
                optionLabel="label"
                optionValue="value"
                :disabled="currencyLocked"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- STEP 2 -->
      <Card v-if="activeStep === 1" class="form-card">
        <template #title>
          <div class="card-title-with-action">
            <span>Transportations</span>
            <Button label="Add Transport" icon="pi pi-plus" @click="addTransport" />
          </div>
        </template>

        <template #content>
          <div v-if="!form.transports.length" class="empty-hint">
            No transport legs yet
          </div>

          <div v-for="(t, i) in form.transports" :key="i" class="transport-card">
            <div class="transport-header">
              <strong>Leg {{ i + 1 }}</strong>
              <Button icon="pi pi-trash" severity="danger" text @click="removeTransport(i)" />
            </div>

            <Divider />

            <div class="form-grid">
              <Dropdown v-model="t.transport_mode" :options="transportModeOptions" optionLabel="label" optionValue="value" />
              <InputText v-model="t.origin" placeholder="Origin" />
              <InputText v-model="t.destination" placeholder="Destination" />
              <Dropdown
                  v-model="t.status"
                  :options="transportStatusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Status"
                />

            </div>
          </div>
        </template>
      </Card>

      <!-- STEP 3 -->
      <Card v-if="activeStep === 2" class="form-card">
        <template #title>Financials</template>

        <template #content>
          <!-- COSTS -->
          <Fieldset legend="Cost Lines" toggleable>
            <Button label="Add Cost" icon="pi pi-plus" class="mb-3" @click="addCost" />

            <div v-if="!form.costs.length" class="empty-hint">
              No cost lines added
            </div>

            <div v-for="(c, i) in form.costs" :key="i" class="line-card">
              <InputText v-model="c.description" placeholder="Description" />
              <InputNumber v-model="c.amount" mode="currency" :currency="form.currency" />
              <Button icon="pi pi-trash" severity="danger" text @click="removeCost(i)" />
            </div>

            <Divider />
            <div class="totals">
              <span>Total Costs</span>
              <strong>{{ formattedCostTotal }}</strong>
            </div>
          </Fieldset>

          <!-- REVENUE -->
          <Fieldset legend="Revenue Lines" toggleable>
            <Button label="Add Revenue" icon="pi pi-plus" class="mb-3" @click="addRevenue" />

            <div v-if="!form.revenues.length" class="empty-hint">
              No revenue lines added
            </div>

            <div v-for="(r, i) in form.revenues" :key="i" class="line-card">
              <InputText v-model="r.description" placeholder="Description" />
              <InputNumber v-model="r.amount" mode="currency" :currency="form.currency" />
              <Button icon="pi pi-trash" severity="danger" text @click="removeRevenue(i)" />
            </div>

            <Divider />
            <div class="totals">
              <span>Total Revenue</span>
              <strong>{{ formattedRevenueTotal }}</strong>
            </div>
          </Fieldset>
        </template>
      </Card>

      <!-- ACTIONS -->
      <div class="form-actions">
        <span v-if="activeStep === 0"></span>

        <Button
          v-if="activeStep > 0"
          label="Back"
          text
          @click="activeStep--"
        />

        <Button v-if="activeStep < 2" label="Next" @click="activeStep++" />
        <Button v-else type="submit" label="Save Job" />
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import JobService from '@/app/services/jobs'
import JobTransportService from '@/app/services/job-transports'
import JobCostService from '@/app/services/job-costs'
import JobRevenueService from '@/app/services/job-revenues'
import ClientService from '@/app/services/clients'
import { useClientStore } from '@/app/stores/client'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const props = defineProps<{
  id?: string
}>()

const jobId = computed<number | null>(() =>
  props.id ? Number(props.id) : null
)

const isEdit = computed(() => jobId.value !== null)

const isLoading = ref(false)
const activeStep = ref(0)

const steps = [
  { label: 'Job Details' },
  { label: 'Transportations' },
  { label: 'Financials' },
]

const original = {
  transports: [] as any[],
  costs: [] as any[],
  revenues: [] as any[],
}


const clientStore = useClientStore()
const clientOptions = computed(() => clientStore.list)

onMounted(async () => {
  try {
    isLoading.value = true

    if (isEdit.value && jobId.value !== null) {
      console.log('[Job Load] ID:', jobId.value)

      const job = await JobService.get(jobId.value)
      console.log('[Job Loaded]', job)

      /* Core */
      form.client_id = job.client.id
      form.status = job.status

      /* Transports */
      form.transports = (job.transports ?? []).map((t: any) => ({
        id: t.id,
        transport_mode: t.transportMode,
        origin: t.origin,
        destination: t.destination,
        sequence: t.sequence,
        status: t.status ?? 'planned',
      }))

      /* Financials */
      form.costs = job.costs ?? []
      form.revenues = job.revenues ?? []

      /* Currency */
      form.currency =
        job.costs?.[0]?.currency ??
        job.revenues?.[0]?.currency ??
        'GBP'

      /* ✅ SNAPSHOT ORIGINAL FORM STATE */
      original.transports = JSON.parse(JSON.stringify(form.transports))
      original.costs = JSON.parse(JSON.stringify(form.costs))
      original.revenues = JSON.parse(JSON.stringify(form.revenues))
    }
  } catch (error: any) {
    console.error('[Job Load Error]', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message ?? 'Failed to load job',
    })
  } finally {
    isLoading.value = false
  }
  
  if (!clientStore.list.length) {
    await clientStore.fetchAll()
  }
})




const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'In Progress', value: 'in_transit' },
  { label: 'Completed', value: 'completed' },
]


const currencyOptions = [
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
]

const transportModeOptions = [
  { label: 'Road', value: 'road' },
  { label: 'Sea', value: 'sea' },
  { label: 'Air', value: 'air' },
]

const transportStatusOptions = [
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]


const form = reactive({
  client_id: null as number | null,
  status: 'draft',
  currency: 'GBP',
  transports: [] as {
    id?: number
    transport_mode: string
    origin: string
    destination: string
    sequence: number
    status: string
    _deleted?: boolean
  }[],
  costs: [] as any[],
  revenues: [] as any[],
})


const currencyLocked = computed(
  () => form.costs.length > 0 || form.revenues.length > 0
)

const costTotal = computed(() =>
  form.costs.reduce((t, c) => t + (Number(c.amount) || 0), 0)
)

const revenueTotal = computed(() =>
  form.revenues.reduce((t, r) => t + (Number(r.amount) || 0), 0)
)

const formattedCostTotal = computed(
  () => new Intl.NumberFormat('en-GB', { style: 'currency', currency: form.currency }).format(costTotal.value)
)

const formattedRevenueTotal = computed(
  () => new Intl.NumberFormat('en-GB', { style: 'currency', currency: form.currency }).format(revenueTotal.value)
)

/* CRUD helpers */
function addTransport() {
  form.transports.push({
    transport_mode: 'road',
    origin: '',
    destination: '',
    sequence: form.transports.length + 1,
    status: 'planned',
  })
}

function removeTransport(i: number) {
  form.transports.splice(i, 1)
}

function addCost() {
  form.costs.push({ description: '', amount: 0 })
}
function removeCost(i: number) {
  form.costs.splice(i, 1)
}

function addRevenue() {
  form.revenues.push({ description: '', amount: 0 })
}
function removeRevenue(i: number) {
  form.revenues.splice(i, 1)
}

function hasChanged(a: any, b: any, keys: string[]) {
  return keys.some(key => a[key] !== b[key])
}

function logStep(title: string, data?: any) {
  if (data !== undefined) {
    console.log(title, JSON.parse(JSON.stringify(data)))
  } else {
    console.log(title)
  }
}

function logDecision(
  action: 'SKIP' | 'CREATE' | 'UPDATE' | 'DELETE',
  scope: string,
  data?: any
) {
  console.log(`➡️ ${action} [${scope}]`, data ?? '')
}

async function submit() {
  const traceId = `JOB_SAVE_${Date.now()}`
  console.group(`🟦 Job Save Start | ${traceId}`)

  /* ---------- FRONTEND VALIDATION ---------- */
  console.group('🔍 Validation')

  if (!form.client_id) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Client is required',
    })
    console.groupEnd()
    console.groupEnd()
    return
  }

  if (form.transports.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'At least one transport leg is required.',
    })
    console.groupEnd()
    console.groupEnd()
    return
  }

  for (const [index, t] of form.transports.entries()) {
    if (!t.origin || !t.destination) {
      toast.add({
        severity: 'warn',
        summary: 'Validation',
        detail: `Transport leg ${index + 1} must have origin and destination`,
      })
      console.groupEnd()
      console.groupEnd()
      return
    }
  }

  console.groupEnd() // Validation
  isLoading.value = true

  try {
    let resolvedJobId: number

    /* =====================================================
     | JOB CREATE (ONLY FOR NEW)
     ===================================================== */
    if (!isEdit.value) {
      console.group('💼 Job CREATE')

      const job = await JobService.create({
        client_id: form.client_id,
        status: form.status,
        currency: form.currency,
      })

      resolvedJobId = job.id
      console.log('Job created:', job)
      console.groupEnd()
    } else {
      resolvedJobId = jobId.value!
    }

    /* =====================================================
     | TRANSPORTS
     ===================================================== */
    console.group('🚚 Transports')

    for (const t of original.transports.filter(
      o => !form.transports.find(n => n.id === o.id)
    )) {
      await JobTransportService.remove(resolvedJobId, t.id)
    }

    for (const t of form.transports) {
      if (!t.id) {
        await JobTransportService.create(resolvedJobId, {
          transport_mode: t.transport_mode,
          sequence: t.sequence,
          origin: t.origin,
          destination: t.destination,
          status: t.status,
        })
        continue
      }

      const originalT = original.transports.find(o => o.id === t.id)
      if (!originalT) continue

      if (!hasChanged(originalT, t, [
        'transport_mode',
        'origin',
        'destination',
        'sequence',
        'status',
      ])) continue

      await JobTransportService.update(resolvedJobId, t.id, {
        transport_mode: t.transport_mode,
        sequence: t.sequence,
        origin: t.origin,
        destination: t.destination,
        status: t.status,
      })
    }

    console.groupEnd()

    /* =====================================================
     | COSTS
     ===================================================== */
    console.group('💸 Costs')

    for (const c of original.costs.filter(
      o => !form.costs.find(n => n.id === o.id)
    )) {
      await JobCostService.remove(resolvedJobId, c.id)
    }

    for (const c of form.costs.filter(c => c.description && c.amount > 0)) {
      if (!c.id) {
        await JobCostService.create(resolvedJobId, {
          description: c.description,
          amount: c.amount,
          currency: form.currency,
        })
        continue
      }

      const originalC = original.costs.find(o => o.id === c.id)
      if (!originalC) continue

      if (!hasChanged(originalC, c, ['description', 'amount'])) continue

      await JobCostService.update(resolvedJobId, c.id, {
        description: c.description,
        amount: c.amount,
        currency: form.currency,
      })
    }

    console.groupEnd()

    /* =====================================================
     | REVENUES
     ===================================================== */
    console.group('💰 Revenues')

    for (const r of original.revenues.filter(
      o => !form.revenues.find(n => n.id === o.id)
    )) {
      await JobRevenueService.remove(resolvedJobId, r.id)
    }

    for (const r of form.revenues.filter(r => r.description && r.amount > 0)) {
      if (!r.id) {
        await JobRevenueService.create(resolvedJobId, {
          description: r.description,
          amount: r.amount,
          currency: form.currency,
        })
        continue
      }

      const originalR = original.revenues.find(o => o.id === r.id)
      if (!originalR) continue

      if (!hasChanged(originalR, r, ['description', 'amount'])) continue

      await JobRevenueService.update(resolvedJobId, r.id, {
        description: r.description,
        amount: r.amount,
        currency: form.currency,
      })
    }

    console.groupEnd()

    /* =====================================================
     | JOB UPDATE (ALWAYS LAST)
     ===================================================== */
    if (isEdit.value) {
      console.group('💼 Job UPDATE (FINAL)')

      await JobService.update(resolvedJobId, {
        client_id: form.client_id,
        status: form.status,
        currency: form.currency,
      })

      console.groupEnd()
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Job saved successfully',
    })

    router.push('/jobs')

  } catch (error: any) {
    console.group('❌ Job Save Error')
    console.error('Trace ID:', traceId)
    console.error(error)
    console.groupEnd()

    const response = error?.response

    if (!response) {
      toast.add({
        severity: 'error',
        summary: 'Network Error',
        detail: 'Unable to reach the server.',
      })
      return
    }

    if (response.status === 422 && response.data?.errors) {
      Object.values(response.data.errors)
        .flat()
        .forEach((msg: any) =>
          toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: String(msg),
          })
        )
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data?.message ?? 'Unexpected error occurred',
    })

  } finally {
    isLoading.value = false
    console.groupEnd()
  }
}


</script>



<style scoped>
.job-form-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-card {
  margin-bottom: 2rem;
}

.card-title-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.w-full {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 2rem;
}

/* Shared visual style only */
.transport-card,
.line-card {
  border: 1px solid var(--pc-border-color);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Cost / Revenue line layout ONLY */
.line-card {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 1rem;
  align-items: center;
}

.totals {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 1.25rem;   /* space from Divider */
  padding-top: 0.75rem;  /* breathing room */

  gap: 1rem;             /* space between label & value */
  font-weight: 500;
}


.transport-header,
.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fieldset-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.fullscreen-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}


@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
