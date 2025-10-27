<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

const { viewer, customer } = useAuth()
const { t } = useI18n()

const loading = ref<boolean>(false)
const button = ref<{ text: string; variant: 'default' | 'success' | 'destructive' }>({ 
  text: t('account.updateDetails'), 
  variant: 'default' 
})

async function saveChanges() {
  loading.value = true
  button.value.text = t('account.updating')
  const firstName = customer.value.firstName
  const lastName = customer.value.lastName
  
  try {
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, firstName, lastName } })
    if (updateCustomer) {
      button.value = { text: t('account.updateSuccess'), variant: 'default' }
    }
  } catch (error) {
    button.value = { text: t('account.failed'), variant: 'destructive' }
  }

  loading.value = false

  setTimeout(() => {
    button.value = { text: t('account.updateDetails'), variant: 'default' }
  }, 2000)
}
</script>

<template>
  <Card v-if="customer">
    <form @submit.prevent="saveChanges">
      <CardHeader>
        <CardTitle>{{ $t('account.personalInfo') }}</CardTitle>
      </CardHeader>
      
      <CardContent class="grid gap-6 md:grid-cols-2">
        <div class="w-full space-y-2">
          <Label for="first-name">{{ $t('billing.firstName') }}</Label>
          <Input id="first-name" v-model="customer.firstName" placeholder="John" autocomplete="given-name" type="text" />
        </div>

        <div class="w-full space-y-2">
          <Label for="last-name">{{ $t('billing.lastName') }}</Label>
          <Input id="last-name" v-model="customer.lastName" placeholder="Doe" autocomplete="family-name" type="text" />
        </div>

        <div class="w-full space-y-2">
          <Label for="username">{{ $t('account.username') }} ({{ $t('general.readOnly') }})</Label>
          <Input id="username" v-model="customer.username" placeholder="johndoe" autocomplete="username" type="text" readonly />
        </div>

        <div class="w-full space-y-2">
          <Label for="email">{{ $t('billing.email') }}</Label>
          <Input id="email" v-model="customer.email" placeholder="johndoe@email.com" autocomplete="email" type="email" />
        </div>
      </CardContent>
      
      <CardFooter class="border-t bg-muted/50">
        <Button
          type="submit"
          :variant="button.variant"
          :disabled="loading"
          class="ml-auto"
        >
          <Spinner v-if="loading" size="sm" class="mr-2" />
          <span>{{ button.text }}</span>
        </Button>
      </CardFooter>
    </form>
  </Card>
</template>
