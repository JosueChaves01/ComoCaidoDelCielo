import { getTerrazas } from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import TerrazasGrid from '@/components/landing/TerrazasGrid'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CTASection from '@/components/landing/CTASection'

export const revalidate = 60

export default async function HomePage() {
  let terrazas: Awaited<ReturnType<typeof getTerrazas>> = []
  try {
    terrazas = await getTerrazas()
  } catch {
    // Si el API no responde, mostramos la página sin terrazas
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TerrazasGrid terrazas={terrazas} />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
