<script setup lang="ts">
import { DropdownMenuRadioItem, type DropdownMenuRadioItemProps } from 'radix-vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuRadioItemProps & { class?: string }>()
</script>

<template>
  <DropdownMenuRadioItem
    v-bind="props"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class
    )"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <Icon icon="lucide:circle" class="h-2 w-2 fill-current" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuRadioItem>
</template>

<script lang="ts">
import { DropdownMenuItemIndicator } from 'radix-vue'
</script>
