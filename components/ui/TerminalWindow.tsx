'use client'

import { cn } from '@/lib/utils'

export interface TerminalSegment {
  text: string
  className?: string
}

export interface TerminalLine {
  text?: string
  segments?: TerminalSegment[]
  type?: 'command' | 'success' | 'error' | 'warning' | 'info' | 'output'
}

interface TerminalWindowProps {
  title?: string
  lines: TerminalLine[]
  className?: string
}

const lineColors: Record<string, string> = {
  command: 'text-[var(--color-text-primary)]',
  success: 'text-[var(--color-severity-low)]',
  error: 'text-[var(--color-severity-critical)]',
  warning: 'text-[var(--color-severity-medium)]',
  info: 'text-[var(--color-text-secondary)]',
  output: 'text-[var(--color-text-secondary)]',
}

export default function TerminalWindow({ title = 'terminal', lines, className }: TerminalWindowProps) {
  return (
    <div className={cn('rounded-lg overflow-hidden border border-[var(--color-border)] shadow-xl', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="flex-1 text-center text-xs text-[var(--color-text-muted)] font-mono">{title}</span>
      </div>

      {/* Body */}
      <div className="bg-[var(--color-surface)] p-4 font-mono text-sm space-y-0.5 min-h-[120px] overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className={cn('leading-relaxed whitespace-pre', lineColors[line.type || 'output'])}>
            {line.segments ? (
              <>
                {line.segments.map((seg, j) => (
                  <span key={j} className={seg.className}>{seg.text}</span>
                ))}
              </>
            ) : (
              <>
                {line.type === 'command' && (
                  <span className="text-[var(--color-accent)] mr-2">$</span>
                )}
                <span>{line.text}</span>
              </>
            )}
          </div>
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[var(--color-accent)]">$</span>
          <span className="w-2 h-4 bg-[var(--color-accent)] opacity-70 animate-[blink_1s_step-end_infinite]" />
        </div>
      </div>
    </div>
  )
}
