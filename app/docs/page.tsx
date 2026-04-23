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
  short: string
  description: string
}

function FlagsTable({ rows }: { rows: FlagRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
            {['Flag', 'Short', 'Description'].map((h) => (
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
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)] whitespace-nowrap">{row.short}</td>
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
            <H3>macOS / Linux</H3>
            <CodeBlock
              code="brew install ScottRyanHoward/riveter/riveter"
              language="bash"
              filename="Terminal"
            />
            <H3>Windows</H3>
            <P>
              Download the latest <InlineCode>riveter-&lt;version&gt;-windows-x86_64.zip</InlineCode> from the Releases page,
              extract <InlineCode>riveter.exe</InlineCode>, and add it to your <InlineCode>PATH</InlineCode>.
              Then place rule pack YAML files in <InlineCode>%USERPROFILE%\.riveter\rule_packs\</InlineCode>.
            </P>
            <H3>Verify installation</H3>
            <CodeBlock code="riveter --version" language="bash" />
            <H3>Optional: AI features</H3>
            <P>
              To use <InlineCode>riveter generate-rules</InlineCode> or <InlineCode>--explain</InlineCode>, set your Anthropic API key:
            </P>
            <CodeBlock code="export ANTHROPIC_API_KEY=sk-ant-..." language="bash" />
          </Section>

          <Section id="quick-start">
            <H2>Quick Start</H2>
            <CodeBlock code={`# Scan with a built-in rule pack
riveter scan -p aws-security -t main.tf

# Scan an entire directory
riveter scan -p aws-security -t ./infra/

# Combine multiple packs
riveter scan -p aws-security -p cis-aws -t main.tf

# Save an HTML report and still see results in the terminal
riveter scan -p aws-security -t main.tf -f html -o report.html

# Validate deployed state (drift detection)
riveter scan-state -p aws-security -s terraform.tfstate

# Generate rules using AI
riveter generate-rules -t ./infra/ -o my-rules.yml
riveter scan -r my-rules.yml -t ./infra/

# See available rule packs
riveter list-rule-packs`} language="bash" />
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
              <li>Evaluates each resource against each rule&apos;s assertions</li>
              <li>Produces a report in the requested output format</li>
              <li>Exits with code <InlineCode>0</InlineCode> if no violations, <InlineCode>1</InlineCode> if violations found</li>
            </ol>
          </Section>

          <Section id="rule-structure">
            <H2>Rule Structure</H2>
            <P>Rules are defined in YAML with the following fields:</P>
            <CodeBlock
              code={`rules:
  - id: ec2-must-be-encrypted        # Required: unique identifier
    resource_type: aws_instance       # Required: Terraform resource type
    description: >                    # Optional: human-readable summary
      All EC2 root volumes must be encrypted.
    assert:                           # Required: assertions that must all be true
      root_block_device.encrypted: true

  - id: ec2-prod-approved-types
    resource_type: aws_instance
    description: Production EC2s must use approved instance types
    filter:                           # Optional: only apply to matching resources
      tags.Environment: production
    assert:
      instance_type:
        regex: "^(t3|m5|c5)\\.(large|xlarge|2xlarge)$"

  - id: s3-versioning-enabled
    resource_type: aws_s3_bucket
    description: S3 buckets must have versioning enabled
    assert:
      versioning.enabled: true
      tags.Owner: present`}
              language="yaml"
            />

            <H3>Rule Fields</H3>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                    {['Field', 'Required', 'Description'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['id', 'Yes', 'Unique rule identifier'],
                    ['resource_type', 'Yes', 'Terraform resource type, or "*" for all'],
                    ['assert', 'Yes', 'Assertions that must all be true'],
                    ['description', 'No', 'Human-readable summary'],
                    ['filter', 'No', 'Conditions a resource must match for the rule to apply'],
                    ['metadata', 'No', 'Extra metadata (tags, references, etc.)'],
                  ].map(([field, req, desc]) => (
                    <tr key={field} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-accent-light)]">{field}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-text-muted)]">{req}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Assertion Operators</H3>
            <P>
              By default, <InlineCode>property: value</InlineCode> is an equality check. Use operator syntax for richer comparisons:
            </P>
            <CodeBlock
              code={`assert:
  # Equality (default)
  instance_type: t3.large
  associate_public_ip_address: false

  # Presence check
  tags.Owner: present

  # Regex match
  instance_type:
    regex: "^(t3|m5)\\.(large|xlarge)$"

  # Numeric comparisons: gt, gte, lt, lte, ne, eq
  root_block_device.volume_size:
    gte: 100

  # List operations
  allowed_cidrs:
    contains: "10.0.0.0/8"
  ingress_rules:
    length:
      lte: 5`}
              language="yaml"
            />

            <H3>Filters</H3>
            <P>
              Filters restrict which resources a rule applies to. A rule is only evaluated for resources where all filter conditions match:
            </P>
            <CodeBlock
              code={`filter:
  tags.Environment: production`}
              language="yaml"
            />
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
            <CodeBlock code={`riveter scan -p aws-security -t main.tf
riveter scan -p aws-security -p cis-aws -t main.tf`} language="bash" />
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
            <CodeBlock code="riveter scan [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--terraform PATH', short: '-t', description: 'Required. Path to a .tf file or directory.' },
              { flag: '--rule-pack NAME', short: '-p', description: 'Built-in rule pack to use. Repeatable.' },
              { flag: '--rules FILE', short: '-r', description: 'Path to a custom rules YAML file.' },
              { flag: '--output-format FMT', short: '-f', description: 'Output format: table (default), json, junit, sarif, html' },
              { flag: '--output FILE', short: '-o', description: 'Write output to a file; table summary still shown in terminal.' },
              { flag: '--explain', short: '-e', description: 'Attach AI-generated explanations to violations (requires ANTHROPIC_API_KEY).' },
              { flag: '--include-rules PATTERN', short: '', description: 'Only run rules matching glob pattern. Repeatable.' },
              { flag: '--exclude-rules PATTERN', short: '', description: 'Skip rules matching glob pattern. Repeatable.' },
              { flag: '--config FILE', short: '-c', description: 'Config file path (auto-detected if omitted).' },
              { flag: '--debug', short: '', description: 'Enable debug logging.' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Scan with a built-in pack
riveter scan -p aws-security -t main.tf

# Scan a directory with multiple packs
riveter scan -p aws-security -p cis-aws -t ./terraform/

# Output SARIF and write to file
riveter scan -p aws-security -t main.tf -f sarif -o results.sarif

# Use custom rules with AI explanations
riveter scan -r ./team-rules.yaml -t main.tf --explain

# Combine pack and custom rules, output JSON
riveter scan -p aws-security -r ./extras.yaml -t main.tf -f json`} language="bash" />
          </Section>

          <Section id="scan-state">
            <H2>riveter scan-state</H2>
            <P>Scan a deployed Terraform state file (v4 format) for compliance violations and drift detection.</P>
            <CodeBlock code="riveter scan-state [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--state PATH', short: '-s', description: 'Required. Path to terraform.tfstate, or - for stdin.' },
              { flag: '--rule-pack NAME', short: '-p', description: 'Built-in rule pack to use. Repeatable.' },
              { flag: '--rules FILE', short: '-r', description: 'Path to custom rules YAML file.' },
              { flag: '--output-format FMT', short: '-f', description: 'Output format: table (default), json, junit, sarif, html' },
              { flag: '--output FILE', short: '-o', description: 'Write output to a file; table summary still shown in terminal.' },
              { flag: '--include-rules PATTERN', short: '', description: 'Only run rules matching glob pattern. Repeatable.' },
              { flag: '--exclude-rules PATTERN', short: '', description: 'Skip rules matching glob pattern. Repeatable.' },
              { flag: '--config FILE', short: '-c', description: 'Config file path (auto-detected if omitted).' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Scan a local state file
riveter scan-state -p aws-security -s terraform.tfstate

# Pipe remote state from any Terraform backend
terraform state pull | riveter scan-state -p aws-security -s -`} language="bash" />
          </Section>

          <Section id="generate-rules">
            <H2>riveter generate-rules</H2>
            <P>
              Use Claude AI to generate YAML rules based on resource types in your Terraform files.
              Requires <InlineCode>ANTHROPIC_API_KEY</InlineCode>.
            </P>
            <CodeBlock code="riveter generate-rules [FLAGS]" language="bash" />
            <FlagsTable rows={[
              { flag: '--terraform PATH', short: '-t', description: 'Required. Path to a .tf file or directory.' },
              { flag: '--output FILE', short: '-o', description: 'Write generated rules to a file (default: stdout).' },
              { flag: '--focus TEXT', short: '', description: 'Guide the AI, e.g. "PCI-DSS compliance" or "cost optimization".' },
              { flag: '--model MODEL', short: '', description: 'Override the Claude model used for generation.' },
            ]} />
            <H3>Examples</H3>
            <CodeBlock code={`# Generate rules and print to stdout
riveter generate-rules -t ./infra/

# Save to a file and scan immediately
riveter generate-rules -t ./infra/ -o my-rules.yml
riveter scan -r my-rules.yml -t ./infra/

# Focus on a specific compliance framework
riveter generate-rules -t main.tf --focus "PCI-DSS compliance" -o pci-rules.yml`} language="bash" />
          </Section>

          <Section id="list-rule-packs">
            <H2>riveter list-rule-packs</H2>
            <P>List all available built-in compliance packs with their rule counts and descriptions.</P>
            <CodeBlock code="riveter list-rule-packs" language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Configuration ── */}
          <Section id="config-file">
            <H2>Config File</H2>
            <P>
              Create a <InlineCode>riveter.yml</InlineCode> (or <InlineCode>.riveter.yml</InlineCode>) in your project root to set defaults.
              CLI flags always override config file values.
            </P>
            <CodeBlock
              code={`rule_packs:
  - aws-security
  - cis-aws

rule_dirs:
  - ./my-custom-rules   # load rule packs from additional local directories

output_format: table
output_file: report.html  # optional — same as passing -o report.html

include_rules:
  - "*encryption*"

exclude_rules:
  - "*test*"

ai:
  explain_on_fail: true
  model: claude-sonnet-4-20250514        # model for --explain
  generate_model: claude-sonnet-4-20250514  # model for generate-rules`}
              language="yaml"
              filename="riveter.yml"
            />
          </Section>

          <Section id="custom-rules">
            <H2>Custom Rules</H2>
            <P>
              Write rules in YAML and pass them with <InlineCode>-r</InlineCode>. See the{' '}
              <a href="#rule-structure" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">Rule Structure</a> section for full syntax.
            </P>
            <CodeBlock code="riveter scan -r ./my-rules.yaml -t main.tf" language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Output Formats ── */}
          <Section id="table-output">
            <H2>Table Output</H2>
            <P>Default format. Human-readable, color-coded by severity. Best for local development review.</P>
            <CodeBlock code="riveter scan -p aws-security -t main.tf" language="bash" />
          </Section>

          <Section id="json-output">
            <H2>JSON Output</H2>
            <P>Machine-readable JSON for programmatic processing, custom dashboards, or downstream tooling.</P>
            <CodeBlock code="riveter scan -p aws-security -t main.tf -f json > results.json" language="bash" />
          </Section>

          <Section id="sarif-output">
            <H2>SARIF Output</H2>
            <P>
              SARIF (Static Analysis Results Interchange Format) is compatible with GitHub Advanced Security.
              Violations appear as inline annotations in pull requests.
            </P>
            <CodeBlock code="riveter scan -p aws-security -t main.tf -f sarif -o results.sarif" language="bash" />
          </Section>

          <Section id="junit-output">
            <H2>JUnit XML Output</H2>
            <P>Violations are represented as test failures. Compatible with most CI/CD test reporting systems.</P>
            <CodeBlock code="riveter scan -p aws-security -t main.tf -f junit > results.xml" language="bash" />
          </Section>

          <Section id="html-output">
            <H2>HTML Report</H2>
            <P>
              Interactive HTML report with filtering and expandable violation details. Suitable for stakeholder review.
              Use <InlineCode>-o</InlineCode> to write the file while keeping the table summary visible in your terminal.
            </P>
            <CodeBlock code={`# Write to file and keep table summary in terminal
riveter scan -p aws-security -t main.tf -f html -o report.html`} language="bash" />
          </Section>

          <RivetDivider />

          {/* ── Integrations ── */}
          <Section id="github-actions">
            <H2>GitHub Actions</H2>
            <P>Block PRs that introduce compliance violations. Use JUnit output for test result reporting.</P>
            <CodeBlock
              code={`- name: Scan Terraform with Riveter
  run: |
    brew install ScottRyanHoward/riveter/riveter
    riveter scan -p aws-security -t main.tf -f junit > riveter-results.xml

- name: Publish test results
  uses: mikepenz/action-junit-report@v4
  with:
    report_paths: riveter-results.xml
  if: always()`}
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
    - riveter scan -p aws-security -t ./terraform -f junit -o report.xml
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
              code={`repos:
  - repo: local
    hooks:
      - id: riveter
        name: riveter infrastructure validation
        entry: riveter scan
        args: ['-p', 'aws-security']
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
