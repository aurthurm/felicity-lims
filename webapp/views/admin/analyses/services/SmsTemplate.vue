<script setup lang="ts">
  import { ref, toRefs, watch, onMounted } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddSmsTemplateDocument, AddSmsTemplateMutation, AddSmsTemplateMutationVariables,
    EditSmsTemplateDocument, EditSmsTemplateMutation, EditSmsTemplateMutationVariables,
    DeleteSmsTemplateDocument, DeleteSmsTemplateMutation, DeleteSmsTemplateMutationVariables } from '@/graphql/operations/sms-template.mutations';
  import { SmsTemplateInputType, SmsTemplateType } from '@/types/gql';
  import useApiUtil from '@/composables/api_util';
  import { useConfirmDialog } from "@/composables/confirm_dialog";
import { SmsTrigger, SmsAudience } from '@/graphql/schema';
import { GetSmsTemplatesByTargetQuery, GetSmsTemplatesByTargetQueryVariables } from '@/types/gqlops';
import { GetSmsTemplatesByTargetDocument } from '@/graphql/operations/sms-template.queries';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
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
  import { Switch } from "@/components/ui/switch";
 
import PageHeading from "@/components/common/PageHeading.vue"
  const { withClientMutation, withClientQuery } = useApiUtil()
  const { confirm } = useConfirmDialog();
  
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
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);
  const showWildcards = ref(false);

  const templateSchema = yup.object({
    name: yup.string().trim().required('Template name is required'),
    description: yup.string().trim().nullable(),
    template: yup.string().trim().required('Template body is required'),
    specificationTrigger: yup.string().trim().required('Trigger is required'),
    audience: yup.string().trim().required('Audience is required'),
    isActive: yup.boolean().default(true),
    targetType: yup.string().trim().required(),
    targetUid: yup.string().trim().required(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: templateSchema,
    initialValues: {
      name: '',
      description: '',
      template: '',
      specificationTrigger: SmsTrigger.AnyAbnormal,
      audience: SmsAudience.Patient,
      isActive: true,
      targetType: targetType.value,
      targetUid: targetUid.value,
    },
  });

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
  watch(() => props.targetUid, () => {
      setValues({
        targetType: targetType.value,
        targetUid: targetUid.value,
      });
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

  function addSmsTemplate(payload: SmsTemplateInputType): void {
      withClientMutation<AddSmsTemplateMutation, AddSmsTemplateMutationVariables>(AddSmsTemplateDocument, { payload }, "createSmsTemplate")
      .then((result) => templates.value.push(result));
  }

  function editSmsTemplate(payload: SmsTemplateInputType): void {
      if (!currentUid.value) return;
      withClientMutation<EditSmsTemplateMutation, EditSmsTemplateMutationVariables>(EditSmsTemplateDocument, { uid: currentUid.value, payload }, "updateSmsTemplate")
      .then((result) => {
        const index = templates.value.findIndex(t => t.uid === currentUid.value);
        if (index !== -1) {
          templates.value[index] = result;
        }
      });
  }

  function deleteSmsTemplate(uid: string): void {
      confirm({
        title: "Delete SMS Template?",
        description: "Are you sure you want to delete this SMS template?",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      }).then((confirmed) => {
        if (!confirmed) return;
        withClientMutation<DeleteSmsTemplateMutation, DeleteSmsTemplateMutationVariables>(
          DeleteSmsTemplateDocument,
          { uid },
          "deleteSmsTemplate"
        ).then(() => {
          const index = templates.value.findIndex(t => t.uid === uid);
          if (index !== -1) {
            templates.value.splice(index, 1);
          }
        });
      });
  }

  function FormManager(create: boolean, obj = {} as SmsTemplateType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SMS TEMPLATE";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              name: '',
              template: '',
              description: '',
              targetType: targetType.value,
              targetUid: targetUid.value,
              specificationTrigger: SmsTrigger.AnyAbnormal,
              audience: SmsAudience.Patient,
              isActive: true,
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            name: obj.name ?? '',
            template: obj.template ?? '',
            description: obj.description ?? '',
            targetType: targetType.value,
            targetUid: targetUid.value,
            specificationTrigger: obj.specificationTrigger ?? SmsTrigger.AnyAbnormal,
            audience: obj.audience ?? SmsAudience.Patient,
            isActive: obj.isActive ?? true,
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const payload = {
        name: values.name,
        template: values.template,
        description: values.description ?? null,
        targetType: values.targetType,
        targetUid: values.targetUid,
        specificationTrigger: values.specificationTrigger,
        audience: values.audience,
        isActive: values.isActive,
      } as SmsTemplateInputType;
      if (formAction.value === true) addSmsTemplate(payload);
      if (formAction.value === false) editSmsTemplate(payload);
      showModal.value = false;
  });

  function insertVariable(variable: string): void {
    const textarea = document.getElementById('template-input') as HTMLTextAreaElement;
    const currentValue = (textarea?.value ?? '') as string;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      setValues({ template: nextValue });
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      }, 0);
    } else {
      setValues({ template: currentValue + variable });
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
    <PageHeading title="SMS Templates">
      <Button @click="FormManager(true)">Add SMS Template</Button>
    </PageHeading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <Table class="min-w-full">
            <TableHeader>
            <TableRow>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Name</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Specification Trigger</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Audience</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Template</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Status</TableHead>
                <TableHead class="px-4 py-2 border-b border-border"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="bg-card">
            <TableRow v-for="template in templates" :key="template?.uid" class="hover:bg-accent/50">
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ template.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ template.description }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ triggerLabel(template.specificationTrigger || '') }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ audienceLabel(template.audience || '') }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 border-b border-border">
                  <div class="text-sm text-foreground max-w-xs">{{ template.template }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <span :class="template.isActive ?'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ template.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <Button variant="outline" size="sm" @click="FormManager(false, template)">Edit</Button>
                    <Button variant="destructive" size="sm" class="ml-2" @click="deleteSmsTemplate(template.uid)">
                      Delete
                    </Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- SMS Template Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <FormField name="name" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter template name..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="description" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter description..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <FormField name="specificationTrigger" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Trigger Condition</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in triggerOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="audience" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Audience</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in audienceOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="isActive" v-slot="{ value, handleChange }">
              <FormItem class="flex items-center gap-2">
                <FormControl>
                  <Switch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormLabel>Status</FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="template" v-slot="{ componentField }">
            <FormItem>
              <div class="flex justify-between items-center">
                <FormLabel>SMS Template</FormLabel>
                <Button type="button" variant="link" size="sm" @click="showWildcards = !showWildcards">
                  {{ showWildcards ? 'Hide' : 'Show' }} Available Variables
                </Button>
              </div>
              <FormControl>
                <Textarea
                  id="template-input"
                  v-bind="componentField"
                  class="min-h-[100px]"
                  placeholder="Enter SMS template with variables e.g., Hello {patient_name}, your {analysis_name} result is {result}..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

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
          <Button type="submit" class="flex-1">Save Template</Button>
          <Button type="button" variant="outline" @click="showModal = false">Cancel</Button>
        </div>
      </form>
    </template>
  </Modal>

</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
