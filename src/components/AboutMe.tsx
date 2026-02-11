"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import content from "@/data/content.json";

export default function AboutMe() {
    return (
        <section id="about" className="flex flex-col-reverse md:flex-row min-h-screen bg-brand-black relative">
            {/* Gradient transition from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>

            {/* Content Side (Left) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16 relative">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-heading text-white mb-8">
                        {content.aboutMe.titlePrefix} <span className="text-brand-gold italic">{content.aboutMe.titleHighlight}</span>
                    </h2>

                    <div className="text-gray-300 space-y-6 font-body text-lg leading-relaxed text-justify">
                        <p>
                            {content.aboutMe.paragraph1}
                        </p>
                        <p>
                            {content.aboutMe.paragraph2}
                        </p>
                        <p>
                            {content.aboutMe.paragraph3}
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="w-16 h-1 bg-brand-gold"></div>
                    </div>
                </motion.div>
            </div>

            {/* Visual Side (Right) - Using Unsplash placeholder for Estevão portrait */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
                {content.aboutMe.image && content.aboutMe.image.startsWith('http') ? (
                    <>
                        <Image
                            src={content.aboutMe.image}
                            alt="Estevão Venancio Garcia"
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-transparent to-transparent md:bg-gradient-to-r md:from-brand-black md:via-brand-black/20 md:to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center text-gray-600">Sem imagem</div>
                )}
            </div>
        </section>
    );
}
