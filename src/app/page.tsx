import { PrismaHero } from "@/components/landing/newHero";
import { EventsSection } from "@/components/landing/events-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FreelanceSection } from "@/components/landing/freelance-section";
import { ContactSection } from "@/components/landing/contact-section";
import { TeamSection } from "@/components/landing/team-section";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { getEvents } from "@/lib/events";

// Fetch events once at the server level — no client fetching needed
export default async function Home() {
  const allEvents = await getEvents();
  const landingEvents = allEvents.slice(0, 4);

  return (
    <div 
      className="relative overflow-x-clip min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ color: "#050505" }}
    >
      {/* Global Noise Texture Overlay */}
      <NoiseTexture className="opacity-[0.22] mix-blend-overlay" noiseOpacity={0.5} />
      
      <PrismaHero />
      <EventsSection events={landingEvents} />
      <GallerySection />
      <TestimonialsSection />
      <FreelanceSection />
      <TeamSection/>
      <ContactSection />
    </div>
  );
}
