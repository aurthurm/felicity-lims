<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router'
import useSampleComposable from "@/composables/samples";

const route = useRoute()
// const routerState = router.options.history.state;
let sampleUids = [];
if(window.history.state.sampleUids){
  sampleUids = JSON.parse(window.history.state.sampleUids ?? "")
} else {
  const uids = JSON.parse(route.query.sampleUids?.toString() ?? "");
  sampleUids =  Array.isArray(uids) ? uids : uids?.split(",");
}

const multiplier = ref(2)
const increment = (add: boolean = true) => {
    if(add){
        multiplier.value++
    }else{
        if(multiplier.value === 1) return;
        multiplier.value--
    }
}

const originalData = ref<string[]>([])
onMounted(async () => {
    console.log(sampleUids)
    originalData.value = await barcodeSamples(sampleUids)
})
const barcodes = computed(() => {
    return originalData.value.flatMap(bytes => Array(multiplier.value).fill(bytes));
})

const { barcodeSamples } = useSampleComposable();
const imgData = (data: string) => `data:application/png;base64,${data}`

const printDimensions = '40mm 30mm'; // bar, 40mm 55mm for QR code
const printBarcodes = () => {
    const printData = document.getElementById('printZoneOuter')!.innerHTML;
    const printWindow = window.open('', '_blank'); // , 'top=0,left=0,height=100%,width=100%'
    
    if (printWindow) {
        printWindow.document.open();
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
          </html>`);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
}

</script>

<template>
    <div class="mx-auto w-fit">
        <div class="flex justify-start items-center gap-x-1">
            <span class="bg-gray-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none" @click="() => increment(false)">-</span>
            <span class="mr-2">Count: {{ multiplier }}</span>
            <span class="bg-blue-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none" @click="() => increment(true)">+</span>
            <button type="submit" class="ml-4 px-2 py-1 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none" @click="printBarcodes()"><span>Print</span></button>
        </div>
    </div>

    <hr class="my-4">
    
    <div id="printZoneOuter">
        <div id="printZone" class="mx-auto w-fit overflow-y-scroll overscroll-contain max-h-[750px]">
            <div 
            v-for="(data, idx) in barcodes" 
            :key="idx"
            class="mb-1"><img :src="imgData(data)"></div>
        </div>
    </div>
</template>

<style scoped>
</style>