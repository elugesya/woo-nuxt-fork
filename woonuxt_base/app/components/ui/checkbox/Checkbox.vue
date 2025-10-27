<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot, type CheckboxRootEmits, type CheckboxRootProps } from 'radix-vue'
import { Icon } from '#components'
import { cn } from '@/lib/utils'

const props = defineProps<CheckboxRootProps & { class?: string }>()
const emits = defineEmits<CheckboxRootEmits>()
</script>

<template>
  <CheckboxRoot
    v-bind="props"
    :class="cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      props.class
    )"
    @update:checked="(v) => emits('update:checked', v)"
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current">
      <Icon name="radix-icons:check" class="h-4 w-4" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
