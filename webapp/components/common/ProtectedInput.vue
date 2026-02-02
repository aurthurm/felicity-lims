<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Input } from '@/components/ui/input'

interface Props {
  modelValue: string
  disabled?: boolean
  placeholder?: string
  requiredClicks?: number
  type?: string
  id?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: '',
  requiredClicks: 3,
  type: 'text',
  id: '',
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isProtected = ref(true)
const inputValue = ref(props.modelValue)
const inputRef = ref<HTMLInputElement>()
const clickCount = ref(0)
const clickTimeout = ref<ReturnType<typeof setTimeout>>()

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

const handleProtectedClick = (event: Event) => {
  if (props.disabled || !isProtected.value) return

  event.preventDefault()
  event.stopPropagation()

  clickCount.value++

  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value)
  }

  if (clickCount.value >= props.requiredClicks) {
    unlockInput()
    return
  }

  clickTimeout.value = setTimeout(() => {
    clickCount.value = 0
  }, 1500)
}

const unlockInput = async () => {
  isProtected.value = false
  clickCount.value = 0
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value)
  }
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

const lockInput = () => {
  isProtected.value = true
  clickCount.value = 0
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value)
  }
}

const handleInput = (value: string | number) => {
  const nextValue = String(value)
  inputValue.value = nextValue
  emit('update:modelValue', nextValue)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    lockInput()
    inputRef.value?.blur()
  } else if (event.key === 'Escape') {
    inputValue.value = props.modelValue
    emit('update:modelValue', props.modelValue)
    lockInput()
    inputRef.value?.blur()
  }
}

const handleBlur = () => {
  setTimeout(() => {
    lockInput()
  }, 200)
}
</script>

<template>
  <div class="grid gap-2">
    <div v-if="isProtected">
      <Input
        :id="id"
        :model-value="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        @click="handleProtectedClick"
      />
      <p v-if="!disabled" class="text-sm text-muted-foreground">
        Click {{ requiredClicks }} times quickly to unlock for editing.
      </p>
    </div>

    <div v-else>
      <Input
        ref="inputRef"
        :id="id"
        :model-value="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @update:model-value="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>
