import PageHeader from '@/components/layout/PageHeader'
import TabGroup from '@/components/examples/TabGroup'
import CodeBlock from '@/components/examples/CodeBlock'
import TerminalWindow, { TerminalLine, TerminalColumn } from '@/components/ui/TerminalWindow'

export const metadata = {
  title: 'Examples — riveter',
  description: 'Code examples for riveter: basic scans, custom rules, CI/CD integration, AI rule generation, and output formats.',
}

const basicScanTF = `# main.tf — example with security misconfigurations
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  associate_public_ip_address = true  # FAIL: ec2_no_public_ip

  root_block_device {
    # encrypted not set — FAIL: ec2_encrypted_ebs_volumes
  }

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}

resource "aws_s3_bucket" "data_lake" {
  bucket = "my-data-lake"
  # FAIL: s3_bucket_encryption — missing server_side_encryption_configuration
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Security group for web tier"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]  # FAIL: security_group_no_wide_open_ingress
  }
}`

const F = 'text-[var(--color-severity-critical)]'
const P = 'text-[var(--color-severity-low)]'
const S = 'text-[var(--color-text-muted)]'
const T = 'text-[var(--color-text-secondary)]'
const M = 'text-[var(--color-text-muted)]'

const WS = '12ch'
const WR = '38ch'
const WRE = '40ch'
const pad = (s: string, n: number) => s.padEnd(n)

function tableRow(status: string, sc: string, ruleId: string, resource: string, message: string, cc = T): TerminalLine {
  return {
    columns: [
      { text: ` ${status}   `, className: sc, width: WS },
      { text: pad(ruleId, 36) + '  ', className: cc, width: WR },
      { text: pad(resource, 38) + '  ', className: cc, width: WRE },
      { text: message, className: cc, flex: true },
    ] as TerminalColumn[],
  }
}

const basicScanOutput: TerminalLine[] = [
  { text: 'riveter scan -p aws-security -t main.tf', type: 'command' },
  { text: 'Loaded 26 rule(s) from pack aws-security', type: 'success' },
  { text: 'Scanning 3 resource(s) against 26 rule(s)...', type: 'info' },
  { text: '' },
  {
    columns: [
      { text: pad(' Status', 12), className: T, width: WS },
      { text: pad('Rule ID', 36) + '  ', className: T, width: WR },
      { text: pad('Resource', 38) + '  ', className: T, width: WRE },
      { text: 'Message', className: T, flex: true },
    ] as TerminalColumn[],
  },
  { type: 'divider' },
  tableRow('FAIL', F, 'ec2_no_public_ip',                    'aws_instance.web_server',           "Expected 'associate_public_ip_address' to equal False, got True"),
  tableRow('FAIL', F, 'ec2_encrypted_ebs_volumes',           'aws_instance.web_server',           "Expected 'root_block_device.encrypted' to equal True, got None"),
  tableRow('PASS', P, 'ec2_approved_instance_types',         'aws_instance.web_server',           'All checks passed'),
  tableRow('FAIL', F, 'ec2_required_tags',                   'aws_instance.web_server',           'Failed checks: tags.Owner, tags.Project'),
  tableRow('FAIL', F, 's3_bucket_encryption',                'aws_s3_bucket.data_lake',           'server_side_encryption_configuration is missing or empty'),
  tableRow('FAIL', F, 's3_bucket_versioning',                'aws_s3_bucket_versioning.data_lake',"Expected 'versioning_configuration.status' to equal 'Enabled', got None"),
  tableRow('FAIL', F, 'security_group_no_wide_open_ingress', 'aws_security_group.web_sg',         'Expected subset is not contained in actual ingress rules'),
  tableRow('PASS', P, 'security_group_description_required', 'aws_security_group.web_sg',         'All checks passed'),
  tableRow('SKIP', S, 's3_bucket_public_access_block',       'N/A',                               'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_encrypted_storage',               'N/A',                               'SKIPPED: No matching resources found for this rule', M),
  { text: '' },
  { segments: [{ text: 'Passed:   ', className: T }, { text: '2', className: P }] },
  { segments: [{ text: 'Failed:   ', className: T }, { text: '6', className: F }] },
  { text: 'Skipped:  18 (no matching resources found)', type: 'output' },
  { text: '' },
  { segments: [{ text: '6 check(s) failed.', className: F }] },
]

