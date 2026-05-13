import { loadChinaCountyIndex, queryLocator, type CountyIndex } from '@grid-to-xian/core';
import { createServer, type Server, type ServerResponse } from 'node:http';
import { mapErrorToApiError } from './mappers/errors.js';
import { buildHealthResponse } from './routes/health.js';
import { handleLocatorRequest, type LocatorQueryService } from './routes/locator.js';

function writeJsonResponse(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8'
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

export function createChinaCountyQueryService(source?: string | URL): LocatorQueryService {
  let countyIndexPromise: Promise<CountyIndex> | undefined;

  return {
    async query(locator: string) {
      countyIndexPromise ??= loadChinaCountyIndex(source);
      return queryLocator(locator, await countyIndexPromise);
    }
  };
}

export function createApiServer(locatorQueryService: LocatorQueryService = createChinaCountyQueryService()): Server {
  return createServer(async (request, response) => {
    try {
      if (request.method !== 'GET') {
        writeJsonResponse(response, 405, {
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Only GET is supported.'
          }
        });
        return;
      }

      const url = new URL(request.url ?? '/', 'http://127.0.0.1');

      if (url.pathname === '/health') {
        writeJsonResponse(response, 200, buildHealthResponse());
        return;
      }

      if (url.pathname === '/locator') {
        writeJsonResponse(response, 200, await handleLocatorRequest(url, locatorQueryService));
        return;
      }

      writeJsonResponse(response, 404, {
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found.'
        }
      });
    } catch (error) {
      const apiError = mapErrorToApiError(error);

      writeJsonResponse(response, apiError.statusCode, apiError.payload);
    }
  });
}
