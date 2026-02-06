<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LaboratoryCreateInputType, LaboratoryInputType, LaboratoryType, UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { AddLaboratoryDocument, AddLaboratoryMutation, AddLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratoryMutation, EditLaboratoryMutationVariables } from "@/graphql/operations/_mutations";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();
const setupStore = useSetupStore();

// Lifecycle
onMounted(() => {
  setupStore.fetchOrganization()
  userStore.fetchUsers({});
  setupStore.fetchLaboratories()
});

const users = computed(() => userStore.getUsers);
const laboratories = computed(() => setupStore.getLaboratories);

const getManagerName = (laboratory: LaboratoryType) => {

  if (laboratory.labManagerUid) {
    const users = userStore.getUsers?.filter(u => u.uid == laboratory.labManagerUid)
    if(users?.length > 0) {
      return `${users[0]?.firstName} ${users[0]?.lastName}`;
    }
  }
  return "No Manager Assigned";
};

// Form Management
let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const formSchema = object({
  name: string().required("Laboratory name is required"),
  labManagerUid: string().nullable(),
  businessPhone: string().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    labManagerUid: null,
    businessPhone: "",
  },
});

function FormManager(create: boolean, obj: any):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "Laboratory";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          labManagerUid: null,
          businessPhone: "",
        },
      });
    } else {
      currentUid.value = obj?.uid ?? null;
      setValues({
        name: obj?.name ?? "",
        labManagerUid: obj?.labManagerUid ?? null,
        businessPhone: obj?.businessPhone ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) {
      withClientMutation<AddLaboratoryMutation, AddLaboratoryMutationVariables>(AddLaboratoryDocument, { payload: {
        ...values as LaboratoryCreateInputType,
        organizationUid: setupStore.getOrganization?.uid!,
      } }, "createLaboratory")
      .then((result) => setupStore.addLaboratory(result));
    } else {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: currentUid.value, payload: values as LaboratoryInputType },"updateLaboratory")
      .then((result) => setupStore.updateLaboratory(result, true));
    };
    showModal.value = false;
  });
</script>

<template>
  <div class="space-y-6">
      <PageHeading title="Laboratories" description="Manage your laboratories and their details.">
          <Button @click="FormManager(true, null)">Add Laboratory</Button>
      </PageHeading>

      <div class="rounded-md border bg-card">
          <div class="relative w-full overflow-auto">
              <Table class="w-full caption-bottom text-sm">
                  <TableHeader class="[&_tr]:border-b">
                      <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
                          <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manager</TableHead>
                          <!-- <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</TableHead> -->
                          <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact Phone</TableHead>
                          <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody class="[&_tr:last-child]:border-0">
                      <TableRow v-for="lab in laboratories" :key="lab?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <TableCell class="px-4 py-2 align-middle">{{ lab?.name }}</TableCell>
                          <TableCell class="px-4 py-2 align-middle">{{ getManagerName(lab) }}</TableCell>
                          <!-- <TableCell class="px-4 py-2 align-middle"></TableCell> -->
                          <TableCell class="px-4 py-2 align-middle">{{ lab?.businessPhone }}</TableCell>
                          <TableCell class="px-4 py-2 align-middle text-right">
                              <Button variant="outline" size="sm" @click="FormManager(false, lab)">
                                  Edit
                              </Button>
                          </TableCell>
                      </TableRow>
                      <TableEmpty v-if="!laboratories || laboratories.length === 0" :colspan="4">
                        <Empty class="border-0 bg-transparent p-0">
                          <EmptyContent>
                            <EmptyHeader>
                              <EmptyTitle>No laboratories found</EmptyTitle>
                              <EmptyDescription>Add a laboratory to get started.</EmptyDescription>
                            </EmptyHeader>
                          </EmptyContent>
                        </Empty>
                      </TableEmpty>
                  </TableBody>
              </Table>
          </div>
      </div>
  </div>

  <!-- Location Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
          <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
          <form class="space-y-6" @submit.prevent="saveForm">
              <FormField name="name" v-slot="{ componentField }">
                  <FormItem>
                      <FormLabel>Laboratory Name</FormLabel>
                      <FormControl>
                          <Input v-bind="componentField" placeholder="Name ..." />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              </FormField>
              <FormField name="labManagerUid" v-slot="{ componentField }">
                  <FormItem>
                      <FormLabel>Lab Manager</FormLabel>
                      <FormControl>
                          <Select v-bind="componentField">
                              <SelectTrigger>
                                  <SelectValue placeholder="Select Manager" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="">Select Manager</SelectItem>
                                  <SelectItem v-for="user in users" :key="user?.uid" :value="user.uid">
                                    {{ user?.firstName }} {{ user?.lastName }}
                                  </SelectItem>
                              </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              </FormField>
              <FormField name="businessPhone" v-slot="{ componentField }">
                  <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                          <Input v-bind="componentField" placeholder="Business Phone ..." />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              </FormField>
              <hr class="border-border" />
              <Button type="submit" class="w-full">Save Form</Button>
          </form>
      </template>
  </Modal>
</template>
