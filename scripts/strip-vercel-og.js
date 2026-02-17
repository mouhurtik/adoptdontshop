/**
 * Post-build script to replace @vercel/og WASM and JS files with minimal stubs.
 *
 * @vercel/og is bundled inside Next.js for OG image generation (ImageResponse).
 * Since this project doesn't use OG image generation, these files add ~2.2 MiB
 * to the Cloudflare Worker bundle unnecessarily. Replacing them with stubs
 * keeps the worker under the 3 MiB free-tier limit.
 *
 * This script runs AFTER `opennextjs-cloudflare build` and BEFORE `wrangler deploy`.
 */

const fs = require("fs");
const path = require("path");

const ogDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og"
);

// Minimal valid WebAssembly module (8 bytes: magic number + version 1)
const minimalWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

// Minimal JS stub that exports an empty ImageResponse class
const minimalEdgeJs = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageResponse = class ImageResponse {
  constructor() {
    throw new Error("@vercel/og is not available in this deployment");
  }
};
`.trim();

let saved = 0;

// Replace WASM files
["resvg.wasm", "yoga.wasm"].forEach((file) => {
  const filePath = path.join(ogDir, file);
  if (fs.existsSync(filePath)) {
    const originalSize = fs.statSync(filePath).size;
    fs.writeFileSync(filePath, minimalWasm);
    saved += originalSize - 8;
    console.log(`  ✓ ${file}: ${(originalSize / 1024).toFixed(1)} KiB → 8 bytes`);
  }
});

// Replace edge and node JS files
["index.edge.js", "index.node.js"].forEach((file) => {
  const filePath = path.join(ogDir, file);
  if (fs.existsSync(filePath)) {
    const originalSize = fs.statSync(filePath).size;
    fs.writeFileSync(filePath, minimalEdgeJs);
    saved += originalSize - minimalEdgeJs.length;
    console.log(
      `  ✓ ${file}: ${(originalSize / 1024).toFixed(1)} KiB → ${minimalEdgeJs.length} bytes`
    );
  }
});

console.log(`\n  Total saved: ~${(saved / 1024).toFixed(0)} KiB`);
