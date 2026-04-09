'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import PackCard from './PackCard'
import { rulePacks, categoryLabels, type PackCategory } from '@/lib/data/rule-packs'

const categories: Array<PackCategory | 'all'> = ['all', 'aws', 'gcp', 'azure', 'kubernetes', 'compliance']

const categoryLabelsWithAll: Record<PackCategory | 'all', string> = {
  all: 'All',
  ...categoryLabels,
}

export default function PackGrid() {
  const [active, setActive] = useState<PackCategory | 'all'>('all')

  const filtered = active === 'all' ? rulePacks : rulePacks.filter((p) => p.category === active)

  const counts: Record<PackCategory | 'all', number> = {
    all: rulePacks.length,
    aws: rulePacks.filter((p) => p.category === 'aws').length,
    gcp: rulePacks.filter((p) => p.category === 'gcp').length,
    azure: rulePacks.filter((p) => p.category === 'azure').length,
    kubernetes: rulePacks.filter((p) => p.category === 'kubernetes').length,
    compliance: rulePacks.filter((p) => p.category === 'compliance').length,
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2',
              active === cat
                ? 'bg-[var(--color-accent)] text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
            )}
          >
            {categoryLabelsWithAll[cat]}
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              active === cat ? 'bg-white/20 text-white' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
            )}>
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </div>
  )
}
