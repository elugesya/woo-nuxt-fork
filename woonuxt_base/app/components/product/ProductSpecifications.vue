<script setup lang="ts">
import type { PropType } from 'vue';

export interface SpecGroup {
  title: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

const props = defineProps({
  specifications: {
    type: Array as PropType<SpecGroup[]>,
    default: () => [],
  },
  productName: {
    type: String,
    default: '',
  },
});

// Generate JSON-LD for specifications table
const specsSchema = computed(() => {
  if (!props.specifications?.length) return null;

  const tableRows = props.specifications.flatMap((group) =>
    group.specs.map((spec) => ({
      '@type': 'TableRow',
      cells: [
        { '@type': 'TableCell', text: spec.label },
        { '@type': 'TableCell', text: spec.value },
      ],
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Table',
    about: {
      '@type': 'Product',
      name: props.productName,
    },
    row: tableRows,
  };
});

useHead(() => ({
  script: specsSchema.value
    ? [
        {
          key: 'product-specs-jsonld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(specsSchema.value),
        },
      ]
    : [],
}));
</script>

<template>
  <div v-if="specifications && specifications.length > 0" class="product-specifications">
    <h3 class="text-lg font-semibold mb-4">Teknik Özellikler</h3>
    <div v-for="(group, index) in specifications" :key="index" class="spec-group mb-6">
      <h4 v-if="group.title" class="text-md font-medium mb-2 text-gray-700">{{ group.title }}</h4>
      <table class="w-full border-collapse">
        <tbody>
          <tr
            v-for="(spec, specIndex) in group.specs"
            :key="specIndex"
            class="border-b border-gray-200"
          >
            <td class="py-2 px-4 font-medium text-gray-600 w-1/2 bg-gray-50">{{ spec.label }}</td>
            <td class="py-2 px-4 text-gray-800">{{ spec.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.product-specifications {
  margin: 2rem 0;
}

.spec-group:last-child {
  margin-bottom: 0;
}

table {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
