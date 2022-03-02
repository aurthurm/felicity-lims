<template>
  <div class="mt-4">
    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3">
        Countries
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'country')"
        >
          Add Country
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="c in countries"
            :key="c.uid"
            :class="country?.uid === c.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('country', c)"
              class="font-semibold text-gray-700"
            >
              <span>{{ c.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, 'country', c)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-4" v-if="isCountrySelected()">
        Provinces
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'province')"
        >
          Add Province
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="p in provinces"
            :key="p.uid"
            :class="province?.uid === p.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('province', p)"
              class="font-semibold text-gray-700"
            >
              <span>{{ p.name }}</span>
              
            </a>
            <a href="#" @click="FormManager(false, 'province', p)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-5" v-if="isProvinceSelected()">
        Districts
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'district')"
        >
          Add District
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="d in districts"
            :key="d.uid"
            :class="district?.uid === d.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('district', d)"
              class="font-semibold text-gray-700"
            >
              <span>{{ d.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, 'district', d)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.code"
              placeholder="Code ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>

<style lang="postcss" scoped>
  .scroll-section {
    height: 70vh;
  }

  .tab-active {
    border-bottom: 2px solid rgb(194, 193, 193);
    color: rgb(37, 37, 37) !important;
  }

  .c-active {
    background-color: lightblue;
  }
</style>

<script src="./index.component.ts" lang="ts"></script>>
