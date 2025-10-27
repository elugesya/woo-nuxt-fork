<script setup lang="ts">
import { SelectTrigger, type SelectTriggerProps } from 'radix-vue'
import { Icon } from '#components'
import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps & { class?: string }>()
</script>

<template>
  <SelectTrigger
    v-bind="props"
    :class="cn(
      'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      props.class
    )"
  >
    <slot />
    <Icon name="radix-icons:chevron-down" class="h-4 w-4 opacity-50" />
  </SelectTrigger>
</template>
