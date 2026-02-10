<script setup lang="ts">
import 'ckeditor5/ckeditor5.css';
import { PropType, toRefs, ref, onMounted } from "vue";
import { NoticeType } from "@/types/gql";
import { 
	AddNoticeDocument, AddNoticeMutation, AddNoticeMutationVariables,
	EditNoticeDocument, EditNoticeMutation, EditNoticeMutationVariables
} from "@/graphql/operations/notice.mutations";

import { useNoticeStore } from "@/stores/notice";
import useApiUtil  from "@/composables/api_util";

import { useForm } from "vee-validate";
import { object, string, array, number, date } from "yup";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
			// Use GPL license for open-source/self-hosted use (see https://ckeditor.com/docs/ckeditor5/latest/getting-started/licensing/license-key-and-activation.html)
			licenseKey: 'GPL',
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
  notice: Object as PropType<NoticeType>,
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

const { handleSubmit } = useForm({
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

const submitNoticeForm = handleSubmit((values) => {
  if (!values.uid) addNotice(values as NoticeType);
  if (values.uid) updateNotice(values as NoticeType);
});

//
function addNotice(payload: NoticeType) {
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

function updateNotice(payload: NoticeType) {
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
  <form class="space-y-4 p-4" @submit.prevent="submitNoticeForm">
    <div class="space-y-4">
      <FormField name="title" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Notice title..." />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <FormField name="body" v-slot="{ value, handleChange }">
        <FormItem>
          <FormLabel>Body</FormLabel>
          <FormControl>
            <div class="main-container notice-body-editor min-w-full min-h-[220px] prose prose-slate">
              <div class="editor-container editor-container_balloon-editor min-h-[200px]" ref="editorContainerElement">
                <div class="editor-container__editor min-h-[200px]">
                  <div ref="editorElement" class="min-h-[200px]">
                    <ckeditor
                      v-if="isLayoutReady"
                      :model-value="value"
                      @update:model-value="handleChange"
                      :editor="editor"
                      :config="config"
                      tag-name="textarea"
                      class="ck-editor notice-ck-editor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <FormField name="expiry" v-slot="{ value, handleChange }">
        <FormItem>
          <FormLabel>Expiration</FormLabel>
          <FormControl>
            <VueDatePicker 
              class="w-full" 
              :model-value="value"
              @update:model-value="handleChange"
              :min-date="minDateTime" 
              placeholder="Select Expiry Date"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    
    <div class="border-t border-border my-4"></div>
    
    <Button type="submit" class="w-full">
      Save Notice
    </Button>
  </form>
</template>

<style scoped>
.notice-body-editor :deep(.ck-editor__editable) {
  min-height: 180px;
}
.notice-body-editor :deep(.ck-editor) {
  min-height: 200px;
}
</style>
