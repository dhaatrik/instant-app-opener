## 2026-05-05 - DNS Lookup Caching in `isSafeUrlForFetch`

**Learning:** Uncached repeated DNS lookups via `node:dns/promises` for HTTP request validation (SSRF prevention) cause a massive performance penalty.
**Action:** Implemented a module-level `Map` cache (LRU pattern with a bounded max size of 1000 items and a 5-minute TTL) for storing `hostname` to `string[]` IP resolution mapping inside `isSafeUrlForFetch`.
