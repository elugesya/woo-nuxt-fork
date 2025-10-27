<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<DialogCloseProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogClose v-bind="delegatedProps">
    <slot />
  </DialogClose>
</template>
