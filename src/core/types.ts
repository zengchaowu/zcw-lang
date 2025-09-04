/**
 * 核心库类型定义
 */

export interface CoreMethod {
  (...args: any[]): Promise<any>;
}

export interface CoreMethods {
  [methodName: string]: CoreMethod;
}

export interface CoreConfig {
  debug?: boolean;
  timeout?: number;
}
