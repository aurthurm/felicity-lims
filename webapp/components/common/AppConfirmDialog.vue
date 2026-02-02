<script setup lang="ts">
import { computed } from "vue";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useConfirmDialog } from "@/composables/confirm_dialog";

const { state, close } = useConfirmDialog();

const confirmClass = computed(() =>
    cn(buttonVariants({ variant: state.variant }))
);

const handleOpenChange = (open: boolean) => {
    if (!open) {
        close(false);
        return;
    }
    state.open = open;
};
</script>

<template>
    <AlertDialog :open="state.open" @update:open="handleOpenChange">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle v-if="state.title">
                    {{ state.title }}
                </AlertDialogTitle>
                <AlertDialogDescription v-if="state.description" class="whitespace-pre-line">
                    {{ state.description }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel v-if="state.showCancel" @click="close(false)">
                    {{ state.cancelText || 'Cancel' }}
                </AlertDialogCancel>
                <AlertDialogAction :class="confirmClass" @click="close(true)">
                    {{ state.confirmText || 'Confirm' }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
