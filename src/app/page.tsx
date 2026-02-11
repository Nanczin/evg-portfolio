import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertiesCarousel from "@/components/PropertiesCarousel";
import PersonalBroker from "@/components/PersonalBroker";
import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-white font-body selection:bg-brand-gold selection:text-black overflow-x-hidden">
      <Header />
      <Hero />
      <PropertiesCarousel />
      <PersonalBroker />
      <AboutMe />
      <Contact />
      <Footer />
    </main>
  );
}
