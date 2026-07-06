<script setup lang="ts">
const props = defineProps<{
  fieldKey: string
  value?: any
  label?: string
  hidden_label?: string
  placeholder?: string
  type?: string
  input_class?: string
  inline?: boolean
  asterisk?: boolean
  validation?: (val: any) => boolean
  errorMessage?: string
  message?: string
  options?: { label: string; value: string | number }[]
}>()

const emit = defineEmits(['update:modelValue'])
const updateValue = (newValue: any) => emit('update:modelValue', newValue)

const resolvedPlaceholder = computed(() => props.placeholder ?? props.label ?? props.hidden_label ?? '')
const resolvedType        = computed(() => props.type ?? 'text')
const isInvalid           = computed(() => !!props.validation && !props.validation(props.value))

// label e hidden_label sono mutualmente esclusivi: uno solo deve essere truthy
watchEffect(() => {
  const hasLabel       = !!props.label
  const hasHiddenLabel = !!props.hidden_label
  if (hasLabel === hasHiddenLabel) {
    console.error(
      `[Field fieldKey="${props.fieldKey}"] Passa label (visibile) OPPURE hidden_label (visually-hidden), non entrambi né nessuno.`
    )
  }
})
</script>

<template>
  <div :class="[{ 'row align-items-center': inline }]" :title="label || hidden_label">

    <!-- LABEL visibile -->
    <div v-if="label" :class="{ 'col-auto': inline }">
      <label :for="fieldKey"
             class="d-grid gap-2"
             style="grid-template-columns: 1fr auto;">
        <span class="text-truncate">{{ label }}</span>
        <span v-if="asterisk" class="text-danger">*</span>
      </label>
    </div>

    <!-- LABEL nascosta (accessibilità) -->
    <label v-if="hidden_label" :for="fieldKey" class="visually-hidden">
      {{ hidden_label }}
    </label>

    <div :class="{ 'col': inline }">
      <!-- SELECT -->
      <select
        v-if="resolvedType === 'select' && options"
        :id="fieldKey"
        :name="fieldKey"
        :value="value"
        @input="updateValue(($event.target as HTMLSelectElement).value)"
        :class="['form-select', input_class, { 'is-invalid': isInvalid }]">
        <option value="" disabled>{{ label || hidden_label }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <!-- RADIO -->
      <div v-else-if="resolvedType === 'radio' && options" class="radio-group">
        <label v-for="opt in options" :key="opt.value" class="radio-option">
          <input
            :id="`${fieldKey}-${opt.value}`"
            :name="fieldKey"
            type="radio"
            :value="opt.value"
            :checked="value === opt.value"
            @change="updateValue(opt.value)"
            class="form-radio"
            :class="{ 'is-invalid': isInvalid }"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>

      <!-- CHECKBOX -->
      <input
        v-else-if="resolvedType === 'checkbox'"
        :id="fieldKey"
        :name="fieldKey"
        type="checkbox"
        :checked="value"
        @change="updateValue(($event.target as HTMLInputElement).checked)"
        class="form-check-input">

      <!-- TEXTAREA -->
      <textarea
        v-else-if="resolvedType === 'textarea'"
        :id="fieldKey"
        :name="fieldKey"
        :value="value"
        @input="updateValue(($event.target as HTMLTextAreaElement).value)"
        :placeholder="resolvedPlaceholder"
        :class="['form-control', input_class, { 'is-invalid': isInvalid }]"
      ></textarea>

      <!-- DEFAULT INPUT -->
      <input
        v-else
        :id="fieldKey"
        :name="fieldKey"
        :type="resolvedType"
        :value="value"
        @input="updateValue(($event.target as HTMLInputElement).value)"
        :placeholder="resolvedPlaceholder"
        :class="['form-control', input_class, { 'is-invalid': isInvalid }]">
    </div>

    <!-- Errore validazione -->
    <div v-if="isInvalid" :class="{ 'col-12': inline }">
      <span class="text-danger">{{ errorMessage }}</span>
    </div>

    <!-- Hint -->
    <div v-if="message" :class="{ 'col-12': inline }">
      {{ message }}
    </div>
  </div>
</template>
