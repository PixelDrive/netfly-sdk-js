import { beforeEach, describe, expect, it } from 'vitest';
import { NetflyClient } from '../src';

describe('Test the SDK implementation', () => {
    let client: NetflyClient;

    beforeEach(() => {
        client = new NetflyClient({
            apiKey: process.env.NETFLY_API_KEY,
            baseUrl: process.env.NETFLY_API_BASE_URL,
        });
    });

    it('should list participants', async () => {
        const participants = await client.participantsList();
        expect(Array.isArray(participants)).toBe(true);
        expect(participants.length).toBeGreaterThan(0);
        expect(participants[0]).toHaveProperty('participantId');
    });
});
