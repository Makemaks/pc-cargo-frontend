<template>
  <div class="dashboard">
    <!-- ===============================
         PAGE TITLE
         =============================== -->
    <h1>Dashboard</h1>

    <!-- ===============================
         SECTION 1: KPI WIDGETS
         =============================== -->
    <div class="kpi-grid">
      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-briefcase kpi-icon" />
            <div>
              <span class="kpi-label">Active Jobs</span>
              <span class="kpi-value">{{ activeJobs }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-check-circle kpi-icon" />
            <div>
              <span class="kpi-label">Completed Jobs</span>
              <span class="kpi-value">{{ completedJobs }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-dollar kpi-icon" />
            <div>
              <span class="kpi-label">Total Revenue</span>
              <span class="kpi-value">
                {{ formatCurrency(totalRevenue) }}
              </span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-chart-line kpi-icon" />
            <div>
              <span class="kpi-label">Gross Profit</span>
              <span class="kpi-value">
                {{ formatCurrency(totalGrossProfit) }}
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- ===============================
         SECTION 2: FULL-WIDTH REVENUE TREND
         =============================== -->
    <Card class="chart-card full-width">
      <template #title>Revenue Trend</template>
      <template #content>
        <Chart
          type="line"
          :data="revenueTrendData"
          :options="chartOptions"
        />
      </template>
    </Card>

    <!-- ===============================
         SECTION 3: TWO EQUAL CHARTS
         =============================== -->
    <div class="charts-grid">
      <Card class="chart-card">
        <template #title>Job Status Overview</template>
        <template #content>
          <Chart
            type="doughnut"
            :data="jobStatusChartData"
            :options="chartOptions"
          />
        </template>
      </Card>

      <Card class="chart-card">
        <template #title>Transport Mode Distribution</template>
        <template #content>
          <Chart
            type="pie"
            :data="transportModeChartData"
            :options="chartOptions"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import { useJobStore } from '@/app/stores/job'

/* ===============================
   STORE
=============================== */
const jobStore = useJobStore()

/**
 * Always fetch jobs on dashboard entry
 * (SPA navigation does not reinitialize state)
 */
onMounted(async () => {
  await jobStore.fetchAll()
})

/* ===============================
   KPI COMPUTATIONS
=============================== */
const activeJobs = computed(
  () => jobStore.list.filter(j => j.status === 'in_progress').length
)

const completedJobs = computed(
  () => jobStore.list.filter(j => j.status === 'completed').length
)

const totalRevenue = computed(() =>
  jobStore.list.reduce(
    (sum, j) => sum + (j.financials?.totalRevenue ?? 0),
    0
  )
)

const totalGrossProfit = computed(() =>
  jobStore.list.reduce(
    (sum, j) => sum + (j.financials?.grossProfit ?? 0),
    0
  )
)

/* ===============================
   JOB STATUS CHART
=============================== */
const jobStatusChartData = computed(() => {
  const draft = jobStore.list.filter(j => j.status === 'draft').length
  const inProgress = jobStore.list.filter(j => j.status === 'in_progress').length
  const completed = jobStore.list.filter(j => j.status === 'completed').length

  return {
    labels: ['Draft', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [draft, inProgress, completed],
        backgroundColor: ['#9AA6B2', '#2c2a72', '#2563eb'],
      },
    ],
  }
})

/* ===============================
   TRANSPORT MODE CHART
=============================== */
const transportModeChartData = computed(() => {
  const counts = { road: 0, sea: 0, air: 0 }

  jobStore.list.forEach(job => {
    job.transports?.forEach(t => {
      if (counts[t.transportMode as keyof typeof counts] !== undefined) {
        counts[t.transportMode as keyof typeof counts]++
      }
    })
  })

  return {
    labels: ['Road', 'Sea', 'Air'],
    datasets: [
      {
        data: [counts.road, counts.sea, counts.air],
        backgroundColor: ['#16a34a', '#2563eb', '#9333ea'],
      },
    ],
  }
})

/* ===============================
   REVENUE TREND (BY MONTH)
=============================== */
const revenueTrendData = computed(() => {
  const map: Record<string, number> = {}

  jobStore.list.forEach(job => {
    if (!job.createdAt) return
    const month = job.createdAt.slice(0, 7)
    map[month] = (map[month] ?? 0) + (job.financials?.totalRevenue ?? 0)
  })

  const labels = Object.keys(map).sort()
  const values = labels.map(l => map[l])

  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: values,
        borderColor: '#2c2a72',
        backgroundColor: 'rgba(44, 42, 114, 0.15)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
})

/* ===============================
   CHART OPTIONS
=============================== */
const chartOptions = {
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#9AA6B2' },
    },
  },
  scales: {
    x: { ticks: { color: '#9AA6B2' } },
    y: { ticks: { color: '#9AA6B2' } },
  },
}

/* ===============================
   HELPERS
=============================== */
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===============================
   KPI GRID
=============================== */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.kpi-card {
  background-color: var(--pc-bg-panel);
}

.kpi {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-icon {
  font-size: 1.75rem;
  color: var(--pc-primary);
}

.kpi-label {
  font-size: 0.85rem;
  color: var(--pc-text-muted);
}

.kpi-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--pc-text-main);
}

/* ===============================
   CHARTS (REFERENCE LAYOUT)
=============================== */
.chart-card {
  background-color: var(--pc-bg-panel);
}

.chart-card.full-width {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* ===============================
   RESPONSIVE
=============================== */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
