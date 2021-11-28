<template>
    <!-- Contacts Table View -->
    <div class="overflow-x-auto mt-4">
        <button 
        @click="FormManager(true, {})"
        class="px-1 py-0 mb-4 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Contact</button>

        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Full Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Email</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Phone</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="cont in contacts"  :key="cont.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">{{cont.firstName}} {{cont.lastName}}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{cont.email}}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{cont.mobilePhone}}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View</button>
                    <button @click="FormManager(false, cont)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
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
            <input
              class="form-input mt-1 block w-full"
              autocomplete="off"
              v-model="contact.firstName"
              placeholder="Full Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Email</span>
            <input
              class="form-input mt-1 block w-full"
              autocomplete="off"
              v-model="contact.email"
              placeholder="Email ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Mobile Phone</span>
            <input
              class="form-input mt-1 block w-full"
              autocomplete="off"
              v-model="contact.mobilePhone"
              placeholder="Mobile Phone ..."
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
<script lang="ts">
import { useMutation } from '@urql/vue';
import { computed, ref} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import modal from '../../../components/SimpleModal.vue'
import { ADD_CLIENT_CONTACT, EDIT_CLIENT_CONTACT } from '../../../graphql/clients.mutations';
import { ActionTypes } from '../../../store/modules/client';
import { IClientContact } from '../../../models/client';
// import { IClientContact } from '../../../models/client';
export default {
    name: "tab-contacts",
    components: {
        modal,
    },
    props: {
      clientUid: Number,
    },
    setup(){
        let formTitle = ref('');
        let showContactModal = ref(false);
        let createContact = ref(false);
        let store = useStore();
        let router = useRoute();
        let contact = ref();

        // dispatch get contacts fo slients
        store.dispatch(ActionTypes.FETCH_CLIENT_CONTACTS, +router.query.clientUid!)

        const { executeMutation: createClientContact } = useMutation(ADD_CLIENT_CONTACT);
        const { executeMutation: updateClientContact } = useMutation(EDIT_CLIENT_CONTACT);
        
        function addClientContact() {
          createClientContact({clientUid: +router.query.clientUid!, firstName: contact.value.firstName, mobilePhone: contact.value.mobilePhone, email: contact.value.email, }).then((result) => {
            store.dispatch(ActionTypes.ADD_CREATED_CLIENT_CONTACT, result.data.createClientContact.clientContact);
          });
        }

        function editClientContact() {
          updateClientContact({ uid: contact.value.uid, firstName: contact.value.firstName, mobilePhone: contact.value.mobilePhone, email: contact.value.email,  }).then(
            (result) => {
              store.dispatch(ActionTypes.UPDATE_CREATED_CLIENT_CONTACT, result.data.updateClientContact.clientContact);
            },
          );
        }

        function FormManager(create: boolean, obj: IClientContact = {}) {
            createContact.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + " CONTACT";
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
        
        return {
            formTitle,
            FormManager,
            saveForm,
            showContactModal,
            createContact,
            contact,
            contacts: computed(() => store.getters.getClientContacts),
        }
    }
}
</script>