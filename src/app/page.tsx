import Hero from "@/components/sections/Hero";
import SocialLinks from "@/components/sections/SocialLinks";
import Shop from "@/components/sections/Shop";
import FreeDownloads from "@/components/sections/FreeDownloads";
import NotionSection from "@/components/sections/NotionSection";
import AboutMe from "@/components/sections/AboutMe";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SocialLinks />
      <Shop />
      <NotionSection />
      <FreeDownloads />
      <AboutMe />
      <Footer />
    </main>
  );
}
