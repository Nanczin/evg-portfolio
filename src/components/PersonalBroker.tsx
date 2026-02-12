"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import contentData from "@/data/content.json";

export default function PersonalBroker({ content = contentData }: { content?: any }) {
    return (
        <section id="personal-broker" className="flex flex-col md:flex-row min-h-screen bg-[#0f0f0f] relative">
            {/* Gradient transition from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-10"></div>

            {/* Visual Side */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
                {content.personalBroker.image && content.personalBroker.image.startsWith('http') ? (
                    <>
                        <Image
                            src={content.personalBroker.image}
                            alt="Luxury Mansion Night"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center text-gray-600">Sem imagem</div>
                )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-heading text-white mb-8 leading-tight">
                        {content.personalBroker.titlePrefix} <span className="text-brand-gold font-bold">{content.personalBroker.titleHighlight}</span> {content.personalBroker.titleSuffix}
                    </h2>

                    <div className="space-y-6 font-body text-gray-400 text-lg leading-relaxed">
                        <p>
                            {content.personalBroker.text1}
                        </p>
                        <p>
                            {content.personalBroker.text2}
                        </p>
                        <p className="border-l-2 border-brand-gold pl-4 italic text-white/90">
                            "{content.personalBroker.quote}"
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
