import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <RivetIcon className="w-6 h-6 text-[var(--color-accent)]" />
              <span className="font-bold text-[var(--color-text-primary)]">riveter</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
              Infrastructure validation CLI for Terraform. Catch misconfigurations before they reach production.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/ScottRyanHoward/riveter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Product</h3>
            <ul className="space-y-2">
              {[
                { label: 'Features', href: '/features' },
                { label: 'Rule Packs', href: '/rule-packs' },
                { label: 'Examples', href: '/examples' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Docs */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Documentation</h3>
            <ul className="space-y-2">
              {[
                { label: 'Getting Started', href: '/docs#installation' },
                { label: 'CLI Reference', href: '/docs#scan' },
                { label: 'Custom Rules', href: '/docs#custom-rules' },
                { label: 'CI/CD Integration', href: '/docs#github-actions' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 Scott Howard. Released under the MIT License.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-severity-low)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Open source on GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function RivetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-35, 12, 12)">
        {/* Body with circular die cutout */}
        <path
          fillRule="evenodd"
          d="M4 4.5Q4 3.5 5 3.5H16Q17 3.5 17 4.5V12.5Q17 13.5 16 13.5H5Q4 13.5 4 12.5ZM5.5 8.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0"
        />
        {/* Nose centre barrel */}
        <rect x="17" y="6" width="5" height="4" rx="0.8" />
        {/* Upper step collar on nose */}
        <rect x="17" y="4.5" width="3.5" height="1.5" rx="0.5" />
        {/* Lower step collar on nose */}
        <rect x="17" y="10" width="3.5" height="1.5" rx="0.5" />
        {/* Main handle grip */}
        <path d="M8 13.5L7 21.5Q7 23 8.5 23H10.5Q12 23 12 21.5L11 13.5Z" />
        {/* Squeeze lever */}
        <path d="M12.5 13.5L12 20H15.5L15 13.5Z" />
      </g>
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
