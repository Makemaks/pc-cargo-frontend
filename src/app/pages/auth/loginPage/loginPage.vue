<template>
  <Card class="auth-card">
    <template #title>
      Login
    </template>

    <template #content>
      <div class="form-group">
        <label class="form-label">Email</label>
        <InputText
          v-model="email"
          type="email"
          autofocus
        />
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <Password
          v-model="password"
          toggleMask
          :feedback="false"
        />
      </div>
    </template>

    <template #footer>
      <Button
        label="Login"
        icon="pi pi-sign-in"
        class="w-full"
        :loading="loading"
        @click="submit"
      />
    </template>
  </Card>
</template>


<script setup lang="ts">
import { useLoginPage } from './useLoginPage'

const {
  email,
  password,
  loading,
  submit,
} = useLoginPage()
</script>

<style scoped src="./LoginPage.css"></style>
