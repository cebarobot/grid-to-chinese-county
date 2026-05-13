#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
export * from './mappers/errors.js';
export * from './routes/health.js';
export * from './routes/locator.js';
export * from './server.js';
import { createApiServer } from './server.js';

function isMainModule(): boolean {
	const entryPoint = process.argv[1];

	return entryPoint !== undefined && import.meta.url === pathToFileURL(entryPoint).href;
}

function resolvePort(portValue: string | undefined): number {
	if (portValue === undefined) {
		return 3000;
	}

	const port = Number.parseInt(portValue, 10);

	return Number.isNaN(port) ? 3000 : port;
}

if (isMainModule()) {
	const port = resolvePort(process.env.PORT);
	const server = createApiServer();

	server.listen(port, () => {
		process.stdout.write(`API server listening on http://127.0.0.1:${port}\n`);
	});
}

