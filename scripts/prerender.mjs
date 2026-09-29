import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(repositoryRoot, 'dist');
const serverDirectory = path.join(repositoryRoot, '.wrangler', 'prerender-server');
const serverEntry = path.join(serverDirectory, 'entry-server.js');
const manifestPath = path.join(repositoryRoot, '.wrangler', 'seo-manifest.json');
const SEO_PLACEHOLDER = '<!--seo-head-->';
const APP_PLACEHOLDER = '<!--ssr-outlet-->';

function requireSinglePlaceholder(template, placeholder) {
  const count = template.split(placeholder).length - 1;
  if (count !== 1) {
    throw new Error(`Expected exactly one ${placeholder} placeholder, found ${count}.`);
  }
}

function outputFileForRoute(route) {
  if (route === '/') {
    return 'index.html';
  }

  if (!/^\/[a-z0-9./-]+$/i.test(route) || route.endsWith('/') || route.includes('..')) {
    throw new Error(`Unsafe prerender route: ${route}`);
  }

  return `${route.slice(1)}.html`;
}

function renderDocument(template, head, body) {
  return template.replace(SEO_PLACEHOLDER, head).replace(APP_PLACEHOLDER, body);
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderSitemap(pages) {
  const urls = pages
    .map((page) => `  <url>\n    <loc>${escapeXml(page.canonicalUrl)}</loc>\n  </url>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function writeRoute(outputFile, document) {
  const outputPath = path.join(distDirectory, outputFile);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, document, 'utf8');
}

async function main() {
  const template = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
  requireSinglePlaceholder(template, SEO_PLACEHOLDER);
  requireSinglePlaceholder(template, APP_PLACEHOLDER);

  const server = await import(pathToFileURL(serverEntry).href);
  const contract = server.prerenderContract();

  if (!Array.isArray(contract.pages) || contract.pages.length === 0) {
    throw new Error('Expected a nonempty list of canonical prerender routes.');
  }

  const seenRoutes = new Set();
  const seenOutputs = new Set();
  const manifestPages = [];

  for (const page of contract.pages) {
    if (!page.indexable || !page.canonicalUrl || page.robots !== 'index,follow') {
      throw new Error(`Canonical route ${page.path} has a non-indexable SEO contract.`);
    }
    if (seenRoutes.has(page.path)) {
      throw new Error(`Duplicate prerender route: ${page.path}`);
    }

    const outputFile = outputFileForRoute(page.path);
    if (seenOutputs.has(outputFile)) {
      throw new Error(`Duplicate prerender output: ${outputFile}`);
    }

    seenRoutes.add(page.path);
    seenOutputs.add(outputFile);

    const body = server.render(page.path);
    if (!body.includes('<h1')) {
      throw new Error(`Prerendered route ${page.path} does not contain an h1.`);
    }

    await writeRoute(
      outputFile,
      renderDocument(template, server.renderHead(page.path), body),
    );

    manifestPages.push({
      ...page,
      outputFile,
      structuredDataCount: page.structuredData.length,
    });
  }

  const notFoundPath = '/__not-found__';
  const notFoundBody = server.render(notFoundPath);
  if (!notFoundBody.includes('<h1')) {
    throw new Error('Prerendered 404 page does not contain an h1.');
  }

  await writeRoute(
    '404.html',
    renderDocument(template, server.renderHead(notFoundPath), notFoundBody),
  );
  await writeFile(
    path.join(distDirectory, 'sitemap.xml'),
    renderSitemap(contract.pages),
    'utf8',
  );

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        pages: manifestPages,
        notFound: {
          ...contract.notFound,
          outputFile: '404.html',
          structuredDataCount: contract.notFound.structuredData.length,
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

try {
  await main();
} finally {
  await rm(serverDirectory, { recursive: true, force: true });
}
