'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/examples/CodeBlock'
import TerminalWindow, { TerminalLine, TerminalColumn } from '@/components/ui/TerminalWindow'

// ── HTML report preview ──────────────────────────────────────────────────────

const reportRows = [
  { status: 'FAIL', ruleId: 'ec2_no_public_ip',                  resource: 'aws_instance.web_server',          message: "Expected 'associate_public_ip_address' to equal False, got True" },
  { status: 'FAIL', ruleId: 'ec2_encrypted_ebs_volumes',         resource: 'aws_instance.web_server',          message: "Expected 'root_block_device.encrypted' to equal True, got None" },
  { status: 'PASS', ruleId: 'ec2_approved_instance_types',       resource: 'aws_instance.web_server',          message: 'All checks passed' },
  { status: 'FAIL', ruleId: 's3_bucket_encryption',              resource: 'aws_s3_bucket.data_lake',          message: 'server_side_encryption_configuration is missing or empty' },
  { status: 'FAIL', ruleId: 'security_group_no_wide_open_ingress', resource: 'aws_security_group.web_sg',      message: 'Expected subset is not contained in actual ingress rules' },
  { status: 'PASS', ruleId: 'security_group_description_required', resource: 'aws_security_group.web_sg',     message: 'All checks passed' },
  { status: 'SKIP', ruleId: 's3_bucket_public_access_block',     resource: 'N/A',                             message: 'SKIPPED: No matching resources found for this rule' },
  { status: 'SKIP', ruleId: 's3_bucket_logging',                 resource: 'N/A',                             message: 'SKIPPED: No matching resources found for this rule' },
]

const statusStyles: Record<string, string> = {
  FAIL: 'bg-red-950 text-red-400 border border-red-800',
  PASS: 'bg-green-950 text-green-400 border border-green-800',
  SKIP: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
}

