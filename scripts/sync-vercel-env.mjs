/**
 * Sincroniza variáveis do .env.local para a Vercel (sem imprimir valores).
 * Uso: node scripts/sync-vercel-env.mjs
 */
import { readFileSync } from "fs";
import { spawnSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

const REQUIRED = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const TARGETS = ["production", "preview", "development"];

function parseEnv(content) {
  const map = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map[key] = value;
  }
  return map;
}

const env = parseEnv(readFileSync(envPath, "utf8"));

// Em produção, NEXTAUTH_URL não pode ser localhost
const prodUrl =
  process.env.VERCEL_PROD_URL ||
  "https://site-medico-nine.vercel.app";

if (!env.NEXTAUTH_URL || env.NEXTAUTH_URL.includes("localhost")) {
  env.NEXTAUTH_URL = prodUrl;
}

if (!env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL.includes("localhost")) {
  env.NEXT_PUBLIC_SITE_URL = prodUrl;
}

const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length) {
  console.error("Variáveis ausentes no .env.local:", missing.join(", "));
  process.exit(1);
}

function runVercelEnvAdd(key, value, target) {
  // Remove se já existir (ignora erro)
  spawnSync("npx", ["vercel", "env", "rm", key, target, "-y"], {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });

  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, target],
    {
      cwd: root,
      input: value + "\n",
      encoding: "utf8",
      shell: true,
    }
  );

  if (result.status !== 0) {
    console.error(`Falha ao adicionar ${key} (${target})`);
    if (result.stderr) console.error(result.stderr.slice(0, 300));
    return false;
  }
  return true;
}

let ok = 0;
let fail = 0;

for (const key of REQUIRED) {
  const value = env[key];
  console.log(`→ ${key} (${value.length} chars)`);
  for (const target of TARGETS) {
    const success = runVercelEnvAdd(key, value, target);
    if (success) {
      ok++;
      console.log(`  ✓ ${target}`);
    } else {
      fail++;
      console.log(`  ✗ ${target}`);
    }
  }
}

console.log(`\nConcluído: ${ok} ok, ${fail} falhas`);
if (fail > 0) process.exit(1);
