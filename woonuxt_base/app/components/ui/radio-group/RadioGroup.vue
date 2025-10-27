<script setup lang="ts">
import { RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<RadioGroupRootProps & { class?: string }>()
const emits = defineEmits<RadioGroupRootEmits>()
</script>

<template>
  <RadioGroupRoot
    v-bind="props"
    :class="cn('grid gap-2', props.class)"
    @update:model-value="(v) => emits('update:modelValue', v)"
  >
    <slot />
  </RadioGroupRoot>
</template>
