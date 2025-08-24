<script setup lang="ts">
import { computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useAuditLogStore } from "@/stores/audit_log";
import { parseDate } from "@/utils";

interface Props {
  targetUid?: string;
  targetType?: string;
}

interface ChangeTrail {
  key: string;
  old?: string;
  new?: string;
  raw?: string;
}

const props = withDefaults(defineProps<Props>(), {
  targetUid: undefined,
  targetType: undefined,
});

const { targetType, targetUid } = toRefs(props);

const userStore = useUserStore();
const auditLogStore = useAuditLogStore();
auditLogStore.resetLogs();

const { auditLogs, fetchingAudits } = storeToRefs(auditLogStore);

userStore.fetchUsers({});
auditLogStore.fetchAuditLogs({
  targetType: targetType?.value,
  targetUid: targetUid?.value,
});

const users = computed(() => userStore.getUsers);

function translateUser(userUid: string): string {
  const user = users.value?.find(
    (u) => (u.uid || u.userUid)?.toString() === userUid?.toString()
  );
  return user?.userName || user?.firstName || user?.lastName || "";
}

function translateAction(action: number): string {
  switch (action) {
    case 1:
      return "created";
    case 2:
      return "updated";
    case 3:
      return "deleted";
    default:
      return "";
  }
}

function changes(log: any): ChangeTrail[] {
  const trails = new Set<ChangeTrail>();
  
  // state changes
  Object.entries(log?.stateBefore || {}).forEach(([keyB, valueB]) => {
    Object.entries(log?.stateAfter || {}).forEach(([keyA, valueA]) => {
      if (keyB === keyA && valueB !== valueA) {
        let translatedKey = keyA;
        let translatedValueB = valueB;
        let translatedValueA = valueA;

        // Handle special field translations
        if (keyA === "updated_by_uid") {
          translatedKey = "updated_by";
          translatedValueB = translateUser(valueB as string);
          translatedValueA = translateUser(valueA as string);
        } else if (keyA === "submitted_by_uid") {
          translatedKey = "submitted_by";
          translatedValueB = translateUser(valueB as string);
          translatedValueA = translateUser(valueA as string);
        } else if (keyA === "verified_by_uid") {
          translatedKey = "verified_by";
          translatedValueB = translateUser(valueB as string);
          translatedValueA = translateUser(valueA as string);
        } else if (keyA === "updated_at") {
          translatedKey = "updated_on";
          translatedValueB = parseDate(valueB);
          translatedValueA = parseDate(valueA);
        } else if (keyA === "cancelled_by_uid") {
          translatedKey = "cancelled_by";
          translatedValueB = translateUser(valueB as string);
          translatedValueA = translateUser(valueA as string);
        } else if (keyA === "received_by_uid") {
          translatedKey = "received_by";
          translatedValueB = translateUser(valueB as string);
          translatedValueA = translateUser(valueA as string);
        }

        trails.add({
          key: translatedKey,
          old: translatedValueB != null && typeof translatedValueB === "object"
            ? JSON.stringify(translatedValueB)
            : String(translatedValueB || "None"),
          new: translatedValueA != null && typeof translatedValueA === "object"
            ? JSON.stringify(translatedValueA)
            : String(translatedValueA || "None"),
        });
      }
    });
  });

  // extra context
  Object.entries(log?.extras || {}).forEach(([key, value]) => {
    if (value != null && value !== "") {
      trails.add({
        key: key,
        raw: typeof value === "object" ? JSON.stringify(value) : String(value),
      });
    }
  });

  return Array.from(trails);
}
</script>

<template>
  <div class="relative mt-4" role="log" aria-label="Audit log">
    <div 
      class="border-r-2 border-border border-dotted absolute h-full top-0 z-0" 
      style="left: 7px"
      aria-hidden="true"
    ></div>
    
    <div v-if="fetchingAudits" class="py-4 text-center">
      <fel-loader message="Fetching audit logs ..." />
    </div>
    
    <ul 
      v-motion 
      :initial="{ opacity: 0, y: 100 }" 
      :enter="{ opacity: 1, y: 0, scale: 1 }"
      :variants="{ custom: { scale: 2 } }" 
      :delay="200" 
      class="list-none m-0 p-0 space-y-4"
      v-else
    >
      <li 
        v-for="log in auditLogs" 
        :key="log.uid" 
        class="relative"
      >
        <div class="flex items-center mb-2">
          <div 
            class="bg-accent rounded-full h-4 w-4 border-border border-2 z-10"
            aria-hidden="true"
          ></div>
          <div class="ml-4 font-medium">
            <span class="text-foreground">
              {{ translateUser(log?.userUid) }} 
              <span class="text-primary">{{ translateAction(log?.action) }}</span>
              {{ log?.targetType }}
            </span>
            <span class="text-muted-foreground">
              on {{ parseDate(log?.stateAfter?.updated_at) }}
            </span>
          </div>
        </div>
        
        <div class="ml-12 space-y-2">
          <div 
            v-for="trail of changes(log)" 
            :key="trail.key" 
            class="grid grid-cols-4 gap-2 items-center"
          >
            <span class="col-span-1">
              <span class="text-sm text-muted-foreground">{{ trail?.key }}</span>
            </span>
            <span v-if="trail?.raw" class="col-span-3">
              <span class="text-xs text-muted-secondary">{{ trail?.raw }}</span>
            </span>
            <span v-else
            class="col-span-3 flex items-center gap-2">
              <span class="text-xs text-destructive line-through">{{ trail?.old }}</span>
              <span class="text-xs text-muted-foreground" aria-hidden="true">→</span>
              <span class="text-xs text-primary">{{ trail?.new }}</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
