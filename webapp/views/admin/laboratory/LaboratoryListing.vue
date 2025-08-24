<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LaboratoryCreateInputType, LaboratoryInputType, LaboratoryType, UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { AddLaboratoryDocument, AddLaboratoryMutation, AddLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratoryMutation, EditLaboratoryMutationVariables } from "@/graphql/operations/_mutations";


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
let form = reactive({}) as LaboratoryType;
const formAction = ref(true);

function FormManager(create: boolean, obj: any):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "Laboratory";
    if (create) {
      Object.assign(form, { ...(new Object()) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) {
      delete form["uid"];
      withClientMutation<AddLaboratoryMutation, AddLaboratoryMutationVariables>(AddLaboratoryDocument, { payload: {
        ...form as LaboratoryCreateInputType,
        organizationUid: setupStore.getOrganization?.uid!,
      } }, "createLaboratory")
      .then((result) => setupStore.addLaboratory(result));
    } else {
      const uid = form["uid"]
      delete form["settings"];
      delete form["__typename"]
      delete form["uid"]
      withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: uid, payload: form },"updateLaboratory")
      .then((result) => setupStore.updateLaboratory(result, true));
    };
    showModal.value = false;
  }
</script>

<template>
  <div class="space-y-6">
      <fel-heading title="Laboratories" description="Manage your laboratories and their details.">
          <fel-button @click="FormManager(true, null)">Add Laboratory</fel-button>
      </fel-heading>

      <div class="rounded-md border bg-card">
          <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                  <thead class="[&_tr]:border-b">
                      <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manager</th>
                          <!-- <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th> -->
                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact Phone</th>
                          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
                      </tr>
                  </thead>
                  <tbody class="[&_tr:last-child]:border-0">
                      <tr v-for="lab in laboratories" :key="lab?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td class="px-4 py-2 align-middle">{{ lab?.name }}</td>
                          <td class="px-4 py-2 align-middle">{{ getManagerName(lab) }}</td>
                          <!-- <td class="px-4 py-2 align-middle"></td> -->
                          <td class="px-4 py-2 align-middle">{{ lab?.businessPhone }}</td>
                          <td class="px-4 py-2 align-middle text-right">
                              <button @click="FormManager(false, lab)" 
                                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                  Edit
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>

  <!-- Location Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
          <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
          <form class="space-y-6">
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Laboratory Name
                  </label>
                  <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      v-model="form.name"
                      placeholder="Name ..."
                  />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Lab Manager
                </label>
                <select 
                  v-model="form.labManagerUid"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Manager</option>
                  <option v-for="user in users" :key="user?.uid" :value="user.uid">
                    {{ user?.firstName }} {{ user?.lastName }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Business Phone
                  </label>
                  <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      v-model="form.businessPhone"
                      placeholder="Business Phone ..."
                  />
              </div>
              <hr class="border-border" />
              <button
                  type="button"
                  @click.prevent="saveForm()"
                  class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                  Save Form
              </button>
          </form>
      </template>
  </fel-modal>
</template>