<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-vue-next'

const { getFilter, setFilter, isFiltersActive } = await useFiltering();

const selectedTerms = ref<string>(getFilter('rating')?.[0] || '');
const isOpen = ref(true);

/**
 * @description This watches the isFiltersActive variable and unchecks all radio boxes when filters are cleared.
 * @example If the user clicks the 'clear filters' button, the isFiltersActive variable would change to false.
 */
watch(isFiltersActive, () => {
  if (!isFiltersActive.value) selectedTerms.value = '';
});

/**
 * @param {string} rating - This is a string instead of a number because the setFilter function is used globally and it only accepts strings.
 * @description This sets the filter to the selected rating.
 */
const radioChanged = (rating: string): void => {
  setFilter('rating', rating ? [rating] : []);
};
</script>

<template>
  <div>
    <button 
      class="flex w-full cursor-pointer items-center justify-between py-4 font-medium transition-all hover:text-primary"
      @click="isOpen = !isOpen">
      <span>{{ $t('shop.rating') }}</span>
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" />
    </button>
    <div v-show="isOpen" class="pb-4">
      <RadioGroup v-model="selectedTerms" class="space-y-3" @update:model-value="radioChanged">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="star-five" value="5" />
          <Label for="star-five" class="flex items-center cursor-pointer">
            <StarRating :rating="5" :size="16" />
          </Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="star-four" value="4" />
          <Label for="star-four" class="flex items-center cursor-pointer">
            <StarRating :rating="4" :size="16" />
            <span class="ml-1 text-xs text-muted-foreground">& {{ $t('general.up') }}</span>
          </Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="star-three" value="3" />
          <Label for="star-three" class="flex items-center cursor-pointer">
            <StarRating :rating="3" :size="16" />
            <span class="ml-1 text-xs text-muted-foreground">& {{ $t('general.up') }}</span>
          </Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="star-two" value="2" />
          <Label for="star-two" class="flex items-center cursor-pointer">
            <StarRating :rating="2" :size="16" />
            <span class="ml-1 text-xs text-muted-foreground">& {{ $t('general.up') }}</span>
          </Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="star-one" value="1" />
          <Label for="star-one" class="flex items-center cursor-pointer">
            <StarRating :rating="1" :size="16" />
            <span class="ml-1 text-xs text-muted-foreground">& {{ $t('general.up') }}</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>
