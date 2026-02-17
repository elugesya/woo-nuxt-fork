/**
 * Product SEO Enhancement Utilities
 * Generates enhanced SEO content for products including descriptions, FAQs, and specifications
 */

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSEOData {
  name: string;
  description: string;
  shortDescription: string;
  categories: ProductCategory[];
  attributes?: any[];
  type: string;
  stockStatus: string;
}

export interface EnhancedDescription {
  overview: string;
  features: string[];
  specifications?: Record<string, string>;
  usageGuide?: string;
  maintenance?: string;
}

export interface SpecGroup {
  title: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Category-specific FAQ templates
const categoryFAQTemplates: Record<string, FAQItem[]> = {
  'sisme-deniz-botlari': [
    {
      question: 'Bu botu saklamak için nasıl katlanır?',
      answer: 'Botu tamamen söndürdükten sonra temizleyin ve kurulayın. Origami şeklinde katlayarak taşıma çantasına yerleştirin.',
    },
    {
      question: 'Botun maksimum kişi kapasitesi nedir?',
      answer: 'Botun boyutuna göre değişiklik göstermektedir. Her ürün için önerilen kişi sayısı ürün özelliklerinde belirtilmiştir.',
    },
    {
      question: 'Hangi tip motorlar bu botla uyumludur?',
      answer: 'Genellikle kıçtaktı (short shaft) motorlar 400cm altı botlar için uygundur. Daha büyük botlar için uzun şaftlı motorlar önerilir.',
    },
    {
      question: 'Botun garanti süresi ne kadardır?',
      answer: 'Tüm ürünlerimiz 2 yıl garanti kapsamındadır. Kullanım hatasından kaynaklanan sorunlar garanti dışındadır.',
    },
    {
      question: 'Botu ne sıklıkla hava basmalıyım?',
      answer: 'Kullanım öncesi basınç kontrolü yapılmalıdır. Sıcaklık değişimleri basınç etkileyebilir, bu nedenle düzenli kontrol önerilir.',
    },
    {
      question: 'Bot tuzlu suda kullanılabilir mi?',
      answer: 'Evet, botlarımız tuzlu ve tatlı suda kullanıma uygundur. Tuzlu suda kullanımdan sonra tatlı suyla yıkanması önerilir.',
    },
    {
      question: 'Paket içinde neler bulunur?',
      answer: 'Bot, taşıma çantası, tamir kiti, pompa ve kürekler (modele göre değişebilir) paket içindedir.',
    },
  ],
  'tekne-motorlari': [
    {
      question: 'Motorun kurulumu ne kadar sürer?',
      answer: 'Profesyonel kurulum 1-2 saat sürer. Yetkili servisimizde kurulum hizmeti verilmektedir.',
    },
    {
      question: 'Hangi yakıt tipini kullanmalıyım?',
      answer: 'Ürün özelliklerinde belirtilen oktan rating\'ine sahip benzin kullanılmalıdır. Çoğu model 95 oktan benzin ile çalışır.',
    },
    {
      question: 'Motorun bakım sıklığı nedir?',
      answer: 'Yılda en az bir kez yetkili serviste bakım yaptırılmalıdır. Yoğun kullanımda daha sık bakım önerilir.',
    },
    {
      question: 'Garanti kapsamı neleri içerir?',
      answer: '2 yıl üretici garanti kapsamındadır. Parça ve işçilik dahildir. Kullanım hatası garanti dışındadır.',
    },
    {
      question: 'Hangi botlarla uyumludur?',
      answer: 'Motor gücüne göre farklı bot boyutları için uygundur. Ürün sayfasında uyumlu bot bilgisi bulunmaktadır.',
    },
  ],
  'denizcilik-malzemeleri': [
    {
      question: 'Ürün orijinal mi?',
      answer: 'Evet, tüm ürünlerimiz yetkili distribütörden temin edilir ve orijinaldir.',
    },
    {
      question: 'Montaj hizmeti veriliyor mu?',
      answer: 'Yetkili servimizde ücretli montaj hizmeti mevcuttur.',
    },
    {
      question: 'Ürünün certificasyonları nelerdir?',
      answer: 'Ürünlerimiz uluslararası denizcilik standartlarına uygun sertifikalara sahiptir.',
    },
    {
      question: 'Nasıl saklanmalı?',
      answer: 'Kuru ve serin bir yerde, doğrudan güneş ışığından uzakta saklanmalıdır.',
    },
  ],
  'sanal-capa': [
    {
      question: 'Sanal çapa nasıl çalışır?',
      answer: 'GPS koordinatlarını kullanarak konumunu korur. Motor ile uyumlu çalışarak botun yerinde kalmasını sağlar.',
    },
    {
      question: 'Pil ömrü ne kadar?',
      answer: 'Tek şarjla ortalama 8-12 saat kullanım süresi vardır.',
    },
    {
      question: 'Tüm motorlarla uyumlu mu?',
      answer: 'Çoğu modern motorla uyumludur. Ürün sayfasında uyumlu motor listesi bulunmaktadır.',
    },
  ],
  'fiber-tabanli-botlar': [
    {
      question: 'Fiber tabanlı bot avantajları nelerdir?',
      answer: 'Daha dayanıklı, sert zeminde kullanıma uygun, daha hızlı planlama ve yakıt tasarrufu sağlar.',
    },
    {
      question: 'Alüminyum tabandan farkı nedir?',
      answer: 'Fiber taban daha hafiftir, çizilmelere karşı dayanıklıdır ve daha uzun ömürlüdür.',
    },
    {
      question: 'Motor gücü sınırı var mı?',
      answer: 'Her bot için önerilen maksimum motor gücü ürün özelliklerinde belirtilmiştir.',
    },
  ],
};

// Category-specific feature templates
const categoryFeatureTemplates: Record<string, string[]> = {
  'sisme-bot': [
    'Dayanıklı PVC malzeme, uzun ömürlü kullanım',
    'Katlanabilir tasarım, kolay saklama',
    'Hızlı kurulum, 15 dakikada hazır',
    'Çift cidarlı güvenli yapı',
    'Yük taşıma kapasitesi, dengeli sürüş',
  ],
  'tekne-motoru': [
    'Yakıt tasarruflu teknoloji',
    'Düşük emisyon, çevre dostu',
    'Güçlü performans, sorunsuz çalışma',
    'Kolay başlatma sistemi',
    'Uzun ömürlü parçalar',
  ],
  'sanal-capa': [
    'GPS konumlandırma sistemi',
    'Otomatik konum koruma',
    'Kolay kurulum ve kullanım',
    'Uzun pil ömrü',
    'Su geçirmez gövde',
  ],
};

/**
 * Generate enhanced description based on product category and attributes
 */
export function generateEnhancedDescription(product: ProductSEOData): EnhancedDescription {
  const categorySlug = product.categories[0]?.slug || '';
  const productName = product.name || '';

  // Extract basic info from description
  const baseDescription = product.shortDescription || product.description || '';

  // Generate overview
  const overview = generateOverview(productName, baseDescription, categorySlug);

  // Generate features based on category
  const features = generateFeatures(categorySlug, product.attributes);

  // Generate specifications from attributes
  const specifications = extractSpecifications(product.attributes);

  // Generate usage guide
  const usageGuide = generateUsageGuide(categorySlug);

  // Generate maintenance info
  const maintenance = generateMaintenanceInfo(categorySlug);

  return {
    overview,
    features,
    specifications,
    usageGuide,
    maintenance,
  };
}

/**
 * Generate product overview
 */
function generateOverview(name: string, baseDescription: string, categorySlug: string): string {
  const cleanDesc = stripHtml(baseDescription);

  if (cleanDesc && cleanDesc.length > 50) {
    return cleanDesc.substring(0, 300) + (cleanDesc.length > 300 ? '...' : '');
  }

  // Generic overview based on category
  const genericOverviews: Record<string, string> = {
    'sisme-bot': `${name}, dayanıklı PVC malzemeden üretilmiş, katlanabilir ve taşınabilir bir şişme bottur. Hem amatör hem profesyonel kullanım için uygundur. Kurulumu kolaydır ve çantasında kompakt şekilde saklanabilir.`,
    'tekne-motoru': `${name}, güvenilir performans ve yakıt verimliliği sunan dıştan takma bir motordur. Orta ve büyük boyutlu botlarla uyumludur. Düşük emisyon teknolojisi ile çevre dostudur.`,
    'sanal-capa': `${name}, GPS teknolojisi ile botunuzu konumunda tutan akıllı bir cihazdır. Rüzgar ve akıntıya karşı botunuzu sürüklenmekten korur.`,
    'default': `${name}, yüksek kalite standartlarında üretilmiş denizcilik ekipmanlarından biridir. Uzun ömürlü kullanım ve güvenilir performans sunar.`,
  };

  for (const [key, template] of Object.entries(genericOverviews)) {
    if (categorySlug.includes(key)) {
      return template;
    }
  }

  return genericOverviews.default;
}

/**
 * Generate features list based on category and attributes
 */
function generateFeatures(categorySlug: string, attributes?: any[]): string[] {
  const features: string[] = [];

  // Get category-specific features
  for (const [key, template] of Object.entries(categoryFeatureTemplates)) {
    if (categorySlug.includes(key)) {
      features.push(...template);
      break;
    }
  }

  // Extract features from attributes
  if (attributes && Array.isArray(attributes)) {
    attributes.forEach((attr) => {
      if (attr?.options && Array.isArray(attr.options)) {
        attr.options.forEach((option: string) => {
          const featureText = `${attr.name || ''}: ${option}`;
          if (!features.includes(featureText)) {
            features.push(featureText);
          }
        });
      }
    });
  }

  return features.slice(0, 8); // Max 8 features
}

/**
 * Extract specifications from product attributes
 */
export function extractSpecifications(attributes?: any[]): Record<string, string> {
  const specs: Record<string, string> = {};

  if (!attributes || !Array.isArray(attributes)) {
    return specs;
  }

  const priorityAttributes = [
    'uzunluk',
    'genislik',
    'yukseklik',
    'agirlik',
    'kapasite',
    'motor-gucu',
    'kisi-sayisi',
    'malzeme',
    'renk',
    'garanti',
    'length',
    'width',
    'height',
    'weight',
    'capacity',
    'power',
  ];

  attributes.forEach((attr) => {
    const slug = attr?.slug?.toLowerCase() || '';
    const name = attr?.name || '';
    const value = attr?.options?.[0] || attr?.value;

    if (!value) return;

    // Check if it's a priority attribute
    if (priorityAttributes.some((pa) => slug.includes(pa))) {
      specs[name] = String(value);
    }
  });

  return specs;
}

/**
 * Generate FAQ items based on product category
 */
export function generateFAQs(product: ProductSEOData): FAQItem[] {
  const categorySlug = product.categories[0]?.slug || '';

  // Find matching category FAQ template
  for (const [key, faqs] of Object.entries(categoryFAQTemplates)) {
    if (categorySlug.includes(key)) {
      return faqs;
    }
  }

  // Default FAQs
  return [
    {
      question: 'Ürün garantili mi?',
      answer: 'Evet, ürünlerimiz 2 yıl garanti kapsamındadır.',
    },
    {
      question: 'Kargo süresi ne kadar?',
      answer: 'Siparişleriniz 1-3 iş günü içerisinde kargoya verilir.',
    },
    {
      question: 'İade koşulları nelerdir?',
      answer: '14 gün içinde koşulsuz iade hakkınız bulunmaktadır.',
    },
  ];
}

/**
 * Generate specification groups for display
 */
export function generateSpecGroups(product: ProductSEOData): SpecGroup[] {
  const groups: SpecGroup[] = [];
  const specs = extractSpecifications(product.attributes);

  if (Object.keys(specs).length > 0) {
    groups.push({
      title: 'Teknik Özellikler',
      specs: Object.entries(specs).map(([label, value]) => ({ label, value })),
    });
  }

  // Add stock status
  groups.push({
    title: 'Stok Durumu',
    specs: [
      {
        label: 'Durum',
        value: product.stockStatus === 'instock' ? 'Stokta' : 'Stok Dışı',
      },
    ],
  });

  return groups;
}

/**
 * Generate usage guide based on category
 */
function generateUsageGuide(categorySlug: string): string {
  const guides: Record<string, string> = {
    'sisme-bot': `
      <p><strong>Kurulum:</strong> Botu paketinden çıkarın ve düz bir zeminde açın. Pompa ile havayı basın, tavsiye edilen basınca ulaşınca durun.</p>
      <p><strong>Kullanım:</strong> Motoru kıç takozuna monte edin. Güvenlik ekipmanlarınızı takın ve suya yaklaşın. Yük dağılımını dengeli tutun.</p>
      <p><strong>Saklama:</strong> Kullanım sonrası tatlı suyla yıkayın, kurulayın ve katlayarak çantasına koyun.</p>
    `,
    'tekne-motoru': `
      <p><strong>Kurulum:</strong> Botun kıçına motoru takın. Yakıt ve elektrik bağlantılarını kontrol edin. Soğuk hava başlatma sistemini kullanın.</p>
      <p><strong>Kullanım:</strong> Motoru ısınma süresiyle çalıştırın. Düşük devirden başlayarak hızlanan bir kullanım uygulayın. Yüksek devirde sürekli kullanımdan kaçının.</p>
    `,
    'sanal-capa': `
      <p><strong>Kurulum:</strong> Cihazı botun kısmına monte edin. GPS sinyalini almasını sağlayın. Mobil uygulama ile eşleştirin.</p>
      <p><strong>Kullanım:</strong> Konumunuzu ayarlayın ve 'Çapa At' modunu başlatın. Sistem otomatik olarak konumu koruyacaktır.</p>
    `,
  };

  for (const [key, guide] of Object.entries(guides)) {
    if (categorySlug.includes(key)) {
      return guide;
    }
  }

  return `
    <p>Ürün kullanımı için kutu içinden çıkan kullanım kılavuzunu inceleyiniz.</p>
    <p>Güvenlik kurallarına uyunuz ve gerekli koruma ekipmanlarını kullanınız.</p>
  `;
}

/**
 * Generate maintenance information
 */
function generateMaintenanceInfo(categorySlug: string): string {
  const maintenanceInfos: Record<string, string> = {
    'sisme-bot': `
      <p><strong>Düzenli Bakım:</strong> Her kullanımdan sonra tatlı suyla yıkayın, özellikle tuzlu suda kullanıldıysa.</p>
      <p><strong>Saklama:</strong> Güneş ışığından uzak, kuru ve serin bir yerde saklayın. Tam anlamıyla katlanarak taşıma çantasında muhafaza edin.</p>
      <p><strong>Kontroller:</strong> Basınç valflerini düzenli olarak kontrol edin. Yıpranma belirtileri varsa tamir kiti ile onarın.</p>
    `,
    'tekne-motoru': `
      <p><strong>Düzenli Bakım:</strong> Motor yağını sezon başında değiştirin. Yakıt filtresini temizleyin.</p>
      <p><strong>Saklama:</strong> Uzun süre kullanılmayacaksa yakıtı boşaltın. Motoru temizleyin ve korozyon önleyici sprey uygulayın.</p>
      <p><strong>Kontroller:</strong> Her kullanımdan önce pervane ve şaftları kontrol edin. Soğutma suyu girişini temiz tutun.</p>
    `,
    'sanal-capa': `
      <p><strong>Düzenli Bakım:</strong> Pil seviyelerini kontrol edin. Yazılım güncellemelerini takip edin.</p>
      <p><strong>Saklama:</strong> Su geçirmez kutusunda saklayın. Nemden uzak tutun.</p>
      <p><strong>Kontroller:</strong> GPS sinyal alımını düzenli kontrol edin. Konum doğruluğunu test edin.</p>
    `,
  };

  for (const [key, info] of Object.entries(maintenanceInfos)) {
    if (categorySlug.includes(key)) {
      return info;
    }
  }

  return `
    <p>Ürününüzü uzun ömürlü kullanmak için düzenli bakım yapınız.</p>
    <p>Kullanım kılavuzundaki bakım talimatlarına uyunuz.</p>
  `;
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Get category slug for template matching
 */
export function getCategorySlug(categories: ProductCategory[]): string {
  if (!categories || categories.length === 0) return 'default';
  return categories[0].slug?.toLowerCase() || 'default';
}

/**
 * Generate meta description from product data
 */
export function generateMetaDescription(product: ProductSEOData): string {
  const { name, shortDescription, description } = product;
  const baseDesc = shortDescription || description || '';

  if (baseDesc && baseDesc.length > 50) {
    const cleanDesc = stripHtml(baseDesc);
    return cleanDesc.substring(0, 160) + (cleanDesc.length > 160 ? '...' : '');
  }

  return `${name} en uygun fiyatlarla Neta Marine'de. Hızlı kargo, güvenilir alışveriş. Detaylı bilgi için tıklayın.`;
}
