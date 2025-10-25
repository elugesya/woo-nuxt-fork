<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const siteName = runtimeConfig.public.SITE_NAME || 'WooNuxt';
const email = runtimeConfig.public.ORGANIZATION_CONTACT_EMAIL || '';
const phone = runtimeConfig.public.ORGANIZATION_PHONE || '';
const address = runtimeConfig.public.ORGANIZATION_ADDRESS || '';
const facebook = runtimeConfig.public.ORGANIZATION_SOCIAL_FACEBOOK || '';
const twitter = runtimeConfig.public.ORGANIZATION_SOCIAL_TWITTER || '';
const instagram = runtimeConfig.public.ORGANIZATION_SOCIAL_INSTAGRAM || '';
const googleMapsEmbed = runtimeConfig.public.GOOGLE_MAPS_EMBED || '';
const whatsappPhone = runtimeConfig.public.WHATSAPP_PHONE || '';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});
const formStatus = ref<'idle' | 'sending' | 'success' | 'error'>('idle');
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!whatsappPhone) {
    formStatus.value = 'error';
    errorMessage.value = 'WhatsApp numarası yapılandırılmadı. Lütfen yönetici ile iletişime geçin.';
    return;
  }
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun.';
    formStatus.value = 'error';
    return;
  }
  
  formStatus.value = 'sending';
  errorMessage.value = '';
  
  try {
    // WhatsApp mesajı oluştur
    const subject = formData.value.subject || 'İletişim Formu';
    const whatsappMessage = `*İletişim Formu Mesajı*

*Ad:* ${formData.value.name}
*E-posta:* ${formData.value.email}
*Konu:* ${subject}

*Mesaj:*
${formData.value.message}`;

    // WhatsApp URL oluştur
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
    
    // Yeni pencerede WhatsApp aç
    window.open(whatsappUrl, '_blank');
    
    // Formu başarılı olarak işaretle ve temizle
    formStatus.value = 'success';
    formData.value = { name: '', email: '', subject: '', message: '' };
  } catch (error: any) {
    formStatus.value = 'error';
    errorMessage.value = 'Mesaj gönderilemedi. Lütfen tekrar deneyin.';
  }
};

useHead({
  title: 'İletişim',
  meta: [
    { name: 'description', content: `${siteName} ile iletişime geçin. Sorularınız ve önerileriniz için bize ulaşın.` },
  ],
});
</script>

<template>
  <main class="container my-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="mb-4 text-4xl font-bold text-gray-800">İletişim</h1>
      <p class="mb-8 text-lg text-gray-600">Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.</p>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Contact Information -->
        <div class="space-y-6">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">İletişim Bilgileri</h2>
            
            <div v-if="address" class="flex items-start gap-4 mb-4">
              <Icon name="mdi:map-marker" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-800">Adres</h3>
                <p class="text-gray-600">{{ address }}</p>
              </div>
            </div>

            <div v-if="phone" class="flex items-start gap-4 mb-4">
              <Icon name="mdi:phone" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-800">Telefon</h3>
                <a :href="`tel:${phone.replace(/\s/g, '')}`" class="text-gray-600 hover:text-primary">{{ phone }}</a>
              </div>
            </div>

            <div v-if="email" class="flex items-start gap-4 mb-4">
              <Icon name="mdi:email" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-800">E-posta</h3>
                <a :href="`mailto:${email}`" class="text-gray-600 hover:text-primary">{{ email }}</a>
              </div>
            </div>

            <div v-if="whatsappPhone" class="flex items-start gap-4 mb-4">
              <Icon name="mdi:whatsapp" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-800">WhatsApp</h3>
                <a :href="`https://wa.me/${whatsappPhone}`" target="_blank" rel="noopener" class="text-gray-600 hover:text-primary">
                  WhatsApp ile iletişime geç
                </a>
              </div>
            </div>

            <!-- Social Media Links -->
            <div v-if="facebook || twitter || instagram" class="pt-4 mt-6 border-t border-gray-200">
              <h3 class="mb-3 font-semibold text-gray-800">Sosyal Medya</h3>
              <div class="flex gap-4">
                <a v-if="facebook" :href="facebook" target="_blank" rel="noopener" class="text-gray-600 hover:text-primary transition-colors">
                  <Icon name="mdi:facebook" class="w-8 h-8" />
                </a>
                <a v-if="twitter" :href="twitter" target="_blank" rel="noopener" class="text-gray-600 hover:text-primary transition-colors">
                  <Icon name="mdi:twitter" class="w-8 h-8" />
                </a>
                <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="text-gray-600 hover:text-primary transition-colors">
                  <Icon name="mdi:instagram" class="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>

          <!-- Google Maps -->
          <div v-if="googleMapsEmbed" class="overflow-hidden bg-white rounded-lg shadow-md">
            <div class="aspect-video" v-html="googleMapsEmbed"></div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="mb-4 text-2xl font-semibold text-gray-800">Bize Ulaşın</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-700">Adınız *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Adınızı girin"
              />
            </div>

            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-700">E-posta *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="E-posta adresinizi girin"
              />
            </div>

            <div>
              <label for="subject" class="block mb-2 text-sm font-medium text-gray-700">Konu</label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Mesajınızın konusu"
              />
            </div>

            <div>
              <label for="message" class="block mb-2 text-sm font-medium text-gray-700">Mesajınız *</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Mesajınızı buraya yazın"
              ></textarea>
            </div>

            <!-- Success Message -->
            <div v-if="formStatus === 'success'" class="p-4 text-green-700 bg-green-100 rounded-lg">
              <p class="font-medium">WhatsApp uygulaması açıldı!</p>
              <p class="text-sm">Mesajınızı göndermek için WhatsApp'ta gönder butonuna tıklayın.</p>
            </div>

            <!-- Error Message -->
            <div v-if="formStatus === 'error'" class="p-4 text-red-700 bg-red-100 rounded-lg">
              <p class="font-medium">{{ errorMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="formStatus === 'sending'"
              class="w-full px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name="mdi:whatsapp" class="w-6 h-6" />
              <span v-if="formStatus === 'sending'">Hazırlanıyor...</span>
              <span v-else>WhatsApp ile Gönder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
