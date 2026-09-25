import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoWhite from '../assets/clankr-logo-white.png';

const DOC_SHORTCUTS = [
  { to: '/docs/unrealengine/quickstart', label: 'Quick Start' },
  { to: '/docs/unrealengine/authoring-guide', label: 'Authoring Guide' },
  { to: '/docs/unrealengine/changelog', label: 'Changelog' },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const docsToggleRef = useRef<HTMLButtonElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDocsOpen(false);
  }, [location]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeMenus = () => {
      setIsOpen(false);
      setDocsOpen(false);
    };
    desktop.addEventListener('change', closeMenus);
    return () => desktop.removeEventListener('change', closeMenus);
  }, []);

  useEffect(() => {
    if (!docsOpen && !isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!docsRef.current?.contains(event.target)) setDocsOpen(false);
      if (!navRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (docsOpen && docsRef.current?.contains(document.activeElement)) {
        docsToggleRef.current?.focus();
        event.preventDefault();
      } else if (isOpen && navRef.current?.contains(document.activeElement)) {
        mobileToggleRef.current?.focus();
        event.preventDefault();
      }
      setDocsOpen(false);
      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [docsOpen, isOpen]);

  const closeMenus = () => {
    setIsOpen(false);
    setDocsOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenus();
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      className="fixed w-full z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(7, 13, 26, 0.92)'
          : 'rgba(7, 13, 26, 0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={closeMenus} className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}
            >
              <img src={logoWhite} alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white font-semibold text-base tracking-tight">
              Clankr Intelligence
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Docs dropdown */}
            <div
              ref={docsRef}
              className="relative"
              onPointerEnter={event => {
                if (event.pointerType === 'mouse') setDocsOpen(true);
              }}
              onPointerLeave={() => {
                if (!docsRef.current?.contains(document.activeElement)) setDocsOpen(false);
              }}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) setDocsOpen(false);
              }}
            >
              <div className="flex items-center">
                <Link
                  to="/docs/unrealengine/introduction"
                  onClick={closeMenus}
                  className="pl-3 pr-1 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  Docs
                </Link>
                <button
                  ref={docsToggleRef}
                  type="button"
                  aria-label="Toggle documentation shortcuts"
                  aria-expanded={docsOpen}
                  aria-controls="desktop-docs-shortcuts"
                  onClick={() => setDocsOpen(open => !open)}
                  className="px-2 py-2.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  <ChevronDown
                    aria-hidden="true"
                    size={14}
                    className={`transition-transform ${docsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              {/* Padding keeps the hover region continuous across the visual gap. */}
              <div id="desktop-docs-shortcuts" hidden={!docsOpen} className="absolute top-full left-0 pt-2 w-52">
                <ul
                  className="rounded-xl py-1"
                  style={{ background: '#0d1525', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                >
                  {DOC_SHORTCUTS.map(link => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400"
                        onClick={closeMenus}
                      >
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('demo')}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              Contact
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/download"
              onClick={closeMenus}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
              style={{
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.15)';
              }}
            >
              Download
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            ref={mobileToggleRef}
            type="button"
            aria-label="Toggle main navigation"
            aria-expanded={isOpen}
            aria-controls="mobile-main-navigation"
            onClick={() => setIsOpen(open => !open)}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-main-navigation"
        hidden={!isOpen}
        className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-4 py-3 space-y-1" style={{ background: 'rgba(7,13,26,0.98)' }}>
          <Link
            to="/docs/unrealengine/introduction"
            className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            onClick={closeMenus}
          >
            Docs
          </Link>
          <ul className="ml-3 border-l border-white/10 pl-3 space-y-1">
            {DOC_SHORTCUTS.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={closeMenus}
                  className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollToSection('demo')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Contact
          </button>
          <div className="pt-2 pb-1">
            <Link
              to="/download"
              className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)' }}
              onClick={closeMenus}
            >
              Download
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
