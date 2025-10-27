<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const runtimeConfig = useRuntimeConfig()

const { product } = defineProps<{ product: Product }>()

// TODO fetch perma link from WP API
const productCategoryPermallink = runtimeConfig?.public?.PRODUCT_CATEGORY_PERMALINK || '/urun-kategorisi/'
const primaryCategory = computed(() => product.productCategories?.nodes[0])
const format = computed(() => [
  { name: 'Products', slug: '/urunler' },
  {
    name: primaryCategory.value?.name,
    slug: `${String(productCategoryPermallink)}${primaryCategory.value?.slug}`,
  },
  { name: product.name },
])
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <NuxtLink to="/">{{ $t('general.home') }}</NuxtLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      
      <template v-for="(link, i) in format" :key="link.name || i">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="link.slug && i + 1 < format.length" as-child>
            <NuxtLink :to="decodeURIComponent(link.slug)">{{ link.name }}</NuxtLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else>{{ link.name }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="i + 1 < format.length" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
