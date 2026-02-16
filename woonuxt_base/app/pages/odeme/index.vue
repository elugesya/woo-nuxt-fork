<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, CreateSourceData, StripeCardElement } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const { t } = useI18n();
const { query } = useRoute();
const { cart, isUpdatingCart, paymentGateways, emptyCart, refreshCart } = useCart();
const { customer, viewer, navigateToLogin } = useAuth();
const { orderInput, isProcessingOrder, processCheckout } = useCheckout();
const { trackBeginCheckout, trackAddPaymentInfo } = useGoogleAnalytics();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('general.processing') : t('shop.checkoutButton'));
const isStripeElementReady = ref<boolean>(false);
const stripeClientSecret = ref<string>('');

const isCheckoutDisabled = computed<boolean>(() => {
  if (isProcessingOrder.value || isUpdatingCart.value || !orderInput.value.paymentMethod) {
    console.log('Checkout disabled:', { isProcessing: isProcessingOrder.value, isUpdating: isUpdatingCart.value, hasPaymentMethod: !!orderInput.value.paymentMethod });
    return true;
  }

  // Check if Stripe is selected and element is not ready
  if (orderInput.value.paymentMethod?.id === 'stripe') {
    if (!isStripeElementReady.value) console.log('Checkout disabled: Stripe element not ready');
    return !isStripeElementReady.value;
  }

  return false;
});

const isInvalidEmail = ref<boolean>(false);
const stripe: Stripe | null = stripeKey ? await loadStripe(stripeKey) : null;
const elements = ref();
const isPaid = ref<boolean>(false);

// New reactive refs for the improved checkout flow
const shipToDifferentAddress = ref<boolean>(false);
const isEditingShipping = ref<boolean>(false);
const isEditingBilling = ref<boolean>(false);

// Functions to handle editing
const editShippingAddress = () => {
  isEditingShipping.value = true;
};

const editBillingAddress = () => {
  isEditingBilling.value = true;
};

// Watch for address preference changes to auto-copy shipping to billing when using same address
watch(shipToDifferentAddress, (newValue) => {
  if (newValue && customer.value?.shipping && customer.value?.billing) {
    // Copy shipping address to billing address when shipping to different address is selected
    Object.assign(customer.value.billing, {
      ...customer.value.shipping,
      email: customer.value.billing.email, // Preserve email
    });
  }
});

onBeforeMount(async () => {
  // If a cancel comes from a popup-based flow (e.g., PayPal), close the window.
  // In single-window redirects (e.g., Tosla), we should NOT attempt to close the tab.
  if (query.cancel_order && (query.from_paypal || (typeof window !== 'undefined' && window.opener))) {
    window.close();
  }

  // Initialize shipping address if it doesn't exist and we have shipping methods
  if (cart.value?.availableShippingMethods?.length && customer.value && !customer.value.shipping) {
    // If we have billing address but no shipping address, copy billing to shipping
    if (customer.value.billing) {
      customer.value.shipping = { ...customer.value.billing };
    }
  }

  // For guest users, always open shipping form (they must fill address)
  if (!viewer.value) {
    isEditingShipping.value = true;
  }

  // Track begin checkout
  if (cart.value) {
    trackBeginCheckout(cart.value);
    const { trackInitiateCheckout } = useTikTokPixel();
    trackInitiateCheckout(cart.value);
  }
});

// Helper to check if user has any shipping information
const hasAnyShippingInfo = computed(() => {
  const shipping = customer.value?.shipping;
  if (!shipping) return false;
  return !!(shipping.firstName || shipping.lastName || shipping.address1 || shipping.city || shipping.country);
});

