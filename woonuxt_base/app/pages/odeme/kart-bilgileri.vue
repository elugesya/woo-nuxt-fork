<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { ShieldCheck, AlertCircle } from 'lucide-vue-next'

const route = useRoute();
const { storeSettings } = useAppConfig();
const runtimeConfig = useRuntimeConfig();

// TAKSIT feature flag from environment variable
const taksitEnabled = computed(() => runtimeConfig.public.taksit === '1' || runtimeConfig.public.taksit === 1);

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

const selectedInstallment = ref('1');
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
      let opts = Array.isArray(response.installments) ? response.installments : [];

      // Apply commission logic: no commission for 1-3 installments, exact commission from API for 4+
      opts = opts.map((opt: any) => {
        const installmentCount = Number(opt.count);
        const modifiedOpt = { ...opt };

        // Zero out commission for installments 1-3
        if (installmentCount <= 3) {
          modifiedOpt.commissionFee = 0;
          modifiedOpt.totalAmount = Number(orderTotal.value);
          if (installmentCount > 1) {
            modifiedOpt.monthlyPayment = Number(orderTotal.value) / installmentCount;
          } else {
            modifiedOpt.monthlyPayment = Number(orderTotal.value);
          }
        }

        return modifiedOpt;
      });

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
      selectedInstallment.value = '1';
      selectedCommission.value = 0;
    } else {
      installmentOptions.value = [];
    }
  } catch (error: any) {
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
    selectedInstallment.value = '1';
    selectedCommission.value = 0;
    errorMessage.value = 'Taksit bilgileri alınamadı, Tek Çekim ile devam edebilirsiniz.';
  } finally {
    loadingInstallments.value = false;
  }
};

