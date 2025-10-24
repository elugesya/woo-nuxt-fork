export default defineNuxtRouteMiddleware((to) => {
  // Skip if we're on the server during prerendering
  if (import.meta.server) {
    return;
  }

  // Get the full path including query and hash
  const path = to.path;
  
  // If the path ends with a slash (but is not just '/'), redirect to non-trailing slash
  if (path !== '/' && path.endsWith('/')) {
    const nextPath = path.slice(0, -1);
    const nextRoute = { ...to, path: nextPath };
    
    return navigateTo(nextRoute, { redirectCode: 301 });
  }
});
