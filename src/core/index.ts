/**
 * 核心库模块入口
 */

export { BrowserManager } from './browser.js';
export type { BrowserConfig } from './browser.js';

// 创建默认实例
import { BrowserManager } from './browser.js';

export const browser = new BrowserManager({
  debug: process.env['DEBUG'] === '1' || process.env['DEBUG'] === 'true',
  timeout: 5000
});
