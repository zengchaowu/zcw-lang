/**
 * 解释器 - 执行AST节点
 */

import { ASTNode, ASTNodeType, ZCWValue, ZCWError } from './types.js';
import { Core } from '../core/index.js';

export class Interpreter {
  private variables: Map<string, any> = new Map();
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  /**
   * 解释程序
   * @param program - 程序AST节点
   */
  async interpret(program: ASTNode): Promise<void> {
    console.log('开始执行程序...');
    
    for (const statement of program.children) {
      await this.interpretNode(statement);
    }
    
    console.log('程序执行完成');
  }

  /**
   * 解释AST节点
   * @param node - AST节点
   * @returns 节点执行结果
   */
  async interpretNode(node: ASTNode): Promise<ZCWValue> {
    switch (node.type) {
      case ASTNodeType.PROGRAM:
        for (const child of node.children) {
          await this.interpretNode(child);
        }
        return null;
        
      case ASTNodeType.CALL:
        return await this.interpretCall(node);
        
      case ASTNodeType.STRING:
        return node.value as string;
        
      case ASTNodeType.NUMBER:
        return node.value as number;
        
      case ASTNodeType.IDENTIFIER:
        return this.variables.get(node.value as string) || node.value;
        
      default: {
        const error: ZCWError = new Error(`未知的节点类型: ${node.type}`);
        throw error;
      }
    }
  }

  /**
   * 解释函数调用
   * @param callNode - 调用节点
   * @returns 调用结果
   */
  private async interpretCall(callNode: ASTNode): Promise<ZCWValue> {
    if (callNode.children.length < 2) {
      const error: ZCWError = new Error('函数调用需要至少包含对象和方法');
      throw error;
    }

    const objectNode = callNode.children[0];
    const methodNode = callNode.children[1];
    const args = callNode.children.slice(2);

    if (!objectNode || !methodNode) {
      const error: ZCWError = new Error('函数调用缺少必要的节点');
      throw error;
    }

    // 解析参数
    const resolvedArgs: ZCWValue[] = [];
    for (const arg of args) {
      const value = await this.interpretNode(arg);
      resolvedArgs.push(value);
    }

    // 处理core对象的方法调用
    if (objectNode.type === ASTNodeType.CORE) {
      return await this.interpretCoreCall(methodNode.value as string, resolvedArgs);
    }

    // 处理其他对象的方法调用
    if (objectNode.type === ASTNodeType.IDENTIFIER) {
      return await this.interpretObjectCall(
        objectNode.value as string, 
        methodNode.value as string, 
        resolvedArgs
      );
    }

    const error: ZCWError = new Error(`无法处理对象类型: ${objectNode.type}`);
    throw error;
  }

  /**
   * 解释core对象的方法调用
   * @param methodName - 方法名
   * @param args - 参数列表
   * @returns 方法执行结果
   */
  private async interpretCoreCall(methodName: string, args: ZCWValue[]): Promise<ZCWValue> {
    console.log(`调用 core.${methodName}(${args.map(arg => JSON.stringify(arg)).join(', ')})`);
    
    try {
      const result = await this.core.callMethod(methodName, args);
      return result;
    } catch (error) {
      console.error(`执行 core.${methodName} 时出错: ${error instanceof Error ? error.message : '未知错误'}`);
      throw error;
    }
  }

  /**
   * 解释其他对象的方法调用
   * @param objectName - 对象名
   * @param methodName - 方法名
   * @param args - 参数列表
   * @returns 方法执行结果
   */
  private async interpretObjectCall(
    objectName: string, 
    methodName: string, 
    args: ZCWValue[]
  ): Promise<ZCWValue> {
    // 检查变量是否存在
    if (!this.variables.has(objectName)) {
      const error: ZCWError = new Error(`未定义的变量: ${objectName}`);
      throw error;
    }

    const object = this.variables.get(objectName);
    
    // 检查对象是否有该方法
    if (typeof object[methodName] !== 'function') {
      const error: ZCWError = new Error(`对象 ${objectName} 没有方法 ${methodName}`);
      throw error;
    }

    console.log(`调用 ${objectName}.${methodName}(${args.map(arg => JSON.stringify(arg)).join(', ')})`);
    
    try {
      const result = await object[methodName](...args);
      return result;
    } catch (error) {
      console.error(`执行 ${objectName}.${methodName} 时出错: ${error instanceof Error ? error.message : '未知错误'}`);
      throw error;
    }
  }

  /**
   * 设置变量
   * @param name - 变量名
   * @param value - 变量值
   */
  setVariable(name: string, value: any): void {
    this.variables.set(name, value);
  }

  /**
   * 获取变量
   * @param name - 变量名
   * @returns 变量值
   */
  getVariable(name: string): any {
    return this.variables.get(name);
  }

  /**
   * 获取所有变量
   * @returns 变量对象
   */
  getVariables(): Record<string, any> {
    return Object.fromEntries(this.variables);
  }

  /**
   * 清除所有变量
   */
  clearVariables(): void {
    this.variables.clear();
  }

  /**
   * 检查变量是否存在
   * @param name - 变量名
   * @returns 是否存在
   */
  hasVariable(name: string): boolean {
    return this.variables.has(name);
  }
}
