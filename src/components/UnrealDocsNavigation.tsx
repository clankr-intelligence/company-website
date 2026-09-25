import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const DOC_LINKS = [
  { to: '/docs/unrealengine/introduction', label: 'Introduction' },
  { to: '/docs/unrealengine/quickstart', label: 'Quick Start Guide' },
  { to: '/docs/unrealengine/setup', label: 'Setup' },
  { to: '/docs/unrealengine/configuration', label: 'Configuration' },
  { to: '/docs/unrealengine/authoring-guide', label: 'Authoring Guide' },
  { to: '/docs/unrealengine/changelog', label: 'Changelog' },
] as const;

const AUTHORING_SECTIONS = [
  { id: 'core-npc-setup', label: 'Core NPC Setup' },
  { id: 'actions-and-movement', label: 'Actions and Movement' },
  { id: 'spatial-authoring', label: 'Spatial Authoring' },
  { id: 'perception', label: 'Perception' },
  { id: 'item-knowledge', label: 'Item Knowledge and Object Understanding' },
  { id: 'open-conversation', label: 'Open Conversation' },
  { id: 'memory-and-persistence', label: 'Memory, Continuity, and Persistence' },
  { id: 'api-reference', label: 'API Reference' },
] as const;

export default function UnrealDocsNavigation() {
  const location = useLocation();
  const isAuthoringGuidePage = location.pathname === '/docs/unrealengine/authoring-guide';
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isAuthoringGuidePage) return;

      let currentSection = '';
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + viewportHeight;
      const isAtBottom = scrollPosition >= documentHeight - 50;

      if (isAtBottom) {
        currentSection = AUTHORING_SECTIONS[AUTHORING_SECTIONS.length - 1].id;
      } else {
        for (const section of AUTHORING_SECTIONS) {
          const element = document.getElementById(section.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= viewportHeight * 0.4) {
              currentSection = section.id;
            }
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    const initialScrollCheck = window.setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(initialScrollCheck);
    };
  }, [isAuthoringGuidePage]);

  const isCurrentDocLink = (to: string, isActive: boolean) =>
    isActive ||
    (to === '/docs/unrealengine/changelog' &&
      location.pathname.startsWith('/docs/unrealengine/changelog'));

  const currentPageLabel =
    DOC_LINKS.find(({ to }) =>
      to === '/docs/unrealengine/changelog'
        ? location.pathname.startsWith(to)
        : location.pathname === to
    )?.label ?? 'Documentation';

  const renderAuthoringSections = (mobile: boolean) => (
    <ul className={mobile ? 'mt-1 space-y-1 border-l border-white/10 pl-3' : 'mt-2 ml-4 space-y-2'}>
      {AUTHORING_SECTIONS.map((section) => (
        <li key={section.id}>
          <a
            href={'#' + section.id}
            onClick={mobile ? () => setMobileOpen(false) : undefined}
            className={
              mobile
                ? activeSection === section.id
                  ? 'block rounded-md bg-blue-500/10 px-3 py-2 text-sm text-blue-300'
                  : 'block rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-blue-300'
                : activeSection === section.id
                  ? 'block text-sm text-blue-400 transition-colors'
                  : 'block text-sm text-gray-300 transition-colors hover:text-blue-400'
            }
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  );

  const renderDocLinks = (mobile: boolean) => (
    <ul className={mobile ? 'space-y-1' : 'space-y-4'}>
      {DOC_LINKS.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            onClick={mobile ? () => setMobileOpen(false) : undefined}
            className={({ isActive }) => {
              const current = isCurrentDocLink(link.to, isActive);

              if (mobile) {
                return current
                  ? 'block rounded-lg bg-blue-500/10 px-3 py-2.5 text-sm text-blue-300'
                  : 'block rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-blue-300';
              }

              return current
                ? 'block text-sm text-blue-400 transition-colors'
                : 'block text-sm text-gray-300 transition-colors hover:text-blue-400';
            }}
          >
            {link.label}
          </NavLink>
          {link.to === '/docs/unrealengine/authoring-guide' &&
            isAuthoringGuidePage &&
            renderAuthoringSections(mobile)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="rnpc-docs-navigation h-14 md:contents">
      <nav
        aria-label="Unreal Engine documentation"
        className="fixed top-16 left-0 z-30 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-slate-800/50 backdrop-blur-sm md:block"
      >
        <div className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">RealisticNPCs for Unreal Engine</h2>
          {renderDocLinks(false)}
        </div>
      </nav>

      <div className="fixed inset-x-0 top-16 z-40 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm md:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-unreal-docs-menu"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-14 w-full items-center justify-between px-4 text-left"
        >
          <span>
            <span className="block text-xs font-medium uppercase tracking-wider text-gray-500">
              RealisticNPCs for Unreal Engine
            </span>
            <span className="block text-sm font-semibold text-white">{currentPageLabel}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={
              mobileOpen
                ? 'rotate-180 text-blue-300 transition-transform'
                : 'text-gray-400 transition-transform'
            }
          />
        </button>

        {mobileOpen && (
          <nav
            id="mobile-unreal-docs-menu"
            aria-label="Mobile Unreal Engine documentation"
            className="max-h-[calc(100vh-7.5rem)] overflow-y-auto border-t border-white/10 bg-slate-900 px-4 py-3 shadow-2xl"
          >
            {renderDocLinks(true)}
          </nav>
        )}
      </div>
    </div>
  );
}
