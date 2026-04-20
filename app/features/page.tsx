import Link from 'next/link'
import { Shield, FileCode, Cpu, Sparkles, FileOutput, GitBranch, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import TerminalWindow from '@/components/ui/TerminalWindow'
import CodeBlock from '@/components/examples/CodeBlock'

export const metadata = {
  title: 'Features — riveter',
  description: 'Explore all riveter features: scanning, compliance packs, custom rules, state scanning, AI rule generation, and CI/CD integration.',
}

const outputFormats = [
  {
    id: 'table',
    name: 'Table',
    use: 'Default terminal output',
    badge: 'default' as const,
  },
  {
    id: 'json',
    name: 'JSON',
    use: 'Programmatic processing, dashboards',
    badge: 'default' as const,
  },
  {
    id: 'sarif',
    name: 'SARIF',
    use: 'GitHub Advanced Security inline annotations',
    badge: 'default' as const,
  },
  {
    id: 'junit',
    name: 'JUnit XML',
    use: 'CI/CD pipeline test reporting',
    badge: 'default' as const,
  },
  {
    id: 'html',
    name: 'HTML Report',
    use: 'Browser-ready interactive reports',
    badge: 'default' as const,
  },
]

const customRuleCode = `# custom-rules.yaml
rules:
  - id: require-s3-versioning
    name: S3 Bucket Must Have Versioning Enabled
    severity: medium
    description: All S3 buckets must have versioning enabled for data recovery
    resource_type: aws_s3_bucket
    conditions:
      - field: versioning.enabled
        operator: equals
        value: true

  - id: rds-deletion-protection
    name: RDS Instance Must Have Deletion Protection
    severity: high
    description: Prevents accidental deletion of production databases
    resource_type: aws_db_instance
    conditions:
      - field: deletion_protection
        operator: equals
        value: true
      - field: backup_retention_period
        operator: greater_than
        value: 6`

const cicdCode = `# .github/workflows/infra-validation.yml
name: Infrastructure Validation
on: [pull_request]

jobs:
  riveter:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install riveter
        run: brew install ScottRyanHoward/riveter/riveter

      - name: Scan Terraform
        run: |
          riveter scan \\
            -p aws-security \\
            -t ./main.tf \\
            -f sarif \\
            -o results.sarif

      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif`

const aiRulesTerminalLines = [
  { text: 'riveter generate-rules ./terraform/main.tf', type: 'command' as const },
  { text: 'Analyzing resource types in main.tf...', type: 'info' as const },
  { text: 'Found: aws_s3_bucket, aws_db_instance, aws_security_group', type: 'output' as const },
  { text: '', type: 'output' as const },
  { text: 'Generating rules with AI...', type: 'info' as const },
  { text: '✓  Generated 5 rules for aws_s3_bucket', type: 'success' as const },
  { text: '✓  Generated 4 rules for aws_db_instance', type: 'success' as const },
  { text: '✓  Generated 3 rules for aws_security_group', type: 'success' as const },
  { text: '', type: 'output' as const },
  { text: 'Rules saved to: ./riveter-generated-rules.yaml', type: 'success' as const },
]


export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <PageHeader
        badge="Full Feature Overview"
        title="Everything you need to"
        titleGradient="validate at scale"
        description="From scanning to reporting to AI-powered rule creation — riveter covers the full lifecycle of infrastructure compliance."
      />

      <div className="space-y-0">

        {/* Core Scanning */}
        <section id="scanning" className="py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Core Scanning</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Point riveter at any Terraform file or directory. It recursively finds all <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">.tf</code> files,
                maps resources to rule violations, and produces a prioritized report.
              </p>
              <ul className="space-y-3">
                {[
                  'Recursive directory scanning',
                  'Non-zero exit code on violations — ideal for CI/CD gates',
                  'Select one or multiple compliance packs and/or custom rule files per scan',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-severity-low)] mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
              <div className="px-4 py-3 bg-[var(--color-surface-2)] border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-mono">
                Usage
              </div>
              <div className="p-5 space-y-4 font-mono text-sm">
                <div>
                  <div className="text-[var(--color-text-muted)] text-xs mb-2 uppercase tracking-wide">Scan a file</div>
                  <div className="bg-[var(--color-surface-2)] rounded-lg px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-accent)]">$ </span>riveter scan <span className="text-[var(--color-text-secondary)]">-p aws-security -t ./main.tf</span>
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-text-muted)] text-xs mb-2 uppercase tracking-wide">Scan a directory</div>
                  <div className="bg-[var(--color-surface-2)] rounded-lg px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-accent)]">$ </span>riveter scan <span className="text-[var(--color-text-secondary)]">-p aws-security -t ./infra</span>
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-text-muted)] text-xs mb-2 uppercase tracking-wide">Multiple packs</div>
                  <div className="bg-[var(--color-surface-2)] rounded-lg px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-accent)]">$ </span>riveter scan <span className="text-[var(--color-text-secondary)]">-p aws-security -p cis-aws -t ./main.tf</span>
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-text-muted)] text-xs mb-2 uppercase tracking-wide">Choose output format</div>
                  <div className="bg-[var(--color-surface-2)] rounded-lg px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-accent)]">$ </span>riveter scan <span className="text-[var(--color-text-secondary)]">-p aws-security -t ./main.tf -o json</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Rules */}
        <section id="custom-rules" className="py-20 border-t">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Custom Rules</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Write your own compliance rules in plain YAML. No scripting, no DSL — just describe what you want to check.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Dot-notation for nested property access',
                  'Operators: equals, not_equals, contains, matches, greater_than, less_than, exists',
                  'Target specific resource types',
                  'Combine multiple conditions with AND logic',
                  'Use alongside built-in packs or standalone',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-severity-low)] mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/examples" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors inline-flex items-center gap-1">
                See more examples <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div>
              <CodeBlock code={customRuleCode} language="yaml" filename="custom-rules.yaml" />
            </div>
          </div>
        </section>

        {/* State File Scanning */}
        <section id="state-scanning" className="py-20 border-t">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">State File Scanning</h2>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-2xl">
              Don&apos;t just validate what you&apos;re about to deploy — scan what&apos;s already running.{' '}
              <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">riveter scan-state</code>{' '}
              analyzes Terraform v4 state files to find compliance violations and configuration drift in live infrastructure.
            </p>
            <div className="bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)] p-4 font-mono text-sm">
              <span className="text-[var(--color-accent)]">$ </span>
              <span className="text-[var(--color-text-primary)]">riveter scan-state -p aws-security -s terraform.tfstate</span>
            </div>
          </div>
        </section>

        {/* AI Rule Generation */}
        <section id="ai-rules" className="py-20 border-t">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Rule Generation</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Powered by Claude AI. Point riveter at your Terraform files and it will suggest 3–5 enforceable compliance rules per resource type based on what it finds.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                * Requires an Anthropic API key environment variable exported as <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
              </p>
              <div className="p-4 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)]">
                <p className="text-sm text-[var(--color-accent-light)]">
                  Generated rules are saved as YAML and can be immediately used with{' '}
                  <code className="font-mono">riveter scan --rules</code>.
                </p>
              </div>
            </div>
            <TerminalWindow title="riveter generate-rules" lines={aiRulesTerminalLines} />
          </div>
        </section>

        {/* AI Explanation of Rule Failures */}
        <section id="ai-explanations" className="py-20 border-t">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Explanation of Rule Failures</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Placeholder text describing how riveter uses AI to explain why a rule failed and what you can do to fix it.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                More placeholder text about the feature, its benefits, and how it integrates into the developer workflow.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                * Requires an Anthropic API key environment variable exported as <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
              </p>
            </div>
            <CodeBlock
              code={`# Placeholder code example\n# showing AI explanation output`}
              language="text"
            />
          </div>
        </section>

        {/* Output Formats */}
        <section id="output-formats" className="py-20 border-t">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
              <FileOutput className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Output Formats</h2>
          </div>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl">
            One flag changes everything. Use <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">-o</code> to choose the right format for your workflow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outputFormats.map((fmt) => (
              <Card key={fmt.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{fmt.name}</h3>
                  {fmt.id !== 'table' && (
                    <code className="text-xs font-mono text-[var(--color-accent)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded">
                      {`-o ${fmt.id === 'junit' ? 'junit' : fmt.id}`}
                    </code>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{fmt.use}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CI/CD */}
        <section id="cicd" className="py-20 border-t">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">CI/CD Integration</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Block infrastructure changes that violate your compliance rules before they merge. riveter exits with a non-zero code on violations, making it a natural pipeline gate.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'GitHub Actions — SARIF upload for inline PR annotations',
                  'GitLab CI — JUnit XML for test reports',
                  'Any CI system — JSON output for custom processing',
                  'Pre-commit hooks for local enforcement',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-severity-low)] mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/docs#github-actions" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors inline-flex items-center gap-1">
                View CI/CD docs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <CodeBlock code={cicdCode} language="yaml" filename=".github/workflows/infra-validation.yml" />
          </div>
        </section>

      </div>
    </div>
  )
}
