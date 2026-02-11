"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { ArrowLeft, MapPin, Check, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import RegionDisclaimer from "@/components/RegionDisclaimer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import propertyData from "@/data/properties.json";
import content from "@/data/content.json";

// Helper para extrair o número
const getWhatsappNumber = () => {
    const link = content.contact.whatsapp;
    // Tenta vários formatos de link de whatsapp
    const match = link.match(/wa\.me\/(\d+)/) || link.match(/api\.whatsapp\.com\/send\?phone=(\d+)/);

    // Se extraiu com sucesso
    if (match && match[1]) return match[1];

    // Fallback: se o link já for apenas números ou algo assim
    const nums = link.replace(/\D/g, "");
    if (nums.length > 10) return nums;

    return "5511988782027";
};

interface Property {
    id: number;
    name: string;
    location: string;
    image: string;
    description?: string;
    link?: string;
    gallery?: string[];
}

export default function PropertyDetails() {
    const params = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [swiperRef, setSwiperRef] = useState<any>(null);

    useEffect(() => {
        if (params.id) {
            const id = Number(params.id);
            const found = propertyData.find((p) => p.id === id);
            if (found) {
                setProperty(found);
            }
        }
    }, [params]);

    const images = property?.gallery && property.gallery.length > 0
        ? property.gallery
        : (property ? [property.image] : []);





    const openLightbox = (index: number) => {
        setActiveImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (images.length > 0) setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (images.length > 0) setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, images]); // Added images dependency

    // Helper to format description text with line breaks
    const formatDescription = (text: string) => {
        return text.split('\n').map((line, i) => (
            <span key={i} className="block mb-2">
                {line}
            </span>
        ));
    };

    if (!property) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="animate-pulse text-brand-gold font-heading text-xl">Carregando...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-brand-black text-[#EDEDED] font-body relative">

            {/* Back Button */}
            <Link
                href="/#properties"
                className="fixed top-6 left-6 z-40 bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:text-brand-gold hover:bg-black/80 transition-all border border-white/10 group"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Hero Gallery Slider */}
            <section className="relative h-[60vh] md:h-[75vh] w-full group">
                <Swiper
                    modules={[Navigation, Pagination, EffectFade, Autoplay]}
                    effect="fade"
                    speed={1000}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    onSwiper={setSwiperRef}
                    pagination={{ clickable: true }}
                    loop={true}
                    className="h-full w-full property-detail-swiper"
                >
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx} className="relative w-full h-full cursor-pointer" onClick={() => openLightbox(idx)}>
                            <Image
                                src={img}
                                alt={`${property.name} - Imagem ${idx + 1}`}
                                fill
                                className="object-cover"
                                quality={100}
                                unoptimized
                                priority={idx === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-brand-black pointer-events-none"></div>
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation Buttons */}
                    <button
                        onClick={(e) => { e.stopPropagation(); swiperRef?.slidePrev(); }}
                        className="absolute top-1/2 left-4 md:left-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all cursor-pointer -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); swiperRef?.slideNext(); }}
                        className="absolute top-1/2 right-4 md:right-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all cursor-pointer -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <ChevronRight size={24} />
                    </button>
                </Swiper>

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 pb-16 md:pb-24 pointer-events-none">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-2 shadow-black drop-shadow-lg">
                                {property.name}
                            </h1>
                            <div className="flex items-center text-gray-300 gap-2 mb-6">
                                <MapPin size={18} className="text-brand-gold" />
                                <span className="text-sm md:text-lg tracking-wide uppercase">{property.location}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-6 py-12 md:py-20 relative z-10 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Description */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-brand-gray border border-white/5 p-8 md:p-10 rounded-lg shadow-xl"
                        >
                            <h2 className="text-2xl font-heading text-brand-gold mb-6 border-b border-white/10 pb-4">
                                Detalhes do Empreendimento
                            </h2>
                            <div className="text-gray-300 leading-relaxed space-y-4 text-base md:text-lg">
                                {property.description ? formatDescription(property.description) : (
                                    <p className="italic text-gray-500">Descrição detalhada não disponível.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Gallery Grid (All images) */}
                        {images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-heading text-white border-l-4 border-brand-gold pl-3">Galeria Completa</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group bg-brand-gray cursor-pointer"
                                            onClick={() => openLightbox(idx)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Galeria ${idx}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                quality={80}
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full border border-white/20">
                                                    <div className="w-6 h-6 text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M14 10l6.1-6.1" /><path d="M9 21H3v-6" /><path d="M10 14l-6.1 6.1" /></svg></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar CTA */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-brand-gray/80 backdrop-blur-md border border-brand-gold/20 p-8 rounded-lg sticky top-24"
                        >
                            <h3 className="text-xl font-heading text-white mb-2">Interessado neste imóvel?</h3>
                            <p className="text-gray-400 text-sm mb-6">Receba atendimento exclusivo e tire todas as suas dúvidas sobre o {property.name}.</p>

                            <a
                                href={`https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(`Olá, quero saber mais informações sobre ${property.name} por gentilza!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-brand-gold text-black font-bold py-4 rounded text-center uppercase tracking-wider hover:bg-[#b08d2b] transition-all shadow-lg hover:shadow-brand-gold/20 mb-4 flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={20} />
                                Agendar Visita
                            </a>

                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                        <Check size={14} />
                                    </div>
                                    <span>Atendimento Personalizado</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                        <Check size={14} />
                                    </div>
                                    <span>Negociação Direta</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                        <Check size={14} />
                                    </div>
                                    <span>Visita Acompanhada</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Region Disclaimer */}
            <RegionDisclaimer />

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
                    >
                        <ChevronRight size={40} />
                    </button>

                    <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full max-w-7xl max-h-[85vh]">
                            <Image
                                src={images[activeImageIndex]}
                                alt={`Fullscreen ${activeImageIndex}`}
                                fill
                                className="object-contain"
                                quality={100}
                                unoptimized
                                priority
                            />
                        </div>
                        <div className="absolute bottom-6 left-0 w-full text-center text-white/50 text-sm">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
