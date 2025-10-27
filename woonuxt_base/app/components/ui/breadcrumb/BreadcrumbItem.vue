<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface BreadcrumbItemProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<BreadcrumbItemProps>()
</script>

<template>
  <li :class="cn('inline-flex items-center gap-1.5', props.class)">
    <slot />
  </li>
</template>
