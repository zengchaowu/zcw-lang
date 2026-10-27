import { BrowserLauncher } from './browser.launch.js';

export class BrowserPageController extends BrowserLauncher {
  /**
   * 打开网页
   * @param url - 网页URL
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async openPage(url: string): Promise<boolean> {
    try {
      if (!this.isBrowserLaunched) {
        const launched = await this.launch();
        if (!launched) {
          return false;
        }
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在打开网页: ${url}`);
      }

      // 关闭现有页面（如果有）
      if (this.page) {
        await this.page.close();
      }
      
      // 创建新页面并导航到URL
      this.page = await this.browser.newPage();
      await this.page.goto(url, { 
        timeout: this.config.timeout,
        waitUntil: 'networkidle2' // 等待网络空闲
      });
      
      // 等待页面完全加载
      await this.page.waitForLoadState?.('networkidle') || 
            await this.page.waitForFunction(() => document.readyState === 'complete');
      
      if (this.config.debug) {
        const title = await this.page.title();
        console.log(`[Browser] 网页已打开: ${url} (标题: ${title})`);
      }
      
      return true;
      
    } catch (error) {
      console.error(`[Browser] 打开网页失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 通过XPath点击元素
   * @param xpath - XPath表达式
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async clickByXPath(xpath: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在通过XPath点击元素: ${xpath}`);
      }

      // 使用evaluateHandle方法获取XPath元素
      const element = await this.page.evaluateHandle((xpath: string) => {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
      }, xpath);
      
      const elementValue = await element.asElement();
      if (elementValue) {
        
        // 获取元素信息用于调试
        const elementInfo = await elementValue.evaluate((el: any) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          type: el.type,
          disabled: el.disabled,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          position: getComputedStyle(el).position,
          zIndex: getComputedStyle(el).zIndex
        }));
        
        if (this.config.debug) {
          console.log(`[Browser] 找到XPath元素:`, elementInfo);
        }
        
        // 如果元素不可见，尝试滚动到元素位置
        if (!elementInfo.visible) {
          await elementValue.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 500)); // 等待滚动完成
        }
        
        // 点击元素
        await elementValue.click();
        
        if (this.config.debug) {
          console.log(`[Browser] 成功通过XPath点击元素`);
        }
        return true;
      } else {
        throw new Error('未找到匹配的XPath元素');
      }

    } catch (error) {
      console.error(`[Browser] XPath点击失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 通过CSS选择器点击元素
   * @param selector - CSS选择器
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async clickBySelector(selector: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在通过CSS选择器点击元素: ${selector}`);
      }

      // 获取当前操作的frame
      const currentFrame = (this as any).currentFrame || this.page;
      
      // 等待元素出现
      await currentFrame.waitForSelector(selector, { timeout: 5000 });
      
      // 检查元素是否存在和可点击
      const element = await currentFrame.$(selector);
      if (element) {
        const elementInfo = await element.evaluate((el: any) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          type: el.type,
          disabled: el.disabled,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          position: getComputedStyle(el).position,
          zIndex: getComputedStyle(el).zIndex
        }));
        
        if (this.config.debug) {
          console.log(`[Browser] 找到CSS元素:`, elementInfo);
        }
        
        // 如果元素不可见，尝试滚动到元素位置
        if (!elementInfo.visible) {
          await element.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 500)); // 等待滚动完成
        }
        
        // 点击元素
        await currentFrame.click(selector);
        
        if (this.config.debug) {
          console.log(`[Browser] 成功通过CSS选择器点击元素`);
        }
        return true;
      } else {
        throw new Error('未找到元素');
      }

    } catch (error) {
      console.error(`[Browser] CSS选择器点击失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 通过XPath输入文本
   * @param xpath - XPath表达式
   * @param text - 要输入的文本
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async typeByXPath(xpath: string, text: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在通过XPath输入文本: ${text} 到元素: ${xpath}`);
      }

      // 使用Puppeteer的$x方法获取XPath元素
      const elements = await this.page.$x(xpath);
      
      if (elements.length > 0) {
        const element = elements[0];
        
        // 获取元素信息用于调试
        const elementInfo = await element.evaluate((el: any) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          type: el.type,
          disabled: el.disabled,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          position: getComputedStyle(el).position,
          zIndex: getComputedStyle(el).zIndex
        }));
        
        if (this.config.debug) {
          console.log(`[Browser] 找到XPath元素:`, elementInfo);
        }
        
        // 如果元素不可见，尝试滚动到元素位置
        if (!elementInfo.visible) {
          await element.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 500)); // 等待滚动完成
        }
        
        // 点击元素聚焦，然后输入文本
        await element.click();
        await element.type(text);
        
        if (this.config.debug) {
          console.log(`[Browser] 成功通过XPath输入文本`);
        }
        return true;
      } else {
        throw new Error('未找到匹配的XPath元素');
      }

    } catch (error) {
      console.error(`[Browser] XPath输入失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 通过CSS选择器输入文本
   * @param selector - CSS选择器
   * @param text - 要输入的文本
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async typeBySelector(selector: string, text: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('请先打开网页');
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在通过CSS选择器输入文本: ${text} 到元素: ${selector}`);
      }

      // 获取当前操作的frame
      const currentFrame = (this as any).currentFrame || this.page;
      
      // 等待元素出现
      await currentFrame.waitForSelector(selector, { timeout: 5000 });
      
      // 检查元素是否存在和可操作
      const element = await currentFrame.$(selector);
      if (element) {
        const elementInfo = await element.evaluate((el: any) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          type: el.type,
          disabled: el.disabled,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          position: getComputedStyle(el).position,
          zIndex: getComputedStyle(el).zIndex
        }));
        
        if (this.config.debug) {
          console.log(`[Browser] 找到CSS元素:`, elementInfo);
        }
        
        // 如果元素不可见，尝试滚动到元素位置
        if (!elementInfo.visible) {
          await element.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 500)); // 等待滚动完成
        }
        
        // 点击元素聚焦，然后输入文本
        await currentFrame.click(selector);
        await currentFrame.type(selector, text);
        
        if (this.config.debug) {
          console.log(`[Browser] 成功通过CSS选择器输入文本`);
        }
        return true;
      } else {
        throw new Error('未找到元素');
      }

    } catch (error) {
      console.error(`[Browser] CSS选择器输入失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }
}
