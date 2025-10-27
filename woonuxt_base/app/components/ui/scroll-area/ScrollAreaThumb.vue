<script setup lang="ts">
import { ScrollAreaThumb, type ScrollAreaThumbProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaThumbProps & { class?: string }>()
</script>

<template>
  <ScrollAreaThumb :class="cn('relative flex-1 rounded-full bg-border', props.class)" />
</template>
