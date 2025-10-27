<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { type Component } from 'vue'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationPrevProps {
  component?: string | Component
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  class?: string
}

const props = withDefaults(defineProps<PaginationPrevProps>(), {
  variant: 'ghost',
  component: 'button',
})
</script>

<template>
  <component
    :is="props.component"
    aria-label="Go to previous page"
    :class="cn(
      buttonVariants({
        variant: props.variant,
        size: props.size,
      }),
      props.class
    )"
  >
    <slot>
      <Icon icon="lucide:chevron-left" class="h-4 w-4" />
      <span>Previous</span>
    </slot>
  </component>
</template>

<script lang="ts">
import { buttonVariants } from '@/components/ui/button'
</script>
