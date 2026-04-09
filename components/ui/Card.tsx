import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rivetCorner?: boolean
  glow?: boolean
}

export default function Card({ className, rivetCorner = false, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border p-6 transition-all duration-200',
        'bg-[var(--color-surface)] border-[var(--color-border)]',
        'hover:border-[rgba(249,115,22,0.3)]',
        glow && 'hover:shadow-[0_0_30px_rgba(249,115,22,0.08)]',
        className
      )}
      {...props}
    >
      {rivetCorner && (
        <div className="absolute top-3 right-3 grid grid-cols-2 gap-[3px] opacity-40">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[4px] h-[4px] rounded-full bg-[var(--color-accent)]" />
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