function HtmlReportPreview() {
  return (
    <div className="rounded-lg overflow-hidden border border-[var(--color-border)] text-xs font-sans">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-2 bg-zinc-700 rounded px-2 py-0.5 text-zinc-400 text-[10px] font-mono truncate">
          riveter-report.html
        </div>
      </div>

      {/* Report header */}
      <div className="bg-[#0d0d14] px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-[var(--color-accent)] font-bold text-sm">riveter</span>
        <span className="text-zinc-500 text-xs">—</span>
        <span className="text-zinc-300 text-xs">Infrastructure Rule Enforcement Report</span>
      </div>

      {/* Summary cards */}
      <div className="bg-[#0f0f1a] px-5 py-4 grid grid-cols-4 gap-3 border-b border-zinc-800">
        <div className="text-center py-3 rounded border border-zinc-700 bg-zinc-900">
          <div className="text-xl font-bold text-zinc-100">30</div>
          <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide">Total Checks</div>
        </div>
        <div className="text-center py-3 rounded border border-green-900 bg-green-950/50">
          <div className="text-xl font-bold text-green-400">3</div>
          <div className="text-[10px] text-green-700 mt-0.5 uppercase tracking-wide">Passed</div>
        </div>
        <div className="text-center py-3 rounded border border-red-900 bg-red-950/50">
          <div className="text-xl font-bold text-red-400">9</div>
          <div className="text-[10px] text-red-700 mt-0.5 uppercase tracking-wide">Failed</div>
        </div>
        <div className="text-center py-3 rounded border border-zinc-700 bg-zinc-900">
          <div className="text-xl font-bold text-zinc-400">18</div>
          <div className="text-[10px] text-zinc-600 mt-0.5 uppercase tracking-wide">Skipped</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-[#0f0f1a] px-5 py-2.5 flex gap-2 border-b border-zinc-800">
        <select
          className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] rounded px-2 py-1 cursor-pointer"
          defaultValue="all"
          onChange={() => {}}
        >
          <option value="all">All statuses</option>
          <option value="fail">FAIL</option>
          <option value="pass">PASS</option>
          <option value="skip">SKIP</option>
        </select>
        <input
          className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] rounded px-2 py-1 flex-1 placeholder-zinc-600"
          placeholder="Search rule ID or resource..."
          readOnly
        />
      </div>

      {/* Table */}
      <div className="bg-[#0d0d14] overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-2 text-left text-zinc-500 font-semibold uppercase tracking-wide w-16">Status</th>
              <th className="px-4 py-2 text-left text-zinc-500 font-semibold uppercase tracking-wide">Rule ID</th>
              <th className="px-4 py-2 text-left text-zinc-500 font-semibold uppercase tracking-wide">Resource</th>
              <th className="px-4 py-2 text-left text-zinc-500 font-semibold uppercase tracking-wide">Message</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-2">
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold font-mono', statusStyles[row.status])}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-zinc-300">{row.ruleId}</td>
                <td className="px-4 py-2 font-mono text-zinc-400 whitespace-nowrap">{row.resource}</td>
                <td className="px-4 py-2 text-zinc-500 max-w-[220px] truncate">{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Table terminal preview ────────────────────────────────────────────────────

const F = 'text-[var(--color-severity-critical)]'
const P = 'text-[var(--color-severity-low)]'
const S = 'text-[var(--color-text-muted)]'
const T = 'text-[var(--color-text-secondary)]'
const M = 'text-[var(--color-text-muted)]'

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

const tableTerminalLines: TerminalLine[] = [
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
  { type: 'divider' as const },
  tableRow('FAIL', F, 'ec2_no_public_ip',                    'aws_instance.web_server',            "Expected 'associate_public_ip_address' to equal False, got True"),
  tableRow('FAIL', F, 'ec2_encrypted_ebs_volumes',           'aws_instance.web_server',            "Expected 'root_block_device.encrypted' to equal True, got None"),
  tableRow('PASS', P, 'ec2_approved_instance_types',         'aws_instance.web_server',            'All checks passed'),
  tableRow('PASS', P, 'ec2_required_tags',                   'aws_instance.web_server',            'All checks passed'),
  tableRow('FAIL', F, 'ec2_no_public_ip',                    'aws_instance.worker',                "Expected 'associate_public_ip_address' to equal False, got None"),
  tableRow('FAIL', F, 's3_bucket_encryption',                'aws_s3_bucket.data_lake',            'server_side_encryption_configuration is missing or empty'),
  tableRow('FAIL', F, 's3_bucket_versioning',                'aws_s3_bucket_versioning.data_lake', "Expected 'versioning_configuration.status' to equal 'Enabled', got None"),
  tableRow('FAIL', F, 'security_group_no_wide_open_ingress', 'aws_security_group.web_sg',          "Expected subset is not contained in actual ingress rules"),
  tableRow('PASS', P, 'security_group_description_required', 'aws_security_group.web_sg',          'All checks passed'),
  tableRow('SKIP', S, 's3_bucket_public_access_block',       'N/A',                               'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 's3_bucket_logging',                   'N/A',                               'SKIPPED: No matching resources found for this rule', M),
  tableRow('SKIP', S, 'rds_encrypted_storage',               'N/A',                               'SKIPPED: No matching resources found for this rule', M),
  { text: '' },
  { segments: [{ text: 'Passed:   ', className: T }, { text: '3', className: P }] },
  { segments: [{ text: 'Failed:   ', className: T }, { text: '9', className: F }] },
  { text: 'Skipped:  18 (no matching resources found)', type: 'output' },
  { text: '' },
  { segments: [{ text: '9 check(s) failed.', className: F }] },
]

// ── Format definitions ────────────────────────────────────────────────────────

type Format = {
  id: string
  label: string
  description: string
  htmlPreview?: boolean
  code?: string
  language?: string
}

const formats: Format[] = [
  {
    id: 'table',
    label: 'Table',
    description: 'Color-coded terminal output. FAIL in red, PASS in green, SKIP in grey — with the rule ID, resource, and message for each check.',
  },
  {
    id: 'html',
    label: 'HTML',
    description: 'Interactive report with summary cards (Total / Passed / Failed / Skipped), status filtering, and a searchable results table. Open in any browser.',
    htmlPreview: true,
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Machine-readable output for programmatic processing, dashboards, or downstream tooling.',
    code: `{
  "summary": {
    "resources_scanned": 5,
    "rules_evaluated": 26,
    "total": 30,
    "failed": 9,
    "passed": 3,
    "skipped": 18
  },
  "results": [
    {
      "status": "FAIL",
      "rule_id": "ec2_no_public_ip",
      "resource": "aws_instance.web_server",
      "message": "Expected 'associate_public_ip_address' to equal False, got True"
    },
    {
      "status": "FAIL",
      "rule_id": "s3_bucket_encryption",
      "resource": "aws_s3_bucket.data_lake",
      "message": "server_side_encryption_configuration is missing or empty"
    },
    {
      "status": "PASS",
      "rule_id": "ec2_approved_instance_types",
      "resource": "aws_instance.web_server",
      "message": "All checks passed"
    }
  ]
}`,
    language: 'json',
  },
  {
    id: 'sarif',
    label: 'SARIF',
    description: 'GitHub Advanced Security compatible — violations appear as inline annotations on pull requests.',
    code: `{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "riveter",
        "rules": [
          { "id": "ec2_no_public_ip" },
          { "id": "s3_bucket_encryption" }
        ]
      }
    },
    "results": [
      {
        "ruleId": "ec2_no_public_ip",
        "level": "error",
        "message": {
          "text": "Expected 'associate_public_ip_address' to equal False, got True"
        },
        "locations": [{
          "physicalLocation": {
            "artifactLocation": { "uri": "main.tf" },
            "region": { "startLine": 4 }
          }
        }]
      }
    ]
  }]
}`,
    language: 'json',
  },
  {
    id: 'junit',
    label: 'JUnit XML',
    description: 'CI/CD test reporting — each failed rule appears as a test failure in GitHub Actions, GitLab, and Jenkins.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="riveter" tests="30" failures="9" skipped="18">
  <testsuite name="aws-security" tests="30" failures="9" skipped="18">

    <testcase name="ec2_no_public_ip: aws_instance.web_server">
      <failure message="Expected 'associate_public_ip_address' to equal False, got True"/>
    </testcase>

    <testcase name="ec2_encrypted_ebs_volumes: aws_instance.web_server">
      <failure message="Expected 'root_block_device.encrypted' to equal True, got None"/>
    </testcase>

    <testcase name="ec2_approved_instance_types: aws_instance.web_server"/>

    <testcase name="s3_bucket_encryption: aws_s3_bucket.data_lake">
      <failure message="server_side_encryption_configuration is missing or empty"/>
    </testcase>

    <testcase name="security_group_no_wide_open_ingress: aws_security_group.web_sg">
      <failure message="Expected subset is not contained in actual ingress rules"/>
    </testcase>

    <testcase name="rds_encrypted_storage: N/A">
      <skipped message="SKIPPED: No matching resources found for this rule"/>
    </testcase>

  </testsuite>
</testsuites>`,
    language: 'xml',
  },
]

export default function OutputFormats() {
  const [active, setActive] = useState(formats[0].id)
  const current = formats.find((f) => f.id === active)!

  return (
    <section className="py-20 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
            Output for every workflow
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Five output formats to fit your review process, CI/CD pipeline, and reporting needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setActive(format.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
                active === format.id
                  ? 'bg-[var(--color-accent)] text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
              )}
            >
              {format.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
            {current.description}
          </p>
          {current.id === 'table' ? (
            <TerminalWindow title="riveter — bash" lines={tableTerminalLines} maxHeight="360px" compact />
          ) : current.htmlPreview ? (
            <HtmlReportPreview />
          ) : (
            <CodeBlock code={current.code!} language={current.language!} />
          )}
        </div>
      </div>
    </section>
  )
}
