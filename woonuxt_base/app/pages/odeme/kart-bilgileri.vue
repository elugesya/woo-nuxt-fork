<script setup lang="ts">
const route = useRoute();
const { storeSettings } = useAppConfig();
const runtimeConfig = useRuntimeConfig();

// ...existing code...
// ...existing code...

// Order verification
const orderId = computed(() => route.query.order_id as string);
const orderKey = computed(() => route.query.key as string);

// Card form state
const cardData = ref({
  cardNumber: '',
  cardName: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
});

const selectedInstallment = ref(1);
const selectedCommission = ref(0);
const installmentOptions = ref<any[]>([]);
const loading = ref(false);
const loadingInstallments = ref(false);
const errorMessage = ref('');
const orderTotal = ref(0);
// ...existing code...

// Get order total from URL or fetch from GraphQL
onMounted(async () => {
  // Verify required query parameters
  if (!orderId.value || !orderKey.value) {
    errorMessage.value = 'Eksik sipariş bilgisi.';
    return;
  }
  if (route.query.total) {
    orderTotal.value = parseFloat(route.query.total as string);
  }
});

// BIN detection (first 6 digits)
const cardBin = computed(() => {
  const cleaned = cardData.value.cardNumber.replace(/\s/g, '');
  return cleaned.substring(0, 6);
});

// Format card number with spaces
const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : cleaned;
};

// Watch BIN and fetch installment options
watch(cardBin, async (bin) => {
  if (bin.length === 6) {
    await fetchInstallments(bin);
  } else {
    installmentOptions.value = [];
  }
});

// Fetch installment options from WordPress REST API
const fetchInstallments = async (bin: string) => {
  loadingInstallments.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $fetch(`${runtimeConfig.public.wpUrl}/wp-json/tosla/v1/installments`, {
      method: 'POST',
      body: {
        bin,
        orderTotal: orderTotal.value
      }
    });
    
    if (response.success) {
      const opts = Array.isArray(response.installments) ? response.installments : [];
      // Ensure Tek Çekim (single payment) option always exists
      const hasSingle = opts.some((opt: any) => Number(opt.count) === 1);
      if (!hasSingle) {
        opts.unshift({
          count: 1,
          rate: 0,
          constant: 0,
          totalAmount: Number(orderTotal.value),
          commissionFee: 0,
          monthlyPayment: Number(orderTotal.value),
          label: 'Tek Çekim'
        });
      }
      installmentOptions.value = opts;

      // Auto-select Tek Çekim by default
      selectedInstallment.value = 1;
      selectedCommission.value = 0;
    } else {
      installmentOptions.value = [];
    }
  } catch (error: any) {
  // ...existing code...
    // Fallback: even if taksit API fails (e.g., 404 route not found), allow Tek Çekim
    installmentOptions.value = [{
      count: 1,
      rate: 0,
      constant: 0,
      totalAmount: Number(orderTotal.value),
      commissionFee: 0,
      monthlyPayment: Number(orderTotal.value),
      label: 'Tek Çekim'
    }];
    selectedInstallment.value = 1;
    selectedCommission.value = 0;
    errorMessage.value = 'Taksit bilgileri alınamadı, Tek Çekim ile devam edebilirsiniz.';
  } finally {
    loadingInstallments.value = false;
  }
};

// Handle installment selection
const selectInstallment = (option: any) => {
  selectedInstallment.value = option.count;
  selectedCommission.value = option.commissionFee;
};

// Calculate final total
const finalTotal = computed(() => {
  return orderTotal.value + selectedCommission.value;
});

