<script setup lang="ts">
/**
 * Tosla 3D Secure Callback Page
 * 
 * After bank 3D authentication, Tosla redirects user here.
 * We check the payment status with WordPress and redirect accordingly.
 */

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

// Get order info from URL
const orderId = computed(() => route.query.order_id as string);
const orderKey = computed(() => route.query.key as string);

// Status tracking
const checking = ref(true);
const errorMessage = ref('');
const statusMessage = ref('Ödeme durumunuz kontrol ediliyor...');
const retries = ref(0);
const maxRetries = 5;

onMounted(async () => {
  // Verify required params
  if (!orderId.value || !orderKey.value) {
    errorMessage.value = 'Geçersiz ödeme linki';
    checking.value = false;
    return;
  }

  // Give Tosla/WordPress a moment to process the callback
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
      // Prefer WP REST bridge endpoint to avoid GraphQL auth limitations on orders
      const wpUrl = runtimeConfig.public.wpUrl?.replace(/\/$/, '') || '';
      const statusEndpoint = `${wpUrl}/wp-json/tosla/v1/order-status?orderId=${encodeURIComponent(orderId.value)}&orderKey=${encodeURIComponent(orderKey.value)}`;
      const result = await $fetch(statusEndpoint, { method: 'GET', mode: 'cors' as any });

      if (!result?.success) {
        throw new Error('Sipariş bulunamadı');
      }

      const orderStatus = String(result.status || '').toLowerCase();

    if (orderStatus === 'processing' || orderStatus === 'completed') {
      // Payment successful!
      statusMessage.value = 'Ödemeniz başarıyla tamamlandı! Yönlendiriliyorsunuz...';
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to order confirmation page
      router.push(`/siparis-ozeti/${orderId.value}?key=${orderKey.value}`);
    } else if (orderStatus === 'pending') {
      // Still pending - might be processing
      statusMessage.value = 'Ödemeniz işleniyor, lütfen bekleyin...';
      
      // Retry a few times, then stop to avoid infinite loop
      if (retries.value < maxRetries) {
        retries.value++;
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Re-run the mounted logic by reloading the route (without full page reload)
        router.replace({ path: route.path, query: route.query });
      } else {
        checking.value = false;
        errorMessage.value = 'Ödeme henüz onaylanmadı. Lütfen biraz sonra tekrar deneyin veya siparişlerim sayfasından kontrol edin.';
      }
  } else if (orderStatus === 'failed' || orderStatus === 'cancelled') {
      // Payment failed
      errorMessage.value = 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.';
      checking.value = false;
      
      // Redirect to checkout after showing error
      setTimeout(() => {
        router.push('/odeme');
      }, 3000);
    } else {
      // Unknown status
      errorMessage.value = `Ödeme durumu belirsiz: ${orderStatus}`;
      checking.value = false;
    }
    
  } catch (error: any) {
    console.error('Ödeme durumu kontrol hatası:', error);
    errorMessage.value = 'Ödeme durumu kontrol edilemedi. Lütfen siparişlerim sayfasından kontrol edin.';
    checking.value = false;
    
    // Redirect to account orders tab (correct URL)
    setTimeout(() => {
      router.push('/hesabim?tab=orders');
    }, 4000);
  }
});

// Prevent user from going back during check
useHead({
  title: 'Ödeme Kontrol Ediliyor'
});
</script>

<template>
  <div class="container max-w-2xl mx-auto px-4 py-16">
    <div class="bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- Loading spinner -->
      <div v-if="checking && !errorMessage" class="mb-6">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>

      <!-- Success icon (when redirecting) -->
      <div v-else-if="!errorMessage && statusMessage.includes('başarıyla')" class="mb-6">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Error icon -->
      <div v-else-if="errorMessage" class="mb-6">
        <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Status message -->
      <h1 v-if="statusMessage && !errorMessage" class="text-2xl font-bold text-gray-800 mb-4">
        {{ statusMessage }}
      </h1>

      <!-- Error message -->
      <div v-if="errorMessage" class="text-red-600">
        <h1 class="text-2xl font-bold mb-2">Ödeme Hatası</h1>
        <p class="text-lg">{{ errorMessage }}</p>
      </div>

      <!-- Additional info -->
      <p v-if="checking && !errorMessage" class="text-gray-600 mt-4">
        Bu işlem birkaç saniye sürebilir, lütfen bekleyiniz...
      </p>

      <p v-if="!checking && errorMessage" class="text-gray-600 mt-4 text-sm">
        Sipariş No: {{ orderId }}
      </p>

      <div v-if="!checking && errorMessage" class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink to="/hesabim?tab=orders" class="px-5 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm">
          Siparişlerimi Görüntüle
        </NuxtLink>
        <button @click="() => window.location.reload()" class="px-5 py-3 bg-primary text-white rounded hover:opacity-90 text-sm">
          Tekrar Kontrol Et
        </button>
      </div>

      <!-- Debug info (only in dev) -->
      <div v-if="false" class="mt-8 p-4 bg-gray-100 rounded text-left text-xs">
        <strong>Debug:</strong><br>
        Order ID: {{ orderId }}<br>
        Order Key: {{ orderKey }}<br>
        Checking: {{ checking }}<br>
        Error: {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
