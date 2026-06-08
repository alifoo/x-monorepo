import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendEnvPath = path.join(frontendDir, '..', 'backend', '.env');

function parseEnv(content) {
  const out = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[match[1]] = value;
  }
  return out;
}

if (!fs.existsSync(backendEnvPath)) {
  console.error('backend/.env não encontrado. Configure o backend primeiro.');
  process.exit(1);
}

const backend = parseEnv(fs.readFileSync(backendEnvPath, 'utf8'));
const anonKey = process.argv[2] || backend.SUPABASE_ANON_KEY;

if (!backend.SUPABASE_URL || !anonKey) {
  console.error(`Configure a chave anon do Supabase:

1. Abra: https://supabase.com/dashboard/project/scxhgplkjnhemxjpebfd/settings/api
2. Copie a chave "anon public" (ou "publishable")
3. Rode um dos comandos:

   node scripts/setup-env.mjs <SUA_ANON_KEY>

   # ou adicione no backend/.env:
   SUPABASE_ANON_KEY="<SUA_ANON_KEY>"
   node scripts/setup-env.mjs
`);
  process.exit(1);
}

const envContent = [
  `EXPO_PUBLIC_SUPABASE_URL=${backend.SUPABASE_URL}`,
  `EXPO_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`,
  'EXPO_PUBLIC_API_URL=http://localhost:3000',
  '',
].join('\n');

fs.writeFileSync(path.join(frontendDir, '.env'), envContent);
console.log('frontend/.env criado com sucesso.');
