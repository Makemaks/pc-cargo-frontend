<template>
  <div class="dashboard">
    <!-- Page Title -->
    <h1>Dashboard</h1>

    <!-- ===============================
         TOP KPI WIDGETS
         =============================== -->
    <div class="kpi-grid">
      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-briefcase kpi-icon" />
            <div>
              <span class="kpi-label">Active Jobs</span>
              <span class="kpi-value">12</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-check-circle kpi-icon" />
            <div>
              <span class="kpi-label">Completed Jobs (MTD)</span>
              <span class="kpi-value">34</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-dollar kpi-icon" />
            <div>
              <span class="kpi-label">Revenue (MTD)</span>
              <span class="kpi-value">$128,400</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #content>
          <div class="kpi">
            <i class="pi pi-chart-line kpi-icon" />
            <div>
              <span class="kpi-label">Gross Profit (MTD)</span>
              <span class="kpi-value">$42,950</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- ===============================
         CHARTS SECTION
         =============================== -->
    <div class="charts-grid">
      <Card>
        <template #title>Job Status Overview</template>
        <template #content>
          <Chart
            type="doughnut"
            :data="jobsChartData"
            :options="chartOptions"
          />
        </template>
      </Card>

      <Card>
        <template #title>Revenue Trend</template>
        <template #content>
          <Chart
            type="line"
            :data="revenueChartData"
            :options="chartOptions"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Chart from 'primevue/chart'

/**
 * Mock chart data (API-ready later)
 */
const jobsChartData = {
  labels: ['Draft', 'In Progress', 'Completed'],
  datasets: [
    {
      data: [6, 12, 34],
      backgroundColor: [
        '#9AA6B2',   // muted
        '#2c2a72',   // brand blue
        '#2563eb',   // accent blue
      ],
    },
  ],
}

const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Revenue',
      data: [42000, 38000, 51000, 46000, 58000],
      borderColor: '#2c2a72',
      backgroundColor: 'rgba(44, 42, 114, 0.15)',
      tension: 0.4,
      fill: true,
    },
  ],
}

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#0f172a',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#9AA6B2',
      },
    },
    y: {
      ticks: {
        color: '#9AA6B2',
      },
    },
  },
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* KPI widgets */
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
  display: block;
}

.kpi-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--pc-text-main);
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
