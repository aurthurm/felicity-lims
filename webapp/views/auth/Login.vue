<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from "@/stores"
import { storeToRefs } from "pinia"
import { useField, useForm } from "vee-validate"
import { object, string } from "yup"
const Logo = defineAsyncComponent(
  () => import("@/components/logo/Logo.vue")
)
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

const emit = defineEmits(["forgot"])

const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)

const authSchema = object({
  username: string().required("Username is required"),
  password: string().required("Password is required"),
})

const { handleSubmit, errors } = useForm({
  validationSchema: authSchema,
})

const { value: username } = useField("username")
const { value: password } = useField("password")

const login = handleSubmit((values) => {
  authStore.authenticate(values)
})
</script>

<template>
  
  <div class="min-h-screen bg-gradient-to-br from-sky-800 to-indigo-900 flex items-center justify-center p-6">


    <div class="w-full max-w-md">
      
      <div class="relative flex items-center justify-center -top-20">
        <Logo :styling="'h-36 w-36'" />
      </div>

      <!-- Card Container -->
      <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
        <!-- Logo Section -->
        <div class="flex flex-col items-center space-y-2">
          <h2 class="mt-4 text-2xl font-bold text-gray-800">Felicity LIMS</h2>
          <p class="text-gray-500 text-sm">Laboratory Information Management System</p>
        </div>

        <!-- Login Form -->
        <form v-if="!auth.isAuthenticated" @submit.prevent="login" class="space-y-5">
          <!-- Username Field -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700" for="username">
              Username
            </label>
            <div class="relative">
              <input
                id="username"
                type="text"
                v-model="username"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  errors?.username ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Enter your username"
              />
              <div v-if="errors?.username" class="absolute right-0 top-0 h-full pr-3 flex items-center">
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p v-if="errors?.username" class="text-red-500 text-xs mt-1">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700" for="password">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                type="password"
                v-model="password"
                :disabled="auth.processing"
                :class="[
                  'w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
                  errors?.password ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Enter your password"
              />
              <div v-if="errors?.password" class="absolute right-0 top-0 h-full pr-3 flex items-center">
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p v-if="errors?.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="emit('forgot')"
              class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              v-if="!auth.processing"
              type="submit"
              :disabled="!username || !password"
              :class="[
                'w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200',
                username && password
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              Sign In
            </button>
            <div v-else class="flex justify-center">
              <LoadingMessage message="Signing you in..." />
            </div>
          </div>
        </form>

        <!-- Loading State -->
        <LoadingMessage v-else message="Redirecting, please wait..." />
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-white/80">
          Secure Laboratory Management Solution
        </p>
      </div>
    </div>
  </div>
</template>