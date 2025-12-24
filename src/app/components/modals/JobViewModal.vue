<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Job Details"
    :style="{ width: '720px' }"
    dismissableMask
  >
    <div v-if="job" class="job-view">

      <!-- =========================
           General Information
      ========================= -->
      <Fieldset legend="General Information">
        <div class="info-grid">
          <div>
            <label>Job Reference</label>
            <p>{{ job.reference }}</p>
          </div>

          <div>
            <label>Status</label>
            <div class="status-below">
              <Tag
                :value="formatStatus(job.status)"
                :severity="statusSeverity(job.status)"
              />
            </div>
          </div>

          <div>
            <label>Client</label>
            <p>{{ job.client?.name }}</p>
          </div>
        </div>
      </Fieldset>

      <!-- =========================
           Financials
      ========================= -->
      <Fieldset legend="Financials" class="mt-3">
        <div class="info-grid">
          <div>
            <label>Total Revenue</label>
            <p>${{ job.financials?.totalRevenue?.toLocaleString() ?? 0 }}</p>
          </div>

          <div>
            <label>Total Costs</label>
            <p>${{ job.financials?.totalCosts?.toLocaleString() ?? 0 }}</p>
          </div>

          <div>
            <label>Gross Profit</label>
            <p>${{ job.financials?.grossProfit?.toLocaleString() ?? 0 }}</p>
          </div>
        </div>
      </Fieldset>

    <!-- =========================
        Transport (Transparent Table + Arrows)
    ========================= -->
    <Fieldset
    v-if="job.transports?.length"
    legend="Transport"
    class="mt-3"
    >
    <div class="transport-table">

        <!-- Header -->
        <div class="transport-header">
        <span class="th origin">Origin</span>
        <span class="th arrow"></span>
        <span class="th icon"></span>
        <span class="th arrow"></span>
        <span class="th destination">Destination</span>
        <span class="th mode">Mode</span>
        <span class="th status">Status</span>
        <span class="th updated">Last Updated</span>
        </div>

        <!-- Rows -->
        <div
        v-for="(t, i) in job.transports"
        :key="i"
        class="transport-row"
        >
        <span class="cell origin">{{ t.origin }}</span>
        <span class="arrow">→</span>

        <Icon
            :icon="transportIcon(t.transportMode)"
            width="18"
            class="mode-icon"
        />

        <span class="arrow">→</span>
        <span class="cell destination">{{ t.destination }}</span>

        <span class="cell mode">
            {{ formatTransportMode(t.transportMode) }}
        </span>

        <span class="cell status">
            <Tag
            :value="formatTransportStatus(t.status)"
            :severity="transportStatusSeverity(t.status)"
            />
        </span>

        <span class="cell updated transport-updated">
            {{ formatDate(t.updatedAt ?? t.createdAt) }}
        </span>
        </div>

    </div>
    </Fieldset>

    </div>

    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        class="p-button-text"
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { JobStatus } from '@/app/types/job-ui'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  modelValue: boolean
  job: any | null
}>()

watch(
  () => props.job,
  (job) => {
    console.log('Job changed:', job)
  },
  { immediate: true }
)

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

function statusSeverity(status: JobStatus) {
  switch (status) {
    case 'completed': return 'success'
    case 'in_transit': return 'info'
    case 'draft': return 'warning'
    default: return 'secondary'
  }
}

function formatStatus(status: JobStatus) {
  switch (status) {
    case 'completed': return 'Completed'
    case 'in_transit': return 'In Transit'
    case 'draft': return 'Draft'
    default: return status
  }
}

function transportIcon(mode?: string) {
  switch (mode) {
    case 'road': return 'mdi:truck'
    case 'sea': return 'mdi:ferry'
    case 'air': return 'mdi:airplane'
    default: return 'mdi:map-marker'
  }
}

function formatTransportMode(mode?: string) {
  switch (mode) {
    case 'road': return 'Road'
    case 'sea': return 'Sea'
    case 'air': return 'Air'
    default: return mode ?? ''
  }
}

function transportStatusSeverity(status?: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'in_transit': return 'info'
    case 'planned': return 'warning'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

function formatTransportStatus(status?: string) {
  if (!status) return '-'

  return status
    .replace('_', ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, l => l.toUpperCase())
}

function formatDate(value?: string) {
  console.log('date: ', value);
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}
</script>


<style scoped>
.job-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* =========================
   General Info / Financials
========================= */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--pc-text-muted);
}

p {
  margin: 0.25rem 0 0;
  font-weight: 500;
}

.status-below {
  margin-top: 0.25rem;
}

/* =========================
   Transport Table
========================= */
.transport-table {
  display: grid;
  gap: 0.6rem;
}

/* Header + rows share EXACT grid */
.transport-header,
.transport-row {
  display: grid;
  grid-template-columns:
    1.4fr   /* Origin */
    24px    /* → */
    32px    /* Icon */
    24px    /* → */
    1.4fr   /* Destination */
    0.9fr   /* Mode */
    1fr     /* Status */
    1.2fr;  /* Last Updated */
  align-items: center;
  column-gap: 0.5rem;
}

/* Header */
.transport-header {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--pc-text-muted);
  padding-bottom: 0.25rem;
}

/* Rows */
.transport-row {
  padding: 0.4rem 0;
}

/* Cells */
.cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Alignment */
.origin {
  text-align: right;
}

.destination {
  text-align: left;
}

.mode,
.status,
.updated {
  text-align: center;
}

/* Arrows */
.arrow {
  text-align: center;
  opacity: 0.6;
}

/* Icon */
.mode-icon {
  justify-self: center;
  color: var(--pc-primary);
}

/* Last updated */
.transport-updated {
  font-size: 0.75rem;
  color: var(--pc-text-muted);
}


</style>
