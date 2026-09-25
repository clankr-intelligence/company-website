import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(repositoryRoot, 'dist');
const manifestPath = path.join(repositoryRoot, '.wrangler', 'seo-manifest.json');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function countOccurrences(value, needle) {
  return value.split(needle).length - 1;
}

async function listHtmlFiles(directory, relativeDirectory = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(absolutePath, relativePath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(relativePath);
    }
  }

  return files.sort();
}

async function requireAssetReferences(html, outputFile) {
  const references = [
    ...html.matchAll(/(?:href|src)="(\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g),
  ].map((match) => match[1]);

  for (const reference of new Set(references)) {
    const assetPath = path.join(distDirectory, reference.slice(1));
    try {
      await access(assetPath);
    } catch {
      throw new Error(`${outputFile} references missing asset ${reference}.`);
    }
  }
}

function validateStructuredData(html, expectedCount, outputFile) {
  const scripts = [
    ...html.matchAll(
      /<script data-rnpc-seo="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];

  assert(
    scripts.length === expectedCount,
    `${outputFile} has ${scripts.length} structured-data blocks; expected ${expectedCount}.`,
  );

  for (const [, source] of scripts) {
    const parsed = JSON.parse(source);
    assert(
      parsed['@context'] === 'https://schema.org',
      `${outputFile} contains structured data without the schema.org context.`,
    );
  }
}

function validateCommonHtml(html, page) {
  const label = page.outputFile;
  const expectedTitle = `<title>${escapeHtml(page.title)}</title>`;
  const expectedDescription = `name="description" content="${escapeHtml(page.description)}"`;
  const expectedRobots = `name="robots" content="${page.robots}"`;

  assert(countOccurrences(html, '<title>') === 1, `${label} must contain exactly one title.`);
  assert(html.includes(expectedTitle), `${label} has the wrong title.`);
  assert(countOccurrences(html, 'name="description"') === 1, `${label} must contain one description.`);
  assert(html.includes(expectedDescription), `${label} has the wrong description.`);
  assert(countOccurrences(html, 'name="robots"') === 1, `${label} must contain one robots directive.`);
  assert(html.includes(expectedRobots), `${label} has the wrong robots directive.`);
  assert(!html.includes('name="keywords"'), `${label} contains obsolete meta keywords.`);
  assert(!html.includes('name="title"'), `${label} contains redundant meta title metadata.`);
  assert(!html.includes('summary_large_image'), `${label} advertises a missing large social image.`);
  assert(!html.includes('og:image'), `${label} advertises an Open Graph image.`);
  assert(!html.includes('twitter:image'), `${label} advertises a Twitter image.`);
  assert(!html.includes('<!--seo-head-->'), `${label} retains the SEO placeholder.`);
  assert(!html.includes('<!--ssr-outlet-->'), `${label} retains the SSR placeholder.`);
  assert(!html.includes('.workers.dev'), `${label} contains a preview hostname.`);
  assert(!html.includes('staging.clankrintelligence.com'), `${label} contains a staging hostname.`);
  assert(/<div id="root">[\s\S]+<\/div>/.test(html), `${label} has an empty React root.`);
  assert(html.includes('<h1'), `${label} does not contain a rendered h1.`);

  validateStructuredData(html, page.structuredDataCount, label);
}

function validateIndexableMetadata(html, page) {
  const label = page.outputFile;
  const canonical = escapeHtml(page.canonicalUrl);
  const expectations = [
    ['rel="canonical"', `rel="canonical" href="${canonical}"`],
    ['property="og:type"', `property="og:type" content="${page.openGraphType}"`],
    ['property="og:site_name"', 'property="og:site_name" content="Clankr Intelligence"'],
    ['property="og:url"', `property="og:url" content="${canonical}"`],
    ['property="og:title"', `property="og:title" content="${escapeHtml(page.title)}"`],
    ['property="og:description"', `property="og:description" content="${escapeHtml(page.description)}"`],
    ['name="twitter:card"', 'name="twitter:card" content="summary"'],
    ['name="twitter:title"', `name="twitter:title" content="${escapeHtml(page.title)}"`],
    ['name="twitter:description"', `name="twitter:description" content="${escapeHtml(page.description)}"`],
  ];

  for (const [marker, expected] of expectations) {
    assert(countOccurrences(html, marker) === 1, `${label} must contain exactly one ${marker}.`);
    assert(html.includes(expected), `${label} has incorrect ${marker} metadata.`);
  }
}

async function validateHtmlPage(page) {
  const html = await readFile(path.join(distDirectory, page.outputFile), 'utf8');
  validateCommonHtml(html, page);

  if (page.indexable) {
    validateIndexableMetadata(html, page);
  } else {
    assert(!html.includes('rel="canonical"'), `${page.outputFile} must not declare a canonical URL.`);
    assert(!html.includes('property="og:'), `${page.outputFile} must not declare Open Graph metadata.`);
    assert(!html.includes('name="twitter:'), `${page.outputFile} must not declare Twitter metadata.`);
  }

  await requireAssetReferences(html, page.outputFile);
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert(Array.isArray(manifest.pages), 'SEO manifest does not contain a page list.');
  assert(manifest.pages.length > 0, 'SEO manifest does not contain any canonical pages.');

  const paths = manifest.pages.map((page) => page.path);
  const outputs = manifest.pages.map((page) => page.outputFile);
  assert(new Set(paths).size === paths.length, 'SEO manifest contains duplicate routes.');
  assert(new Set(outputs).size === outputs.length, 'SEO manifest contains duplicate output files.');

  const expectedHtmlFiles = [...outputs, manifest.notFound.outputFile].sort();
  const actualHtmlFiles = await listHtmlFiles(distDirectory);
  assert(
    JSON.stringify(actualHtmlFiles) === JSON.stringify(expectedHtmlFiles),
    `Generated HTML set mismatch. Expected ${expectedHtmlFiles.join(', ')}; found ${actualHtmlFiles.join(', ')}.`,
  );

  for (const page of manifest.pages) {
    await validateHtmlPage(page);
  }
  await validateHtmlPage(manifest.notFound);

  const sitemap = await readFile(path.join(distDirectory, 'sitemap.xml'), 'utf8');
  assert(
    sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
    'Sitemap is missing the standard sitemap namespace.',
  );
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedUrls = manifest.pages.map((page) => page.canonicalUrl);
  assert(
    JSON.stringify(sitemapUrls) === JSON.stringify(expectedUrls),
    'Sitemap URLs do not exactly match the canonical route inventory.',
  );

  const robots = await readFile(path.join(distDirectory, 'robots.txt'), 'utf8');
  assert(!/<html|<!doctype/i.test(robots), 'robots.txt contains HTML.');
  for (const userAgent of [
    'OAI-SearchBot',
    'ChatGPT-User',
    'Claude-SearchBot',
    'Claude-User',
    'GPTBot',
    'ClaudeBot',
  ]) {
    assert(robots.includes(`User-agent: ${userAgent}`), `robots.txt is missing ${userAgent}.`);
  }
  assert(
    countOccurrences(robots, 'Sitemap: https://clankrintelligence.com/sitemap.xml') === 1,
    'robots.txt must contain exactly one canonical sitemap declaration.',
  );

  const redirects = await readFile(path.join(distDirectory, '_redirects'), 'utf8');
  assert(
    redirects.includes('/docs/unrealengine /docs/unrealengine/introduction 308'),
    'The documentation index redirect is missing.',
  );
  assert(
    redirects.includes('/docs/unrealengine/ /docs/unrealengine/introduction 308'),
    'The trailing-slash documentation index redirect is missing.',
  );

  try {
    await access(path.join(repositoryRoot, '.wrangler', 'prerender-server'));
    throw new Error('Temporary prerender server output was not removed.');
  } catch (error) {
    if (error instanceof Error && error.message === 'Temporary prerender server output was not removed.') {
      throw error;
    }
  }
}

await main();
