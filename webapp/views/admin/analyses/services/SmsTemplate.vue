<script setup lang="ts">
  import { ref, reactive, toRefs, watch, onMounted } from 'vue';
  import { AddSmsTemplateDocument, AddSmsTemplateMutation, AddSmsTemplateMutationVariables,
    EditSmsTemplateDocument, EditSmsTemplateMutation, EditSmsTemplateMutationVariables,
    DeleteSmsTemplateDocument, DeleteSmsTemplateMutation, DeleteSmsTemplateMutationVariables } from '@/graphql/operations/sms-template.mutations';
  import { SmsTemplateInputType, SmsTemplateType } from '@/types/gql';
  import useApiUtil from '@/composables/api_util';
import { SmsTrigger, SmsAudience } from '@/graphql/schema';
import { GetSmsTemplatesByTargetQuery, GetSmsTemplatesByTargetQueryVariables } from '@/types/gqlops';
import { GetSmsTemplatesByTargetDocument } from '@/graphql/operations/sms-template.queries';
 
  const { withClientMutation, withClientQuery } = useApiUtil()
  
  const props = defineProps({
    targetType: {
          type: String,
          required: true,
          default: null,
      },
      targetUid: {
          type: String,
          required: true,
          default: null,
      },
  })

  const { targetType, targetUid } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({
    targetType: targetType.value,
    targetUid: targetUid.value,
  }) as SmsTemplateType;
  const formAction = ref(true);
  const showWildcards = ref(false);


  // SMS Trigger options
  const triggerOptions = [
    { value: SmsTrigger.Normal, label: 'Normal Results' },
    { value: SmsTrigger.BelowNormal, label: 'Below Normal (Not Warning)' },
    { value: SmsTrigger.AboveNormal, label: 'Above Normal (Not Warning)' },
    { value: SmsTrigger.BelowWarning, label: 'Below Warning Threshold' },
    { value: SmsTrigger.AboveWarning, label: 'Above Warning Threshold' },
    { value: SmsTrigger.AnyAbnormal, label: 'Any Abnormal Results' },
    { value: SmsTrigger.AnyWarning, label: 'Any Warning Results' },
    { value: SmsTrigger.AnyResult, label: 'Any Result' },
    { value: SmsTrigger.TextualNormal, label: 'Textual Normal Results' },
    { value: SmsTrigger.TextualWarning, label: 'Textual Warning Results' },
  ];

  // SMS Audience options
  const audienceOptions = [
    { value: SmsAudience.Patient, label: 'Patient' },
    { value: SmsAudience.Client, label: 'Client' },
  ];

  // Supported SMS variables
  const supportedVariables = [
    { category: 'Lab Information', 
      variables: ['{lab_name}', '{lab_email}', '{lab_phone}'] },
    { category: 'Sample Information', 
      variables: ['{sample_id}', '{client_sample_id}', '{date_collected}'] },
    { category: 'Patient Information', 
      variables: ['{patient_name}', '{patient_id}', '{gender}', '{client_patient_id}', '{age}'] },
    { category: 'Analysis Information', 
      variables: ['{analysis_keyword}', '{analysis_name}'] },
    { category: 'Result Information', 
      variables: ['{result}', '{unit}'] },
    { category: 'Client Information', 
      variables: ['{client_id}', '{client_name}'] },
    { category: 'Other', 
      variables: ['Patient identification names (dynamic)'] },
  ];

  const templates = ref<SmsTemplateType[]>([]);
  watch(() => props.targetUid, (anal, prev) => {
      getSmsTemplates();
  })

  onMounted(() => {
    getSmsTemplates();
  })

  function getSmsTemplates(): void {
    withClientQuery<GetSmsTemplatesByTargetQuery, GetSmsTemplatesByTargetQueryVariables>(
      GetSmsTemplatesByTargetDocument, { targetType: targetType.value, targetUid: targetUid.value }, "smsTemplatesByTarget")
    .then((result) => templates.value = (result as SmsTemplateType[]) || []);
  }

  function addSmsTemplate(): void {
      const payload = { ...form } as SmsTemplateInputType;
      withClientMutation<AddSmsTemplateMutation, AddSmsTemplateMutationVariables>(AddSmsTemplateDocument, { payload }, "createSmsTemplate")
      .then((result) => templates.value.push(result));
  }

  function editSmsTemplate(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      withClientMutation<EditSmsTemplateMutation, EditSmsTemplateMutationVariables>(EditSmsTemplateDocument, { uid : form.uid,  payload }, "updateSmsTemplate")
      .then((result) => {
        const index = templates.value.findIndex(t => t.uid === form.uid);
        if (index !== -1) {
          templates.value[index] = result;
        }
      });
  }

  function deleteSmsTemplate(uid: string): void {
      if (confirm('Are you sure you want to delete this SMS template?')) {
          withClientMutation<DeleteSmsTemplateMutation, DeleteSmsTemplateMutationVariables>(DeleteSmsTemplateDocument, { uid }, "deleteSmsTemplate")
          .then((result) => {
            const index = templates.value.findIndex(t => t.uid === uid);
            if (index !== -1) {
              templates.value.splice(index, 1);
            }
          });
      }
  }

  function FormManager(create: boolean, obj = {} as SmsTemplateType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SMS TEMPLATE";
      if (create) {
          Object.assign(form, { 
              name: '', 
              template: '', 
              description: '',
              targetType: targetType.value,
              targetUid: targetUid.value,
              specificationTrigger: SmsTrigger.AnyAbnormal,
              audience: SmsAudience.Patient,
              isActive: true
          });
      } else {
          Object.assign(form, { ...obj, targetType: targetType.value, targetUid: targetUid.value });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addSmsTemplate();
      if (formAction.value === false) editSmsTemplate();
      showModal.value = false;
  }

  function insertVariable(variable: string): void {
    if (typeof form.template !== 'string') form.template = '';
    const textarea = document.getElementById('template-input') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      form.template = form.template.substring(0, start) + variable + form.template.substring(end);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      }, 0);
    } else {
      form.template += variable;
    }
  }

  const triggerLabel = (trigger: string): string => {
    const option = triggerOptions.find(opt => opt.value === trigger);
    return option?.label || trigger;
  }

  const audienceLabel = (audience: string): string => {
    const option = audienceOptions.find(opt => opt.value === audience);
    return option?.label || audience;
  }

