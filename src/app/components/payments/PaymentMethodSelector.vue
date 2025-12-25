<script setup lang="ts">
import { computed } from 'vue'

type PaymentMethod = 'paypal' | 'stripe'

const props = defineProps<{
  modelValue: PaymentMethod
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PaymentMethod): void
}>()

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const methods = [
  {
    key: 'paypal' as PaymentMethod,
    label: 'Pay with PayPal',
    description: 'Use your PayPal balance or linked card',
    icon: 'pi pi-paypal',
  },
  {
    key: 'stripe' as PaymentMethod,
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: 'pi pi-credit-card',
  },
]
</script>

<template>
  <Card>
    <template #title>
      Select Payment Method
    </template>

    <template #content>
      <div class="payment-methods">
        <div
          v-for="method in methods"
          :key="method.key"
          class="payment-method"
          :class="{ selected: selected === method.key }"
          @click="selected = method.key"
        >
          <!-- HEADER -->
          <div class="method-header">
            <i :class="method.icon" class="method-icon" />

            <div class="method-info">
              <strong>{{ method.label }}</strong>
              <small>{{ method.description }}</small>
            </div>

            <i
              v-if="selected === method.key"
              class="pi pi-check"
            />
          </div>

          <!-- NESTED CONTENT -->
          <div
            v-if="selected === method.key"
            class="method-body"
          >
            <slot
              v-if="method.key === 'paypal'"
              name="paypal"
            />

            <slot
              v-if="method.key === 'stripe'"
              name="stripe"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  border: 1px solid var(--pc-border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.payment-method.selected {
  border-color: var(--pc-primary);
  background: var(--pc-primary-soft);
}

/* HEADER */
.method-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
}

.method-icon {
  font-size: 1.5rem;
  color: var(--pc-primary);
}

.method-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.method-info small {
  color: var(--pc-text-muted);
}

.pi-check {
  color: var(--pc-primary);
}

/* BODY */
.method-body {
  padding: 1rem;
  border-top: 1px dashed var(--pc-border-color);
  display: flex;
  justify-content: center;
}
</style>
