import { BrowserPageController } from './browser.page.js';

export class BrowserContextController extends BrowserPageController {
  /**
   * 截取页面截图
   * @param filename - 截图文件名
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async screenshot(filename: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在截取页面截图: ${filename}`);
      }

      await this.page.screenshot({ path: filename, fullPage: true });
      
      if (this.config.debug) {
        console.log(`[Browser] 成功截取页面截图: ${filename}`);
      }
      return true;

    } catch (error) {
      console.error(`[Browser] 截图失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 打印页面DOM结构
   * @param selector - 可选的选择器，只打印匹配的元素
   * @returns Promise<void>
   */
  async printDOM(selector?: string): Promise<void> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在打印DOM结构${selector ? ` (选择器: ${selector})` : ''}`);
      }

      const html = await this.page.evaluate((sel: string) => {
        if (sel) {
          const element = document.querySelector(sel);
          return element ? element.outerHTML : '未找到匹配的元素';
        } else {
          return document.documentElement.outerHTML;
        }
      }, selector);

      console.log(`[Browser] DOM内容:`);
      console.log(html);

    } catch (error) {
      console.error(`[Browser] 打印DOM失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 切换到iframe
   * @param frameSelector - iframe选择器或ID
   * @returns Promise<boolean>
   */
  async switchToFrame(frameSelector: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在切换到iframe: ${frameSelector}`);
      }

      // 等待iframe加载
      await this.page.waitForSelector(`iframe#${frameSelector}`, { timeout: 10000 });
      
      // 获取iframe元素
      const frameElement = await this.page.$(`iframe#${frameSelector}`);
      if (!frameElement) {
        throw new Error(`未找到iframe: ${frameSelector}`);
      }

      // 切换到iframe
      const frame = await frameElement.contentFrame();
      if (!frame) {
        throw new Error('无法获取iframe内容');
      }

      // 保存当前frame引用
      (this as any).currentFrame = frame;

      if (this.config.debug) {
        console.log(`[Browser] 成功切换到iframe: ${frameSelector}`);
      }

      return true;

    } catch (error) {
      console.error(`[Browser] 切换iframe失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 切换回主框架
   * @returns Promise<boolean>
   */
  async switchToMainFrame(): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在切换回主框架`);
      }

      // 清除当前frame引用
      (this as any).currentFrame = null;

      if (this.config.debug) {
        console.log(`[Browser] 成功切换回主框架`);
      }

      return true;

    } catch (error) {
      console.error(`[Browser] 切换主框架失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }
}
