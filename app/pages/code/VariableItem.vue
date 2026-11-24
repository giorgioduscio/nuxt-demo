<script setup>
defineProps({
  id: String,
  name: String,
  value: String,
  index: Number,
  variables_delete: Function,
  variables_update: Function,
})
</script>
<template>
  <div class="row g-0 align-items-center">

    <!-- pulsante elimina -->
    <div class="col-auto">
      <button class="p-0 w-40px h-40px btn btn-danger rounded-circle" 
              title="Elimina variabile"
              @click="variables_delete(id)"> 
        <i class="bi bi-trash"></i> 
      </button>
    </div>
    
    <!-- nome variabile -->
    <label :for="id+'-name'" class="d-none">{{ name }}</label>
    <input  :value="name"
            @change="variables_update(id, 'name', $event.target.value)"
            :id="id+'-name'" 
            type="text" 
            class="col max-w-100px form-control text-bg-dark rounded-0 border-0 border-bottom"
            placeholder="Nome variabile">

    <b class="col-auto">=</b>
    
    <!-- valore variabile -->
    <label :for="id+'-value'" class="d-none">{{ value }}</label>
    <input  :value="value"
            @change="variables_update(id, 'value', $event.target.value)"
            :id="id+'-value'" 
            type="text"
            class="col form-control text-bg-dark rounded-0 border-0 border-bottom"
            placeholder="Valore variabile">
  </div>
</template>