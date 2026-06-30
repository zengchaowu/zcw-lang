import { defineConfig } from 'vitepress'

const SITE_URL = 'https://zcw-lang.zengchaowu.com'

export default defineConfig({
  title: 'ZCW 语言',
  description:
    '专为自动化、爬虫、网络操作和移动设备控制而设计的现代化脚本语言，文件后缀为 .zcw',
  lang: 'zh-CN',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ZCW 语言' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
  ],

  vite: {
    optimizeDeps: {
      exclude: ['monaco-editor'],
    },
  },

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'ZCW 语言',

    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '功能特性', link: '/guide/features' },
      { text: 'API 参考', link: '/api/core' },
      { text: '示例', link: '/examples' },
      { text: 'Playground', link: '/playground' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '功能特性', link: '/guide/features' },
            { text: '语法指南', link: '/guide/syntax' },
            { text: '数据类型', link: '/guide/data-types' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [{ text: '核心库 (core)', link: '/api/core' }],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zengchaowu/zcw-lang' },
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024–2026 ZCW Language',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/zengchaowu/zcw-lang/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
})
