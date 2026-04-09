import { cn } from '@/lib/utils'
import GradientText from '@/components/ui/GradientText'

interface PageHeaderProps {
  badge?: string
  title: string
  titleGradient?: string
  description: string
  className?: string
}

export default function PageHeader({ badge, title, titleGradient, description, className }: PageHeaderProps) {
  return (
    <div className={cn('pt-16 pb-12 text-center', className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(249,115,22,0.3)] bg-[var(--color-accent-dim)] text-[var(--color-accent-light)] text-xs font-medium mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          {badge}
        </div>
      )}
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
        {title}
        {titleGradient && (
          <>
            {' '}
            <GradientText>{titleGradient}</GradientText>
          </>
        )}
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  )
}
