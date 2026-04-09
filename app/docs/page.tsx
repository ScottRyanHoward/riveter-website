import DocsSidebar from '@/components/docs/DocsSidebar'
import CodeBlock from '@/components/examples/CodeBlock'
import Badge from '@/components/ui/Badge'
import RivetDivider from '@/components/ui/RivetDivider'

export const metadata = {
  title: 'Documentation — riveter',
  description: 'Installation, quick start, CLI reference, configuration, output formats, and CI/CD integration for riveter.',
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} data-doc-section className="scroll-mt-24 mb-14">
      {children}
    </section>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">{children}</h2>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 mt-6">{children}</h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">{children}</p>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
      {children}
    </code>
  )
}

interface FlagRow {
  flag: string
  type: string
  defaultVal: string
  description: string
}

function FlagsTable({ rows }: { rows: FlagRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
            {['Flag', 'Type', 'Default', 'Description'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)] transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-accent-light)] whitespace-nowrap">{row.flag}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{row.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{row.defaultVal}</td>
              <td className="px-4 py-3 text-[var(--color-text-secondary)]">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-[220px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <DocsSidebar />
        </aside>

        {/* Content */}
        <div className="min-w-0 prose-docs">

          {/* ── Getting Started ── */}
          <Section id="introduction">
            <H2>Introduction</H2>
            <P>
              riveter is an infrastructure validation CLI for Terraform. It scans your <InlineCode>.tf</InlineCode> files
              against compliance rules before you deploy, catching security misconfigurations and policy violations early.
            </P>
            <P>
              Choose from 15 built-in compliance packs — covering AWS, GCP, Azure, Kubernetes, CIS, HIPAA, PCI-DSS, SOC 2, and more —
              or write your own rules in plain YAML.
            </P>
            <div className="flex flex-wrap gap-2 mt-4">
              {['15 compliance packs', '5 output formats', 'AI rule generation', 'CI/CD ready'].map((tag) => (
                <Badge key={tag} variant="accent">{tag}</Badge>
              ))}
            </div>
          </Section>

          <Section id="installation">
            <H2>Installation</H2>
            <P>The recommended installation method is Homebrew.</P>
            <CodeBlock
              code="brew install ScottRyanHoward/riveter/riveter"
              language="bash"
              filename="Terminal"
            />
            <H3>Verify installation</H3>
            <CodeBlock code="riveter --version" language="bash" />
            <H3>Optional: AI rule generation</H3>
            <P>
              To use <InlineCode>riveter generate-rules</InlineCode>, set your Anthropic API key:
            </P>
            <CodeBlock code="export ANTHROPIC_API_KEY=your_api_key_here" language="bash" />
          </Section>

          <Section id="quick-start">
            <H2>Quick Start</H2>
            <P>Get up and running in under two minutes.</P>
            <H3>Step 1: Navigate to your Terraform directory</H3>
            <CodeBlock code="cd ./my-infra" language="bash" />
            <H3>Step 2: Run a scan</H3>
            <CodeBlock code="riveter scan . --pack aws-security" language="bash" />
            <H3>Step 3: Review violations</H3>
            <P>
              Violations are displayed as a table by default, organized by severity.
              Fix the issues in your Terraform code, then re-run to confirm.
            </P>
            <H3>Step 4: Export for CI/CD</H3>
            <CodeBlock code="riveter scan . --pack aws-security --output sarif > results.sarif" language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Core Concepts ── */}
          <Section id="how-scanning-works">
            <H2>How Scanning Works</H2>
            <P>
              When you run <InlineCode>riveter scan</InlineCode>, it:
            </P>
            <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-secondary)] mb-4 pl-2">
              <li>Recursively finds all <InlineCode>.tf</InlineCode> files in the target path</li>
              <li>Parses each file to extract resource blocks and their properties</li>
              <li>Loads the specified rule pack(s) or custom rule files</li>
              <li>Evaluates each resource against each rule&apos;s conditions</li>
              <li>Produces a report in the requested output format</li>
              <li>Exits with code <InlineCode>0</InlineCode> if no violations, <InlineCode>1</InlineCode> if violations found</li>
            </ol>
          </Section>

          <Section id="rule-structure">
            <H2>Rule Structure</H2>
            <P>Rules are defined in YAML with the following fields:</P>
            <CodeBlock
              code={`rules:
  - id: unique-rule-id          # Required: unique identifier
    name: Human Readable Name   # Required: display name
    severity: high              # Required: critical|high|medium|low
    description: >              # Required: what the rule checks
      Explanation of what this rule enforces and why.
    resource_type: aws_s3_bucket # Required: Terraform resource type
    conditions:                  # Required: one or more conditions
      - field: versioning.enabled  # Dot notation for nested fields
        operator: equals           # See operators below
        value: true`}
              language="yaml"
            />
            <H3>Supported Operators</H3>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                    <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Operator</th>
                    <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['equals', 'Field value must equal the specified value'],
                    ['not_equals', 'Field value must not equal the specified value'],
                    ['contains', 'Field value (string/list) must contain the specified value'],
                    ['not_contains', 'Field value must not contain the specified value'],
                    ['matches', 'Field value must match the specified regex pattern'],
                    ['exists', 'Field must be present and non-null (value: true/false)'],
                    ['greater_than', 'Numeric field must be greater than the specified value'],
                    ['less_than', 'Numeric field must be less than the specified value'],
                  ].map(([op, desc]) => (
                    <tr key={op} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-accent-light)]">{op}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="compliance-packs">
            <H2>Compliance Packs</H2>
            <P>
              riveter includes 15 built-in compliance packs. List them with:
            </P>
            <CodeBlock code="riveter list-rule-packs" language="bash" />
            <P>
              Use one or more packs in a scan:
            </P>
            <CodeBlock code={`riveter scan . --pack aws-security
riveter scan . --pack aws-security --pack aws-cis`} language="bash" />
          </Section>

          <Section id="severity-levels">
            <H2>Severity Levels</H2>
            <div className="space-y-3">
              {[
                { level: 'critical', color: 'critical', desc: 'Immediate risk. Publicly exposed resources, no encryption on sensitive data, unauthenticated access.' },
                { level: 'high', color: 'high', desc: 'Significant risk. Should be fixed before deployment. Weak access controls, missing logging on critical systems.' },
                { level: 'medium', color: 'medium', desc: 'Moderate risk. Best practices violations that should be addressed soon.' },
                { level: 'low', color: 'low', desc: 'Minor issues or informational findings. Address when convenient.' },
              ].map(({ level, color, desc }) => (
                <div key={level} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <Badge variant={color as 'critical' | 'high' | 'medium' | 'low'} className="mt-0.5 shrink-0">
                    {level.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <RivetDivider />

          {/* ── CLI Reference ── */}
          <Section id="scan">
            <H2>riveter scan</H2>
            <P>Scan Terraform files or directories against compliance rules.</P>
            <CodeBlock code="riveter scan [PATH] [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--pack, -p', type: 'string', defaultVal: '—', description: 'Compliance pack to use. Can be specified multiple times.' },
              { flag: '--rules, -r', type: 'string', defaultVal: '—', description: 'Path to a custom rules YAML file. Can be specified multiple times.' },
              { flag: '--output, -o', type: 'string', defaultVal: 'table', description: 'Output format: table | json | sarif | junit | html' },
              { flag: '--severity', type: 'string', defaultVal: 'low', description: 'Minimum severity to report: critical | high | medium | low' },
              { flag: '--ignore-rule', type: 'string', defaultVal: '—', description: 'Rule ID to skip. Can be specified multiple times.' },
              { flag: '--config', type: 'string', defaultVal: 'riveter.yaml', description: 'Path to riveter config file.' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Scan current directory with AWS security pack
riveter scan . --pack aws-security

# Scan with multiple packs and output SARIF
riveter scan ./terraform --pack aws-security --pack aws-cis --output sarif

# Use custom rules, only show critical and high
riveter scan . --rules ./team-rules.yaml --severity high

# Combine pack and custom rules, output JSON
riveter scan . --pack aws-security --rules ./extras.yaml --output json`} language="bash" />
          </Section>

          <Section id="scan-state">
            <H2>riveter scan-state</H2>
            <P>Scan a deployed Terraform state file (v4 format) for compliance violations.</P>
            <CodeBlock code="riveter scan-state [STATE_FILE] [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--pack, -p', type: 'string', defaultVal: '—', description: 'Compliance pack to use.' },
              { flag: '--rules, -r', type: 'string', defaultVal: '—', description: 'Path to custom rules YAML file.' },
              { flag: '--output, -o', type: 'string', defaultVal: 'table', description: 'Output format: table | json | sarif | junit | html' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Scan a local state file
riveter scan-state terraform.tfstate --pack aws-security

# Scan remote state (download first)
terraform state pull > current.tfstate
riveter scan-state current.tfstate --pack aws-security`} language="bash" />
          </Section>

          <Section id="generate-rules">
            <H2>riveter generate-rules</H2>
            <P>Use Claude AI to generate YAML rules based on resource types in your Terraform files.</P>
            <CodeBlock code="riveter generate-rules [PATH] [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--output, -o', type: 'string', defaultVal: 'stdout', description: 'Output file path for generated rules.' },
              { flag: '--api-key', type: 'string', defaultVal: 'ANTHROPIC_API_KEY', description: 'Anthropic API key (or set via environment variable).' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Generate rules from a single file
riveter generate-rules ./terraform/main.tf

# Generate and save to file
riveter generate-rules ./terraform --output ./my-generated-rules.yaml`} language="bash" />
          </Section>

          <Section id="list-rule-packs">
            <H2>riveter list-rule-packs</H2>
            <P>List all available built-in compliance packs with their rule counts.</P>
            <CodeBlock code="riveter list-rule-packs" language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Configuration ── */}
          <Section id="config-file">
            <H2>Config File</H2>
            <P>
              Create a <InlineCode>riveter.yaml</InlineCode> in your project root to set defaults:
            </P>
            <CodeBlock
              code={`# riveter.yaml
scan:
  packs:
    - aws-security
    - aws-cis
  output: table
  severity: medium
  ignore_rules:
    - iam-no-admin-policy  # we handle this separately

rules:
  paths:
    - ./compliance/custom-rules.yaml`}
              language="yaml"
              filename="riveter.yaml"
            />
          </Section>

          <Section id="custom-rules">
            <H2>Custom Rules</H2>
            <P>
              Write rules in YAML and use them with <InlineCode>--rules</InlineCode>. See the{' '}
              <a href="#rule-structure" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">Rule Structure</a> section for full syntax.
            </P>
            <CodeBlock code="riveter scan . --rules ./my-rules.yaml" language="bash" />
          </Section>

          <Section id="ignoring-rules">
            <H2>Ignoring Rules</H2>
            <P>Skip specific rules using <InlineCode>--ignore-rule</InlineCode> or the config file:</P>
            <CodeBlock code={`# CLI flag (can be repeated)
riveter scan . --pack aws-security --ignore-rule iam-no-admin-policy

# Config file
# riveter.yaml
scan:
  ignore_rules:
    - iam-no-admin-policy
    - s3-logging-enabled`} language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Output Formats ── */}
          <Section id="table-output">
            <H2>Table Output</H2>
            <P>Default format. Human-readable, color-coded by severity. Best for local development review.</P>
            <CodeBlock code="riveter scan . --pack aws-security --output table" language="bash" />
          </Section>

          <Section id="json-output">
            <H2>JSON Output</H2>
            <P>Machine-readable JSON for programmatic processing, custom dashboards, or downstream tooling.</P>
            <CodeBlock code="riveter scan . --pack aws-security --output json > report.json" language="bash" />
          </Section>

          <Section id="sarif-output">
            <H2>SARIF Output</H2>
            <P>
              SARIF (Static Analysis Results Interchange Format) is compatible with GitHub Advanced Security.
              Violations appear as inline annotations in pull requests.
            </P>
            <CodeBlock code="riveter scan . --pack aws-security --output sarif > results.sarif" language="bash" />
          </Section>

          <Section id="junit-output">
            <H2>JUnit XML Output</H2>
            <P>Violations are represented as test failures. Compatible with most CI/CD test reporting systems.</P>
            <CodeBlock code="riveter scan . --pack aws-security --output junit > junit-results.xml" language="bash" />
          </Section>

          <Section id="html-output">
            <H2>HTML Report</H2>
            <P>Interactive HTML report with filtering and expandable violation details. Suitable for stakeholder review.</P>
            <CodeBlock code="riveter scan . --pack aws-security --output html > report.html" language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Integrations ── */}
          <Section id="github-actions">
            <H2>GitHub Actions</H2>
            <P>Block PRs that introduce compliance violations. Use SARIF output for inline annotations.</P>
            <CodeBlock
              code={`name: Infrastructure Validation
on:
  pull_request:
    paths: ['terraform/**']

jobs:
  riveter:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Install riveter
        run: brew install ScottRyanHoward/riveter/riveter
      - name: Scan Terraform
        run: riveter scan ./terraform --pack aws-security --output sarif > results.sarif
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif`}
              language="yaml"
              filename=".github/workflows/infra-validation.yml"
            />
          </Section>

          <Section id="gitlab-ci">
            <H2>GitLab CI</H2>
            <P>Use JUnit XML output to surface violations as test failures in GitLab&apos;s test summary.</P>
            <CodeBlock
              code={`riveter:
  stage: validate
  script:
    - brew install ScottRyanHoward/riveter/riveter
    - riveter scan ./terraform --pack aws-security --output junit > report.xml
  artifacts:
    when: always
    reports:
      junit: report.xml`}
              language="yaml"
              filename=".gitlab-ci.yml"
            />
          </Section>

          <Section id="pre-commit">
            <H2>Pre-commit Hooks</H2>
            <P>Run riveter locally before every commit using pre-commit:</P>
            <CodeBlock
              code={`# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: riveter
        name: riveter infrastructure validation
        entry: riveter scan
        args: ['--pack', 'aws-security', '--severity', 'high']
        language: system
        files: \\.tf$`}
              language="yaml"
              filename=".pre-commit-config.yaml"
            />
          </Section>

        </div>
      </div>
    </div>
  )
}
