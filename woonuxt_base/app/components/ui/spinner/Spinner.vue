<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-12 w-12 border-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type SpinnerVariants = VariantProps<typeof spinnerVariants>

interface SpinnerProps extends HTMLAttributes {
  size?: SpinnerVariants['size']
  class?: string
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'default',
})

const spinnerClass = computed(() => cn(spinnerVariants({ size: props.size }), props.class))
</script>

<template>
  <div :class="spinnerClass" role="status" aria-label="Loading">
    <span class="sr-only">Loading...</span>
  </div>
</template>
