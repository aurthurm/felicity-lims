<script setup lang="ts">
import { PropType, toRefs } from "vue";
import { INotice } from "../../models/notice";
import { ADD_NOTICE, EDIT_NOTICE } from "../../graphql/operations/notice.mutations";

import { useNoticeStore } from "../../stores";
import { useApiUtil } from "../../composables";

import { useField, useForm } from "vee-validate";
import { object, string, array, number, date } from "yup";

const props = defineProps({
  notice: Object as PropType<INotice>,
});

const emit = defineEmits(["close"]);

const { withClientMutation } = useApiUtil();
const noticeStore = useNoticeStore();

// Notice
const { notice } = toRefs(props);


const noticeSchema = object({
  uid: number(),
  title: string().required("Notice is required"),
  body: string().required("Notice body message is required"),
  expiry: date().required("Expiry is required").typeError("Invalid Date format"),
  groups: array(), // .required().min(0, "Add at least 1 sample")
  departments: array(),
});

const { handleSubmit, errors } = useForm({
  validationSchema: noticeSchema,
  initialValues: {
    uid: notice?.value?.uid,
    title: notice?.value?.title,
    body: notice?.value?.body,
    expiry: notice?.value?.expiry,
    groups: notice?.value?.groups,
    departments: notice?.value?.departments,
  },
});

const { value: title } = useField<string>("title");
const { value: body } = useField<string>("body");
const { value: expiry } = useField("expiry");
const { value: groups } = useField<number[]>("groups");
const { value: departments } = useField<number[]>("departments");

const submitNoticeForm = handleSubmit((values) => {
  if (!values.uid) addNotice(values as INotice);
  if (values.uid) updateNotice(values as INotice);
});

//
function addNotice(payload: INotice) {
  withClientMutation(
    ADD_NOTICE,
    {
      payload: {
        title: payload.title,
        body: payload.body,
        expiry: payload.expiry,
        groups: payload.groups || [],
        departments: payload.departments || [],
      },
    },
    "createNotice"
  ).then((result) => {
    noticeStore.addNotice(result);
    emit("close");
  });
}

function updateNotice(payload: INotice) {
  withClientMutation(
    EDIT_NOTICE,
    {
      uid: payload.uid,
      payload: {
        title: payload.title,
        body: payload.body,
        expiry: payload.expiry,
        groups: payload.groups || [],
        departments: payload.departments || [],
      },
    },
    "updateNotice"
  ).then((result) => {
    noticeStore.updateNotice(result);
    emit("close");
  });
}
</script>

<template>
  <form action="post" class="p-1" @submit.prevent="submitNoticeForm">
    <div class="grid grid-cols-2 gap-x-4 mb-4">
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Title</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="title"
          placeholder="Name ..."
        />
        <div class="text-orange-600 w-4/12">{{ errors.title }}</div>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Body</span>
        <textarea
          class="form-input mt-1 block w-full"
          rows="5"
          v-model="body"
          placeholder="Name ..."
        />
        <div class="text-orange-600 w-4/12">{{ errors.body }}</div>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Expiration</span>
        <input
          class="form-input mt-1 block w-full"
          type="datetime-local"
          v-model="expiry"
          placeholder="Name ..."
        />
        <div class="text-orange-600 w-4/12">{{ errors.expiry }}</div>
      </label>
    </div>
    <hr />
    <button
      type="submit"
      class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
    >
      Save Form
    </button>
  </form>
</template>
