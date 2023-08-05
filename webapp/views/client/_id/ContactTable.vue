<script setup lang="ts">
import LoadingMessage from "../../../components/Spinners/LoadingMessage.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import modal from "../../../components/SimpleModal.vue";
import {
  ADD_CLIENT_CONTACT,
  EDIT_CLIENT_CONTACT,
  DELETE_CLIENT_CONTACT,
} from "../../../graphql/operations/clients.mutations";
import { useClientStore } from "../../../stores";
import { IClientContact } from "../../../models/client";
import { useApiUtil } from "../../../composables";
import * as shield from "../../../guards";

let clientStore = useClientStore();
let router = useRoute();
const { withClientMutation } = useApiUtil();

const { clientContacts, fetchingClientContacts } = storeToRefs(clientStore);

let formTitle = ref("");
let showContactModal = ref(false);
let createContact = ref(false);
let contact = ref({} as IClientContact);

const props = defineProps({
  clientUid: String,
});

// dispatch get contacts fo slients
clientStore.fetchClientContacts(router.query.clientUid!);

function addClientContact() {
  withClientMutation(
    ADD_CLIENT_CONTACT,
    {
      payload: {
        clientUid: router.query.clientUid!,
        firstName: contact.value.firstName,
        mobilePhone: contact.value.mobilePhone,
        email: contact.value.email
      }
    },
    "createClientContact"
  ).then((res) => clientStore.addClientContact(res));
}

function editClientContact() {
  withClientMutation(
    EDIT_CLIENT_CONTACT,
    {
      uid: contact.value.uid,
      payload: {
        clientUid: router.query.clientUid!,
        firstName: contact.value.firstName,
        mobilePhone: contact.value.mobilePhone,
        email: contact.value.email
      }
    },
    "updateClientContact"
  ).then((res) => clientStore.updateClientContact(res));
}

function FormManager(create: boolean, obj: IClientContact = {} as IClientContact) {
  createContact.value = create;
  formTitle.value = (create ? "CREATE" : "EDIT") + " CONTACT";
  showContactModal.value = true;
  if (create) {
    Object.assign(contact, {} as IClientContact);
  } else {
    Object.assign(contact.value, { ...obj });
  }
}

function saveForm() {
  if (createContact.value === true) addClientContact();
  if (!createContact.value === true) editClientContact();
  showContactModal.value = false;
}

function deleteClientContact(uid: string) {
  withClientMutation(DELETE_CLIENT_CONTACT, { uid },
    "deleteClientContact"
  ).then((res) => clientStore.deleteClientContact(res?.uid));
}
</script>

<template>
  <!-- Contacts Table View -->
  <div class="overflow-x-auto">
    <button v-show="shield.hasRights(shield.actions.CREATE, shield.objects.CLIENT)" @click="FormManager(true)"
      class="px-1 py-0 mb-4 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
      Add Contact
    </button>

    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Full Name
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Email
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Phone
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="cont in clientContacts" :key="cont.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div>
                  <div class="text-sm leading-5 text-gray-800">
                    {{ cont.firstName }} {{ cont.lastName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">{{ cont.email }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">{{ cont.mobilePhone }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="FormManager(false, cont)"
                class="px-2 py-1 mr-2 border-gray-500 border text-orange-500rounded-smtransition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                Edit
              </button> <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="deleteClientContact(cont?.uid!)"
                class="px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">
                Deactivate
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingClientContacts" class="py-4 text-center">
        <LoadingMessage message="Fetching client contacts ..." />
      </div>
    </div>
  </div>

  <!-- Contact Edit Form Modal -->
  <modal v-if="showContactModal" @close="showContactModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Full Name</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.firstName"
              placeholder="Full Name ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Email</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.email"
              placeholder="Email ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Mobile Phone</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.mobilePhone"
              placeholder="Mobile Phone ..." />
          </label>
        </div>

        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>
