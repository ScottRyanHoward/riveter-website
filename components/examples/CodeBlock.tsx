'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { cn } from '@/lib/utils'

const theme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#A1A1AA',
    background: 'none',
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: '#A1A1AA',
    background: 'none',
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    margin: 0,
    padding: 0,
  },
  keyword: { color: '#FB923C' },
  string: { color: '#86EFAC' },
  number: { color: '#93C5FD' },
  boolean: { color: '#FB923C' },
  comment: { color: '#52525B', fontStyle: 'italic' },
  'attr-name': { color: '#A78BFA' },
  'attr-value': { color: '#86EFAC' },
  property: { color: '#C4B5FD' },
  punctuation: { color: '#71717A' },
  operator: { color: '#FB923C' },
  function: { color: '#60A5FA' },
  'class-name': { color: '#F9A8D4' },
  tag: { color: '#FB923C' },
  selector: { color: '#A78BFA' },
  important: { color: '#EF4444', fontWeight: 'bold' },
  builtin: { color: '#60A5FA' },
  'atrule': { color: '#FB923C' },
  variable: { color: '#F9A8D4' },
}

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

export default function CodeBlock({ code, language = 'bash', filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-lg overflow-hidden border border-[var(--color-border)]', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          {filename && (
            <span className="text-xs text-[var(--color-text-muted)] font-mono ml-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-severity-low)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="bg-[var(--color-surface)] p-4 overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={theme}
          customStyle={{ margin: 0, padding: 0, background: 'none' }}
          wrapLongLines={false}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
