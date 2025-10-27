<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TooltipProps {
  text: string
}

defineProps<TooltipProps>()
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ text }}</p>
    </TooltipContent>
  </Tooltip>
</template>
