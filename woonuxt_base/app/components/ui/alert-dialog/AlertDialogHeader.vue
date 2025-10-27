<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface AlertDialogHeaderProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<AlertDialogHeaderProps>()
</script>

<template>
  <div :class="cn('flex flex-col space-y-2 text-center sm:text-left', props.class)">
    <slot />
  </div>
</template>
