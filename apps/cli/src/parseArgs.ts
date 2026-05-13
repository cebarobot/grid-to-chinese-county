export type CliOutputFormat = 'text' | 'json';

export interface CliOptions {
  locator: string;
  outputFormat: CliOutputFormat;
  source?: string;
}

export class CliUsageError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'CliUsageError';
  }
}

function readOptionValue(args: string[], optionIndex: number, flag: string): string {
  const value = args[optionIndex + 1];

  if (value === undefined || value.startsWith('--')) {
    throw new CliUsageError(`Missing value for ${flag}.`);
  }

  return value;
}

export function parseCliArgs(args: string[]): CliOptions {
  let locator: string | undefined;
  let outputFormat: CliOutputFormat = 'text';
  let source: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;

    if (arg === '--json') {
      outputFormat = 'json';
      continue;
    }

    if (arg === '--source') {
      source = readOptionValue(args, index, '--source');
      index += 1;
      continue;
    }

    if (arg.startsWith('--source=')) {
      source = arg.slice('--source='.length);

      if (source.length === 0) {
        throw new CliUsageError('Missing value for --source.');
      }

      continue;
    }

    if (arg.startsWith('--')) {
      throw new CliUsageError(`Unknown option: ${arg}`);
    }

    if (locator !== undefined) {
      throw new CliUsageError('Only one locator may be provided.');
    }

    locator = arg;
  }

  if (locator === undefined) {
    throw new CliUsageError('A locator argument is required.');
  }

  return {
    locator,
    outputFormat,
    ...(source === undefined ? {} : { source })
  };
}
