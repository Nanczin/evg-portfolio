"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import propertyData from "@/data/properties.json";
import RegionDisclaimer from "./RegionDisclaimer";

interface Property {
    id: number;
    name: string;
    location: string;
    image: string;
    description?: string;
    link?: string;
}

// Duplicate list to ensure smooth infinite loop with few items
const properties = [...propertyData, ...propertyData, ...propertyData];

const Wrapper = ({ children, id }: { children: React.ReactNode; id: number }) => {
    return (
        <Link
            href={`/properties/${id}`}
            className="block h-full w-full cursor-pointer"
        >
            {children}
        </Link>
    );
};

export default function PropertiesCarousel() {
    return (
        <section id="properties" className="py-20 bg-brand-black relative">
            {/* Gradient transition from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 mb-12">
                <h2 className="text-3xl md:text-5xl font-heading text-white uppercase tracking-widest border-l-4 border-brand-gold pl-4">
                    Empreendimentos
                </h2>
            </div>

            <Swiper
                modules={[Navigation, Pagination, Mousewheel]}
                spaceBetween={30}
                slidesPerView={1.2}
                centeredSlides={true}
                loop={true}
                mousewheel={true}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 2.2,
                    },
                    1024: {
                        slidesPerView: 3.2,
                    },
                }}
                className="w-full h-[500px] md:h-[600px] pb-12 properties-swiper"
            >
                {properties.map((property, idx) => (
                    <SwiperSlide key={`${property.id}-${idx}`} className="relative group overflow-hidden rounded-sm cursor-grab active:cursor-grabbing">
                        <Wrapper id={property.id}>
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 [.swiper-slide-active_&]:scale-110">
                                <Image
                                    src={property.image}
                                    alt={property.name}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    unoptimized
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="text-2xl font-heading text-white mb-2 flex items-center gap-3">
                                    {property.name}
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-brand-gold">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </span>
                                </h3>
                                <p className="text-brand-gold font-body text-sm uppercase tracking-wider mb-3">{property.location}</p>

                                {property.description && (
                                    <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-in-out">
                                        <p className="text-gray-300 font-body text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-4">
                                            {property.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Wrapper>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Portfolio Disclaimer / CTA - Replaced with reusable component */}
            <RegionDisclaimer />
        </section>
    );
}
