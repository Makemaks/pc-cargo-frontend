<template>
  <!-- PERMANENT DESKTOP SIDEBAR -->
  <aside
    class="pc-sidebar sidebar-container"
    role="navigation"
    aria-label="Main navigation"
  >
    <!-- Header -->
    <header class="sidebar-header">
      <div class="brand-wrapper">
        <div class="brand-logo-wrapper">
          <img
            src="/logo-pc-cargo.png"
            alt="PC Cargo"
            class="brand-logo"
          />
        </div>

        <span class="brand-text">PC Cargo</span>
      </div>
    </header>


    <!-- Navigation -->
    <nav class="sidebar-menu">
      <ul class="menu-list">
        <li class="menu-item">
          <button
            class="menu-link"
            :class="{ active: isActive('/dashboard') }"
            @click="go('/dashboard')"
          >
            <i class="pi pi-home menu-icon" />
            <span class="menu-text">Dashboard</span>
          </button>
        </li>

        <li class="menu-item">
          <button
            class="menu-link"
            :class="{ active: isActive('/jobs') }"
            @click="go('/jobs')"
          >
            <i class="pi pi-briefcase menu-icon" />
            <span class="menu-text">Jobs</span>
          </button>
        </li>

        <li class="menu-item">
          <button class="menu-link" disabled>
            <i class="pi pi-users menu-icon" />
            <span class="menu-text">Clients</span>
          </button>
        </li>

        <li class="menu-item">
          <button class="menu-link" disabled>
            <i class="pi pi-chart-line menu-icon" />
            <span class="menu-text">Reports</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <footer class="sidebar-footer">
      <div class="user-avatar">JM</div>
      <div class="user-info">
        <span class="user-name">John Mark</span>
        <span class="user-role">Administrator</span>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function go(path: string) {
  router.push(path)
}

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
<style scoped>
/* Root sidebar */
.pc-sidebar {
  width: 280px; /* slightly wider */
  flex-shrink: 0;

  position: sticky;
  top: 0;
  height: 100vh;

  border-right: 1px solid var(--pc-border);
}

/* Container */
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--pc-bg-sidebar);
  color: var(--pc-text-main);
}

/* ===============================
   Header / Brand
   =============================== */

.sidebar-header {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--pc-border);
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.4px;
}

/* ===============================
   Menu
   =============================== */

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding-top: 0.5rem;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0.75rem;
}

.menu-item {
  margin-bottom: 0.5rem;
}

.menu-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 0.9rem 1rem; /* 🔑 BIGGER */

  background: transparent;
  border: none;
  border-radius: 10px;

  color: var(--pc-text-main);
  font-size: 1rem; /* 🔑 BIGGER TEXT */
  font-weight: 600;
  text-align: left;

  cursor: pointer;
  transition: background-color 0.15s ease;
}

.menu-icon {
  font-size: 1.1rem;
  opacity: 0.85;
}

/* Hover */
.menu-link:hover:not(:disabled) {
  background-color: var(--pc-surface-2);
}

/* Active */
.menu-link.active

.menu-link.active .menu-icon {
  opacity: 1;
}

/* Disabled */
.menu-link:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ===============================
   Footer / User
   =============================== */

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid var(--pc-border);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--pc-primary);
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 0.75rem;
  color: var(--pc-text-muted);
}
</style>