// Validate form
const validateForm = () => {
  errorMessage.value = '';
  
  const cleaned = cardData.value.cardNumber.replace(/\s/g, '');
  
  if (!cardData.value.cardName.trim()) {
    errorMessage.value = 'Kart üzerindeki ismi giriniz';
    return false;
  }
  
  if (cleaned.length < 15 || cleaned.length > 16) {
    errorMessage.value = 'Geçerli bir kart numarası giriniz';
    return false;
  }
  
  if (!cardData.value.expiryMonth) {
    errorMessage.value = 'Son kullanma ayını seçiniz';
    return false;
  }
  
  if (!cardData.value.expiryYear) {
    errorMessage.value = 'Son kullanma yılını seçiniz';
    return false;
  }
  
  if (cardData.value.cvv.length < 3) {
    errorMessage.value = 'CVV kodunu giriniz';
    return false;
  }
  
  if (installmentOptions.value.length > 0 && !selectedInstallment.value) {
    errorMessage.value = 'Taksit seçeneği seçiniz';
    return false;
  }
  
  return true;
};

// Submit payment
const submitPayment = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const cleanedCardNumber = cardData.value.cardNumber.replace(/\s/g, '');
    const expireDate = cardData.value.expiryMonth + cardData.value.expiryYear;
    
    const response = await $fetch(`${runtimeConfig.public.wpUrl}/wp-json/tosla/v1/process-payment`, {
      method: 'POST',
      body: {
        orderId: parseInt(orderId.value),
        orderKey: orderKey.value,
        cardData: {
          CardHolderName: cardData.value.cardName.toUpperCase(),
          CardNo: cleanedCardNumber,
          ExpireDate: expireDate,
          Cvv: cardData.value.cvv
        },
        installment: selectedInstallment.value,
        commission: selectedCommission.value
      }
    });
    
    if (response.success) {
      if (response.type === 'html' && response.html) {
        // Render HTML form and auto-submit to 3D Secure
        const container = document.createElement('div');
        container.innerHTML = response.html;
        document.body.appendChild(container);
        
        // Find and submit the form
        const form = container.querySelector('form');
        if (form) {
          form.submit();
        }
      } else if (response.type === 'redirect' && response.redirectUrl) {
        // Direct redirect to 3D Secure
        window.location.href = response.redirectUrl;
      }
    } else {
      throw new Error(response.message || 'Ödeme işlemi başlatılamadı');
    }
    
  } catch (error: any) {
    // ...existing code...

    // If backend returned a redirect Location in error payload, follow it (edge case)
    if (wpData?.location) {
      window.location.href = wpData.location as string;
      return;
    }

    const status = wpData?.status ?? error?.status;
    if (status === 429 || wpPayload?.code === 'rate_limit_exceeded') {
      errorMessage.value = wpPayload?.message || 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    } else if (status === 400) {
      errorMessage.value = wpPayload?.message || 'Kart bilgileriniz geçersiz görünüyor. Lütfen kontrol edin.';
    } else if (status === 500) {
      const serverDetail = typeof wpData?.body === 'string'
        ? wpData.body.slice(0, 180)
        : (wpPayload?.message || '');
      errorMessage.value = serverDetail
        ? `Sunucu hatası: ${serverDetail}`
        : 'Sunucu hatası oluştu. Lütfen tekrar deneyin.';
    } else {
      errorMessage.value = wpPayload?.message || error?.message || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
    }
    loading.value = false;
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(amount);
};

// Month options
const months = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  return {
    value: String(num).padStart(2, '0'),
    label: String(num).padStart(2, '0')
  };
});

