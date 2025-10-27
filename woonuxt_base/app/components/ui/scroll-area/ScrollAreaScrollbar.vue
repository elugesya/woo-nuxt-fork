<script setup lang="ts">
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ScrollAreaScrollbarProps & { class?: string }>(),
  {
    orientation: 'vertical',
  },
)
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="props"
    :class="cn(
      'flex touch-none select-none transition-colors',
      props.orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      props.orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      props.class
    )"
  >
    <slot />
  </ScrollAreaScrollbar>
</template>
