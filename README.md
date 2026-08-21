# DSH plugins catalog

[English](README.md) | [中文](docs/README.zh.md)

The **official plugin-market catalog source for all YukunR DeepSeek Harness (DSH) plugins**. Add this one source in DSH Desktop and every plugin below appears under **Discover** and **Installable** — no per-plugin sources to configure.

## Included plugins

| Plugin | Latest version | Description |
| --- | --- | --- |
| [dsh-ezprot-plugin](https://github.com/YukunR/dsh-ezprot-plugin) | `0.1.1` | Plug-and-play proteomics analysis: auto-managed R 4.4 runtime and a traceable normalization / PCA / batch-correction / differential-expression / GO-KEGG enrichment / GSEA pipeline. |

Metabolomics, phosphoproteomics, and other omics plugins will be added here over time.

## Add this source to DSH Desktop

1. Copy the catalog source URL for this repo:
   `https://yukunr-dsh-catalog.<your-subdomain>.workers.dev/catalog-source.json`
2. In DSH Desktop: **Settings → Plugins → Plugin market → Sources** → add that URL.
3. Every plugin listed above then appears under **Discover** and **Installable**.

## License

MIT — see [LICENSE](LICENSE).

## Contributing

To add a plugin, publish a new version, or deploy the catalog source, see [CONTRIBUTING.md](CONTRIBUTING.md) ([中文](docs/CONTRIBUTING.zh.md)).
