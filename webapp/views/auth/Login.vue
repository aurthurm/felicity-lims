<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia"
import { useForm } from "vee-validate"
import { object, string } from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

defineOptions({ name: 'LoginView' })
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
const { handleSubmit, values } = useForm({
  validationSchema: authSchema,
})

// Handle form submission
const login = handleSubmit((values) => {
  authStore.authenticate(values)
})
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
          <p class="text-sm text-muted-foreground">Laboratory Information Management System</p>
        </div>

        <!-- Login Form -->
        <form v-if="!auth.isAuthenticated" class="space-y-5" @submit.prevent="login">
            <FormField name="username" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" :disabled="auth.processing" placeholder="Enter your username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="password" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" :disabled="auth.processing" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="my-3 flex justify-end">
              <Button type="button" variant="link" class="h-auto p-0 min-h-0" @click="emit('forgot')">
                Forgot your password?
              </Button>
            </div>

            <div>
              <Button
                v-if="!auth.processing"
                class="w-full"
                :disabled="!values.username || !values.password"
                type="submit"
              >
                Sign In
              </Button>
              <div v-else class="flex justify-center">
                <span class="inline-flex items-center gap-2">
                  <Spinner class="size-4" />
                  <span class="text-sm">Signing you in...</span>
                </span>
              </div>
            </div>
        </form>

        <!-- Loading State -->
        <span v-else class="inline-flex items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-sm">Redirecting, please wait...</span>
        </span>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-muted-foreground">
          Secure Laboratory Management Solution
        </p>
      </div>
    </div>
  </div>
</template>
