<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import { formatDate, getUserInitials, parseDate} from '@/utils'
import { AddGrindStampDocument, AddGrindStampMutation, AddGrindStampMutationVariables, EditGrindErrandDocument, EditGrindErrandMutation, EditGrindErrandMutationVariables } from '@/graphql/operations/grind.mutations'
import { GetGrindErrandDocument, GetGrindErrandQuery, GetGrindErrandQueryVariables, GetGrindPostersByBoardDocument, GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables, GetGrindStampByCategoryDocument, GetGrindStampByCategoryQuery, GetGrindStampByCategoryQueryVariables } from '@/graphql/operations/grind.queries'
import { GrindErrandType, GrindPosterType, GrindStampType } from '@/types/gql'
import { StampCategory } from '@/graphql/schema'
import 'ckeditor5/ckeditor5.css';
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
import { ref, onMounted, nextTick, computed, defineAsyncComponent } from 'vue'
import Multiselect from 'vue-multiselect'
import { useRoute, useRouter } from 'vue-router'
import { GrindUpdateErrandInput } from '@/graphql/schema'
import { UserType } from '@/types/gql'
import { UserAllDocument, UserAllQuery, UserAllQueryVariables } from '@/graphql/operations/_queries'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

// const ErrandActivity = defineAsyncComponent(() => import("./ErrandActivity.vue"))
const ErrandDiscussion = defineAsyncComponent(() => import("@/components/grind/CommentSystem.vue"))
const ErrandFile = defineAsyncComponent(() => import("./ErrandFile.vue"))
const ErrandMilestone = defineAsyncComponent(() => import("./ErrandMilestone.vue"))

// CKEditor Management
const isLayoutReady = ref(false);
const config = ref<any>(null);
const editor = ref(ClassicEditor)

function initCKEditor() {
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
}

onMounted(( )=>{
    initCKEditor();
    getErrand();
    getPosters();
    getUsers();
    getStamps();
})

const activeTab = ref('discussions')

const route = useRoute( )
const errandUid = computed<string>(() => route.params.errandUid as string)
const boardUid = computed<string>(() => route.params.boardUid as string)

let errand = ref<GrindErrandType>();
const { withClientQuery, withClientMutation } = useApiUtil()

function getErrand() {
    withClientQuery<GetGrindErrandQuery, GetGrindErrandQueryVariables>(
        GetGrindErrandDocument,
        { uid: errandUid.value },
        'grindErrandByUid'
    ).then((resp: any) => {
        errand.value = resp as GrindErrandType;
        // Handle period
        const startDate = parseDate(errand.value.startDate, true) ?? new Date();
        const endDate = parseDate(errand.value.endDate, true) ?? new Date(new Date().setDate(startDate.getDate() + 7));
        dateRange.value = [startDate, endDate];
    })
}

function updateErrand(payload: Partial<GrindErrandType>) {
    withClientMutation<EditGrindErrandMutation, EditGrindErrandMutationVariables>(
        EditGrindErrandDocument,
        { uid: errandUid.value, payload: payload as GrindUpdateErrandInput },
        'updateGrindErrand'
    ).then(() => getErrand())
}

// Errand Title editing
const editingTitle = ref(false)
const titleInput = ref<any>(null)

const startEditingTitle = () => {
    editingTitle.value = true
    nextTick(() => {
        titleInput.value?.focus()
        titleInput.value?.select()
    })
}

const endEditingTitle = () => {
    editingTitle.value = false
    updateErrand({ title: errand.value?.title })
}

//  Errand Body editing
const editingBody = ref(false)
const originalDescription = ref('')
const startEditingBody = () => {
    editingBody.value = true
    originalDescription.value = errand.value?.description ?? '';
}

const saveDescription = () => {
    editingBody.value = false
    updateErrand({ description: errand.value?.description })
}

const cancelEditing = () => {
    errand.value!.description = originalDescription.value;
    editingBody.value = false
}

// Errand Data Range
const dateRange = ref();
const rangeFormat = (date: Date[]) => {
  const day = date[0]?.getDate();
  const month = date[0]?.getMonth() + 1;
  const year = date[0]?.getFullYear();
  const dayt = date[1]?.getDate();
  const montht = date[1]?.getMonth() + 1;
  const yeart = date[1]?.getFullYear();
  return `${day}/${month}/${year} - ${dayt}/${montht}/${yeart}`;
}
const handleDate = (dates: Date[]) => {
    if(dates.length !== 2) {
        alert('Invalid date range');
        return;
    }
   updateErrand({ 
    startDate: formatDate(dates[0], "YYYY-MM-DD HH:mm"), 
    endDate: formatDate(dates[1], "YYYY-MM-DD HH:mm") 
   })
}

// Errand Poster a.k.a Status
const posters = ref<GrindPosterType[]>([])
function getPosters() {
  withClientQuery<GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables>(
    GetGrindPostersByBoardDocument,
    { boardUid: boardUid.value },
    "grindPostersByBoard"
  ).then((res) => {
    posters.value = (res as GrindPosterType[]).filter(p => p.uid !== errand.value?.posterUid);
  });
}

