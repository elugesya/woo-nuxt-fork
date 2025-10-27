<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface BreadcrumbListProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<BreadcrumbListProps>()
</script>

<template>
  <ol :class="cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', props.class)">
    <slot />
  </ol>
</template>
