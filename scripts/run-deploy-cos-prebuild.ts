/**
 * deploy:cos 执行前：
 * 1) 相对上次 cos-deployed-{mode} tag 无变更则 exit 0
 * 2) 否则自动跑 package.json 中的 scripts.deploy:cos:build（DEPLOY_COS_SKIP_BUILD=1 可跳过构建）
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'
import {
  exitIfUnchangedDeploy,
  markDeployed,
} from '../../../scripts/lib/git-deploy-skip.mjs'

export function markCosDeploySucceeded(): void {
  markDeployed(process.cwd(), {
    kind: 'cos',
    mode: process.env.DEPLOY_MODE || 'prod',
  })
}

export function runDeployCosPrebuild(): void {
  exitIfUnchangedDeploy(process.cwd(), {
    kind: 'cos',
    mode: process.env.DEPLOY_MODE || 'prod',
  })

  if (process.env.DEPLOY_COS_SKIP_BUILD === '1' || process.env.DEPLOY_COS_SKIP_BUILD === 'true') {
    console.log('[deploy:cos] 跳过构建（DEPLOY_COS_SKIP_BUILD）')
    return
  }
  const cwd = process.cwd()
  const pkgPath = path.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.warn('[deploy:cos] 未找到 package.json，跳过自动构建')
    return
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { scripts?: Record<string, string> }
  if (!pkg.scripts?.['deploy:cos:build']) {
    console.warn('[deploy:cos] 未配置 scripts.deploy:cos:build，跳过自动构建')
    return
  }
  const cmd = `${resolvePmRun()} deploy:cos:build`
  console.log(`[deploy:cos] 执行: ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd, env: process.env, shell: true })
}

function resolvePmRun(): string {
  let dir = process.cwd()
  for (;;) {
    if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm run'
    if (fs.existsSync(path.join(dir, 'package-lock.json'))) return 'npm run'
    if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn run'
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  if (process.env.npm_config_user_agent?.includes('pnpm')) return 'pnpm run'
  return 'npm run'
}
