/**
 * ZCW语言测试文件 - TypeScript版本
 */

import { ZCWLanguage } from './index.js';

async function runTests(): Promise<void> {
  console.log('开始运行ZCW语言测试...\n');
  
  const zcw = new ZCWLanguage();
  
  // 测试1: 基本语法
  console.log('测试1: 基本语法');
  try {
    await zcw.runCode('core.visit("https://www.example.com");');
    console.log('✓ 基本语法测试通过\n');
  } catch (error) {
    console.error('✗ 基本语法测试失败:', error instanceof Error ? error.message : String(error), '\n');
  }
  
  // 测试2: 注释处理
  console.log('测试2: 注释处理');
  try {
    await zcw.runCode(`
      // 这是一个注释
      core.visit("https://www.google.com");
      // 另一个注释
    `);
    console.log('✓ 注释处理测试通过\n');
  } catch (error) {
    console.error('✗ 注释处理测试失败:', error instanceof Error ? error.message : String(error), '\n');
  }
  
  // 测试3: 多个语句
  console.log('测试3: 多个语句');
  try {
    await zcw.runCode(`
      core.visit("https://www.baidu.com");
      core.visit("https://www.github.com");
    `);
    console.log('✓ 多个语句测试通过\n');
  } catch (error) {
    console.error('✗ 多个语句测试失败:', error instanceof Error ? error.message : String(error), '\n');
  }
  
  // 测试4: 错误处理
  console.log('测试4: 错误处理');
  try {
    await zcw.runCode('core.unknownMethod("test");');
    console.error('✗ 错误处理测试失败: 应该抛出错误但没有');
  } catch (error) {
    console.log('✓ 错误处理测试通过:', error instanceof Error ? error.message : String(error), '\n');
  }

  // 测试5: 类型检查
  console.log('测试5: 类型检查');
  try {
    const interpreter = zcw.getInterpreter();
    
    // 测试变量设置和获取
    interpreter.setVariable('testVar', 'hello world');
    const value = interpreter.getVariable('testVar');
    
    if (value === 'hello world') {
      console.log('✓ 类型检查测试通过\n');
    } else {
      console.error('✗ 类型检查测试失败: 变量值不匹配\n');
    }
  } catch (error) {
    console.error('✗ 类型检查测试失败:', error instanceof Error ? error.message : String(error), '\n');
  }
  
  console.log('所有测试完成!');
}

// 运行测试
runTests().catch(console.error);