</script>

<template>
    <fel-heading title="SMS Templates">
      <fel-button @click="FormManager(true)">Add SMS Template</fel-button>
    </fel-heading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Name</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Specification Trigger</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Audience</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Template</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Status</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="template in templates" :key="template?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ template.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ template.description }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ triggerLabel(template.specificationTrigger || '') }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ audienceLabel(template.audience || '') }}</div>
                </td>
                <td class="px-4 py-2 border-b border-border">
                  <div class="text-sm text-foreground max-w-xs">{{ template.template }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <span :class="template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ template.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button @click="FormManager(false, template)" class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground">Edit</button>
                    <button @click="deleteSmsTemplate(template.uid)" class="px-2 py-1 border border-red-500 bg-background text-red-600 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-red-50">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- SMS Template Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Template Name</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.name"
                placeholder="Enter template name..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Description</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.description"
                placeholder="Enter description..."
              />
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Trigger Condition</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.specificationTrigger"
              >
                <option v-for="option in triggerOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Audience</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.audience"
              >
                <option v-for="option in audienceOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Status</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.isActive"
              >
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </label>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-muted-foreground">SMS Template</span>
              <button 
                type="button"
                @click="showWildcards = !showWildcards"
                class="text-xs text-primary hover:text-primary/80"
              >
                {{ showWildcards ? 'Hide' : 'Show' }} Available Variables
              </button>
            </div>
            <textarea
              id="template-input"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              v-model="form.template"
              placeholder="Enter SMS template with variables e.g., Hello {patient_name}, your {analysis_name} result is {result}..."
            ></textarea>
          </div>

          <!-- Wildcard Variables Panel -->
          <div v-if="showWildcards" class="border border-border rounded-lg p-4 bg-accent/5">
            <h4 class="text-sm font-medium text-foreground mb-3">Available Variables:</h4>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="category in supportedVariables" :key="category.category" class="space-y-1">
                <h5 class="text-xs font-medium text-muted-foreground uppercase">{{ category.category }}</h5>
                <div class="flex flex-wrap gap-1">
                  <button
                    v-for="variable in category.variables"
                    :key="variable"
                    type="button"
                    @click="insertVariable(variable)"
                    class="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors duration-200"
                  >
                    {{ variable }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 flex gap-2">
          <button
            type="button"
            @click.prevent="saveForm()"
            class="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Template
          </button>
          <button
            type="button"
            @click="showModal = false"
            class="px-4 py-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>