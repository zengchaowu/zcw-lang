import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ZCW 语言',
  description: '一个简单的自定义 DSL 语言，文件后缀为 .zcw',
  lang: 'zh-CN',
  
  vite: {
    optimizeDeps: {
      exclude: ['monaco-editor']
    }
  },
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '功能特性', link: '/guide/features' },
      { text: 'API 参考', link: '/api/core' },
      { text: '示例', link: '/examples' },
      { text: 'Playground', link: '/playground' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '功能特性', link: '/guide/features' },
            { text: '语法指南', link: '/guide/syntax' },
            { text: '数据类型', link: '/guide/data-types' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '核心库 (core)', link: '/api/core' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 ZCW Language'
    },

    search: {
      provider: 'local'
    }
  }
})

