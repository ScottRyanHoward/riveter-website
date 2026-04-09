import { cn } from '@/lib/utils'

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

export default function GradientText({ className, children, ...props }: GradientTextProps) {
  return (
    <span
      className={cn('bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] bg-clip-text text-transparent', className)}
      {...props}
    >
      {children}
    </span>
  )
}
