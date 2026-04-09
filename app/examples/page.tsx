import PageHeader from '@/components/layout/PageHeader'
import TabGroup from '@/components/examples/TabGroup'
import CodeBlock from '@/components/examples/CodeBlock'
import TerminalWindow from '@/components/ui/TerminalWindow'

export const metadata = {
  title: 'Examples — riveter',
  description: 'Code examples for riveter: basic scans, custom rules, CI/CD integration, AI rule generation, and output formats.',
}

const basicScanTF = `# main.tf — example with security issues
resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"

  # Missing: block_public_acls, block_public_policy
  # riveter will flag this as CRITICAL
}

resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # HIGH: unrestricted SSH
  }
}

resource "aws_db_instance" "prod" {
  identifier     = "prod-db"
  engine         = "mysql"
  instance_class = "db.t3.micro"
  # Missing: storage_encrypted = true  — MEDIUM
}`

const basicScanOutput = [
  { text: 'riveter scan ./terraform --pack aws-security', type: 'command' as const },
  { text: '✓  Loaded aws-security pack (43 rules)', type: 'success' as const },
  { text: 'Scanning 3 files...', type: 'info' as const },
  { text: '', type: 'output' as const },
  { text: '  [CRITICAL]  S3 public access not blocked', type: 'error' as const },
  { text: '             aws_s3_bucket.assets — main.tf:1', type: 'output' as const },
  { text: '', type: 'output' as const },
  { text: '  [HIGH]      Security group allows unrestricted SSH', type: 'error' as const },
  { text: '             aws_security_group.web — main.tf:10', type: 'output' as const },
  { text: '', type: 'output' as const },
  { text: '  [MEDIUM]    RDS instance storage not encrypted', type: 'warning' as const },
  { text: '             aws_db_instance.prod — main.tf:22', type: 'output' as const },
  { text: '', type: 'output' as const },
  { text: '3 violations found', type: 'error' as const },
]

const customRulesYaml = `# team-rules.yaml
rules:
  - id: require-s3-versioning
    name: S3 Bucket Must Have Versioning Enabled
    severity: medium
    description: >
      All S3 buckets must have versioning enabled to support
      data recovery and compliance audit trails.
    resource_type: aws_s3_bucket
    conditions:
      - field: versioning.enabled
        operator: equals
        value: true

  - id: require-rds-backup
    name: RDS Must Have Sufficient Backup Retention
    severity: high
    description: RDS instances must retain backups for at least 7 days.
    resource_type: aws_db_instance
    conditions:
      - field: backup_retention_period
        operator: greater_than
        value: 6

  - id: no-ec2-public-ip
    name: EC2 Instances Must Not Have Public IPs
    severity: high
    description: EC2 instances in production must use private addressing only.
    resource_type: aws_instance
    conditions:
      - field: associate_public_ip_address
        operator: equals
        value: false`

const customRulesUsage = `# Use custom rules standalone
riveter scan ./terraform --rules ./team-rules.yaml

# Combine with a built-in pack
riveter scan ./terraform \\
  --pack aws-security \\
  --rules ./team-rules.yaml

# Use multiple custom rule files
riveter scan ./terraform \\
  --rules ./team-rules.yaml \\
  --rules ./data-rules.yaml`

const cicdYaml = `# .github/workflows/infra-validation.yml
name: Infrastructure Validation
on:
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  riveter:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Install riveter
        run: |
          brew install ScottRyanHoward/riveter/riveter

      - name: Scan with SARIF output
        run: |
          riveter scan ./terraform \\
            --pack aws-security \\
            --pack aws-cis \\
            --output sarif > results.sarif

      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif

      # Also generate JUnit XML for the test summary
      - name: Scan with JUnit output
        run: |
          riveter scan ./terraform \\
            --pack aws-security \\
            --output junit > junit-results.xml

      - name: Publish test results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: junit-results.xml`

const gitlabCiYaml = `# .gitlab-ci.yml
stages:
  - validate

riveter:
  stage: validate
  image: ubuntu:22.04
  before_script:
    - apt-get update && apt-get install -y curl
    - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    - brew install ScottRyanHoward/riveter/riveter
  script:
    - riveter scan ./terraform
        --pack aws-security
        --output junit > report.xml
  artifacts:
    when: always
    reports:
      junit: report.xml`

const aiRulesTerminal = [
  { text: 'riveter generate-rules ./terraform/rds.tf', type: 'command' as const },
  { text: 'Analyzing Terraform resources...', type: 'info' as const },
  { text: 'Found: aws_db_instance (3 resources)', type: 'output' as const },
  { text: '', type: 'output' as const },
  { text: 'Calling Claude AI...', type: 'info' as const },
  { text: '', type: 'output' as const },
  { text: '✓  Rule 1: rds-encryption-at-rest (HIGH)', type: 'success' as const },
  { text: '✓  Rule 2: rds-deletion-protection (HIGH)', type: 'success' as const },
  { text: '✓  Rule 3: rds-multi-az-enabled (MEDIUM)', type: 'success' as const },
  { text: '✓  Rule 4: rds-backup-retention-7days (HIGH)', type: 'success' as const },
  { text: '✓  Rule 5: rds-no-public-access (CRITICAL)', type: 'success' as const },
  { text: '', type: 'output' as const },
  { text: 'Saved to: ./riveter-generated-rds-rules.yaml', type: 'success' as const },
]

