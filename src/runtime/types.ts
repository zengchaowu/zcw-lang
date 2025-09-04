/**
 * ZCW语言类型定义
 */

export enum TokenType {
  // 标识符和关键字
  CORE = 'CORE',
  IDENTIFIER = 'IDENTIFIER',
  
  // 字面量
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  
  // 标点符号
  DOT = 'DOT',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  
  // 特殊
  EOF = 'EOF'
}

export interface Token {
  type: TokenType;
  value: string | number | null;
  line: number;
  column: number;
}

export enum ASTNodeType {
  PROGRAM = 'PROGRAM',
  CALL = 'CALL',
  CORE = 'CORE',
  METHOD = 'METHOD',
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  ARRAY = 'ARRAY'
}

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number | null;
  children: ASTNode[];
}

export interface ZCWError extends Error {
  line?: number;
  column?: number;
}

export type ZCWValue = string | number | boolean | null | ZCWValue[];
