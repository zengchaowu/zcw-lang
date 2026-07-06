#!/usr/bin/env tsx
/**
 * 自动化发布脚本
 * 支持语义化版本控制、Git 标签创建和包发布
 */

// @ts-ignore - 忽略Node.js核心模块的类型检查
import { execSync } from 'child_process'
// @ts-ignore
import { readFileSync, writeFileSync } from 'fs'
// @ts-ignore
import { join } from 'path'
import { incrementVersion } from '@zengchaowu/shared/functions/version/incrementVersion'
import type { VersionType } from '@zengchaowu/shared/types/semver'

// @ts-ignore - 忽略 process 全局变量的类型检查
declare const process: any

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function error(message: string) {
  log(`❌ ${message}`, 'red')
}

function success(message: string) {
  log(`✅ ${message}`, 'green')
}

function info(message: string) {
  log(`ℹ️  ${message}`, 'blue')
}

function warning(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

// 执行命令
function exec(command: string, options: { silent?: boolean } = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit'
    })
    return typeof result === 'string' ? result.trim() : ''
  } catch (err: any) {
    if (err instanceof Error) {
      throw new Error(`命令执行失败: ${command}\n${err.message}`)
    }
    throw err
  }
}

// 检查工作目录是否干净
function checkWorkingDirectory() {
  info('检查 Git 工作目录状态...')
  try {
    const status = exec('git status --porcelain', { silent: true })
    if (status) {
      error('工作目录不干净，请先提交或暂存所有更改')
      console.log(status)
      process.exit(1)
    }
    success('工作目录干净')
  } catch (err) {
    error('无法检查 Git 状态，请确保在 Git 仓库中运行此脚本')
    process.exit(1)
  }
}

// 检查是否在主分支
function checkBranch() {
  info('检查当前分支...')
  try {
    const branch = exec('git branch --show-current', { silent: true })
    if (branch !== 'main' && branch !== 'master') {
      warning(`当前在分支 '${branch}'，建议在主分支发布`)
      const answer = process.argv.includes('--force') ? 'y' : 'n'
      if (answer !== 'y') {
        error('发布已取消')
        process.exit(1)
      }
    }
    success(`当前分支: ${branch}`)
  } catch (err) {
    error('无法获取当前分支信息')
    process.exit(1)
  }
}

// 运行测试
function runTests() {
  info('运行类型检查...')
  try {
    exec('npx tsc --noEmit')
    success('类型检查通过')
  } catch (err) {
    error('类型检查失败')
    process.exit(1)
  }
}

// 构建项目
function buildProject() {
  info('构建项目...')
  try {
    exec('npm run build')
    success('项目构建完成')
  } catch (err) {
    error('项目构建失败')
    process.exit(1)
  }
}


// 更新 package.json 版本
function updatePackageVersion(newVersion: string) {
  info(`更新 package.json 版本到 ${newVersion}...`)
  try {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8') as any)
    packageJson.version = newVersion
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
    success(`版本已更新到 ${newVersion}`)
  } catch (err) {
    error('更新 package.json 失败')
    process.exit(1)
  }
}

// 创建 Git 提交和标签
function createGitTag(version: string) {
  info('创建 Git 提交和标签...')
  try {
    exec(`git add package.json`)
    exec(`git commit -m "chore: bump version to ${version}"`)
    exec(`git tag -a v${version} -m "Release v${version}"`)
    success(`已创建标签 v${version}`)
  } catch (err) {
    error('创建 Git 标签失败')
    process.exit(1)
  }
}

// 推送到远程仓库
function pushToRemote() {
  info('推送到远程仓库...')
  try {
    exec('git push')
    exec('git push --tags')
    success('已推送到远程仓库')
  } catch (err) {
    error('推送到远程仓库失败')
    process.exit(1)
  }
}

// 发布到 npm
function publishToNpm(tag?: string) {
  info('发布到 npm...')
  
  const packagePath = join(process.cwd(), 'package.json')
  const packageContent = readFileSync(packagePath, 'utf8')
  const packageJson = JSON.parse(packageContent)
  const originalName = packageJson.name
  const publishName = packageJson.publish?.name
  
  // 构建发布命令
  const publishCommand = tag ? `npm publish --tag ${tag}` : 'npm publish'
  
  // 执行发布的通用函数
  const executePublish = () => {
    try {
      exec(publishCommand)
      success('已发布到 npm')
    } catch (err) {
      error('发布到 npm 失败')
      throw err
    }
  }
  
  // 如果没有自定义发布名称，直接发布
  if (!publishName) {
    info(`使用默认包名发布: ${originalName}`)
    executePublish()
    return
  }
  
  // 使用自定义发布名称
  info(`使用自定义包名发布: ${originalName} -> ${publishName}`)
  
  try {
    // 临时修改包名
    packageJson.name = publishName
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    
    // 执行发布
    executePublish()
  } finally {
    // 恢复原包名
    packageJson.name = originalName
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    info(`恢复包名: ${publishName} -> ${originalName}`)
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2)
  const versionType = (args[0] as VersionType) || 'patch'
  const isDryRun = args.includes('--dry-run')
  const skipTests = args.includes('--skip-tests')
  const skipPush = args.includes('--skip-push')
  const tag = args.find(arg => arg.startsWith('--tag='))?.split('=')[1]
  
  if (!['patch', 'minor', 'major', 'prerelease'].includes(versionType)) {
    error('无效的版本类型。支持: patch, minor, major, prerelease')
    console.log('\n使用方法:')
    console.log('  npm run publish [patch|minor|major|prerelease] [选项]')
    console.log('\n选项:')
    console.log('  --dry-run      仅显示将要执行的操作，不实际执行')
    console.log('  --skip-tests   跳过测试')
    console.log('  --skip-push    跳过推送到远程仓库')
    console.log('  --force        强制在非主分支发布')
    console.log('  --tag=<tag>    指定 npm 发布标签（如 beta, alpha）')
    process.exit(1)
  }
  
  log('🚀 开始发布流程...', 'magenta')
  
  // 读取当前版本
  const packagePath = join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8') as any)
  const currentVersion = packageJson.version
  const newVersion = incrementVersion(currentVersion, versionType, versionType === 'prerelease' ? 'beta' : undefined)
  
  log(`\n📦 包名: ${packageJson.name}`, 'cyan')
  log(`📊 当前版本: ${currentVersion}`, 'cyan')
  log(`🆕 新版本: ${newVersion}`, 'cyan')
  log(`🏷️  版本类型: ${versionType}`, 'cyan')
  if (tag) {
    log(`🏷️  npm 标签: ${tag}`, 'cyan')
  }
  
  if (isDryRun) {
    warning('这是一次试运行，不会实际执行任何操作')
    return
  }
  
  // 执行发布流程
  checkWorkingDirectory()
  checkBranch()
  
  if (!skipTests) {
    runTests()
  }
  
  buildProject()
  updatePackageVersion(newVersion)
  createGitTag(newVersion)
  
  if (!skipPush) {
    pushToRemote()
  }
  
  publishToNpm(tag)
  
  log('\n🎉 发布完成！', 'green')
  log(`📦 版本 ${newVersion} 已成功发布`, 'green')
}

// 运行主函数
main()