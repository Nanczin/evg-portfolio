"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Trash2, Plus, Save, ExternalLink, LogOut, Loader2 } from "lucide-react";

interface Property {
    id: number;
    name: string;
    location: string;
    image: string;
    description?: string;
    link?: string;
    gallery?: string[];
}

export default function AdminPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("properties");
    const [leads, setLeads] = useState<any[]>([]); // Novo estado para leads
    const [bulkInputs, setBulkInputs] = useState<{ [key: number]: string }>({});

    const handleBulkInputChange = (propertyId: number, value: string) => {
        setBulkInputs(prev => ({ ...prev, [propertyId]: value }));
    };

    const handleBulkAddGalleryImages = (propertyIndex: number, propertyId: number) => {
        const rawText = bulkInputs[propertyId] || "";
        if (!rawText.trim()) return;

        const urls = rawText.split('\n')
            .map(u => {
                let url = u.trim();
                if (!url) return "";
                // Se não tem extensão de imagem, adiciona .png
                if (!/\.(png|jpg|jpeg|gif|webp)$/i.test(url)) {
                    return `${url}.png`;
                }
                return url;
            })
            .filter(u => u.length > 0);

        if (urls.length === 0) return;

        const newProperties = [...properties];
        if (!newProperties[propertyIndex].gallery) newProperties[propertyIndex].gallery = [];
        // @ts-ignore
        newProperties[propertyIndex].gallery.push(...urls);
        setProperties(newProperties);

        // Clear input
        setBulkInputs(prev => ({ ...prev, [propertyId]: "" }));
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "Titevo1$") {
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
        } else {
            setError("Senha incorreta");
        }
    };

    useEffect(() => {
        const isAuth = localStorage.getItem("admin_auth");
        if (isAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProperties();
            fetchContent();
            fetchLeads(); // Buscar leads ao autenticar
        }
    }, [isAuthenticated]);

    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/admin/properties");
            const data = await res.json();
            setProperties(data);
        } catch (err) {
            console.error("Failed to fetch properties", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            setContent(data);
        } catch (err) {
            console.error("Failed to fetch content", err);
        }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads");
            const data = await res.json();
            setLeads(data || []);
        } catch (err) {
            console.error("Failed to fetch leads", err);
        }
    };

    const handleDeleteLead = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir permanentemente este lead?")) return;

        try {
            const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } else {
                alert("Erro ao excluir lead.");
            }
        } catch (err) {
            console.error("Failed to delete lead", err);
            alert("Erro ao excluir lead.");
        }
    };

    const handleSaveProperties = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(properties),
            });
            if (res.ok) alert("Propriedades salvas!");
            else alert("Erro ao salvar propriedades.");
        } catch (err) {
            alert("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContent = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
            });
            if (res.ok) alert("Conteúdo do site salvo!");
            else alert("Erro ao salvar conteúdo.");
        } catch (err) {
            alert("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProperty = (index: number, field: keyof Property, value: string) => {
        const newProperties = [...properties];
        // @ts-ignore
        newProperties[index][field] = value;
        setProperties(newProperties);
    };

    const handleAddProperty = () => {
        const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
        setProperties([...properties, { id: newId, name: "Nova Propriedade", location: "Localização", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", description: "", link: "#", gallery: [] }]);
    };

    const handleDeleteProperty = (id: number) => {
        if (confirm("Tem certeza que deseja excluir?")) {
            setProperties(properties.filter(p => p.id !== id));
        }
    }

    const handleGalleryChange = (propertyIndex: number, imageIndex: number, value: string) => {
        const newProperties = [...properties];
        if (!newProperties[propertyIndex].gallery) newProperties[propertyIndex].gallery = [];
        // @ts-ignore
        newProperties[propertyIndex].gallery[imageIndex] = value;
        setProperties(newProperties);
    };

    const handleAddGalleryImage = (propertyIndex: number) => {
        const newProperties = [...properties];
        if (!newProperties[propertyIndex].gallery) newProperties[propertyIndex].gallery = [];
        // @ts-ignore
        newProperties[propertyIndex].gallery.push("");
        setProperties(newProperties);
    };

    const handleRemoveGalleryImage = (propertyIndex: number, imageIndex: number) => {
        const newProperties = [...properties];
        if (!newProperties[propertyIndex].gallery) return;
        // @ts-ignore
        newProperties[propertyIndex].gallery.splice(imageIndex, 1);
        setProperties(newProperties);
    };

    const handleContentChange = (section: string, field: string, value: string) => {
        setContent((prev: any) => {
            const updatedSection = {
                ...prev[section],
                [field]: value
            };

            // Se alterou o número do WhatsApp, atualiza também o Link completo automaticamente
            if (section === 'contact' && field === 'whatsappOnly') {
                const cleanNumber = value.replace(/\D/g, ""); // Remove caracteres não numéricos
                const message = "Olá, vim pela sua página e gostaria mais informações sobre os seus empreendimentos";
                updatedSection['whatsapp'] = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
            }

            return {
                ...prev,
                [section]: updatedSection
            };
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-black text-[#EDEDED] font-body">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-27bfef10fa66?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 filter grayscale"></div>

                <form onSubmit={handleLogin} className="relative z-10 bg-brand-gray/80 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/10 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative w-32 h-32">
                                <Image
                                    src="https://i.imgur.com/w3KiY9N.png"
                                    alt="EVG Logo"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-heading tracking-widest uppercase">Admin Access</h1>
                    </div>

                    {error && <p className="text-red-400 mb-4 text-center text-sm bg-red-900/20 py-2 rounded border border-red-900/50">{error}</p>}

                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className="w-full p-3 bg-black/50 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full bg-brand-gold text-black font-bold py-3 px-4 rounded hover:bg-[#b08d2b] transition duration-300 uppercase tracking-wider font-heading"
                        >
                            Entrar
                        </button>
                    </div>

                    <Link href="/" className="block text-center mt-6 text-gray-400 hover:text-brand-gold text-sm transition-colors">
                        Voltar ao site
                    </Link>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black text-[#EDEDED] font-body pb-32 md:pb-20">
            {/* Header */}
            <header className="bg-brand-gray border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
                <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative w-16 h-16">
                            <Image
                                src="https://i.imgur.com/w3KiY9N.png"
                                alt="EVG Logo"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        <div className="h-6 w-px bg-white/10"></div>
                        <h1 className="text-sm md:text-lg font-heading tracking-wider text-gray-300">Admin</h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ExternalLink size={18} />
                            <span className="hidden md:inline">Ver Site</span>
                        </Link>
                        <button
                            onClick={() => { localStorage.removeItem("admin_auth"); setIsAuthenticated(false); }}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 max-w-5xl">

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                    {[
                        { id: 'properties', label: 'Propriedades' },
                        { id: 'leads', label: 'Leads' }, // Nova aba
                        { id: 'hero', label: 'Início' },
                        { id: 'personalBroker', label: 'Personal Broker' },
                        { id: 'aboutMe', label: 'Sobre Mim' },
                        { id: 'contact', label: 'Contato' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md font-heading uppercase text-sm tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-gold text-black font-bold' : 'bg-brand-gray text-gray-400 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading && !content ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-brand-gold w-8 h-8" /></div>
                ) : (
                    <>
                        {/* PROPERTIES TAB */}
                        {activeTab === 'properties' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-heading text-white">Gerenciar Propriedades</h2>
                                    <div className="flex gap-3">
                                        <button onClick={handleAddProperty} className="bg-brand-gray border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-black px-4 py-2 rounded transition-all text-sm flex items-center gap-2"><Plus size={16} /> Nova</button>
                                        <button onClick={handleSaveProperties} className="bg-brand-gold text-black px-4 py-2 rounded font-bold hover:bg-[#b08d2b] transition-all text-sm flex items-center gap-2"><Save size={16} /> Salvar</button>
                                    </div>
                                </div>
                                {properties.map((property, index) => (
                                    <div key={property.id} className="bg-brand-gray border border-white/5 p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-32 h-32 relative bg-black rounded shrink-0">
                                            {property.image && property.image.startsWith('http') ? (
                                                <Image src={property.image} alt={property.name} fill className="object-cover rounded opacity-70" unoptimized />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sem imagem</div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input type="text" value={property.name} onChange={(e) => handleEditProperty(index, "name", e.target.value)} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-brand-gold outline-none" placeholder="Nome" />
                                                <input type="text" value={property.location} onChange={(e) => handleEditProperty(index, "location", e.target.value)} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-brand-gold outline-none" placeholder="Localização" />
                                            </div>
                                            <input type="text" value={property.image} onChange={(e) => handleEditProperty(index, "image", e.target.value)} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-gray-400 text-xs font-mono focus:border-brand-gold outline-none" placeholder="Image URL" />
                                            <input type="text" value={property.link || ""} onChange={(e) => handleEditProperty(index, "link", e.target.value)} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-gray-400 text-xs font-mono focus:border-brand-gold outline-none" placeholder="Link do Empreendimento (URL)" />
                                            <textarea value={property.description || ""} onChange={(e) => handleEditProperty(index, "description", e.target.value)} rows={3} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-brand-gold outline-none" placeholder="Descrição (opcional)" />

                                            {/* Gallery Section */}
                                            <div className="pt-2 border-t border-white/5 space-y-4">
                                                {/* Header & Add Button */}
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs text-brand-gold uppercase font-bold tracking-wider">Galeria de Fotos</label>
                                                    <button onClick={() => handleAddGalleryImage(index)} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-300 flex items-center gap-1 transition-colors"><Plus size={12} /> Adicionar Campo</button>
                                                </div>

                                                {/* Bulk Add Section */}
                                                <div className="bg-black/20 p-3 rounded border border-white/5">
                                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Adicionar em Massa (Cole URLs, uma por linha)</label>
                                                    <div className="flex gap-2">
                                                        <textarea
                                                            value={bulkInputs[property.id] || ""}
                                                            onChange={(e) => handleBulkInputChange(property.id, e.target.value)}
                                                            className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-gray-300 text-xs font-mono focus:border-brand-gold outline-none resize-y min-h-[60px]"
                                                            placeholder="https://...\nhttps://..."
                                                        />
                                                        <button
                                                            onClick={() => handleBulkAddGalleryImages(index, property.id)}
                                                            className="bg-brand-gray border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-black px-3 rounded text-xs transition-colors font-bold uppercase tracking-wider"
                                                            disabled={!bulkInputs[property.id]}
                                                        >
                                                            Adicionar
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Existing Images List */}
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar bg-black/10 p-2 rounded">
                                                    {property.gallery && property.gallery.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="flex gap-2 items-center group">
                                                            <div className="text-[10px] text-gray-600 w-4 text-center">{imgIndex + 1}</div>
                                                            <div className="w-10 h-10 relative bg-black rounded shrink-0 border border-white/10 overflow-hidden group-hover:border-brand-gold/50 transition-colors">
                                                                {img && img.startsWith('http') && <Image src={img} alt="" fill className="object-cover" unoptimized />}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={img}
                                                                onChange={(e) => handleGalleryChange(index, imgIndex, e.target.value)}
                                                                className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-gray-400 text-xs font-mono focus:border-brand-gold outline-none transition-colors"
                                                                placeholder="URL da Imagem"
                                                            />
                                                            <button onClick={() => handleRemoveGalleryImage(index, imgIndex)} className="text-red-500/30 hover:text-red-400 p-2 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    {(!property.gallery || property.gallery.length === 0) && (
                                                        <p className="text-xs text-gray-600 italic text-center py-4">Nenhuma foto adicionada à galeria.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <button onClick={() => handleDeleteProperty(property.id)} className="text-red-500/70 hover:text-red-400 text-xs flex items-center gap-1"><Trash2 size={12} /> Excluir Empreendimento</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LEADS TAB */}
                        {activeTab === 'leads' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-heading text-white">Leads Recebidos</h2>
                                <p className="text-xs text-brand-gold bg-brand-gold/10 p-2 rounded border border-brand-gold/30 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Conectado ao Banco de Dados (Supabase) - Seus leads estão seguros!
                                </p>
                                <div className="space-y-4">
                                    {(!leads || leads.length === 0) ? (
                                        <p className="text-gray-500 italic p-4 text-center border border-white/5 rounded">Nenhum lead encontrado ainda.</p>
                                    ) : (
                                        leads.map((lead: any, index: number) => (
                                            <div key={index} className="bg-brand-gray border border-white/5 p-4 rounded-lg shadow-lg">
                                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2 border-b border-white/5 pb-2">
                                                    <div>
                                                        <h3 className="text-lg text-brand-gold font-bold">{lead.name}</h3>
                                                        <p className="text-xs text-gray-500">{new Date(lead.created_at || lead.date).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 uppercase tracking-wider">{lead.status || 'Novo'}</span>
                                                        <button
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="text-red-500/50 hover:text-red-500 p-1 transition-colors"
                                                            title="Excluir Lead"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                                    <div className="bg-black/20 p-2 rounded">
                                                        <p className="text-gray-500 text-[10px] uppercase font-bold text-brand-gold">Email</p>
                                                        <p className="text-gray-300 break-all">{lead.email}</p>
                                                    </div>
                                                    <div className="bg-black/20 p-2 rounded">
                                                        <p className="text-gray-500 text-[10px] uppercase font-bold text-brand-gold">Telefone</p>
                                                        <p className="text-gray-300">{lead.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-black/30 p-3 rounded border border-white/5">
                                                    <p className="text-gray-500 text-[10px] uppercase font-bold text-brand-gold mb-1">Mensagem</p>
                                                    <p className="text-gray-300 whitespace-pre-wrap text-sm">{lead.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CONTENT TABS */}
                        {activeTab !== 'properties' && content && content[activeTab] && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-heading text-white capitalize">
                                        {activeTab === 'hero' ? 'Início' :
                                            activeTab === 'personalBroker' ? 'Personal Broker' :
                                                activeTab === 'aboutMe' ? 'Sobre Mim' :
                                                    activeTab === 'contact' ? 'Contato' :
                                                        activeTab}
                                    </h2>
                                    <button onClick={handleSaveContent} className="bg-brand-gold text-black px-4 py-2 rounded font-bold hover:bg-[#b08d2b] transition-all text-sm flex items-center gap-2"><Save size={16} /> Salvar Conteúdo</button>
                                </div>

                                <div className="bg-brand-gray border border-white/5 p-6 rounded-lg space-y-5">
                                    {Object.keys(content[activeTab]).map((key) => {
                                        const labels: Record<string, string> = {
                                            title: "Título",
                                            subtitle: "Subtítulo",
                                            bgImage: "Imagem de Fundo (URL)",
                                            titlePrefix: "Prefixo do Título",
                                            titleHighlight: "Destaque do Título",
                                            titleSuffix: "Sufixo do Título",
                                            image: "Imagem (URL)",
                                            text1: "Parágrafo 1",
                                            text2: "Parágrafo 2",
                                            quote: "Citação",
                                            paragraph1: "Parágrafo 1",
                                            paragraph2: "Parágrafo 2",
                                            paragraph3: "Parágrafo 3",
                                            phone: "Telefone Fixo / Secundário (Opcional)",
                                            mobile: "Celular / WhatsApp (Principal)",
                                            email: "E-mail",
                                            whatsappOnly: "Número do WhatsApp (Prioritário)",
                                            // whatsapp: "Link Gerado Automaticamente (Não editar)", // Ocultando da edição direta para evitar erros
                                            instagram: "Instagram (Link)",
                                            facebook: "Facebook (Link)",
                                            youtube: "YouTube (Link)"
                                        };

                                        // Pular a exibição do campo 'whatsapp' original, pois ele será gerado automaticamente
                                        if (key === 'whatsapp') return null;

                                        return (
                                            <div key={key} className="space-y-2">
                                                <label className="text-xs uppercase tracking-wider text-brand-gold font-bold">
                                                    {labels[key] || key}
                                                </label>
                                                {key.includes('text') || key.includes('paragraph') || key.includes('quote') ? (
                                                    <textarea
                                                        value={content[activeTab][key]}
                                                        onChange={(e) => handleContentChange(activeTab, key, e.target.value)}
                                                        rows={4}
                                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-gold outline-none text-sm leading-relaxed"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={content[activeTab][key]}
                                                        onChange={(e) => handleContentChange(activeTab, key, e.target.value)}
                                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-gold outline-none text-sm"
                                                    />
                                                )}
                                                {key === 'whatsapp' && (
                                                    <p className="text-[10px] text-gray-500 italic mt-1">
                                                        O sistema extrairá automaticamente o número de telefone contido neste link para usar nos botões de "Agendar Visita" e "Fale Comigo".
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Save Button (Context Aware) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-gray/95 backdrop-blur-lg border-t border-white/10 p-4 z-50 flex justify-end shadow-2xl">
                <button
                    onClick={activeTab === 'properties' ? handleSaveProperties : handleSaveContent}
                    className="w-full bg-brand-gold text-black px-4 py-3 rounded font-bold text-sm uppercase tracking-wide shadow-lg flex justify-center items-center gap-2"
                >
                    <Save size={18} />
                    {activeTab === 'properties' ? 'Salvar Propriedades' : 'Salvar Conteúdo'}
                </button>
            </div>
        </div>
    );
}
