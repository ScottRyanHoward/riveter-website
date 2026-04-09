import { cn } from '@/lib/utils'

interface RivetDividerProps {
  className?: string
  rivets?: number
}

export default function RivetDivider({ className, rivets = 3 }: RivetDividerProps) {
  return (
    <div className={cn('flex items-center gap-3 my-8', className)}>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <div className="flex items-center gap-2">
        {[...Array(rivets)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-dim)]"
          />
        ))}
      </div>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  )
}
