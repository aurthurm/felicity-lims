<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { watch } from 'vue';
import { ClientContactType } from '@/types/gql';
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    contact?: ClientContactType | null;
    create?: boolean;
  }>(),
  { contact: null, create: true }
);

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      firstName: string;
      email: string | undefined;
      mobilePhone: string | undefined;
    }
  ): void;
  (e: 'close'): void;
}>();

const contactSchema = yup.object({
  firstName: yup.string().required('Full name is required'),
  email: yup.string().nullable().email('Enter a valid email'),
  mobilePhone: yup.string().nullable(),
});

const { handleSubmit, setValues } = useForm({
  validationSchema: contactSchema,
  initialValues: {
    firstName: props.contact?.firstName ?? '',
    email: props.contact?.email ?? '',
    mobilePhone: props.contact?.mobilePhone ?? '',
  },
});

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    firstName: values.firstName as string,
    email: values.email && String(values.email).trim() ? (values.email as string) : undefined,
    mobilePhone:
      values.mobilePhone && String(values.mobilePhone).trim()
        ? (values.mobilePhone as string)
        : undefined,
  });
});

function initFromContact(contact: ClientContactType | null | undefined) {
  if (!contact) {
    setValues({
      firstName: '',
      email: '',
      mobilePhone: '',
    });
    return;
  }
  setValues({
    firstName: contact.firstName ?? '',
    email: contact.email ?? '',
    mobilePhone: contact.mobilePhone ?? '',
  });
}

watch(
  () => props.contact,
  (contact) => initFromContact(contact ?? null),
  { immediate: true }
);
</script>

<template>
  <form class="space-y-6" autocomplete="off" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField name="firstName" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Full Name ..." />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="email" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="email"
              placeholder="Email ..."
              autocomplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="mobilePhone" v-slot="{ componentField }">
        <FormItem class="sm:col-span-2">
          <FormLabel>Mobile Phone</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="tel"
              placeholder="Mobile Phone ..."
              autocomplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="button" variant="secondary" @click="emit('close')">
        Cancel
      </Button>
      <Button type="button" variant="outline" @click="emit('close')">
        Close
      </Button>
      <Button type="submit">Save Form</Button>
    </div>
  </form>
</template>
