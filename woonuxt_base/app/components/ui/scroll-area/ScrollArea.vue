<script setup lang="ts">
import { ScrollAreaRoot, type ScrollAreaRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaRootProps & { class?: string }>()
</script>

<template>
  <ScrollAreaRoot v-bind="props" :class="cn('relative overflow-hidden', props.class)">
    <slot />
  </ScrollAreaRoot>
</template>
