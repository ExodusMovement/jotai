// From: https://github.com/jotaijs/jotai-effect/blob/main/src/observe.ts.
import { getDefaultStore } from '../vanilla.ts'
import type { Effect } from './atomEffect.ts'
import { atomEffect } from './atomEffect.ts'

type Store = ReturnType<typeof getDefaultStore>
type Unobserve = () => void

const storeEffects = new WeakMap<Store, Map<Effect, Unobserve>>()

export function observe(effect: Effect, store: Store): Unobserve {
  if (!storeEffects.has(store)) {
    storeEffects.set(store, new Map<Effect, Unobserve>())
  }
  const effectSubscriptions = storeEffects.get(store)!
  let unobserve = effectSubscriptions.get(effect)
  if (!unobserve) {
    const effectAtom = atomEffect(effect)
    let unsubscribe: (() => void) | void = store.sub(effectAtom, () => {})
    unobserve = () => {
      if (unsubscribe) {
        effectSubscriptions.delete(effect)
        if (effectSubscriptions.size === 0) {
          storeEffects.delete(store)
        }
        unsubscribe = void unsubscribe()
      }
    }
    effectSubscriptions.set(effect, unobserve)
  }
  return unobserve!
}
