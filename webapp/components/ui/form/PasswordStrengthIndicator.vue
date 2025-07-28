<script setup lang="ts">
import { computed } from "vue";

interface Props {
  password: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true,
});

// Password strength calculation
const passwordStrength = computed(() => {
  const password = props.password;
  
  if (!password) {
    return { score: 0, label: "No password", color: "gray", percentage: 0 };
  }

  let score = 0;
  const checks = {
    length: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    symbols: false,
    noRepeats: false,
    noSequential: false,
  };
  
  // Length checks
  if (password.length >= 8) {
    score += 1;
    checks.length = true;
  }
  if (password.length >= 12) score += 1;
  
  // Character type checks
  if (/[a-z]/.test(password)) {
    score += 1;
    checks.lowercase = true;
  }
  if (/[A-Z]/.test(password)) {
    score += 1;
    checks.uppercase = true;
  }
  if (/\d/.test(password)) {
    score += 1;
    checks.numbers = true;
  }
  if (/[^a-zA-Z\d]/.test(password)) {
    score += 1;
    checks.symbols = true;
  }
  
  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
    checks.noRepeats = true;
  }
  if (!/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    score += 1;
    checks.noSequential = true;
  }

  const percentage = Math.min((score / 8) * 100, 100);

  if (score <= 2) {
    return { score, label: "Weak", color: "red", percentage, checks };
  } else if (score <= 4) {
    return { score, label: "Fair", color: "orange", percentage, checks };
  } else if (score <= 6) {
    return { score, label: "Good", color: "yellow", percentage, checks };
  } else {
    return { score, label: "Strong", color: "green", percentage, checks };
  }
});

const strengthColor = computed(() => {
  const colors = {
    gray: "#6b7280",
    red: "#ef4444",
    orange: "#f97316", 
    yellow: "#eab308",
    green: "#22c55e",
  };
  return colors[passwordStrength.value.color as keyof typeof colors];
});

const strengthBars = computed(() => {
  return Array.from({ length: 4 }, (_, index) => ({
    filled: index < Math.ceil(passwordStrength.value.score / 2),
    color: strengthColor.value,
  }));
});
</script>

<template>
  <div v-if="password" class="space-y-2">
    <!-- Strength Bar -->
    <div class="flex space-x-1">
      <div
        v-for="(bar, index) in strengthBars"
        :key="index"
        class="flex-1 h-2 rounded-full transition-all duration-300"
        :style="{
          backgroundColor: bar.filled ? bar.color : '#e5e7eb'
        }"
      />
    </div>
    
    <!-- Strength Label -->
    <div class="flex items-center justify-between text-sm">
      <span
        class="font-medium transition-colors duration-300"
        :style="{ color: strengthColor }"
      >
        Password Strength: {{ passwordStrength.label }}
      </span>
      <span class="text-muted-foreground">
        {{ Math.round(passwordStrength.percentage) }}%
      </span>
    </div>

    <!-- Detailed Requirements -->
    <div v-if="showDetails" class="space-y-1 text-xs">
      <div class="text-muted-foreground font-medium mb-2">Requirements:</div>
      
      <div class="grid grid-cols-2 gap-1">
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.length ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.length ? 'text-green-600' : 'text-red-600'">
            At least 8 characters
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.lowercase ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.lowercase ? 'text-green-600' : 'text-red-600'">
            Lowercase letter
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.uppercase ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.uppercase ? 'text-green-600' : 'text-red-600'">
            Uppercase letter
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.numbers ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.numbers ? 'text-green-600' : 'text-red-600'">
            Number
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.symbols ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.symbols ? 'text-green-600' : 'text-red-600'">
            Special character
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <i
            :class="[
              passwordStrength.checks.noRepeats ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
            ]"
          />
          <span :class="passwordStrength.checks.noRepeats ? 'text-green-600' : 'text-red-600'">
            No repeated chars
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-colors {
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>