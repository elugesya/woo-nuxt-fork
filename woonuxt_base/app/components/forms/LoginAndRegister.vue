<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { loginUser, isPending, registerUser, sendResetPasswordEmail } = useAuth()

enum FormView {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgotPassword',
}

const userInfo = ref<UserInfo>({ email: '', password: '', username: '' })
const formView = ref<FormView>(FormView.LOGIN)
const message = ref<string>('')
const errorMessage = ref<string>('')

const updateFormView = () => {
  // Reset error message on view change
  errorMessage.value = ''

  if (route.query.action === FormView.FORGOT_PASSWORD) {
    formView.value = FormView.FORGOT_PASSWORD
  } else if (route.query.action === FormView.REGISTER) {
    formView.value = FormView.REGISTER
  } else {
    formView.value = FormView.LOGIN
  }
}
watch(route, updateFormView, { immediate: true })

const login = async (userInfo: UserInfo) => {
  const { success, error } = await loginUser(userInfo)
  switch (error) {
    case 'invalid_username':
      errorMessage.value = t('error.invalidUsername')
      break
    case 'incorrect_password':
      errorMessage.value = t('error.incorrectPassword')
      break
    default:
      errorMessage.value = error ?? ''
      break
  }

  if (success) {
    errorMessage.value = ''
    message.value = t('account.loggingIn')
  }
}

const handleFormSubmit = async (userInfo: UserInfo) => {
  if (formView.value === FormView.REGISTER) {
    const { success, error } = await registerUser(userInfo)
    if (success) {
      errorMessage.value = ''
      message.value = t('account.accountCreated') + ' ' + t('account.loggingIn')
      setTimeout(() => {
        login(userInfo)
      }, 2000)
    } else {
      errorMessage.value = error ?? ''
    }
  } else if (formView.value === FormView.FORGOT_PASSWORD) {
    resetPassword(userInfo)
  } else {
    login(userInfo)
  }
}

const resetPassword = async (userInfo: UserInfo) => {
  const { success, error } = await sendResetPasswordEmail({ username: userInfo.email })
  if (success) {
    errorMessage.value = ''
    message.value = t('account.ifRegistered')
  } else {
    errorMessage.value = error ?? ''
  }
}

const navigate = (view: FormView) => {
  formView.value = view
  if (view === FormView.FORGOT_PASSWORD) {
    router.push({ query: { action: 'forgotPassword' } })
  } else if (view === FormView.REGISTER) {
    router.push({ query: { action: 'register' } })
  } else {
    router.push({ query: {} })
  }
}

const formTitle = computed(() => {
  if (formView.value === FormView.LOGIN) {
    return t('account.loginToAccount')
  } else if (formView.value === FormView.REGISTER) {
    return t('account.accountRegister')
  } else if (formView.value === FormView.FORGOT_PASSWORD) {
    return t('account.forgotPassword')
  }
})

const buttonText = computed(() => {
  if (formView.value === FormView.LOGIN) {
    return t('account.login')
  } else if (formView.value === FormView.REGISTER) {
    return t('account.register')
  } else if (formView.value === FormView.FORGOT_PASSWORD) {
    return t('account.sendPasswordResetEmail')
  }
})

const emailLabel = computed(() => (formView.value === FormView.REGISTER ? t('billing.email') : t('account.emailOrUsername')))
const usernameLabel = computed(() => (formView.value === FormView.LOGIN ? t('account.emailOrUsername') : t('account.username')))
const passwordLabel = computed(() => t('account.password'))

const inputPlaceholder = computed(() => {
  return {
    email: 'johndoe@email.com',
    username: formView.value === FormView.LOGIN ? 'johndoe@email.com' : 'johndoe',
    password: '********',
  }
})
</script>

<template>
  <div class="max-w-lg mx-auto my-16 min-h-[600px] text-center align-center flex flex-col justify-center">
    <div class="flex flex-col my-8">
      <h1 class="text-xl font-semibold lg:text-3xl">{{ formTitle }}</h1>
      <p v-if="formView === FormView.LOGIN" class="text-muted-foreground mt-2">
        {{ $t('account.noAccount') }}
        <a class="font-semibold cursor-pointer text-primary hover:underline" @click="navigate(FormView.REGISTER)"> {{ $t('account.accountRegister') }} </a>.
      </p>
      <p v-else-if="formView === FormView.REGISTER" class="text-muted-foreground mt-2">
        {{ $t('account.hasAccount') }}
        <a @click="navigate(FormView.LOGIN)" class="text-primary font-semibold cursor-pointer hover:underline">Sign in</a>.
      </p>
    </div>

    <LoginProviders class="mb-8" v-if="formView === FormView.LOGIN || formView === FormView.REGISTER" />

    <form @submit.prevent="handleFormSubmit(userInfo)" class="space-y-4">
      <p v-if="formView === FormView.FORGOT_PASSWORD" class="text-sm text-muted-foreground mb-8">{{ $t('account.enterEmailOrUsernameForReset') }}</p>
      
      <Input
        v-if="formView === FormView.REGISTER || formView === FormView.FORGOT_PASSWORD"
        id="email"
        v-model="userInfo.email"
        :placeholder="inputPlaceholder.email"
        autocomplete="email"
        type="text"
        required
      />
      
      <div v-if="formView !== FormView.FORGOT_PASSWORD" class="space-y-4">
        <Input 
          v-model="userInfo.username" 
          :placeholder="inputPlaceholder.username" 
          autocomplete="username" 
          type="text" 
          required 
        />
        <PasswordInput
          v-model="userInfo.password"
          :placeholder="passwordLabel"
          :autocomplete="formView === FormView.LOGIN ? 'current-password' : 'new-password'"
          :required="true"
        />
      </div>
      
      <Transition name="scale-y" mode="out-in">
        <Alert v-if="message" class="my-4">
          <AlertDescription v-html="message" />
        </Alert>
      </Transition>

      <!-- Submit button -->
      <CustomButton type="submit" class="w-full" size="lg" :disabled="isPending">
        <Spinner v-if="isPending" size="sm" class="mr-2" />
        <span>{{ buttonText }}</span>
      </CustomButton>

      <div class="flex items-center justify-between mt-4" v-if="formView === FormView.LOGIN">
        <button
          type="button"
          class="font-semibold cursor-pointer text-sm text-primary hover:underline"
          @click="navigate(FormView.FORGOT_PASSWORD)"
        >
          Forgot password?
        </button>
      </div>
    </form>

    <div class="my-8 text-center cursor-pointer hover:underline" @click="navigate(FormView.LOGIN)" v-if="formView === FormView.FORGOT_PASSWORD">
      {{ $t('account.backToLogin') }}
    </div>

    <Transition name="scale-y" mode="out-in">
      <Alert v-if="errorMessage" variant="destructive" class="my-4">
        <AlertDescription v-html="errorMessage" />
      </Alert>
    </Transition>
  </div>
</template>
