// Unified catalog source for all YukunR DSH plugins.
// Serves two endpoints for the DSH Community Market standard-source contract:
//   GET /catalog-source.json  -> catalog-source manifest (endpoint filled dynamically)
//   GET /v1/plugins           -> catalog-provider-page with every plugin entry
// Both answers use Content-Type: application/json, which the Desktop market's
// restricted HTTP client requires (static hosts that guess by extension do not).
//
// Deploy (Cloudflare Workers, free tier):
//   1. https://dash.cloudflare.com -> Workers & Pages -> Create -> Create Worker
//   2. Name it (e.g. yukunr-dsh-catalog), click Deploy, then "Edit code"
//   3. Paste this whole file, click Deploy
//   4. Your source URL is:
//        https://yukunr-dsh-catalog.845351766.workers.dev/catalog-source.json
//   5. In DSH Desktop: Settings -> Plugins -> Plugin market -> Sources ->
//      add a source with that manifest URL. All plugins below appear there.
//
// Publishing a new plugin or version:
//   - New plugin: append one entry to ITEMS following the same shape.
//   - New version: bump that entry's latestVersion and the page revision;
//     the version must be an exact stable semver (ranges and tags are rejected).
const MANIFEST = {
  manifestVersion: '1.0.0',
  providerId: 'io.github.yukunr.dsh-plugins',
  name: 'YukunR DSH plugins catalog',
  description: 'Official catalog source for YukunR DeepSeek Harness plugins.',
  homepage: 'https://github.com/YukunR/dsh-plugins-catalog',
  attribution: {
    name: 'YukunR DSH plugins',
    url: 'https://github.com/YukunR/dsh-plugins-catalog',
    notice: 'Catalog metadata is provided by the plugin author.',
  },
  query: {
    supported: ['q', 'category', 'cursor', 'limit'],
    defaultLimit: 50,
    maxLimit: 50,
    sorts: [],
  },
}

// One entry per plugin. Keep summaries factual and neutral, both languages.
const ITEMS = [
  {
    id: 'dsh-ezprot-plugin',
    name: 'dsh-ezprot-plugin',
    displayName: 'dsh-ezprot-plugin',
    summary:
      'Plug-and-play proteomics analysis: auto-managed R 4.4 runtime and a traceable normalization / PCA / batch-correction / differential-expression / GO-KEGG enrichment / GSEA pipeline.',
    description:
      'Give the agent a protein-expression matrix and this bundle runs the full analysis conversationally, one traceable step at a time, ending with an interpretation report. It silently installs and manages its own R 4.4.0 runtime and package library, builds per-organism GO/KEGG annotation backgrounds once and caches them, and supports an optional Docker backend.',
    homepage: 'https://github.com/YukunR/dsh-ezprot-plugin',
    latestVersion: '0.1.1',
    license: 'MIT',
    categories: ['tools'],
    keywords: ['proteomics', 'R', 'workflow', 'pipeline'],
    repository: { url: 'https://github.com/YukunR/dsh-ezprot-plugin' },
    package: { registry: 'npm', name: 'dsh-ezprot-plugin' },
    publisher: { name: 'YukunR', url: 'https://github.com/YukunR' },
    updatedAt: '2026-08-17T16:12:51.000Z',
  },
  // Add future plugins here (metabolomics, phosphoproteomics, ...):
  // {
  //   id: 'dsh-<name>-plugin',
  //   name: 'dsh-<name>-plugin',
  //   displayName: 'dsh-<name>-plugin',
  //   summary: '...',
  //   description: '...',
  //   homepage: 'https://github.com/YukunR/<repo>',
  //   latestVersion: '0.1.0',
  //   license: 'MIT',
  //   categories: ['tools'],
  //   keywords: ['...'],
  //   repository: { url: 'https://github.com/YukunR/<repo>' },
  //   package: { registry: 'npm', name: 'dsh-<name>-plugin' },
  //   publisher: { name: 'YukunR', url: 'https://github.com/YukunR' },
  //   updatedAt: '...',
  // },
]

const PROVIDER_PAGE = {
  schemaVersion: '1.0.0',
  generatedAt: '2026-08-21T12:00:00.000Z',
  revision: '0.1.1',
  items: ITEMS,
  page: { total: ITEMS.length },
}

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const json = (value, status = 200) =>
      new Response(JSON.stringify(value), {
        status,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    if (url.pathname === '/catalog-source.json') {
      return json({
        ...MANIFEST,
        transport: {
          kind: 'https-json',
          endpoint: `${url.origin}/v1/plugins`,
          method: 'GET',
        },
      })
    }
    if (url.pathname === '/v1/plugins') {
      return json(PROVIDER_PAGE)
    }
    return new Response('not found', { status: 404 })
  },
}
