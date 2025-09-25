import type { NetflyClientOptions } from './types';
import { NetflyClient } from './NetflyClient';

export function createClient(options: NetflyClientOptions = {}): NetflyClient {
    return new NetflyClient(options);
}
