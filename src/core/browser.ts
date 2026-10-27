import { BrowserContextController } from './browser.context.js';

export type { BrowserConfig } from './browser.launch.js';

export class BrowserManager extends BrowserContextController {
  /**
   * 调用浏览器方法
   * @param methodName - 方法名
   * @param args - 参数数组
   * @returns Promise<any> 方法执行结果
   */
  async callMethod(methodName: string, args: any[]): Promise<any> {
    // 处理别名方法
    if (methodName === 'visit') {
      return await this.openPage(args[0]);
    }
    
    const method = (this as any)[methodName];
    if (!method || typeof method !== 'function') {
      throw new Error(`未知的浏览器方法: ${methodName}`);
    }
    return await method.apply(this, args);
  }
}
