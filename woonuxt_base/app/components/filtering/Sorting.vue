<script setup lang="ts">
import { Select, SelectItem } from '@/components/ui/select'
import { ref } from 'vue'

const sortOptions = [
  { value: 'latest', label: 'En Yeni' },
  { value: 'price-asc', label: 'Fiyat: Artan' },
  { value: 'price-desc', label: 'Fiyat: Azalan' },
  { value: 'alphabetically', label: 'Alfabetik' },
]

const selected = ref(sortOptions[0].value)

const setSorting = (value: string) => {
  selected.value = value
  // TODO: setFilter('sort', value) gibi bir fonksiyon ile filtreyi güncelle
}
</script>

<template>
  <div class="w-full">
    <Select v-model="selected" @update:model-value="setSorting" class="w-full bg-background text-foreground border border-border rounded-md">
      <SelectItem v-for="option in sortOptions" :key="option.value" :value="option.value" class="bg-background text-foreground">
        {{ option.label }}
      </SelectItem>
    </Select>
  </div>
</template>
