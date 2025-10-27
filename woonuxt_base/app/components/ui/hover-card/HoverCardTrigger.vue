<script setup lang="ts">
import { HoverCardTrigger, type HoverCardTriggerProps } from 'radix-vue'

defineProps<HoverCardTriggerProps>()
</script>

<template>
  <HoverCardTrigger v-bind="$props">
    <slot />
  </HoverCardTrigger>
</template>
