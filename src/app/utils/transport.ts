/* =========================
   Transport UI helpers
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
    default: return mode ?? '-'
  }
}

export function transportStatusLabel(status?: string) {
  if (!status) return '-'

  return status
    .replace('_', ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, l => l.toUpperCase())
}

export function transportStatusSeverity(status?: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'in_transit': return 'info'
    case 'planned': return 'warning'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

export function formatDate(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}

export function formatTransportMode(mode?: string) {
  switch (mode) {
    case 'road': return 'Road'
    case 'sea': return 'Sea'
    case 'air': return 'Air'
    default: return mode ?? ''
  }
}

export function formatTransportStatus(status?: string) {
  if (!status) return '-'
  return status
    .replace('_', ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, l => l.toUpperCase())
}