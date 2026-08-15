import { Header } from "@/components/site/header";
import { HeroSection } from "@/components/site/hero-section";
import { AnswerBar } from "@/components/site/answer-bar";
import { RecognitionSection } from "@/components/site/recognition-section";
import { ModelSection } from "@/components/site/model-section";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { GiorgiaSection } from "@/components/site/giorgia-section";
import { OfferSection } from "@/components/site/offer-section";
import { FitSection } from "@/components/site/fit-section";
import { BookingSection } from "@/components/site/booking-section";
import { FaqSection } from "@/components/site/faq-section";
import { ClosingCta } from "@/components/site/closing-cta";
import { Footer } from "@/components/site/footer";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AnswerBar />
        <RecognitionSection />
        <ModelSection />
        <HowItWorksSection />
        <GiorgiaSection />
        <OfferSection />
        <FitSection />
        <BookingSection />
        <FaqSection />
        <ClosingCta />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
