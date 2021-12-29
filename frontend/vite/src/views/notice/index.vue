<template>

    <h1 class="h1 my-4 font-bold text-dark-700 mr-4">Notice Manager</h1>
      <button
      @click.prevent="FormManager(true)"
        class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
        New Notice</button>

    <!-- Notice Table View -->
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Notice Title</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Expiration</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="notice in notices" :key="notice.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="flex items-center">
                      <div class="text-sm leading-5 text-gray-800" @click="FormManager(false, notice)">
                        {{ notice.title }}
                      </div>
                  </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">{{ notice.status }}</td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-grey-500 border text-grey-500 rounded transition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none"
                    @click="FormManager(false, notice)">View/Edit</button>
                    <button class="px-2 py-1 mr-2  ml-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-100 hover:text-black-700 focus:outline-none"
                    @click="deleteNotice(notice.uid)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Notice Form Modal -->
  <modal v-if="modalState.showModal" @close="modalState.showModal = false">
    <template v-slot:header>
      <h3>{{ modalState.title }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Title</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="modalState.notice.title"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Body</span>
              <textarea
                class="form-input mt-1 block w-full"
                rows="5"
                v-model="modalState.notice.body"
                placeholder="Name ..."
              />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Expiration</span>
            <input
              class="form-input mt-1 block w-full"
              type="datetime-local"
              v-model="modalState.notice.expiry"
              placeholder="Name ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

<script lang="ts">
import modal from '../../components/SimpleModal.vue';
import { useMutation } from '@urql/vue';
import { useStore } from 'vuex'
import { ActionTypes as DepartmentActionTypes } from '../../store/actions';
import { ADD_NOTICE, EDIT_NOTICE, DELETE_NOTICE } from '../../graphql/notice.mutations';
import { defineComponent, onMounted, reactive, computed} from 'vue';
import { INotice } from '../../models/notice';

import useNoticeComposable from '../../modules/notice'
import useNotifyToast from '../../modules/alert_toast'
import { IUser } from '../../models/auth';
import { parseDate } from '../../utils'

export default defineComponent({
  name: "notice-manager",
  components: {
    modal,
  },
  setup() {
    let store = useStore();

    const { gqlResponseHandler, gqlOpertionalErrorHandler } = useNotifyToast()
    const { _myNotices, fetchMyNotices, _addNotice, _updateNotice, _deleteNotice } = useNoticeComposable()
    const modalState = reactive({
      notice: {} as INotice,
      title: "",
      showModal: false,
      newNotice: true
    })

    const user = computed<IUser>(() => store.getters.getAuth )

    onMounted(async () => {
      store.dispatch(DepartmentActionTypes.FETCH_DEPARTMENTS);
      await fetchMyNotices(user.value?.uid)
    })

    const { executeMutation: createNotice } = useMutation(ADD_NOTICE);
    const { executeMutation: udateNotice } = useMutation(EDIT_NOTICE);
    const { executeMutation: noticeDeleter } = useMutation(DELETE_NOTICE);

    function addNotice(): void {
      createNotice({ 
        title: modalState.notice.title, 
        body: modalState.notice.body,
        expiry: modalState.notice.expiry
      }).then((res) => {
        const data = gqlResponseHandler(res)
        const createdNotice = gqlOpertionalErrorHandler(data?.createNotice)
        if(createdNotice) _addNotice(createdNotice);
      });
    }

    function editNotice(): void {
      udateNotice({ 
        uid: modalState.notice.uid,
        title: modalState.notice.title, 
        body: modalState.notice.body,
        expiry: modalState.notice.expiry
      }).then((res) => {
        const data = gqlResponseHandler(res)
        _updateNotice(data?.updateNotice);
      });
    }

    function deleteNotice(uid: number): void {
      noticeDeleter({ uid }).then((res) => {
        const data = gqlResponseHandler(res)
        const deletedNotice = gqlOpertionalErrorHandler(data?.deleteNotice)
        _deleteNotice(deletedNotice);
      });
    }

    function FormManager(create: boolean, obj: INotice = {} as INotice):void {
      modalState.newNotice = create;
      modalState.showModal = true;
      modalState.title = (create ? 'ADD' : 'EDIT') + ' ' + "Notice";
      if (create) {
        modalState.notice = {} as INotice;
      } else {
        modalState.notice = { ...obj };
      }
    }

    function saveForm():void {
      if (modalState.newNotice === true) addNotice();
      if (modalState.newNotice === false) editNotice();
      modalState.showModal = false;
    }

    return {
      notices: computed<INotice[]>(() => _myNotices(user.value?.uid)),
      modalState,
      FormManager,
      saveForm,
      deleteNotice
     };
  },
});
</script>