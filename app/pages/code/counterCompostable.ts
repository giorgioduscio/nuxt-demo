// custom hook 
export function useCounter(startValue :number) {
  return new class {
    private count = ref(startValue)
    value =computed(()=> this.count.value )

    increment =()=>{
      this.count.value++
    }
    decrement =()=>{
      this.count.value--
    }
    reset =()=>{
      this.count.value = startValue
    }
  }
}

// pinia store (una sola istanza per tutto il sito)
export const useCounterStore = defineStore('counter', () => {
  return new class {
    private count = ref(0)
    value =computed(()=> this.count.value )

    increment =()=>{
      this.count.value++
    }
    decrement =()=>{
      this.count.value--
    }
    reset =()=>{
      this.count.value = 0
    }
  }
})