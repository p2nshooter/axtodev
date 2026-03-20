#!/usr/bin/env node
// ══════════════════════════════════════════════════════════
//  AXTO — One-time Cloudflare Resource Setup
//  Run: node scripts/setup.mjs
// ══════════════════════════════════════════════════════════
import { execSync } from 'child_process'

const run = (cmd) => {
  console.log(`\n→ ${cmd}`)
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' })
    console.log(out.trim())
    return out.trim()
  } catch (e) {
    console.error(e.stderr || e.message)
    process.exit(1)
  }
}

console.log('⚡ AXTO — Cloudflare Resource Provisioning\n')

// 1. D1 Database
console.log('━━━ 1/3  Creating D1 Database ━━━')
const d1Out = run('npx wrangler d1 create axto-db')
const d1Id  = d1Out.match(/database_id\s*=\s*"([^"]+)"/)?.[1]
if (d1Id) console.log(`\n✅ D1 Database ID: ${d1Id}`)

// 2. KV Namespace
console.log('\n━━━ 2/3  Creating KV Namespace ━━━')
const kvOut = run('npx wrangler kv namespace create axto-sessions')
const kvId  = kvOut.match(/id\s*=\s*"([^"]+)"/)?.[1]
if (kvId) console.log(`\n✅ KV Namespace ID: ${kvId}`)

// 3. R2 Bucket
console.log('\n━━━ 3/3  Creating R2 Bucket ━━━')
run('npx wrangler r2 bucket create axto-outputs')
console.log('\n✅ R2 Bucket: axto-outputs')

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DONE — Add these to GitHub Secrets:

  D1_DATABASE_ID  = ${d1Id ?? '<see output above>'}
  KV_NAMESPACE_ID = ${kvId ?? '<see output above>'}
  R2_BUCKET_NAME  = axto-outputs

Then run:
  pnpm db:migrate   → apply D1 schema
  pnpm db:seed      → insert default pricing & nodes
  git push origin main → auto-deploy everything
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