// Handle installment selection
const selectInstallment = (option: any) => {
  selectedInstallment.value = String(option.count);
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
        installment: parseInt(selectedInstallment.value),
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
    <h1 class="text-2xl font-bold mb-6">Kart Bilgileri</h1>
    
    <!-- Order info -->
    <Card v-if="orderTotal > 0" class="mb-6">
      <CardContent class="pt-6">
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">Sipariş Tutarı:</span>
          <span class="font-semibold">{{ formatCurrency(orderTotal) }}</span>
        </div>
        <div v-if="selectedCommission > 0" class="flex justify-between items-center mt-2 text-sm">
          <span class="text-muted-foreground">Taksit Komisyonu:</span>
          <span class="text-orange-600">+ {{ formatCurrency(selectedCommission) }}</span>
        </div>
        <div v-if="selectedCommission > 0" class="flex justify-between items-center mt-2 pt-2 border-t">
          <span class="font-semibold">Toplam Ödeme:</span>
          <span class="font-bold text-lg">{{ formatCurrency(finalTotal) }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Error message -->
    <Alert v-if="errorMessage" variant="destructive" class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <!-- Card form -->
    <form @submit.prevent="submitPayment" class="space-y-6 pb-32 md:pb-6">
      <!-- Card number -->
      <div class="space-y-2">
        <Label for="cardNumber">
          Kart Numarası <span class="text-destructive">*</span>
        </Label>
        <Input
          id="cardNumber"
          v-model="cardData.cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="•••• •••• •••• ••••"
          maxlength="19"
          required
          @input="cardData.cardNumber = formatCardNumber($event.target.value)"
        />
        <p v-if="loadingInstallments" class="text-sm text-muted-foreground">
          Taksit seçenekleri yükleniyor...
        </p>
      </div>

      <!-- Cardholder name -->
      <div class="space-y-2">
        <Label for="cardName">
          Kart Üzerindeki İsim <span class="text-destructive">*</span>
        </Label>
        <Input
          id="cardName"
          v-model="cardData.cardName"
          type="text"
          autocomplete="cc-name"
          placeholder="AD SOYAD"
          required
          class="uppercase"
        />
      </div>

      <!-- Expiry date and CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label>
            Son Kullanma Tarihi <span class="text-destructive">*</span>
          </Label>
          <div class="flex gap-2">
            <Select v-model="cardData.expiryMonth" required>
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Ay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="cardData.expiryYear" required>
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Yıl" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="year in years" :key="year.value" :value="year.value">
                  {{ year.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="cvv">
            CVV <span class="text-destructive">*</span>
          </Label>
          <Input
            id="cvv"
            v-model="cardData.cvv"
            type="password"
            inputmode="numeric"
            autocomplete="cc-csc"
            placeholder="•••"
            maxlength="4"
            required
          />
        </div>
      </div>

      <!-- Installment options -->
      <Card v-if="installmentOptions.length > 0">
        <CardHeader>
          <CardTitle class="text-base">Taksit Seçenekleri</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup v-model="selectedInstallment" class="space-y-0">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b">
                  <tr>
                    <th class="px-2 py-2 text-left text-sm font-medium text-muted-foreground">Seçim</th>
                    <th class="px-2 py-2 text-left text-sm font-medium text-muted-foreground">Taksit</th>
                    <th class="px-2 py-2 text-right text-sm font-medium text-muted-foreground">Aylık</th>
                    <th class="px-2 py-2 text-right text-sm font-medium text-muted-foreground">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="option in installmentOptions"
                    :key="option.count"
                    class="border-b hover:bg-muted cursor-pointer transition-colors"
                    :class="{ 'bg-accent': selectedInstallment === String(option.count) }"
                    @click="selectInstallment(option)"
                  >
                    <td class="px-2 py-3">
                      <RadioGroupItem
                        :id="`installment-${option.count}`"
                        :value="String(option.count)"
                      />
                    </td>
                    <td class="px-2 py-3">
                      <Label :for="`installment-${option.count}`" class="cursor-pointer">
                        {{ option.label }}
                      </Label>
                    </td>
                    <td class="px-2 py-3 text-right">
                      <Label :for="`installment-${option.count}`" class="cursor-pointer">
                        {{ option.count > 1 ? formatCurrency(option.monthlyPayment) : '-' }}
                      </Label>
                    </td>
                    <td class="px-2 py-3 text-right font-semibold">
                      <Label :for="`installment-${option.count}`" class="cursor-pointer">
                        {{ formatCurrency(option.totalAmount) }}
                      </Label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <!-- Security notice -->
      <Alert class="bg-blue-50 border-blue-200">
        <ShieldCheck class="h-4 w-4 text-blue-600" />
        <AlertDescription class="text-blue-900">
          <p class="font-semibold mb-1">Güvenli Ödeme</p>
          <p class="text-sm">Kart bilgileriniz SSL sertifikası ile şifrelenerek güvenli bir şekilde işlenir.</p>
        </AlertDescription>
      </Alert>

      <!-- Submit button - Desktop -->
      <CustomButton
        type="submit"
        :disabled="loading"
        class="hidden md:flex w-full"
        size="lg"
      >
        <Spinner v-if="loading" size="sm" class="mr-2" />
        <span>{{ loading ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}</span>
      </CustomButton>

      <!-- Cancel link - Desktop -->
      <div class="hidden md:block text-center">
        <NuxtLink
          :to="`/odeme?cancel_order=true`"
          class="text-sm text-muted-foreground hover:text-foreground underline"
        >
          İptal Et ve Sepete Dön
        </NuxtLink>
      </div>
    </form>

    <!-- Mobile Sticky Payment Button -->
    <div class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg md:hidden">
      <div class="container mx-auto max-w-2xl space-y-3">
        <div v-if="orderTotal > 0" class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Toplam Ödeme</span>
          <span class="text-lg font-bold">{{ formatCurrency(finalTotal) }}</span>
        </div>
        <CustomButton
          type="submit"
          :disabled="loading"
          @click="submitPayment"
          class="w-full"
          size="lg"
        >
          <Spinner v-if="loading" size="sm" class="mr-2" />
          <span>{{ loading ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}</span>
        </CustomButton>
        <div class="text-center">
          <NuxtLink
            :to="`/odeme?cancel_order=true`"
            class="text-sm text-muted-foreground hover:text-foreground underline"
          >
            İptal Et ve Sepete Dön
          </NuxtLink>
        </div>
      </div>
    </div>
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
