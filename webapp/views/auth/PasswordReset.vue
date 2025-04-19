<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia"

const emit = defineEmits(["forgot"])

const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)

const email = ref("")
const token = ref("")

const submitForm = () => {
  if (!auth.value.receivedToken) {
    authStore.resetPasswordRequest(email.value)
  } else {
    authStore.validatePasswordResetToken(token.value)
  }
}

const resetForm = reactive({
  password: "",
  passwordc: ""
})

const formIsValid = computed<boolean>(() => {
  if (!resetForm.password || !resetForm.passwordc) return false
  if (resetForm.password !== resetForm.passwordc) return false
  return true
})

const changePassword = () => {
  if (!formIsValid) {
    alert("Correct Form errors")
  }
  authStore.resetPassword(resetForm.password, resetForm.passwordc)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-800 to-indigo-900 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
        <!-- Logo Section -->
        <div class="flex flex-col items-center space-y-2">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center transform rotate-45">
              <svg class="w-8 h-8 text-white transform -rotate-45" viewBox="0 0 512 512" fill="none">
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
          <h2 class="text-2xl font-bold text-gray-800">Felicity LIMS</h2>
          <p class="text-muted-foreground text-sm">Password Recovery</p>
        </div>

        <!-- Email/Token Request Form -->
        <form class="space-y-5" @submit.prevent="submitForm" v-if="!auth.resetData?.canReset">
          <div v-if="!auth.receivedToken">
            <!-- Back to Login Button -->
            <div class="mb-6">
              <button
                type="button"
                @click="emit('forgot')"
                class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                <span class="mr-1">←</span> Back to Login
              </button>
            </div>

            <!-- Email Input -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700" for="email">Email</label>
              <input
                id="email"
                type="email"
                v-model="email"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  !email ? 'border-border' : 'border-border'
                ]"
                placeholder="Enter your email"
              />
            </div>

            <!-- Received Token Link -->
            <div class="flex justify-end">
              <button
                type="button"
                @click="authStore.setReceivedResetToken(true)"
                class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Received a Token?
              </button>
            </div>

            <!-- Submit Button -->
            <button
              v-if="!auth.processing"
              type="submit"
              :disabled="!email"
              :class="[
                'w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200',
                email ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              Request Password Reset
            </button>
            <div v-else class="flex justify-center">
              <LoadingMessage message="Requesting..." />
            </div>
          </div>

          <!-- Token Input Section -->
          <div v-else class="space-y-5">
            <div class="mb-6">
              <button
                type="button"
                @click="authStore.setReceivedResetToken(false)"
                class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                <span class="mr-1">←</span> Token not received
              </button>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700" for="token">Reset Token</label>
              <input
                id="token"
                type="text"
                v-model="token"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  !token ? 'border-border' : 'border-border'
                ]"
                placeholder="Enter your reset token"
              />
            </div>

            <button
              v-if="!auth.processing"
              type="submit"
              :disabled="!token"
              :class="[
                'w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200',
                token ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              Submit Token
            </button>
            <div v-else class="flex justify-center">
              <LoadingMessage message="Validating password reset token..." />
            </div>
          </div>
        </form>

        <!-- Password Reset Form -->
        <form v-else class="space-y-5" @submit.prevent="changePassword">
          <div class="text-center mb-4">
            <p class="text-gray-700">
              Hello <span class="bg-indigo-100 px-2 py-1 rounded">@{{ auth?.resetData?.username }}</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">Please enter your new password below</p>
          </div>

          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700" for="password">New Password</label>
              <input
                id="password"
                type="password"
                v-model="resetForm.password"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  !formIsValid ? 'border-red-300' : 'border-border'
                ]"
                placeholder="Enter new password"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700" for="passwordc">Confirm Password</label>
              <input
                id="passwordc"
                type="password"
                v-model="resetForm.passwordc"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  !formIsValid ? 'border-red-300' : 'border-border'
                ]"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            v-if="!auth.processing"
            type="submit"
            :disabled="!formIsValid"
            :class="[
              'w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200',
              formIsValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            Reset Password
          </button>
          <div v-else class="flex justify-center">
            <LoadingMessage message="Resetting password..." />
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-white/80">
          Secure Password Recovery System
        </p>
      </div>
    </div>
  </div>
</template>