import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CTABanner() {
  return (
    <section className="py-20 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-[rgba(249,115,22,0.2)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] overflow-hidden p-10 text-center">
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.08),transparent_70%)]" />

          {/* Rivet corners */}
          {[
            'top-4 left-4',
            'top-4 right-4',
            'bottom-4 left-4',
            'bottom-4 right-4',
          ].map((pos) => (
            <div key={pos} className={`absolute ${pos} grid grid-cols-2 gap-[3px] opacity-40`}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[5px] h-[5px] rounded-full bg-[var(--color-accent)]" />
              ))}
            </div>
          ))}

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Ready to validate your infrastructure?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
              Install riveter in seconds with Homebrew and scan your first Terraform file.
            </p>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] font-mono text-sm text-[var(--color-text-primary)] mb-8">
              <span className="text-[var(--color-accent)]">$</span>
              brew install ScottRyanHoward/riveter/riveter
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/docs">
                <Button size="lg" className="gap-2">
                  Read the Docs <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="secondary" size="lg">
                  Browse Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
