<script setup lang="ts">
import type { PropType } from 'vue';

export interface EnhancedDescription {
  overview?: string;
  features?: string[];
  specifications?: Record<string, string>;
  usageGuide?: string;
  maintenance?: string;
}

const props = defineProps({
  description: {
    type: Object as PropType<EnhancedDescription>,
    default: () => ({}),
  },
  productName: {
    type: String,
    default: '',
  },
});

// Generate additionalProperty schema for enhanced product attributes
const additionalProperties = computed(() => {
  const props: Array<{ '@type': string; name: string; value: string | string[] }> = [];

  if (props.description?.features) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Özellikler',
      value: props.description.features.join(', '),
    });
  }

  if (props.description?.specifications) {
    Object.entries(props.description.specifications).forEach(([key, value]) => {
      props.push({
        '@type': 'PropertyValue',
        name: key,
        value: String(value),
      });
    });
  }

  return props.length > 0 ? props : undefined;
});
</script>

<template>
  <div v-if="description" class="product-enhanced-description">
    <!-- Overview Section -->
    <section v-if="description.overview" class="description-section mb-6">
      <h3 class="text-lg font-semibold mb-3">Ürün Özeti</h3>
      <p class="text-gray-700 leading-relaxed">{{ description.overview }}</p>
    </section>

    <!-- Features Section -->
    <section v-if="description.features && description.features.length > 0" class="description-section mb-6">
      <h3 class="text-lg font-semibold mb-3">Öne Çıkan Özellikler</h3>
      <ul class="feature-list">
        <li v-for="(feature, index) in description.features" :key="index" class="feature-item">
          <span class="feature-bullet">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </section>

    <!-- Specifications Quick View -->
    <section v-if="description.specifications && Object.keys(description.specifications).length > 0" class="description-section mb-6">
      <h3 class="text-lg font-semibold mb-3">Hızlı Bilgiler</h3>
      <div class="quick-specs-grid">
        <div v-for="(value, key) in description.specifications" :key="key" class="quick-spec-item">
          <span class="spec-label">{{ key }}:</span>
          <span class="spec-value">{{ value }}</span>
        </div>
      </div>
    </section>

    <!-- Usage Guide Section -->
    <section v-if="description.usageGuide" class="description-section mb-6">
      <h3 class="text-lg font-semibold mb-3">Kullanım Kılavuzu</h3>
      <div class="usage-guide text-gray-700 leading-relaxed" v-html="description.usageGuide" />
    </section>

    <!-- Maintenance Section -->
    <section v-if="description.maintenance" class="description-section mb-6">
      <h3 class="text-lg font-semibold mb-3">Bakım ve Koruma</h3>
      <div class="maintenance text-gray-700 leading-relaxed" v-html="description.maintenance" />
    </section>
  </div>
</template>

<style scoped>
.product-enhanced-description {
  margin: 2rem 0;
}

.description-section > h3 {
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 0.5rem 0;
  color: #374151;
  line-height: 1.6;
}

.feature-bullet {
  color: #10b981;
  font-weight: bold;
  margin-right: 0.75rem;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.quick-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-spec-item {
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.spec-label {
  display: block;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.spec-value {
  display: block;
  color: #1f2937;
  font-weight: 600;
}

@media (max-width: 768px) {
  .quick-specs-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    font-size: 0.9375rem;
  }
}
</style>
