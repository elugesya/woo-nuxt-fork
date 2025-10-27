<script setup lang="ts">
import { TooltipProvider, TooltipRoot, type TooltipRootProps } from 'radix-vue'

const props = defineProps<TooltipRootProps>()
</script>

<template>
  <TooltipProvider>
    <TooltipRoot v-bind="props">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
