<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'

useSeoMeta({
  title: 'ShadCN Test Sayfası',
  description: 'ShadCN UI componentlerini test etmek için oluşturulmuş sayfa',
})
</script>

<template>
  <main class="container mx-auto py-10">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">ShadCN UI Test Sayfası</h1>
      <p class="text-muted-foreground">Tüm ShadCN componentlerini bu sayfada test edebilirsiniz.</p>
    </div>

    <!-- Buttons -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Buttons</h2>
      <div class="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div class="flex flex-wrap gap-4 mt-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <Icon name="mdi:heart" />
        </Button>
      </div>
    </section>

    <!-- Badges -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Badges</h2>
      <div class="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </section>

    <!-- Inputs -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Inputs</h2>
      <div class="max-w-md space-y-4">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Input placeholder="Disabled" disabled />
      </div>
    </section>

    <!-- Cards -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Cards</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content area. You can put any content here.</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ürün Kartı</CardTitle>
            <CardDescription>Örnek bir ürün kartı</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <p class="text-2xl font-bold">₺1,299.00</p>
              <Badge>Stokta</Badge>
            </div>
          </CardContent>
          <CardFooter class="gap-2">
            <Button class="flex-1">Sepete Ekle</Button>
            <Button variant="outline" size="icon">
              <Icon name="mdi:heart-outline" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Kartı</CardTitle>
            <CardDescription>Giriş yapın</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Input placeholder="Email" type="email" />
            <Input placeholder="Şifre" type="password" />
          </CardContent>
          <CardFooter>
            <Button class="w-full">Giriş Yap</Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- Info Box -->
    <Card class="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle class="text-blue-900">✅ ShadCN Kurulumu Başarılı!</CardTitle>
        <CardDescription class="text-blue-700">
          Tüm temel componentler çalışıyor ve kullanıma hazır.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul class="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Button component - 6 variant, 4 size</li>
          <li>Badge component - 4 variant</li>
          <li>Card component - Header, Title, Description, Content, Footer</li>
          <li>Input component - Responsive ve accessible</li>
        </ul>
      </CardContent>
    </Card>
  </main>
</template>
