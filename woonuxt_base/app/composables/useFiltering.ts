/**
 * @name useFiltering
 * @description A composable that handles the filtering of products. For reference this
 * is what the filter query looks like: ?filter=pa_color[green,blue],pa_size[md]
 */
export function useFiltering() {
  const route = useRoute();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig(); // Declare a variable for the runtime config and the filter and order functions
  const { updateProductList } = useProducts();

  const filterQuery = useState<string>('filter', () => '');

  filterQuery.value = route.query.filter as string;

  // Normalizes taxonomy names like product_brand, PRODUCTBRAND, Product-Brand to the same key.
  const normalizeTaxonomy = (value: string | undefined | null): string => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  /**
   * Get the filter value from the url
   * @param {string} filterName
   * @returns {string[]} - An array of filter values
   * @example getFilter('pa_color') // ["green", "blue"]
   */
  function getFilter(filterName: string): string[] {
    return filterQuery.value?.split(`${filterName}[`)[1]?.split(']')[0]?.split(',') || [];
  }

  /**
   * Set the filter value in the url
   * @param {string}
   * @param {string[]}
   * @example Just like the example above, but in reverse. setFilter('pa_color', ['green', 'blue'])
   */
  function setFilter(filterName: string, filterValue: string[]) {
    let newFilterQuery = filterQuery.value || '';

    // If there are filters and filterName is not one of them, add the filter query
    if (!filterQuery.value?.includes(filterName)) {
      newFilterQuery = filterQuery.value ? `${filterQuery.value},${filterName}[${filterValue}]` : `${filterName}[${filterValue}]`;
    } else {
      // If filterValue is empty, remove the filter query
      newFilterQuery = !filterValue.length
        ? filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, '')
        : filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, `${filterName}[${filterValue}]`);
    }

    // remove the first or last comma
    newFilterQuery = newFilterQuery.replace(/^,/, '').replace(/,$/, '');

    // if there is 2 or more commas in a row, replace them with one
    newFilterQuery = newFilterQuery.replace(/,{2,}/g, ',');

    // Update the filter query
    filterQuery.value = newFilterQuery;

    router.push({ query: { ...route.query, filter: newFilterQuery } });

    // remove pagination from the url
    const path = route.path.includes('/page/') ? route.path.split('/page/')[0] : route.path;

    // if the filter query is empty, remove it from the url
    if (!newFilterQuery) {
      router.push({
        path,
        query: { ...route.query, filter: undefined },
      });
    } else {
      router.push({
        path,
        query: { ...route.query, filter: newFilterQuery },
      });
    }

    setTimeout(() => {
      updateProductList();
    }, 50);
  }

  /**
   * Reset the filter value in the url
   */
  function resetFilter(): void {
    const { scrollToTop } = useHelpers();
    filterQuery.value = '';
    router.push({ query: { ...route.query, filter: undefined } });

    setTimeout(() => {
      updateProductList();
      scrollToTop();
    }, 50);
  }

  /**
   * Check if there are any filters active
   * @returns {boolean}
   */
  const isFiltersActive = computed<boolean>(() => !!filterQuery.value);

  /**
   * Filter the products based on the active filters
   * @param {Product[]} products - An array of all the products
   * @returns {Product[]} - An array of filtered products
   */
  function filterProducts(products: Product[]): Product[] {
    return products.filter((product) => {
      // Category filter
      const category = getFilter('category') || []; // ["category-slug"]
      const categoryCondition = category.length ? product.productCategories?.nodes?.find((node) => category.includes(node.slug as string)) : true;

      // price filter
      const priceRange = getFilter('price') || []; // ["0", "100"]
      // Variable products returns an array of prices, so we need to find the highest price.
      const productPrice = product.rawPrice ? parseFloat([...product.rawPrice.split(',')].reduce((a, b) => String(Math.max(Number(a), Number(b))))) : 0;
      const priceCondition = priceRange.length
        ? productPrice >= parseFloat(priceRange[0] as string) && productPrice <= parseFloat(priceRange[1] as string)
        : true;

      // Star rating filter
      const starRating = getFilter('rating') || [];
      const ratingCondition = starRating.length ? (product?.averageRating || 0) >= parseFloat(starRating[0] as string) : true;

      // Brand filter
      const brand = getFilter('product_brand') || [];
      let brandCondition = true;
      if (brand.length) {
        const selectedBrands = brand.map((slug) => String(slug).toLowerCase());
        const productBrands = (product as any).brands;
        const brandNodes = Array.isArray(productBrands) ? productBrands : (productBrands?.nodes ?? []);
        const inBrandsNodes = brandNodes.some((node: any) => selectedBrands.includes(String(node?.slug || '').toLowerCase()));

        const brandTaxonomies = new Set(
          String(runtimeConfig?.public?.BRAND_TAXONOMIES || 'product_brand,pa_brand,brand')
            .split(',')
            .map((s: string) => normalizeTaxonomy(s))
            .filter(Boolean),
        );
        const inTermsNodes = (product.terms?.nodes ?? []).some((node: any) => {
          const taxonomy = normalizeTaxonomy(node?.taxonomyName);
          return brandTaxonomies.has(taxonomy) && selectedBrands.includes(String(node?.slug || '').toLowerCase());
        });
        brandCondition = inBrandsNodes || inTermsNodes;
      }

      // Power (pa_guc) filter - numeric range filter
      const powerRange = getFilter('pa_guc') || [];
      let powerCondition = true;
      if (powerRange.length === 2) {
        const productPowerTerms = product.terms?.nodes?.filter((node: any) => node.taxonomyName === 'pa_guc');
        if (productPowerTerms && productPowerTerms.length > 0) {
          // Check if any power term is within the range
          powerCondition = productPowerTerms.some((term: any) => {
            const powerValue = parseFloat(term.name || '0');
            return powerValue >= parseFloat(powerRange[0] as string) && powerValue <= parseFloat(powerRange[1] as string);
          });
        } else {
          // If no power term, don't show the product when power filter is active
          powerCondition = false;
        }
      }

      // Shaft (pa_saft) filter
      const shaft = getFilter('pa_saft') || [];
      const shaftCondition = shaft.length ? product.terms?.nodes?.find((node: any) => node.taxonomyName === 'pa_saft' && shaft.includes(node.slug)) : true;


      // Product attribute filters (global + extra attributes)
      const extraAttributes = ['pa_kontrol', 'pa_mars', 'pa_trim'];
      const allAttributes = [
        ...(runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES?.map((attribute: any) => attribute.slug) || []),
        ...extraAttributes
      ];
      // Exclude brand taxonomies (handled by brandCondition) and pa_guc (handled by range-based powerCondition)
      // to prevent the generic slug-match from incorrectly filtering them out
      const brandTaxonomies = new Set(
        String(runtimeConfig?.public?.BRAND_TAXONOMIES || 'product_brand,pa_brand,brand')
          .split(',').map((s: string) => normalizeTaxonomy(s)).filter(Boolean)
      );
      const attributeCondition = allAttributes
        .filter((attribute: string) => !brandTaxonomies.has(normalizeTaxonomy(attribute)) && normalizeTaxonomy(attribute) !== normalizeTaxonomy('pa_guc'))
        .map((attribute: string) => {
          const attributeValues = getFilter(attribute) || [];
          if (!attributeValues.length) return true;
          return product.terms?.nodes?.find(
            (node: any) => normalizeTaxonomy(node.taxonomyName) === normalizeTaxonomy(attribute) && attributeValues.includes(node.slug),
          );
        })
        .every((condition: any) => condition);

  // stock filter
  const stockFilter = getFilter('stock');
  const inStockOnlyCondition = stockFilter.length ? product.stockStatus === 'IN_STOCK' : true;

  return ratingCondition && priceCondition && attributeCondition && categoryCondition && brandCondition && powerCondition && shaftCondition && inStockOnlyCondition;
    });
  }

  return { getFilter, setFilter, resetFilter, isFiltersActive, filterProducts };
}
