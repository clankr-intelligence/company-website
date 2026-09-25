import { LOCAL_RELEASE_LICENSE, localRelease } from '../data/localRelease';
import { releases } from '../pages/docs/unrealengine/changelog/releases';

export const SITE_ORIGIN = 'https://clankrintelligence.com';
export const SITE_NAME = 'Clankr Intelligence';

export interface SeoPageDefinition {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
  canonicalPath?: string;
  openGraphType: 'website';
}

export interface ResolvedSeoPage extends SeoPageDefinition {
  canonicalUrl?: string;
  robots: 'index,follow' | 'noindex,follow';
  structuredData: Record<string, unknown>[];
}

const STATIC_PAGES: readonly SeoPageDefinition[] = [
  {
    path: '/',
    title: 'RealisticNPCs - Humanlike AI NPC Behavior for Unreal Engine',
    description:
      'RealisticNPCs is an AI behavior and cognition system for humanlike game NPCs, with memory, perception, planning, conversation, and actions.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/download',
    title: 'Download RealisticNPCs Local 0.4.0 for Unreal Engine',
    description:
      'Download RealisticNPCs Local 0.4.0 for Unreal Engine and run its managed AI NPC backend on 64-bit Windows 10 or Windows 11.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/introduction',
    title: 'RealisticNPCs for Unreal Engine Documentation',
    description:
      'Learn how RealisticNPCs brings humanlike NPC cognition and behavior to Unreal Engine through memory, perception, planning, conversation, and actions.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/quickstart',
    title: 'RealisticNPCs Quick Start for Unreal Engine',
    description:
      'Set up a RealisticNPCs character and gameplay action in Unreal Engine, then try object perception, starting item knowledge, and conversation.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/setup',
    title: 'Install RealisticNPCs for Unreal Engine',
    description:
      'Install the RealisticNPCs plugin and bundled local daemon in an Unreal Engine C++ project on 64-bit Windows.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/configuration',
    title: 'Configure RealisticNPCs for Unreal Engine',
    description:
      'Configure RealisticNPCs model services, endpoint-bound credentials, world context, calendars, continuity, and project profiles in Unreal Engine.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/authoring-guide',
    title: 'RealisticNPCs NPC Authoring Guide',
    description:
      'Author RealisticNPCs characters, typed actions, places, perceivable objects, item knowledge, open conversations, and persistent memory in Unreal Engine.',
    indexable: true,
    openGraphType: 'website',
  },
  {
    path: '/docs/unrealengine/changelog',
    title: 'RealisticNPCs Changelog',
    description:
      'Review RealisticNPCs release history and changes to NPC cognition, Unreal Engine integration, authoring workflows, and persistence.',
    indexable: true,
    openGraphType: 'website',
  },
];

const CHANGELOG_PAGES: readonly SeoPageDefinition[] = releases.map((release) => ({
  path: `/docs/unrealengine/changelog/${release.version}`,
  title: `RealisticNPCs ${release.version} Changelog`,
  description: `RealisticNPCs ${release.version}: ${release.summary.replace(/[.]+$/, '')}.`,
  indexable: true,
  openGraphType: 'website' as const,
}));

const INDEXABLE_PAGES: readonly SeoPageDefinition[] = [
  ...STATIC_PAGES,
  ...CHANGELOG_PAGES,
];

const NOT_FOUND_PAGE: SeoPageDefinition = {
  path: '/404',
  title: 'Page Not Found | Clankr Intelligence',
  description: 'The requested page could not be found.',
  indexable: false,
  openGraphType: 'website',
};

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).toString();
}