function updateStatus (poster: GrindPosterType) {
  updateErrand({ posterUid: poster.uid })
}

// Errand Persons
const users = ref<UserType[]>()
function getUsers() {
  withClientQuery<UserAllQuery, UserAllQueryVariables>(
    UserAllDocument,
    { first: 100 },
    "userAll"
  ).then((res: any) => {
    users.value = res.items as UserType[];
  });
}
function customLabel ({firstName, lastName}) {
  return `${firstName} ${lastName}`
}

function updateAssignee (user: UserType) {
  updateErrand({ assigneeUid: user.uid })
}

function updateReporter (user: UserType) {
  updateErrand({ reporterUid: user.uid })
}

function updateMembers (users: UserType[]) {
  updateErrand({ members: users.map(u => u.uid) as string[] })
}

// Errand Priority
const priorities = ['Low', 'Normal', 'High', 'Critical']
function updatePriority (priority: string) {
  updateErrand({ priority })
}

// Errand Stamps
const stamps = ref<GrindStampType[]>([])
function getStamps() {
  withClientQuery<GetGrindStampByCategoryQuery, GetGrindStampByCategoryQueryVariables>(
    GetGrindStampByCategoryDocument,
    { category: StampCategory.Project },
    "grindStampByCategory"
  ).then((res) => {
    stamps.value = res as GrindStampType[];
  });
}
function updateStamps (stamps: GrindStampType[]) {
  updateErrand({ stamps: stamps?.map(s => s.uid) })
}
const addStamp = (newTag: string) => {
  withClientMutation<AddGrindStampMutation, AddGrindStampMutationVariables>(
    AddGrindStampDocument,
    { payload: {title: newTag, category: StampCategory.Project} },
    "createGrindStamp"
  ).then((resp: any) => {
    if(resp.uid){
      stamps.value.push(resp);
      const tags = (errand.value?.stamps ?? []) as GrindStampType[]
      tags.push(resp);
      updateStamps(tags)
    }
  });
}

// milestone updates
const handleMilestoneUpdated = () => getErrand();

