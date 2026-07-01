<script setup lang="ts" generic="T extends Record<string, any>">
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<T[]>,
    required: true,
  },
  // Schema per definire i campi di ogni oggetto nella lista
  // Es: [{ key: 'title', label: 'Titolo', type: 'text' }, ...]
  schema: {
    type: Array as PropType<{ key: keyof T; label: string; type: string; placeholder?: string }[]>,
    required: true,
  },
  // Testo per il pulsante "Aggiungi"
  addButtonText: {
    type: String,
    default: 'Aggiungi elemento',
  },
});

const emit = defineEmits(['update:modelValue']);

// Clona il modelValue per evitare mutazioni dirette
const items = ref<T[]>(JSON.parse(JSON.stringify(props.modelValue)));

// Aggiungi un nuovo elemento vuoto
function addItem() {
  const newItem = {} as T;
  props.schema.forEach((field) => {
    newItem[field.key] = '' as any;
  });
  items.value.push(newItem as any);
  emit('update:modelValue', items.value);
}

// Rimuovi un elemento per indice
function removeItem(index: number) {
  items.value = items.value.filter((_, i) => i !== index);
  emit('update:modelValue', items.value);
}

// Aggiorna un campo di un elemento
function updateField(index: number, fieldKey: keyof T, value: any) {
  (items.value[index] as any)[fieldKey] = value;
  emit('update:modelValue', items.value);
}

// Sincronizza con il modelValue esterno (se cambia)
watch(() => props.modelValue, (newVal) => {
  items.value = JSON.parse(JSON.stringify(newVal));
}, { deep: true });
</script>

<template>
  <div class="p-2 border rounded">

    <button @click="addItem" class="btn btn-sm btn-secondary mt-2">
      <i class="bi bi-plus-lg"></i> {{ addButtonText }}
    </button>

    <div v-for="(item, index) in items" :key="index">
      <div class="py-2 row g-2 align-items-end">

        <div class="col-auto">
          <button @click="removeItem(index)" class="btn btn-sm btn-danger text-truncate">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div v-for="field in schema" :key="field.key" class="col">
          <label :for="`${index}-${String(field.key)}`">{{ field.label }}</label>
          <input
            :id="`${index}-${String(field.key)}`"
            :type="field.type"
            :value="(item as any)[field.key]"
            :placeholder="field.placeholder"
            @input="(e) => updateField(index, field.key, (e.target as HTMLInputElement).value)"
            class="form-control form-control-sm"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.form-control{
  min-width: 150px;
}
</style>