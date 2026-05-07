import Navbar from '@/components/navbar'
import HeroSection from '@/components/sections/hero-section'
import AboutSection from '@/components/sections/about-section'
import ProcessSection from '@/components/sections/process-section'
import PortfolioSection from '@/components/sections/portfolio-section'
import MaterialsSection from '@/components/sections/materials-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import ContactSection from '@/components/sections/contact-section'
import FooterSection from '@/components/sections/footer-section'
import WhatsAppButton from '@/components/whatsapp-button'
import LoadingScreen from '@/components/loading-screen'
import SmoothScrollProvider from '@/components/smooth-scroll-provider'

export default function Home() {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProcessSection />
        <PortfolioSection />
        <MaterialsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <FooterSection />
      <WhatsAppButton />
    </SmoothScrollProvider>
  )
}
