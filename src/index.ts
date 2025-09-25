/****
 * Unofficial Netfly Peppol SDK client
 * Implements methods based on the provided OpenAPI description.
 * Note: Requires a bearer token (apiKey) from your OAuth2 flow.
 */
import { NetflyClient } from './NetflyClient';
import { createClient } from './createClient';
import { NetflyApiError } from './errors/NetflyApiError';

export * from './errors/NetflyApiError';
export * from './types';
export * from './createClient';
export * from './NetflyClient';

// Default export for convenience in some import styles
export default {
    NetflyClient,
    createClient,
    NetflyApiError,
};
