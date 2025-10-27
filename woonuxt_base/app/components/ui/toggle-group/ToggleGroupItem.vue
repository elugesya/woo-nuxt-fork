<script setup lang="ts">
import { ToggleGroupItem, type ToggleGroupItemProps } from 'radix-vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>

interface ToggleGroupItemPropsExtended extends ToggleGroupItemProps {
  variant?: ToggleGroupItemVariants['variant']
  size?: ToggleGroupItemVariants['size']
  class?: string
}

const props = withDefaults(defineProps<ToggleGroupItemPropsExtended>(), {
  variant: 'default',
  size: 'default',
})
</script>

<template>
  <ToggleGroupItem
    v-bind="props"
    :class="cn(toggleGroupItemVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </ToggleGroupItem>
</template>