const aiGeneratedYaml = `# riveter-generated-rds-rules.yaml
# Generated by riveter generate-rules
rules:
  - id: rds-encryption-at-rest
    name: RDS Instance Must Be Encrypted at Rest
    severity: high
    description: >
      RDS instances containing sensitive data must have storage
      encryption enabled to protect data at rest.
    resource_type: aws_db_instance
    conditions:
      - field: storage_encrypted
        operator: equals
        value: true

  - id: rds-deletion-protection
    name: RDS Instance Must Have Deletion Protection
    severity: high
    description: Prevents accidental deletion of production databases.
    resource_type: aws_db_instance
    conditions:
      - field: deletion_protection
        operator: equals
        value: true

  - id: rds-no-public-access
    name: RDS Instance Must Not Be Publicly Accessible
    severity: critical
    description: >
      RDS instances must not be exposed to the public internet.
      Use VPC private subnets and security groups.
    resource_type: aws_db_instance
    conditions:
      - field: publicly_accessible
        operator: equals
        value: false`

const tabs = [
  {
    id: 'basic-scan',
    label: 'Basic Scan',
    content: (
      <div className="space-y-6">
        <p className="text-[var(--color-text-secondary)]">
          Start with a simple scan. Here&apos;s a Terraform file with some common security issues and what riveter finds.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2 font-mono">main.tf</p>
            <CodeBlock code={basicScanTF} language="hcl" filename="main.tf" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2 font-mono">Output</p>
            <TerminalWindow title="riveter scan" lines={basicScanOutput} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'custom-rules',
    label: 'Custom Rules',
    content: (
      <div className="space-y-6">
        <p className="text-[var(--color-text-secondary)]">
          Write your own rules in plain YAML. No scripting needed — just describe the check using resource type, field path, and operator.
        </p>
        <CodeBlock code={customRulesYaml} language="yaml" filename="team-rules.yaml" />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Using your custom rules:</p>
          <CodeBlock code={customRulesUsage} language="bash" />
        </div>
      </div>
    ),
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">GitHub Actions</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Scan Terraform on every PR. Violations appear as inline annotations in the GitHub Security tab via SARIF.
          </p>
          <CodeBlock code={cicdYaml} language="yaml" filename=".github/workflows/infra-validation.yml" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">GitLab CI</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Use JUnit XML output to surface violations as test failures in GitLab&apos;s test summary.
          </p>
          <CodeBlock code={gitlabCiYaml} language="yaml" filename=".gitlab-ci.yml" />
        </div>
      </div>
    ),
  },
  {
    id: 'ai-rules',
    label: 'AI Rules',
    content: (
      <div className="space-y-6">
        <p className="text-[var(--color-text-secondary)]">
          Use <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">riveter generate-rules</code> to
          let Claude AI suggest compliance rules based on the resource types in your Terraform files.
          Requires <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
        </p>
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <TerminalWindow title="riveter generate-rules" lines={aiRulesTerminal} />
          <CodeBlock code={aiGeneratedYaml} language="yaml" filename="riveter-generated-rds-rules.yaml" />
        </div>
      </div>
    ),
  },
  {
    id: 'output-formats',
    label: 'Output Formats',
    content: (
      <div className="space-y-8">
        <p className="text-[var(--color-text-secondary)]">
          Choose the right output format for your workflow with the <code className="font-mono text-sm bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-1.5 py-0.5 rounded">--output</code> flag.
        </p>
        {[
          {
            format: 'json',
            flag: '--output json',
            desc: 'Machine-readable output for dashboards, custom tooling, or further processing.',
            code: `{
  "summary": {
    "files_scanned": 12,
    "violations": 3,
    "critical": 1, "high": 1, "medium": 1, "low": 0
  },
  "violations": [
    {
      "rule_id": "s3-public-read-blocked",
      "severity": "CRITICAL",
      "resource": "aws_s3_bucket.assets",
      "file": "main.tf", "line": 12,
      "message": "S3 bucket allows public read access",
      "remediation": "Set block_public_acls and block_public_policy to true"
    }
  ]
}`,
          },
          {
            format: 'sarif',
            flag: '--output sarif',
            desc: 'GitHub Advanced Security compatible. Violations show as inline code annotations on PRs.',
            code: `{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [{ "tool": { "driver": { "name": "riveter" } },
    "results": [{
      "ruleId": "s3-public-read-blocked",
      "level": "error",
      "message": { "text": "S3 bucket allows public read access" },
      "locations": [{ "physicalLocation": {
        "artifactLocation": { "uri": "main.tf" },
        "region": { "startLine": 12 }
      }}]
    }]
  }]
}`,
          },
        ].map(({ format, flag, desc, code }) => (
          <div key={format}>
            <div className="flex items-center gap-2 mb-2">
              <code className="text-xs font-mono bg-[var(--color-surface-2)] text-[var(--color-accent-light)] px-2 py-1 rounded border border-[var(--color-border)]">
                {flag}
              </code>
              <span className="text-sm text-[var(--color-text-secondary)]">{desc}</span>
            </div>
            <CodeBlock code={code} language="json" />
          </div>
        ))}
      </div>
    ),
  },
]

export default function ExamplesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <PageHeader
        badge="Code Examples"
        title="See riveter"
        titleGradient="in action"
        description="Real examples showing scans, custom rules, CI/CD integration, AI rule generation, and output formats."
      />
      <TabGroup tabs={tabs} />
    </div>
  )
}
