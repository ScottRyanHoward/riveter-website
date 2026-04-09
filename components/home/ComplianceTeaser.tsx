import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { rulePacks, categoryLabels, type PackCategory } from '@/lib/data/rule-packs'

const showcasePacks = rulePacks.slice(0, 8)

export default function ComplianceTeaser() {
  return (
    <section className="py-20 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Built for every compliance framework
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              15 pre-built packs covering every major cloud provider and compliance standard.
            </p>
          </div>
          <Link
            href="/rule-packs"
            className="shrink-0 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors whitespace-nowrap"
          >
            View all 15 packs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showcasePacks.map((pack) => (
            <div
              key={pack.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[rgba(249,115,22,0.3)] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={pack.category as PackCategory}>{categoryLabels[pack.category]}</Badge>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">{pack.ruleCount} rules</span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mt-2 mb-1">
                {pack.name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                {pack.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