const customRulesYaml = `rules:
  # -----------------------------------------------------------------------
  # EC2 Rules
  # -----------------------------------------------------------------------

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

  - id: ec2-approved-instance-types
    resource_type: aws_instance
    description: EC2 instances must use cost-approved instance types
    assert:
      instance_type:
        regex: "^(t3|t4g|m5|m6i|c5|c6i|r5|r6i)\\\\.(micro|small|medium|large|xlarge|2xlarge)$"
    metadata:
      tags: [cost, ec2]

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
        gte: 20

  # -----------------------------------------------------------------------
  # S3 Rules
  # -----------------------------------------------------------------------

  - id: s3-bucket-tagged
    resource_type: aws_s3_bucket
    description: S3 buckets must have required tags
    assert:
      tags.Environment: present
      tags.Owner: present
    metadata:
      tags: [governance, s3]

  # -----------------------------------------------------------------------
  # Security Group Rules
  # -----------------------------------------------------------------------

  - id: sg-no-ssh-from-internet
    resource_type: aws_security_group
    description: Security groups must not allow SSH (port 22) from 0.0.0.0/0
    assert:
      ingress:
        length:
          lte: 2    # Max 2 inbound rules (adjust to your needs)
    metadata:
      tags: [network, security-groups]
      references:
        - https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html`

const customRulesUsage = `# Use custom rules standalone
riveter scan -r ./team-rules.yaml -t ./main.tf

# Combine with a built-in pack
riveter scan -p aws-security \\
  -r ./team-rules.yaml \\
  -t ./main.tf

# Use multiple custom rule files
riveter scan -p aws-security \\
  -r ./team-rules.yaml \\
  -r ./data-rules.yaml \\
  -t ./main.tf`

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
          riveter scan -p aws-security \\
            -p aws-cis \\
            -t ./terraform \\
            -f sarif -o results.sarif

      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif

      # Also generate JUnit XML for the test summary
      - name: Scan with JUnit output
        run: |
          riveter scan -p aws-security \\
            -t ./terraform \\
            -f junit -o junit-results.xml

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
    - riveter scan -p aws-security
        -t ./terraform
        -f junit -o report.xml
  artifacts:
    when: always
    reports:
      junit: report.xml`

const aiRulesTerminal = [
  { text: 'riveter generate-rules -t main.tf', type: 'command' as const },
  { text: 'Generating rules for 4 resource type(s) across 5 resource(s)...', type: 'info' as const },
  { text: '', type: 'output' as const },
  { text: '  ✓ aws_s3_bucket: 5 rule(s) generated', type: 'success' as const },
  { text: '  ✓ aws_s3_bucket_versioning: 5 rule(s) generated', type: 'success' as const },
  { text: '  ✓ aws_instance: 5 rule(s) generated', type: 'success' as const },
  { text: '  ✓ aws_security_group: 5 rule(s) generated', type: 'success' as const },
  { text: '', type: 'output' as const },
  { text: '# Generated by riveter generate-rules', type: 'output' as const },
  { text: '# Review and customize before use:', type: 'output' as const },
  { text: '#   riveter scan -r <this-file> -t <terraform-path>', type: 'output' as const },
]

const aiGeneratedYaml = `rules:
- id: s3-bucket-required-tags
  resource_type: aws_s3_bucket
  description: S3 buckets must have required governance tags
  assert:
    tags.Environment: present
    tags.Owner: present
  metadata:
    tags:
    - governance
    - tagging
- id: s3-bucket-versioning-enabled
  resource_type: aws_s3_bucket
  description: S3 buckets must have versioning enabled
  assert:
    versioning.enabled: true
  metadata:
    tags:
    - data-protection
    - versioning
- id: s3-bucket-server-side-encryption
  resource_type: aws_s3_bucket
  description: S3 buckets must have server-side encryption configured
  assert:
    server_side_encryption_configuration: present
  metadata:
    tags:
    - encryption
    - security
- id: s3-bucket-public-access-blocked
  resource_type: aws_s3_bucket
  description: S3 buckets must block all public access
  assert:
    public_access_block.block_public_acls: true
    public_access_block.block_public_policy: true
    public_access_block.ignore_public_acls: true
    public_access_block.restrict_public_buckets: true
  metadata:
    tags:
    - security
    - access-control
- id: s3-bucket-logging-enabled
  resource_type: aws_s3_bucket
  description: S3 buckets must have access logging enabled
  assert:
    logging: present
  metadata:
    tags:
    - logging
    - audit
    - compliance
- id: s3-bucket-versioning-must-be-enabled
  resource_type: aws_s3_bucket_versioning
  description: S3 bucket versioning must be enabled for data protection and compliance
  assert:
    versioning_configuration[0].status: Enabled
  metadata:
    tags:
    - s3
    - versioning
    - data-protection
    references:
    - https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
