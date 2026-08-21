# DSH 插件目录

[English](../README.md) | [中文](README.zh.md)

**YukunR 所有 DeepSeek Harness (DSH) 插件的官方插件市场目录源**。它为 DSH Desktop 内置插件市场提供数据：只需添加这一个来源，下列所有插件就会出现在 **Discover（发现）** 和 **Installable（可安装）** 中。目前收录 **dsh-ezprot-plugin**（蛋白质组学）；未来会陆续加入代谢组学、磷酸化组学等。

## 已收录插件

| 插件 | 最新版本 | 说明 |
| --- | --- | --- |
| [dsh-ezprot-plugin](https://github.com/YukunR/dsh-ezprot-plugin) | `0.1.1` | 即插即用的蛋白质组学分析：自动管理 R 4.4 运行时，提供可追溯的归一化 / PCA / 批次校正 / 差异表达 / GO-KEGG 富集 / GSEA 流程。 |

## 这是什么

DSH Desktop 的插件市场读取一个**标准目录来源**：一个 `catalog-source.json` manifest 加一个 `/v1/plugins` 插件条目页，两者都以 `application/json` 返回。本仓库提供一个小的 Cloudflare Worker（`worker.js`）来提供这两个端点。

必须用 Worker 是因为市场的受限 HTTP 客户端只接受 `application/json` 响应，而静态托管（如 `raw.githubusercontent.com`）对无扩展名的 `/v1/plugins` 路径返回 `text/plain`，会被拒绝。

**背景。** Desktop 市场内置适配器指向的公共商店只按热度返回前几百条，且其全量扫描完整性校验要求 `meta.total === received`，目前无法可靠加载。标准目录来源完全由插件作者掌控，并使用相同的受管安装路径。

- `/catalog-source.json` — 目录源 manifest（`manifestVersion`、`providerId`、`transport.endpoint`、查询契约）。`transport.endpoint` 会根据请求 origin 动态填充，因此同一份文件适用于任意 Workers 子域。
- `/v1/plugins` — 列出所有插件条目的 provider 页面。

## 文件

- `worker.js` — 提供两个端点的 Cloudflare Worker。
- `wrangler.jsonc` — Wrangler 配置（`name: yukunr-dsh-catalog`），用于命令行部署。
- `README.md` / `docs/README.zh.md` — 本文档（英文 / 中文）。
- `LICENSE` — 目录仓库的 MIT 许可证。

## 添加新插件

打开 `worker.js`，在 `ITEMS` 数组中追加一条与现有条目**完全同构**的条目（文件中已预留注释示例供参考）。市场契约要求的字段如下：

| 字段 | 含义 |
| --- | --- |
| `id`、`name`、`displayName` | 稳定的插件标识符（使用 `dsh-<name>-plugin`）。 |
| `summary`、`description` | 简短 / 完整描述。保持客观、中立，并尽量双语。 |
| `homepage`、`repository.url` | 插件的 GitHub 地址。 |
| `latestVersion` | 精确稳定 semver（如 `0.1.0`）——范围与 tag 会被市场拒绝。 |
| `license`、`categories`、`keywords` | 元数据。 |
| `package` | 用于受管安装的 npm registry 与包名。 |
| `publisher` | 作者。 |
| `updatedAt` | ISO-8601 时间戳。 |

## 发布新版本

把该插件的 `latestVersion` 更新为新的精确 semver，同步更新 provider 页面的 `revision`，然后重新部署。受管安装会在安装前用 npm registry 重新校验 `<package>@<latestVersion>`。

## 部署

### 方式 A — Cloudflare 控制台（无需 CLI）

1. https://dash.cloudflare.com → Workers & Pages → Create → Create Worker。
2. 命名为 `yukunr-dsh-catalog`，点击 Deploy，然后 **Edit code**。
3. 粘贴整个 `worker.js`，点击 Deploy。
4. 你的来源 manifest URL 为：
   `https://yukunr-dsh-catalog.<your-subdomain>.workers.dev/catalog-source.json`

### 方式 B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

`wrangler.jsonc` 已设置 `name: yukunr-dsh-catalog`。部署需要 Cloudflare 账号；本仓库不存储任何凭据。

## 在 DSH Desktop 中使用

Settings → Plugins → Plugin market → Sources → 添加上面的 manifest URL。`worker.js` 中列出的所有插件随后会出现在 Discover 与 Installable 中。

## 维护规则

- **新增插件** → 在 `worker.js` 的 `ITEMS` 中追加一条同构条目，重新部署。
- **发布新版本** → 更新该条目的 `latestVersion`（精确 semver）与页面 `revision`，重新部署。
- **描述** → 所有文字保持客观、中立、双语。
- **契约字段** → 不要重命名或改用途 `manifestVersion`、`providerId`、`transport` 或条目字段名——Desktop 市场会校验它们。
- **端点** → 端点路径必须以 `/v1/plugins` 结尾、与 manifest 同源、并通过 443 端口的 HTTPS 提供。

## 许可证

MIT — 见 [LICENSE](../LICENSE)。
