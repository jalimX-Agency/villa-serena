import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { uploadToR2 } from "../src/lib/r2";

const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

async function retry<T>(fn: () => Promise<T>, n = 5): Promise<T> {
  for (let i = 1; ; i++) {
    try { return await fn(); } catch (e) {
      if (i >= n) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

(async () => {
  const dir = join(process.cwd(), "public");
  for (const f of readdirSync(dir)) {
    const type = TYPES[extname(f).toLowerCase()];
    if (!type) continue;
    const body = readFileSync(join(dir, f));
    const url = await retry(() => uploadToR2(`site/${f}`, body, type));
    const res = await retry(() => fetch(url));
    const len = Number(res.headers.get("content-length"));
    console.log(res.status, len === body.length ? "size-ok" : `SIZE-MISMATCH ${len}/${body.length}`, f);
  }
})().catch((e) => { console.error("FAIL", e.message, e.cause?.code ?? ""); process.exit(1); });
