<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import { formatDate, getUserInitials, parseDate} from '@/utils/helpers'
import { AddGrindStampDocument, AddGrindStampMutation, AddGrindStampMutationVariables, EditGrindErrandDocument, EditGrindErrandMutation, EditGrindErrandMutationVariables } from '@/graphql/operations/grind.mutations'
import { GetGrindErrandDocument, GetGrindErrandQuery, GetGrindErrandQueryVariables, GetGrindPostersByBoardDocument, GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables, GetGrindStampByCategoryDocument, GetGrindStampByCategoryQuery, GetGrindStampByCategoryQueryVariables } from '@/graphql/operations/grind.queries'
import { IGrindErrand, IGrindPoster, IGrindStamp } from '@/models/grind'
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
import { useRoute } from 'vue-router'
import { GrindUpdateErrandInput } from '@/graphql/schema'
import { IUser } from '@/models/auth'
import { UserAllDocument, UserAllQuery, UserAllQueryVariables } from '@/graphql/operations/_queries'

const ErrandActivity = defineAsyncComponent(() => import("./ErrandActivity.vue"))
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

let errand = ref<IGrindErrand>();
const { withClientQuery, withClientMutation } = useApiUtil()

function getErrand() {
    withClientQuery<GetGrindErrandQuery, GetGrindErrandQueryVariables>(
        GetGrindErrandDocument,
        { uid: errandUid.value },
        'grindErrandByUid'
    ).then((resp: any) => {
        errand.value = resp as IGrindErrand;
        // Handle period
        const startDate = parseDate(errand.value.startDate, true) ?? new Date();
        const endDate = parseDate(errand.value.endDate, true) ?? new Date(new Date().setDate(startDate.getDate() + 7));
        dateRange.value = [startDate, endDate];
    })
}

function updateErrand(payload: Partial<IGrindErrand>) {
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
const posters = ref<IGrindPoster[]>([])
function getPosters() {
  withClientQuery<GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables>(
    GetGrindPostersByBoardDocument,
    { boardUid: boardUid.value },
    "grindPostersByBoard"
  ).then((res) => {
    posters.value = (res as IGrindPoster[]).filter(p => p.uid !== errand.value?.posterUid);
  });
}

function updateStatus (poster: IGrindPoster) {
  updateErrand({ posterUid: poster.uid })
}

// Errand Persons
const users = ref<IUser[]>()
function getUsers() {
  withClientQuery<UserAllQuery, UserAllQueryVariables>(
    UserAllDocument,
    { first: 100 },
    "userAll"
  ).then((res: any) => {
    users.value = res.items as IUser[];
  });
}
function customLabel ({firstName, lastName}) {
  return `${firstName} ${lastName}`
}

function updateAssignee (user: IUser) {
  updateErrand({ assigneeUid: user.uid })
}

function updateReporter (user: IUser) {
  updateErrand({ reporterUid: user.uid })
}

function updateMembers (users: IUser[]) {
  updateErrand({ members: users.map(u => u.uid) as string[] })
}

// Errand Priority
const priorities = ['Low', 'Normal', 'High', 'Critical']
function updatePriority (priority: string) {
  updateErrand({ priority })
}

// Errand Stamps
const stamps = ref<IGrindStamp[]>([])
function getStamps() {
  withClientQuery<GetGrindStampByCategoryQuery, GetGrindStampByCategoryQueryVariables>(
    GetGrindStampByCategoryDocument,
    { category: StampCategory.Project },
    "grindStampByCategory"
  ).then((res) => {
    stamps.value = res as IGrindStamp[];
  });
}
function updateStamps (stamps: IGrindStamp[]) {
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
      const tags = (errand.value?.stamps ?? []) as IGrindStamp[]
      tags.push(resp);
      updateStamps(tags)
    }
  });
}
</script>

