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

const NoticeForm = defineAsyncComponent(
  () => import("./NoticeForm.vue")
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
  <div class="space-y-4">
    <fel-heading title="Notice Manager">
      <button 
        @click.prevent="FormManager(true)"
        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
      >
        New Notice
      </button>
    </fel-heading>

    <!-- Notice Table View -->
    <div class="overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted">
          <tr>
            <th class="px-3 py-3.5 text-left text-sm font-medium text-foreground">Notice Title</th>
            <th class="px-3 py-3.5 text-left text-sm font-medium text-foreground">Expiration</th>
            <th class="px-3 py-3.5 text-right text-sm font-medium text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border bg-background">
          <tr v-for="notice in notices" :key="notice.uid" class="hover:bg-muted/50 transition-colors duration-150">
            <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">
              <div class="flex items-center">
                <div class="cursor-pointer" @click="FormManager(false, notice)">
                  {{ notice.title }}
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">
              {{ notice.status }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
              <button
                class="px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                @click="FormManager(false, notice)">
                View/Edit
              </button>
              <button
                class="px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200"
                @click="deleteNotice(notice.uid)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingNotices" class="py-4 text-center">
        <fel-loader message="Fetching notices ..." />
      </div>
    </div>
  </div>

  <!-- Notice Form Modal -->
  <fel-modal v-if="modalState.showModal" @close="modalState.showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-lg font-medium text-foreground">{{ modalState.title }}</h3>
    </template>

    <template v-slot:body>
      <NoticeForm :notice="modalState.notice" @close="modalState.showModal = false" />
    </template>
  </fel-modal>
</template>
