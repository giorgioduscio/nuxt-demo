<script setup lang="ts">
import type { FormField } from './formField_schema';


const props = defineProps<{
  // Props per il campo generico
  field: FormField;
}>();

// Emetti eventi per v-model
const emit = defineEmits(['update:modelValue']);

// Metodo per aggiornare il valore (usato in @input, @change, ecc.)
const updateValue = (newValue: any) => {
  emit('update:modelValue', newValue);
};
</script>

<template>
  <div v-if="field" class="field-container" :title="field.label">
    <!-- Label con asterisco se obbligatorio -->
    <label :for="field.key">
      {{ field.label }}
      <span v-if="field.asterisk" class="text-danger">*</span>
    </label>

    <!-- Campo in base al tipo -->
    <template v-if="field.type === 'select' && field.options">
      <!-- Select -->
      <select
        :id="field.key"
        :name="field.key"
        :value="field.value"
        @input="updateValue(($event.target as HTMLSelectElement).value)"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': field.validation && !field.validation(field.value) }"
      >
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </template>

    <template v-else-if="field.type === 'radio' && field.options">
      <!-- Radio buttons -->
      <div class="radio-group">
        <label v-for="option in field.options" :key="option.value" class="radio-option">
          <input
            :id="`${field.key}-${option.value}`"
            :name="field.key"
            type="radio"
            :value="option.value"
            :checked="field.value === option.value"
            @change="updateValue(option.value)"
            class="form-radio"
            :class="{ 'is-invalid': field.validation && !field.validation(field.value) }"
          >
          <span>{{ option.label }}</span>
        </label>
      </div>
    </template>

    <template v-else-if="field.type === 'checkbox'">
      <!-- Checkbox -->
      <input
        :id="field.key"
        :name="field.key"
        type="checkbox"
        :checked="field.value"
        @change="updateValue(($event.target as HTMLInputElement).checked)"
        class="form-check-input"
      >
    </template>

    <template v-else-if="field.type === 'textarea'">
      <!-- Textarea -->
      <textarea
        :id="field.key"
        :name="field.key"
        :value="field.value"
        @input="updateValue(($event.target as HTMLTextAreaElement).value)"
        :placeholder="field.placeholder"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': field.validation && !field.validation(field.value) }"
      ></textarea>
    </template>

    <template v-else>
      <!-- Campo di testo (default) -->
      <input
        :id="field.key"
        :name="field.key"
        :type="field.type || 'text'"
        :value="field.value"
        @input="updateValue(($event.target as HTMLInputElement).value)"
        :placeholder="field.placeholder"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': field.validation && !field.validation(field.value) }"
      >
    </template>

    <!-- Messaggi di errore/validazione -->
    <div v-if="field.validation && !field.validation(field.value)" class="text-danger">
      {{ field.errorMessage }}
    </div>

    <!-- Messaggio informativo (es. hint) -->
    <div v-if="field.message" class="field-message">
      {{ field.message }}
    </div>
  </div>
</template>

<style scoped>
.form-control{
  resize: none;
}
</style>