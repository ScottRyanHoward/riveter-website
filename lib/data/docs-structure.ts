export interface DocSection {
  id: string
  title: string
  items: DocItem[]
}

export interface DocItem {
  id: string
  title: string
  href: string
}

export const docsStructure: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction', href: '#introduction' },
      { id: 'installation', title: 'Installation', href: '#installation' },
      { id: 'quick-start', title: 'Quick Start', href: '#quick-start' },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    items: [
      { id: 'how-scanning-works', title: 'How Scanning Works', href: '#how-scanning-works' },
      { id: 'rule-structure', title: 'Rule Structure', href: '#rule-structure' },
      { id: 'compliance-packs', title: 'Compliance Packs', href: '#compliance-packs' },
      { id: 'severity-levels', title: 'Severity Levels', href: '#severity-levels' },
    ],
  },
  {
    id: 'cli-reference',
    title: 'CLI Reference',
    items: [
      { id: 'scan', title: 'riveter scan', href: '#scan' },
      { id: 'scan-state', title: 'riveter scan-state', href: '#scan-state' },
      { id: 'generate-rules', title: 'riveter generate-rules', href: '#generate-rules' },
      { id: 'list-rule-packs', title: 'riveter list-rule-packs', href: '#list-rule-packs' },
    ],
  },
  {
    id: 'configuration',
    title: 'Configuration',
    items: [
      { id: 'config-file', title: 'Config File', href: '#config-file' },
      { id: 'custom-rules', title: 'Custom Rules', href: '#custom-rules' },
      { id: 'ignoring-rules', title: 'Ignoring Rules', href: '#ignoring-rules' },
    ],
  },
  {
    id: 'output-formats',
    title: 'Output Formats',
    items: [
      { id: 'table-output', title: 'Table', href: '#table-output' },
      { id: 'json-output', title: 'JSON', href: '#json-output' },
      { id: 'sarif-output', title: 'SARIF', href: '#sarif-output' },
      { id: 'junit-output', title: 'JUnit XML', href: '#junit-output' },
      { id: 'html-output', title: 'HTML Report', href: '#html-output' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: [
      { id: 'github-actions', title: 'GitHub Actions', href: '#github-actions' },
      { id: 'gitlab-ci', title: 'GitLab CI', href: '#gitlab-ci' },
      { id: 'pre-commit', title: 'Pre-commit Hooks', href: '#pre-commit' },
    ],
  },
]
