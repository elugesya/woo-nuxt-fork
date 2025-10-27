<script setup lang="ts">
import { CollapsibleContent, type CollapsibleContentProps } from 'radix-vue'

defineProps<CollapsibleContentProps>()
</script>

<template>
  <CollapsibleContent v-bind="$props">
    <slot />
  </CollapsibleContent>
</template>
