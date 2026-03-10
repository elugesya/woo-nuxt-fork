<script setup lang="ts">
/**
 * 🌊 Newsletter - Marine Themed
 *
 * Newsletter subscription section with ocean styling.
 */
import { cn } from '@/lib/utils';
import { Mail, Send, Anchor } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: 'default' | 'compact';
  class?: string;
}

const props = withDefaults(defineProps<NewsletterProps>(), {
  title: 'Bültenimize Abone Olun',
  description: 'Yeni ürünler, kampanyalar ve deniz haberleri için bültenimize abone olun.',
  placeholder: 'E-posta adresiniz',
  buttonText: 'Abone Ol',
  variant: 'default',
});

const email = ref('');
const isSubmitting = ref(false);
const isSubscribed = ref(false);

const handleSubmit = async () => {
  if (!email.value) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  isSubscribed.value = true;
  isSubmitting.value = false;
};
</script>

<template>
  <section
    :class="cn(
      'py-12 md:py-16',
      variant === 'default' && 'section-seafoam',
      props.class
    )"
  >
    <div class="container-ocean">
      <div
        :class="cn(
          'relative overflow-hidden rounded-2xl',
          'bg-gradient-ocean p-8 md:p-12',
          'dark:bg-gray-900'
        )"
      >
        <!-- Decorative anchor -->
        <Anchor class="absolute top-4 right-4 w-24 h-24 text-white/5 rotate-45" />
        <Anchor class="absolute bottom-4 left-4 w-16 h-16 text-white/5 -rotate-12" />

        <div class="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-secondary">
            <Mail class="w-6 h-6" />
          </div>

          <!-- Title & Description -->
          <div class="space-y-3">
            <h2 class="text-2xl md:text-3xl font-bold text-white">
              {{ title }}
            </h2>
            <p class="text-white/80">
              {{ description }}
            </p>
          </div>

          <!-- Form -->
          <form
            v-if="!isSubscribed"
            class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            @submit.prevent="handleSubmit"
          >
            <Input
              v-model="email"
              type="email"
              :placeholder="placeholder"
              required
              class="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary"
            />
            <Button
              type="submit"
              :disabled="isSubmitting"
              class="bg-accent hover:bg-accent/90 text-white px-6"
            >
              <Send v-if="!isSubmitting" class="w-4 h-4 mr-2" />
              {{ isSubmitting ? 'Gönderiliyor...' : buttonText }}
            </Button>
          </form>

          <!-- Success Message -->
          <div
            v-else
            class="flex items-center justify-center gap-2 text-secondary"
          >
            <span class="text-lg font-medium">
              Teşekkürler! Abone oldunuz.
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
