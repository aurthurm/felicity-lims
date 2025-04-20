<script setup lang="ts">
import { onMounted, provide, ref, nextTick, PropType, defineAsyncComponent } from 'vue';
import { DocumentEditorContainerComponent, Toolbar} from '@syncfusion/ej2-vue-documenteditor';
import { DropDownButtonComponent } from "@syncfusion/ej2-vue-splitbuttons";
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import useApiUtil from '@/composables/api_util';
import { EditDocumentVersionMutation, EditDocumentVersionMutationVariables, EditDocumentVersionDocument } from '@/graphql/operations/document.mutations';
import { IDocumentVersion } from '@/models/document';
import { useRouter } from 'vue-router';
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
    <div class="max-w-[99%]" role="region" aria-label="Document editor">
        <header class="bg-card border-b border-border py-3 px-4 flex items-center justify-between">
            <div class="flex items-center">
                <button 
                    @click="goBack" 
                    class="mr-4 text-muted-foreground hover:text-card-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Go back to previous page"
                >
                    <ArrowLeftIcon class="w-5 h-5" aria-hidden="true" />
                </button>
                <h1 class="uppercase text-xl font-semibold text-card-foreground">{{ document?.document?.name }}</h1>
            </div>        
            <div v-if="isSaving" class="text-center" role="status" aria-label="Saving document">
                <fel-loader message="Saving..." />
            </div>
            <div class="flex justify-start items-center gap-x-4">
                <button 
                    v-on:click="printBtnClick" 
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    aria-label="Print document"
                >
                    Print
                </button>
                <DropDownButtonComponent 
                    ref="de-export" 
                    class="bg-primary text-primary-foreground hover:bg-primary/90" 
                    :items="exportItems" 
                    cssClass="e-caret-hide" 
                    content="Download" 
                    v-bind:select="onExport" 
                    :open="openExportDropDown" 
                    aria-label="Download document"
                />
                <button 
                    @click="saveChanges" 
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    aria-label="Save document changes"
                >
                    <span v-show="contentChanged" class="h-2 w-2 rounded-full bg-success animate-pulse" aria-hidden="true"></span>
                    <span class="ml-2">Save</span>
                </button>
            </div>
        </header>
        <DocumentEditorContainerComponent 
            ref="documentEditorContainer"
            :serviceUrl='serviceUrl' 
            :enableToolbar='true'
            :enableWordExport='true'
            :enablePrint='true'
            aria-label="Document editor"
        />
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
        border-color: var(--border) !important;
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

    /* Override Syncfusion styles to match our theme */
    .e-de-tool-ctnr {
        background-color: var(--card) !important;
        border-color: var(--border) !important;
    }

    .e-de-tool-ctnr .e-toolbar-items {
        background-color: var(--card) !important;
        border-color: var(--border) !important;
    }

    .e-de-tool-ctnr .e-toolbar-items .e-toolbar-item button {
        color: var(--card-foreground) !important;
    }

    .e-de-tool-ctnr .e-toolbar-items .e-toolbar-item button:hover {
        background-color: var(--accent) !important;
        color: var(--accent-foreground) !important;
    }

    .e-de-tool-ctnr .e-toolbar-items .e-toolbar-item button:focus {
        outline: 2px solid var(--ring) !important;
        outline-offset: 2px !important;
    }
</style>