const payNow = async () => {
  console.log('payNow called');
  buttonText.value = t('general.processing');

  try {
    if (orderInput.value.paymentMethod.id === 'stripe' && stripe && elements.value) {
      // Only call Stripe API when Stripe is the selected payment method
      const paymentMethodType = appConfig.stripePaymentMethod || 'payment';

      if (paymentMethodType === 'payment') {
        // Modern Payment Element - use confirmPayment
        if (!stripeClientSecret.value) {
          throw new Error(t('checkout.paymentIntentNotAvailable'));
        }

        // First, submit the elements to validate the form
        const { error: submitError } = await elements.value.submit();
        if (submitError) {
          console.error('Form validation failed:', submitError);
          throw new Error(submitError.message);
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements: elements.value,
          clientSecret: stripeClientSecret.value,
          confirmParams: {
            return_url: `${window.location.origin}/odeme/siparis-alindi`,
            payment_method_data: {
              billing_details: {
                name: `${customer.value?.billing?.firstName || ''} ${customer.value?.billing?.lastName || ''}`.trim() || undefined,
                email: customer.value?.billing?.email || undefined,
                phone: customer.value?.billing?.phone || undefined,
                address: {
                  line1: customer.value?.billing?.address1 || undefined,
                  line2: customer.value?.billing?.address2 || undefined,
                  city: customer.value?.billing?.city || undefined,
                  state: customer.value?.billing?.state || undefined,
                  postal_code: customer.value?.billing?.postcode || undefined,
                  country: customer.value?.billing?.country || undefined,
                },
              },
            },
          },
          redirect: 'if_required',
        });

        if (error) {
          console.error('Payment failed:', error);
          throw new Error(error.message);
        }

        if (paymentIntent) {
          orderInput.value.metaData.push({ key: '_stripe_payment_intent_id', value: paymentIntent.id });

          // Add payment method ID if available
          if (paymentIntent.payment_method) {
            orderInput.value.metaData.push({ key: '_stripe_payment_method_id', value: paymentIntent.payment_method });
          }

          // Add additional metadata that WooCommerce Stripe plugin might expect
          orderInput.value.metaData.push({ key: '_stripe_source_id', value: paymentIntent.id });
          orderInput.value.metaData.push({ key: '_stripe_fee', value: '0' });
          orderInput.value.metaData.push({ key: '_stripe_net', value: paymentIntent.amount.toString() });
          orderInput.value.metaData.push({ key: '_stripe_currency', value: paymentIntent.currency });
          orderInput.value.metaData.push({ key: '_stripe_charge_captured', value: 'yes' });
          orderInput.value.metaData.push({ key: '_wc_stripe_payment_method_type', value: 'card' });

          // Set isPaid based on payment intent status
          isPaid.value = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
          orderInput.value.transactionId = paymentIntent.id;
        }
      } else {
        // Traditional Card Element - use legacy approach
        let clientSecret = '';

        try {
          const { stripePaymentIntent } = await GqlGetStripePaymentIntent({
            stripePaymentMethod: 'SETUP' as any,
          });
          clientSecret = stripePaymentIntent?.clientSecret || '';
        } catch (stripeError) {
          console.error('Error getting Stripe setup intent:', stripeError);
        }

        const cardElement = elements.value.getElement('card') as StripeCardElement;

        if (clientSecret) {
          // Use setup intent if available
          const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
          if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });
          isPaid.value = setupIntent?.status === 'succeeded' || false;
          orderInput.value.transactionId = setupIntent?.id || new Date().getTime().toString();
        } else {
          // Fallback to source creation (legacy method)
          const { source } = await stripe.createSource(cardElement as CreateSourceData);
          if (source) {
            orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
            orderInput.value.transactionId = source.created?.toString() || new Date().getTime().toString();
            // For sources, we assume payment is successful for checkout continuation
            isPaid.value = true;
          }
        }
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);

    // Provide user-friendly error message
    const errorMessage = error instanceof Error ? error.message : t('checkout.unexpectedError');

    // You could show a toast notification here instead
    alert(t('checkout.paymentFailedMessage', { message: errorMessage }));

    buttonText.value = t('shop.placeOrder');
    return; // Don't process checkout if payment failed
  }

  // Process the checkout
  const result = await processCheckout(isPaid.value);

  // If checkout was successful and we had a successful payment, ensure cart is cleared
  if (isPaid.value && result) {
    await emptyCart();
    await refreshCart();
  }
};

const handleStripeElement = (stripeElements: StripeElements): void => {
  elements.value = stripeElements;

  // Get the payment method type from config
  const paymentMethodType = appConfig.stripePaymentMethod || 'payment';

  if (paymentMethodType === 'payment') {
    // Modern Payment Element - listen for changes
    const paymentElement = stripeElements.getElement('payment');
    if (paymentElement) {
      paymentElement.on('change', (event) => {
        // Payment Element change event has different structure
        isStripeElementReady.value = event.complete;
      });
      isStripeElementReady.value = false;
    }
  } else {
    // Card Element
    const cardElement = stripeElements.getElement('card');
    if (cardElement) {
      cardElement.on('change', (event) => {
        isStripeElementReady.value = event.complete && !event.error;
      });
      isStripeElementReady.value = false;
    }
  }
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkEmailOnBlur = (email?: string | null): void => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email?: string | null): void => {
  if (email && isInvalidEmail.value) isInvalidEmail.value = false;
};

