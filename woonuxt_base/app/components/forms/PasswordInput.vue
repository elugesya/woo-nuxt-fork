<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'

const showPassword = ref(false)

interface PasswordInputProps {
  modelValue: string
  className?: string
  placeholder?: string
  autocomplete?: string
  required?: boolean
}

const props = withDefaults(defineProps<PasswordInputProps>(), {
  className: '',
  placeholder: '',
  autocomplete: 'new-password',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative flex items-center w-full">
    <Input
      :type="showPassword ? 'text' : 'password'"
      :model-value="modelValue"
      @input="handleInputChanged"
      :class="className"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
    />
    <button
      type="button"
      class="absolute right-3 cursor-pointer hover:text-foreground/80 transition-colors"
      @click="showPassword = !showPassword"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    >
      <Icon v-if="showPassword" icon="lucide:eye" class="h-5 w-5" />
      <Icon v-else icon="lucide:eye-off" class="h-5 w-5" />
    </button>
  </div>
</template>
