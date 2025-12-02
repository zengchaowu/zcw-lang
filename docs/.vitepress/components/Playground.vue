<template>
  <div class="playground-container">
    <div class="playground-header">
      <div class="playground-title">ZCW 代码编辑器</div>
      <div class="playground-actions">
        <button class="playground-button" @click="resetCode">重置</button>
        <button class="playground-button primary" @click="runCode" :disabled="isRunning">
          {{ isRunning ? '运行中...' : '运行' }}
        </button>
      </div>
    </div>
    <div class="playground-editor" ref="editorContainer"></div>
    <div class="playground-output" :class="{ success: !hasError, error: hasError }">
      <div v-if="output.length === 0" style="color: var(--vp-c-text-2);">
        点击"运行"按钮执行代码...
      </div>
      <div v-else>
        <pre v-for="(line, index) in output" :key="index">{{ line }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const editorContainer = ref<HTMLElement>()
let editor: any = null

const output = ref<string[]>([])
const hasError = ref(false)
const isRunning = ref(false)

const defaultCode = `// ZCW 语言示例
// 打开网页
core.visit("https://www.example.com");
`

// 浏览器版本的 BrowserManager（模拟）
class BrowserManager {
  private visitedUrls: string[] = []
  
  async callMethod(methodName: string, args: any[]): Promise<any> {
    if (methodName === 'visit') {
      const url = args[0]
      this.visitedUrls.push(url)
      return true
    }
    throw new Error(`未知的浏览器方法: ${methodName}`)
  }
  
  getVisitedUrls(): string[] {
    return this.visitedUrls
  }
  
  clearVisitedUrls(): void {
    this.visitedUrls = []
  }
}

// 简化的解释器（浏览器版本）
class BrowserInterpreter {
  private browser: BrowserManager
  
  constructor(browser: BrowserManager) {
    this.browser = browser
  }
  
  async interpret(program: any): Promise<void> {
    for (const statement of program.children) {
      await this.interpretNode(statement)
    }
  }
  
  async interpretNode(node: any): Promise<any> {
    if (node.type === 'CALL') {
      return await this.interpretCall(node)
    }
    return node.value
  }
  
  async interpretCall(node: any): Promise<any> {
    const objectName = node.children[0]?.value
    const methodName = node.children[1]?.value
    const args = node.children.slice(2).map((child: any) => child.value)
    
    if (objectName === 'core') {
      return await this.browser.callMethod(methodName, args)
    }
    
    throw new Error(`未知的对象: ${objectName}`)
  }
}

const runCode = async () => {
  if (!editor || isRunning.value) return
  
  output.value = []
  hasError.value = false
  isRunning.value = true
  
  const code = editor.getValue()
  
  try {
    // 动态导入 runtime 模块
    const { Lexer, Parser } = await import('../../../src/runtime/index.js')
    
    // 词法分析
    const lexer = new Lexer(code)
    const tokens = lexer.tokenize()
    
    // 语法分析
    const parser = new Parser(tokens)
    const ast = parser.parse()
    
    // 创建浏览器管理器
    const browser = new BrowserManager()
    browser.clearVisitedUrls()
    
    // 解释执行
    const interpreter = new BrowserInterpreter(browser)
    await interpreter.interpret(ast)
    
    // 显示结果
    const visitedUrls = browser.getVisitedUrls()
    if (visitedUrls.length > 0) {
      output.value = [
        '✅ 代码执行成功！',
        '',
        '访问的 URL:',
        ...visitedUrls.map(url => `  - ${url}`),
        '',
        '注意：在浏览器环境中，visit 方法会模拟执行。',
        '在实际的 Node.js 环境中，会真正打开浏览器窗口。'
      ]
    } else {
      output.value = ['✅ 代码执行成功！']
    }
    hasError.value = false
  } catch (error) {
    hasError.value = true
    if (error instanceof Error) {
      output.value = [
        `❌ 错误: ${error.message}`,
        ...(error.stack ? error.stack.split('\n').slice(0, 5) : [])
      ]
    } else {
      output.value = [`❌ 错误: ${String(error)}`]
    }
  } finally {
    isRunning.value = false
  }
}

const resetCode = () => {
  if (editor) {
    editor.setValue(defaultCode)
    output.value = []
    hasError.value = false
  }
}

onMounted(async () => {
  if (!editorContainer.value) return
  
  // 动态加载 Monaco Editor
  try {
    const monaco = await import('monaco-editor')
    
    // 创建 Monaco Editor
    editor = monaco.editor.create(editorContainer.value, {
      value: defaultCode,
      language: 'javascript', // 暂时使用 JavaScript 语法高亮
      theme: 'vs-dark',
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on'
    })
  } catch (error) {
    // 如果 Monaco Editor 加载失败，使用简单的 textarea
    const textarea = document.createElement('textarea')
    textarea.value = defaultCode
    textarea.style.width = '100%'
    textarea.style.minHeight = '300px'
    textarea.style.fontFamily = 'monospace'
    textarea.style.padding = '1rem'
    textarea.style.border = 'none'
    textarea.style.background = 'var(--vp-c-bg-soft)'
    textarea.style.color = 'var(--vp-c-text-1)'
    editorContainer.value.appendChild(textarea)
    editor = {
      getValue: () => textarea.value,
      setValue: (value: string) => { textarea.value = value }
    }
  }
})

onBeforeUnmount(() => {
  if (editor && editor.dispose) {
    editor.dispose()
  }
})
</script>

