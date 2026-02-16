<script setup>
const { updateItemQuantity } = useCart();
const { addToWishlist } = useWishlist();
const { FALLBACK_IMG } = useHelpers();
const { storeSettings } = useAppConfig();

const { item } = defineProps({
  item: { type: Object, required: true },
});

const productType = computed(() => (item.variation ? item.variation?.node : item.product?.node));
const productSlug = computed(() => `/urun/${decodeURIComponent(item.product.node.slug)}`);
const isLowStock = computed(() => (productType.value.stockQuantity ? productType.value.lowStockAmount >= productType.value.stockQuantity : false));
const imgScr = computed(() => productType.value.image?.cartSourceUrl || productType.value.image?.sourceUrl || item.product.image?.sourceUrl || FALLBACK_IMG);
const regularPrice = computed(() => parseFloat(productType.value.rawRegularPrice));
const salePrice = computed(() => parseFloat(productType.value.rawSalePrice));
const salePercentage = computed(() => Math.round(((regularPrice.value - salePrice.value) / regularPrice.value) * 100) + '%');
const isFallback = computed(() => imgScr.value === FALLBACK_IMG);

const removeItem = () => {
  updateItemQuantity(item.key, 0);
};

const moveToWishList = () => {
  addToWishlist(item.product.node);
  removeItem();
};
</script>

<template>
  <SwipeCard @remove="removeItem">
    <div v-if="productType" class="flex items-center gap-2 group">
      <div class="flex items-center justify-center min-w-[64px] max-w-[64px] w-16 h-16">
        <NuxtLink :to="productSlug" class="block w-16 h-16">
          <template v-if="isFallback">
            <img
              width="64"
              height="64"
              class="w-16 h-16 rounded-md skeleton"
              src="/images/placeholder.jpg"
              :alt="productType.name"
              :title="productType.name"
              loading="lazy" />
          </template>
          <template v-else>
            <NuxtImg
              width="64"
              height="64"
              class="w-16 h-16 rounded-md skeleton"
              :src="imgScr"
              :alt="productType.image?.altText || productType.name"
              :title="productType.image?.title || productType.name"
              loading="lazy" />
          </template>
        </NuxtLink>
      </div>
      <div class="flex flex-1 flex-col min-w-0 px-2">
        <div class="font-medium text-foreground truncate leading-tight">
          <NuxtLink :to="productSlug">{{ productType.name }}</NuxtLink>
        </div>
        <div class="flex gap-1 items-center mt-1">
          <span v-if="productType.salePrice" class="text-[10px] border-green-200 leading-none bg-green-100 inline-block p-0.5 rounded text-green-600 border">Save {{ salePercentage }}</span>
          <span v-if="isLowStock" class="text-[10px] border-yellow-200 leading-none bg-yellow-100 inline-block p-0.5 rounded text-orange-500 border">Low Stock</span>
        </div>
        <ProductPrice class="mt-1 text-xs" :sale-price="productType.salePrice" :regular-price="productType.regularPrice" />
      </div>
      <div class="flex flex-col items-end justify-between min-w-[70px]">
        <QuantityInput :item />
        <div class="flex flex-col items-end gap-1 mt-2">
          <div class="text-xs text-muted-foreground group-hover:text-foreground flex leading-none items-center">
            <button
              title="Remove Item"
              aria-label="Remove Item"
              @click="removeItem"
              type="button"
              class="flex items-center gap-1 hover:text-red-500 cursor-pointer">
              <Icon name="ion:trash" class="hidden md:inline-block" size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </SwipeCard>
</template>
