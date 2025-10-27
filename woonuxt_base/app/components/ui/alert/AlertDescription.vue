<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface AlertDescriptionProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<AlertDescriptionProps>()
</script>

<template>
  <div :class="cn('text-sm [&_p]:leading-relaxed', props.class)">
    <slot />
  </div>
</template>
