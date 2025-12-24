<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppSidebar from '@/app/components/sidebar/AppSidebar.vue'

const sidebarVisible = ref(true)
const isDesktop = ref(window.innerWidth >= 1024)

function onResize() {
  isDesktop.value = window.innerWidth >= 1024
  if (!isDesktop.value) {
    sidebarVisible.value = false
  }
}

onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <div class="layout">
    <!-- REAL sidebar column on desktop -->
    <aside
      v-if="isDesktop"
      class="sidebar-column"
    >
      <AppSidebar
        v-model:visible="sidebarVisible"
        :embedded="true"
      />
    </aside>

    <!-- Overlay sidebar on mobile -->
    <AppSidebar
      v-else
      v-model:visible="sidebarVisible"
      :embedded="false"
    />

    <!-- CONTENT ALWAYS STARTS AT TOP -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;

  /* 🔑 THIS LINE FIXES IT */
  background-color: var(--pc-bg-page);
}

/* Sidebar defines the left column */
.sidebar-column {
  width: 260px;
  flex-shrink: 0;

  /* 👇 THIS is the separator line */
  border-right: 1px solid var(--pc-border);
  background-color: var(--pc-bg-sidebar);
}

/* Page content */
.content {
  flex: 1;
  padding: 2rem;

  background-color: var(--pc-bg-page);
}

</style>