// Year options (current year + 10 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => {
  const year = currentYear + i;
  const shortYear = String(year).slice(-2);
  return {
    value: shortYear,
    label: shortYear
  };
});
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
  <!-- ...existing code... -->
    <!-- ...existing code... -->

    <h1 class="text-2xl font-bold mb-6">Kart Bilgileri</h1>
    
    <!-- Order info -->
    <div v-if="orderTotal > 0" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Sipariş Tutarı:</span>
        <span class="font-semibold">{{ formatCurrency(orderTotal) }}</span>
      </div>
      <div v-if="selectedCommission > 0" class="flex justify-between items-center mt-2 text-sm">
        <span class="text-gray-600">Taksit Komisyonu:</span>
        <span class="text-orange-600">+ {{ formatCurrency(selectedCommission) }}</span>
      </div>
      <div v-if="selectedCommission > 0" class="flex justify-between items-center mt-2 pt-2 border-t">
        <span class="font-semibold">Toplam Ödeme:</span>
        <span class="font-bold text-lg">{{ formatCurrency(finalTotal) }}</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Card form -->
    <form @submit.prevent="submitPayment" class="space-y-6">
      <!-- Card number -->
      <div>
        <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-2">
          Kart Numarası <span class="text-red-500">*</span>
        </label>
        <input
          id="cardNumber"
          v-model="cardData.cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="•••• •••• •••• ••••"
          maxlength="19"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          @input="cardData.cardNumber = formatCardNumber($event.target.value)"
        />
        <p v-if="loadingInstallments" class="mt-2 text-sm text-gray-500">
          Taksit seçenekleri yükleniyor...
        </p>
      </div>

      <!-- Cardholder name -->
      <div>
        <label for="cardName" class="block text-sm font-medium text-gray-700 mb-2">
          Kart Üzerindeki İsim <span class="text-red-500">*</span>
        </label>
        <input
          id="cardName"
          v-model="cardData.cardName"
          type="text"
          autocomplete="cc-name"
          placeholder="AD SOYAD"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
        />
      </div>

      <!-- Expiry date and CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Son Kullanma Tarihi <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <select
              v-model="cardData.expiryMonth"
              required
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Ay</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <select
              v-model="cardData.expiryYear"
              required
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Yıl</option>
              <option v-for="year in years" :key="year.value" :value="year.value">
                {{ year.label }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label for="cvv" class="block text-sm font-medium text-gray-700 mb-2">
            CVV <span class="text-red-500">*</span>
          </label>
          <input
            id="cvv"
            v-model="cardData.cvv"
            type="password"
            inputmode="numeric"
            autocomplete="cc-csc"
            placeholder="•••"
            maxlength="4"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <!-- Installment options -->
      <div v-if="installmentOptions.length > 0" class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b">
          <h3 class="font-semibold">Taksit Seçenekleri</h3>
        </div>
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Seçim</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Taksit</th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Aylık</th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Toplam</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="option in installmentOptions"
              :key="option.count"
              class="border-b hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-primary/10': selectedInstallment === option.count }"
              @click="selectInstallment(option)"
            >
              <td class="px-4 py-3">
                <input
                  type="radio"
                  :id="`installment-${option.count}`"
                  :value="option.count"
                  v-model="selectedInstallment"
                  @change="selectInstallment(option)"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-4 py-3">
                <label :for="`installment-${option.count}`" class="cursor-pointer">
                  {{ option.label }}
                </label>
              </td>
              <td class="px-4 py-3 text-right">
                <label :for="`installment-${option.count}`" class="cursor-pointer">
                  {{ option.count > 1 ? formatCurrency(option.monthlyPayment) : '-' }}
                </label>
              </td>
              <td class="px-4 py-3 text-right font-semibold">
                <label :for="`installment-${option.count}`" class="cursor-pointer">
                  {{ formatCurrency(option.totalAmount) }}
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Security notice -->
      <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <Icon name="ion:shield-checkmark" class="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
        <div class="text-sm text-blue-900">
          <p class="font-semibold mb-1">Güvenli Ödeme</p>
          <p>Kart bilgileriniz SSL sertifikası ile şifrelenerek güvenli bir şekilde işlenir.</p>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Icon v-if="loading" name="ion:reload-outline" class="animate-spin text-xl" />
        <span>{{ loading ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}</span>
      </button>

      <!-- Cancel link -->
      <div class="text-center">
        <NuxtLink
          :to="`/odeme?cancel_order=true`"
          class="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          İptal Et ve Sepete Dön
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
