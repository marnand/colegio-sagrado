import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/95 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div
          className="shrink-0 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src="/logo.png" alt="Colégio Sagrado Logo" width="160" height="64" className="h-12 md:h-16 object-contain" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide cursor-pointer"
          >
            INÍCIO
          </button>
          <button
            onClick={() => scrollToSection("sobre-nos")}
            className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide cursor-pointer"
          >
            SOBRE NÓS
          </button>
          <button
            onClick={() => scrollToSection("academico")}
            className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide cursor-pointer"
          >
            ACADÊMICO
          </button>
          <button
            onClick={() => scrollToSection("admissoes")}
            className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide cursor-pointer"
          >
            ADMISSÕES
          </button>
          <button
            onClick={() => scrollToSection("contato")}
            className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide cursor-pointer"
          >
            CONTATO
          </button>
        </nav>

        <div className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => scrollToSection("contato")}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded font-semibold text-sm tracking-wide transition-all transform hover:-translate-y-0.5 shadow-md shadow-primary/30 cursor-pointer"
          >
            AGENDE UMA VISITA
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800 hover:text-primary p-2 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 flex flex-col py-4 px-6 space-y-4">
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); }}
            className="text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer"
          >
            INÍCIO
          </button>
          <button onClick={() => scrollToSection("sobre-nos")} className="text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer">SOBRE NÓS</button>
          <button onClick={() => scrollToSection("academico")} className="text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer">ACADÊMICO</button>
          <button onClick={() => scrollToSection("admissoes")} className="text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer">ADMISSÕES</button>
          <button onClick={() => scrollToSection("contato")} className="text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer">CONTATO</button>
          <div className="pt-4 flex flex-col space-y-4 border-t border-gray-100">
            <button
              onClick={() => scrollToSection("contato")}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded font-semibold text-sm tracking-wide transition-all cursor-pointer text-center"
            >
              AGENDE UMA VISITA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
