<script setup lang="ts">
import 'ckeditor5/ckeditor5.css';
import { PropType, toRefs, ref, onMounted } from "vue";
import { INotice } from "@/models/notice";
import { 
	AddNoticeDocument, AddNoticeMutation, AddNoticeMutationVariables,
	EditNoticeDocument, EditNoticeMutation, EditNoticeMutationVariables
} from "@/graphql/operations/notice.mutations";

import { useNoticeStore } from "@/stores/notice";
import useApiUtil  from "@/composables/api_util";

import { useField, useForm } from "vee-validate";
import { object, string, array, number, date } from "yup";
import { formatDate } from "@/utils/helpers";
import {
	ClassicEditor,
	AccessibilityHelp,
	Autoformat,
	Autosave,
	BlockQuote,
	Bold,
	Essentials,
	Heading,
	Indent,
	IndentBlock,
	Italic,
	List,
	Paragraph,
	SelectAll,
	TextTransformation,
	TodoList,
	Underline,
	Undo
} from 'ckeditor5';

const isLayoutReady = ref(false);
const config = ref<any>(null);
const editor = ref(ClassicEditor)

onMounted(( )=>{
		config.value = {
      			toolbar: {
				items: [
					'undo',
					'redo',
					'|',
					'heading',
					'|',
					'bold',
					'italic',
					'underline',
					'|',
					'link',
					'insertTable',
					'blockQuote',
					'|',
					'bulletedList',
					'numberedList',
					'todoList',
					'outdent',
					'indent'
				],
				shouldNotGroupWhenFull: false
			},
			plugins: [
				AccessibilityHelp,
				Autoformat,
				Autosave,
				BlockQuote,
				Bold,
				Essentials,
				Heading,
				Indent,
				IndentBlock,
				Italic,
				List,
				Paragraph,
				SelectAll,
				TextTransformation,
				TodoList,
				Underline,
				Undo
			],
			heading: {
				options: [
					{
						model: 'paragraph',
						title: 'Paragraph',
						class: 'ck-heading_paragraph'
					},
					{
						model: 'heading1',
						view: 'h1',
						title: 'Heading 1',
						class: 'ck-heading_heading1'
					},
					{
						model: 'heading2',
						view: 'h2',
						title: 'Heading 2',
						class: 'ck-heading_heading2'
					},
					{
						model: 'heading3',
						view: 'h3',
						title: 'Heading 3',
						class: 'ck-heading_heading3'
					},
					{
						model: 'heading4',
						view: 'h4',
						title: 'Heading 4',
						class: 'ck-heading_heading4'
					},
					{
						model: 'heading5',
						view: 'h5',
						title: 'Heading 5',
						class: 'ck-heading_heading5'
					},
					{
						model: 'heading6',
						view: 'h6',
						title: 'Heading 6',
						class: 'ck-heading_heading6'
					}
				]
			},
			placeholder: 'Begin typing...',
    };

		isLayoutReady.value = true;
})


const props = defineProps({
  notice: Object as PropType<INotice>,
});

const emit = defineEmits(["close"]);

const { withClientMutation } = useApiUtil();
const noticeStore = useNoticeStore();

// Notice
const { notice } = toRefs(props);
const minDateTime = ref(new Date());

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

const submitNoticeForm = handleSubmit((values) => {
  if (!values.uid) addNotice(values as INotice);
  if (values.uid) updateNotice(values as INotice);
});

//
function addNotice(payload: INotice) {
  withClientMutation<AddNoticeMutation, AddNoticeMutationVariables>(AddNoticeDocument,
    {
      payload: {
        title: payload.title,
        body: payload.body,
        expiry: formatDate(payload.expiry, "YYYY-MM-DD HH:mm"),
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
  withClientMutation<EditNoticeMutation, EditNoticeMutationVariables>(EditNoticeDocument,
    {
      uid: payload.uid,
      payload: {
        title: payload.title,
        body: payload.body,
        expiry: formatDate(payload.expiry, "YYYY-MM-DD HH:mm"),
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
        <span class="text-foreground">Title</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="title"
          placeholder="Name ..."
        />
        <div class="text-destructive w-4/12">{{ errors.title }}</div>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-foreground">Body</span>
        <div class="main-container min-w-full prose prose-slate">
          <div class="editor-container editor-container_balloon-editor" ref="editorContainerElement">
            <div class="editor-container__editor">
              <div ref="editorElement">
                <ckeditor 
                v-if="isLayoutReady" 
                v-model="body" 
                :editor="editor" 
                :config="config"
                tag-name="textarea"/>
              </div>
            </div>
          </div>
        </div>
        <div class="text-destructive w-4/12">{{ errors.body }}</div>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-foreground">Expiration</span>
        <VueDatePicker class="z-60" 
        v-model="expiry"
        :min-date="minDateTime" placeholder="Select Expiry Date"></VueDatePicker>
        <div class="text-destructive w-4/12">{{ errors.expiry }}</div>
      </label>
    </div>
    <hr />
    <button
      type="submit"
      class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
    >
      Save Form
    </button>
  </form>
</template>