<template>
    <div class="bg-white rounded-lg shadow" v-if="errand">

      <!-- Content area with sidebar -->
      <div class="flex flex-col md:flex-row">

        <!-- Main content -->
        <div class="flex-1 p-6 border-r">
            <!-- Header -->
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div class="relative w-full">
                        <h1 
                        v-if="!editingTitle" 
                        @click="startEditingTitle" 
                        class="text-3xl font-bold text-gray-800 cursor-pointer hover:bg-gray-50 rounded"
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
                        class="text-2xl font-semibold text-gray-800 w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div class="mt-4 text-xs flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600">
                        {{ getUserInitials(errand.createdBy?.firstName, errand.createdBy?.lastName) }}
                    </div>
                    by
                    <span class="my-1 font-semibold">{{ errand.createdBy?.firstName }} {{ errand.createdBy?.lastName }}</span>
                    <span class="text-sm text-gray-600">on {{ formatDate(errand.createdAt, 'D MMMM YYYY') }}</span>
                </div>
                
                <div class="mt-6" @click="startEditingBody" v-if="!editingBody">
                    <div v-if="errand.description" class="text-lg text-gray-800" v-html="errand.description"></div>
                </div>
                
                <div class="mt-6" v-else>
                    <div class="main-container min-w-full prose prose-slate">
                        <p>isLayoutReady : {{ isLayoutReady }}</p>
                        <div class="editor-container editor-container_balloon-editor" ref="editorContainerElement">
                            <div class="editor-container__editor">
                            <div ref="editorElement">
                                <ckeditor 
                                v-if="isLayoutReady" 
                                v-model="errand.description" 
                                :editor="editor" 
                                :config="config"
                                tag-name="textarea"/>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 flex gap-2">
                        <button 
                        @click="saveDescription" 
                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                        Save
                        </button>
                        <button 
                        @click="cancelEditing" 
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        >
                        Cancel
                        </button>
                    </div>
                </div>
            </div>
      
            <!-- Progress Bar -->
            <div class="flex justify-start items-center gap-x-2 mt-1" v-show="errand?.milestonesAt">
              <div class="my-2 w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                  <div class="bg-green-600 h-1 rounded-full" :style="`width: ${errand?.milestonesAt}%`"></div>
              </div>
              <span class="text-xs">{{ errand?.milestonesAt }}%</span>
            </div>
            
            <!-- Tabs -->
            <div class="border-b border-gray-200">
                <div class="flex">
                <button 
                    @click="activeTab = 'discussions'" 
                    :class="[
                    'py-3 px-4 text-sm font-medium border-b-2 focus:outline-none',
                    activeTab === 'discussions' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]"
                >
                    Discussions
                </button>
                <button 
                    @click="activeTab = 'milestones'" 
                    :class="[
                    'py-3 px-4 text-sm font-medium border-b-2 focus:outline-none',
                    activeTab === 'milestones' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]"
                >
                    Milestones
                </button>
                <button 
                    @click="activeTab = 'activity'" 
                    :class="[
                    'py-3 px-4 text-sm font-medium border-b-2 focus:outline-none',
                    activeTab === 'activity' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]"
                >
                    Activity Stream
                </button>
                <button 
                    @click="activeTab = 'files'" 
                    :class="[
                    'py-3 px-4 text-sm font-medium border-b-2 focus:outline-none',
                    activeTab === 'files' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                    ]"
                >
                    Files
                </button>
                </div>
            </div>
            
            <!-- Tab Content -->
            <div class="py-4">
                <!-- Discussions Tab -->
                <div v-if="activeTab === 'discussions'" class="space-y-6">
                  <ErrandDiscussion :errandUid="errand.uid" />
                </div>
                
                <!-- Milestones Tab -->
                <div v-if="activeTab === 'milestones'" class="space-y-4">
                  <ErrandMilestone  :errandUid="errand.uid" />
                </div>
                
                <!-- Activity Stream Tab -->
                <div v-if="activeTab === 'activity'" class="space-y-4">
                  <ErrandActivity :errandUid="errand.uid"  />
                </div>
                
                <!-- Files Tab -->
                <div v-if="activeTab === 'files'">
                  <ErrandFile :errandUid="errand.uid"  />
                </div>
            </div>
        </div>
        
        <!-- Sidebar -->
        <div class="w-full md:w-80 p-6">
          <div class="space-y-6">

            <!-- Dates -->
            <VueDatePicker 
            class="z-60" 
            v-model="dateRange" 
            @update:model-value="handleDate"
            range 
            :format="rangeFormat"></VueDatePicker>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <multiselect 
                v-model="errand.poster" 
                :options="posters" 
                label="title" 
                track-by="uid"
                placeholder="Select status"
                @update:modelValue="updateStatus"
              />
            </div>
            
            <!-- Assignee -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <multiselect 
                v-model="errand.assignee" 
                :options="users"
                track-by="uid"
                :searchable="true"
                :custom-label="customLabel"
                placeholder="Select assignee"
                @update:modelValue="updateAssignee"
              >
              </multiselect>
            </div>
            
            <!-- Reporter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
              <multiselect 
                v-model="errand.reporter" 
                :options="users"
                track-by="uid"
                :searchable="true"
                :custom-label="customLabel"
                placeholder="Select reporter"
                @update:modelValue="updateReporter"
              />
            </div>
            
            <!-- Team Members -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
              <multiselect 
                v-model="errand.members" 
                :options="users"
                :multiple="true"
                :searchable="true"
                :custom-label="customLabel"
                track-by="uid"
                placeholder="Select members"
                @update:modelValue="updateMembers"
              >
                <template #tag="{ option, remove }">
                  <div class="multiselect-tag">
                    {{ option.firstName }} {{ option.lastName }}
                    <i class="multiselect-tag-remove" @click="remove(option)">×</i>
                  </div>
                </template>
              </multiselect>
            </div>
            
            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <multiselect 
                v-model="errand.priority" 
                :options="priorities" 
                :searchable="false" 
                :show-labels="false"
                placeholder="Select priority"
                @update:modelValue="updatePriority"
              />
            </div>
            
            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
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
              >
                <template #tag="{ option, remove }">
                  <div class="multiselect-tag">
                    {{ option.title }}
                    <i class="multiselect-tag-remove" @click="remove(option)">×</i>
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

</style>