import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

// No R2/KV incremental cache — uses default in-memory cache.
// Add R2 or KV later if ISR caching is needed at scale.
export default defineCloudflareConfig({});
