<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import useSampleComposable from "@/composables/samples"

// Initialize route and composables
const route = useRoute()
const { barcodeSamples } = useSampleComposable()

// Parse sample UIDs from route or history state
const sampleUids = computed(() => {
  if (window.history.state.sampleUids) {
    return JSON.parse(window.history.state.sampleUids)
  }
  const uids = JSON.parse(route.query.sampleUids?.toString() ?? "")
  return Array.isArray(uids) ? uids : uids?.split(",")
})

// Barcode multiplier state
const multiplier = ref(2)

// Event handlers
const increment = (add: boolean = true) => {
  if (add) {
    multiplier.value++
  } else {
    if (multiplier.value === 1) return
    multiplier.value--
  }
}

// Barcode data state
const originalData = ref<string[]>([])

// Load barcode data on mount
onMounted(async () => {
  originalData.value = await barcodeSamples(sampleUids.value)
})

// Computed properties
const barcodes = computed(() => {
  return originalData.value.flatMap(bytes => Array(multiplier.value).fill(bytes))
})

// Utility functions
const imgData = (data: string) => `data:application/png;base64,${data}`

// Print configuration
const printDimensions = '40mm 30mm' // bar, 40mm 55mm for QR code

// Print handlers
const printBarcodes = () => {
  const printData = document.getElementById('printZoneOuter')!.innerHTML
  const printWindow = window.open('', '_blank')
  
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @media print {
              @page {
                size: ${printDimensions};
                margin: 0;
              }
              body * {
                visibility: hidden;
              }
              #printZone, #printZone * {
                visibility: visible;
              }
              #printZone {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          ${printData}
        </body>
      </html>`)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }
}
</script>

<template>
  <div class="mx-auto w-fit">
    <div class="flex items-center justify-start gap-x-1">
      <span 
        class="select-none rounded-sm bg-muted px-2 py-0 text-lg font-semibold hover:cursor-pointer" 
        @click="() => increment(false)"
      >
        -
      </span>
      <span class="mr-2">Count: {{ multiplier }}</span>
      <span 
        class="select-none rounded-sm bg-accent px-2 py-0 text-lg font-semibold hover:cursor-pointer" 
        @click="() => increment(true)"
      >
        +
      </span>
      <button 
        type="submit" 
        class="ml-4 rounded-sm border border-destructive px-2 py-1 text-orange-500 transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none" 
        @click="printBarcodes()"
      >
        <span>Print</span>
      </button>
    </div>
  </div>

  <hr class="my-4">
  
  <div id="printZoneOuter">
    <div id="printZone" class="mx-auto w-fit max-h-[750px] overflow-y-scroll overscroll-contain">
      <div 
        v-for="(data, idx) in barcodes" 
        :key="idx"
        class="mb-1"
      >
        <img :src="imgData(data)">
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>