# DSH plugins catalog

[English](README.md) | [中文](docs/README.zh.md)

The **official plugin-market catalog source for all YukunR DeepSeek Harness (DSH) plugins**. It powers the built-in plugin market in DSH Desktop: register this one source and every plugin below appears under **Discover** and **Installable**. Today it hosts **dsh-ezprot-plugin** (proteomics); metabolomics, phosphoproteomics, and other omics plugins will be added here over time.

## Included plugins

| Plugin | Latest version | Description |
| --- | --- | --- |
| [dsh-ezprot-plugin](https://github.com/YukunR/dsh-ezprot-plugin) | `0.1.1` | Plug-and-play proteomics analysis: auto-managed R 4.4 runtime and a traceable normalization / PCA / batch-correction / differential-expression / GO-KEGG enrichment / GSEA pipeline. |

## What this is

DSH Desktop's plugin market reads a **standard catalog source**: a `catalog-source.json` manifest plus a `/v1/plugins` provider page, both served as `application/json`. This repository ships a small Cloudflare Worker (`worker.js`) that serves those two endpoints.

A Worker is required because the market's restricted HTTP client only accepts `application/json` responses, while static hosts (e.g. `raw.githubusercontent.com`) return `text/plain` for the extensionless `/v1/plugins` path and would be rejected.

**Background.** The Desktop market's built-in adapter points at a public store that only serves the top few hundred entries by popularity, and its full-scan integrity check requires `meta.total === received`, so that source cannot load reliably today. A standard catalog source is fully under the plugin author's control and uses the same managed-install path.

- `/catalog-source.json` — the catalog-source manifest (`manifestVersion`, `providerId`, `transport.endpoint`, query contract). `transport.endpoint` is filled from the request origin, so the same file works on any Workers subdomain.
- `/v1/plugins` — the provider page listing every plugin entry.

## Files

- `worker.js` — the Cloudflare Worker serving both endpoints.
- `wrangler.jsonc` — Wrangler configuration (`name: yukunr-dsh-catalog`) for CLI deploys.
- `README.md` / `docs/README.zh.md` — this documentation (English / Chinese).
- `LICENSE` — MIT license for the catalog repository.

## Add a new plugin

Open `worker.js` and append one entry to the `ITEMS` array following the exact same shape as the existing entries. A commented example entry is already in the file for reference. The fields required by the market contract are:

| Field | Meaning |
| --- | --- |
| `id`, `name`, `displayName` | Stable plugin identifier (use `dsh-<name>-plugin`). |
| `summary`, `description` | Short / full description. Keep them factual, neutral, and bilingual where possible. |
| `homepage`, `repository.url` | The plugin's GitHub URLs. |
| `latestVersion` | Exact stable semver (e.g. `0.1.0`) — ranges and tags are rejected by the market. |
| `license`, `categories`, `keywords` | Metadata. |
| `package` | npm registry + package name used for the managed install. |
| `publisher` | The author. |
| `updatedAt` | ISO-8601 timestamp. |

## Publish a new version

Update that plugin's `latestVersion` to the new exact semver, bump the provider page `revision` to stay in sync, and redeploy. The managed install revalidates `<package>@<latestVersion>` against the npm registry before installing.

## Deploy

### Option A — Cloudflare dashboard (no CLI required)

1. https://dash.cloudflare.com → Workers & Pages → Create → Create Worker.
2. Name it `yukunr-dsh-catalog`, click Deploy, then **Edit code**.
3. Paste the whole `worker.js`, click Deploy.
4. Your source manifest URL is:
   `https://yukunr-dsh-catalog.<your-subdomain>.workers.dev/catalog-source.json`

### Option B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

`wrangler.jsonc` already sets `name: yukunr-dsh-catalog`. Deploying requires a Cloudflare account; no credentials are stored in this repository.

## Use in DSH Desktop

Settings → Plugins → Plugin market → Sources → add the manifest URL above. Every plugin listed in `worker.js` then appears under Discover and Installable.

## Maintenance rules

- **New plugin** → append one entry to `ITEMS` in `worker.js` (same shape), redeploy.
- **New version** → update the entry's `latestVersion` (exact semver) and the page `revision`, redeploy.
- **Descriptions** → keep all text objective, neutral, and bilingual.
- **Contract fields** → do not rename or repurpose `manifestVersion`, `providerId`, `transport`, or the entry field names — the Desktop market validates them.
- **Endpoint** → the endpoint path must end in `/v1/plugins`, be same-origin with the manifest, and be served over HTTPS on port 443.

## License

MIT — see [LICENSE](LICENSE).
