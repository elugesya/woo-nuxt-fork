<script setup lang="ts">
/**
 * 🌊 StarRatingBasic - StackZero Component (Marine Themed)
 *
 * Interactive star rating component.
 * Source: StackZero MCP - star-rating-basic
 */
import { cn } from '@/lib/utils';
import { Star } from 'lucide-vue-next';

interface StarRatingBasicProps {
  value: number;
  maxStars?: number;
  iconSize?: number;
  readOnly?: boolean;
  color?: string;
  class?: string;
}

const props = withDefaults(defineProps<StarRatingBasicProps>(), {
  maxStars: 5,
  iconSize: 20,
  readOnly: false,
  color: '#F59E0B', // Amber for stars
});

const emit = defineEmits<{
  (e: 'update:value', value: number): void;
}>();

const hoverRating = ref<number | null>(null);

const handleStarClick = (index: number) => {
  if (props.readOnly) return;
  emit('update:value', index + 1);
};

const handleStarHover = (index: number) => {
  if (!props.readOnly) {
    hoverRating.value = index + 1;
  }
};

const handleMouseLeave = () => {
  if (!props.readOnly) {
    hoverRating.value = null;
  }
};

const getStarStyle = (index: number) => {
  const ratingToUse = !props.readOnly && hoverRating.value !== null ? hoverRating.value : props.value;
  const isActive = ratingToUse > index;

  return {
    color: isActive ? props.color : '#D1D5DB', // Gray for inactive
    fill: isActive ? props.color : 'transparent',
  };
};
</script>

<template>
  <div
    :class="cn('flex items-center gap-0.5', props.class)"
    @mouseleave="handleMouseLeave"
  >
    <Star
      v-for="index in maxStars"
      :key="index"
      :size="iconSize"
      :style="getStarStyle(index - 1)"
      :class="cn(
        'transition-all duration-200',
        !readOnly && 'cursor-pointer hover:scale-110'
      )"
      @click="handleStarClick(index - 1)"
      @mouseenter="handleStarHover(index - 1)"
    />
  </div>
</template>
