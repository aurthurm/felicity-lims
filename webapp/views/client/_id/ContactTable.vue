<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  DeleteClientContactDocument,
  DeleteClientContactMutation,
  DeleteClientContactMutationVariables,
  AddClientContactDocument,
  AddClientContactMutation,
  AddClientContactMutationVariables,
  EditClientContactDocument,
  EditClientContactMutation,
  EditClientContactMutationVariables,
} from '@/graphql/operations/clients.mutations';
import { useClientStore } from '@/stores/client';
import { ClientContactType } from '@/types/gql';
import useApiUtil from '@/composables/api_util';
import * as shield from '@/guards';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import Modal from '@/components/ui/Modal.vue';
import ContactForm from '@/components/client/ContactForm.vue';

const clientStore = useClientStore();
const router = useRoute();
const { withClientMutation } = useApiUtil();

const { clientContacts, fetchingClientContacts } = storeToRefs(clientStore);

const formTitle = ref('');
const showContactModal = ref(false);
const createContact = ref(false);
const contact = ref<ClientContactType>({} as ClientContactType);

const props = defineProps({
  clientUid: String,
});

// Load initial data
const clientUid = (router.query.clientUid as string) || '';
if (clientUid) {
  clientStore.fetchClientContacts(clientUid);
}

function addClientContact(payload: {
  firstName: string;
  email?: string;
  mobilePhone?: string;
}) {
  withClientMutation<AddClientContactMutation, AddClientContactMutationVariables>(
    AddClientContactDocument,
    {
      payload: {
        clientUid: router.query.clientUid as string,
        firstName: payload.firstName,
        mobilePhone: payload.mobilePhone,
        email: payload.email,
      },
    },
    'createClientContact'
  ).then((res) => clientStore.addClientContact(res));
}

function editClientContact(payload: {
  firstName: string;
  email?: string;
  mobilePhone?: string;
}) {
  withClientMutation<EditClientContactMutation, EditClientContactMutationVariables>(
    EditClientContactDocument,
    {
      uid: contact.value.uid,
      payload: {
        clientUid: router.query.clientUid as string,
        firstName: payload.firstName,
        mobilePhone: payload.mobilePhone,
        email: payload.email,
      },
    },
    'updateClientContact'
  ).then((res) => clientStore.updateClientContact(res));
}

function FormManager(create: boolean, obj: ClientContactType = {} as ClientContactType) {
  createContact.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' CONTACT';
  showContactModal.value = true;
  contact.value = create ? ({} as ClientContactType) : { ...obj };
}

function onFormSubmit(payload: {
  firstName: string;
  email: string | undefined;
  mobilePhone: string | undefined;
}) {
  if (createContact.value) addClientContact(payload);
  else editClientContact(payload);
  showContactModal.value = false;
}

function onFormClose() {
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
      <Table class="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Full Name
            </TableHead>
            <TableHead class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Email
            </TableHead>
            <TableHead class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Phone
            </TableHead>
            <TableHead class="px-1 py-1 border-b-2 border-border"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="bg-background">
          <TableRow v-for="cont in clientContacts" :key="cont.uid">
            <TableCell class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div>
                  <div class="text-sm leading-5 text-foreground">
                    {{ cont.firstName }} {{ cont.lastName }}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ cont.email }}</div>
            </TableCell>
            <TableCell class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ cont.mobilePhone }}</div>
            </TableCell>
            <TableCell class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="FormManager(false, cont)"
                class="px-2 py-1 mr-2 border-border border text-orange-500rounded-smtransition duration-300 hover:bg-muted hover:text-primary-foreground focus:outline-none">
                Edit
              </button> <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                @click="deleteClientContact(cont)"
                class="px-2 py-1 mr-2 border-destructive border text-orange-500rounded-smtransition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none">
                Deactivate
              </button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="!fetchingClientContacts && clientContacts.length === 0" :colspan="4">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No contacts found</EmptyTitle>
                  <EmptyDescription>Add a client contact to get started.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
      <div v-if="fetchingClientContacts" class="py-4 text-center">
        <span class="inline-flex items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-sm">Fetching client contacts ...</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Contact form modal (shadcn Form + vee-validate) -->
  <Modal v-if="showContactModal" @close="onFormClose">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <ContactForm
        :contact="contact"
        :create="createContact"
        @submit="onFormSubmit"
        @close="onFormClose"
      />
    </template>
  </Modal>
</template>
