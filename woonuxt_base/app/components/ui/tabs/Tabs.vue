<script setup lang="ts">
import { TabsRoot, type TabsRootEmits, type TabsRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends TabsRootProps {
  class?: string
}

const props = defineProps<Props>()
const emits = defineEmits<TabsRootEmits>()
</script>

<template>
  <TabsRoot
    v-bind="props"
    :class="cn('w-full', props.class)"
    @update:model-value="(v) => emits('update:modelValue', v)"
  >
    <slot />
  </TabsRoot>
</template>
