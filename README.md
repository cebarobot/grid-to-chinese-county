# Grid to Chinese County

A simple tool to convert Maidenhead Locator System Grid to Chinese county-level administrative divisions.

## Usage

Install dependencies and build first:

```bash
pnpm install
pnpm build
```

### CLI

```bash
# Query locator
node apps/cli/dist/index.js on80cb

# Query locator with JSON output
node apps/cli/dist/index.js on80cb --json

# Query locator with custom county source
node apps/cli/dist/index.js FN31AA --source tests/fixtures/county-fixture.geojson

# Show help
node apps/cli/dist/index.js --help
```

Example output:

```text
Locator: ON80CB
Candidates:
- 海淀区 (156110108)
```

### Web API

Start server:

```bash
# On default port 3000
node apps/api/dist/index.js

# On custom port 3100
PORT=3100 node apps/api/dist/index.js
```

Health check:

```bash
curl http://127.0.0.1:3000/health
```

```json
{"status":"ok"}
```

Locator query:

```bash
curl "http://127.0.0.1:3000/locator?locator=on80cb"
```

Example response:

```json
{
	"locator": "ON80CB",
	"candidates": [
		{
			"name": "海淀区",
			"gbCode": "156110108"
		}
	],
	"warnings": []
}
```

Common error response:

```bash
curl "http://127.0.0.1:3000/locator?locator=FN3"
```

```json
{
	"error": {
		"code": "INVALID_LENGTH",
		"message": "Locator length must be an even number of characters."
	}
}
```

### Web

本地运行前端：

```bash
pnpm --filter @grid-to-chinese-county/web dev
```

本地预览构建结果：

```bash
pnpm --filter @grid-to-chinese-county/web build
pnpm --filter @grid-to-chinese-county/web preview
```

前端构建前会自动执行 `pnpm run build:data`，临时生成压缩后的 bbox 资产。

地图瓦片参数从环境变量读取：

```bash
# OpenStreetMap 示例（默认）
VITE_TILE_URLS="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
VITE_TILE_ATTRIBUTION="&copy; OpenStreetMap contributors"
VITE_TILE_SUBDOMAINS="abc"
VITE_TILE_MAX_ZOOM="19"

# 天地图示例
VITE_TILE_URLS="https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=your-tianditu-token;https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=your-tianditu-token"
VITE_TILE_ATTRIBUTION="天地图 GS（2024）0568号 - 甲测资字1100471"
VITE_TILE_SUBDOMAINS="01234567"
VITE_TILE_MAX_ZOOM="18"
```

### GitHub Pages

部署 workflow 在 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)。

首次启用时需要：

1. 在 GitHub 仓库设置里把 Pages 的 Source 设为 GitHub Actions。
2. 在仓库 `Secrets` 中配置 `VITE_TILE_URLS`。
3. 在仓库 `Variables` 中按需配置 `VITE_TILE_ATTRIBUTION`、`VITE_TILE_SUBDOMAINS`、`VITE_TILE_MAX_ZOOM`。


## Development

- Node.js: v22+
- Package manager: pnpm

### Commands

- `pnpm install`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

### Workspace Layout

- `packages/core`: shared domain logic and Maidenhead parsing
- `packages/shared-types`: shared public types
- `apps/cli`: CLI query interface
- `apps/api`: Web API query interface
- `apps/web`: Grid to Chinese County web app


