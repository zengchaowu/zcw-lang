/**
 * 词法分析器 - 将源代码转换为标记流
 */

import { Token, TokenType, ZCWError } from './types.js';

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  constructor(source: string) {
    this.source = source;
  }

  /**
   * 获取当前字符
   */
  private current(): string | null {
    if (this.position >= this.source.length) {
      return null;
    }
    return this.source[this.position] ?? null;
  }

  /**
   * 获取下一个字符
   */
  private peek(offset: number = 1): string | null {
    const pos = this.position + offset;
    if (pos >= this.source.length) {
      return null;
    }
    return this.source[pos] ?? null;
  }

  /**
   * 前进一个字符
   */
  private advance(): void {
    if (this.current() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  /**
   * 跳过空白字符
   */
  private skipWhitespace(): void {
    while (this.current() && /\s/.test(this.current()!)) {
      this.advance();
    }
  }

  /**
   * 读取标识符
   */
  private readIdentifier(): string {
    let value = '';
    while (this.current() && /[a-zA-Z_][a-zA-Z0-9_]*/.test(this.current()!)) {
      value += this.current();
      this.advance();
    }
    return value;
  }

  /**
   * 读取字符串
   */
  private readString(): string {
    let value = '';
    this.advance(); // 跳过开始的引号
    
    while (this.current() && this.current() !== '"') {
      if (this.current() === '\\') {
        this.advance();
        if (this.current()) {
          value += this.current();
          this.advance();
        }
      } else {
        value += this.current();
        this.advance();
      }
    }
    
    if (this.current() === '"') {
      this.advance(); // 跳过结束的引号
    }
    
    return value;
  }

  /**
   * 读取数字
   */
  private readNumber(): number {
    let value = '';
    while (this.current() && /[0-9.]/.test(this.current()!)) {
      value += this.current();
      this.advance();
    }
    return parseFloat(value);
  }

  /**
   * 读取注释
   */
  private readComment(): void {
    while (this.current() && this.current() !== '\n') {
      this.advance();
    }
  }

  /**
   * 创建标记
   */
  private createToken(type: TokenType, value: string | number | null): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column
    };
  }

  /**
   * 词法分析主方法
   */
  tokenize(): Token[] {
    this.tokens = [];
    this.position = 0;
    this.line = 1;
    this.column = 1;

    while (this.position < this.source.length) {
      this.skipWhitespace();
      
      if (this.position >= this.source.length) {
        break;
      }

      const current = this.current();
      const line = this.line;
      const column = this.column;

      if (!current) break;

      // 注释
      if (current === '/' && this.peek() === '/') {
        this.readComment();
        continue;
      }

      // 标识符和关键字
      if (/[a-zA-Z_]/.test(current)) {
        const value = this.readIdentifier();
        let type = TokenType.IDENTIFIER;
        
        // 关键字
        if (value === 'core') {
          type = TokenType.CORE;
        }
        
        this.tokens.push(this.createToken(type, value));
        continue;
      }

      // 字符串
      if (current === '"') {
        const value = this.readString();
        this.tokens.push(this.createToken(TokenType.STRING, value));
        continue;
      }

      // 数字
      if (/[0-9]/.test(current)) {
        const value = this.readNumber();
        this.tokens.push(this.createToken(TokenType.NUMBER, value));
        continue;
      }

      // 标点符号
      switch (current) {
        case '.':
          this.tokens.push(this.createToken(TokenType.DOT, '.'));
          this.advance();
          break;
        case '(':
          this.tokens.push(this.createToken(TokenType.LPAREN, '('));
          this.advance();
          break;
        case ')':
          this.tokens.push(this.createToken(TokenType.RPAREN, ')'));
          this.advance();
          break;
        case ';':
          this.tokens.push(this.createToken(TokenType.SEMICOLON, ';'));
          this.advance();
          break;
        default: {
          const error: ZCWError = new Error(`意外的字符: ${current} 在行 ${line}, 列 ${column}`);
          error.line = line;
          error.column = column;
          throw error;
        }
      }
    }

    this.tokens.push(this.createToken(TokenType.EOF, null));
    return this.tokens;
  }
}
