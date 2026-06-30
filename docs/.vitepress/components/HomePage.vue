<script setup lang="ts">
import { withBase } from 'vitepress'
import { CwButton } from 'zcw-vue-ui/CwButton'
import { CwCard } from 'zcw-vue-ui/CwCard'
import { CwFeatureCardGrid } from 'zcw-vue-ui/CwFeatureCardGrid'
import { CwIcon } from 'zcw-vue-ui/CwIcon'
import type { CwFeatureCardItem } from 'zcw-vue-ui/CwFeatureCardGrid'
import {
  heroPrimaryButtonStyles,
  heroSecondaryButtonStyles,
  homeFeatureGridStyles,
  homeSectionCardStyles,
} from './homeUiStyles'

const featureItems: CwFeatureCardItem[] = [
  {
    key: 'crawler',
    label: '爬虫能力',
    description: '动态网页抓取、数据提取与反爬绕过',
    icon: 'xiazai',
    iconBgColor: 'color-mix(in srgb, var(--brand-color-6) 12%, transparent)',
  },
  {
    key: 'network',
    label: '网络操作',
    description: 'HTTP、WebSocket、代理与 Cookie 管理',
    icon: 'lianjie',
    iconBgColor: 'color-mix(in srgb, var(--success-color-6) 12%, transparent)',
  },
  {
    key: 'mobile',
    label: '移动设备',
    description: 'Android / iOS 自动化与应用控制',
    icon: 'camera-line',
    iconBgColor: 'color-mix(in srgb, var(--warning-color-6) 12%, transparent)',
  },
  {
    key: 'automation',
    label: '自动化工具',
    description: '浏览器、文件、命令与定时任务',
    icon: 'shezhi',
    iconBgColor: 'color-mix(in srgb, var(--purple-color-6) 12%, transparent)',
  },
  {
    key: 'hook',
    label: 'Hook 引擎',
    description: 'Frida 运行时拦截与内存分析',
    icon: 'code',
    iconBgColor: 'color-mix(in srgb, var(--error-color-6) 12%, transparent)',
  },
  {
    key: 'runtime',
    label: '高性能',
    description: 'TypeScript 原生实现，零依赖运行时',
    icon: 'jiazai',
    iconBgColor: 'color-mix(in srgb, var(--brand-color-6) 12%, transparent)',
  },
]

const examples = [
  {
    title: '网页爬虫',
    code: `crawler.visit("https://example.com");
crawler.extract(".title", "text");
crawler.save("data.json");`,
  },
  {
    title: '网络请求',
    code: `network.get("https://api.example.com/data");
network.post("https://api.example.com/submit", {"key": "value"});`,
  },
  {
    title: '设备控制',
    code: `device.connect("android://192.168.1.100");
device.tap(500, 1000);
device.swipe(300, 500, 300, 1000);`,
  },
]

function navigate(path: string) {
  window.location.href = withBase(path)
}
</script>

<template>
  <div class="zcw-lang-home mx-auto w-full max-w-[72rem] px-4 pb-16 pt-2 md:px-6">
    <!-- Hero -->
    <section
      class="relative overflow-hidden rounded-2xl border border-[var(--component-border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-color-6)_14%,var(--bg-color-container))_0%,var(--bg-color-container)_55%,color-mix(in_srgb,var(--purple-color-6)_8%,var(--bg-color-container))_100%)] px-6 py-12 md:px-10 md:py-16"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--brand-color-6)_18%,transparent)] blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--purple-color-6)_14%,transparent)] blur-3xl"
      />

      <div class="relative flex flex-col gap-6 md:gap-8">
        <div
          class="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--component-border)] bg-[var(--bg-color-container)] px-3 py-1.5 text-sm text-[var(--text-color-secondary)]"
        >
          <CwIcon name="yuyan" prefix="icon" :styles="{ root: 'text-[var(--brand-color-6)]', size: 1 }" />
          <span>现代化脚本语言 · 后缀 <code class="text-[var(--brand-color-6)]">.zcw</code></span>
        </div>

        <div class="space-y-4">
          <h1 class="text-4xl font-bold tracking-tight text-[var(--text-color-primary)] md:text-5xl">
            ZCW 语言
          </h1>
          <p class="max-w-2xl text-lg leading-relaxed text-[var(--text-color-secondary)] md:text-xl">
            专为自动化、爬虫、网络操作和移动设备控制而设计。一门语言，覆盖从数据采集到动态分析的全链路能力。
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <CwButton
            type="primary"
            variant="solid"
            :styles="heroPrimaryButtonStyles"
            @click="navigate('/guide/getting-started')"
          >
            快速开始
          </CwButton>
          <CwButton
            type="default"
            variant="outline"
            :styles="heroSecondaryButtonStyles"
            @click="navigate('/playground')"
          >
            在线体验
          </CwButton>
          <CwButton
            type="default"
            variant="link"
            :styles="heroSecondaryButtonStyles"
            @click="navigate('/api/core')"
          >
            查看 API
          </CwButton>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mt-10">
      <CwFeatureCardGrid
        title="核心能力"
        :items="featureItems"
        :columns="3"
        layout="fixed"
        :styles="homeFeatureGridStyles"
      />
    </section>

    <!-- Examples -->
    <section class="mt-10 space-y-4">
      <div>
        <h2 class="text-2xl font-semibold text-[var(--text-color-primary)]">快速示例</h2>
        <p class="mt-1 text-sm text-[var(--text-color-secondary)]">
          简洁语法完成复杂自动化任务，在 Playground 中可即时运行。
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <CwCard
          v-for="item in examples"
          :key="item.title"
          :styles="homeSectionCardStyles"
        >
          <template #headerLeft>
            <span class="text-sm font-semibold text-[var(--text-color-primary)]">{{ item.title }}</span>
          </template>
          <pre class="overflow-x-auto rounded-lg bg-[var(--bg-color-secondarycontainer)] p-3 text-xs leading-relaxed text-[var(--text-color-primary)]"><code>{{ item.code }}</code></pre>
        </CwCard>
      </div>
    </section>

    <!-- Install -->
    <section class="mt-10">
      <CwCard :styles="homeSectionCardStyles">
        <template #headerLeft>
          <span class="text-sm font-semibold text-[var(--text-color-primary)]">安装与运行</span>
        </template>

        <div class="space-y-4">
          <pre class="overflow-x-auto rounded-lg bg-[var(--bg-color-secondarycontainer)] p-4 text-sm leading-relaxed text-[var(--text-color-primary)]"><code>pnpm add zcw-lang
zcw example.zcw</code></pre>

          <div class="flex flex-wrap gap-3">
            <CwButton
              type="primary"
              variant="solid"
              :styles="heroPrimaryButtonStyles"
              @click="navigate('/guide/getting-started')"
            >
              阅读完整文档
            </CwButton>
            <CwButton
              type="default"
              variant="outline"
              :styles="heroSecondaryButtonStyles"
              @click="navigate('/examples')"
            >
              更多示例
            </CwButton>
          </div>
        </div>
      </CwCard>
    </section>
  </div>
</template>
