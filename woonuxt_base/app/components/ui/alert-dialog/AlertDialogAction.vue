<script setup lang="ts">
import { AlertDialogAction, type AlertDialogActionProps } from 'radix-vue'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogActionProps & { class?: string }>()
</script>

<template>
  <AlertDialogAction :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
