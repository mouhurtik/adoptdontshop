/**
 * Post-build script to strip heavy dependencies from OpenNext Cloudflare worker.
 *
 * Runs AFTER `opennextjs-cloudflare build` and BEFORE `wrangler deploy`.
 * Targets the `.open-next/` output directory where the bundled worker lives.
 *
 * Savings:
 * - @vercel/og WASM + JS stubs in node_modules (prevents re-bundling)
 * - Strips `html2canvas` references from the handler if included
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

let totalSaved = 0;

// ── 1. Strip @vercel/og WASM and JS from node_modules (before they get bundled) ──
// Note: This only helps if run BEFORE the build. When run after, we need to patch the output directly.
const ogDir = join(ROOT, "node_modules", "next", "dist", "compiled", "@vercel", "og");
const minimalWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
const minimalEdgeJs = `"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.ImageResponse=class ImageResponse{constructor(){throw new Error("@vercel/og is not available")}};`;

["resvg.wasm", "yoga.wasm"].forEach((file) => {
  const filePath = join(ogDir, file);
  if (existsSync(filePath)) {
    const originalSize = statSync(filePath).size;
    writeFileSync(filePath, minimalWasm);
    totalSaved += originalSize - 8;
    console.log(`  ✓ ${file}: ${(originalSize / 1024).toFixed(1)} KiB → 8 bytes`);
  }
});

["index.edge.js", "index.node.js"].forEach((file) => {
  const filePath = join(ogDir, file);
  if (existsSync(filePath)) {
    const originalSize = statSync(filePath).size;
    writeFileSync(filePath, minimalEdgeJs);
    totalSaved += originalSize - minimalEdgeJs.length;
    console.log(`  ✓ ${file}: ${(originalSize / 1024).toFixed(1)} KiB → ${minimalEdgeJs.length} bytes`);
  }
});

// ── 2. Strip heavy chunks from .open-next output ──
const openNextDir = join(ROOT, ".open-next");
if (existsSync(openNextDir)) {
  // Find and report large files in the server-functions directory
  const serverDir = join(openNextDir, "server-functions", "default");
  
  // Strip WASM files from the bundled output (they get copied in)
  function findAndStripWasm(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        findAndStripWasm(fullPath);
      } else if (entry.name.endsWith(".wasm") && (entry.name.includes("resvg") || entry.name.includes("yoga"))) {
        const originalSize = statSync(fullPath).size;
        if (originalSize > 100) { // Skip already-stubbed files
          writeFileSync(fullPath, minimalWasm);
          totalSaved += originalSize - 8;
          console.log(`  ✓ .open-next/.../${entry.name}: ${(originalSize / 1024).toFixed(1)} KiB → 8 bytes`);
        }
      }
    }
  }
  findAndStripWasm(serverDir);
  
  // Check worker.js size
  const workerPath = join(openNextDir, "worker.js");
  if (existsSync(workerPath)) {
    const workerSize = statSync(workerPath).size;
    console.log(`\n  Worker size: ${(workerSize / 1024).toFixed(1)} KiB (${(workerSize / 1024 / 1024).toFixed(2)} MiB)`);
    if (workerSize > 3 * 1024 * 1024) {
      console.log(`  ⚠️  Worker exceeds 3 MiB free-tier limit!`);
    } else {
      console.log(`  ✅ Worker is within 3 MiB free-tier limit`);
    }
  }
}

console.log(`\n  Total saved: ~${(totalSaved / 1024).toFixed(0)} KiB`);
