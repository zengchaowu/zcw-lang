/**
 * 核心库 - 提供内置功能
 */

import { CoreMethod, CoreMethods, CoreConfig } from './types.js';

// 动态导入Puppeteer，避免打包时包含

export class Core {
  private methods: CoreMethods;
  private config: CoreConfig;

  constructor(config: CoreConfig = {}) {
    this.config = {
      debug: false,
      timeout: 5000,
      ...config
    };
    
    this.methods = {
      visit: this.visit.bind(this)
    };
  }

  /**
   * 打开指定的网页URL（使用Puppeteer）
   * @param url - 要打开的网页URL
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async visit(url: string): Promise<boolean> {
    try {
      if (this.config.debug) {
        console.log(`[Core] 正在打开网页: ${url}`);
      }
      
      const puppeteer = await this.loadPuppeteer();
      const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.goto(url, { timeout: this.config.timeout });
      
      if (this.config.debug) {
        const title = await page.title();
        console.log(`[Core] 网页已通过Puppeteer打开: ${url} (标题: ${title})`);
      }
      
      // 保持浏览器打开，让用户可以看到页面
      return true;
      
    } catch (error) {
      console.error(`[Core] 打开网页失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 动态加载Puppeteer
   * @returns Promise<any> Puppeteer实例
   */
  private async loadPuppeteer(): Promise<any> {
    try {
      // 使用动态导入避免TypeScript编译时检查
      const puppeteer = await import('puppeteer' as any);
      return puppeteer.default || puppeteer;
    } catch (error) {
      // 尝试从全局安装的puppeteer加载
      try {
        const { execSync } = await import('child_process');
        const globalPuppeteerPath = execSync('npm root -g', { encoding: 'utf8' }).trim();
        const puppeteerPath = `${globalPuppeteerPath}/puppeteer`;
        
        // 检查路径是否存在
        const { existsSync } = await import('fs');
        if (!existsSync(puppeteerPath)) {
          throw new Error('Puppeteer not found in global path');
        }
        
        // 尝试不同的导入方式
        try {
          const puppeteer = await import(puppeteerPath);
          return puppeteer.default || puppeteer;
        } catch (importError) {
          // 尝试使用require方式
          const puppeteer = require(puppeteerPath);
          return puppeteer.default || puppeteer;
        }
      } catch (globalError) {
        throw new Error(`Puppeteer未安装。请运行: npm install -g puppeteer\n原始错误: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  }


  /**
   * 调用指定的方法
   * @param methodName - 方法名
   * @param args - 参数列表
   * @returns Promise<any> 方法执行结果
   */
  async callMethod(methodName: string, args: any[] = []): Promise<any> {
    if (this.methods[methodName]) {
      return await this.methods[methodName](...args);
    } else {
      throw new Error(`核心库中没有找到方法: ${methodName}`);
    }
  }

  /**
   * 获取所有可用的方法
   * @returns 可用方法名数组
   */
  getAvailableMethods(): string[] {
    return Object.keys(this.methods);
  }

  /**
   * 添加新方法到核心库
   * @param methodName - 方法名
   * @param method - 方法实现
   */
  addMethod(methodName: string, method: CoreMethod): void {
    this.methods[methodName] = method;
  }

  /**
   * 移除方法
   * @param methodName - 方法名
   */
  removeMethod(methodName: string): boolean {
    if (methodName in this.methods) {
      delete this.methods[methodName];
      return true;
    }
    return false;
  }

  /**
   * 获取配置
   * @returns 当前配置
   */
  getConfig(): CoreConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   * @param newConfig - 新配置
   */
  updateConfig(newConfig: Partial<CoreConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 检查方法是否存在
   * @param methodName - 方法名
   * @returns 是否存在
   */
  hasMethod(methodName: string): boolean {
    return methodName in this.methods;
  }
}
