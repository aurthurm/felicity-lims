<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia"

// Define emits
const emit = defineEmits<{
  (e: 'forgot'): void
}>()

// Initialize auth store
const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)

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
    alert("Please correct form errors")
    return
  }
  authStore.resetPassword(resetForm.password, resetForm.passwordc)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-accent p-6">
    <div class="w-full max-w-md">
      <div class="space-y-6 rounded-xl bg-background/95 p-8 shadow-2xl backdrop-blur-sm">
        <!-- Logo Section -->
        <div class="flex flex-col items-center space-y-2">
          <div class="relative flex h-16 w-16 items-center justify-center">
            <div class="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-accent transform rotate-45">
              <svg class="h-8 w-8 -rotate-45 transform text-primary-foreground" viewBox="0 0 512 512" fill="none">
                <path
                  d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-foreground">Felicity LIMS</h2>
          <p class="text-sm text-muted-foreground">Password Recovery</p>
        </div>

        <!-- Email/Token Request Form -->
        <form v-if="!auth.resetData?.canReset" class="space-y-5" @submit.prevent="submitForm">
          <div v-if="!auth.receivedToken">
            <!-- Back to Login Button -->
            <div class="mb-6">
              <button
                type="button"
                class="inline-flex items-center text-sm text-accent transition-colors duration-200 hover:text-indigo-800"
                @click="emit('forgot')"
              >
                <span class="mr-1">←</span> Back to Login
              </button>
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
            <div class="flex justify-end">
              <button
                type="button"
                class="text-sm text-accent transition-colors duration-200 hover:text-indigo-800"
                @click="authStore.setReceivedResetToken(true)"
              >
                Received a Token?
              </button>
            </div>

            <!-- Submit Button -->
            <button
              v-if="!auth.processing"
              :class="[
                'w-full rounded-lg px-4 py-2 font-medium text-primary-foreground transition-colors duration-200',
                email ? 'bg-accent hover:bg-accent' : 'cursor-not-allowed bg-muted'
              ]"
              :disabled="!email"
              type="submit"
            >
              Request Password Reset
            </button>
            <div v-else class="flex justify-center">
              <fel-loader message="Requesting..." />
            </div>
          </div>

          <!-- Token Input Section -->
          <div v-else class="space-y-5">
            <div class="mb-6">
              <button
                type="button"
                class="inline-flex items-center text-sm text-accent transition-colors duration-200 hover:text-indigo-800"
                @click="authStore.setReceivedResetToken(false)"
              >
                <span class="mr-1">←</span> Token not received
              </button>
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
                'w-full rounded-lg px-4 py-2 font-medium text-primary-foreground transition-colors duration-200',
                token ? 'bg-accent hover:bg-accent' : 'cursor-not-allowed bg-muted'
              ]"
              :disabled="!token"
              type="submit"
            >
              Submit Token
            </button>
            <div v-else class="flex justify-center">
              <fel-loader message="Validating password reset token..." />
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
              'w-full rounded-lg px-4 py-2 font-medium text-primary-foreground transition-colors duration-200',
              formIsValid ? 'bg-accent hover:bg-accent' : 'cursor-not-allowed bg-muted'
            ]"
            :disabled="!formIsValid"
            type="submit"
          >
            Reset Password
          </button>
          <div v-else class="flex justify-center">
            <fel-loader message="Resetting password..." />
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-primary-foreground/80">
          Secure Password Recovery System
        </p>
      </div>
    </div>
  </div>
</template>