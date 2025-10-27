<script setup lang="ts">
import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'radix-vue'

defineProps<AlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTrigger v-bind="$props">
    <slot />
  </AlertDialogTrigger>
</template>