// Go back
const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <div class="bg-background rounded-lg shadow-sm border border-border" v-if="errand">
    <!-- Content area with sidebar -->
    <div class="flex flex-col md:flex-row">
      <!-- Main content -->
      <div class="flex-1 p-6 border-r border-border">
        <!-- Header -->
        <div class="space-y-6 pb-6 border-b border-border">
          <div class="flex justify-between items-center">
            <div class="relative w-full">
              <button 
                @click="goBack" 
                class="absolute -left-2 -top-2 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeftIcon class="w-5 h-5" />
              </button>
              <h1 
                v-if="!editingTitle" 
                @click="startEditingTitle" 
                class="text-3xl font-bold text-foreground cursor-pointer hover:bg-muted rounded px-2 py-1 transition-colors duration-200"
              >
                {{ errand.title }}
              </h1>
              <input 
                v-else 
                type="text" 
                v-model="errand.title" 
                @blur="endEditingTitle" 
                @keyup.enter="endEditingTitle"
                ref="titleInput"
                class="text-2xl font-semibold text-foreground w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
              />
            </div>
          </div>
          
          <div class="flex items-center space-x-2 text-sm text-muted-foreground">
            <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-destructive font-medium">
              {{ getUserInitials(errand.createdBy?.firstName, errand.createdBy?.lastName) }}
            </div>
            <span>by</span>
            <span class="font-medium text-foreground">{{ errand.createdBy?.firstName }} {{ errand.createdBy?.lastName }}</span>
            <span>on {{ formatDate(errand.createdAt, 'D MMMM YYYY') }}</span>
          </div>
          
          <div class="prose max-w-none" @click="startEditingBody" v-if="!editingBody">
            <article v-if="errand.description" class="text-lg text-foreground" v-html="errand.description"></article>
          </div>
          
          <div v-else class="space-y-4">
            <div class="prose max-w-none">
              <div class="editor-container editor-container_balloon-editor" ref="editorContainerElement">
                <div class="editor-container__editor">
                  <div ref="editorElement">
                    <ckeditor 
                      v-if="isLayoutReady" 
                      v-model="errand.description" 
                      :editor="editor" 
                      :config="config"
                      tag-name="textarea"
                      class="ck-editor"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="saveDescription" 
                class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
              >
                Save
              </button>
              <button 
                @click="cancelEditing" 
                class="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  
        <!-- Progress Bar -->
        <div class="flex items-center space-x-3 mt-6" v-show="errand?.milestonesAt">
          <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              class="h-full bg-success rounded-full transition-all duration-300" 
              :style="`width: ${errand?.milestonesAt}%`"
            ></div>
          </div>
          <span class="text-sm font-medium text-muted-foreground">{{ errand?.milestonesAt }}%</span>
        </div>
        
        <!-- Tabs -->
        <div class="border-b border-border mt-6">
          <div class="flex space-x-1">
            <button 
              @click="activeTab = 'discussions'" 
              :class="[
                'py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none',
                activeTab === 'discussions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              ]"
            >
              Discussions
            </button>
            <button 
              @click="activeTab = 'milestones'" 
              :class="[
                'py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none',
                activeTab === 'milestones' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              ]"
            >
              Milestones
            </button>
            <button 
              @click="activeTab = 'files'" 
              :class="[
                'py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none',
                activeTab === 'files' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              ]"
            >
              Files
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        <div class="py-6">
          <!-- Discussions Tab -->
          <div v-if="activeTab === 'discussions'" class="space-y-6">
            <ErrandDiscussion :errandUid="errand.uid" />
          </div>
          
          <!-- Milestones Tab -->
          <div v-if="activeTab === 'milestones'" class="space-y-6">
            <ErrandMilestone :errandUid="errand.uid" @milestone-updated="handleMilestoneUpdated" />
          </div>
          
          <!-- Files Tab -->
          <div v-if="activeTab === 'files'" class="space-y-6">
            <ErrandFile :errandUid="errand.uid" />
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="w-full md:w-80 p-6 border-l border-border">
        <div class="space-y-8">
          <!-- Dates -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Date Range</label>
            <VueDatePicker 
              class="w-full" 
              v-model="dateRange" 
              @update:model-value="handleDate"
              range 
              :format="rangeFormat"
            />
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Status</label>
            <multiselect 
              v-model="errand.poster" 
              :options="posters" 
              label="title" 
              track-by="uid"
              placeholder="Select status"
              @update:modelValue="updateStatus"
              class="multiselect-primary"
            />
          </div>
          
          <!-- Assignee -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Assignee</label>
            <multiselect 
              v-model="errand.assignee" 
              :options="users"
              track-by="uid"
              :searchable="true"
              :custom-label="customLabel"
              placeholder="Select assignee"
              @update:modelValue="updateAssignee"
              class="multiselect-primary"
            />
          </div>
          
          <!-- Reporter -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Reporter</label>
            <multiselect 
              v-model="errand.reporter" 
              :options="users"
              track-by="uid"
              :searchable="true"
              :custom-label="customLabel"
              placeholder="Select reporter"
              @update:modelValue="updateReporter"
              class="multiselect-primary"
            />
          </div>
          
          <!-- Team Members -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Team Members</label>
            <multiselect 
              v-model="errand.members" 
              :options="users"
              :multiple="true"
              :searchable="true"
              :custom-label="customLabel"
              track-by="uid"
              placeholder="Select members"
              @update:modelValue="updateMembers"
              class="multiselect-primary"
            >
              <template #tag="{ option, remove }">
                <div class="multiselect-tag bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center space-x-1 hover:bg-primary/20 transition-colors duration-200">
                  <span>{{ option.firstName }} {{ option.lastName }}</span>
                  <button 
                    @click="remove(option)" 
                    class="text-primary hover:text-primary/80 focus:outline-none transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </template>
            </multiselect>
          </div>
          
          <!-- Priority -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Priority</label>
            <multiselect 
              v-model="errand.priority" 
              :options="priorities" 
              :searchable="false" 
              :show-labels="false"
              placeholder="Select priority"
              @update:modelValue="updatePriority"
              class="multiselect-primary"
            />
          </div>
          
          <!-- Tags -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Tags</label>
            <multiselect 
              v-model="errand.stamps" 
              :options="stamps"
              :multiple="true"
              :taggable="true"
              :searchable="true"
              track-by="uid"
              :show-labels="false"
              placeholder="Select or add tags"
              @update:modelValue="updateStamps"
              @tag="addStamp"
              :custom-label="({title}) => (`${title}`)"
              class="multiselect-primary"
            >
              <template #tag="{ option, remove }">
                <div class="multiselect-tag bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center space-x-1 hover:bg-primary/20 transition-colors duration-200">
                  <span>{{ option.title }}</span>
                  <button 
                    @click="remove(option)" 
                    class="text-primary hover:text-primary/80 focus:outline-none transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </template>
            </multiselect>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 2rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

/* Multiselect styling */
:deep(.multiselect-primary) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__tags) {
  @apply border-border bg-background text-foreground rounded-md transition-colors duration-200;
}

:deep(.multiselect-primary .multiselect__tags:focus-within) {
  @apply ring-2 ring-primary ring-offset-2;
}

:deep(.multiselect-primary .multiselect__single) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__input) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__option) {
  @apply bg-background text-foreground hover:bg-muted transition-colors duration-200;
}

:deep(.multiselect-primary .multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}

/* CKEditor styling */
:deep(.ck-editor) {
  @apply border border-border rounded-md transition-colors duration-200;
}

:deep(.ck-editor:focus-within) {
  @apply ring-2 ring-primary ring-offset-2;
}

:deep(.ck-editor__editable) {
  @apply bg-background text-foreground min-h-[200px] p-4;
}

:deep(.ck-toolbar) {
  @apply bg-muted border-border;
}

:deep(.ck-button) {
  @apply text-foreground hover:bg-background transition-colors duration-200;
}

:deep(.ck-button.ck-on) {
  @apply bg-primary text-primary-foreground;
}
</style>