export type PackCategory = 'aws' | 'gcp' | 'azure' | 'kubernetes' | 'compliance'

export interface SeverityDistribution {
  critical: number
  high: number
  medium: number
  low: number
}

export interface RulePack {
  id: string
  name: string
  category: PackCategory
  ruleCount: number
  description: string
  longDescription: string
  severity: SeverityDistribution
  tags: string[]
}

export const rulePacks: RulePack[] = [
  {
    id: 'aws-security',
    name: 'AWS Security',
    category: 'aws',
    ruleCount: 43,
    description: 'Core security best practices for AWS resources including S3, IAM, EC2, RDS, and more.',
    longDescription: 'Comprehensive security controls covering AWS\'s most critical services. Enforces encryption at rest and in transit, least-privilege IAM policies, network security group rules, and public access prevention.',
    severity: { critical: 8, high: 18, medium: 13, low: 4 },
    tags: ['S3', 'IAM', 'EC2', 'RDS', 'VPC'],
  },
  {
    id: 'aws-cis',
    name: 'AWS CIS Benchmarks',
    category: 'aws',
    ruleCount: 38,
    description: 'Center for Internet Security Level 1 & 2 controls mapped to AWS Terraform resources.',
    longDescription: 'Implements CIS AWS Foundations Benchmark v1.5. Covers identity and access management, logging, monitoring, networking, and storage controls aligned with CIS Level 1 and Level 2 recommendations.',
    severity: { critical: 6, high: 15, medium: 12, low: 5 },
    tags: ['CIS', 'IAM', 'CloudTrail', 'CloudWatch', 'Networking'],
  },
  {
    id: 'aws-hipaa',
    name: 'AWS HIPAA',
    category: 'aws',
    ruleCount: 29,
    description: 'HIPAA-aligned controls for healthcare workloads on AWS — encryption, audit logging, access controls.',
    longDescription: 'Maps HIPAA Security Rule technical safeguards to AWS Terraform resources. Ensures PHI data is encrypted, access is logged and audited, and minimum necessary access principles are enforced.',
    severity: { critical: 10, high: 12, medium: 5, low: 2 },
    tags: ['HIPAA', 'PHI', 'Encryption', 'Audit', 'Healthcare'],
  },
  {
    id: 'aws-pci-dss',
    name: 'AWS PCI-DSS',
    category: 'aws',
    ruleCount: 32,
    description: 'Payment Card Industry Data Security Standard controls for cardholder data environments on AWS.',
    longDescription: 'Enforces PCI-DSS v3.2.1 requirements for AWS infrastructure. Covers network segmentation, encryption of cardholder data, access control, logging, and vulnerability management requirements.',
    severity: { critical: 9, high: 14, medium: 7, low: 2 },
    tags: ['PCI-DSS', 'Payments', 'Encryption', 'Network', 'Compliance'],
  },
  {
    id: 'aws-well-architected',
    name: 'AWS Well-Architected',
    category: 'aws',
    ruleCount: 35,
    description: 'AWS Well-Architected Framework security and reliability pillar best practices.',
    longDescription: 'Implements the security and reliability pillars of the AWS Well-Architected Framework. Covers identity management, detective controls, infrastructure protection, data protection, and incident response readiness.',
    severity: { critical: 5, high: 14, medium: 12, low: 4 },
    tags: ['Well-Architected', 'Best Practices', 'Reliability', 'Security'],
  },
  {
    id: 'gcp-security',
    name: 'GCP Security',
    category: 'gcp',
    ruleCount: 36,
    description: 'Security best practices for Google Cloud Platform resources including GCS, IAM, Compute, and GKE.',
    longDescription: 'Comprehensive security controls for GCP workloads. Enforces secure defaults for Cloud Storage, IAM policies, Compute Engine instances, network firewall rules, and Cloud SQL databases.',
    severity: { critical: 7, high: 15, medium: 11, low: 3 },
    tags: ['GCS', 'IAM', 'Compute', 'GKE', 'Cloud SQL'],
  },
  {
    id: 'gcp-cis',
    name: 'GCP CIS Benchmarks',
    category: 'gcp',
    ruleCount: 30,
    description: 'CIS Google Cloud Platform Foundation Benchmark controls for Terraform-managed resources.',
    longDescription: 'Implements CIS GCP Foundations Benchmark. Covers IAM and admin activity logging, networking security, virtual machine configuration, storage permissions, and Cloud SQL security settings.',
    severity: { critical: 5, high: 12, medium: 10, low: 3 },
    tags: ['CIS', 'IAM', 'Logging', 'Networking', 'Cloud SQL'],
  },
  {
    id: 'azure-security',
    name: 'Azure Security',
    category: 'azure',
    ruleCount: 34,
    description: 'Security controls for Azure resources — Storage, AD, VMs, Key Vault, SQL, and networking.',
    longDescription: 'Enforces security best practices across Azure services. Covers Azure AD configuration, storage account security, virtual machine hardening, Key Vault access policies, and network security group rules.',
    severity: { critical: 7, high: 14, medium: 10, low: 3 },
    tags: ['Azure AD', 'Storage', 'Key Vault', 'VMs', 'NSG'],
  },
  {
    id: 'azure-cis',
    name: 'Azure CIS Benchmarks',
    category: 'azure',
    ruleCount: 28,
    description: 'CIS Microsoft Azure Foundations Benchmark controls mapped to Terraform resources.',
    longDescription: 'Implements CIS Azure Foundations Benchmark. Covers identity and access management, security center policies, storage account configurations, database security, networking, and logging requirements.',
    severity: { critical: 5, high: 11, medium: 9, low: 3 },
    tags: ['CIS', 'Azure AD', 'Security Center', 'Logging', 'Networking'],
  },
  {
    id: 'azure-well-architected',
    name: 'Azure Well-Architected',
    category: 'azure',
    ruleCount: 27,
    description: 'Microsoft Azure Well-Architected Framework security pillar best practices.',
    longDescription: 'Implements the security pillar of the Azure Well-Architected Framework. Covers identity management, network security, data protection, application security, and security operations for Azure infrastructure.',
    severity: { critical: 4, high: 11, medium: 9, low: 3 },
    tags: ['Well-Architected', 'Security', 'Identity', 'Data Protection'],
  },
  {
    id: 'kubernetes-security',
    name: 'Kubernetes Security',
    category: 'kubernetes',
    ruleCount: 38,
    description: 'Pod security standards, RBAC controls, network policies, and runtime security for Kubernetes.',
    longDescription: 'Comprehensive Kubernetes security controls aligned with Pod Security Standards and CIS Kubernetes Benchmark. Covers pod security contexts, RBAC configuration, network policies, secrets management, and admission controls.',
    severity: { critical: 8, high: 16, medium: 11, low: 3 },
    tags: ['Pod Security', 'RBAC', 'Network Policy', 'Secrets', 'Admission'],
  },
  {
    id: 'soc2',
    name: 'SOC 2',
    category: 'compliance',
    ruleCount: 31,
    description: 'Trust Service Criteria controls for availability, security, and confidentiality across cloud providers.',
    longDescription: 'Maps SOC 2 Trust Service Criteria to cloud infrastructure controls. Covers logical access controls, change management, system monitoring, encryption requirements, and incident response capabilities across AWS, GCP, and Azure.',
    severity: { critical: 6, high: 13, medium: 9, low: 3 },
    tags: ['SOC 2', 'TSC', 'Availability', 'Security', 'Confidentiality'],
  },
  {
    id: 'nist',
    name: 'NIST CSF',
    category: 'compliance',
    ruleCount: 28,
    description: 'NIST Cybersecurity Framework controls mapped to cloud infrastructure Terraform resources.',
    longDescription: 'Implements NIST CSF Identify, Protect, Detect, Respond, and Recover functions for cloud infrastructure. Enforces asset management, access control, data security, protective technology, and anomaly detection controls.',
    severity: { critical: 5, high: 12, medium: 8, low: 3 },
    tags: ['NIST', 'CSF', 'Identify', 'Protect', 'Detect'],
  },
  {
    id: 'general-security',
    name: 'General Security',
    category: 'compliance',
    ruleCount: 22,
    description: 'Universal cloud security baseline — encryption, public access, logging, and least-privilege defaults.',
    longDescription: 'A cloud-provider-agnostic security baseline covering the most critical security controls. Enforces encryption at rest and in transit, prevention of public exposure, audit logging, and minimum necessary permissions regardless of cloud provider.',
    severity: { critical: 5, high: 9, medium: 6, low: 2 },
    tags: ['Encryption', 'Public Access', 'Logging', 'Least Privilege'],
  },
  {
    id: 'gcp-well-architected',
    name: 'GCP Well-Architected',
    category: 'gcp',
    ruleCount: 26,
    description: 'Google Cloud Architecture Framework security and reliability best practices.',
    longDescription: 'Implements the security foundations of the Google Cloud Architecture Framework. Covers resource hierarchy, IAM policies, network security, data governance, and operational security for GCP infrastructure.',
    severity: { critical: 4, high: 10, medium: 9, low: 3 },
    tags: ['Well-Architected', 'GCP', 'IAM', 'Security', 'Governance'],
  },
]

export const categoryLabels: Record<PackCategory, string> = {
  aws: 'AWS',
  gcp: 'GCP',
  azure: 'Azure',
  kubernetes: 'Kubernetes',
  compliance: 'Compliance',
}

export const categoryColors: Record<PackCategory, string> = {
  aws: '#F97316',
  gcp: '#4285F4',
  azure: '#0078D4',
  kubernetes: '#326CE5',
  compliance: '#22C55E',
}
