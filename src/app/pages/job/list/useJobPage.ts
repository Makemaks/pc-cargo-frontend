import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useJobStore } from '@/app/stores/job'
import {
  jobStatusLabel,
  jobStatusSeverity,
} from '@/app/utils/jobStatus'

export function useJobPage() {
  const jobStore = useJobStore()
  const router = useRouter()
  const toast = useToast()
  const confirm = useConfirm()

  const showViewModal = ref(false)
  const selectedJob = ref<any | null>(null)

  /**
   * Load jobs
   */
  onMounted(() => {
    jobStore.fetchAll()
  })

  /**
   * Table rows (UI model)
   */
  const jobs = computed(() =>
    jobStore.list.map(job => ({
      id: job.id,
      reference: job.reference,
      client: job.client?.name ?? '',
      status: job.status,
      revenue: job.financials.totalRevenue,
      profit: job.financials.grossProfit,
    }))
  )

  /**
   * KPI widgets
   */
  const kpis = computed(() => [
    {
      label: 'Total Jobs',
      value: jobStore.list.length,
      icon: 'pi pi-briefcase',
    },
    {
      label: 'In Progress',
      value: jobStore.list.filter(j => j.status === 'in_transit').length,
      icon: 'pi pi-clock',
    },
    {
      label: 'Completed',
      value: jobStore.list.filter(j => j.status === 'completed').length,
      icon: 'pi pi-check-circle',
    },
    {
      label: 'Draft',
      value: jobStore.list.filter(j => j.status === 'draft').length,
      icon: 'pi pi-exclamation-circle',
    },
  ])

  /**
   * Actions
   */
  function createJob() {
    router.push('/jobs/create')
  }

  function viewJob(id: number) {
    selectedJob.value = jobStore.getById(id) ?? null
    showViewModal.value = true
  }

  function editJob(id: number) {
    router.push(`/jobs/${id}/edit`)
  }

  function confirmDelete(job: { id: number; reference: string }) {
    confirm.require({
      header: 'Delete Job',
      message: `Are you sure you want to delete job ${job.reference}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',

      accept: async () => {
        try {
          await jobStore.deleteJob(job.id)

          toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `Job ${job.reference} deleted successfully`,
            life: 4000,
          })
        } catch (error) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete job',
            life: 6000,
          })
        }
      },
    })
  }

  return {
    jobs,
    kpis,
    showViewModal,
    selectedJob,
    createJob,
    viewJob,
    editJob,
    confirmDelete,
    jobStatusLabel,
    jobStatusSeverity,
  }
}
