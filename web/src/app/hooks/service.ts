import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import AuthenticationService from '../services/authentication'

/**
* Component don't have ability to handle async task like calling API and error handling
* component should only care about how to display data
* and those async task should be handle carefully to not blocking the Ui thread
* These Utils will help:
* + Factory pattern: Ui don't need to care about init services
* + Handle async task and convert to usePromise hook
*/
type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>

type UsePromiseReturn<T extends any[], R> = [
  () => Promise<void>,
  R | null,
  any,
  ...{ [K in keyof T]: (value: T[K]) => void }
];

export function usePromise<T extends any[], R>(fn: AsyncFunction<T, R>): UsePromiseReturn<T, R> {
  const [err, updateErr] = useState<any>(null)
  const [data, updateData] = useState<R | null>(null)
  const paramRefs = useRef(<(T[keyof T])[]>(fn.length > 0 ? new Array(fn.length).fill(null) : []))

  useEffect(() => {
    if (err) {
      setTimeout(() => {
        updateErr(null)
      }, 6000)
    }
  }, [err])

  const paramSetters = useMemo(
    () =>
      paramRefs.current.map((_, index) => (value: T[keyof T]) => {
        paramRefs.current[index] = value
      }),
    [])

  const trigger = useMemo(
    () => async () => {
      try {
        const result = await fn(...(paramRefs.current as T))
        updateData(result)
      } catch (error) {
        updateErr(error)
      }
    },
    [fn]
  )

  return [trigger, data, err,  ...paramSetters] as UsePromiseReturn<T, R>
}

export function useService() {
  return {
    auth: () => {
      const authService = useMemo(() => new AuthenticationService(), [])
      return {
        signupByEmail: usePromise(authService.signupByEmail.bind(authService))
      }
    }
  }
}
