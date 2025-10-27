<script setup lang="ts">
import { AccordionRoot, type AccordionRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionRootProps & { class?: string }>()
</script>

<template>
  <AccordionRoot v-bind="props" :class="cn('w-full', props.class)">
    <slot />
  </AccordionRoot>
</template>
