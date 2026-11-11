// Run from apps/backend:  node scripts/patch-medusa-config.mjs
// Registers the product-media module in medusa-config.ts if it is not there yet.
import fs from "node:fs"

const file = "medusa-config.ts"
let src = fs.readFileSync(file, "utf8")

if (src.includes("product-media")) {
  console.log("[patch] product-media already registered - nothing to do")
  process.exit(0)
}

const re = /modules\s*:\s*\[/
if (!re.test(src)) {
  console.error("[patch] could not find `modules: [` in medusa-config.ts - add the module by hand:")
  console.error('        { resolve: "./src/modules/product-media" },')
  process.exit(1)
}

src = src.replace(re, (m) => `${m}\n    { resolve: "./src/modules/product-media" },`)
fs.writeFileSync(file, src)
console.log("[patch] registered ./src/modules/product-media in medusa-config.ts")
