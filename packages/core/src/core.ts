/**
 * 核心库 - 提供内置功能
 */

import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { CoreMethod, CoreMethods, CoreConfig } from './types.js';

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
   * 打开指定的网页URL
   * @param url - 要打开的网页URL
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async visit(url: string): Promise<boolean> {
    try {
      if (this.config.debug) {
        console.log(`[Core] 正在打开网页: ${url}`);
      }
      
      // 在Node.js环境中，我们使用子进程来打开浏览器
      const command = this.getOpenCommand();
      const args = [url];
      
      const child = spawn(command, args, { 
        stdio: 'inherit',
        detached: true 
      });
      
      child.unref(); // 让父进程不等待子进程
      
      if (this.config.debug) {
        console.log(`[Core] 网页已在默认浏览器中打开: ${url}`);
      }
      return true;
      
    } catch (error) {
      console.error(`[Core] 打开网页失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 获取打开命令
   * @returns 平台对应的打开命令
   */
  private getOpenCommand(): string {
    switch (platform()) {
      case 'darwin': // macOS
        return 'open';
      case 'win32': // Windows
        return 'start';
      default: // Linux和其他
        return 'xdg-open';
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
