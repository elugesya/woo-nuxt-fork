<template>
  <form class="bg-background rounded-lg shadow" @submit.prevent="saveChanges">
    <div class="grid p-8 gap-6 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('billing.billing') }}</h3>

      <div class="w-full">
        <label for="billing-first-name">{{ $t('billing.firstName') }}</label>
        <input id="billing-first-name" v-model="customer.billing.firstName" placeholder="John" autocomplete="given-name" type="text" required />
      </div>

      <div class="w-full">
        <label for="billing-last-name">{{ $t('billing.lastName') }}</label>
        <input id="billing-last-name" v-model="customer.billing.lastName" placeholder="Doe" autocomplete="family-name" type="text" required />
      </div>

      <div class="w-full">
        <label for="billing-phone">{{ $t('billing.phone') }}</label>
        <input id="billing-phone" v-model="customer.billing.phone" placeholder="+90 555 123 4567" autocomplete="tel" type="tel" />
      </div>

      <div class="w-full">
        <label for="billing-company">Şirket ({{ $t('general.optional') }})</label>
        <input id="billing-company" v-model="customer.billing.company" placeholder="Şirket Adı" autocomplete="organization" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-address">{{ $t('billing.address1') }}</label>
        <input id="billing-address" v-model="customer.billing.address1" placeholder="Örnek Mahallesi, Örnek Sokak No:123" autocomplete="address-line1" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-address-2">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</label>
        <input id="billing-address-2" v-model="customer.billing.address2" placeholder="Daire, Kat, Blok vb." autocomplete="address-line2" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-city">{{ $t('billing.city') }}</label>
        <input id="billing-city" v-model="customer.billing.city" placeholder="İstanbul" autocomplete="address-level2" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-state">{{ $t('billing.state') }} ({{ $t('general.optional') }})</label>
        <StateSelect id="billing-state" v-model="customer.billing.state" :default-value="customer.billing.state" :country-code="customer.billing.country" />
      </div>

      <div class="w-full">
        <label for="billing-country">{{ $t('billing.country') }}</label>
        <select id="billing-country" v-model="customer.billing.country" class="h-[42px]" required disabled>
          <option value="TR">Türkiye</option>
        </select>
      </div>

      <div class="w-full">
        <label for="billing-zip">{{ $t('billing.zip') }}</label>
        <input id="billing-zip" v-model="customer.billing.postcode" placeholder="34000" autocomplete="postal-code" type="text" />
      </div>

      <div class="w-full col-span-full">
        <label for="billing-email">{{ $t('billing.email') }}</label>
        <input id="billing-email" v-model="customer.billing.email" placeholder="ornek@email.com" autocomplete="email" type="email" required />
      </div>
    </div>

    <div class="grid p-8 gap-6 md:grid-cols-2">
      <div class="col-span-full flex items-center justify-between">
        <h3 class="font-semibold text-xl">{{ $t('general.shipping') }}</h3>
  <label class="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary">
          <input type="checkbox" v-model="useBillingForShipping" @change="copyBillingToShipping" class="rounded" />
          <span>Fatura bilgilerimi kullan</span>
        </label>
      </div>

      <div class="w-full">
        <label for="shipping-first-name">{{ $t('billing.firstName') }}</label>
        <input id="shipping-first-name" v-model="customer.shipping.firstName" placeholder="John" autocomplete="given-name" type="text" required :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-last-name">{{ $t('billing.lastName') }}</label>
        <input id="shipping-last-name" v-model="customer.shipping.lastName" placeholder="Doe" autocomplete="family-name" type="text" required :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-phone">{{ $t('billing.phone') }}</label>
        <input id="shipping-phone" v-model="customer.shipping.phone" placeholder="+90 555 123 4567" autocomplete="tel" type="tel" :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-company">Şirket ({{ $t('general.optional') }})</label>
        <input id="shipping-company" v-model="customer.shipping.company" placeholder="Şirket Adı" autocomplete="organization" type="text" :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-address">{{ $t('billing.address1') }}</label>
        <input id="shipping-address" v-model="customer.shipping.address1" placeholder="Örnek Mahallesi, Örnek Sokak No:123" autocomplete="address-line1" type="text" :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-address-2">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</label>
        <input
          id="shipping-address-2"
          v-model="customer.shipping.address2"
          placeholder="Daire, Kat, Blok vb."
          autocomplete="address-line2"
          type="text"
          :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-city">{{ $t('billing.city') }}</label>
        <input id="shipping-city" v-model="customer.shipping.city" placeholder="İstanbul" autocomplete="address-level2" type="text" :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-state">{{ $t('billing.state') }} ({{ $t('general.optional') }})</label>
        <StateSelect id="shipping-state" v-model="customer.shipping.state" :default-value="customer.shipping.state" :country-code="customer.shipping.country" :disabled="useBillingForShipping" />
      </div>

      <div class="w-full">
        <label for="shipping-country">{{ $t('billing.country') }}</label>
        <select id="shipping-country" v-model="customer.shipping.country" class="h-[42px]" required disabled>
          <option value="TR">Türkiye</option>
        </select>
      </div>

      <div class="w-full">
        <label for="shipping-zip">{{ $t('billing.zip') }}</label>
        <input id="shipping-zip" v-model="customer.shipping.postcode" placeholder="34000" autocomplete="postal-code" type="text" :disabled="useBillingForShipping" />
      </div>
    </div>

  <div class="bg-background backdrop-blur-sm bg-opacity-75 border-t col-span-full p-4 sticky bottom-0 rounded-b-lg">
      <button
  class="rounded-md flex font-semibold ml-auto text-primary-foreground py-2 px-4 gap-4 items-center disabled:bg-muted disabled:cursor-not-allowed"
        :class="button.color"
        :disabled="loading">
        <LoadingIcon v-if="loading" color="#fff" size="20" />
        <span>{{ button.text }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { viewer, customer } = useAuth();
const { t } = useI18n();

const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });
const useBillingForShipping = ref<boolean>(false);

// Initialize Turkey as default country if not set
onMounted(() => {
  if (!customer.value.billing.country) {
    customer.value.billing.country = 'TR';
  }
  if (!customer.value.shipping.country) {
    customer.value.shipping.country = 'TR';
  }
});

function copyBillingToShipping() {
  if (useBillingForShipping.value) {
    customer.value.shipping.firstName = customer.value.billing.firstName;
    customer.value.shipping.lastName = customer.value.billing.lastName;
    customer.value.shipping.phone = customer.value.billing.phone;
    customer.value.shipping.company = customer.value.billing.company;
    customer.value.shipping.address1 = customer.value.billing.address1;
    customer.value.shipping.address2 = customer.value.billing.address2;
    customer.value.shipping.city = customer.value.billing.city;
    customer.value.shipping.state = customer.value.billing.state;
    customer.value.shipping.country = customer.value.billing.country;
    customer.value.shipping.postcode = customer.value.billing.postcode;
  }
}

async function saveChanges(): Promise<void> {
  loading.value = true;
  button.value.text = t('account.updating');
  const shipping = customer.value.shipping;
  const billing = customer.value.billing;

  try {
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, shipping, billing } });
    if (updateCustomer) button.value = { text: t('account.updateSuccess'), color: 'bg-green-500' };
  } catch (error) {
    button.value = { text: t('account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
}
</script>
