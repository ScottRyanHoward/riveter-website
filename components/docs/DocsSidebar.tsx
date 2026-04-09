'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { docsStructure } from '@/lib/data/docs-structure'

export default function DocsSidebar() {
  const [active, setActive] = useState('introduction')

  useEffect(() => {
    const headings = document.querySelectorAll('[data-doc-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="sticky top-24 space-y-6">
      {docsStructure.map((section) => (
        <div key={section.id}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 px-3">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    'block px-3 py-1.5 rounded-md text-sm transition-colors',
                    active === item.id
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent-dim)] border-l-2 border-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
