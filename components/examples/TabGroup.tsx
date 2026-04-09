'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabGroupProps {
  tabs: Tab[]
  defaultTab?: string
}

export default function TabGroup({ tabs, defaultTab }: TabGroupProps) {
  const [active, setActive] = useState(defaultTab || tabs[0].id)
  const current = tabs.find((t) => t.id === active)!

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--color-border)] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px',
              active === tab.id
                ? 'text-[var(--color-accent)] border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{current.content}</div>
    </div>
  )
}
