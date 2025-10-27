<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface AlertDialogFooterProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<AlertDialogFooterProps>()
</script>

<template>
  <div :class="cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', props.class)">
    <slot />
  </div>
</template>
