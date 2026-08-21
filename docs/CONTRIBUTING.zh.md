# 参与维护

[English](../CONTRIBUTING.md) | [中文](CONTRIBUTING.zh.md)

YukunR DSH 插件目录源的维护者指南。

## 工作原理

DSH Desktop 市场通过 HTTPS 读取一个**标准目录来源**：

- `GET /catalog-source.json` — 目录源 manifest（`manifestVersion`、`providerId`、`transport.endpoint`、查询契约）。`transport.endpoint` 根据请求 origin 动态填充，因此同一 Worker 适用于任意子域。
- `GET /v1/plugins` — 列出所有插件条目的 provider 页面。

两个响应都必须使用 `Content-Type: application/json`。市场的受限 HTTP 客户端会拒绝其它类型，所以端点必须由 Worker 提供：静态托管（如 `raw.githubusercontent.com`）对无扩展名的 `/v1/plugins` 路径返回 `text/plain`。契约要求端点路径以 `/v1/plugins` 结尾、与 manifest 同源、并通过 443 端口的 HTTPS 提供。参见官方[目录配置文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md)。

## 目录结构

| 路径 | 用途 |
|---|---|
| `worker.js` | 提供两个端点的 Cloudflare Worker（即整个目录） |
| `wrangler.jsonc` | Wrangler 配置（`name: yukunr-dsh-catalog`、`main: worker.js`） |
| `README.md` / `docs/README.zh.md` | 面向用户的概览（英文 / 中文） |
| `CONTRIBUTING.md` / `docs/CONTRIBUTING.zh.md` | 本维护者指南（英文 / 中文） |
| `LICENSE` | MIT 许可证 |

URL 端点由 `worker.js` 的路由逻辑生成，而非对应路径下的文件，因此仓库布局不受约束——市场只读取已部署 Worker 的响应。

## 添加插件

打开 `worker.js`，在 `ITEMS` 数组中追加一条与现有条目**完全同构**的条目（文件中已预留注释示例）。市场契约要求的字段：

| 字段 | 含义 |
|---|---|
| `id`、`name`、`displayName` | 稳定的插件标识符（`dsh-<name>-plugin`） |
| `summary`、`description` | 简短 / 完整描述——客观、中立，尽量双语 |
| `homepage`、`repository.url` | 插件的 GitHub 地址 |
| `latestVersion` | 精确稳定 semver（如 `0.1.0`）——范围与 tag 会被拒绝 |
| `license`、`categories`、`keywords` | 元数据 |
| `package` | 受管安装使用的 npm registry 与包名 |
| `publisher` | 作者 |
| `updatedAt` | ISO-8601 时间戳 |

## 发布新版本

把该插件的 `latestVersion` 更新为新的精确 semver，同步更新 provider 页面的 `revision`，然后重新部署。受管安装会在安装前用 npm registry 重新校验 `<package>@<latestVersion>`。

## 本地验证

无需网络或 Cloudflare 账号即可测试 Worker 逻辑：

```powershell
node --input-type=module -e "import('./worker.js').then(async ({ default: w }) => { const o = 'https://x.test.workers.dev'; const m = await (await w.fetch(new Request(o + '/catalog-source.json'))).json(); const p = await (await w.fetch(new Request(o + '/v1/plugins'))).json(); console.log(m.manifestVersion, m.transport.endpoint, p.page.total, p.items.length); });"
```

预期输出：`1.0.0 https://x.test.workers.dev/v1/plugins 1 1`。

## 部署

### 方式 A — Cloudflare 控制台（无需 CLI）

1. https://dash.cloudflare.com → Workers & Pages → Create → Create Worker。
2. 命名为 `yukunr-dsh-catalog`，点击 Deploy，然后 **Edit code**。
3. 粘贴整个 `worker.js`，点击 Deploy。
4. 来源 URL：`https://yukunr-dsh-catalog.<your-subdomain>.workers.dev/catalog-source.json`

### 方式 B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

`wrangler.jsonc` 已设置 `name: yukunr-dsh-catalog`。部署需要 Cloudflare 账号；本仓库不存储任何凭据。

## 维护规则

- **新增插件** → 在 `ITEMS` 中追加一条同构条目，重新部署。
- **发布新版本** → 更新 `latestVersion`（精确 semver）与页面 `revision`，重新部署。
- **描述** → 保持客观、中立、双语。
- **契约字段** → 不要重命名或改用途 `manifestVersion`、`providerId`、`transport` 或条目字段名——市场会校验它们。
- **端点** → 必须以 `/v1/plugins` 结尾、与 manifest 同源、通过 443 端口的 HTTPS 提供。

## 提交 Pull Request

1. 运行上面的本地验证并确认预期输出。
2. 条目元数据保持客观、中立；严格匹配现有条目结构。
