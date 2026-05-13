import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiServer, createChinaCountyQueryService } from '../../apps/api/src/index.js';

let server: Server;
let baseUrl = '';

beforeAll(async () => {
  const fixtureSource = new URL('../fixtures/county-fixture.geojson', import.meta.url);

  server = createApiServer(createChinaCountyQueryService(fixtureSource));

  await new Promise<void>((resolve, reject) => {
    server.listen(0, '127.0.0.1', (error?: Error) => {
      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  const address = server.address();

  if (address === null || typeof address === 'string') {
    throw new Error('Unexpected server address.');
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error?: Error) => {
      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

describe('createApiServer', () => {
  it('serves the health route', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok'
    });
  });

  it('serves locator query results as JSON', async () => {
    const response = await fetch(`${baseUrl}/locator?locator=FN31AA`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      locator: 'FN31AA',
      candidates: [
        {
          name: 'Alpha County',
          gbCode: '156000001'
        }
      ],
      warnings: []
    });
  });

  it('returns 400 when locator is missing', async () => {
    const response = await fetch(`${baseUrl}/locator`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'The locator query parameter is required.'
      }
    });
  });

  it('returns 400 for invalid locator input', async () => {
    const response = await fetch(`${baseUrl}/locator?locator=FN3`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: 'INVALID_LENGTH',
        message: 'Locator length must be an even number of characters.'
      }
    });
  });
});