import { useState, useCallback } from 'react'

const KEY = 'cooked-meals'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function save(set: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function useCooked() {
  const [cooked, setCooked] = useState<Set<string>>(load)

  const toggle = useCallback((country: string) => {
    setCooked(prev => {
      const next = new Set(prev)
      if (next.has(country)) {
        next.delete(country)
      } else {
        next.add(country)
      }
      save(next)
      return next
    })
  }, [])

  const isCooked = useCallback((country: string) => cooked.has(country), [cooked])

  return { isCooked, toggle }
}
