<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { updateShippingLocation } = useCheckout()
const { isBillingAddressEnabled } = useCart()

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const billing = toRef(props, 'modelValue')
</script>

<template>
  <div class="grid w-full gap-4 lg:grid-cols-2">
    <div class="w-full space-y-2">
      <Label for="first-name">{{ $t('billing.firstName') }}</Label>
      <Input id="first-name" v-model="billing.firstName" placeholder="Ahmet" autocomplete="given-name" type="text" required />
    </div>

    <div class="w-full space-y-2">
      <Label for="last-name">{{ $t('billing.lastName') }}</Label>
      <Input id="last-name" v-model="billing.lastName" placeholder="Yılmaz" autocomplete="family-name" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full space-y-2">
      <Label for="address1">{{ $t('billing.address1') }}</Label>
      <Input id="address1" v-model="billing.address1" placeholder="Kıbrıs şehitleri caddesi" autocomplete="street-address" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full space-y-2">
      <Label for="address2">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</Label>
      <Input id="address2" v-model="billing.address2" placeholder="Çameli Apartmanı" autocomplete="address-line2" type="text" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full space-y-2">
      <Label for="city">{{ $t('billing.city') }}</Label>
      <Input id="city" v-model="billing.city" placeholder="Karşıyaka" autocomplete="locality" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full space-y-2">
      <Label for="state">{{ $t('billing.state') }} ({{ $t('general.optional') }})</Label>
      <StateSelect
        id="state"
        v-model="billing.state"
        :default-value="billing.state"
        :country-code="billing.country"
        @change="updateShippingLocation"
        autocomplete="address-level1" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full space-y-2">
      <Label for="country">{{ $t('billing.country') }}</Label>
      <CountrySelect id="country" v-model="billing.country" :default-value="billing.country" @change="updateShippingLocation" autocomplete="country" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full space-y-2">
      <Label for="zip">{{ $t('billing.zip') }} ({{ $t('general.optional') }})</Label>
      <Input id="zip" v-model="billing.postcode" placeholder="10001" autocomplete="postal-code" type="text" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full space-y-2">
      <Label for="phone">{{ $t('billing.phone') }}</Label>
      <Input id="phone" v-model="billing.phone" placeholder="+9053212345678" autocomplete="tel" type="tel" required />
    </div>
  </div>
</template>
