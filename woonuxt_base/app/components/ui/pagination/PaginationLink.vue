<script setup lang="ts">
import { type Component } from 'vue'
import { type ButtonProps, Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationLinkProps extends ButtonProps {
  isActive?: boolean
  component?: string | Component
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
