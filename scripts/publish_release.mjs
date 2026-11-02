#!/usr/bin/env node
/**
 * 发布一份 ROTA Link APK 到网页仓库。
 *
 *   node scripts/publish_release.mjs <apk 路径> <versionName> <versionCode> [notes.json]
 *
 * 做三件事：
 *   1. 把 APK 复制成 public/releases/ROTA-Link-v<版本>.apk（旧版本的包会被删掉，
 *      仓库里永远只有一份 —— 历史版本在 GitHub Releases 里，那里才是归档地）；
 *   2. 算出 sizeBytes / sha256，写 public/releases/latest.json；
 *   3. 打印摘要，提交推送后由 Actions 发到 Pages。
 *
 * latest.json 就是 App 端 `AppUpdater` 读的那份清单，字段名改了要两边一起改。
 *
 * notes.json 形如：
 *   { "en": "…", "zh-CN": "…", "zh-TW": "…" }
 */
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const OUT_DIR = join(ROOT, 'public', 'releases')
/** Pages 站点根（vite base = /ROTA-firmware/），清单里的绝对 URL 就用它拼 */
const SITE = 'https://hortenli.github.io/ROTA-firmware'

const [apkPath, versionName, versionCodeArg, notesPath] = process.argv.slice(2)
if (!apkPath || !versionName || !versionCodeArg) {
  console.error('usage: node scripts/publish_release.mjs <apk> <versionName> <versionCode> [notes.json]')
  process.exit(1)
}
const versionCode = Number(versionCodeArg)
if (!Number.isInteger(versionCode) || versionCode <= 0) {
  console.error(`versionCode 必须是正整数，收到 ${versionCodeArg}`)
  process.exit(1)
}

const apkAbs = resolve(apkPath)
const st = statSync(apkAbs)
const bytes = readFileSync(apkAbs)
const sha256 = createHash('sha256').update(bytes).digest('hex')

mkdirSync(OUT_DIR, { recursive: true })
// 只留最新一份包：仓库不是 CDN，旧版本堆在这里只会让 clone 越来越慢
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.apk')) rmSync(join(OUT_DIR, f))
}

const fileName = `ROTA-Link-v${versionName}.apk`
copyFileSync(apkAbs, join(OUT_DIR, fileName))

let notes = { en: '', 'zh-CN': '', 'zh-TW': '' }
if (notesPath) {
  const raw = JSON.parse(readFileSync(resolve(notesPath), 'utf8'))
  notes = { ...notes, ...raw }
}

const manifest = {
  name: 'ROTA Link',
  packageId: 'com.rota.link',
  versionName,
  versionCode,
  apk: `${SITE}/releases/${fileName}`,
  sizeBytes: st.size,
  sha256,
  publishedAt: new Date().toISOString().slice(0, 10),
  notes,
}

writeFileSync(join(OUT_DIR, 'latest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')

const mb = (st.size / 1_000_000).toFixed(1)
console.log(`✓ ${fileName}  ${mb} MB`)
console.log(`  versionCode ${versionCode} · sha256 ${sha256.slice(0, 16)}…`)
console.log(`  manifest  ${join('public', 'releases', 'latest.json')}`)
console.log(`  url       ${manifest.apk}`)
console.log(`  apk 来源  ${basename(apkAbs)}`)
