<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface BreadcrumbLinkProps extends HTMLAttributes {
  class?: string
  asChild?: boolean
}

const props = defineProps<BreadcrumbLinkProps>()
</script>

<template>
  <component
    :is="props.asChild ? 'slot' : 'a'"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </component>
</template>
