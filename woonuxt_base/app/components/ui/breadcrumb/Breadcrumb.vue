<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

interface BreadcrumbProps {
  class?: string
}

const props = defineProps<BreadcrumbProps>()
</script>

<template>
  <nav :aria-label="props['aria-label'] || 'breadcrumb'" :class="cn('relative', props.class)">
    <slot />
  </nav>
</template>
