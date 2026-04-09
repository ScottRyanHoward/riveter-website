import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import FeatureGrid from '@/components/home/FeatureGrid'
import ComplianceTeaser from '@/components/home/ComplianceTeaser'
import OutputFormats from '@/components/home/OutputFormats'
import CTABanner from '@/components/home/CTABanner'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeatureGrid />
      <ComplianceTeaser />
      <OutputFormats />
      <CTABanner />
    </>
  )
}
