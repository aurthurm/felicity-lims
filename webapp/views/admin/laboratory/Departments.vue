<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { AddDepartmentDocument, AddDepartmentMutation, AddDepartmentMutationVariables,
    EditDepartmentDocument, EditDepartmentMutation, EditDepartmentMutationVariables } from '@/graphql/operations/_mutations';
  import { IDepartment } from '@/models/setup';

  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as IDepartment;
  const formAction = ref(true);

  setupStore.fetchDepartments({})
  const departments = computed(() => setupStore.getDepartments)

  function FormManager(create: boolean, obj: any):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "Department";
    if (create) {
      Object.assign(form, { ...(new Object()) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) {
      withClientMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument, { payload: { name: form.name } }, "createDepartment")
      .then((result) => setupStore.addDepartment(result));
    } else {
      withClientMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument, { uid: form.uid, payload: { name: form.name }},"updateDepartment")
      .then((result) => setupStore.updateDepartment(result));
    };
    showModal.value = false;
  }

</script>

<template>
    <div class="space-y-6">
        <fel-heading title="Departments">
            <fel-button @click="FormManager(true, null)">Add Department</fel-button>
        </fel-heading>

        <div class="rounded-md border bg-card">
            <div class="relative w-full overflow-auto">
                <table class="w-full caption-bottom text-sm">
                    <thead class="[&_tr]:border-b">
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
                        </tr>
                    </thead>
                    <tbody class="[&_tr:last-child]:border-0">
                        <tr v-for="dept in departments" :key="dept?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="px-4 py-2 align-middle">{{ dept?.name }}</td>
                            <td class="px-4 py-2 align-middle text-right">
                                <button @click="FormManager(false, dept)" 
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
                        Department Name
                    </label>
                    <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        v-model="form.name"
                        placeholder="Name ..."
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