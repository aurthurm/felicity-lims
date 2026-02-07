<script setup lang="ts">
import { storeToRefs } from "pinia";
import { DeleteNoticeDocument, DeleteNoticeMutation, DeleteNoticeMutationVariables } from "@/graphql/operations/notice.mutations";
import { onMounted, reactive, computed, defineAsyncComponent } from "vue";
import { NoticeType } from "@/types/gql";
import { useAuthStore } from "@/stores/auth";
import { useNoticeStore } from "@/stores/notice";
import { useSetupStore} from "@/stores/setup";
import useApiUtil  from "@/composables/api_util";
import { useConfirmDialog } from "@/composables/confirm_dialog";
import { Spinner } from "@/components/ui/spinner";
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'NoticesView' })
const NoticeForm = defineAsyncComponent(
  () => import("./NoticeForm.vue")
)

let setupStore = useSetupStore();
const noticeStore = useNoticeStore();
const authStore = useAuthStore();
const { withClientMutation } = useApiUtil();
const { confirm } = useConfirmDialog();

const { fetchingNotices } = storeToRefs(noticeStore);

const modalState = reactive({
  notice: {} as NoticeType,
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
  const confirmed = await confirm({
    title: "Are you sure?",
    description: "You want to delete these notice",
    confirmText: "Yes, delete now!",
    cancelText: "No, do not delete!",
    variant: "destructive",
  });
  if (!confirmed) return;
  const payload = await withClientMutation<DeleteNoticeMutation, DeleteNoticeMutationVariables>(
    DeleteNoticeDocument,
    { uid },
    "deleteNotice"
  );
  noticeStore.deleteNotice(payload);
}

function FormManager(create: boolean, obj: NoticeType = {} as NoticeType): void {
  modalState.showModal = true;
  modalState.title = (create ? "ADD" : "EDIT") + " " + "Notice";
  if (create) {
    modalState.notice = {} as NoticeType;
  } else {
    modalState.notice = { ...obj };
  }
}

const notices = computed<NoticeType[]>(() => noticeStore.getMyNotices(user.value?.uid));
</script>

<template>
  <div class="space-y-4">
    <PageHeading title="Notice Manager">
      <button 
        @click="FormManager(true)"
        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
      >
        New Notice
      </button>
    </PageHeading>

    <!-- Notice Table View -->
    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notice Title</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expiration</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="notice in notices" :key="notice.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">
              <div class="flex items-center">
                <div class="cursor-pointer" @click="FormManager(false, notice)">
                  {{ notice.title }}
                </div>
              </div>
            </TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ notice.status }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
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
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </div>
      <div v-if="fetchingNotices" class="py-4 text-center">
        <span class="inline-flex items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-sm">Fetching notices ...</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Notice Form Modal -->
  <Modal v-if="modalState.showModal" @close="modalState.showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-lg font-medium text-foreground">{{ modalState.title }}</h3>
    </template>

    <template v-slot:body>
      <NoticeForm :notice="modalState.notice" @close="modalState.showModal = false" />
    </template>
  </Modal>
</template>
