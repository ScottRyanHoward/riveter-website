import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'critical' | 'high' | 'medium' | 'low' | 'aws' | 'gcp' | 'azure' | 'kubernetes' | 'compliance'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
  accent: 'bg-[var(--color-accent-dim)] text-[var(--color-accent-light)] border-[rgba(249,115,22,0.3)]',
  critical: 'bg-[rgba(239,68,68,0.1)] text-[var(--color-severity-critical)] border-[rgba(239,68,68,0.3)]',
  high: 'bg-[rgba(249,115,22,0.1)] text-[var(--color-severity-high)] border-[rgba(249,115,22,0.3)]',
  medium: 'bg-[rgba(234,179,8,0.1)] text-[var(--color-severity-medium)] border-[rgba(234,179,8,0.3)]',
  low: 'bg-[rgba(34,197,94,0.1)] text-[var(--color-severity-low)] border-[rgba(34,197,94,0.3)]',
  aws: 'bg-[rgba(249,115,22,0.1)] text-[var(--color-accent)] border-[rgba(249,115,22,0.3)]',
  gcp: 'bg-[rgba(66,133,244,0.1)] text-[#4285F4] border-[rgba(66,133,244,0.3)]',
  azure: 'bg-[rgba(0,120,212,0.1)] text-[#0078D4] border-[rgba(0,120,212,0.3)]',
  kubernetes: 'bg-[rgba(50,108,229,0.1)] text-[#326CE5] border-[rgba(50,108,229,0.3)]',
  compliance: 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
