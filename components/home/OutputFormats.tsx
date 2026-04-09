'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/examples/CodeBlock'

const formats = [
  {
    id: 'table',
    label: 'Table',
    description: 'Human-readable terminal output with color-coded severity.',
    code: `VIOLATION REPORT — riveter scan
─────────────────────────────────────────────────────────────────
  Severity   Rule ID                   Resource              File
─────────────────────────────────────────────────────────────────
  CRITICAL   s3-public-read-blocked    aws_s3_bucket.assets  main.tf:12
  HIGH       sg-no-unrestricted-ssh    aws_security_group.sg main.tf:34
  MEDIUM     rds-encryption-at-rest    aws_db_instance.db    db.tf:8
  LOW        iam-no-admin-policy       aws_iam_policy.admin  iam.tf:19
─────────────────────────────────────────────────────────────────
  4 violations found  (1 critical, 1 high, 1 medium, 1 low)`,
    language: 'text',
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Machine-readable output for programmatic processing.',
    code: `{
  "summary": {
    "files_scanned": 12,
    "violations": 4,
    "critical": 1,
    "high": 1,
    "medium": 1,
    "low": 1
  },
  "violations": [
    {
      "rule_id": "s3-public-read-blocked",
      "severity": "CRITICAL",
      "resource": "aws_s3_bucket.assets",
      "file": "main.tf",
      "line": 12,
      "message": "S3 bucket allows public read access",
      "remediation": "Set block_public_acls and block_public_policy to true"
    }
  ]
}`,
    language: 'json',
  },
  {
    id: 'sarif',
    label: 'SARIF',
    description: 'GitHub Advanced Security compatible — annotations appear inline in PRs.',
    code: `{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "riveter",
        "version": "1.0.0",
        "rules": [{ "id": "s3-public-read-blocked" }]
      }
    },
    "results": [{
      "ruleId": "s3-public-read-blocked",
      "level": "error",
      "message": { "text": "S3 bucket allows public read access" },
      "locations": [{
        "physicalLocation": {
          "artifactLocation": { "uri": "main.tf" },
          "region": { "startLine": 12 }
        }
      }]
    }]
  }]
}`,
    language: 'json',
  },
  {
    id: 'junit',
    label: 'JUnit XML',
    description: 'CI/CD test reporting — violations appear as test failures.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="riveter" tests="4" failures="4" time="0.82">
  <testsuite name="aws-security" tests="4" failures="4">
    <testcase name="s3-public-read-blocked: aws_s3_bucket.assets">
      <failure message="S3 bucket allows public read access" type="CRITICAL">
        File: main.tf, Line: 12
        Remediation: Set block_public_acls to true
      </failure>
    </testcase>
    <testcase name="sg-no-unrestricted-ssh: aws_security_group.sg">
      <failure message="Security group allows 0.0.0.0/0 on port 22" type="HIGH">
        File: main.tf, Line: 34
      </failure>
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
          <CodeBlock code={current.code} language={current.language} />
        </div>
      </div>
    </section>
  )
}
