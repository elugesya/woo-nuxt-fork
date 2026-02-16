<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  attributes: any[];
  defaultAttributes?: { nodes: VariationAttribute[] } | null;
}

const { attributes, defaultAttributes } = defineProps<Props>();
const emit = defineEmits(['attrs-changed']);

const activeVariations = ref<VariationAttribute[]>([]);

const getSelectedName = (attr: any, activeVariation?: VariationAttribute) => {
  if (attr?.terms?.nodes && activeVariation) {
    return attr.terms.nodes.find((node: { slug: string }) => node.slug === activeVariation.value)?.name;
  }

  return activeVariation?.value || '';
};

const updateAttrs = () => {
  const selectedVariations = attributes.map((row): VariationAttribute => {
    const radioValue = document.querySelector(`.name-${row.name.toLowerCase()}:checked`) as HTMLInputElement;
    const dropdownValue = document.querySelector(`#${row.name}`) as HTMLSelectElement;
    const name = row.name.charAt(0).toLowerCase() + row.name.slice(1);
    const value = radioValue?.value ?? dropdownValue?.value ?? '';
    return { name, value };
  });
};

const setDefaultAttributes = () => {
  if (defaultAttributes?.nodes) {
    defaultAttributes?.nodes.forEach((attr: VariationAttribute) => {
      const radio = document.querySelector(`.name-${attr.name?.toLowerCase()}[value="${attr.value}"]`) as HTMLInputElement;
      if (radio) radio.checked = true;
    });
  }
};

const className = (name: string) => `name-${name.toLowerCase()}`;

onMounted(() => {
  setDefaultAttributes();
  updateAttrs();
});
</script>

<template>
  <div class="flex flex-col gap-4" v-if="attributes">
    <div v-for="(attr, i) in attributes" :key="i" class="space-y-3">
      <!-- LOCAL -->
      <div v-if="attr.scope == 'LOCAL'" class="space-y-2">
        <Label class="text-sm font-medium">
          {{ attr.label }}
          <span v-if="activeVariations.length && activeVariations[i]" class="text-muted-foreground font-normal">: {{ getSelectedName(attr, activeVariations[i]) }}</span>
        </Label>
        <div class="flex flex-wrap gap-2">
          <span v-for="(option, index) in attr.options" :key="index">
            <label :for="`${option}_${index}`">
              <input
                :id="`${option}_${index}`"
                :ref="attr.name"
                class="peer sr-only"
                :checked="index == 0"
                type="radio"
                :class="`name-${attr.name.toLowerCase()}`"
                :name="attr.name"
                :value="option"
                @change="updateAttrs" />
              <span 
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border-2 rounded-lg cursor-pointer transition-all hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground"
                :title="`${attr.name}: ${option}`">
                {{ option }}
              </span>
            </label>
          </span>
        </div>
      </div>

      <!-- COLOR SWATCHES -->
      <div v-else-if="attr.name == 'pa_color' || attr.name == 'color'" class="space-y-2">
        <Label class="text-sm font-medium">
          {{ $t('general.color') }}
          <span v-if="activeVariations.length" class="text-muted-foreground font-normal">: {{ getSelectedName(attr, activeVariations[i]) }}</span>
        </Label>
        <div class="flex flex-wrap gap-2">
          <span v-for="(term, termIndex) in attr.terms.nodes" :key="termIndex">
            <Tooltip :text="term.name">
              <label :for="`${term.slug}_${termIndex}`">
                <input
                  :id="`${term.slug}_${termIndex}`"
                  :ref="attr.name"
                  class="peer sr-only"
                  :checked="termIndex == 0"
                  type="radio"
                  :class="className(attr.name)"
                  :name="attr.name"
                  :value="term.slug"
                  @change="updateAttrs" />
                <span 
                  class="block w-10 h-10 border-2 border-border rounded-full cursor-pointer transition-all hover:scale-110 hover:border-primary peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2"
                  :class="`color-${term.slug}`" 
                  :title="`${attr.name}: ${term.name}`">
                </span>
              </label>
            </Tooltip>
          </span>
        </div>
      </div>

      <!-- DROPDOWN -->
      <div v-else-if="attr.terms.nodes && attr.terms.nodes?.length > 8" class="space-y-2">
        <Label class="text-sm font-medium">
          {{ attr.label }} 
          <span v-if="activeVariations.length" class="text-muted-foreground font-normal">: {{ getSelectedName(attr, activeVariations[i]) }}</span>
        </Label>
        <select 
          :id="attr.name" 
          :ref="attr.name" 
          :name="attr.name" 
          required 
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
          @change="updateAttrs">
          <option disabled hidden>{{ $t('general.choose') }} {{ decodeURIComponent(attr.label) }}</option>
          <option v-for="(term, dropdownIndex) in attr.terms.nodes" :key="dropdownIndex" :value="term.slug" v-html="term.name" :selected="dropdownIndex == 0" />
        </select>
      </div>

      <!-- CHECKBOXES -->
      <div v-else class="space-y-2">
        <Label class="text-sm font-medium">
          {{ attr.label }} 
          <span v-if="activeVariations.length" class="text-muted-foreground font-normal">: {{ getSelectedName(attr, activeVariations[i]) }}</span>
        </Label>
        <div class="flex flex-wrap gap-2">
          <span v-for="(term, index) in attr.terms.nodes" :key="index">
            <label :for="`${term.slug}_${index}`">
              <input
                :id="`${term.slug}_${index}`"
                :ref="attr.name"
                class="peer sr-only"
                :checked="index == 0"
                type="radio"
                :class="className(attr.name)"
                :name="attr.name"
                :value="term.slug"
                @change="updateAttrs" />
              <span 
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border-2 rounded-lg cursor-pointer transition-all hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground"
                :title="`${attr.name}: ${term.slug}`">
                {{ term.name }}
              </span>
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import "tailwindcss";
@import "../../assets/css/theme.css";
.color-green {
  @apply bg-green-500;
}
.color-blue {
  @apply bg-blue-500;
}
.color-red {
  @apply bg-red-500;
}
.color-yellow {
  @apply bg-yellow-500;
}
.color-orange {
  @apply bg-orange-500;
}
.color-purple {
  @apply bg-purple-500;
}
.color-black {
  @apply bg-background;
}
.color-white {
  @apply bg-background border-2 border;
}
.color-pink {
  @apply bg-pink-500;
}
.color-gray,
.color-grey {
  @apply bg-muted;
}
.color-brown {
  @apply bg-amber-700;
}
</style>
