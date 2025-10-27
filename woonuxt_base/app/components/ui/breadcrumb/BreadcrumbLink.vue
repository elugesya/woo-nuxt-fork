<script setup lang="ts">
import { cn } from '@/lib/utils'

interface BreadcrumbLinkProps {
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
