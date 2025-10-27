<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface PaginationEllipsisProps extends HTMLAttributes {
  class?: string
}

const props = defineProps<PaginationEllipsisProps>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('flex h-9 w-9 items-center justify-center', props.class)"
  >
    <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
    <span class="sr-only">More pages</span>
  </span>
</template>
