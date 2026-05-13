import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  buildCountyIndexAsset,
  DEFAULT_CHINA_COUNTY_GEOJSON_URL,
  loadCountyFeatureCollection
} from '../packages/core/src/index.js';

interface BuildCountyIndexArgs {
  source: string | URL;
  outputPath: string;
}

function parseArgs(args: string[]): BuildCountyIndexArgs {
  let source: string | URL = DEFAULT_CHINA_COUNTY_GEOJSON_URL;
  let outputPath = resolve('data/county-index.json');

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;

    if (arg === '--source') {
      source = resolve(args[index + 1]!);
      index += 1;
      continue;
    }

    if (arg === '--output') {
      outputPath = resolve(args[index + 1]!);
      index += 1;
      continue;
    }
  }

  return {
    source,
    outputPath
  };
}

async function writeJson(filePath: string, payload: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(payload), 'utf8');
}

export async function buildCountyIndexFile(args: string[]): Promise<void> {
  const options = parseArgs(args);
  const collection = await loadCountyFeatureCollection(options.source);

  await writeJson(options.outputPath, buildCountyIndexAsset(collection));
}

await buildCountyIndexFile(process.argv.slice(2));
