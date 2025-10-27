<script setup lang="ts">
import { cn } from '@/lib/utils'

interface BreadcrumbPageProps {
  class?: string
}

const props = defineProps<BreadcrumbPageProps>()
</script>

<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="cn('font-normal text-foreground', props.class)"
  >
    <slot />
  </span>
</template>
