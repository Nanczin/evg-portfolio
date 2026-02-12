import { fetchContent, fetchProperties } from "@/lib/fetchData";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertiesCarousel from "@/components/PropertiesCarousel";
import PersonalBroker from "@/components/PersonalBroker";
import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function Home() {
  const content = await fetchContent();
  const properties = await fetchProperties();

  return (
    <main className="min-h-screen bg-brand-black text-white font-body selection:bg-brand-gold selection:text-black overflow-x-hidden">
      <Header />
      <Hero content={content} />
      <PropertiesCarousel properties={properties} />
      <PersonalBroker content={content} />
      <AboutMe content={content} />
      <Contact content={content} />
      <Footer />
    </main>
  );
}
