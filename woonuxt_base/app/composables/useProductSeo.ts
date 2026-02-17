/**
 * Product SEO Composable
 * Provides enhanced SEO data and functionality for product pages
 */

import type { Product } from '#root/wooTypes';
import {
  generateEnhancedDescription,
  generateFAQs,
  generateSpecGroups,
  generateMetaDescription,
  type ProductSEOData,
} from '~/app/utils/productSeoEnhancer';

export interface EnhancedProductSEO {
  enhancedDescription: ReturnType<typeof generateEnhancedDescription>;
  specifications: ReturnType<typeof generateSpecGroups>;
  faqs: ReturnType<typeof generateFAQs>;
  metaDescription: string;
  additionalProperties: any;
  breadcrumbSchema: any;
}

export function useProductSeo() {
  /**
   * Generate all enhanced SEO data for a product
   */
  const getEnhancedSEO = (product: Product): EnhancedProductSEO => {
    // Convert Product to ProductSEOData format
    // Handle both categories and productCategories
    const categories = (product as any)?.productCategories?.nodes || (product as any)?.categories?.nodes || [];

    const seoData: ProductSEOData = {
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      categories,
      attributes: (product as any)?.attributes?.nodes || [],
      type: product.type || '',
      stockStatus: (product as any)?.stockStatus || '',
    };

    // Generate enhanced description
    const enhancedDescription = generateEnhancedDescription(seoData);

    // Generate FAQ items
    const faqs = generateFAQs(seoData);

    // Generate specification groups
    const specifications = generateSpecGroups(seoData);

    // Generate meta description
    const metaDescription = generateMetaDescription(seoData);

    // Generate additional properties for schema
    const additionalProperties = generateAdditionalProperties(seoData, enhancedDescription);

    // Generate breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema(seoData);

    return {
      enhancedDescription,
      specifications,
      faqs,
      metaDescription,
      additionalProperties,
      breadcrumbSchema,
    };
  };

  /**
   * Generate additionalProperty for product schema
   */
  const generateAdditionalProperties = (seoData: any, enhancedDesc: any) => {
    const props: any[] = [];

    // Add features as properties
    if (enhancedDesc.features && Array.isArray(enhancedDesc.features)) {
      enhancedDesc.features.forEach((feature: string) => {
        props.push({
          '@type': 'PropertyValue',
          name: 'Özellik',
          value: feature,
        });
      });
    }

    // Add specifications as properties
    if (enhancedDesc.specifications) {
      Object.entries(enhancedDesc.specifications).forEach(([key, value]) => {
        props.push({
          '@type': 'PropertyValue',
          name: key,
          value: String(value),
        });
      });
    }

    return props.length > 0 ? props : undefined;
  };

  /**
   * Generate breadcrumb schema for product
   */
  const generateBreadcrumbSchema = (seoData: any) => {
    const { frontEndUrl } = useHelpers();
    const { path } = useRoute();

    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: frontEndUrl,
      },
    ];

    // Add categories
    if (seoData.categories && seoData.categories.length > 0) {
      seoData.categories.forEach((cat: any, index: number) => {
        items.push({
          '@type': 'ListItem',
          position: index + 2,
          name: cat.name,
          item: `${frontEndUrl}/product-category/${cat.slug}`,
        });
      });
    }

    // Add current product
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: seoData.name,
      item: `${frontEndUrl}${path}`,
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  };

  /**
   * Check if product has enhanced SEO data in meta
   */
  const hasEnhancedSEO = (product: Product): boolean => {
    const metaData = (product as any)?.metaData || [];
    if (!metaData.length) return false;

    const enhancedDesc = metaData.find((m: any) => m.key === 'enhanced_description');
    const productFaq = metaData.find((m: any) => m.key === 'product_faq');
    const productSpecs = metaData.find((m: any) => m.key === 'product_specifications');

    return !!(enhancedDesc?.value || productFaq?.value || productSpecs?.value);
  };

  /**
   * Get enhanced SEO data from product meta
   */
  const getProductEnhancedSEO = (product: Product) => {
    const metaData = (product as any)?.metaData || [];
    if (!metaData.length) return null;

    const enhancedDescMeta = metaData.find((m: any) => m.key === 'enhanced_description');
    const productFaqMeta = metaData.find((m: any) => m.key === 'product_faq');
    const productSpecsMeta = metaData.find((m: any) => m.key === 'product_specifications');

    let enhancedDescription = null;
    let faqs = null;
    let specifications = null;

    // Parse enhanced description
    if (enhancedDescMeta?.value) {
      try {
        enhancedDescription = typeof enhancedDescMeta.value === 'string'
          ? JSON.parse(enhancedDescMeta.value)
          : enhancedDescMeta.value;
      } catch (e) {
        console.error('Failed to parse enhanced_description:', e);
      }
    }

    // Parse FAQ
    if (productFaqMeta?.value) {
      try {
        faqs = typeof productFaqMeta.value === 'string'
          ? JSON.parse(productFaqMeta.value)
          : productFaqMeta.value;
      } catch (e) {
        console.error('Failed to parse product_faq:', e);
      }
    }

    // Parse specifications
    if (productSpecsMeta?.value) {
      try {
        const parsed = typeof productSpecsMeta.value === 'string'
          ? JSON.parse(productSpecsMeta.value)
          : productSpecsMeta.value;
        // Wrap in array for the component
        specifications = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error('Failed to parse product_specifications:', e);
      }
    }

    return {
      enhancedDescription,
      faqs,
      specifications,
    };
  };

  return {
    getEnhancedSEO,
    hasEnhancedSEO,
    getProductEnhancedSEO,
  };
}

export type { EnhancedProductSEO };
