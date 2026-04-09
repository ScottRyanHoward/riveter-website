import Link from 'next/link'
import { Package, FileOutput, Sparkles, Shield, Cpu, GitBranch } from 'lucide-react'
import Card from '@/components/ui/Card'

const features = [
  {
    icon: Package,
    title: '15 Compliance Packs',
    description: 'Pre-built rule sets for AWS, GCP, Azure, Kubernetes, CIS, HIPAA, PCI-DSS, SOC 2, and more.',
    href: '/rule-packs',
    linkLabel: 'Browse packs',
  },
  {
    icon: FileOutput,
    title: '5 Output Formats',
    description: 'Table for dev review, JSON for pipelines, SARIF for GitHub scanning, JUnit XML for CI, HTML for reports.',
    href: '/features#output-formats',
    linkLabel: 'See formats',
  },
  {
    icon: Sparkles,
    title: 'AI Rule Generation',
    description: 'Describe a compliance requirement in plain English. Claude generates an enforceable YAML rule.',
    href: '/features#ai-rules',
    linkLabel: 'Learn more',
  },
  {
    icon: Shield,
    title: 'Custom Rules',
    description: 'Write rules in plain YAML. Dot-notation for nested properties, regex support, no scripting required.',
    href: '/features#custom-rules',
    linkLabel: 'See syntax',
  },
  {
    icon: Cpu,
    title: 'State File Scanning',
    description: 'Scan deployed Terraform state files to detect drift and violations in live infrastructure.',
    href: '/features#state-scanning',
    linkLabel: 'Learn more',
  },
  {
    icon: GitBranch,
    title: 'CI/CD Integration',
    description: 'Non-zero exit codes on violations. Native GitHub Actions, GitLab CI, and SARIF upload support.',
    href: '/docs#github-actions',
    linkLabel: 'View examples',
  },
]

export default function FeatureGrid() {
  return (
    <section className="py-20 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
            Everything you need
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            From scanning to reporting to AI-powered rule creation — riveter covers the full lifecycle of infrastructure compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} rivetCorner glow className="group">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors inline-flex items-center gap-1"
                >
                  {feature.linkLabel} →
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
