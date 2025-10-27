<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Checkbox } from '~/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'

const checked = ref(false)
const selectValue = ref('')
const radioValue = ref('option1')

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
          <li>Label, Textarea, Checkbox - Form elementleri</li>
          <li>Select component - Dropdown menü</li>
          <li>Dialog & Sheet - Modal ve drawer</li>
          <li>Tabs - Tab navigasyonu</li>
          <li>RadioGroup - Radio button group</li>
        </ul>
      </CardContent>
    </Card>

    <!-- Label & Textarea -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Label & Textarea</h2>
      <div class="max-w-md space-y-4">
        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input id="username" placeholder="johndoe" />
        </div>
        <div class="space-y-2">
          <Label for="message">Message</Label>
          <Textarea id="message" placeholder="Type your message here..." />
        </div>
      </div>
    </section>

    <!-- Checkbox -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Checkbox</h2>
      <div class="flex items-center space-x-2">
        <Checkbox id="terms" v-model:checked="checked" />
        <Label for="terms" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </Label>
      </div>
      <p class="text-sm text-muted-foreground mt-2">Checked: {{ checked }}</p>
    </section>

    <!-- Select -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Select</h2>
      <div class="max-w-xs space-y-2">
        <Label>Select a fruit</Label>
        <Select v-model="selectValue">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="grape">Grape</SelectItem>
          </SelectContent>
        </Select>
        <p class="text-sm text-muted-foreground">Selected: {{ selectValue }}</p>
      </div>
    </section>

    <!-- RadioGroup -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Radio Group</h2>
      <RadioGroup v-model="radioValue">
        <div class="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label for="option1">Option 1</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <Label for="option2">Option 2</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="option3" />
          <Label for="option3">Option 3</Label>
        </div>
      </RadioGroup>
      <p class="text-sm text-muted-foreground mt-2">Selected: {{ radioValue }}</p>
    </section>

    <!-- Tabs -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Tabs</h2>
      <Tabs default-value="account" class="w-full max-w-md">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
        </TabsContent>
        <TabsContent value="password" class="space-y-4">
          <div class="space-y-2">
            <Label for="current">Current Password</Label>
            <Input id="current" type="password" />
          </div>
          <div class="space-y-2">
            <Label for="new">New Password</Label>
            <Input id="new" type="password" />
          </div>
        </TabsContent>
      </Tabs>
    </section>

    <!-- Dialog -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Dialog (Modal)</h2>
      <Dialog>
        <DialogTrigger as-child>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div class="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>

    <!-- Sheet -->
    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Sheet (Drawer)</h2>
      <div class="flex gap-4">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">Open Sheet (Right)</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="name-sheet">Name</Label>
                <Input id="name-sheet" placeholder="John Doe" />
              </div>
              <div class="grid gap-2">
                <Label for="email-sheet">Email</Label>
                <Input id="email-sheet" type="email" placeholder="john@example.com" />
              </div>
            </div>
            <Button class="w-full">Save Changes</Button>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">Open Sheet (Left)</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Browse through menu items</SheetDescription>
            </SheetHeader>
            <div class="grid gap-2 py-4">
              <Button variant="ghost" class="justify-start">Home</Button>
              <Button variant="ghost" class="justify-start">Products</Button>
              <Button variant="ghost" class="justify-start">About</Button>
              <Button variant="ghost" class="justify-start">Contact</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  </main>
</template>
