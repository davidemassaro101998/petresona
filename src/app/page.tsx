import { Header } from "@/sections/header";
import { HeroSection } from "@/sections/hero-section";
import { AnswerBar } from "@/sections/answer-bar";
import { RecognitionSection } from "@/sections/recognition-section";
import { ModelSection } from "@/sections/model-section";
import { HowItWorksSection } from "@/sections/how-it-works-section";
import { GiorgiaSection } from "@/sections/giorgia-section";
import { OfferSection } from "@/sections/offer-section";
import { FitSection } from "@/sections/fit-section";
import { BookingSection } from "@/sections/booking-section";
import { FaqSection } from "@/sections/faq-section";
import { ClosingCta } from "@/sections/closing-cta";
import { Footer } from "@/sections/footer";
import { MobileCtaBar } from "@/sections/mobile-cta-bar";

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
