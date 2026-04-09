import { FileCode, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileCode,
    title: 'Write Terraform',
    description: 'Define your infrastructure as code using standard Terraform HCL syntax.',
  },
  {
    number: '02',
    icon: Terminal,
    title: 'Run riveter scan',
    description: 'Point riveter at your Terraform files or directory. Select a compliance pack or use your own rules.',
  },
  {
    number: '03',
    icon: AlertTriangle,
    title: 'Review violations',
    description: 'Get a clear report of misconfigurations, categorized by severity: critical, high, medium, and low.',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Fix before deploy',
    description: 'Address violations in your code before applying. Integrate into CI/CD for automated enforcement.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
            How it works
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            From Terraform to compliant infrastructure in four steps.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative flex flex-col items-center text-center group">
                  {/* Step number + icon */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[rgba(249,115,22,0.4)] transition-colors">
                      <Icon className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-accent-dim)] border border-[rgba(249,115,22,0.3)] text-[var(--color-accent)] text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
