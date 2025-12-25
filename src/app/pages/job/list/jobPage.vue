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
      <div
        class="card kpi-card"
        v-for="kpi in kpis"
        :key="kpi.label"
      >
        <i :class="kpi.icon" class="kpi-icon" />
        <div class="kpi-content">
          <span class="kpi-label">{{ kpi.label }}</span>
          <strong class="kpi-value">{{ kpi.value }}</strong>
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
              :value="jobStatusLabel(data.status)"
              :severity="jobStatusSeverity(data.status)"
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
                @click="viewJob(data.id)"
              />
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                @click="editJob(data.id)"
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

    <JobViewModal
      v-model="showViewModal"
      :job="selectedJob"
    />
  </div>
</template>

<script setup lang="ts">
import JobViewModal from '@/app/components/modals/JobViewModal.vue'
import { useJobPage } from './useJobPage'

const {
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
} = useJobPage()
</script>


<style scoped src="./JobPage.css"></style>
