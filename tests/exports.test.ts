import { describe, expect, it } from 'vitest';
import pkgDefault from '../src/index';
import { createRequire } from 'node:module';
import { NetflyClient } from '../src/NetflyClient';

const require = createRequire(import.meta.url);

describe('ESM import works', () => {
    it('should export classes and functions with types', () => {
        const client = new NetflyClient({ baseUrl: 'https://example.test' });
        expect(client).toBeInstanceOf(NetflyClient);
    });

    it('default export contains utilities', () => {
        expect(pkgDefault).toHaveProperty('NetflyClient');
        expect(pkgDefault).toHaveProperty('createClient');
    });
});

describe('CJS require works', () => {
    it('should allow requiring the built CJS bundle', () => {
        // Require the built CJS artifact. The build step runs before tests via npm script.
        const cjs = require('../dist/index.js');
        expect(cjs).toHaveProperty('NetflyClient');
        expect(cjs).toHaveProperty('createClient');
        const client = cjs.createClient();
        expect(client).toBeInstanceOf(cjs.NetflyClient);
    });
});
