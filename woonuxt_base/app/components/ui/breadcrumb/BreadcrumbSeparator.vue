<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface BreadcrumbSeparatorProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<BreadcrumbSeparatorProps>()
</script>

<template>
  <li role="presentation" aria-hidden="true" :class="cn('[&>svg]:size-3.5', props.class)">
    <slot>
      <Icon icon="lucide:chevron-right" />
    </slot>
  </li>
</template>
