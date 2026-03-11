export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig();
    const { clearAllCookies, clearAllLocalStorage, getDomain } = useHelpers();
    const sessionToken = useCookie('woocommerce-session', { domain: getDomain(window.location.href) });
    if (sessionToken.value) useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` });

    // Wait for the user to interact with the page before refreshing the cart, this is helpful to prevent excessive requests to the server
    let initialised = false;
    const eventsToFireOn = ['mousedown', 'keydown', 'touchstart', 'scroll', 'wheel', 'click', 'resize', 'mousemove', 'mouseover'];

    async function initStore() {
      if (initialised) {
        // We only want to execute this code block once, so we return if initialised is truthy and remove the event listeners
        eventsToFireOn.forEach((event) => {
          window.removeEventListener(event, initStore);
        });
        return;
      }

      initialised = true;

      const { refreshCart } = useCart();
      const success: boolean = await refreshCart();

      useGqlError((err: any) => {
        const serverErrors = ['The iss do not match with this server', 'Invalid session token'];
        if (serverErrors.includes(err?.gqlErrors?.[0]?.message)) {
          console.warn('Session error - clearing auth but not reloading page');
          clearAllCookies();
          clearAllLocalStorage();
          // window.location.reload(); // Disabled to prevent infinite reload loops during development
        }
      });

      if (!success) {
        // Don't reload the page on cart refresh failure - this can cause infinite loops
        // during development when CORS blocks GraphQL requests
        console.warn('Cart refresh failed - continuing without cart initialization');
        // clearAllCookies();
        // clearAllLocalStorage();

        // // Add a new cookie to prevent infinite reloads
        // const reloadCount = useCookie('reloadCount');
        // if (!reloadCount.value) {
        //   reloadCount.value = '1';
        // } else {
        //   return;
        // }

        // // Log out the user
        // const { logoutUser } = useAuth();
        // await logoutUser();

        // if (!reloadCount.value) window.location.reload();
      }
    }

    // If we are in development mode, we want to initialise the store immediately
    const isDev = process.env.NODE_ENV === 'development';

    // Check if the current route path is one of the pages that need immediate initialization
    // EXCLUDE /odeme/kart-bilgileri AND /odeme/siparis-alindi to prevent cart check issues after order creation
    const pagesToInitializeRightAway = ['/hesabim', '/siparis-ozeti'];
    const currentPath = useRoute().path;
    
    // Skip initialization for payment-related pages where cart state might be in transition
    const skipInitPaths = ['/odeme/kart-bilgileri', '/odeme/siparis-alindi'];
    const shouldSkipInit = skipInitPaths.some(path => currentPath.includes(path));
    
    const isPathThatRequiresInit = !shouldSkipInit && (
      pagesToInitializeRightAway.some((page) => currentPath.includes(page)) || 
      currentPath.includes('/odeme')
    );

    const shouldInit = isDev || isPathThatRequiresInit || !storeSettings.initStoreOnUserActionToReduceServerLoad;

    if (shouldInit) {
      initStore();
    } else {
      eventsToFireOn.forEach((event) => {
        window.addEventListener(event, initStore, { once: true });
      });
    }
  }
});
