// Example: ?search=shirt
export function useSearching() {
  const route = useRoute();
  const router = useRouter();

  const isShowingSearch = useState<boolean>('isShowingSearch', () => false);
  const searchQuery = useState<string>('searchQuery', () => '');
  const isSearchActive = computed<boolean>(() => !!searchQuery.value);

  // Initialize from route but ensure string
  searchQuery.value = (route.query.search as string) || '';

  function getSearchQuery(): string {
    return (route.query.search as string) || '';
  }

  function setSearchQuery(search: string): void {
    const { updateProductList } = useProducts();
    searchQuery.value = search;
    router.push({ query: { ...route.query, search: search || undefined } });

    setTimeout(() => {
      updateProductList();
    }, 50);
  }

  function clearSearchQuery(): void {
    setSearchQuery('');
  }

  const toggleSearch = (): void => {
    isShowingSearch.value = !isShowingSearch.value;
  };

  // Named predicate function for product search filtering
  function productMatchesSearch(product: Product, searchQuery: string): boolean {
    const name = product.name?.toLowerCase();
    const description = product.description ? product.description.toLowerCase() : null;
    const shortDescription = product.shortDescription ? product.shortDescription.toLowerCase() : null;
    const query = searchQuery.toLowerCase();
    return !!(name?.includes(query) || description?.includes(query) || shortDescription?.includes(query));
  }

  function searchProducts(products: Product[]): Product[] {
    const search = getSearchQuery();

    /**
     * If we are on a category page, we need to add the category slug to the
     * route, otherwise every search will redirect to the products page.
     */
    if (route.name === 'product-category-page' || route.name === 'product-category-page-pager') {
      const categorySlug = route.params.categorySlug as string;
      router.push({ name: route.name as string, params: { categorySlug }, query: { ...route.query, search } });
    } else if (route.name === 'shop-brand-slug') {
      const slug = route.params.slug as string
      router.push({ name: 'shop-brand-slug', params: { slug }, query: { ...route.query, search } })
    } else {
      // Use explicit path to avoid relying on route name mapping
      router.push({ path: '/urunler', query: { ...route.query, search } });
    }

    return search ? products.filter((product: Product) => productMatchesSearch(product, search)) : products;
  }

  return { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive, isShowingSearch, toggleSearch };
}
