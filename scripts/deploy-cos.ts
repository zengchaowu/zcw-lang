/**
 * 腾讯云 COS 部署（zcw-lang 文档站 → zcw-lang.zengchaowu.com）
 */

import dotenv from 'dotenv'
import COS from 'cos-nodejs-sdk-v5'
import path from 'node:path'
import fs from 'node:fs'
import process from 'node:process'
import { uploadToCOS } from 'zcw-shared/functions/tencent-cloud/upload.cos'
import type { SecretType } from 'zcw-shared/types/tencent-cloud'
import { runDeployCosPrebuild } from './run-deploy-cos-prebuild'

loadDeployEnv()

function getSecret(type: SecretType) {
  if (type === 'individual') {
    const secretId =
      process.env.TENCENT_SECRET_ID?.trim() ||
      process.env.COS_SECRET_ID?.trim() ||
      process.env.CLOUDBASE_SECRET_ID?.trim()
    const secretKey =
      process.env.TENCENT_SECRET_KEY?.trim() ||
      process.env.COS_SECRET_KEY?.trim() ||
      process.env.CLOUDBASE_SECRET_KEY?.trim()
    if (!secretId || !secretKey) return null
    return { secretId, secretKey }
  }
  return null
}

function loadDeployEnv(): void {
  const cwd = process.cwd()
  for (const name of ['.env.prod', '.env.dev', '.env']) {
    const envPath = path.join(cwd, name)
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath })
      if (getSecret('individual')) return
    }
  }

  // 回退：从 workspace api 包读取（与 provision 脚本一致）
  let dir = cwd
  for (;;) {
    const apiEnvProd = path.join(dir, 'packages/api.zengchaowu.com/.env.prod')
    const apiEnvDev = path.join(dir, 'packages/api.zengchaowu.com/.env.dev')
    for (const envPath of [apiEnvProd, apiEnvDev]) {
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath })
        if (getSecret('individual')) return
      }
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
}

async function deployInNodeJS() {
  try {
    runDeployCosPrebuild()
    const result = await uploadToCOS(
      {
        localPath: path.join(process.cwd(), 'docs/.vitepress/dist'),
        bucket: 'zcw-lang-1307503455',
        region: 'ap-guangzhou',
        cloudPath: '/',
        secretType: 'individual',
        includeRootFolder: false,
        showProgress: true,
        concurrency: 20,
      },
      {
        COS: COS as never,
        existsSync: fs.existsSync,
        statSync: fs.statSync,
        readdirSync: fs.readdirSync,
        readFileSync: fs.readFileSync,
        readFile: fs.readFile,
        join: path.join,
        basename: path.basename,
        relative: path.relative,
        normalize: path.normalize,
        log: console.log,
        error: console.error,
        getSecret,
      },
    )

    if (result.success) {
      console.log('部署成功:', result.message)
      console.log(`共上传 ${result.filesCount} 个文件`)
      console.log('站点: https://zcw-lang.zengchaowu.com/')
    } else {
      console.error('部署失败:', result.error)
      if (result.failedFiles && result.failedFiles.length > 0) {
        console.error('失败的文件:')
        result.failedFiles.forEach((file) => {
          console.error(`  - ${file}`)
        })
      }
      process.exit(1)
    }
  } catch (error) {
    console.error('部署异常:', error)
    process.exit(1)
  }
}

deployInNodeJS()
