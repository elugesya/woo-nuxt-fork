<script setup lang="ts">
import { AlertDialogRoot, type AlertDialogRootEmits, type AlertDialogRootProps } from 'radix-vue'

defineProps<AlertDialogRootProps>()
const emit = defineEmits<AlertDialogRootEmits>()
</script>

<template>
  <AlertDialogRoot v-bind="$props" @update:open="emit('update:open', $event)">
    <slot />
  </AlertDialogRoot>
</template>
