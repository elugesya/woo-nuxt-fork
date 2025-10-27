<script setup lang="ts">
import { PopoverRoot, type PopoverRootEmits, type PopoverRootProps } from 'radix-vue'

const props = defineProps<PopoverRootProps>()
const emits = defineEmits<PopoverRootEmits>()
</script>

<template>
  <PopoverRoot v-bind="props" @update:open="emits('update:open', $event)">
    <slot />
  </PopoverRoot>
</template>
