export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  // If the path ends with a slash (but is not just '/'), redirect to non-trailing slash
  if (path !== '/' && path.endsWith('/')) {
    const newPath = path.slice(0, -1);
    const newUrl = new URL(url);
    newUrl.pathname = newPath;
    
    return sendRedirect(event, newUrl.toString(), 301);
  }
});
