import type { CwButtonStyles } from 'zcw-vue-ui/CwButton'
import type { CwCardStyles } from 'zcw-vue-ui/CwCard'
import type { CwFeatureCardGridStyles } from 'zcw-vue-ui/CwFeatureCardGrid'

export const heroPrimaryButtonStyles: Partial<CwButtonStyles> = {
  root: '!h-10 !min-h-10 px-5 rounded-lg text-sm font-medium',
  content: 'flex items-center justify-center',
}

export const heroSecondaryButtonStyles: Partial<CwButtonStyles> = {
  root: '!h-10 !min-h-10 px-5 rounded-lg text-sm font-medium',
  content: 'flex items-center justify-center',
}

export const homeFeatureGridStyles: Partial<CwFeatureCardGridStyles> = {
  item: 'flex flex-col items-center justify-start cursor-default select-none rounded-xl px-3 py-4 transition-colors duration-200 hover:bg-[var(--bg-color-component-hover)] min-h-[7.5rem]',
  label: 'mt-2 text-sm font-medium text-[var(--text-color-primary)] text-center w-full',
  description:
    'mt-1 text-xs leading-relaxed text-[var(--text-color-secondary)] text-center w-full whitespace-normal',
  iconBox: 'flex items-center justify-center w-12 h-12 rounded-2xl',
}

export const homeSectionCardStyles: Partial<CwCardStyles> = {
  root: 'w-full bg-[var(--bg-color-container)] border border-[var(--component-border)] rounded-xl overflow-hidden shadow-[var(--shadow-1)]',
  header:
    'flex items-center justify-between px-4 py-3 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--brand-color-6)_6%,transparent)_0%,transparent_100%)]',
  body: 'px-4 pb-4',
}

export const playgroundPrimaryButtonStyles: Partial<CwButtonStyles> = {
  root: '!h-9 !min-h-9 px-4 rounded-md text-sm',
  content: 'flex items-center justify-center gap-1.5',
}

export const playgroundSecondaryButtonStyles: Partial<CwButtonStyles> = {
  root: '!h-9 !min-h-9 px-4 rounded-md text-sm',
  content: 'flex items-center justify-center',
}
