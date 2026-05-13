# Grid to China division

A simple tool to convert Maidenhead Locator System Grid to China division.

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
- `apps/web`: web app entry placeholder


