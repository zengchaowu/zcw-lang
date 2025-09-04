/**
 * 核心库模块入口
 */

export { Core } from './core.js';
export type { CoreMethod, CoreMethods, CoreConfig } from './types.js';

// 创建默认实例
import { Core } from './core.js';

export const core = new Core({
  debug: process.env['DEBUG'] === '1' || process.env['DEBUG'] === 'true'
});
