import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { runCli, type CliIo } from '../../apps/cli/src/index.js';

const countyFixturePath = fileURLToPath(new URL('../fixtures/county-fixture.geojson', import.meta.url));

function createCliCapture(): {
  io: CliIo;
  getStdout(): string;
  getStderr(): string;
} {
  let stdout = '';
  let stderr = '';

  return {
    io: {
      stdout(text) {
        stdout += text;
      },
      stderr(text) {
        stderr += text;
      }
    },
    getStdout() {
      return stdout;
    },
    getStderr() {
      return stderr;
    }
  };
}

describe('runCli', () => {
  it('prints JSON output when --json is provided', async () => {
    const capture = createCliCapture();
    const exitCode = await runCli(['FN31AA', '--json', '--source', countyFixturePath], capture.io);

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.getStdout())).toEqual({
      locator: 'FN31AA',
      candidates: [
        {
          name: 'Alpha County',
          gbCode: '156000001'
        }
      ],
      warnings: []
    });
    expect(capture.getStderr()).toBe('');
  });

  it('prints text output by default', async () => {
    const capture = createCliCapture();
    const exitCode = await runCli(['FN31AA', '--source', countyFixturePath], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.getStdout()).toBe('Locator: FN31AA\nCandidates:\n- Alpha County (156000001)\n');
    expect(capture.getStderr()).toBe('');
  });

  it('returns a usage error when the locator argument is missing', async () => {
    const capture = createCliCapture();
    const exitCode = await runCli(['--json'], capture.io);

    expect(exitCode).toBe(1);
    expect(capture.getStdout()).toBe('');
    expect(capture.getStderr()).toBe('Error: A locator argument is required.\n');
  });
});
