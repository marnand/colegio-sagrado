import { useState, useEffect, useId } from 'react';
import { Menu, X } from 'lucide-react';

type HeaderVariant = 'home' | 'standalone';

type HeaderProps = {
  variant?: HeaderVariant;
};

const homeNavLinks: { id: string; label: string }[] = [
  { id: 'sobre-nos', label: 'SOBRE NÓS' },
  { id: 'infraestrutura', label: 'INFRAESTRUTURA' },
  { id: 'academico', label: 'ACADÊMICO' },
  { id: 'admissoes', label: 'ADMISSÕES' },
  { id: 'contato', label: 'CONTATO' },
];

export default function Header({ variant = 'home' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = variant === 'home';
  const isTransparent = isHome && !scrolled;
  const linkClass = `text-sm font-semibold transition-colors tracking-wide cursor-pointer ${
    scrolled || !isHome
      ? 'text-gray-800 hover:text-primary'
      : 'text-white hover:text-secondary'
  }`;
  const ctaClass = `px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all transform hover:-translate-y-0.5 cursor-pointer ${
    isHome && scrolled
      ? 'bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/30'
      : 'bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/30'
  }`;
  const mobileToggleClass = `p-2 cursor-pointer transition-colors ${
    isHome && !scrolled
      ? 'text-white hover:text-secondary'
      : 'text-gray-800 hover:text-primary'
  }`;
  const headerShellClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isTransparent
      ? 'bg-transparent py-3'
      : 'bg-white/95 backdrop-blur-sm shadow-md py-2'
  }`;
  const logoClass = `h-12 md:h-16 object-contain transition-all duration-300 ${
    isTransparent ? 'brightness-0 invert' : ''
  }`;

  return (
    <header className={headerShellClass}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
        {isHome ? (
          <div
            className='shrink-0 cursor-pointer'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src='/logo.png'
              alt='Colégio Sagrado Logo'
              width='160'
              height='64'
              className={logoClass}
            />
          </div>
        ) : (
          <a href='/' className='shrink-0 cursor-pointer' aria-label='Voltar para a página inicial do Colégio Sagrado'>
            <img
              src='/logo.png'
              alt='Colégio Sagrado Logo'
              width='160'
              height='64'
              className={logoClass}
            />
          </a>
        )}

        {isHome && (
          <>
            {/* Desktop Nav (home) */}
            <nav className='hidden lg:flex items-center space-x-8' aria-label='Navegação principal'>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={linkClass}
              >
                INÍCIO
              </button>
              {homeNavLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={linkClass}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className='hidden lg:flex items-center space-x-6'>
              <button onClick={() => scrollToSection('contato')} className={ctaClass}>
                AGENDE UMA VISITA
              </button>
            </div>

            {/* Mobile Menu Button (home) */}
            <div className='lg:hidden'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={mobileToggleClass}
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls={menuId}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </>
        )}

        {!isHome && (
          <div className='flex items-center space-x-3'>
            <a
              href='/#contato'
              className='hidden lg:inline-block text-sm font-semibold text-gray-800 hover:text-primary transition-colors tracking-wide'
            >
              FALAR COM A ESCOLA
            </a>
            <a
              href='#formulario'
              className='inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-full shadow-md shadow-primary/30 text-sm tracking-wide transition-all cursor-pointer'
            >
              INSCREVER-SE
            </a>
          </div>
        )}
      </div>

      {isHome && isMobileMenuOpen && (
        <div
          id={menuId}
          className='lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-xl border-t border-gray-100 flex flex-col py-4 px-6 space-y-4'
        >
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
            className='text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer'
          >
            INÍCIO
          </button>
          {homeNavLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className='text-left py-2 font-semibold text-gray-800 hover:text-primary cursor-pointer'
            >
              {item.label}
            </button>
          ))}
          <div className='pt-4 flex flex-col space-y-4 border-t border-gray-100'>
            <button
              onClick={() => scrollToSection('contato')}
              className='bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold text-sm tracking-wide transition-all cursor-pointer text-center'
            >
              AGENDE UMA VISITA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
