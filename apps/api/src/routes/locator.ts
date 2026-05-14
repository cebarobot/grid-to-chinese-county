import type { QueryResult } from '@grid-to-chinese-county/shared-types';
import { RequestValidationError } from '../mappers/errors.js';

export interface LocatorQueryService {
  query(locator: string): Promise<QueryResult>;
}

function readLocator(url: URL): string {
  const locator = url.searchParams.get('locator');

  if (locator === null || locator.trim().length === 0) {
    throw new RequestValidationError('The locator query parameter is required.');
  }

  return locator;
}

export async function handleLocatorRequest(
  url: URL,
  locatorQueryService: LocatorQueryService
): Promise<QueryResult> {
  return locatorQueryService.query(readLocator(url));
}
