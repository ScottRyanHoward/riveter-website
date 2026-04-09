import Badge from '@/components/ui/Badge'
import { type RulePack, categoryLabels, type PackCategory } from '@/lib/data/rule-packs'

interface PackCardProps {
  pack: RulePack
}

export default function PackCard({ pack }: PackCardProps) {
  const total = pack.severity.critical + pack.severity.high + pack.severity.medium + pack.severity.low

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[rgba(249,115,22,0.35)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.06)] group flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant={pack.category as PackCategory}>{categoryLabels[pack.category]}</Badge>
        <span className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-surface-2)] px-2 py-0.5 rounded">
          {pack.ruleCount} rules
        </span>
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-light)] transition-colors">
        {pack.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 flex-1">
        {pack.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pack.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Severity distribution bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
          <span>Severity distribution</span>
          <div className="flex items-center gap-2">
            {pack.severity.critical > 0 && (
              <span className="text-[var(--color-severity-critical)]">{pack.severity.critical}C</span>
            )}
            {pack.severity.high > 0 && (
              <span className="text-[var(--color-severity-high)]">{pack.severity.high}H</span>
            )}
            {pack.severity.medium > 0 && (
              <span className="text-[var(--color-severity-medium)]">{pack.severity.medium}M</span>
            )}
            {pack.severity.low > 0 && (
              <span className="text-[var(--color-severity-low)]">{pack.severity.low}L</span>
            )}
          </div>
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
          <div
            className="bg-[var(--color-severity-critical)] rounded-l-full"
            style={{ width: `${(pack.severity.critical / total) * 100}%` }}
          />
          <div
            className="bg-[var(--color-severity-high)]"
            style={{ width: `${(pack.severity.high / total) * 100}%` }}
          />
          <div
            className="bg-[var(--color-severity-medium)]"
            style={{ width: `${(pack.severity.medium / total) * 100}%` }}
          />
          <div
            className="bg-[var(--color-severity-low)] rounded-r-full"
            style={{ width: `${(pack.severity.low / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
