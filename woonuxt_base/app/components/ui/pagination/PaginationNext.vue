<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { type Component } from 'vue'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationNextProps {
  component?: string | Component
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  class?: string
}

const props = withDefaults(defineProps<PaginationNextProps>(), {
  variant: 'ghost',
  component: 'button',
})
</script>

<template>
  <component
    :is="props.component"
    aria-label="Go to next page"
    :class="cn(
      buttonVariants({
        variant: props.variant,
        size: props.size,
      }),
      props.class
    )"
  >
    <slot>
      <span>Next</span>
      <Icon icon="lucide:chevron-right" class="h-4 w-4" />
    </slot>
  </component>
</template>

<script lang="ts">
import { buttonVariants } from '@/components/ui/button'
</script>
