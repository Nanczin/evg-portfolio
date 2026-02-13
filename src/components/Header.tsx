"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { X } from "lucide-react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black/40 backdrop-blur-md py-2 shadow-lg" : "bg-transparent py-4"
                    }`}
            >
                <div className="w-full px-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 -ml-4 md:ml-0">
                        <div className="flex items-center gap-2">
                            <div className="relative w-24 h-24 md:w-32 md:h-32">
                                {!logoError && (
                                    <Image
                                        src="/logo.png"
                                        alt="EVG Logo"
                                        fill
                                        className="object-contain"
                                        style={{ filter: 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))' }}
                                        unoptimized
                                        onError={() => setLogoError(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 md:mr-20">
                        {[
                            { label: "Início", href: "#home" },
                            { label: "Empreendimentos", href: "#properties" },
                            { label: "Personal Broker", href: "#personal-broker" },
                            { label: "Sobre", href: "#about" },
                            { label: "Contato", href: "#contact" }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-heading text-white hover:text-brand-gold transition-colors tracking-widest uppercase relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Hamburger Menu (Mobile Only) */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden text-brand-gold hover:text-white transition-colors z-50 focus:outline-none"
                        aria-label="Open Menu"
                    >
                        <div className="flex flex-col gap-1.5 items-end">
                            <span className="block w-8 h-[1.5px] bg-[#D4AF37]"></span>
                            <span className="block w-6 h-[1.5px] bg-[#D4AF37]"></span>
                        </div>
                    </button>
                </div>
            </header>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 h-[100dvh] z-[60] bg-brand-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-6 right-6 text-brand-gold"
                        >
                            <X size={32} strokeWidth={1} />
                        </button>
                        <nav className="flex flex-col gap-6 text-center">
                            {[
                                { label: "Início", href: "#home" },
                                { label: "Empreendimentos", href: "#properties" },
                                { label: "Personal Broker", href: "#personal-broker" },
                                { label: "Sobre", href: "#about" },
                                { label: "Contato", href: "#contact" }
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-heading text-white hover:text-brand-gold transition-colors tracking-widest uppercase"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
