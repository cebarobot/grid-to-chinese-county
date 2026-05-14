import type { QueryResult } from '@grid-to-chinese-county/shared-types';
import type { CliOutputFormat } from './parseArgs.js';

function formatTextOutput(result: QueryResult): string {
  const lines = [`Locator: ${result.locator}`, 'Candidates:'];

  if (result.candidates.length === 0) {
    lines.push('- none');
  } else {
    for (const candidate of result.candidates) {
      lines.push(`- ${candidate.name} (${candidate.gbCode})`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push('Warnings:');

    for (const warning of result.warnings) {
      lines.push(`- ${warning.message}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function formatCliOutput(result: QueryResult, format: CliOutputFormat): string {
  if (format === 'json') {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  return formatTextOutput(result);
}

export function formatCliHelp(): string {
  return [
    'Usage: grid-to-chinese-county <locator> [--json] [--source <path>]',
    '',
    'Options:',
    '  --json            Print the query result as JSON.',
    '  --source <path>   Override the GeoJSON source used for the query.',
    '  --help            Show this help message.'
  ].join('\n') + '\n';
}

export function formatCliError(message: string): string {
  return `Error: ${message}\n`;
}
