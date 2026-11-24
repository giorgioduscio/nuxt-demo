/* 
classe che esegue automaticamente il bound di tutti i metodi della classe
l'obiettivo è avere una sintassi schematica (simil-angular)
*/
export class BoundClass {
  constructor() {
    let proto = Object.getPrototypeOf(this)
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key === 'constructor') continue

        const descriptor = Object.getOwnPropertyDescriptor(proto, key)
        if (!descriptor || typeof descriptor.value !== 'function') continue

        Object.defineProperty(this, key, {
          value: descriptor.value.bind(this),
          writable: true,
          enumerable: false,   // evita che finisca in Object.entries /cicli for...in
          configurable: true,
        })
      }
      proto = Object.getPrototypeOf(proto)
    }
  }
}