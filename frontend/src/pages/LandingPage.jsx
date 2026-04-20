import Navbar from '../components/landing/Navbar';
import HeroSlider from '../components/landing/HeroSlider';
import FeaturesSection from '../components/landing/FeaturesSection';
import QbitSection from '../components/landing/QbitSection';
import AICapabilitiesSection from '../components/landing/AICapabilitiesSection';
import DeviceSection from '../components/landing/DeviceSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import QbotFloating from '../components/landing/QbotFloating';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050a15] text-white overflow-x-hidden">
      <Navbar />
      <HeroSlider />

      {/* Divider line */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="py-24">
        <FeaturesSection />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="py-24">
        <QbitSection />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="py-24">
        <AICapabilitiesSection />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="py-24">
        <DeviceSection />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="py-24">
        <UseCasesSection />
      </div>
      <CTASection />
      <Footer />

      {/* Qbot - homepage only floating assistant */}
      <QbotFloating />
    </div>
  );
}
