import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'
import GradientText from '@/components/ui/GradientText'
import TerminalWindow, { TerminalLine, TerminalColumn } from '@/components/ui/TerminalWindow'

const F = 'text-[var(--color-severity-critical)]'
const P = 'text-[var(--color-severity-low)]'
const S = 'text-[var(--color-text-muted)]'
const T = 'text-[var(--color-text-secondary)]'
const M = 'text-[var(--color-text-muted)]'

// Column widths: status=8ch, ruleId=38ch (36 content + 2 sep), resource=40ch (38 content + 2 sep), message=flex
const W_STATUS = '12ch'
const W_RULE = '38ch'
const W_RESOURCE = '40ch'

const pad = (s: string, n: number) => s.padEnd(n)

function tableRow(status: string, sc: string, ruleId: string, resource: string, message: string, cc = T): TerminalLine {
  return {
    columns: [
      { text: ` ${status}   `, className: sc, width: W_STATUS },
      { text: pad(ruleId, 36) + '  ', className: cc, width: W_RULE },
      { text: pad(resource, 38) + '  ', className: cc, width: W_RESOURCE },
      { text: message, className: cc, flex: true },
    ] as TerminalColumn[],
  }
}

const terminalLines: TerminalLine[] = [
  { text: 'riveter scan -p aws-security -t main.tf', type: 'command' },
  { text: 'Loaded 26 rule(s) from pack aws-security', type: 'success' },
  { text: 'Scanning 5 resource(s) against 26 rule(s)...', type: 'info' },
  { text: '' },
  {
    columns: [
      { text: pad(' Status', 12), className: T, width: W_STATUS },
      { text: pad('Rule ID', 36) + '  ', className: T, width: W_RULE },
      { text: pad('Resource', 38) + '  ', className: T, width: W_RESOURCE },
      { text: 'Message', className: T, flex: true },
    ],
  },
  { type: 'divider' },
  tableRow('FAIL', F, 'ec2_no_public_ip',                    'aws_instance.web_server',                   "Expected 'associate_public_ip_address' to equal False, got True"),
  tableRow('FAIL', F, 'ec2_encrypted_ebs_volumes',           'aws_instance.web_server',                   "Expected 'root_block_device.encrypted' to equal True, got None"),
  tableRow('PASS', P, 'ec2_approved_instance_types',         'aws_instance.web_server',                   'All checks passed'),
  tableRow('PASS', P, 'ec2_required_tags',                   'aws_instance.web_server',                   'All checks passed'),
  tableRow('FAIL', F, 'ec2_no_public_ip',                    'aws_instance.worker',                       "Expected 'associate_public_ip_address' to equal False, got None"),
  tableRow('FAIL', F, 'ec2_encrypted_ebs_volumes',           'aws_instance.worker',                       "Expected 'root_block_device.encrypted' to equal True, got None"),
  tableRow('FAIL', F, 'ec2_approved_instance_types',         'aws_instance.worker',                       "Value 't2.micro' does not match pattern '^(t3|t4g|m5|m6i|c5|c6i|r5|r6i)\\.(large|xlarge|2xlarge)$'"),
  tableRow('FAIL', F, 'ec2_required_tags',                   'aws_instance.worker',                       'Failed checks: tags.Owner, tags.Project'),
  tableRow('FAIL', F, 's3_bucket_encryption',                'aws_s3_bucket.data_lake',                   'server_side_encryption_configuration is missing or empty'),
  tableRow('FAIL', F, 's3_bucket_versioning',                'aws_s3_bucket_versioning.data_lake',        "Expected 'versioning_configuration.status' to equal 'Enabled', got None"),
  tableRow('FAIL', F, 'security_group_no_wide_open_ingress', 'aws_security_group.web_sg',                 "Expected subset [{'from_port': {'ne': 22}, ...}] is not contained in ingress rules"),
  tableRow('PASS', P, 'security_group_description_required', 'aws_security_group.web_sg',                 'All checks passed'),
  tableRow('SKIP', S, 's3_bucket_public_access_block',       'aws_s3_bucket_public_access_block.N/A',     'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 's3_bucket_logging',                   'aws_s3_bucket_logging.N/A',                 'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_encrypted_storage',               'aws_db_instance.N/A',                       'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_backup_retention',                'aws_db_instance.N/A',                       'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_multi_az',                        'aws_db_instance.N/A',                       'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_no_public_access',                'aws_db_instance.N/A',                       'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'vpc_flow_logs',                       'aws_flow_log.N/A',                          'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'iam_user_no_inline_policies',         'aws_iam_user.N/A',                          'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'iam_role_assume_role_policy_required','aws_iam_role.N/A',                          'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'iam_policy_no_wildcard_actions',      'aws_iam_policy.N/A',                        'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'cloudtrail_enabled',                  'aws_cloudtrail.N/A',                        'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'cloudtrail_log_file_validation',      'aws_cloudtrail.N/A',                        'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'kms_key_rotation',                    'aws_kms_key.N/A',                           'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'kms_key_description_required',        'aws_kms_key.N/A',                           'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'lambda_function_dead_letter_queue',   'aws_lambda_function.N/A',                   'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'lambda_function_vpc_config',          'aws_lambda_function.N/A',                   'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'alb_access_logs_enabled',             'aws_lb.N/A',                                'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'alb_deletion_protection',             'aws_lb.N/A',                                'SKIPPED: No matching resources found for this rule', M),
  { text: '' },
  { segments: [{ text: 'Passed:   ', className: T }, { text: '3', className: P }] },
  { segments: [{ text: 'Failed:   ', className: T }, { text: '9', className: F }] },
  { text: 'Skipped:  18 (no matching resources found)', type: 'output' },
  { text: '' },
  { segments: [{ text: '9 check(s) failed.', className: F }] },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-background)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(249,115,22,0.3)] bg-[var(--color-accent-dim)] text-[var(--color-accent-light)] text-xs font-medium mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Infrastructure Validation CLI
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-[var(--color-text-primary)]">Validate your</span>
              <br />
              <span className="text-[var(--color-text-primary)]">infrastructure.</span>
              <br />
              <GradientText>Before it fails you.</GradientText>
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-lg">
              Scan Terraform configurations against 15+ compliance frameworks. Catch misconfigurations,
              enforce security standards, and ship with confidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/docs">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a
                href="https://github.com/ScottRyanHoward/riveter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="gap-2">
                  <GitHubIcon className="w-4 h-4" />
                  View on GitHub <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                15 compliance packs
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                5 output formats
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                AI-powered rule generation
              </div>
            </div>
          </div>

          {/* Right: terminal */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08),transparent_70%)] rounded-3xl" />
            <TerminalWindow
              title="riveter — bash"
              lines={terminalLines}
              className="relative shadow-2xl shadow-[rgba(249,115,22,0.08)]"
              maxHeight="420px"
              compact
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
