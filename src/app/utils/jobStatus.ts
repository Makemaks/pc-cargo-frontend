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
