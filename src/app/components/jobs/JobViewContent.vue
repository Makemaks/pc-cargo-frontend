<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { PublicJob } from '@/app/types/job'
import {
  jobStatusLabel,
  jobStatusSeverity,
} from '@/app/utils/jobStatus'
import {
  transportIcon,
  formatTransportMode,
  formatTransportStatus,
  transportStatusSeverity,
} from '@/app/utils/transport'

defineProps<{
  job: PublicJob
}>()

function formatDate(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}
</script>

<template>
  <div class="job-view">

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
              :value="jobStatusLabel(job.status)"
              :severity="jobStatusSeverity(job.status)"
            />
          </div>
        </div>

        <div v-if="job.client">
          <label>Client</label>
          <p>{{ job.client.name }}</p>
        </div>
      </div>
    </Fieldset>

    <!-- =========================
         Transport (Table + Arrows)
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
</template>

<style scoped>
.job-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* =========================
   General Info
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

.transport-header,
.transport-row {
  display: grid;
  grid-template-columns:
    1.4fr
    24px
    32px
    24px
    1.4fr
    0.9fr
    1fr
    1.2fr;
  align-items: center;
  column-gap: 0.5rem;
}

.transport-header {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--pc-text-muted);
  padding-bottom: 0.25rem;
}

.transport-row {
  padding: 0.4rem 0;
}

.cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

.arrow {
  text-align: center;
  opacity: 0.6;
}

.mode-icon {
  justify-self: center;
  color: var(--pc-primary);
}

.transport-updated {
  font-size: 0.75rem;
  color: var(--pc-text-muted);
}
</style>
