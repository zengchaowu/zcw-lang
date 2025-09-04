/**
 * 语法分析器 - 将标记流转换为抽象语法树(AST)
 */

import { Token, TokenType, ASTNode, ASTNodeType, ZCWError } from './types.js';

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * 获取当前标记
   */
  private current(): Token | null {
    if (this.position >= this.tokens.length) {
      return null;
    }
    return this.tokens[this.position] ?? null;
  }

  /**
   * 获取下一个标记
   */
  // private peek(offset: number = 1): Token | null {
  //   const pos = this.position + offset;
  //   if (pos >= this.tokens.length) {
  //     return null;
  //   }
  //   return this.tokens[pos] ?? null;
  // }

  /**
   * 前进一个标记
   */
  private advance(): void {
    this.position++;
  }

  /**
   * 检查当前标记类型
   */
  private check(type: TokenType): boolean {
    const token = this.current();
    return token !== null && token.type === type;
  }

  /**
   * 匹配并消费指定类型的标记
   */
  private match(type: TokenType): Token | null {
    if (this.check(type)) {
      const token = this.current();
      this.advance();
      return token;
    }
    return null;
  }

  /**
   * 期望指定类型的标记
   */
  private expect(type: TokenType): Token {
    const token = this.match(type);
    if (!token) {
      const current = this.current();
      const error: ZCWError = new Error(
        `期望 ${type}，但得到 ${current ? current.type : 'EOF'}`
      );
      if (current) {
        error.line = current.line;
        error.column = current.column;
      }
      throw error;
    }
    return token;
  }

  /**
   * 创建AST节点
   */
  private createNode(type: ASTNodeType, value?: string | number | null): ASTNode {
    return {
      type,
      value: value ?? null,
      children: []
    };
  }

  /**
   * 解析程序
   */
  parse(): ASTNode {
    const program = this.createNode(ASTNodeType.PROGRAM);
    
    while (!this.check(TokenType.EOF)) {
      const statement = this.parseStatement();
      if (statement) {
        program.children.push(statement);
      }
    }
    
    return program;
  }

  /**
   * 解析语句
   */
  private parseStatement(): ASTNode | null {
    // 跳过空语句
    if (this.check(TokenType.SEMICOLON)) {
      this.advance();
      return null;
    }

    // 解析函数调用语句
    if (this.check(TokenType.CORE)) {
      return this.parseCoreCall();
    }

    // 解析标识符调用语句
    if (this.check(TokenType.IDENTIFIER)) {
      const identifierToken = this.current()!;
      this.advance();
      
      // 检查是否是直接方法调用（如 click("新建")）
      if (this.check(TokenType.LPAREN)) {
        return this.parseDirectMethodCall(identifierToken.value as string);
      }
      
      // 否则是对象方法调用
      return this.parseIdentifierCall(identifierToken.value as string);
    }

    const current = this.current();
    const error: ZCWError = new Error(`无法解析语句: ${current?.type}`);
    if (current) {
      error.line = current.line;
      error.column = current.column;
    }
    throw error;
  }

  /**
   * 解析core调用
   */
  private parseCoreCall(): ASTNode {
    const coreToken = this.expect(TokenType.CORE);
    const coreNode = this.createNode(ASTNodeType.CORE, coreToken.value as string);
    
    // 解析点号
    this.expect(TokenType.DOT);
    
    // 解析方法名
    const methodToken = this.expect(TokenType.IDENTIFIER);
    const methodNode = this.createNode(ASTNodeType.METHOD, methodToken.value as string);
    
    // 解析参数列表
    this.expect(TokenType.LPAREN);
    const args = this.parseArguments();
    this.expect(TokenType.RPAREN);
    
    // 解析分号
    this.expect(TokenType.SEMICOLON);
    
    const callNode = this.createNode(ASTNodeType.CALL);
    callNode.children.push(coreNode);
    callNode.children.push(methodNode);
    
    for (const arg of args) {
      callNode.children.push(arg);
    }
    
    return callNode;
  }

  /**
   * 解析标识符调用
   */
  private parseIdentifierCall(identifierName?: string): ASTNode {
    let identifierNode: ASTNode;
    if (identifierName) {
      identifierNode = this.createNode(ASTNodeType.IDENTIFIER, identifierName);
    } else {
      const identifierToken = this.expect(TokenType.IDENTIFIER);
      identifierNode = this.createNode(ASTNodeType.IDENTIFIER, identifierToken.value as string);
    }
    
    // 检查是否有方法调用
    if (this.check(TokenType.DOT)) {
      this.advance(); // 消费点号
      const methodToken = this.expect(TokenType.IDENTIFIER);
      const methodNode = this.createNode(ASTNodeType.METHOD, methodToken.value as string);
      
      // 解析参数列表
      this.expect(TokenType.LPAREN);
      const args = this.parseArguments();
      this.expect(TokenType.RPAREN);
      
      // 解析分号
      this.expect(TokenType.SEMICOLON);
      
      const callNode = this.createNode(ASTNodeType.CALL);
      callNode.children.push(identifierNode);
      callNode.children.push(methodNode);
      
      for (const arg of args) {
        callNode.children.push(arg);
      }
      
      return callNode;
    }
    
    const error: ZCWError = new Error('期望方法调用');
    const current = this.current();
    if (current) {
      error.line = current.line;
      error.column = current.column;
    }
    throw error;
  }

  /**
   * 解析参数列表
   */
  private parseArguments(): ASTNode[] {
    const args: ASTNode[] = [];
    
    if (this.check(TokenType.RPAREN)) {
      return args; // 空参数列表
    }
    
    // 解析第一个参数
    args.push(this.parseExpression());
    
    // 解析更多参数
    while (this.check(TokenType.COMMA)) {
      this.advance(); // 消费逗号
      args.push(this.parseExpression());
    }
    
    return args;
  }

  /**
   * 解析表达式
   */
  private parseExpression(): ASTNode {
    const token = this.current();
    
    if (!token) {
      const error: ZCWError = new Error('意外的文件结束');
      throw error;
    }

    if (token.type === TokenType.STRING) {
      this.advance();
      return this.createNode(ASTNodeType.STRING, token.value as string);
    }
    
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return this.createNode(ASTNodeType.NUMBER, token.value as number);
    }
    
    if (token.type === TokenType.LBRACKET) {
      return this.parseArray();
    }
    
    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      return this.createNode(ASTNodeType.IDENTIFIER, token.value as string);
    }
    
    const error: ZCWError = new Error(`无法解析表达式: ${token.type}`);
    error.line = token.line;
    error.column = token.column;
    throw error;
  }

  /**
   * 解析直接方法调用
   */
  private parseDirectMethodCall(methodName: string): ASTNode {
    const methodNode = this.createNode(ASTNodeType.METHOD, methodName);
    
    // 解析参数列表
    this.expect(TokenType.LPAREN);
    const args = this.parseArguments();
    this.expect(TokenType.RPAREN);
    
    // 解析分号
    this.expect(TokenType.SEMICOLON);
    
    const callNode = this.createNode(ASTNodeType.CALL);
    callNode.children.push(methodNode);
    
    for (const arg of args) {
      callNode.children.push(arg);
    }
    
    return callNode;
  }

  /**
   * 解析数组
   */
  private parseArray(): ASTNode {
    this.expect(TokenType.LBRACKET);
    const arrayNode = this.createNode(ASTNodeType.ARRAY);
    
    if (this.check(TokenType.RBRACKET)) {
      this.advance(); // 消费右括号
      return arrayNode; // 空数组
    }
    
    // 解析第一个元素
    arrayNode.children.push(this.parseExpression());
    
    // 解析更多元素
    while (this.check(TokenType.COMMA)) {
      this.advance(); // 消费逗号
      arrayNode.children.push(this.parseExpression());
    }
    
    this.expect(TokenType.RBRACKET);
    return arrayNode;
  }
}
