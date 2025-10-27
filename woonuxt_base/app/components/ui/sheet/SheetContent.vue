<script setup lang="ts">
import { DialogClose, DialogContent, type DialogContentProps, DialogOverlay, DialogPortal } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { Icon } from '#components'
import { sheetVariants, type SheetVariants } from '.'
import { cn } from '@/lib/utils'

interface SheetContentProps extends DialogContentProps {
  class?: HTMLAttributes['class']
  side?: SheetVariants['side']
}

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'right',
})

const delegatedProps = computed(() => {
  const { class: _, side: __, ...delegated } = props
  return delegated
})
</script>

<template>
  <DialogPortal>
    <DialogOverlay
  class="fixed inset-0 z-50 bg-muted/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      :class="cn(sheetVariants({ side }), props.class)"
      v-bind="delegatedProps"
    >
      <slot />
      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <Icon name="radix-icons:cross-2" class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
