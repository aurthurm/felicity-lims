<script setup lang="ts">
import { storeToRefs } from "pinia";
import { DeleteNoticeDocument, DeleteNoticeMutation, DeleteNoticeMutationVariables } from "@/graphql/operations/notice.mutations";
import { onMounted, reactive, computed, defineAsyncComponent } from "vue";
import { INotice } from "@/models/notice";
import { useAuthStore } from "@/stores/auth";
import { useNoticeStore } from "@/stores/notice";
import { useSetupStore} from "@/stores/setup";
import useApiUtil  from "@/composables/api_util";
import Swal from 'sweetalert2';
const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
)
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const NoticeForm = defineAsyncComponent(
  () => import("./NoticeForm.vue")
)
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

let setupStore = useSetupStore();
const noticeStore = useNoticeStore();
const authStore = useAuthStore();
const { withClientMutation } = useApiUtil();

const { fetchingNotices } = storeToRefs(noticeStore);

const modalState = reactive({
  notice: {} as INotice,
  title: "",
  showModal: false,
  newNotice: true,
});

const user = computed(() => authStore?.auth?.user);

onMounted(async () => {
  setupStore.fetchDepartments({});
  await noticeStore.fetchMyNotices(user.value?.uid!);
});

async function deleteNotice(uid: string) {

  await Swal.fire({
    title: 'Are you sure?',
    text: "You want to delete these notice",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete now!',
    cancelButtonText: 'No, do not delete!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      withClientMutation<DeleteNoticeMutation, DeleteNoticeMutationVariables>(DeleteNoticeDocument, { uid }, "deleteNotice").then((payload) =>
        noticeStore.deleteNotice(payload)
      );
    }
  })

}

function FormManager(create: boolean, obj: INotice = {} as INotice): void {
  modalState.showModal = true;
  modalState.title = (create ? "ADD" : "EDIT") + " " + "Notice";
  if (create) {
    modalState.notice = {} as INotice;
  } else {
    modalState.notice = { ...obj };
  }
}

const notices = computed<INotice[]>(() => noticeStore.getMyNotices(user.value?.uid));
</script>

<template>
  <PageHeading title="Notice Manager" />
  <button @click.prevent="FormManager(true)"
    class="px-4 my-2 p-1 text-sm border-primary border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-primary hover:text-gray-100">
    New Notice
  </button>

  <!-- Notice Table View -->
  <div class="overflow-x-auto mt-4">
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
              Notice Title
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
              Expiration
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
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
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              {{ notice.status }}
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <button
                class="px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-secondary hover:text-black-700 focus:outline-none"
                @click="FormManager(false, notice)">
                View/Edit
              </button>
              <button
                class="px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none"
                @click="deleteNotice(notice.uid)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingNotices" class="py-4 text-center">
        <LoadingMessage message="Fetching notices ..." />
      </div>
    </div>
  </div>

  <!-- Notice Form Modal -->
  <modal v-if="modalState.showModal" @close="modalState.showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3>{{ modalState.title }}</h3>
    </template>

    <template v-slot:body>
      <NoticeForm :notice="modalState.notice" @close="modalState.showModal = false" />
    </template>
  </modal>
</template>
