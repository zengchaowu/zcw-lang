import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Playground from '../components/Playground.vue'
import './custom.css'
import 'zcw-vue-ui/dist/tailwind.css'
import 'zcw-vue-ui/dist/tokens.css'
import 'zcw-vue-ui/dist/iconfont.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Playground', Playground)
  },
} satisfies Theme
