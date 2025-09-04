#!/usr/bin/env node

/**
 * ZCW语言CLI工具
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Lexer, Parser, Interpreter } from '@zcw-lang/runtime';
import { core } from '@zcw-lang/core';

class ZCWCLI {
  private interpreter: Interpreter;

  constructor() {
    this.interpreter = new Interpreter(core);
  }

  /**
   * 运行ZCW文件
   */
  async runFile(filePath: string): Promise<void> {
    try {
      // 检查文件是否存在
      if (!existsSync(filePath)) {
        console.error(`错误: 文件不存在: ${filePath}`);
        process.exit(1);
      }

      // 检查文件扩展名
      if (!filePath.endsWith('.zcw')) {
        console.warn(`警告: 文件不是.zcw格式: ${filePath}`);
      }

      console.log(`正在执行: ${filePath}`);
      
      // 读取文件内容
      const source = readFileSync(filePath, 'utf-8');
      
      // 词法分析
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      // 语法分析
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      // 解释执行
      await this.interpreter.interpret(ast);
      
    } catch (error) {
      console.error(`执行错误: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }

  /**
   * 显示帮助信息
   */
  showHelp(): void {
    console.log(`
ZCW语言解释器 v1.0.0

用法:
  zcw <文件路径>          执行.zcw文件
  zcw --help, -h         显示帮助信息
  zcw --version, -v      显示版本信息

示例:
  zcw example.zcw        执行example.zcw文件
  zcw test.zcw          执行test.zcw文件

更多信息请访问: https://github.com/your-repo/zcw-lang
    `);
  }

  /**
   * 显示版本信息
   */
  showVersion(): void {
    console.log('ZCW语言解释器 v1.0.0');
  }

  /**
   * 主函数
   */
  async main(): Promise<void> {
    const args = process.argv.slice(2);

    // 处理帮助和版本参数
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      this.showHelp();
      return;
    }

    if (args.includes('--version') || args.includes('-v')) {
      this.showVersion();
      return;
    }

    // 获取文件路径
    const filePath = args[0];
    if (!filePath) {
      console.error('错误: 请提供要执行的文件路径');
      console.log('使用 zcw --help 查看帮助信息');
      process.exit(1);
    }

    // 解析为绝对路径
    const absolutePath = resolve(filePath);
    
    // 执行文件
    await this.runFile(absolutePath);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  const cli = new ZCWCLI();
  cli.main().catch(console.error);
}

export { ZCWCLI };
