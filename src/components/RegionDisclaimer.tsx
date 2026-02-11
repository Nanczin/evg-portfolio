"use client";

import content from "@/data/content.json";

// Helper para extrair o número
const getWhatsappNumber = () => {
    // Tenta vários formatos de link de whatsapp
    const link = content.contact.whatsapp;
    // @ts-ignore
    const whatsappOnly = content.contact.whatsappOnly;

    if (whatsappOnly) return whatsappOnly;

    const match = link.match(/wa\.me\/(\d+)/) || link.match(/api\.whatsapp\.com\/send\?phone=(\d+)/);
    if (match && match[1]) return match[1];

    const nums = link.replace(/\D/g, "");
    if (nums.length > 10) return nums;

    return "5511988782027";
};

export default function RegionDisclaimer() {
    const whatsappNumber = getWhatsappNumber();

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto bg-brand-gray/50 border border-brand-gold/20 rounded-lg p-8 md:p-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold/50 group-hover:bg-brand-gold transition-colors"></div>

                <h3 className="text-xl md:text-2xl font-heading text-white mb-4">
                    Não encontrou a região que buscava?
                </h3>
                <p className="text-gray-300 font-body text-base md:text-lg leading-relaxed mb-8">
                    Saiba que estes exemplares representam apenas uma parcela do meu portfólio. <br className="hidden md:block" />
                    Entre em contato comigo para que eu possa selecionar as melhores opções, <br className="hidden md:block" />
                    alinhadas exatamente ao seu perfil e preferência.
                </p>

                <a
                    href={`https://wa.me/${whatsappNumber}?text=Ol%C3%A1%2C%20quero%20ter%20mais%20informa%C3%A7%C3%B5es%20dos%20empreendimentos%20do%20seu%20portif%C3%B3lio%20por%20gentileza%21`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-all duration-300 rounded uppercase tracking-widest text-sm font-bold"
                >
                    Fale Comigo
                </a>
            </div>
        </div>
    );
}
