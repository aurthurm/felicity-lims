<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia"
import { useField, useForm } from "vee-validate"
import { object, string } from "yup"

// Lazy load components
const Logo = defineAsyncComponent(
  () => import("@/components/logo/Logo.vue")
)

// Define emits
const emit = defineEmits<{
  (e: 'forgot'): void;
}>()

// Initialize auth store
const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)

// Form validation schema
const authSchema = object({
  username: string().required("Username is required"),
  password: string().required("Password is required"),
})

// Form setup
const { handleSubmit, errors } = useForm({
  validationSchema: authSchema,
})

const { value: username } = useField("username")
const { value: password } = useField("password")

// Handle form submission
const login = handleSubmit((values) => {
  authStore.authenticate(values)
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-accent p-6">
    <div class="w-full max-w-md">
      <div class="relative -top-20 flex items-center justify-center">
        <Logo :styling="'h-36 w-36'" />
      </div>

      <!-- Card Container -->
      <div class="space-y-6 rounded-xl bg-background/95 p-8 shadow-2xl backdrop-blur-sm">
        <!-- Logo Section -->
        <div class="flex flex-col items-center space-y-2">
          <h2 class="mt-4 text-2xl font-bold text-foreground">Felicity LIMS</h2>
          <p class="text-sm text-muted-foreground">Laboratory Information Management System</p>
        </div>

        <!-- Login Form -->
        <form v-if="!auth.isAuthenticated" class="space-y-5" @submit.prevent="login">
          <!-- Username Field -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-foreground" for="username">
              Username
            </label>
            <div class="relative">
              <input
                id="username"
                v-model="username"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  errors?.username ? 'border-destructive' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Enter your username"
                type="text"
              />
              <div v-if="errors?.username" class="absolute right-0 top-0 flex h-full items-center pr-3">
                <svg
                  class="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p v-if="errors?.username" class="mt-1 text-xs text-destructive">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-foreground" for="password">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :class="[
                  'w-full rounded-lg border px-4 py-2 outline-none transition-colors duration-200',
                  'focus:border-accent focus:ring-2 focus:ring-indigo-200',
                  errors?.password ? 'border-destructive' : 'border-border'
                ]"
                :disabled="auth.processing"
                placeholder="Enter your password"
                type="password"
              />
              <div v-if="errors?.password" class="absolute right-0 top-0 flex h-full items-center pr-3">
                <svg
                  class="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p v-if="errors?.password" class="mt-1 text-xs text-destructive">{{ errors.password }}</p>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <button
              class="text-sm text-accent transition-colors duration-200 hover:text-indigo-800"
              type="button"
              @click="emit('forgot')"
            >
              Forgot your password?
            </button>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              v-if="!auth.processing"
              :class="[
                'w-full rounded-lg px-4 py-2 font-medium text-primary-foreground transition-colors duration-200',
                username && password
                  ? 'bg-accent hover:bg-accent'
                  : 'cursor-not-allowed bg-muted'
              ]"
              :disabled="!username || !password"
              type="submit"
            >
              Sign In
            </button>
            <div v-else class="flex justify-center">
              <fel-loader message="Signing you in..." />
            </div>
          </div>
        </form>

        <!-- Loading State -->
        <fel-loader v-else message="Redirecting, please wait..." />
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-primary-foreground/80">
          Secure Laboratory Management Solution
        </p>
      </div>
    </div>
  </div>
</template>