<script setup lang="ts">
import { HoverCardRoot, type HoverCardRootEmits, type HoverCardRootProps } from 'radix-vue'

const props = defineProps<HoverCardRootProps>()
const emits = defineEmits<HoverCardRootEmits>()
</script>

<template>
  <HoverCardRoot v-bind="props" @update:open="emits('update:open', $event)">
    <slot />
  </HoverCardRoot>
</template>
