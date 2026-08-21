# Contributing

[English](CONTRIBUTING.md) | [中文](docs/CONTRIBUTING.zh.md)

Maintainer guide for the YukunR DSH plugins catalog source.

## How it works

The [DSH Desktop](https://github.com/anywhere-labs/deepseek-harness-desktop#dsh-desktop) market reads a **standard catalog source** over HTTPS:

- `GET /catalog-source.json` — the catalog-source manifest (`manifestVersion`, `providerId`, `transport.endpoint`, query contract). `transport.endpoint` is filled from the request origin, so one Worker works on any subdomain.
- `GET /v1/plugins` — the provider page listing every plugin entry.

Both responses must use `Content-Type: application/json`. The market's restricted HTTP client rejects anything else, which is why the endpoints must be served by a Worker: static hosts (e.g. `raw.githubusercontent.com`) return `text/plain` for the extensionless `/v1/plugins` path. The contract requires the endpoint path to end in `/v1/plugins`, be same-origin with the manifest, and be served over HTTPS on port 443. See the official [catalog configuration docs](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md).

## Layout

| Path | Purpose |
|---|---|
| `worker.js` | Cloudflare Worker serving both endpoints (the whole catalog) |
| `wrangler.jsonc` | Wrangler config (`name: yukunr-dsh-catalog`, `main: worker.js`) |
| `README.md` / `docs/README.zh.md` | User-facing overview (English / Chinese) |
| `CONTRIBUTING.md` / `docs/CONTRIBUTING.zh.md` | This maintainer guide (English / Chinese) |
| `LICENSE` | MIT license |

The URL endpoints are produced by `worker.js` route logic, not by files at those paths, so the repository layout is free-form — the only thing the market reads is the deployed Worker's responses.

## Add a plugin

Open `worker.js` and append one entry to the `ITEMS` array following the exact same shape as the existing entries (a commented example is already in the file). Fields required by the market contract:

| Field | Meaning |
|---|---|
| `id`, `name`, `displayName` | Stable plugin identifier (`dsh-<name>-plugin`) |
| `summary`, `description` | Short / full description — factual, neutral, bilingual where possible |
| `homepage`, `repository.url` | The plugin's GitHub URLs |
| `latestVersion` | Exact stable semver (e.g. `0.1.0`) — ranges and tags are rejected |
| `license`, `categories`, `keywords` | Metadata |
| `package` | npm registry + package name used by the managed install |
| `publisher` | The author |
| `updatedAt` | ISO-8601 timestamp |

## Publish a new version

Update that plugin's `latestVersion` to the new exact semver, bump the provider page `revision` to stay in sync, and redeploy. The managed install revalidates `<package>@<latestVersion>` against the npm registry before installing.

## Local verification

The Worker logic can be tested without a network or a Cloudflare account:

```powershell
node --input-type=module -e "import('./worker.js').then(async ({ default: w }) => { const o = 'https://x.test.workers.dev'; const m = await (await w.fetch(new Request(o + '/catalog-source.json'))).json(); const p = await (await w.fetch(new Request(o + '/v1/plugins'))).json(); console.log(m.manifestVersion, m.transport.endpoint, p.page.total, p.items.length); });"
```

Expected output: `1.0.0 https://x.test.workers.dev/v1/plugins 1 1`.

## Deploy

### Option A — Cloudflare dashboard (no CLI)

1. https://dash.cloudflare.com → Workers & Pages → Create → Create Worker.
2. Name it `yukunr-dsh-catalog`, click Deploy, then **Edit code**.
3. Paste the whole `worker.js`, click Deploy.
4. Source URL: `https://dsh-plugin.yukunr.top/catalog-source.json`

### Option B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

`wrangler.jsonc` already sets `name: yukunr-dsh-catalog`. Deploying requires a Cloudflare account; no credentials are stored in this repository.

## Maintenance rules

- **New plugin** → append one entry to `ITEMS`, redeploy.
- **New version** → update `latestVersion` (exact semver) and the page `revision`, redeploy.
- **Descriptions** → keep them objective, neutral, and bilingual.
- **Contract fields** → never rename or repurpose `manifestVersion`, `providerId`, `transport`, or entry field names — the market validates them.
- **Endpoint** → must end in `/v1/plugins`, be same-origin with the manifest, and be served over HTTPS on port 443.

## Pull requests

1. Run the local verification above and confirm the expected output.
2. Keep entry metadata factual and neutral; match the existing entry shape exactly.
