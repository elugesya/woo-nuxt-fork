<script setup lang="ts">
import { type Component } from 'vue'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationLinkProps {
  isActive?: boolean
  component?: string | Component
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  class?: string
}

const props = withDefaults(defineProps<PaginationLinkProps>(), {
  variant: 'ghost',
  component: 'button',
})
</script>

<template>
  <component
    :is="props.component"
    :aria-current="props.isActive ? 'page' : undefined"
    :class="cn(
      buttonVariants({
        variant: props.isActive ? 'outline' : 'ghost',
        size: props.size,
      }),
      props.class
    )"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { buttonVariants } from '@/components/ui/button'
</script>
