export default function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-gray-900">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-2xl font-heading text-white tracking-[0.2em] mb-4">
                    <span className="font-bold">ESTEVÃO</span>{" "}
                    <span className="font-light">VENANCIO</span>
                </h2>
                <p className="text-gray-500 text-sm mb-8 font-body">CRECI: 320010 | Todos os direitos reservados &copy; {new Date().getFullYear()}</p>

                <div className="flex justify-center gap-8">
                    <a href="#" className="text-gray-600 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors">Política de Privacidade</a>
                    <a href="#" className="text-gray-600 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors">Termos de Uso</a>
                </div>
            </div>
        </footer>
    );
}
