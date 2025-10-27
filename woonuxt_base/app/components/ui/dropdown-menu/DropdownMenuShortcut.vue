<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface DropdownMenuShortcutProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<DropdownMenuShortcutProps>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest opacity-60', props.class)">
    <slot />
  </span>
</template>
