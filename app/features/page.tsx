import Link from 'next/link'
import { Shield, FileCode, Cpu, Sparkles, FileOutput, GitBranch, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import TerminalWindow, { TerminalLine, TerminalColumn } from '@/components/ui/TerminalWindow'
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

const customRuleCode = `rules:
  - id: ec2-must-be-encrypted
    resource_type: aws_instance
    description: All EC2 root EBS volumes must be encrypted
    assert:
      root_block_device.encrypted: true
    metadata:
      tags: [encryption, ec2]
      references:
        - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html

  - id: ec2-no-public-ip-production
    resource_type: aws_instance
    description: Production EC2 instances must not have a public IP
    filter:
      tags.Environment: production    # Only applies to production resources
    assert:
      associate_public_ip_address: false
    metadata:
      tags: [network, ec2]

  - id: ec2-required-tags
    resource_type: aws_instance
    description: EC2 instances must have Environment, Owner, and Project tags
    assert:
      tags.Environment: present
      tags.Owner: present
      tags.Project: present
    metadata:
      tags: [governance, tagging]

  - id: ec2-minimum-volume-size
    resource_type: aws_instance
    description: EC2 root volume must be at least 20 GB
    assert:
      root_block_device.volume_size:
        gte: 20`

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

const eT = 'text-[var(--color-text-secondary)]'
const eF = 'text-[var(--color-severity-critical)]'
const eP = 'text-[var(--color-severity-low)]'
const eA = 'text-[var(--color-accent-light)]'
const eWS = '12ch'
const eWR = '38ch'
const eWRE = '40ch'
const ePad = (s: string, n: number) => s.padEnd(n)

function explTableRow(status: string, sc: string, ruleId: string, resource: string, message: string): TerminalLine {
  return {
    columns: [
      { text: ` ${status}   `, className: sc, width: eWS },
      { text: ePad(ruleId, 36) + '  ', className: eT, width: eWR },
      { text: ePad(resource, 38) + '  ', className: eT, width: eWRE },
      { text: message, className: eT, flex: true },
    ] as TerminalColumn[],
  }
}

function explRow(text: string, cls = eT): TerminalLine {
  return {
    columns: [
      { text: '', width: eWS },
      { text: '', width: eWR },
      { text: '', width: eWRE },
      { text, className: cls, flex: true, wrap: true },
    ] as TerminalColumn[],
  }
}

const aiExplanationTerminalLines: TerminalLine[] = [
  { text: 'riveter scan -p aws-security -t main.tf --explain', type: 'command' },
  { text: 'Loaded 26 rule(s) from pack aws-security', type: 'success' },
  { text: 'Scanning 5 resource(s) against 26 rule(s)...', type: 'info' },
  { text: '' },
  {
    columns: [
      { text: ePad(' Status', 12), className: eT, width: eWS },
      { text: ePad('Rule ID', 36) + '  ', className: eT, width: eWR },
      { text: ePad('Resource', 38) + '  ', className: eT, width: eWRE },
      { text: 'Message', className: eT, flex: true },
    ] as TerminalColumn[],
  },
  { type: 'divider' as const },
  explTableRow('FAIL', eF, 'ec2_no_public_ip', 'aws_instance.web_server', "Expected 'associate_public_ip_address' to equal False, got True"),
  { text: '' },
  explRow('ⓘ  Security Risk: Assigning public IP addresses to production EC2 instances directly exposes them to the internet, creating an unnecessarily large attack surface and violating the principle of least privilege for network access.', eA),
  { text: '' },
  explRow('Attack Potential: An attacker could directly target the instance through its public IP address, attempting to exploit vulnerabilities in exposed services, conduct brute force attacks against SSH/RDP, or launch denial-of-service attacks without needing to first compromise other infrastructure components.', eT),
  { text: '' },
  explRow('Remediation: Change `associate_public_ip_address: true` to `associate_public_ip_address: false` in the Terraform configuration. If internet access is required, implement a NAT Gateway or NAT instance in the public subnet.', eP),
]

const aiRulesTerminalLines = [
  { text: 'riveter generate-rules -t main.tf', type: 'command' as const },
  { text: 'Generating rules for 4 resource type(s) across 5 resource(s)...', type: 'info' as const },
  { text: '', type: 'output' as const },
  { text: '✓ aws_s3_bucket: 5 rule(s) generated', type: 'success' as const },
  { text: '✓ aws_s3_bucket_versioning: 5 rule(s) generated', type: 'success' as const },
  { text: '✓ aws_instance: 5 rule(s) generated', type: 'success' as const },
  { text: '✓ aws_security_group: 5 rule(s) generated', type: 'success' as const },
  { text: '', type: 'output' as const },
  { text: '# Generated by riveter generate-rules', type: 'output' as const },
  { text: '# Review and customize before use:', type: 'output' as const },
  { text: '#   riveter scan -r <this-file> -t <terraform-path>', type: 'output' as const },
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
                    <span className="text-[var(--color-accent)]">$ </span>riveter scan <span className="text-[var(--color-text-secondary)]">-p aws-security -t ./main.tf -f json</span>
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
                  'Operators: equals, not equals, less than, greater than, less than or equal, greater than or equal, contains',
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
                  Generated rules are saved as YAML and can be immediately used with <code className="font-mono">riveter scan</code>, passing in the custom rules file with <code className="font-mono">-r</code>
                </p>
              </div>
            </div>
            <TerminalWindow title="riveter generate-rules" lines={aiRulesTerminalLines} />
          </div>
        </section>

        {/* AI Explanation of Rule Failures */}
        <section id="ai-explanations" className="py-20 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Explanation of Rule Failures</h2>
          </div>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-2">
            Use <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">--explain</code> to include AI generated explanations for any rules that did not pass, including a recommended approach for remediation.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
            * Requires an Anthropic API key environment variable exported as <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
          </p>
          <TerminalWindow
            title="riveter — bash"
            lines={aiExplanationTerminalLines}
            compact
          />
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
            One flag changes everything. Use <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">-f</code> to choose the right format for your workflow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outputFormats.map((fmt) => (
              <Card key={fmt.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{fmt.name}</h3>
                  {fmt.id !== 'table' && (
                    <code className="text-xs font-mono text-[var(--color-accent)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded">
                      {`-f ${fmt.id === 'junit' ? 'junit' : fmt.id}`}
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
