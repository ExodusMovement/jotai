import { expectType } from 'ts-expect'
import type { TypeEqual } from 'ts-expect'
import { it } from 'vitest'
import { atom } from 'jotai/vanilla'
import type { SetStateAction, WritableAtom } from 'jotai/vanilla'
import { unwrap } from 'jotai/vanilla/utils'

it('unwrap() should return the correct types', () => {
  const getFallbackValue = () => -1
  const syncAtom = atom(0)
  const syncUnwrappedAtom = unwrap(syncAtom, getFallbackValue)
  expectType<
    TypeEqual<
      WritableAtom<number, [SetStateAction<number>], void>,
      typeof syncUnwrappedAtom
    >
  >(true)

  const asyncAtom = atom(Promise.resolve(0))
  const asyncUnwrappedAtom = unwrap(asyncAtom, getFallbackValue)
  expectType<
    TypeEqual<
      WritableAtom<number, [SetStateAction<Promise<number>>], void>,
      typeof asyncUnwrappedAtom
    >
  >(true)

  const maybeAsyncAtom = atom(Promise.resolve(0) as number | Promise<number>)
  const maybeAsyncUnwrappedAtom = unwrap(maybeAsyncAtom, getFallbackValue)
  expectType<
    TypeEqual<
      WritableAtom<number, [SetStateAction<number | Promise<number>>], void>,
      typeof maybeAsyncUnwrappedAtom
    >
  >(true)
})