// Watch for Stripe payment method selection to get client secret for Payment Element
watch(
  () => orderInput.value.paymentMethod?.id,
  async (paymentMethodId) => {
    if (paymentMethodId === 'stripe' && appConfig.stripePaymentMethod === 'payment') {
      try {
        const { stripePaymentIntent } = await GqlGetStripePaymentIntent({
          stripePaymentMethod: 'PAYMENT' as any,
        });
        stripeClientSecret.value = stripePaymentIntent?.clientSecret || '';
      } catch (error) {
        console.error('Failed to get client secret for Payment Element:', error);
        stripeClientSecret.value = '';
      }
    } else {
      stripeClientSecret.value = '';
    }

    // Track payment info addition
    if (paymentMethodId && cart.value) {
      const paymentType = orderInput.value.paymentMethod?.title || paymentMethodId;
      trackAddPaymentInfo(cart.value, paymentType);
    }
  },
);

useSeoMeta({
  title: t('shop.checkout'),
});
</script>

<template>
  <div class="flex flex-col min-h-[600px] bg-muted/30 pb-20">
    <template v-if="cart && customer">
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <Icon name="ion:cart-outline" size="156" class="opacity-25 mb-5" />
        <h2 class="text-2xl font-bold mb-2">{{ $t('shop.cartEmpty') }}</h2>
        <span class="text-gray-400 mb-4">{{ $t('shop.addProductsInYourCart') }}</span>
        <NuxtLink
          to="/urunler"
          class="flex items-center justify-center gap-3 p-2 px-3 mt-4 font-semibold text-center text-white rounded-lg shadow-lg bg-primary hover:bg-primary-dark">
          {{ $t('shop.browseOurProducts') }}
        </NuxtLink>
      </div>

      <form v-else class="container flex flex-wrap items-start gap-8 my-8 justify-evenly lg:gap-10" @submit.prevent="payNow">
        <div class="grid w-full max-w-3xl gap-6 checkout-form md:flex-1">
          <!-- Customer details -->
          <Card v-if="!viewer && customer?.billing">
            <CardHeader>
              <CardTitle>{{ $t('checkout.contactInformation') }}</CardTitle>
            </CardHeader>
            <CardContent class="grid gap-4">
              <p class="text-sm text-muted-foreground">
                {{ $t('checkout.alreadyHaveAccount') }} <NuxtLink to="/hesabim" @click="navigateToLogin('/odeme')" class="text-primary font-semibold hover:underline">{{ $t('checkout.logIn') }}</NuxtLink>.
              </p>
              <div class="grid gap-2">
                <Label for="email">{{ $t('billing.email') }}</Label>
                <Input
                  v-model="customer.billing.email"
                  placeholder="johndoe@email.com"
                  autocomplete="email"
                  type="email"
                  id="email"
                  name="email"
                  :class="{ 'border-destructive': isInvalidEmail }"
                  @blur="checkEmailOnBlur(customer.billing.email)"
                  @input="checkEmailOnInput(customer.billing.email)"
                  required />
                <Transition name="scale-y" mode="out-in">
                  <div v-if="isInvalidEmail" class="text-sm text-destructive">{{ $t('checkout.invalidEmailAddress') }}</div>
                </Transition>
              </div>
              
              <template v-if="orderInput.createAccount">
                <div class="grid gap-2">
                  <Label for="username">{{ $t('account.username') }}</Label>
                  <Input v-model="orderInput.username" placeholder="johndoe" autocomplete="username" type="text" id="username" name="username" required />
                </div>
                <div class="grid gap-2">
                  <Label for="password">{{ $t('account.password') }}</Label>
                  <PasswordInput id="password" v-model="orderInput.password" placeholder="••••••••••" :required="true" />
                </div>
              </template>
              
              <div v-if="!viewer" class="flex items-center gap-2 mt-2">
                <Checkbox id="create-account" :checked="orderInput.createAccount" @update:checked="orderInput.createAccount = $event" />
                <Label for="create-account" class="cursor-pointer">{{ $t('checkout.createAccount') }}</Label>
              </div>
            </CardContent>
          </Card>

          <!-- Billing Address Section -->
          <div v-if="cart?.availableShippingMethods?.length">
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('checkout.billingAddress') }}</CardTitle>
              </CardHeader>
              <CardContent class="grid gap-6">
                <!-- For logged-in users: Show Summary or Form -->
                <template v-if="viewer">
                  <!-- Billing Address Summary or Form -->
                  <div v-if="!isEditingBilling" class="space-y-4">
                    <!-- Billing Address Summary -->
                    <AddressSummary :address="customer?.billing" :show-validation-warnings="!!viewer" @edit="editBillingAddress" />

                    <!-- Ship to Different Address Checkbox -->
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="useSameAddress"
                        :checked="shipToDifferentAddress"
                        @update:checked="shipToDifferentAddress = $event"
                      />
                      <Label for="useSameAddress" class="cursor-pointer">
                        {{ $t('billing.differentAddress') }}
                      </Label>
                    </div>
                  </div>

                  <!-- Billing Address Form (when editing - stays open once clicked) -->
                  <div v-else class="space-y-6">
                    <div>
                      <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
                    </div>

                    <!-- Ship to Different Address Checkbox (also shown during editing) -->
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="useSameAddressEdit"
                        :checked="shipToDifferentAddress"
                        @update:checked="shipToDifferentAddress = $event"
                      />
                      <Label for="useSameAddressEdit" class="cursor-pointer">
                        {{ $t('billing.differentAddress') }}
                      </Label>
                    </div>
                  </div>
                </template>

                <!-- For guest users: Always show form open -->
                <template v-else>
                  <div class="space-y-6">
                    <BillingDetails v-if="customer?.billing" v-model="customer.billing" />

                    <!-- Ship to Different Address Checkbox -->
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="useSameAddressGuest"
                        :checked="shipToDifferentAddress"
                        @update:checked="shipToDifferentAddress = $event"
                      />
                      <Label for="useSameAddressGuest" class="cursor-pointer">
                        {{ $t('billing.differentAddress') }}
                      </Label>
                    </div>
                  </div>
                </template>
              </CardContent>
            </Card>
          </div>

          <div v-if="shipToDifferentAddress">
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('checkout.shippingAddressTitle') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingDetails v-if="customer?.shipping" v-model="customer.shipping" />
              </CardContent>
            </Card>
          </div>
          
          <!-- Fallback: If no shipping methods available, show billing details -->
          <div v-if="!cart?.availableShippingMethods?.length">
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('billing.billingDetails') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
              </CardContent>
            </Card>
          </div>

          <!-- Shipping methods -->
          <div v-if="cart?.availableShippingMethods?.length">
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('general.shippingSelect') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingOptions
                  v-if="cart.availableShippingMethods[0]?.rates && cart.chosenShippingMethods?.[0]"
                  :options="cart.availableShippingMethods[0].rates"
                  :active-option="cart.chosenShippingMethods[0]" />
              </CardContent>
            </Card>
          </div>

          <hr />

          <!-- Pay methods -->
          <div v-if="paymentGateways?.nodes.length" class="mt-2 col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('billing.paymentOptions') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentOptions v-model="orderInput.paymentMethod" class="mb-6" :paymentGateways />
                <StripeElement v-if="stripe" v-show="orderInput.paymentMethod.id == 'stripe'" :stripe @updateElement="handleStripeElement" />
              </CardContent>
            </Card>
          </div>

          <!-- Order note -->
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{{ $t('shop.orderNote') }} <span class="text-muted-foreground text-sm font-normal">({{ $t('general.optional') }})</span></CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  id="order-note"
                  v-model="orderInput.customerNote"
                  name="order-note"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows="4"
                  :placeholder="$t('shop.orderNotePlaceholder')"></textarea>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Desktop: OrderSummary with button inside -->
        <div class="hidden md:block w-full max-w-md">
          <OrderSummary>
            <Button
              class="w-full font-bold text-lg h-12 shadow-md text-white"
              :disabled="isCheckoutDisabled"
              size="lg"
              type="submit"
            >
              {{ buttonText }}
              <LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" class="ml-2" />
            </Button>
          </OrderSummary>
        </div>

        <!-- Mobile: Show OrderSummary without button (button will be sticky at bottom) -->
        <div class="block md:hidden w-full">
          <OrderSummary />
        </div>

        <!-- Mobile Sticky Payment Button -->
        <div class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
          <div class="container mx-auto max-w-2xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted-foreground">{{ $t('shop.total') }}</span>
              <span class="text-lg font-bold text-foreground" v-html="cart.total" />
            </div>
            <Button
              class="w-full font-bold text-lg h-12 shadow-md text-white"
              :disabled="isCheckoutDisabled"
              size="lg"
              type="submit"
            >
              {{ buttonText }}
              <LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" class="ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </template>
    <LoadingIcon v-else class="m-auto" />
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form input[type='password'],
.checkout-form textarea {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-inner w-full py-2 px-4;
}

.checkout-form select {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}

.checkout-form input.has-error,
.checkout-form textarea.has-error {
  @apply border-red-500;
}

/* Keep only the scale-y transition for email validation */
.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 0.2s ease-in-out;
}

.scale-y-enter-from,
.scale-y-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}
</style>
