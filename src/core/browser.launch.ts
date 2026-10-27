export interface BrowserConfig {
  debug: boolean;
  timeout: number;
}

export class BrowserLauncher {
  protected config: BrowserConfig;
  protected browser: any = null;
  protected page: any = null;
  protected isBrowserLaunched: boolean = false;

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
