<script setup lang="ts">
import { TaxonomyEnum } from '#woo';

const { isFiltersActive } = useFiltering();
const { removeBodyClass } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const { storeSettings } = useAppConfig();

// hide-categories prop is used to hide the category filter on the product category page
const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } });


const globalProductAttributes = (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || [];

// Ekstra attribute'lar
const extraAttributes = [
  { slug: 'pa_kontrol', label: 'Kontrol', openByDefault: false, showCount: true },
  { slug: 'pa_mars', label: 'Marş', openByDefault: false, showCount: true },
  { slug: 'pa_trim', label: 'Trim', openByDefault: false, showCount: true },
];

const hasBrandAttribute = globalProductAttributes.some((attr) => attr.slug === 'product_brand');
const hasShaftAttribute = globalProductAttributes.some((attr) => attr.slug === 'pa_saft');
const hasKontrol = globalProductAttributes.some((attr) => attr.slug === 'pa_kontrol');
const hasMars = globalProductAttributes.some((attr) => attr.slug === 'pa_mars');
const hasTrim = globalProductAttributes.some((attr) => attr.slug === 'pa_trim');

const attributesForQuery = [
  ...globalProductAttributes,
  ...(!hasBrandAttribute ? [{ slug: 'product_brand', label: 'Marka', openByDefault: true, showCount: true }] : []),
  ...(!hasShaftAttribute ? [{ slug: 'pa_saft', label: 'Şaft', openByDefault: true, showCount: true }] : []),
  ...(!hasKontrol ? [extraAttributes[0]] : []),
  ...(!hasMars ? [extraAttributes[1]] : []),
  ...(!hasTrim ? [extraAttributes[2]] : []),
];

const taxonomies = attributesForQuery.map((attr) => attr?.slug?.toUpperCase().replace(/_/g, '')) as TaxonomyEnum[];

const { data } = await useAsyncGql('getAllTerms', { taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY] });
const terms = data.value?.terms?.nodes;

// Filter out the product category terms and the global product attributes with their terms
const productCategoryTerms = terms?.filter((term) => term.taxonomyName === 'product_cat');

// Get brand and shaft terms separately for dedicated filters
const brandTerms = terms?.filter((term) => term.taxonomyName === 'product_brand');
const shaftTerms = terms?.filter((term) => term.taxonomyName === 'pa_saft');

// Filter out the color attribute and the rest of the global product attributes
const attributesWithTerms = attributesForQuery
  .filter(attr => attr.slug !== 'product_brand' && attr.slug !== 'pa_saft')
  .map((attr) => ({ ...attr, terms: terms?.filter((term) => term.taxonomyName === attr.slug) }));
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />
    <div class="relative z-30 grid mb-12 space-y-8 divide-y">
      <PriceFilter />
      <CategoryFilter v-if="!hideCategories" :terms="productCategoryTerms" />
      <BrandFilter v-if="brandTerms && brandTerms.length > 0" :terms="brandTerms" />
      <PowerFilter :min="0" :max="500" />
      <ShaftFilter v-if="shaftTerms && shaftTerms.length > 0" :terms="shaftTerms" />
      <div v-for="attribute in attributesWithTerms" :key="attribute.slug">
        <ColorFilter v-if="attribute.slug == 'pa_color' || attribute.slug == 'pa_colour'" :attribute />
        <GlobalFilter v-else :attribute />
      </div>
      <OnSaleFilter />
      <LazyStarRatingFilter v-if="storeSettings.showReviews" />
      <LazyResetFiltersButton v-if="isFiltersActive" />
    </div>
  </aside>
  <div class="fixed inset-0 z-50 hidden bg-muted/80 filter-overlay" @click="removeBodyClass('show-filters')"></div>
</template>

<style lang="postcss">
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}

#filters {
  @apply w-[280px];

  & .slider-connect {
    @apply bg-primary;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.price-input {
  @apply border rounded-xl outline-none leading-tight w-full p-2 transition-all;

  &.active {
  @apply border-muted pl-6;
  }
}

@media (max-width: 768px) {
  #filters {
  @apply bg-background h-full p-8 transform pl-2 transition-all ease-in-out bottom-0 left-4 -translate-x-[110vw] duration-300 overflow-auto fixed;

    box-shadow:
      -100px 0 0 var(--background),
      -200px 0 0 var(--background),
      -300px 0 0 var(--background);
    z-index: 60;
  }

  .show-filters #filters {
    @apply transform-none;
  }
}
</style>
