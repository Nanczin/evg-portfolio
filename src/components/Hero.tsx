"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";


import contentData from "@/data/content.json";


export default function Hero({ content = contentData }: { content?: any }) {
    const [bgError, setBgError] = useState(false);
    return (
        <section id="home" className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-brand-black">
            {/* Background Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Base gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0"></div>

                {/* Gold accent gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-brand-gold/5"></div>

                {/* Property image overlay */}
                {
                    content.hero.bgImage && content.hero.bgImage.startsWith('http') && !bgError && (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={content.hero.bgImage}
                                alt=""
                                fill
                                priority
                                quality={90}
                                className="object-cover opacity-40"
                                sizes="100vw"
                                onError={() => setBgError(true)}
                            />
                        </div>
                    )
                }

                {/* Vignette effect */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60"></div>
            </div >

            <div className="relative z-10 text-center px-4 flex flex-col items-center">

                {/* Main Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-white font-heading text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase mb-4"
                >
                    <span className="font-bold">Estevão</span>{" "}
                    <span className="font-light">Venancio</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-gray-300 font-body text-sm md:text-lg tracking-wider max-w-2xl mx-auto"
                >
                    {content.hero.subtitle}
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <ChevronDown className="text-brand-gold w-10 h-10 md:w-12 md:h-12 opacity-80 hover:opacity-100 transition-opacity drop-shadow-lg" />
            </motion.div>
        </section >
    );
}
