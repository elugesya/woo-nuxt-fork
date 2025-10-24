<template>
  <div class="relative mx-auto overflow-hidden">
    <img
      width="1400"
      height="800"
      class="object-contain w-full h-auto max-h-[500px] lg:max-h-[600px] xl:max-h-[700px]"
      src="/images/hero-1.webp"
      alt="Hero image"
      loading="eager"
      fetchpriority="high"
    />
    
    <!-- Gradient overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
    
    <!-- Content -->
    <div class="container absolute inset-0 flex flex-col items-start justify-center px-4 md:px-8">
      <div class="max-w-xl lg:max-w-2xl space-y-4 md:space-y-6">
        <h1 class="text-3xl font-bold text-white md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
          3 Taksit Fırsatı!
        </h1>
        <h2 class="text-xl font-semibold text-white/95 md:text-2xl lg:text-3xl">
          Tüm ürünlerde Peşin Fiyatına 3 Taksit
        </h2>
        <p class="text-base md:text-lg font-light text-white/90 max-w-md">
          Kısa süreli kampanyamızdan yararlanmak için hemen alışverişe başlayın!
        </p>
        <div class="pt-2 md:pt-4">
          <NuxtLink 
            class="inline-block px-8 py-3.5 text-base md:text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" 
            to="/urunler">
            Hemen Gözat
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
