<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps } from 'radix-vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleGroupVariants = cva(
  'flex items-center justify-center gap-1',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>

interface ToggleGroupProps extends ToggleGroupRootProps {
  variant?: ToggleGroupVariants['variant']
  class?: string
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  variant: 'default',
})

const emits = defineEmits<ToggleGroupRootEmits>()
</script>

<template>
  <ToggleGroupRoot
    v-bind="props"
    :class="cn(toggleGroupVariants({ variant: props.variant }), props.class)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </ToggleGroupRoot>
</template>
