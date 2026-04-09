import PageHeader from '@/components/layout/PageHeader'
import PackGrid from '@/components/rule-packs/PackGrid'

export const metadata = {
  title: 'Rule Packs — riveter',
  description: '15 pre-built compliance packs for AWS, GCP, Azure, Kubernetes, CIS, HIPAA, PCI-DSS, SOC 2, and more.',
}

export default function RulePacksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <PageHeader
        badge="15 Compliance Packs"
        title="15 Compliance Packs."
        titleGradient="One Tool."
        description="Pre-built rule sets for every major compliance framework and cloud provider. Filter by category to find the pack you need."
      />
      <PackGrid />
    </div>
  )
}
