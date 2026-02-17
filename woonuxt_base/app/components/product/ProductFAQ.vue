<script setup lang="ts">
import type { PropType } from 'vue';

export interface FAQItem {
  question: string;
  answer: string;
}

const props = defineProps({
  faqs: {
    type: Array as PropType<FAQItem[]>,
    default: () => [],
  },
});

const isOpen = ref<Record<number, boolean>>({});

const toggleFAQ = (index: number) => {
  isOpen.value[index] = !isOpen.value[index];
};

// Generate JSON-LD for FAQPage schema
const faqSchema = computed(() => {
  if (!props.faqs?.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
});

useHead(() => ({
  script: faqSchema.value
    ? [
        {
          key: 'product-faq-jsonld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(faqSchema.value),
        },
      ]
    : [],
}));
</script>

<template>
  <div v-if="faqs && faqs.length > 0" class="product-faq">
    <h3 class="text-lg font-semibold mb-4">Sıkça Sorulan Sorular</h3>
    <div class="faq-container">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item border border-gray-200 rounded-lg mb-2"
      >
        <button
          class="faq-question w-full text-left px-4 py-3 flex justify-between items-center"
          @click="toggleFAQ(index)"
        >
          <span class="font-medium text-gray-800">{{ faq.question }}</span>
          <span class="faq-icon text-gray-500">{{ isOpen[index] ? '−' : '+' }}</span>
        </button>
        <div
          v-show="isOpen[index]"
          class="faq-answer px-4 py-3 text-gray-600 border-t border-gray-200"
          v-html="faq.answer"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-faq {
  margin: 2rem 0;
}

.faq-question {
  background-color: #f9fafb;
  transition: background-color 0.2s;
  cursor: pointer;
}

.faq-question:hover {
  background-color: #f3f4f6;
}

.faq-item {
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-answer {
  background-color: white;
  line-height: 1.6;
}

.faq-icon {
  font-size: 1.25rem;
  font-weight: 300;
  min-width: 1.5rem;
  text-align: center;
}
</style>
