<script setup lang="ts">
import { ScrollAreaViewport, type ScrollAreaViewportProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaViewportProps & { class?: string }>()
</script>

<template>
  <ScrollAreaViewport :class="cn('h-full w-full rounded-[inherit]', props.class)">
    <slot />
  </ScrollAreaViewport>
</template>