function organizationStructuredData(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'Clankr Intelligence Inc.',
    alternateName: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/logo_on_black_background.png`,
  };
}

function structuredDataForPath(pathname: string): Record<string, unknown>[] {
  if (pathname === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@graph': [
          organizationStructuredData(),
          {
            '@type': 'WebSite',
            '@id': `${SITE_ORIGIN}/#website`,
            name: SITE_NAME,
            url: `${SITE_ORIGIN}/`,
            publisher: {
              '@id': `${SITE_ORIGIN}/#organization`,
            },
          },
        ],
      },
    ];
  }

  if (pathname === '/download') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `${localRelease.productName} ${localRelease.editionName}`,
        softwareVersion: localRelease.version,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: '64-bit Windows 10 or Windows 11',
        softwareRequirements:
          'An Unreal Engine C++ project and the matching C++ toolchain.',
        url: `${SITE_ORIGIN}/download`,
        license: absoluteUrl(LOCAL_RELEASE_LICENSE.url),
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: organizationStructuredData(),
      },
    ];
  }

  return [];
}

function resolveDefinition(definition: SeoPageDefinition): ResolvedSeoPage {
  const canonicalPath = definition.canonicalPath ?? definition.path;
  const canonicalUrl = definition.indexable ? absoluteUrl(canonicalPath) : undefined;

  return {
    ...definition,
    canonicalUrl,
    robots: definition.indexable ? 'index,follow' : 'noindex,follow',
    structuredData: structuredDataForPath(definition.path),
  };
}

export function getIndexableSeoPages(): ResolvedSeoPage[] {
  const paths = new Set<string>();

  return INDEXABLE_PAGES.map((definition) => {
    if (paths.has(definition.path)) {
      throw new Error(`Duplicate canonical SEO route: ${definition.path}`);
    }

    paths.add(definition.path);
    return resolveDefinition(definition);
  });
}

export function getNotFoundSeoPage(): ResolvedSeoPage {
  return resolveDefinition(NOT_FOUND_PAGE);
}

export function getSeoPage(pathname: string): ResolvedSeoPage {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === '/docs/unrealengine') {
    return resolveDefinition({
      ...STATIC_PAGES.find(
        (page) => page.path === '/docs/unrealengine/introduction',
      )!,
      path: normalizedPathname,
      indexable: false,
      canonicalPath: '/docs/unrealengine/introduction',
    });
  }

  const page = INDEXABLE_PAGES.find(
    (candidate) => candidate.path === normalizedPathname,
  );

  return page ? resolveDefinition(page) : getNotFoundSeoPage();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serializeStructuredData(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function renderSeoHead(page: ResolvedSeoPage): string {
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta data-rnpc-seo="metadata" name="description" content="${escapeHtml(page.description)}">`,
    `<meta data-rnpc-seo="metadata" name="robots" content="${page.robots}">`,
  ];

  if (page.canonicalUrl) {
    tags.push(
      `<link data-rnpc-seo="metadata" rel="canonical" href="${escapeHtml(page.canonicalUrl)}">`,
      `<meta data-rnpc-seo="metadata" property="og:type" content="${page.openGraphType}">`,
      `<meta data-rnpc-seo="metadata" property="og:site_name" content="${SITE_NAME}">`,
      `<meta data-rnpc-seo="metadata" property="og:url" content="${escapeHtml(page.canonicalUrl)}">`,
      `<meta data-rnpc-seo="metadata" property="og:title" content="${escapeHtml(page.title)}">`,
      `<meta data-rnpc-seo="metadata" property="og:description" content="${escapeHtml(page.description)}">`,
      '<meta data-rnpc-seo="metadata" name="twitter:card" content="summary">',
      `<meta data-rnpc-seo="metadata" name="twitter:title" content="${escapeHtml(page.title)}">`,
      `<meta data-rnpc-seo="metadata" name="twitter:description" content="${escapeHtml(page.description)}">`,
    );
  }

  for (const structuredData of page.structuredData) {
    tags.push(
      `<script data-rnpc-seo="structured-data" type="application/ld+json">${serializeStructuredData(structuredData)}</script>`,
    );
  }

  return tags.join('\n    ');
}
