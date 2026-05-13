#!/usr/bin/env node

import { LocatorParseError, queryChinaCountyLocator } from '@grid-to-xian/core';
import { pathToFileURL } from 'node:url';
import { formatCliError, formatCliHelp, formatCliOutput } from './output.js';
import { CliUsageError, parseCliArgs } from './parseArgs.js';

export interface CliIo {
	stdout(text: string): void;
	stderr(text: string): void;
}

const processIo: CliIo = {
	stdout(text) {
		process.stdout.write(text);
	},
	stderr(text) {
		process.stderr.write(text);
	}
};

function isMainModule(): boolean {
	const entryPoint = process.argv[1];

	return entryPoint !== undefined && import.meta.url === pathToFileURL(entryPoint).href;
}

export async function runCli(args: string[], io: CliIo = processIo): Promise<number> {
	if (args.includes('--help') || args.includes('-h')) {
		io.stdout(formatCliHelp());
		return 0;
	}

	try {
		const options = parseCliArgs(args);
		const result = await queryChinaCountyLocator(options.locator, options.source);

		io.stdout(formatCliOutput(result, options.outputFormat));
		return 0;
	} catch (error) {
		if (error instanceof CliUsageError || error instanceof LocatorParseError || error instanceof Error) {
			io.stderr(formatCliError(error.message));
			return 1;
		}

		throw error;
	}
}

if (isMainModule()) {
	process.exitCode = await runCli(process.argv.slice(2));
}

