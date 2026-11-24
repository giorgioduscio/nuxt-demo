import { ref, computed, watch } from 'vue'
import { toast } from '~~/tools/feedbacksUI'
import { BoundClass } from '~~/tools/boundClass'


interface Variable {
  id: string,
  name: string
  typing: string
  value: any
}

export class CodeComponent extends BoundClass {
  // DATI
  variables = ref<Variable[]>([])
  variables_lenght = computed(()=> this.variables.value.length )
  
  variables_create(){
    this.history_save()
    this.variables.value.push({id: crypto.randomUUID(), name: 'new', typing: 'string', value: '___'})
  }

  variables_update(id:string, key:keyof Variable, value:string){
    this.history_save()
    const targetId = this.variables.value.findIndex(variable => variable.id === id)
    if(targetId === -1) return console.error("Variable not found");

    (this.variables.value?.[targetId] as any)[key] = value
  }

  variables_delete(id:string){
    if(!confirm("Sei sicuro di voler eliminare questa variabile?")) return;
    this.history_save()
    this.variables.value = this.variables.value.filter(variable => variable.id !== id)
  }



  // LOCAL STORAGE
  localstorage_read(){
    if (process.client) {
      const values = localStorage.getItem('variables')
      if (values) {
        this.variables.value = JSON.parse(values)
      }
      toast.secondary(`${this.variables_lenght.value} variabili caricate`)
    }
  }

  localstorage_save(){
    if (!process.client) return;
    localStorage.setItem('variables', JSON.stringify(this.variables.value))

    const feedbackLabel = `${this.variables_lenght.value} variabili salvate`;
    toast.secondary(feedbackLabel)
  }
  
  localstorage_save_watch(){
    watch(
      () => this.variables.value,
      () => {
        this.localstorage_save()
      },
      { deep: true }
    )
  }



  // HISTORY
  // salva lo stato corrente nello storico (chiamato PRIMA delle modifiche)
  private history_save(){
    const clone = JSON.parse(JSON.stringify(this.variables.value))
    this.history_undo.value.push(clone);
    this.history_redo.value = [];
  }
  
  // assegna l'ultimo valore salvato all'array delle variabili
  history_undo = ref<Variable[][]>([])
  history_execute_undo(){
    if(this.history_undo.value.length === 0) return;
    // salva nel redo
    this.history_redo.value.push(
      JSON.parse(JSON.stringify(this.variables.value))
    )
    // ripristina lo stato precedente
    this.variables.value = this.history_undo.value.pop()!
  }

  history_redo = ref<Variable[][]>([])
  history_execute_redo(){
    if(this.history_redo.value.length === 0) return;
    // salva nel undo
    this.history_undo.value.push(
      JSON.parse(JSON.stringify(this.variables.value))
    )
    // ripristina lo stato successivo
    this.variables.value = this.history_redo.value.pop()!
  }
}
