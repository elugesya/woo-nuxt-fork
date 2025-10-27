<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

interface BreadcrumbProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<BreadcrumbProps>()
</script>

<template>
  <nav :aria-label="props['aria-label'] || 'breadcrumb'" :class="cn('relative', props.class)">
    <slot />
  </nav>
</template>
