#!/usr/bin/env node

/**
 * ZCW语言解释器主入口 - TypeScript版本
 */

import { readFileSync } from 'node:fs';
import { Lexer, Parser, Interpreter } from '@zcw-lang/runtime';
import { core } from '@zcw-lang/core';

export class ZCWLanguage {
  private lexer: Lexer | null = null;
  private parser: Parser | null = null;
  private interpreter: Interpreter;

  constructor() {
    this.interpreter = new Interpreter(core);
  }

  /**
   * 运行ZCW文件
   * @param filePath - 文件路径
   */
  async runFile(filePath: string): Promise<void> {
    try {
      console.log(`正在加载文件: ${filePath}`);
      
      // 读取文件内容
      const source = readFileSync(filePath, 'utf-8');
      
      // 词法分析
      console.log('正在进行词法分析...');
      this.lexer = new Lexer(source);
      const tokens = this.lexer.tokenize();
      
      // 显示标记（调试用）
      if (process.env['DEBUG']) {
        console.log('标记流:');
        tokens.forEach(token => {
          if (token.type !== 'EOF') {
            console.log(`  Token(${token.type}, ${JSON.stringify(token.value)})`);
          }
        });
      }
      
      // 语法分析
      console.log('正在进行语法分析...');
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      // 显示AST（调试用）
      if (process.env['DEBUG']) {
        console.log('抽象语法树:');
        this.printAST(ast, 0);
      }
      
      // 解释执行
      console.log('开始解释执行...');
      await this.interpreter.interpret(ast);
      
    } catch (error) {
      if (error instanceof Error) {
        console.error(`执行错误: ${error.message}`);
        if (error.stack && process.env['DEBUG']) {
          console.error(error.stack);
        }
      } else {
        console.error(`执行错误: ${String(error)}`);
      }
      process.exit(1);
    }
  }

  /**
   * 运行ZCW代码字符串
   * @param source - 源代码
   */
  async runCode(source: string): Promise<void> {
    try {
      console.log('正在执行代码...');
      
      // 词法分析
      this.lexer = new Lexer(source);
      const tokens = this.lexer.tokenize();
      
      // 语法分析
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      // 解释执行
      await this.interpreter.interpret(ast);
      
    } catch (error) {
      if (error instanceof Error) {
        console.error(`执行错误: ${error.message}`);
        if (error.stack && process.env['DEBUG']) {
          console.error(error.stack);
        }
      } else {
        console.error(`执行错误: ${String(error)}`);
      }
      throw error;
    }
  }

  /**
   * 打印AST（调试用）
   * @param node - AST节点
   * @param depth - 深度
   */
  private printAST(node: any, depth: number = 0): void {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}${node.value ? `(${JSON.stringify(node.value)})` : ''}`);
    
    for (const child of node.children) {
      this.printAST(child, depth + 1);
    }
  }

  /**
   * 获取解释器实例
   * @returns 解释器实例
   */
  getInterpreter(): Interpreter {
    return this.interpreter;
  }

  /**
   * 设置调试模式
   * @param enabled - 是否启用调试模式
   */
  setDebugMode(enabled: boolean): void {
    if (enabled) {
      process.env['DEBUG'] = '1';
    } else {
      delete process.env['DEBUG'];
    }
  }
}

// 主函数
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node dist/index.js <文件路径>');
    console.log('示例: node dist/index.js example.zcw');
    console.log('调试模式: DEBUG=1 node dist/index.js example.zcw');
    process.exit(1);
  }

  const filePath = args[0];
  
  if (!filePath) {
    console.error('错误: 未提供文件路径');
    process.exit(1);
  }
  
  // 检查文件扩展名
  if (!filePath.endsWith('.zcw')) {
    console.warn('警告: 文件不是.zcw格式');
  }

  const zcw = new ZCWLanguage();
  await zcw.runFile(filePath);
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
