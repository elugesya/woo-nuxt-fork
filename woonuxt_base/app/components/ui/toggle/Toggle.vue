<script setup lang="ts">
import { ToggleRoot, type ToggleRootEmits, type ToggleRootProps } from 'radix-vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
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

type ToggleVariants = VariantProps<typeof toggleVariants>

interface ToggleProps extends ToggleRootProps {
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
  class?: string
}

const props = withDefaults(defineProps<ToggleProps>(), {
  variant: 'default',
  size: 'default',
})

const emits = defineEmits<ToggleRootEmits>()
</script>

<template>
  <ToggleRoot
    v-bind="props"
    :class="cn(toggleVariants({ variant: props.variant, size: props.size }), props.class)"
    @update:pressed="emits('update:pressed', $event)"
  >
    <slot />
  </ToggleRoot>
</template>
