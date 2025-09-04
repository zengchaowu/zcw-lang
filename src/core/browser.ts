export interface BrowserConfig {
  debug: boolean;
  timeout: number;
}

export class BrowserManager {
  private config: BrowserConfig;
  private browser: any = null;
  private page: any = null;
  private isBrowserLaunched: boolean = false;

  constructor(config: BrowserConfig) {
    this.config = config;
  }

  /**
   * 启动浏览器
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async launch(): Promise<boolean> {
    try {
      if (this.isBrowserLaunched) {
        return true;
      }

      if (this.config.debug) {
        console.log(`[Browser] 正在启动浏览器`);
      }

      // 动态加载Puppeteer
      const puppeteer = await this.loadPuppeteer();
      if (!puppeteer) {
        throw new Error('Puppeteer未安装，请运行: npm install -g puppeteer');
      }

      const userDataDir = `${process.env['HOME'] || process.env['USERPROFILE']}/.zcw-browser-data`;
      
      this.browser = await puppeteer.launch({
        headless: false, // 始终显示浏览器
        userDataDir: userDataDir, // 使用持久化用户数据目录
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
      
      this.isBrowserLaunched = true;
      
      if (this.config.debug) {
        console.log(`[Browser] 浏览器已启动，用户数据目录: ${userDataDir}`);
      }
      
      return true;
      
    } catch (error) {
      console.error(`[Browser] 启动浏览器失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

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
   * 关闭浏览器
   * @returns Promise<boolean> 成功返回true，失败返回false
   */
  async close(): Promise<boolean> {
    try {
      if (this.browser && this.isBrowserLaunched) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        this.isBrowserLaunched = false;
        
        if (this.config.debug) {
          console.log(`[Browser] 浏览器已关闭`);
        }
      }
      return true;
    } catch (error) {
      console.error(`[Browser] 关闭浏览器失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * 等待指定时间
   * @param milliseconds - 等待时间（毫秒）
   * @returns Promise<void>
   */
  async wait(milliseconds: number): Promise<void> {
    if (this.config.debug) {
      console.log(`[Browser] 等待 ${milliseconds} 毫秒`);
    }
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    if (this.config.debug) {
      console.log(`[Browser] 等待完成`);
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

  /**
   * 动态加载Puppeteer
   * @returns Promise<any> Puppeteer实例或null
   */
  private async loadPuppeteer(): Promise<any> {
    try {
      // 首先尝试直接导入
      return await import('puppeteer' as any);
    } catch (error) {
      // 如果直接导入失败，尝试从全局安装位置加载
      try {
        const { execSync } = await import('child_process');
        const globalNodeModules = execSync('npm root -g', { encoding: 'utf8' }).trim();
        const puppeteerPath = `${globalNodeModules}/puppeteer`;
        
        // 尝试require方式加载
        try {
          return require(puppeteerPath);
        } catch (requireError) {
          // 如果require也失败，尝试import
          return await import(puppeteerPath);
        }
      } catch (globalError) {
        console.error('无法加载Puppeteer，请确保已全局安装: npm install -g puppeteer');
        return null;
      }
    }
  }
}
