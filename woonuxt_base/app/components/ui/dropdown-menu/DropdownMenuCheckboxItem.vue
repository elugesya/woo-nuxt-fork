<script setup lang="ts">
import { DropdownMenuCheckboxItem, type DropdownMenuCheckboxItemEmits, type DropdownMenuCheckboxItemProps } from 'radix-vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuCheckboxItemProps & { class?: string }>()
const emits = defineEmits<DropdownMenuCheckboxItemEmits>()
</script>

<template>
  <DropdownMenuCheckboxItem
    v-bind="props"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class
    )"
    @update:checked="emits('update:checked', $event)"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <Icon icon="lucide:check" class="h-4 w-4" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>

<script lang="ts">
import { DropdownMenuItemIndicator } from 'radix-vue'
</script>
