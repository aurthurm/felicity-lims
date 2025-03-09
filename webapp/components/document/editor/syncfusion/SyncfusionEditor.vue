<script setup lang="ts">
import { onMounted, provide, ref, nextTick, PropType, defineAsyncComponent } from 'vue';
import { DocumentEditorContainerComponent, Toolbar} from '@syncfusion/ej2-vue-documenteditor';
import { DropDownButtonComponent } from "@syncfusion/ej2-vue-splitbuttons";
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import useApiUtil from '@/composables/api_util';
import { EditDocumentVersionMutation, EditDocumentVersionMutationVariables, EditDocumentVersionDocument } from '@/graphql/operations/document.mutations';
import { IDocumentVersion } from '@/models/document';
import { useRouter } from 'vue-router';
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const props = defineProps({
  document: {
    type: Object as PropType<IDocumentVersion>,
    required: true
  }
})

const exportItems = [
    { text: 'Syncfusion® Document Text (*.sfdt)', id: 'sfdt' },
    { text: 'Word Document (*.docx)', id: 'word' },
    { text: 'Word Template (*.dotx)', id: 'dotx' },
    { text: 'Plain Text (*.txt)', id: 'txt' },
];

const serviceUrl = 'http://localhost:6002/api/documenteditor/';
const documentEditorContainer = ref<any>(null);
const contentChanged = ref(false)
const isSaving = ref(false);
const { withClientMutation } = useApiUtil()

provide('DocumentEditorContainer', [Toolbar]);

onMounted(() => { 
    nextTick(function () {
        var obj = documentEditorContainer.value?.ej2Instances.documentEditor;
        
        // Open the default document
        try {
            if(props.document.content) {
                obj.open(JSON.parse(props.document.content));
            }
        } catch (error) {
            console.log(error)
        }
        obj.documentName = 'Toolbar Customization';

        // Load document
        // documentEditorContainer.value.open("place here");

        // Enable additional settings
        documentEditorContainer.value.ej2Instances.documentEditorSettings.showRuler = true;
        
        // Set toolbar items
        const tools = documentEditorContainer.value?.ej2Instances?.toolbarItems as string[]
        const exclude = [
            "New", "Bookmark", "LocalClipboard", "RestrictEditing", "FormFields",
            "UpdateFields", "ContentControl", "XML Mapping"
        ]
        documentEditorContainer.value.ej2Instances.toolbarItems = tools.filter(t => exclude.includes(t) == false)
        
        // Autosave
        documentEditorContainer.value.ej2Instances.contentChange = () => {
            contentChanged.value = true;
        };
        setInterval(() => {
            if (contentChanged.value) {
                saveChanges()
            }
        }, 15000);
    });
});

const updateDocument = (content) => {
    isSaving.value = true;
    withClientMutation<EditDocumentVersionMutation,EditDocumentVersionMutationVariables>(
    EditDocumentVersionDocument, {
        uid: props.document.uid!,
        payload: { content }
    }, "updateDocumentVersion"
    )
    .then(() => {}).finally(() => {
        isSaving.value = false;
        contentChanged.value = false;
    })
}

const saveChanges = () => {
    // documentEditorContainer.value.ej2Instances.documentEditor.saveAsBlob('Docx').then((blob) => {
    //     //Now, save the document where ever you want.
    //     const blb = JSON.stringify(blob)
    //     // updateDocument(blb)
    //     console.log(blb)
    // });

    const sfdt = documentEditorContainer.value.ej2Instances.documentEditor.serialize()
    updateDocument(JSON.stringify(sfdt))

    // let url = documentEditorContainer.value.ej2Instances.documentEditor.serviceUrl + 'ExportSFDT';
    // let http = new XMLHttpRequest();
    // http.open('POST', url);
    // http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    // http.responseType = 'json';
    // let sfdt2 = {Content: sfdt, Filename: "sisonke", Format: '.Html'}
    // http.onload = function () {
    //     if (http.status === 200) {

    //     } else {
    //         console.error('Request failed with status:', http.status);
    //     }
    // };
    // http.send(JSON.stringify(sfdt2));

}

function printBtnClick() {
    documentEditorContainer.value.ej2Instances.documentEditor.print();
}

function onExport(args) {
    switch (args.item.id) {
        case 'word':
            saveDoc('Docx');
            break;
        case 'sfdt':
            saveDoc('Sfdt');
            break;
        case 'txt':
            saveDoc('Txt');
            break;
        case 'dotx':
            saveDoc('Dotx');
            break;
    }
}

function saveDoc(format) {
    // tslint:disable-next-line:max-line-length
    documentEditorContainer.value.ej2Instances.documentEditor.save("title here", format);
}

function openExportDropDown() {
    // tslint:disable-next-line:max-line-length
    (document as any).getElementById('word').setAttribute('title', 'Download a copy of this document to your computer as a DOCX file.');
    // tslint:disable-next-line:max-line-length
    (document as any).getElementById('sfdt').setAttribute('title', 'Download a copy of this document to your computer as an SFDT file.');
    // tslint:disable-next-line:max-line-length
    (document as any).getElementById('txt').setAttribute('title', 'Download a copy of this document to your computer as a TXT file.');
    // tslint:disable-next-line:max-line-length
    (document as any).getElementById('dotx').setAttribute('title', 'Download a copy of this document to your computer as a DOTX file.');
}

// https://ej2.syncfusion.com/vue/demos
// Go back to dashboard
const router = useRouter()
const goBack = () => router.back();
</script>

<template>
    <div class="max-w-[99%]">
        <header class="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
            <div class="flex items-center">
                <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon class="w-5 h-5" />
                </button>
                <h1 class="uppercase text-xl font-semibold text-gray-800">{{ document?.document?.name }}</h1>
            </div>        
            <div v-if="isSaving" class="text-center">
                <LoadingMessage message="Saving..." />
            </div>
            <div class="flex justify-start items-center gap-x-8">
                <button v-on:click="printBtnClick" title="Print this document (Ctrl+P).">Print</button>
                <DropDownButtonComponent ref="de-export" class="bg-sky-700" :items="exportItems" cssClass="e-caret-hide" content="Download" v-bind:select="onExport" :open="openExportDropDown" title="Download this document."></DropDownButtonComponent>
                <button @click="saveChanges" title="Save changes" class="flex items-center">
                    <span v-show="contentChanged" class="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                    <span class="ml-2">Save</span>
                </button>
        
            </div>
        </header>
        <DocumentEditorContainerComponent 
        ref="documentEditorContainer"
        :serviceUrl='serviceUrl' 
        :enableToolbar='true'
        :enableWordExport='true'
        :enablePrint='true'> </DocumentEditorContainerComponent>
    </div>
  </template>
  
  
  <style>
    @import '../../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-lists/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
    @import '../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
    @import "../../../../../node_modules/@syncfusion/ej2-vue-documenteditor/styles/material.css";
    .e-de-tool-ctnr-properties-pane {
        min-height: 700px !important;
    }

    [contenteditable="true"].single-line {
        white-space: nowrap;
        border-color: #e4e4e4 !important;
    }

    [class^="e-de-icon-"],
    [class*=" e-de-icon-"] {
        font-family: 'Sample brower icons' !important;
    }

    .e-de-icon-Print:before {
        content: "\e723";
    }

    .e-de-icon-Download:before {
        content: "\e728";
    }
  </style>