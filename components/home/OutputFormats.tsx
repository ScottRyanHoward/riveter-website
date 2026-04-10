'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/examples/CodeBlock'

const formats = [
  {
    id: 'table',
    label: 'Table',
    description: 'Color-coded terminal output. FAIL in red, PASS in green, SKIP in grey — with the rule ID, resource, and message for each check.',
    code: `$ riveter scan -p aws-security -t main.tf
Loaded 26 rule(s) from pack aws-security

Scanning 5 resource(s) against 26 rule(s)...

 Status  Rule ID                            Resource                          Message
 ──────  ─────────────────────────────────  ────────────────────────────────  ──────────────────────────────────────────────────
 FAIL    ec2_no_public_ip                   aws_instance.web_server           Expected 'associate_public_ip_address' to equal False, got True
 FAIL    ec2_encrypted_ebs_volumes          aws_instance.web_server           Expected 'root_block_device.encrypted' to equal True, got None
 PASS    ec2_approved_instance_types        aws_instance.web_server           All checks passed
 PASS    ec2_required_tags                  aws_instance.web_server           All checks passed
 FAIL    ec2_no_public_ip                   aws_instance.worker               Expected 'associate_public_ip_address' to equal False, got None
 FAIL    s3_bucket_encryption               aws_s3_bucket.data_lake           server_side_encryption_configuration is missing or empty
 FAIL    s3_bucket_versioning               aws_s3_bucket_versioning.data_lake  Expected 'versioning_configuration.status' to equal 'Enabled', got None
 FAIL    security_group_no_wide_open_ingress  aws_security_group.web_sg       Expected subset is not contained in actual ingress rules
 PASS    security_group_description_required  aws_security_group.web_sg       All checks passed
 SKIP    s3_bucket_public_access_block      N/A                               SKIPPED: No matching resources found for this rule
 SKIP    s3_bucket_logging                  N/A                               SKIPPED: No matching resources found for this rule
 SKIP    rds_encrypted_storage              N/A                               SKIPPED: No matching resources found for this rule`,
    language: 'text',
  },
  {
    id: 'html',
    label: 'HTML',
    description: 'Interactive report with summary cards (Total / Passed / Failed / Skipped), status filtering, and a searchable results table. Open in any browser.',
    code: `<!-- riveter - Infrastructure Rule Enforcement Report -->
<!--
  Summary cards:
    30  TOTAL CHECKS
     3  PASSED
     9  FAILED
    18  SKIPPED

  Filterable table:
  ┌─────────┬───────────────────────────────────┬────────────────────────────┬──────────────────────────────────────────────────┐
  │ STATUS  │ RULE ID                           │ RESOURCE                   │ MESSAGE                                          │
  ├─────────┼───────────────────────────────────┼────────────────────────────┼──────────────────────────────────────────────────┤
  │ FAIL    │ ec2_no_public_ip                  │ web_server                 │ Expected 'associate_public_ip_address' to equal  │
  │         │                                   │                            │ False, got True                                  │
  │ FAIL    │ ec2_encrypted_ebs_volumes         │ web_server                 │ Expected 'root_block_device.encrypted' to equal  │
  │         │                                   │                            │ True, got None                                   │
  │ PASS    │ ec2_approved_instance_types       │ web_server                 │ All checks passed                                │
  │ FAIL    │ s3_bucket_encryption              │ data_lake                  │ server_side_encryption_configuration is missing  │
  │ FAIL    │ security_group_no_wide_open_ingress│ web_sg                    │ Expected subset is not contained in ingress rules│
  │ SKIP    │ rds_encrypted_storage             │ N/A                        │ SKIPPED: No matching resources found             │
  └─────────┴───────────────────────────────────┴────────────────────────────┴──────────────────────────────────────────────────┘

  "All statuses" dropdown · "Search rule ID or resource..." field
-->`,
    language: 'text',
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
          <CodeBlock code={current.code} language={current.language} />
        </div>
      </div>
    </section>
  )
}
