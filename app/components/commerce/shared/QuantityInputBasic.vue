<script setup lang="ts">
/**
 * 🌊 QuantityInputBasic - StackZero Component (Marine Themed)
 *
 * A simple quantity selector with +/- buttons.
 * Source: StackZero MCP - quantity-input-basic
 */
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-vue-next';

interface QuantityInputBasicProps {
  quantity: number;
  min?: number;
  max?: number | null;
  step?: number;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<QuantityInputBasicProps>(), {
  min: 1,
  max: null,
  step: 1,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void;
}>();

const inputValue = ref(props.quantity.toString());

// Sync input with prop changes
watch(() => props.quantity, (newVal) => {
  inputValue.value = newVal.toString();
});

const handleDecrease = () => {
  if (props.quantity - props.step >= props.min) {
    emit('update:quantity', props.quantity - props.step);
  }
};

const handleIncrease = () => {
  if (props.max === null || props.quantity + props.step <= props.max) {
    emit('update:quantity', props.quantity + props.step);
  }
};

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  inputValue.value = target.value;

  const value = parseInt(target.value);
  if (!isNaN(value) && value >= props.min && (props.max === null || value <= props.max)) {
    emit('update:quantity', value);
  }
};

const handleBlur = () => {
  const value = parseInt(inputValue.value);
  if (isNaN(value) || value < props.min) {
    inputValue.value = props.min.toString();
    emit('update:quantity', props.min);
  } else if (props.max !== null && value > props.max) {
    inputValue.value = props.max.toString();
    emit('update:quantity', props.max);
  } else {
    inputValue.value = value.toString();
    emit('update:quantity', value);
  }
};
</script>

<template>
  <div
    :class="cn(
      'inline-flex items-center rounded-lg border border-border bg-white shadow-sm',
      'dark:bg-gray-800 dark:border-gray-700',
      disabled && 'opacity-50 cursor-not-allowed',
      props.class
    )"
  >
    <!-- Decrease Button -->
    <button
      type="button"
      :class="cn(
        'flex items-center justify-center w-10 h-10 rounded-l-lg',
        'border-r border-border hover:bg-seafoam transition-colors',
        'dark:border-gray-700 dark:hover:bg-gray-700',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )"
      :disabled="disabled || quantity <= min"
      @click="handleDecrease"
      aria-label="Azalt"
    >
      <Minus class="w-4 h-4 text-primary dark:text-white" />
    </button>

    <!-- Input Field -->
    <input
      type="text"
      :value="inputValue"
      :disabled="disabled"
      :class="cn(
        'w-12 h-10 text-center font-mono text-primary',
        'bg-transparent border-none outline-none',
        'dark:text-white'
      )"
      :min="min"
      :max="max ?? undefined"
      @input="handleInputChange"
      @blur="handleBlur"
      aria-label="Miktar"
    />

    <!-- Increase Button -->
    <button
      type="button"
      :class="cn(
        'flex items-center justify-center w-10 h-10 rounded-r-lg',
        'border-l border-border hover:bg-seafoam transition-colors',
        'dark:border-gray-700 dark:hover:bg-gray-700',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )"
      :disabled="disabled || (max !== null && quantity >= max)"
      @click="handleIncrease"
      aria-label="Artır"
    >
      <Plus class="w-4 h-4 text-primary dark:text-white" />
    </button>
  </div>
</template>