- id: s3-bucket-versioning-not-suspended
  resource_type: aws_s3_bucket_versioning
  description: S3 bucket versioning should not be suspended as it reduces data protection
  assert:
    versioning_configuration[0].status:
      ne: Suspended
  metadata:
    tags:
    - s3
    - versioning
    - data-protection
- id: s3-bucket-versioning-configuration-present
  resource_type: aws_s3_bucket_versioning
  description: S3 bucket versioning configuration must be explicitly defined
  assert:
    versioning_configuration: present
    versioning_configuration[0].status: present
  metadata:
    tags:
    - s3
    - configuration
- id: s3-bucket-versioning-has-bucket-reference
  resource_type: aws_s3_bucket_versioning
  description: S3 bucket versioning must reference a valid bucket
  assert:
    bucket: present
  metadata:
    tags:
    - s3
    - configuration
- id: s3-bucket-versioning-mfa-delete-for-sensitive
  resource_type: aws_s3_bucket_versioning
  description: S3 bucket versioning should enable MFA delete for sensitive buckets
  filter:
    tags.Sensitivity: high
  assert:
    versioning_configuration[0].mfa_delete: Enabled
  metadata:
    tags:
    - s3
    - mfa
    - security
    references:
    - https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html
- id: ec2-root-volume-encrypted
  resource_type: aws_instance
  description: EC2 root block device must be encrypted
  assert:
    root_block_device.encrypted: true
  metadata:
    tags:
    - encryption
    - security
    references:
    - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html
- id: ec2-no-public-ip-assignment
  resource_type: aws_instance
  description: EC2 instances should not automatically assign public IP addresses
  assert:
    associate_public_ip_address: false
  metadata:
    tags:
    - network
    - security
    references:
    - https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html
- id: ec2-required-governance-tags
  resource_type: aws_instance
  description: EC2 instances must have required governance tags
  assert:
    tags.Environment: present
    tags.Owner: present
  metadata:
    tags:
    - governance
    - tagging
    references:
    - https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html
- id: ec2-approved-instance-types
  resource_type: aws_instance
  description: EC2 instances must use approved instance types from current generation families
  assert:
    instance_type:
      regex: ^(t3|t4g|m5|m6i|c5|c6i|r5|r6i)\\.(nano|micro|small|medium|large|xlarge|2xlarge|4xlarge)$
  metadata:
    tags:
    - cost-optimization
    - governance
    references:
    - https://docs.aws.amazon.com/ec2/latest/userguide/instance-types.html
- id: ec2-root-volume-size-limit
  resource_type: aws_instance
  description: EC2 root volume size should not exceed reasonable limits
  assert:
    root_block_device.volume_size:
      lte: 100
  metadata:
    tags:
    - cost-optimization
    - storage
    references:
    - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html
- id: sg-no-unrestricted-ssh-ingress
  resource_type: aws_security_group
  description: Security groups must not allow SSH access from 0.0.0.0/0
  assert:
    ingress:
      subset:
      - from_port: 22
        to_port: 22
        protocol: tcp
        cidr_blocks:
          contains: 0.0.0.0/0
  metadata:
    tags:
    - security
    - ssh
    - access-control
- id: sg-no-unrestricted-ingress
  resource_type: aws_security_group
  description: Security groups must not allow ingress from 0.0.0.0/0 on all ports
  assert:
    ingress:
      subset:
      - from_port: 0
        to_port: 65535
        protocol: '-1'
        cidr_blocks:
          contains: 0.0.0.0/0
  metadata:
    tags:
    - security
    - access-control
- id: sg-description-required
  resource_type: aws_security_group
  description: Security groups must have a meaningful description
  assert:
    description:
      length:
        gte: 10
  metadata:
    tags:
    - documentation
    - governance
- id: sg-required-tags
  resource_type: aws_security_group
  description: Security groups must have required governance tags
  assert:
    tags.Environment: present
    tags.Owner: present
  metadata:
    tags:
    - governance
    - tagging
- id: sg-vpc-required
  resource_type: aws_security_group
  description: Security groups must be associated with a VPC
  assert:
    vpc_id:
      regex: ^vpc-[a-f0-9]{8,17}$
  metadata:
    tags:
    - networking
    - vpc`

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
          <CodeBlock code={aiGeneratedYaml} language="yaml" filename="riveter-generated-rules.yaml" />
        </div>
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
