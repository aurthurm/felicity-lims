<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from "@/stores/auth"
import Logo from "@/components/logo/Logo.vue"
import { Button } from "@/components/ui/button"
import { storeToRefs } from "pinia"
import { useConfirmDialog } from "@/composables/confirm_dialog"
import { Spinner } from "@/components/ui/spinner"

// Define emits
const emit = defineEmits<{
  (e: 'forgot'): void
}>()

// Initialize auth store
const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)
const { alert } = useConfirmDialog()

// Form state
const email = ref("")
const token = ref("")

// Reset form state
const resetForm = reactive({
  password: "",
  passwordc: ""
})

// Computed properties
const formIsValid = computed<boolean>(() => {
  if (!resetForm.password || !resetForm.passwordc) return false
  if (resetForm.password !== resetForm.passwordc) return false
  return true
})

// Event handlers
const submitForm = () => {
  if (!auth.value.receivedToken) {
    authStore.resetPasswordRequest(email.value)
  } else {
    authStore.validatePasswordResetToken(token.value)
  }
}

const changePassword = () => {
  if (!formIsValid.value) {
    alert({
      title: "Form Errors",
      description: "Please correct form errors.",
      confirmText: "OK",
      variant: "default",
    })
    return
  }
  authStore.resetPassword(resetForm.password, resetForm.passwordc)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white p-6">
    <div class="w-full max-w-md">
      <div class="relative -top-20 flex items-center justify-center">
        <Logo :styling="'h-36 w-36'" variant="dark" />
      </div>

      <!-- Card Container -->
      <div class="space-y-6 rounded-xl border border-border bg-background/95 p-8 shadow-2xl backdrop-blur-sm">
        <!-- Logo Section -->
        <div class="flex flex-col items-center space-y-2">
          <h2 class="mt-4 text-2xl font-bold text-foreground">Felicity LIMS</h2>
          <p class="text-sm text-muted-foreground">Password Recovery</p>
        </div>

        <!-- Email/Token Request Form -->
        <form v-if="!auth.resetData?.canReset" class="space-y-5" @submit.prevent="submitForm">
          <div v-if="!auth.receivedToken">
            <!-- Back to Login Button -->
            <div class="my-3">
              <Button
                type="button"
                variant="link"
                class="h-auto p-0 min-h-0"
                @click="emit('forgot')"
              >
                <span class="mr-1">←</span> Back to Login
              </Button>
            </div>

            <!-- Email Input -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-foreground" for="email">Email</label>
              <input
                id="email"
                v-model="email"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  !email ? 'border-border' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <!-- Received Token Link -->
            <div class="my-3 flex justify-end">
              <Button
                type="button"
                variant="link"
                class="h-auto p-0 min-h-0"
                @click="authStore.setReceivedResetToken(true)"
              >
                Received a Token?
              </Button>
            </div>

            <!-- Submit Button -->
            <button
              v-if="!auth.processing"
              :class="[
                'w-full rounded-lg px-4 py-2 font-medium transition-colors duration-200',
                email ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
              ]"
              :disabled="!email"
              type="submit"
            >
              Request Password Reset
            </button>
            <div v-else class="flex justify-center">
              <span class="inline-flex items-center gap-2">
                <Spinner class="size-4" />
                <span class="text-sm">Requesting...</span>
              </span>
            </div>
          </div>

          <!-- Token Input Section -->
          <div v-else class="space-y-5">
            <div class="my-3">
              <Button
                type="button"
                variant="link"
                class="h-auto p-0 min-h-0"
                @click="authStore.setReceivedResetToken(false)"
              >
                <span class="mr-1">←</span> Token not received
              </Button>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-foreground" for="token">Reset Token</label>
              <input
                id="token"
                v-model="token"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  !token ? 'border-border' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Enter your reset token"
                type="text"
              />
            </div>

            <button
              v-if="!auth.processing"
              :class="[
                'w-full rounded-lg px-4 py-2 font-medium transition-colors duration-200',
                token ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
              ]"
              :disabled="!token"
              type="submit"
            >
              Submit Token
            </button>
            <div v-else class="flex justify-center">
              <span class="inline-flex items-center gap-2">
                <Spinner class="size-4" />
                <span class="text-sm">Validating password reset token...</span>
              </span>
            </div>
          </div>
        </form>

        <!-- Password Reset Form -->
        <form v-else class="space-y-5" @submit.prevent="changePassword">
          <div class="mb-4 text-center">
            <p class="text-foreground">
              Hello <span class="rounded bg-secondary px-2 py-1">@{{ auth?.resetData?.username }}</span>
            </p>
            <p class="mt-1 text-sm text-foreground">Please enter your new password below</p>
          </div>

          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-foreground" for="password">New Password</label>
              <input
                id="password"
                v-model="resetForm.password"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  !formIsValid ? 'border-red-300' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Enter new password"
                type="password"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-foreground" for="passwordc">Confirm Password</label>
              <input
                id="passwordc"
                v-model="resetForm.passwordc"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  !formIsValid ? 'border-red-300' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Confirm new password"
                type="password"
              />
            </div>
          </div>

          <button
            v-if="!auth.processing"
            :class="[
              'w-full rounded-lg px-4 py-2 font-medium transition-colors duration-200',
              formIsValid ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
            ]"
            :disabled="!formIsValid"
            type="submit"
          >
            Reset Password
          </button>
          <div v-else class="flex justify-center">
            <span class="inline-flex items-center gap-2">
              <Spinner class="size-4" />
              <span class="text-sm">Resetting password...</span>
            </span>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-muted-foreground">
          Secure Password Recovery System
        </p>
      </div>
    </div>
  </div>
</template>
