import type { CheckoutInput, CreateAccountInput, UpdateCustomerInput } from '#gql';

export function useCheckout() {
  const { customer, loginUser, viewer } = useAuth();
  const { cart, emptyCart, refreshCart, isUpdatingCart } = useCart();

  const orderInput = useState<any>('orderInput', () => {
    return {
      customerNote: '',
      paymentMethod: '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    };
  });

  const isProcessingOrder = useState<boolean>('isProcessingOrder', () => false);

  // Helper function to build checkout payload
  const buildCheckoutPayload = (isPaid = false): CheckoutInput => {
    const { username, password, shipToDifferentAddress } = orderInput.value;
    const billing = customer.value?.billing;
    const shipping = shipToDifferentAddress ? customer.value?.shipping : billing;

    const payload: CheckoutInput = {
      billing,
      shipping,
      shippingMethod: cart.value?.chosenShippingMethods,
      metaData: orderInput.value.metaData,
      paymentMethod: orderInput.value.paymentMethod.id,
      customerNote: orderInput.value.customerNote,
      shipToDifferentAddress,
      transactionId: orderInput.value.transactionId,
      isPaid,
    };

    // Handle account creation
    if (orderInput.value.createAccount) {
      payload.account = { username, password } as CreateAccountInput;
    } else {
      payload.account = null;
    }

    return payload;
  };

  // Helper function to check if payment method is PayPal
  const isPayPalPayment = (): boolean => {
    const paymentId = orderInput.value.paymentMethod.id;
    return paymentId === 'paypal' || paymentId === 'ppcp-gateway';
  };

  // Helper function to handle PayPal redirect
  const handlePayPalRedirect = async (checkout: any, orderId: string, orderKey: string): Promise<void> => {
    const { replaceQueryParam } = useHelpers();
    const router = useRouter();

    const frontEndUrl = window.location.origin;
    let redirectUrl = checkout?.redirect ?? '';

    const payPalReturnUrl = `${frontEndUrl}/odeme/siparis-alindi/${orderId}/?key=${orderKey}&from_paypal=true`;
    const payPalCancelUrl = `${frontEndUrl}/odeme/?cancel_order=true&from_paypal=true`;

    redirectUrl = replaceQueryParam('return', payPalReturnUrl, redirectUrl);
    redirectUrl = replaceQueryParam('cancel_return', payPalCancelUrl, redirectUrl);
    redirectUrl = replaceQueryParam('bn', 'WooNuxt_Cart', redirectUrl);

    const isPayPalWindowClosed = await openPayPalWindow(redirectUrl);

    if (isPayPalWindowClosed) {
      router.push(`/odeme/siparis-alindi/${orderId}/?key=${orderKey}&fetch_delay=true`);
    }
  };

  // Helper function to handle post-checkout account creation
  const handleAccountCreation = async (): Promise<void> => {
    if (orderInput.value.createAccount) {
      const { username, password } = orderInput.value;
      await loginUser({ username, password });
    }
  };

  // Helper function to finalize checkout
  const finalizeCheckout = async (checkout: any): Promise<void> => {
    // For PayPal payments, clear the cart here since they handle redirect differently
    // Only clear if cart has items to avoid "Cart is empty" errors
    if (isPayPalPayment() && cart.value?.contents?.nodes?.length) {
      await emptyCart();
      await refreshCart();
      return;
    }

    // For other payment methods, don't clear cart here to avoid flash
    // Cart will be cleared on the order-received page
    if (checkout?.result !== 'success' && !checkout?.order?.databaseId) {
      alert('There was an error processing your order. Please try again.');
      window.location.reload();
    }
  };

  // if Country or State are changed, calculate the shipping rates again
  async function updateShippingLocation() {
    isUpdatingCart.value = true;

    try {
      if (!viewer?.value?.id) {
        throw new Error('Viewer ID is missing.');
      }

      const { updateCustomer } = await GqlUpdateCustomer({
        input: {
          id: viewer.value.id,
          shipping: orderInput.value.shipToDifferentAddress ? customer.value.shipping : customer.value.billing,
          billing: customer.value.billing,
        } as UpdateCustomerInput,
      });

      if (updateCustomer) await refreshCart();
    } catch (error) {
      console.error('Error updating shipping location:', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  async function openPayPalWindow(redirectUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const width = 750;
      const height = 750;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2 + 80;
      const payPalWindow = window.open(redirectUrl, '', `width=${width},height=${height},top=${top},left=${left}`);
      const timer = setInterval(() => {
        if (payPalWindow && payPalWindow.closed) {
          clearInterval(timer);
          resolve(true);
        }
      }, 500);
    });
  }

  const processCheckout = async (isPaid = false): Promise<any> => {
    const router = useRouter();

    isProcessingOrder.value = true;

    try {
      // Build checkout payload
      const checkoutPayload = buildCheckoutPayload(isPaid);

      // Process the checkout
      const { checkout } = await GqlCheckout(checkoutPayload);

      // Debug: Log checkout response to see what Tosla returns
      console.log('🔍 Checkout Response:', {
        orderId: checkout?.order?.databaseId,
        orderKey: checkout?.order?.orderKey,
        redirect: checkout?.redirect,
        result: checkout?.result,
        paymentMethod: checkoutPayload.paymentMethod,
      });

      // Handle account creation if requested
      await handleAccountCreation();

      const orderId = checkout?.order?.databaseId;
      const orderKey = checkout?.order?.orderKey;

      console.log('📦 Checkout response:', {
        orderId,
        orderKey,
        paymentMethod: checkoutPayload.paymentMethod,
        hasRedirect: !!checkout?.redirect,
        redirectUrl: checkout?.redirect
      });

      // Ensure we have required order details
      if (!orderId || !orderKey) {
        throw new Error('Order ID or order key is missing from checkout response');
      }

      // If checkout includes a redirect URL
      if (checkout?.redirect) {
        if (isPayPalPayment()) {
          // PayPal flow handled via popup window
          await handlePayPalRedirect(checkout, String(orderId), orderKey);
          // Finalize the checkout (this will also clear cart for PayPal)
          await finalizeCheckout(checkout);
        } else {
          // For hosted/redirect gateways (e.g., Tosla/Sanal POS), navigate current window
          // Backend snippet should rewrite return/cancel URLs to frontend routes
          let redirectUrl = checkout.redirect;
          
          // If Tosla payment page, add cart total for installment calculation
          if (redirectUrl.includes('/odeme/kart-bilgileri')) {
            const { cart } = useCart();
            // Use RAW total provided by GraphQL (already in major currency units, e.g., TL)
            const raw = parseFloat((cart.value?.rawTotal as string) || '0');
            const cartTotal = Number.isFinite(raw) ? raw : 0;
            const url = new URL(redirectUrl);
            url.searchParams.set('total', cartTotal.toFixed(2));
            redirectUrl = url.toString();
          }
          
          window.location.assign(redirectUrl);
          return checkout; // stop further processing as we're leaving the page
        }
      } else if (checkoutPayload.paymentMethod === 'wc_alttantire') {
        // FALLBACK: Tosla gateway doesn't provide redirect in GraphQL response
        // Manually redirect to card details page
    // Use RAW total to avoid locale formatting issues (e.g., 13.600,00)
    const raw = parseFloat((cart.value?.rawTotal as string) || '0');
    const cartTotal = Number.isFinite(raw) ? raw : 0;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUrl = `${origin}/odeme/kart-bilgileri?order_id=${orderId}&key=${orderKey}&total=${cartTotal.toFixed(2)}`;
        
  console.log('🔄 Tosla fallback redirect triggered');
  console.log('🔄 Redirecting to:', redirectUrl);
        console.log('📝 Order details:', { orderId, orderKey, cartTotal });
        
        // Alert to pause and see the URL
        alert(`Redirect URL: ${redirectUrl}\n\nTıklayınca yönlendirileceksiniz...`);
        
        // Use window.location for full page reload (ensures Nuxt properly loads the route)
        window.location.href = redirectUrl;
        return checkout;
      } else {
        // No redirect provided: go directly to order received page (e.g., COD or already-paid flows)
        router.push(`/odeme/siparis-alindi/${orderId}/?key=${orderKey}`);
        // Finalize the checkout (no popup/redirect needed)
        await finalizeCheckout(checkout);
      }

      return checkout;
    } catch (error: any) {
      console.error('Checkout error:', error);
      if (error.message) alert(error.message);
      return null;
    } finally {
      isProcessingOrder.value = false;
    }
  };

  return {
    orderInput,
    isProcessingOrder,
    processCheckout,
    updateShippingLocation,
  };
}
