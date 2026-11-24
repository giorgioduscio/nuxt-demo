<script setup lang="ts">
import { onMounted } from 'vue'
import { CodeComponent } from './codeComponent';
import VariableItem from './VariableItem.vue';
import { useCounter, useCounterStore } from './counterCompostable';

definePageMeta({
  layout: 'default'
})
const app = new CodeComponent()
onMounted(()=>{
  app.localstorage_read()
  app.localstorage_save_watch()
})

const counters =[
  {color: 'primary', counter: useCounter(0)},
  {color: 'secondary', counter: useCounter(0)},
  {color: 'success', counter: useCounterStore(0)},
  {color: 'success', counter: useCounterStore(0)},
]

</script>
<template>
  <section class="container p-0">  
    <!-- 2) VARIABILI -->
    <details open class="my-5 p-2 text-bg-dark border rounded">
      <summary>
        Variabili 
        <span v-if="app.variables_lenght">{{ app.variables_lenght }}</span>

        <button class="btn btn-secondary ms-2" 
                :disabled="app.history_undo.value.length === 0"
                @click="app.history_execute_undo()">
          <i class="bi bi-arrow-left"></i>
        </button>
        <button class="btn btn-secondary ms-2" 
                :disabled="app.history_redo.value.length === 0"
                @click="app.history_execute_redo()">
          <i class="bi bi-arrow-right"></i>
        </button>
      </summary>
      <div class="pt-3 row g-3">
        <div v-for="{id, name, value} in app.variables.value" :key="id" class="min-w-200px max-w-600px col-12 col-sm">
          <VariableItem 
            :id="id" 
            :name="name" 
            :value="value"
            :variables_delete="app.variables_delete"
            :variables_update="app.variables_update"
          />
        </div>

        <!-- nuova variabile -->
        <div class="col-12">
          <button class="btn btn-primary" 
                  @click="app.variables_create()"> 
            <i class="bi bi-plus-lg"></i> 
            <span class="d-none d-sm-inline ms-2">Aggiungi nuova variabile</span>
          </button>
        </div>
      </div>
    </details>
    
    
    
    <div class="py-3 d-flex flex-wrap align-items-center gap-2">
      <div v-for="{id, name, value} in app.variables.value" :key="id" class="btn btn-secondary">
        <label :for="name">{{ name }}:</label> <strong>{{ value }}</strong>
      </div>
    </div>

    <!-- contatori -->
    <div class="d-flex flex-wrap gap-2">
      <div v-for="{counter, color},_i in counters" :key="_i" class="w-fit-content input-group bg-dark">
        <button :class="['btn', 'btn-' + color]" 
                @click="counter.decrement()"
                title="Decrementa contatore">
          -
        </button>
        <button :class="['btn', 'btn-outline-' + color]" 
                @click="counter.reset()"
                title="Resetta contatore">
          {{ counter.value }}
        </button>
        <button :class="['btn', 'btn-' + color]" 
                @click="counter.increment()"
                title="Incrementa contatore">
          +
        </button>
      </div>
    </div>

  </section>
</template>