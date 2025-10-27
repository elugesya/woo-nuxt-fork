<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, type SliderRootEmits, type SliderRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SliderRootProps & { class?: string }>()
const emits = defineEmits<SliderRootEmits>()
</script>

<template>
  <SliderRoot
    :class="cn('relative flex w-full touch-none select-none items-center', props.class)"
    v-bind="props"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in props.modelValue"
      :key="key"
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>
