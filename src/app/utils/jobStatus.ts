import type { JobStatus } from '@/app/types/job-ui'

export function jobStatusLabel(status: JobStatus) {
  switch (status) {
    case 'completed': return 'Completed'
    case 'in_transit': return 'In Transit'
    case 'draft': return 'Draft'
    default: return status
  }
}

export function jobStatusSeverity(status: JobStatus) {
  switch (status) {
    case 'completed': return 'success'
    case 'in_transit': return 'info'
    case 'draft': return 'warning'
    default: return 'secondary'
  }
}

/* =========================
   Transport helpers (UI)
========================= */
export function transportIcon(mode?: string) {
  switch (mode) {
    case 'road': return 'mdi:truck'
    case 'sea': return 'mdi:ferry'
    case 'air': return 'mdi:airplane'
    default: return 'mdi:map-marker'
  }
}

export function transportModeLabel(mode?: string) {
  switch (mode) {
    case 'road': return 'Road'
    case 'sea': return 'Sea'
    case 'air': return 'Air'
    default: return mode ?? ''
  }
}
