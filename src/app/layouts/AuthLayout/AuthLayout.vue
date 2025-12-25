<template>
  <div class="auth-layout">
    <div class="auth-layout-container">
      <header class="auth-header">
        <img
          src="/logo-pc-cargo.png"
          alt="PC Cargo"
          class="auth-logo"
        />

        <h1 class="auth-title">PC Cargo</h1>
        <p class="auth-subtitle">
          Freight & logistics management
        </p>
      </header>

      <main class="auth-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout – router-based layout
</script>

<style scoped src="./AuthLayout.css"></style>
