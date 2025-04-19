<script setup lang="ts">

</script>

<template>
    <!-- Cases Table View -->
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-gray-800 tracking-wider">ID</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Case Type</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Created</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Creator</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">C21-00032</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Viral Load</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">10/10/2020</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Amos T ...</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                    <button class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Cancel</button>
                </td>
            </tr>
            <tr>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">WB21-00032</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Viral Load</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">10/10/2020</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Amos T ...</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                    <button class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Cancel</button>
                </td>
            </tr>
            <tr>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">WB21-00032</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">TB</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">10/10/2020</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Amos T ...</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                    <button class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Cancel</button>
                </td>
            </tr>
            <tr>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">C21-00032</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">EID</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">10/10/2020</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">Amos T ...</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                    <button class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Cancel</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

</template>

