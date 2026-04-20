'use client'

import { cn } from '@/lib/utils'

export interface TerminalSegment {
  text: string
  className?: string
}

export interface TerminalColumn {
  text: string
  className?: string
  width?: string  // CSS width, e.g. '8ch'
  flex?: boolean  // takes remaining space
}

export interface TerminalLine {
  text?: string
  segments?: TerminalSegment[]
  columns?: TerminalColumn[]
  type?: 'command' | 'success' | 'error' | 'warning' | 'info' | 'output'
}

interface TerminalWindowProps {
  title?: string
  lines: TerminalLine[]
  className?: string
  maxHeight?: string
  compact?: boolean
}

const lineColors: Record<string, string> = {
  command: 'text-[var(--color-text-primary)]',
  success: 'text-[var(--color-severity-low)]',
  error: 'text-[var(--color-severity-critical)]',
  warning: 'text-[var(--color-severity-medium)]',
  info: 'text-[var(--color-text-secondary)]',
  output: 'text-[var(--color-text-secondary)]',
}

export default function TerminalWindow({ title = 'terminal', lines, className, maxHeight, compact }: TerminalWindowProps) {
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
      <div
        className={cn(
          'bg-[var(--color-surface)] p-4 font-mono space-y-0.5 min-h-[120px] overflow-x-auto',
          compact ? 'text-xs' : 'text-sm',
          maxHeight && 'overflow-y-auto',
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'leading-relaxed',
              line.columns ? 'flex' : 'whitespace-pre',
              lineColors[line.type || 'output'],
            )}
          >
            {line.columns ? (
              line.columns.map((col, j) => (
                <span
                  key={j}
                  className={cn('whitespace-pre shrink-0', col.className, col.flex && 'flex-1 shrink min-w-0')}
                  style={!col.flex && col.width ? { width: col.width } : undefined}
                >
                  {col.text}
                </span>
              ))
            ) : line.segments ? (
              line.segments.map((seg, j) => (
                <span key={j} className={seg.className}>{seg.text}</span>
              ))
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
