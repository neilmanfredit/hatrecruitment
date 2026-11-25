'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Silently refreshes the JWT when < 15 min remains. Called on each navigation.
export function SessionRefresher() {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/refresh', { method: 'POST' }).catch(() => null)
  }, [pathname])

  return null
}
