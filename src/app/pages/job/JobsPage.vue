<template>
  <ConfirmDialog />

  <div class="jobs-page">
    <!-- Page Header -->
    <header class="page-header">
      <div class="page-header-left">
        <h1>Jobs</h1>
        <p class="text-muted">
          Manage freight jobs, statuses, and financial progress.
        </p>
      </div>

      <Button
        label="New Job"
        icon="pi pi-plus"
        class="p-button-primary"
        @click="createJob"
      />
    </header>

    <!-- KPI Widgets -->
    <section class="kpi-grid">
      <div class="card kpi-card">
        <i class="pi pi-briefcase kpi-icon" />
        <div class="kpi-content">
          <span class="kpi-label">Total Jobs</span>
          <strong class="kpi-value">{{ totalJobs }}</strong>
        </div>
      </div>

      <div class="card kpi-card">
        <i class="pi pi-clock kpi-icon" />
        <div class="kpi-content">
          <span class="kpi-label">In Progress</span>
          <strong class="kpi-value">{{ inProgressJobs }}</strong>
        </div>
      </div>

      <div class="card kpi-card">
        <i class="pi pi-check-circle kpi-icon" />
        <div class="kpi-content">
          <span class="kpi-label">Completed</span>
          <strong class="kpi-value">{{ completedJobs }}</strong>
        </div>
      </div>

      <div class="card kpi-card">
        <i class="pi pi-exclamation-circle kpi-icon" />
        <div class="kpi-content">
          <span class="kpi-label">Draft</span>
          <strong class="kpi-value">{{ draftJobs }}</strong>
        </div>
      </div>
    </section>

    <!-- Jobs Table -->
    <section class="card">
      <DataTable
        :value="jobs"
        paginator
        :rows="10"
        responsiveLayout="scroll"
      >
        <Column field="reference" header="Job Ref" />
        <Column field="client" header="Client" />

        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="formatStatus(data.status)"
              :severity="statusSeverity(data.status)"
              class="job-status-tag"
            />
          </template>
        </Column>

        <Column field="revenue" header="Revenue" class="text-right">
          <template #body="{ data }">
            ${{ data.revenue.toLocaleString() }}
          </template>
        </Column>

        <Column field="profit" header="Profit" class="text-right">
          <template #body="{ data }">
            ${{ data.profit.toLocaleString() }}
          </template>
        </Column>

        <!-- Actions -->
        <Column header="Actions" style="width: 160px">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                icon="pi pi-eye"
                class="p-button-text p-button-sm"
                @click="viewJob(data)"
              />

              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                @click="editJob(data)"
              />

              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import JobService from '@/app/services/jobs'
import { useJobStore } from '@/app/stores/job'
import type { JobStatus } from '@/app/types/job-ui'

const jobStore = useJobStore()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

onMounted(async () => {
  await JobService.all()
})


/**
 * Table rows (UI model)
 */
const jobs = computed(() =>
  jobStore.list.map(job => ({
    id: job.id,
    reference: job.reference || '',
    client: job.client?.name || '',
    status: job.status,
    revenue: job.financials?.totalRevenue ?? 0,
    profit: job.financials?.grossProfit ?? 0,
  }))
)


/* KPI */
const totalJobs = computed(() => jobStore.list.length)
const inProgressJobs = computed(() =>
  jobStore.list.filter(j => j.status === 'in_transit').length
)
const completedJobs = computed(() =>
  jobStore.list.filter(j => j.status === 'completed').length
)
const draftJobs = computed(() =>
  jobStore.list.filter(j => j.status === 'draft').length
)

/* Status helpers */
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

/* Actions */
function createJob() {
  router.push('/jobs/create')
}

function viewJob(job: { id: number }) {
  router.push(`/jobs/${job.id}`)
}

function editJob(job: { id: number }) {
  router.push(`/jobs/${job.id}/edit`)
}

/**
 * ✅ Delete with confirmation modal
 */
function confirmDelete(job: { id: number; reference: string }) {
  confirm.require({
    header: 'Delete Job',
    message: `Are you sure you want to delete job ${job.reference}? This action cannot be undone.`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',

    accept: async () => {
      try {
        await JobService.remove (job.id)

        // Remove from store
        jobStore.setJobs(
          jobStore.list.filter(j => j.id !== job.id)
        )

        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Job ${job.reference} deleted successfully`,
          life: 4000,
        })
      } catch (error: any) {
        console.error('[Job Delete Error]', error)

        toast.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error?.response?.data?.message ??
            'Failed to delete job',
          life: 6000,
        })
      }
    },
  })
}
</script>

<style scoped>
.jobs-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.page-header p {
  max-width: 480px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.page-header-left {
  max-width: 520px;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.text-right {
  text-align: right;
}


.job-status-tag {
  text-transform: capitalize;
  font-weight: 500;
  padding: 0.35rem 0.6rem;
}

.text-right {
  text-align: right;
}


/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem;
  text-align: left;
}

.kpi-icon {
  font-size: 2rem;
  color: var(--pc-primary);
  flex-shrink: 0;
}

.kpi-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem; /* 👈 space between label and number */
}

.kpi-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--pc-text-muted);
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--pc-heading-color);
}


@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
