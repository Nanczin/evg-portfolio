"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Facebook, Youtube, Smartphone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

import contentData from "@/data/content.json";

export default function Contact({ content = contentData }: { content?: any }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "+55 ",
        message: ""
    });

    // Função para formatar telefone: +55 (XX) XXXXX-XXXX
    const formatPhone = (value: string) => {
        // Remove tudo exceto números
        const numbers = value.replace(/\D/g, "");

        // Se tentar apagar o +55, mantém ele
        if (numbers.length < 2) return "+55 ";

        // Remove o código do país (55) para formatar só o número brasileiro
        const brazilNumber = numbers.slice(2);

        if (brazilNumber.length === 0) return "+55 ";
        if (brazilNumber.length <= 2) return `+55 (${brazilNumber}`;
        if (brazilNumber.length <= 7) return `+55 (${brazilNumber.slice(0, 2)}) ${brazilNumber.slice(2)}`;
        return `+55 (${brazilNumber.slice(0, 2)}) ${brazilNumber.slice(2, 7)}-${brazilNumber.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setFormData({ ...formData, phone: formatted });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (error) {
            console.error('Failed to save lead', error);
        }

        // Extrair número do WhatsApp (prioriza whatsappOnly, fallback para regex do link)
        // @ts-ignore
        let whatsappTarget = content.contact.whatsappOnly;
        if (!whatsappTarget) {
            const match = content.contact.whatsapp.match(/wa\.me\/(\d+)/);
            whatsappTarget = match ? match[1] : "5511988782027";
        }

        const text = `Olá! Vim através do site e gostaria de falar com você.

Mensagem:
${formData.message}`;

        const url = `https://wa.me/${whatsappTarget}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <section id="contact" className="py-12 md:py-20 bg-[#050505] text-white relative">
            {/* Gradient transition from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-10"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16">

                    {/* Contact Info */}
                    <div className="w-full md:w-1/2 space-y-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl lg:text-7xl font-heading text-white"
                        >
                            {content.contact.title}
                        </motion.h2>

                        <div className="space-y-4">
                            {content.contact.phone && content.contact.phone.trim() !== "" && (
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="p-3 rounded-full border border-gray-800 group-hover:border-brand-gold transition-colors">
                                        <Phone className="w-6 h-6 text-gray-400 group-hover:text-brand-gold" />
                                    </div>
                                    <span className="text-xl font-body text-gray-300 group-hover:text-white transition-colors">{content.contact.phone}</span>
                                </div>
                            )}

                            {/* @ts-ignore */}
                            {content.contact.mobile && content.contact.mobile.trim() !== "" && (
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="p-3 rounded-full border border-gray-800 group-hover:border-brand-gold transition-colors">
                                        <Smartphone className="w-6 h-6 text-gray-400 group-hover:text-brand-gold" />
                                    </div>
                                    {/* @ts-ignore */}
                                    <span className="text-xl font-body text-gray-300 group-hover:text-white transition-colors">{content.contact.mobile}</span>
                                </div>
                            )}

                            {content.contact.email && content.contact.email.trim() !== "" && (
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="p-3 rounded-full border border-gray-800 group-hover:border-brand-gold transition-colors">
                                        <Mail className="w-6 h-6 text-gray-400 group-hover:text-brand-gold" />
                                    </div>
                                    <span className="text-xl font-body text-gray-300 group-hover:text-white transition-colors">{content.contact.email}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-gray-900">
                            <p className="text-gray-500 mb-6 uppercase tracking-widest text-sm">Redes Sociais</p>
                            <div className="flex gap-6">
                                {content.contact.whatsapp && content.contact.whatsapp !== "#" && (
                                    <a href={content.contact.whatsapp} target="_blank" className="text-gray-400 hover:text-brand-gold transition-colors">
                                        <FaWhatsapp size={28} />
                                    </a>
                                )}
                                {content.contact.instagram && content.contact.instagram !== "#" && (
                                    <a href={content.contact.instagram} target="_blank" className="text-gray-400 hover:text-brand-gold transition-colors">
                                        <Instagram size={28} strokeWidth={1.5} />
                                    </a>
                                )}
                                {content.contact.facebook && content.contact.facebook !== "#" && (
                                    <a href={content.contact.facebook} target="_blank" className="text-gray-400 hover:text-brand-gold transition-colors">
                                        <Facebook size={28} strokeWidth={1.5} />
                                    </a>
                                )}
                                {content.contact.youtube && content.contact.youtube !== "#" && (
                                    <a href={content.contact.youtube} target="_blank" className="text-gray-400 hover:text-brand-gold transition-colors">
                                        <Youtube size={28} strokeWidth={1.5} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="w-full md:w-1/2">
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nome Completo"
                                    required
                                    minLength={3}
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-lg"
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@exemplo.com.br"
                                    required
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-lg"
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+55 (11) 98888-8888"
                                    required
                                    pattern="^\+55 \(\d{2}\) \d{4,5}-\d{4}$"
                                    title="Por favor, preencha o telefone completo no formato: +55 (XX) XXXXX-XXXX"
                                    minLength={18}
                                    maxLength={19}
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-lg"
                                />
                            </div>
                            <div className="group">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Mensagem"
                                    rows={4}
                                    required
                                    minLength={10}
                                    className="w-full bg-transparent border-b border-gray-700 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-lg resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 border border-brand-gold text-brand-gold font-bold tracking-widest uppercase hover:bg-brand-gold hover:text-black transition-all duration-300 mt-8"
                            >
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
