<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import modal from "@/components/ui/FelModal.vue";
import {
  DeleteClientContactDocument, DeleteClientContactMutation, DeleteClientContactMutationVariables,
  AddClientContactDocument, AddClientContactMutation, AddClientContactMutationVariables,
  EditClientContactDocument, EditClientContactMutation, EditClientContactMutationVariables,
} from "@/graphql/operations/clients.mutations";
import { useClientStore } from "@/stores/client";
import { ClientContactType } from "@/types/gql";
import useApiUtil  from "@/composables/api_util";
import * as shield from "@/guards";

let clientStore = useClientStore();
let router = useRoute();
const { withClientMutation } = useApiUtil();

const { clientContacts, fetchingClientContacts } = storeToRefs(clientStore);

let formTitle = ref("");
let showContactModal = ref(false);
let createContact = ref(false);
let contact = ref({} as ClientContactType);

const props = defineProps({
  clientUid: String,
});

// Load initial data
const clientUid = (router.query.clientUid as string) || '';
if (clientUid) {
  clientStore.fetchClientContacts(clientUid);
}

function addClientContact() {
  withClientMutation<AddClientContactMutation, AddClientContactMutationVariables>(AddClientContactDocument,
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
  withClientMutation<EditClientContactMutation, EditClientContactMutationVariables>(EditClientContactDocument,
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

function FormManager(create: boolean, obj: ClientContactType = {} as ClientContactType) {
  createContact.value = create;
  formTitle.value = (create ? "CREATE" : "EDIT") + " CONTACT";
  showContactModal.value = true;
  if (create) {
    Object.assign(contact, {} as ClientContactType);
  } else {
    Object.assign(contact.value, { ...obj });
  }
}

function saveForm() {
  if (createContact.value === true) addClientContact();
  if (!createContact.value === true) editClientContact();
  showContactModal.value = false;
}

const deleteClientContact = (contact: ClientContactType) => {
  withClientMutation<DeleteClientContactMutation, DeleteClientContactMutationVariables>(
    DeleteClientContactDocument,
    { uid: contact.uid },
    "deleteClientContact"
  ).then((res) => {
    if (res) {
      clientStore.deleteClientContact(contact.uid);
    }
  });
};
</script>

<template>
  <!-- Contacts Table View -->
  <div class="overflow-x-auto">
    <button v-show="shield.hasRights(shield.actions.CREATE, shield.objects.CLIENT)" @click="FormManager(true)"
      class="px-1 py-0 mb-4 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add Contact
    </button>

    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Full Name
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Email
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Phone
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
        </thead>
        <tbody class="bg-background">
          <tr v-for="cont in clientContacts" :key="cont.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div>
                  <div class="text-sm leading-5 text-foreground">
                    {{ cont.firstName }} {{ cont.lastName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ cont.email }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ cont.mobilePhone }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="FormManager(false, cont)"
                class="px-2 py-1 mr-2 border-border border text-orange-500rounded-smtransition duration-300 hover:bg-muted hover:text-primary-foreground focus:outline-none">
                Edit
              </button> <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="deleteClientContact(cont)"
                class="px-2 py-1 mr-2 border-destructive border text-orange-500rounded-smtransition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none">
                Deactivate
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingClientContacts" class="py-4 text-center">
        <fel-loader message="Fetching client contacts ..." />
      </div>
    </div>
  </div>

  <!-- Contact Edit Form Modal -->
  <fel-modal v-if="showContactModal" @close="showContactModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Full Name</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.firstName"
              placeholder="Full Name ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Email</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.email"
              placeholder="Email ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Mobile Phone</span>
            <input class="form-input mt-1 block w-full" autocomplete="off" v-model="contact.mobilePhone"
              placeholder="Mobile Phone ..." />
          </label>
        </div>

        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </fel-modal>
</template>
