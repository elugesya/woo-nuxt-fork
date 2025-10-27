<script setup lang="ts">
import { cn } from '@/lib/utils'

interface DropdownMenuShortcutProps {
  class?: string
}

const props = defineProps<DropdownMenuShortcutProps>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest opacity-60', props.class)">
    <slot />
  </span>
</template>
