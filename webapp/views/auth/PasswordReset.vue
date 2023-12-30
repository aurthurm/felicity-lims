<script lang="ts" setup>
  import { computed, defineAsyncComponent, reactive, ref } from 'vue'
  const LoadingMessage = defineAsyncComponent(
    () => import("../../components/Spinners/LoadingMessage.vue")
  )
  import { useAuthStore } from "../../stores";
  import { storeToRefs } from "pinia";

  const emit = defineEmits(["forgot"]);

  const authStore = useAuthStore();
  const { auth } = storeToRefs(authStore);

  const email = ref("");
  const token = ref("");

  const submitForm = () => {
    if(!auth.value.receivedToken){
      authStore.resetPasswordRequest(email.value);
    } else {
      authStore.validatePasswordResetToken(token.value);
    }
  }
  
  // password form
  const resetForm = reactive({
    password: "",
    passwordc: "" 
  })

  const formIsValid = computed<boolean>(() => {
    if (!resetForm.password || !resetForm.passwordc) return false;
    if (resetForm.password !== resetForm.passwordc) return false;
    return true;
  })

  const changePassword = () => {
    if(!formIsValid){
      alert("Correct Form errrs")
    }
    authStore.resetPassword(resetForm.password, resetForm.passwordc);
  }

</script>

<template>
  <div class="flex justify-center items-center h-screen bg-sky-800 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-sm">
      <div class="flex justify-center items-center">
        <svg
          class="h-10 w-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-gray-700 font-semibold text-2xl">FelicityLIMS</span>
      </div>

      <form class="mt-4" @submit.prevent="submitForm" v-if="!auth.resetData?.canReset">
        <div v-if="!auth.receivedToken">
          <label class="block mt-3">        
           <div >
            <a class="px-2 py-1 border rounded-sm border-gray-300 text-gray-500 text-xs font-semibold hover:bg-gray-600 hover:border-none hover:text-gray-100" 
            @click.prevent="emit('forgot')">&larr; Back to Login</a>
           </div>
            <span class="text-gray-700 text-sm">Email</span>
            <input
              type="email"
              :class="[
                'form-input mt-1 block w-full rounded-sm focus:border-sky-800',
                {'border-red-500 focus:border-red-500': !email}
              ]"
              v-model="email"
              :disabled="auth.processing"
            />
          </label>      
          <div class="flex justify-between items-center mt-4">
            <div>
              <a class="block text-sm fontme text-indigo-700 hover:underline"
                @click.prevent="authStore.setReceivedResetToken(true)">Received a Token?</a
              >
            </div>
          </div>  
          <div class="mt-6">
            <button
              v-if="!auth.processing"
              type="submit"
              :class="[
                'py-2 px-4 text-center  rounded-sm w-full text-white text-sm ',
                {
                  'bg-gray-500': !email,
                  'bg-sky-800 hover:bg-sky-600': email
                }
              ]"
              :disabled="!email"
            >
              <span>Request Password Reset</span>
            </button>
            <div v-else class="text-center">
              <LoadingMessage message="Requesting ..." />
            </div>
          </div>
        </div>

        <!-- Token -->

        <div v-else>
          <label class="block mt-3">        
           <div >
            <a class="px-2 py-1 border rounded-sm border-gray-300 text-gray-500 text-xs font-semibold hover:bg-gray-600 hover:border-none hover:text-gray-100" 
            @click.prevent="authStore.setReceivedResetToken(false)">&larr; Token not received</a>
           </div>
            <span class="text-gray-700 text-sm">Reset Token</span>
            <input
              type="text"
              :class="[
                'form-input mt-1 block w-full rounded-sm focus:border-sky-800',
                {'border-red-500 focus:border-red-500': !token}
              ]"
              v-model="token"
              :disabled="auth.processing"
            />
          </label>   
          <div class="mt-6">
            <button
              v-if="!auth.processing"
              type="submit"
              :class="[
                'py-2 px-4 text-center  rounded-sm w-full text-white text-sm ',
                {
                  'bg-gray-500': !token,
                  'bg-sky-800 hover:bg-sky-600': token
                }
              ]"
              :disabled="!token"
            >
              <span>Submit token</span>
            </button>
            <div v-else class="text-center">
              <LoadingMessage message="Validating password reset token ..." />
            </div>
          </div>
        </div>
      </form>

      <!-- Passowrd reset -->
      <form class="mt-4" @submit.prevent="changePassword" v-else>
        <p class="mt-2">Hie <span class="bg-blue-100">@{{ auth?.resetData?.username }}</span>. Change your password</p>
        <label class="block mt-3">        
            <span class="text-gray-700 text-sm">Password</span>
            <input
              type="password"
              :class="[
                'form-input mt-1 block w-full rounded-sm focus:border-sky-800',
                {'border-red-500 focus:border-red-500': !formIsValid}
              ]"
              v-model="resetForm.password"
              :disabled="auth.processing"
            />
          </label>  
          <label class="block mt-3">
            <span class="text-gray-700 text-sm">Password Confirmation</span>
            <input
              type="password"
              :class="[
                'form-input mt-1 block w-full rounded-sm focus:border-sky-800',
                {'border-red-500 focus:border-red-500': !formIsValid}
              ]"
              v-model="resetForm.passwordc"
              :disabled="auth.processing"
            />
          </label>  
          <div class="mt-6">
            <button
              v-if="!auth.processing"
              type="submit"
              :class="[
                'py-2 px-4 text-center  rounded-sm w-full text-white text-sm ',
                {
                  'bg-gray-500': !formIsValid,
                  'bg-sky-800 hover:bg-sky-600': formIsValid
                }
              ]"
              :disabled="!formIsValid"
            >
              <span>Reset Password</span>
            </button>
            <div v-else class="text-center">
              <LoadingMessage message="Resetting password ..." />
            </div>
          </div>
      </form>
    </div>
  </div>
</template>
